"""Initial migration - create users, resumes, analyses tables

Revision ID: 001_initial
Revises: 
Create Date: 2024-01-01 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Users table
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("username", sa.String(50), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, default=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)
    op.create_index(op.f("ix_users_username"), "users", ["username"], unique=True)

    # Resumes table
    op.create_table(
        "resumes",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("filename", sa.String(255), nullable=False),
        sa.Column("original_filename", sa.String(255), nullable=False),
        sa.Column("file_path", sa.String(500), nullable=False),
        sa.Column("file_type", sa.String(10), nullable=False),
        sa.Column("extracted_text", sa.Text(), nullable=True),
        sa.Column(
            "uploaded_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_resumes_id"), "resumes", ["id"], unique=False)

    # Analyses table
    op.create_table(
        "analyses",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("resume_id", sa.Integer(), nullable=False),
        sa.Column("job_title", sa.String(255), nullable=True),
        sa.Column("job_description", sa.Text(), nullable=False),
        sa.Column("ats_score", sa.Float(), nullable=False),
        sa.Column("keyword_score", sa.Float(), nullable=True),
        sa.Column("skill_score", sa.Float(), nullable=True),
        sa.Column("experience_score", sa.Float(), nullable=True),
        sa.Column("formatting_score", sa.Float(), nullable=True),
        sa.Column("matched_keywords", postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column("missing_keywords", postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column("all_job_keywords", postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column("matched_skills", postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column("missing_skills", postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column("ai_feedback", postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column("improved_bullets", postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column("strengths", postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column("weaknesses", postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["resume_id"], ["resumes.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_analyses_id"), "analyses", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_analyses_id"), table_name="analyses")
    op.drop_table("analyses")
    op.drop_index(op.f("ix_resumes_id"), table_name="resumes")
    op.drop_table("resumes")
    op.drop_index(op.f("ix_users_username"), table_name="users")
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_index(op.f("ix_users_id"), table_name="users")
    op.drop_table("users")
