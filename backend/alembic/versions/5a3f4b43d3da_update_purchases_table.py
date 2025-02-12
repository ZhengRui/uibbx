"""update purchases table

Revision ID: 5a3f4b43d3da
Revises: 6cf4c3eadc8b
Create Date: 2023-12-24 17:05:45.676780

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5a3f4b43d3da'
down_revision: Union[str, None] = '6cf4c3eadc8b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('purchases_order_id_fkey', 'purchases', type_='foreignkey')
    op.create_foreign_key(None, 'purchases', 'purchase_orders', ['order_id'], ['id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'purchases', type_='foreignkey')
    op.create_foreign_key('purchases_order_id_fkey', 'purchases', 'subscription_orders', ['order_id'], ['id'])
    # ### end Alembic commands ###
