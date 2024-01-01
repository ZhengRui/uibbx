from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class User(BaseModel):
    uid: Optional[str] = None
    cellnum: Optional[str] = ""
    email: Optional[str] = ""
    wxid: Optional[str] = ""
    username: Optional[str] = ""
    nickname: Optional[str] = "设计师小小"
    description: Optional[str] = ""
    verified: bool
    disabled: bool
    avatar: Optional[str] = ""
    created_at: datetime
    username_confirmed: bool
    coins: Optional[int] = 0
    subscription: Optional[str] = None
    next_billing_at: Optional[datetime] = None


class UserInDB(User):
    hashed_password: str
