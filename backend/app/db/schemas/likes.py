from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from ..base import Base


class LikesTable(Base):
    __tablename__ = "likes"

    id = Column("id", Integer, primary_key=True)
    liked_at = Column("liked_at", DateTime(timezone=True), nullable=False)

    bundle_id = Column("bundle_id", UUID(as_uuid=True), ForeignKey('bundles.id'))
    user_uid = Column("user_uid", String(32), ForeignKey('users.uid'))

    bundle = relationship("BundlesTable", backref="likes")
    user = relationship("UsersTable", backref="likes")
