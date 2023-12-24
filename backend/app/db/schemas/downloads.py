from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from ..base import Base


class DownloadsTable(Base):
    __tablename__ = "downloads"

    id = Column("id", Integer, primary_key=True)
    downloaded_at = Column("downloaded_at", DateTime(timezone=True), nullable=False)

    bundle_id = Column("bundle_id", UUID(as_uuid=True), ForeignKey('bundles.id'))
    user_uid = Column("user_uid", String(32), ForeignKey('users.uid'))

    bundle = relationship("BundlesTable", backref="downloads")
    user = relationship("UsersTable", backref="downloads")
