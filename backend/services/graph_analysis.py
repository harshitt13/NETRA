import os
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv()

class GraphAnalyzer:
    def __init__(self):
        uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
        user = os.getenv("NEO4J_USER", "neo4j")
        password = os.getenv("NEO4J_PASSWORD", "password")
        
        try:
            self._driver = GraphDatabase.driver(uri, auth=(user, password))
            self._driver.verify_connectivity()
            print("Successfully connected to Neo4j.")
        except Exception as e:
            print(f"ERROR: Could not connect to Neo4j. Details: {e}")
            self._driver = None

    def close(self):
        if self._driver is not None:
            self._driver.close()

    def get_transaction_network(self, entity_id, limit=100): # Increased limit for more data
        if self._driver is None:
            return {"nodes": [], "edges": []}
            
        with self._driver.session() as session:
            query = """
            MATCH (entity)
            WHERE entity.person_id = $entity_id OR entity.cin = $entity_id
            MATCH (entity)-[:OWNS_ACCOUNT]->(account)
            MATCH (account)-[tx:TRANSACTION]-(peer_account)
            MATCH (peer_entity)-[:OWNS_ACCOUNT]->(peer_account)
            WHERE id(entity) <> id(peer_entity)
            RETURN
                coalesce(entity.person_id, entity.cin) AS sourceId,
                coalesce(entity.full_name, entity.company_name) AS sourceName,
                labels(entity)[0] AS sourceType,
                
                coalesce(peer_entity.person_id, peer_entity.cin) AS targetId,
                coalesce(peer_entity.full_name, peer_entity.company_name) AS targetName,
                labels(peer_entity)[0] AS targetType,
                
                tx.amount_inr AS amount,
                // --- THIS IS THE FIX: Explicitly return directionality ---
                startNode(tx) = account AS isOutgoing
            ORDER BY tx.timestamp DESC
            LIMIT $limit
            """
            results = session.run(query, entity_id=entity_id, limit=limit)
            
            nodes = {}
            edges = []
            
            for record in results:
                source_id = record["sourceId"]
                if source_id not in nodes:
                    nodes[source_id] = {
                        "id": source_id, "label": record["sourceName"], 
                        "type": record["sourceType"], "isCenter": True
                    }
                
                target_id = record["targetId"]
                if target_id not in nodes:
                    nodes[target_id] = {
                        "id": target_id, "label": record["targetName"], 
                        "type": record["targetType"], "isCenter": False
                    }
                
                is_outgoing = record["isOutgoing"]
                
                edges.append({
                    "source": source_id, # Always from the center for this model
                    "target": target_id,
                    "label": f"₹{int(record['amount']):,}",
                    "isOutgoing": is_outgoing # Add the direction flag
                })
            
            return {"nodes": list(nodes.values()), "edges": edges}
