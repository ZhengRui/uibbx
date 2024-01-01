import uuid
from datetime import datetime

from databases import Database
from fastapi import APIRouter, Depends, HTTPException, status

from ...config import COINS_PRICE_PER_BUNDLE
from ...db.connect import get_db
from ...db.core import (
    create_purchase_by_coins,
    create_purchase_order,
    get_bundle_by_id,
    update_user_field_by_uid,
)
from ...models import PurchaseByCoins, PurchaseOrder, User
from ...utils.order import generate_order_id
from .auth import get_current_enabled_user

purchase_router = r = APIRouter()


@r.post("/purchase")
async def purchase(
    bundle_id: uuid.UUID,
    db: Database = Depends(get_db),
    current_user: User = Depends(get_current_enabled_user),
):
    bundle = await get_bundle_by_id(db, bundle_id)
    order_id = generate_order_id()

    order = await create_purchase_order(
        db,
        PurchaseOrder(
            id=order_id,
            created_at=datetime.now().replace(microsecond=0),
            status="pending",
            amount=bundle.purchase_price,
            bundle_id=bundle_id,
            user_uid=current_user.uid,
        ),
    )

    return order


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
