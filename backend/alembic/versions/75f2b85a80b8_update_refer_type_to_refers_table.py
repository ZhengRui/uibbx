"""update refer_type to refers table

Revision ID: 75f2b85a80b8
Revises: b6477f54f3da
Create Date: 2024-01-01 22:54:31.627267

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '75f2b85a80b8'
down_revision: Union[str, None] = 'b6477f54f3da'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('refers', 'refer_type',
               existing_type=sa.VARCHAR(length=32),
               type_=sa.String(length=96),
               existing_nullable=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('refers', 'refer_type',
               existing_type=sa.String(length=96),
               type_=sa.VARCHAR(length=32),
               existing_nullable=False)
    # ### end Alembic commands ###
