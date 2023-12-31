import uuid
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Extra


class Bundle(BaseModel, extra=Extra.allow):
    id: Optional[uuid.UUID] = None
    creator_uid: str
    title: str
    subtitle: Optional[str] = ""
    description: Optional[str] = ""
    tags: List[str] = []
    cover: str
    carousel: List[str] = []
    format: str
    created_at: datetime
    purchase_price: Optional[float] = 10.0


class BundleInDB(Bundle):
    bundle_url: str
