"""Add id back to categories

Revision ID: 163b4964aef8
Revises: 6763f0327a64
Create Date: 2024-12-20 13:52:57.337442

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel.sql.sqltypes


# revision identifiers, used by Alembic.
revision = '163b4964aef8'
down_revision = '6763f0327a64'
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
