import uuid
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Extra


class Bundle(BaseModel):
    id: Optional[uuid.UUID] = None
    creator_uid: str
    title: str
    subtitle: Optional[str] = ""
    description: Optional[str] = ""
    tags: List[str] = []
    cover: str
    carousel: List[str] = []
    format: List[str] = ['figma']
    created_at: datetime
    purchase_price: Optional[float] = 10.0
    deleted: bool = False


class BundleInDB(Bundle, extra=Extra.allow):
    bundle_url: str
