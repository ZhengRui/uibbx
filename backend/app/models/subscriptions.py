from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class Subscription(BaseModel):
    id: Optional[int] = None
    before: str
    after: str
    amount: float
    subscribed_at: datetime
    next_billing_at: datetime
    order_id: str
    user_uid: str


class SubscriptionOrder(BaseModel):
    id: str
    created_at: datetime
    status: str
    before: str
    before_next_billing_at: Optional[datetime] = None
    after: str
    amount: float
    user_uid: str
