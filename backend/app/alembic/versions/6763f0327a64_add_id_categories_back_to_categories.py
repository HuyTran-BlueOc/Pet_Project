"""Add id_categories back to categories

Revision ID: 6763f0327a64
Revises: 1efa93c8a088
Create Date: 2024-12-20 13:50:06.225877

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = '6763f0327a64'
down_revision = '1efa93c8a088'
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
