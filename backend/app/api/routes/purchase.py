import json
import uuid
from datetime import datetime

import httpx
from databases import Database
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from wechatpayv3 import WeChatPayType

from ...config import COINS_PRICE_PER_BUNDLE, PAY_AliPay_GATEWAY
from ...db.connect import get_db
from ...db.core import (
    create_purchase_by_coins,
    create_purchase_order,
    get_bundle_by_id,
    get_purchase_order,
    update_user_field_by_uid,
)
from ...models import PurchaseByCoins, PurchaseOrder, User
from ...utils.order import generate_order_id
from ...utils.pay.alipay import alipay
from ...utils.pay.wechat import wxpay
from .auth import get_current_enabled_user

purchase_router = r = APIRouter()


@r.post("/purchase")
async def purchase(
    bundle_id: uuid.UUID,
    option: str,
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    if option not in ["wechat", "alipay"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="支付方式不支持")

    bundle = await get_bundle_by_id(db, bundle_id)
    order_id = generate_order_id()
    amount = bundle.purchase_price

    if option == "wechat":
        code, message = wxpay.pay(
            description=f'purchase_bundle_{bundle_id}',
            out_trade_no=order_id,
            amount={'total': int(amount)},  # 单位：分
            pay_type=WeChatPayType.NATIVE,
            attach=json.dumps({'type': 'purchase', 'referrer_uid': None}),
        )

        if code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail=json.loads(message).get('message', '发起微信购买二维码请求失败')
            )

        code_url = json.loads(message).get('code_url')

    elif option == "alipay":
        order_string = alipay.api_alipay_trade_page_pay(
            subject=f'purchase_bundle_{bundle_id}',
            out_trade_no=order_id,
            total_amount=amount / 100,
            body=json.dumps({'type': 'purchase', 'referrer_uid': None}),
            qr_pay_mode=4,
            qrcode_width=200,
        )
        code_url = f'{PAY_AliPay_GATEWAY}?{order_string}'

        async with httpx.AsyncClient(follow_redirects=True) as alipay_client:
            r = await alipay_client.get(code_url)

        if r.status_code != 200:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="发起支付宝购买二维码请求失败")

        code_url = str(r.url)

    order = await create_purchase_order(
        db,
        PurchaseOrder(
            id=order_id,
            created_at=datetime.now().replace(microsecond=0),
            status="pending",
            amount=amount,
            bundle_id=bundle_id,
            user_uid=current_user.uid,
        ),
    )
    order.code_url = code_url

    return order


@r.get("/purchase/status")
async def get_purchase_order_status(
    order_id: str, db: Database = Depends(get_db), current_user: User = Depends(get_current_enabled_user)
):
    order = await get_purchase_order(db, order_id)

    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="订单不存在")

    if order.user_uid != current_user.uid:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="无权查看订单")

    return order.status


@r.post("/purchase/coins")
async def purchase_by_coins(
    bundle_id: uuid.UUID,
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    await get_bundle_by_id(db, bundle_id)

    if current_user.coins < COINS_PRICE_PER_BUNDLE:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="下载币不足")

    purchase = await create_purchase_by_coins(
        db,
        PurchaseByCoins(
            coins_used=COINS_PRICE_PER_BUNDLE,
            purchased_at=datetime.now().replace(microsecond=0),
            bundle_id=bundle_id,
            user_uid=current_user.uid,
        ),
    )

    current_user.coins -= COINS_PRICE_PER_BUNDLE
    await update_user_field_by_uid(db, current_user.uid, {"coins": current_user.coins})

    return purchase
