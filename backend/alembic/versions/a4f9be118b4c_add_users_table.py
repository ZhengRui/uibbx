"""add users table

Revision ID: a4f9be118b4c
Revises: 
Create Date: 2023-12-12 11:33:14.837669

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a4f9be118b4c'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('uid', sa.String(length=32), nullable=False),
    sa.Column('cellnum', sa.String(length=50), nullable=True),
    sa.Column('email', sa.String(length=50), nullable=True),
    sa.Column('wxid', sa.String(length=50), nullable=True),
    sa.Column('username', sa.String(length=50), nullable=False),
    sa.Column('hashed_password', sa.String(length=100), nullable=True),
    sa.Column('verified', sa.Boolean(), nullable=False),
    sa.Column('disabled', sa.Boolean(), nullable=False),
    sa.Column('avatar', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('username_confirmed', sa.Boolean(), nullable=False),
    sa.PrimaryKeyConstraint('uid'),
    sa.UniqueConstraint('username')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('users')
    # ### end Alembic commands ###
