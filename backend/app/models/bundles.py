import uuid
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class Bundle(BaseModel):
    id: Optional[uuid.UUID] = None
    title: str
    subtitle: Optional[str] = ""
    description: Optional[str] = ""
    tags: List[str] = []
    cover: str
    carousel: List[str] = []
    format: str
    created_at: datetime
    creator_uid: str
    creator_username: Optional[str] = ""


class BundleInDB(Bundle):
    bundle_url: str
