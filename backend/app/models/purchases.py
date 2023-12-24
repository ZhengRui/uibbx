import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class Purchase(BaseModel):
    id: Optional[int] = None
    amount: float
    purchased_at: datetime
    order_id: str

    bundle_id: uuid.UUID
    user_uid: str


class PurchaseOrder(BaseModel):
    id: str
    created_at: datetime
    status: str

    amount: float

    bundle_id: uuid.UUID
    user_uid: str
