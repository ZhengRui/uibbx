"""add bundle_url field to bundles table

Revision ID: bd8286c8ecee
Revises: c7d2c269ff67
Create Date: 2023-12-18 22:56:51.539910

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bd8286c8ecee'
down_revision: Union[str, None] = 'c7d2c269ff67'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('bundles', sa.Column('bundle_url', sa.Text(), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('bundles', 'bundle_url')
    # ### end Alembic commands ###
