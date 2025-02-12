"""add description to user table

Revision ID: bbcd44a8800d
Revises: 19df7cd0ee28
Create Date: 2023-12-29 17:29:26.540114

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bbcd44a8800d'
down_revision: Union[str, None] = '19df7cd0ee28'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('description', sa.Text(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'description')
    # ### end Alembic commands ###
