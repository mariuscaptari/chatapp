from cassandra.auth import PlainTextAuthProvider
from cassandra.cluster import Cluster

print("CREATING INDEX IN CASSANDRA TABLE")

auth_provider = PlainTextAuthProvider(username="cassandra", password="cassandra")

cluster = Cluster(["cassandra"], auth_provider=auth_provider)
session = cluster.connect()
session.execute(
    """CREATE CUSTOM INDEX IF NOT EXISTS idx_content ON db.message (content)
USING 'org.apache.cassandra.index.sasi.SASIIndex'
WITH OPTIONS = {
'mode': 'CONTAINS',
'analyzer_class': 'org.apache.cassandra.index.sasi.analyzer.NonTokenizingAnalyzer',
'case_sensitive': 'false'};
"""
)
