import uuid

from cassandra.cqlengine import columns
from django_cassandra_engine.models import DjangoCassandraModel


class Message(DjangoCassandraModel):
    id = columns.UUID(default=uuid.uuid4)
    name = columns.Text(required=True)
    room = columns.Text(primary_key=True, partition_key=True)
    content = columns.Text(primary_key=True, required=True)
    date_added = columns.DateTime(clustering_order="DESC")

    class Meta:
        ordering = ("date_added",)
        get_pk_field = "room"
