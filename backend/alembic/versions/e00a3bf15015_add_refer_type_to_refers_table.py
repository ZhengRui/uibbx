"""add refer_type to refers table

Revision ID: e00a3bf15015
Revises: ad92599fba72
Create Date: 2024-01-01 21:17:19.966845

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e00a3bf15015'
down_revision: Union[str, None] = 'ad92599fba72'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('refers', sa.Column('refer_type', sa.String(length=16), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('refers', 'refer_type')
    # ### end Alembic commands ###
