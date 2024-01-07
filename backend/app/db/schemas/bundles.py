import uuid

from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import relationship

from ..base import Base


class BundlesTable(Base):
    __tablename__ = "bundles"

    id = Column("id", UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column("title", String(256), nullable=False)
    subtitle = Column("subtitle", String(256), nullable=True)
    description = Column("description", Text, nullable=True)
    tags = Column("tags", ARRAY(String(64)), nullable=True)
    cover = Column("cover", Text, nullable=True)
    carousel = Column("carousel", ARRAY(Text), nullable=True)
    bundle_url = Column("bundle_url", Text, nullable=False)
    format = Column("format", ARRAY(String(32)), nullable=False)
    created_at = Column("created_at", DateTime(timezone=True), nullable=False)
    purchase_price = Column("purchase_price", Float, nullable=True)
    deleted = Column("deleted", Boolean, nullable=False, default=False)

    creator_uid = Column("creator_uid", String(32), ForeignKey('users.uid'))
    creator = relationship("UsersTable", backref="bundles")
