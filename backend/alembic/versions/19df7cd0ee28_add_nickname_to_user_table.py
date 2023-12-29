"""add nickname to user table

Revision ID: 19df7cd0ee28
Revises: 5a3f4b43d3da
Create Date: 2023-12-29 14:49:02.557513

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '19df7cd0ee28'
down_revision: Union[str, None] = '5a3f4b43d3da'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('nickname', sa.String(length=50), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'nickname')
    # ### end Alembic commands ###
