from datetime import datetime

from databases import Database
from fastapi import APIRouter, Depends, HTTPException, status

from ...db.connect import get_db
from ...db.core import create_subscription_order
from ...models import SubscriptionOrder, User
from ...utils.order import generate_order_id
from .auth import get_current_enabled_user

subscription_router = r = APIRouter()

tiers = {
    "month": {
        "tier": 1,
        "price": 100,
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
        "price": 300,
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
        "price": 1000,
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
            1,
        )
    else:
        amount = tiers[tier]['price']

    # send transaction request to different platforms
    order_id = generate_order_id()

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

    return order


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
                1,
            ),
        }
        for tier in tiers
    ]
