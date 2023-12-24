from datetime import datetime, timedelta
from enum import Enum

from databases import Database
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from ...db.connect import get_db
from ...db.core import (
    create_purchase,
    create_subscription,
    get_purchase_by_order_id,
    get_purchase_order,
    get_subscription_by_order_id,
    get_subscription_order,
    set_purchase_order_status,
    set_subscription_order_status,
    update_user_field_by_uid,
)
from ...models import Purchase, Subscription
from .subscription import tiers

payment_notify_router = r = APIRouter()


class OrderType(str, Enum):
    subscription = 'subscription'
    purchase = 'purchase'


@r.post("/payment_notify")
async def payment_notify(order_id: str, order_type: OrderType, succeed: bool, db: Database = Depends(get_db)):
    # receive transaction result from different platforms
    # succeed = True

    if order_type == 'subscription':
        order = await get_subscription_order(db, order_id)

        if not order:
            return JSONResponse(status_code=404, content={"detail": "订阅订单不存在"})

        if order.status == 'succeed':
            subscription = await get_subscription_by_order_id(db, order_id)
            return JSONResponse(status_code=200, content={"detail": "已订阅成功", "订阅订单号": order.id, "订阅号": subscription.id})

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
