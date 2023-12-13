from sqlalchemy import Column, DateTime, Integer, String

from ..base import Base


class VerificationCodesTable(Base):
    __tablename__ = 'verification_codes'

    cid = Column("cid", String(64), primary_key=True)
    code = Column("code", String(32), nullable=False)
    life = Column("life", Integer, nullable=False)
    created_at = Column("created_at", DateTime(timezone=True), nullable=False)
