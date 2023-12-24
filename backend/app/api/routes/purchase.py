import uuid
from datetime import datetime

from databases import Database
from fastapi import APIRouter, Depends

from ...db.connect import get_db
from ...db.core import create_purchase_order, get_bundle_by_id
from ...models import PurchaseOrder, User
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
