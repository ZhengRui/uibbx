import json
from datetime import datetime, timedelta
from enum import Enum

from databases import Database
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from starlette.requests import Request

from ...config import SECRET_KEY
from ...db.connect import get_db
from ...db.core import (
    create_purchase,
    create_refer,
    create_subscription,
    get_purchase_by_order_id,
    get_purchase_order,
    get_subscription_by_order_id,
    get_subscription_order,
    get_user_by_field,
    set_purchase_order_status,
    set_subscription_order_status,
    update_user_field_by_uid,
)
from ...models import Purchase, Refer, Subscription
from ...utils.pay.alipay import alipay
from ...utils.pay.wechat import wxpay
from .auth import verify_access_token
from .subscription import tiers

payment_notify_router = r = APIRouter()


class OrderType(str, Enum):
    subscription = 'subscription'
    purchase = 'purchase'


@r.post("/payment_notify/wechat")
async def payment_notify_wechat(request: Request, db: Database = Depends(get_db)):
    headers = {
        'Wechatpay-Signature': request.headers.get('wechatpay-signature'),
        'Wechatpay-Timestamp': request.headers.get('wechatpay-timestamp'),
        'Wechatpay-Nonce': request.headers.get('wechatpay-nonce'),
        'Wechatpay-Serial': request.headers.get('wechatpay-serial'),
    }

    result = wxpay.callback(headers=headers, body=await request.body())

    if result and result.get('event_type') == 'TRANSACTION.SUCCESS':
        res = result.get('resource')
        order_id = res.get('out_trade_no')
        amount = res.get('amount').get('total')  # 单位：分
        attach = json.loads(res.get('attach'))
        order_type = attach.get('type')
        referrer_uid = attach.get('referrer_uid')

        await notify(db, order_id, order_type, amount, referrer_uid)
    else:
        return JSONResponse(status_code=500, content={"detail": "微信支付回调失败"})


@r.post("/payment_notify/alipay")
async def payment_notify_alipay(request: Request, db: Database = Depends(get_db)):
    async with request.form() as form:
        data = dict(form)
        signature = data.pop("sign")

        success = alipay.verify(data, signature)
        if success and data["trade_status"] in ("TRADE_SUCCESS", "TRADE_FINISHED"):
            order_id = data["out_trade_no"]
            amount = float(data["total_amount"]) * 100
            body = json.loads(data["body"])
            order_type = body['type']
            referrer_uid = body['referrer_uid']

            await notify(db, order_id, order_type, amount, referrer_uid)
        else:
            return JSONResponse(status_code=500, content={"detail": "微信支付回调失败"})


async def notify(
    db: Database, order_id: str, order_type: OrderType, amount: float, referrer_uid: str, referrer_bundle_id: str = None
):
    succeed = True

    if order_type == 'subscription':
        order = await get_subscription_order(db, order_id)

        if not order:
            return JSONResponse(status_code=404, content={"detail": "订阅订单不存在"})

        if order.status == 'succeed':
            subscription = await get_subscription_by_order_id(db, order_id)
            return JSONResponse(status_code=200, content={"detail": "已订阅成功", "订阅订单号": order.id, "订阅号": subscription.id})

        if order.amount != amount:
            return JSONResponse(status_code=400, content={"detail": "订阅订单金额不匹配"})

        if succeed:
            now = datetime.now().replace(microsecond=0)
            next_billing_at = now + timedelta(days=tiers[order.after]['days'])

            subscription = await create_subscription(
                db,
                Subscription(
                    before=order.before,
                    after=order.after,
                    amount=order.amount,
                    subscribed_at=now,
                    next_billing_at=next_billing_at,
                    order_id=order.id,
                    user_uid=order.user_uid,
                ),
            )
            await update_user_field_by_uid(
                db, order.user_uid, {'subscription': order.after, 'next_billing_at': next_billing_at}
            )
            await set_subscription_order_status(db, order_id, 'succeed')

            if referrer_uid:
                try:
                    referrer = await get_user_by_field(
                        db, field_name="uid", field_value=referrer_uid, only_check_existence=True
                    )
                    if referrer:
                        coins_gained = tiers[order.after]['refer_coins'] - (
                            0 if order.before == 'none' else tiers[order.before]['refer_coins']
                        )

                        await create_refer(
                            db,
                            Refer(
                                referrer_uid=referrer.uid,
                                referent_uid=order.user_uid,
                                bundle_id=referrer_bundle_id,
                                refer_type=f"subscription:{order.before}->{order.after}",
                                referred_at=now,
                                coins_gained=coins_gained,
                            ),
                        )

                        await update_user_field_by_uid(db, referrer.uid, {"coins": referrer.coins + coins_gained})

                except Exception:
                    pass

            return subscription
        else:
            await set_subscription_order_status(db, order_id, 'failed')
            return JSONResponse(status_code=200, content={"detail": "订阅失败", "订阅订单号": order.id})

    if order_type == 'purchase':
        order = await get_purchase_order(db, order_id)

        if not order:
            return JSONResponse(status_code=404, content={"detail": "购买订单不存在"})

        if order.status == 'succeed':
            purchase = await get_purchase_by_order_id(db, order_id)
            return JSONResponse(status_code=200, content={"detail": "已购买成功", "购买订单号": order.id, "购买号": purchase.id})

        if order.amount != amount:
            return JSONResponse(status_code=400, content={"detail": "购买订单金额不匹配"})

        if succeed:
            now = datetime.now().replace(microsecond=0)

            purchase = await create_purchase(
                db,
                Purchase(
                    amount=order.amount,
                    purchased_at=now,
                    order_id=order.id,
                    bundle_id=order.bundle_id,
                    user_uid=order.user_uid,
                ),
            )
            await set_purchase_order_status(db, order_id, 'succeed')

            return purchase

        else:
            await set_purchase_order_status(db, order_id, 'failed')
            return JSONResponse(status_code=200, content={"detail": "购买失败", "购买订单号": order.id})
