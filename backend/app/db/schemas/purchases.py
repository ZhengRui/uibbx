from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from ..base import Base


class PurchasesTable(Base):
    __tablename__ = "purchases"

    id = Column("id", Integer, primary_key=True)
    amount = Column("amount", Float, nullable=False)
    purchased_at = Column("purchased_at", DateTime(timezone=True), nullable=False)

    order_id = Column("order_id", String(32), ForeignKey('purchase_orders.id'))

    bundle_id = Column("bundle_id", UUID(as_uuid=True), ForeignKey('bundles.id'))
    user_uid = Column("user_uid", String(32), ForeignKey('users.uid'))

    bundle = relationship("BundlesTable", backref="purchases")
    user = relationship("UsersTable", backref="purchases")


class PurchaseOrdersTable(Base):
    __tablename__ = 'purchase_orders'

    id = Column("id", String(32), primary_key=True)
    created_at = Column("created_at", DateTime(timezone=True), nullable=False)
    status = Column("status", String(16), nullable=False)

    amount = Column("amount", Float, nullable=False)

    bundle_id = Column("bundle_id", UUID(as_uuid=True), ForeignKey('bundles.id'))
    user_uid = Column("user_uid", String(32), ForeignKey('users.uid'))

    bundle = relationship("BundlesTable", backref="purchase_orders")
    user = relationship("UsersTable", backref="purchase_orders")


class PurchasesByCoinsTable(Base):
    __tablename__ = "purchases_by_coins"

    id = Column("id", Integer, primary_key=True)
    coins_used = Column("coins_used", Integer, nullable=False)
    purchased_at = Column("purchased_at", DateTime(timezone=True), nullable=False)

    bundle_id = Column("bundle_id", UUID(as_uuid=True), ForeignKey('bundles.id'))
    user_uid = Column("user_uid", String(32), ForeignKey('users.uid'))

    bundle = relationship("BundlesTable", backref="purchases_by_coins")
    user = relationship("UsersTable", backref="purchases_by_coins")
