import uuid
from django.db import models


class BaseModel(models.Model):
    """
    Abstract base model with UUID primary key and timestamp fields.

    All models inheriting from this will have:
    - id: UUID primary key
    - created_at: timestamp when object was created
    - updated_at: timestamp when object was last modified
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for this record"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp when this record was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when this record was last updated"
    )

    class Meta:
        abstract = True
        ordering = ['-created_at']
