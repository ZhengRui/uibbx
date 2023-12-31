from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text

from ..base import Base


class UsersTable(Base):
    __tablename__ = "users"

    uid = Column("uid", String(32), primary_key=True)
    cellnum = Column("cellnum", String(50))
    email = Column("email", String(50))
    wxid = Column("wxid", String(50))
    username = Column("username", String(50), unique=True, nullable=False)
    nickname = Column("nickname", String(50))
    description = Column("description", Text)
    hashed_password = Column("hashed_password", String(100))
    verified = Column("verified", Boolean, nullable=False)
    disabled = Column("disabled", Boolean, nullable=False)
    avatar = Column("avatar", Text)
    created_at = Column("created_at", DateTime(timezone=True), nullable=False)
    username_confirmed = Column("username_confirmed", Boolean, nullable=False)
    coins = Column("coins", Integer, nullable=False, default=0)

    subscription = Column("subscription", String(16), nullable=True)
    next_billing_at = Column("next_billing_at", DateTime(timezone=True), nullable=True)
