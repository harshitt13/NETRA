import pandas as pd
import os

class DataLoader:
    def __init__(self, data_path='./generated-data/'):
        self.data_path = data_path
        self.datasets = {}
        self.file_names = {
            "persons": "Persons.csv",
            "accounts": "BankAccounts.csv",
            "transactions": "Transactions.csv",
            "companies": "Companies.csv",
            "directorships": "Directorships.csv",
            "properties": "Properties.csv",
            "cases": "PoliceCases.csv",
            "alerts": "AlertScores.csv"
        }

    def load_all_data(self):
        print("--- Starting Data Loading Process ---")
        for key, file_name in self.file_names.items():
            full_path = os.path.join(self.data_path, file_name)
            try:
                self.datasets[key] = pd.read_csv(full_path)
                print(f"[SUCCESS] Loaded '{file_name}' into memory.")
            except FileNotFoundError:
                print(f"[ERROR] File not found: '{full_path}'. Cannot load '{key}' dataset.")
                self.datasets[key] = None
        print("--- Data Loading Process Finished ---")
        return self.datasets

    def get_data(self, key):
        return self.datasets.get(key)

if __name__ == '__main__':
    print("Running DataLoader in standalone mode for testing...")
    
    loader = DataLoader(data_path='./generated-data/')
    all_data = loader.load_all_data()
    
    print("\n--- Verifying Loaded Data ---")
    all_loaded = True
    for name, df in all_data.items():
        if df is not None:
            print(f"Dataset '{name}': {df.shape[0]} rows, {df.shape[1]} columns. Preview:")
            print(df.head(2))
            print("-" * 30)
        else:
            all_loaded = False
            print(f"Dataset '{name}': FAILED TO LOAD.")

    if not all_loaded:
        print("\nWARNING: Some datasets failed to load.")
        print("Please ensure you have run 'data-generation/generate_data.py' first.")
    else:
        print("\nAll datasets loaded successfully.")
