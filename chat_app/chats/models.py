from cassandra.cqlengine import columns
from django_cassandra_engine.models import DjangoCassandraModel


class Message(DjangoCassandraModel):
    id = columns.TimeUUID(primary_key=True, clustering_order="DESC")
    name = columns.Text(required=True)
    room = columns.Text(primary_key=True, partition_key=True)
    content = columns.Text(required=True, custom_index=True)
    date_added = columns.DateTime()

    class Meta:
        get_pk_field = "room"
