"""Add id_categories back to categories

Revision ID: 1efa93c8a088
Revises: 9600f4b3ca67
Create Date: 2024-12-20 13:48:15.221825

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = '1efa93c8a088'
down_revision = '9600f4b3ca67'
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
