from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from ..base import Base


class SubscriptionsTable(Base):
    __tablename__ = "subscriptions"

    id = Column("id", Integer, primary_key=True)
    before = Column("before", String(16), nullable=False)
    after = Column("after", String(16), nullable=False)
    amount = Column("amount", Float, nullable=False)
    subscribed_at = Column("subscribed_at", DateTime(timezone=True), nullable=False)
    next_billing_at = Column("next_billing_at", DateTime(timezone=True), nullable=False)

    order_id = Column("order_id", String(32), ForeignKey('subscription_orders.id'))

    user_uid = Column("user_uid", String(32), ForeignKey('users.uid'))
    user = relationship("UsersTable", backref="subscriptions")


class SubscriptionOrdersTable(Base):
    __tablename__ = 'subscription_orders'

    id = Column("id", String(32), primary_key=True)
    created_at = Column("created_at", DateTime(timezone=True), nullable=False)
    status = Column("status", String(16), nullable=False)

    before = Column("before", String(16), nullable=False)
    before_next_billing_at = Column("before_next_billing_at", DateTime(timezone=True), nullable=True)
    after = Column("after", String(16), nullable=False)
    amount = Column("amount", Float, nullable=False)

    user_uid = Column("user_uid", String(32), ForeignKey('users.uid'))
    user = relationship("UsersTable", backref="subscription_orders")
