from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from ..base import Base


class RefersTable(Base):
    __tablename__ = "refers"

    id = Column("id", Integer, primary_key=True)

    referrer_uid = Column("referrer_uid", String(32), ForeignKey('users.uid'), nullable=False)
    referent_uid = Column("referent_uid", String(32), ForeignKey('users.uid'), nullable=False)
    bundle_id = Column("bundle_id", UUID(as_uuid=True), ForeignKey('bundles.id'))
    referred_at = Column("referred_at", DateTime(timezone=True), nullable=False)
    refer_type = Column("refer_type", String(96), nullable=False)
    coins_gained = Column("coins_gained", Integer, nullable=False)

    referrer = relationship("UsersTable", foreign_keys=[referrer_uid], backref="refers_as_referrer")
    referent = relationship("UsersTable", foreign_keys=[referent_uid], backref="refers_as_referent")
    bundle = relationship("BundlesTable", backref="refers")
