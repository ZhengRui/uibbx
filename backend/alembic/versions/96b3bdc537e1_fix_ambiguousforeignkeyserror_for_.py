"""fix AmbiguousForeignKeysError for refers table

Revision ID: 96b3bdc537e1
Revises: 7c109f50fa28
Create Date: 2024-01-01 03:56:42.836348

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '96b3bdc537e1'
down_revision: Union[str, None] = '7c109f50fa28'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###
