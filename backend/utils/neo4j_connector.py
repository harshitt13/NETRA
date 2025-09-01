import os
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv()

class Neo4jConnection:
    _driver = None

    def __init__(self):
        raise RuntimeError("Call get_driver() or close_driver() as class methods")

    @classmethod
    def get_driver(cls):
        if cls._driver is None:
            uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
            user = os.getenv("NEO4J_USER", "neo4j")
            password = os.getenv("NEO4J_PASSWORD", "password")
            try:
                cls._driver = GraphDatabase.driver(uri, auth=(user, password))
                cls._driver.verify_connectivity()
                print("Successfully initialized and connected to Neo4j.")
            except Exception as e:
                print(f"FATAL: Could not create Neo4j driver. Please check credentials and connection. Details: {e}")
                cls._driver = None
        return cls._driver

    @classmethod
    def close_driver(cls):
        if cls._driver is not None:
            cls._driver.close()
            cls._driver = None
            print("Neo4j driver connection closed.")

def get_neo4j_driver():
    return Neo4jConnection.get_driver()

def close_neo4j_driver():
    Neo4jConnection.close_driver()

if __name__ == '__main__':
    print("Running Neo4j Connector in standalone mode for testing...")
    driver = get_neo4j_driver()
    if driver:
        print("Driver instance retrieved successfully.")
        try:
            with driver.session() as session:
                result = session.run("RETURN 'Connection Test Successful' AS message")
                record = result.single()
                print(f"Test query result from Neo4j: '{record['message']}'")
        except Exception as e:
            print(f"An error occurred during the test query: {e}")
        finally:
            close_neo4j_driver()
    else:
        print("Failed to retrieve Neo4j driver instance. Please check your setup.")
