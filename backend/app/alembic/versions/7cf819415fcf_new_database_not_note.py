"""new database not note 

Revision ID: 7cf819415fcf
Revises: 3d22b51f91cc
Create Date: 2024-12-29 11:24:07.192154

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7cf819415fcf'
down_revision: Union[str, None] = '3d22b51f91cc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('notes')
    op.drop_column('task', 'notes_id')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('task', sa.Column('notes_id', sa.UUID(), autoincrement=False, nullable=True))
    op.create_table('notes',
    sa.Column('title', sa.VARCHAR(length=255), autoincrement=False, nullable=False),
    sa.Column('description', sa.VARCHAR(length=255), autoincrement=False, nullable=True),
    sa.Column('id', sa.UUID(), autoincrement=False, nullable=False),
    sa.Column('task_id', sa.UUID(), autoincrement=False, nullable=False),
    sa.Column('owner_id', sa.UUID(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['owner_id'], ['user.id'], name='notes_owner_id_fkey', ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['task_id'], ['task.id'], name='notes_task_id_fkey', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name='notes_pkey')
    )
    # ### end Alembic commands ###
