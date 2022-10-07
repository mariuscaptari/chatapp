import uuid
from cassandra.cqlengine import columns
from django_cassandra_engine.models import DjangoCassandraModel

class Message(DjangoCassandraModel):
    message_id = columns.UUID(default=uuid.uuid4)
    room = columns.Text(primary_key=True, partition_key=True)
    username = columns.Text(required=True)
    content = columns.Text(required=True)
    date_added = columns.TimeUUID(primary_key=True, clustering_order="DESC")
    # date_added = columns.DateTime()

    class Meta:
        ordering = ('date_added',)
        get_pk_field='room'
