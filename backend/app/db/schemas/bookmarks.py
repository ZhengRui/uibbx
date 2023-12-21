from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from ..base import Base


class BookmarksTable(Base):
    __tablename__ = "bookmarks"

    id = Column("id", Integer, primary_key=True)
    bookmarked_at = Column("bookmarked_at", DateTime(timezone=True), nullable=False)

    bundle_id = Column("bundle_id", UUID(as_uuid=True), ForeignKey('bundles.id'))
    user_uid = Column("user_uid", String(32), ForeignKey('users.uid'))

    bundle = relationship("BundlesTable", backref="bookmarks")
    user = relationship("UsersTable", backref="bookmarks")
