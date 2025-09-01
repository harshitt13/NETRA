import os
import pandas as pd
from neo4j import GraphDatabase
from dotenv import load_dotenv

load_dotenv()

# --- Configuration ---
NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "password")
DATA_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'generated-data')

def run_cypher_query(driver, query, records, batch_size=1000):
    """Helper to run queries in batches."""
    with driver.session() as session:
        for i in range(0, len(records), batch_size):
            batch = records[i:i+batch_size]
            session.run(query, {"records": batch})
            print(f"  ...processed {min(i + batch_size, len(records))}/{len(records)} records.")

def main():
    print("--- Starting Neo4j Data Loading Script ---")
    
    try:
        driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
        driver.verify_connectivity()
        print("Successfully connected to Neo4j.")
    except Exception as e:
        print(f"ERROR: Could not connect to Neo4j. Aborting. Details: {e}")
        return

    # 1. Clear existing data for a clean import
    print("\n[STEP 1/5] Clearing existing database...")
    with driver.session() as session:
        session.run("MATCH (n) DETACH DELETE n")
    print("  Database cleared.")

    # 2. Load Persons
    print("\n[STEP 2/5] Loading Persons...")
    persons_df = pd.read_csv(os.path.join(DATA_DIR, 'Persons.csv'))
    persons_records = persons_df.to_dict('records')
    query = """
    UNWIND $records AS record
    CREATE (p:Person {
        person_id: record.person_id,
        full_name: record.full_name,
        dob: record.dob,
        pan_number: record.pan_number,
        address: record.address,
        monthly_salary_inr: record.monthly_salary_inr,
        tax_filing_status: record.tax_filing_status
    })
    """
    run_cypher_query(driver, query, persons_records)

    # 3. Load Companies
    print("\n[STEP 3/5] Loading Companies...")
    companies_df = pd.read_csv(os.path.join(DATA_DIR, 'Companies.csv'))
    companies_records = companies_df.to_dict('records')
    query = """
    UNWIND $records AS record
    CREATE (c:Company {
        cin: record.cin,
        company_name: record.company_name,
        incorporation_date: record.incorporation_date,
        paid_up_capital_inr: record.paid_up_capital_inr
    })
    """
    run_cypher_query(driver, query, companies_records)
    
    # 4. Load Bank Accounts and ownership relationships
    print("\n[STEP 4/5] Loading Bank Accounts and relationships...")
    accounts_df = pd.read_csv(os.path.join(DATA_DIR, 'BankAccounts.csv'))
    accounts_records = accounts_df.to_dict('records')
    query_nodes = "UNWIND $records AS r CREATE (b:BankAccount {account_number: r.account_number})"
    run_cypher_query(driver, query_nodes, accounts_records)
    
    query_rels = """
    UNWIND $records AS r
    MATCH (b:BankAccount {account_number: r.account_number})
    OPTIONAL MATCH (p:Person {person_id: r.owner_id})
    OPTIONAL MATCH (c:Company {cin: r.owner_id})
    FOREACH (ignore IN CASE WHEN p IS NOT NULL THEN [1] ELSE [] END | MERGE (p)-[:OWNS_ACCOUNT]->(b))
    FOREACH (ignore IN CASE WHEN c IS NOT NULL THEN [1] ELSE [] END | MERGE (c)-[:OWNS_ACCOUNT]->(b))
    """
    run_cypher_query(driver, query_rels, accounts_records, batch_size=500)

    # 5. Load Transactions
    print("\n[STEP 5/5] Loading Transactions...")
    transactions_df = pd.read_csv(os.path.join(DATA_DIR, 'Transactions.csv'))
    
    # --- THIS IS THE FIX ---
    # Convert the timestamp string to the ISO 8601 format that Neo4j's datetime() function expects.
    transactions_df['timestamp'] = transactions_df['timestamp'].str.replace(' ', 'T')
    
    transactions_records = transactions_df.to_dict('records')
    query = """
    UNWIND $records AS r
    MATCH (from_acc:BankAccount {account_number: r.from_account})
    MATCH (to_acc:BankAccount {account_number: r.to_account})
    CREATE (from_acc)-[:TRANSACTION {
        transaction_id: r.transaction_id,
        amount_inr: r.amount_inr,
        timestamp: datetime(r.timestamp),
        payment_mode: r.payment_mode
    }]->(to_acc)
    """
    run_cypher_query(driver, query, transactions_records)

    driver.close()
    print("\n--- Neo4j Data Loading Complete! ---")

if __name__ == "__main__":
    main()

