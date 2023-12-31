from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from ..base import Base


class RefersTable(Base):
    __tablename__ = "refers"

    id = Column("id", Integer, primary_key=True)

    referrer_uid = Column("referrer_uid", String(32), ForeignKey('users.uid'))
    referent_uid = Column("referent_uid", String(32), ForeignKey('users.uid'))
    bundle_id = Column("bundle_id", UUID(as_uuid=True), ForeignKey('bundles.id'), nullable=True)
    referred_at = Column("referred_at", DateTime(timezone=True), nullable=False)
    coins_gained = Column("coins_gained", Integer, nullable=False)

    referrer = relationship("UsersTable", backref="refers")
    referent = relationship("UsersTable", backref="refers")
    bundle = relationship("BundlesTable", backref="refers")
