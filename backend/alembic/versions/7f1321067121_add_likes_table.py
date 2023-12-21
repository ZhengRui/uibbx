"""add likes table

Revision ID: 7f1321067121
Revises: bd8286c8ecee
Create Date: 2023-12-21 21:07:21.009042

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '7f1321067121'
down_revision: Union[str, None] = 'bd8286c8ecee'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('likes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('liked_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('bundle_id', postgresql.UUID(as_uuid=True), nullable=True),
    sa.Column('user_uid', sa.String(length=32), nullable=True),
    sa.ForeignKeyConstraint(['bundle_id'], ['bundles.id'], ),
    sa.ForeignKeyConstraint(['user_uid'], ['users.uid'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('likes')
    # ### end Alembic commands ###
