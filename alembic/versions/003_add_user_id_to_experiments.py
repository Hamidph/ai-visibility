"""Add user_id to experiments table

Revision ID: 003
Revises: 002
Create Date: 2025-12-31 14:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '003'
down_revision: Union[str, None] = '002'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """
    Add user_id foreign key to experiments table.

    This is a CRITICAL security fix - experiments must be associated with users
    for proper authorization and billing attribution.
    """
    # Add user_id column (nullable initially for existing data)
    op.add_column(
        'experiments',
        sa.Column(
            'user_id',
            postgresql.UUID(as_uuid=True),
            nullable=True,  # Start as nullable for existing experiments
            comment='User who created this experiment'
        )
    )

    # Create foreign key constraint
    op.create_foreign_key(
        'fk_experiments_user_id',
        'experiments',
        'users',
        ['user_id'],
        ['id'],
        ondelete='CASCADE'  # Delete experiments when user is deleted
    )

    # Create index for efficient user-based queries
    op.create_index(
        'ix_experiments_user_id',
        'experiments',
        ['user_id']
    )

    # Create composite index for common query pattern (user + status)
    op.create_index(
        'ix_experiments_user_status',
        'experiments',
        ['user_id', 'status']
    )

    # Create composite index for user + created_at (for sorting user's experiments)
    op.create_index(
        'ix_experiments_user_created',
        'experiments',
        ['user_id', 'created_at']
    )

    # Note: In production, you would need to:
    # 1. Backfill existing experiments with a default user_id, OR
    # 2. Delete existing experiments without users, OR
    # 3. Keep user_id nullable and handle None in application logic
    #
    # For a fresh deployment, we can make it NOT NULL:
    # After backfilling, uncomment the following:
    # op.alter_column('experiments', 'user_id', nullable=False)


def downgrade() -> None:
    """Remove user_id column and related indexes."""
    op.drop_index('ix_experiments_user_created', table_name='experiments')
    op.drop_index('ix_experiments_user_status', table_name='experiments')
    op.drop_index('ix_experiments_user_id', table_name='experiments')
    op.drop_constraint('fk_experiments_user_id', 'experiments', type_='foreignkey')
    op.drop_column('experiments', 'user_id')
