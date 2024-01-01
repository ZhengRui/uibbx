import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class Refer(BaseModel):
    id: Optional[int] = None

    referrer_uid: str
    referent_uid: str
    bundle_id: Optional[uuid.UUID] = None
    refer_type: str
    referred_at: datetime
    coins_gained: int
