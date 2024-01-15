import json
from datetime import datetime

import httpx
from databases import Database
from fastapi import APIRouter, Depends, Form, HTTPException, status
from wechatpayv3 import WeChatPayType

from ...config import COINS_PRICE_PER_BUNDLE, SECRET_KEY, PAY_AliPay_GATEWAY
from ...db.connect import get_db
from ...db.core import (
    create_subscription_order,
    get_subscription_order,
    get_subscriptions_of_user,
)
from ...models import SubscriptionOrder, User
from ...utils.order import generate_order_id
from ...utils.pay.alipay import alipay
from ...utils.pay.wechat import wxpay
from .auth import get_current_enabled_user, verify_access_token

subscription_router = r = APIRouter()

tiers = {
    "month": {
        "tier": 1,
        "price": 10,
        "days": 30,
        "limits": 2,
        "detail": {
            "title": "个人计划",
            "subtitle": "",
            "subsubtitle": "包月30天",
            "features": ["每天可下载10次", "访问所有产品", "访问未来新品", "专属客服，及时响应"],
        },
        "refer_coins": 10,
    },
    "quarter": {
        "tier": 2,
        "price": 30,
        "days": 90,
        "limits": 4,
        "detail": {
            "title": "专业计划",
            "subtitle": "",
            "subsubtitle": "包季90天",
            "features": ["每天可下载20次", "访问所有产品", "访问未来新品", "专属客服，及时响应"],
        },
        "refer_coins": 20,
    },
    "ultra": {
        "tier": 3,
        "price": 100,
        "days": 100000,
        "limits": 4,
        "detail": {
            "title": "精英计划",
            "subtitle": "",
            "subsubtitle": "永久",
            "features": ["每天可下载30次", "访问所有产品", "访问未来新品", "专属客服，及时响应", "即时开通，终身可用"],
        },
        "refer_coins": 30,
    },
}


@r.post("/subscription")
async def subscribe(
    tier: str,
    option: str,
    refer_token: str = Form(None),
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    if tier not in tiers:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE, detail='订阅级别错误', headers={'WWW-Authenticate': 'Bearer'}
        )

    # calculate amount to pay
    now = datetime.now().replace(microsecond=0)
    cur_sub = current_user.subscription

    if cur_sub is not None:
        # last subscription expired
        now_offset_aware = now.astimezone(current_user.next_billing_at.tzinfo)
        if current_user.next_billing_at < now_offset_aware:
            cur_sub = None

    if cur_sub is not None:
        if tiers[cur_sub]['tier'] > tiers[tier]['tier']:
            raise HTTPException(
                status_code=status.HTTP_406_NOT_ACCEPTABLE, detail='订阅降级错误', headers={'WWW-Authenticate': 'Bearer'}
            )

        if tiers[cur_sub]['tier'] == tiers[tier]['tier']:
            raise HTTPException(
                status_code=status.HTTP_406_NOT_ACCEPTABLE, detail='订阅平级错误', headers={'WWW-Authenticate': 'Bearer'}
            )

        now_offset_aware = now.astimezone(current_user.next_billing_at.tzinfo)
        amount = round(
            tiers[tier]['price']
            - tiers[cur_sub]['price'] * (current_user.next_billing_at - now_offset_aware).days / tiers[cur_sub]['days'],
            0,
        )
    else:
        amount = tiers[tier]['price']

    # send transaction request to different platforms
    order_id = generate_order_id()

    # check if referred
    referrer_uid = None
    if refer_token:
        try:
            payload = verify_access_token(refer_token, f"{SECRET_KEY}/REFER")
            referrer_uid = payload['referrer_uid']
        except Exception:
            pass

    if option == "wechat":
        code, message = wxpay.pay(
            description=f'subscription_{tier}',
            out_trade_no=order_id,
            amount={'total': int(amount)},  # 单位：分
            pay_type=WeChatPayType.NATIVE,
            attach=json.dumps({'type': 'subscription', 'referrer_uid': referrer_uid}),
        )

        if code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail=json.loads(message).get('message', '发起微信订阅二维码请求失败')
            )

        code_url = json.loads(message).get('code_url')

    elif option == "alipay":
        order_string = alipay.api_alipay_trade_page_pay(
            subject=f'subscription_{tier}',
            out_trade_no=order_id,
            total_amount=amount / 100,
            body=json.dumps({'type': 'subscription', 'referrer_uid': referrer_uid}),
            qr_pay_mode=4,
            qrcode_width=200,
        )
        code_url = f'{PAY_AliPay_GATEWAY}?{order_string}'

        async with httpx.AsyncClient(follow_redirects=True) as alipay_client:
            r = await alipay_client.get(code_url)

        if r.status_code != 200:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="发起支付宝订阅二维码请求失败")

        code_url = str(r.url)

    # dump order to db
    order = await create_subscription_order(
        db,
        SubscriptionOrder(
            id=order_id,
            created_at=now,
            status='pending',
            before=cur_sub or 'none',
            before_next_billing_at=current_user.next_billing_at,
            after=tier,
            amount=amount,
            user_uid=current_user.uid,
        ),
    )
    order.code_url = code_url

    return order


@r.get("/subscription/status")
async def get_subscription_order_status(
    order_id: str, db: Database = Depends(get_db), current_user: User = Depends(get_current_enabled_user)
):
    order = await get_subscription_order(db, order_id)

    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="订单不存在")

    if order.user_uid != current_user.uid:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="无权查看订单")

    return order.status


@r.get('/subscription/options')
async def get_subscription_options(
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    now = datetime.now().replace(microsecond=0)
    cur_sub = current_user.subscription

    if cur_sub is not None:
        # last subscription expired
        now_offset_aware = now.astimezone(current_user.next_billing_at.tzinfo)
        if current_user.next_billing_at < now_offset_aware:
            cur_sub = None

    return [
        {
            **tiers[tier]['detail'],
            'tier': tier,
            'price': tiers[tier]['price'],
            'subscribed': cur_sub == tier,
            'subscriptable': cur_sub is None or tiers[cur_sub]['tier'] < tiers[tier]['tier'],
            'subscribe_price': tiers[tier]['price']
            if cur_sub is None
            else 0
            if tiers[cur_sub]['tier'] >= tiers[tier]['tier']
            else round(
                tiers[tier]['price']
                - tiers[cur_sub]['price']
                * (current_user.next_billing_at - now_offset_aware).days
                / tiers[cur_sub]['days'],
                0,
            ),
        }
        for tier in tiers
    ]


@r.get('/subscription/all')
async def get_subscriptions_all(
    offset: int = 0,
    limit: int = 10,
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    subscriptions = await get_subscriptions_of_user(db, current_user.uid, offset, limit)

    for subscription in subscriptions:
        before = subscription.before
        subscription.before = tiers.get(before, {'detail': {'title': '无'}}).get('detail').get('title')
        after = subscription.after
        subscription.after = tiers.get(after).get('detail').get('title')

    return subscriptions
