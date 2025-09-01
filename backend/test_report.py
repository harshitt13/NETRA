#!/usr/bin/env python3
"""
Test script to debug PDF report generation issues
"""

import os
import sys
sys.path.append(os.path.dirname(__file__))

# Test the report generator directly
from services.report_generator import ReportGenerator
from utils.data_loader import DataLoader

def test_report_generation():
    print("Starting PDF report generation test...")
    
    try:
        # Load data
        print("Loading data...")
        DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'generated-data')
        data_loader = DataLoader(data_path=DATA_PATH)
        all_datasets = data_loader.load_all_data()
        
        print(f"Loaded datasets: {list(all_datasets.keys())}")
        
        # Initialize report generator
        print("Initializing report generator...")
        report_generator = ReportGenerator(all_datasets)
        
        # Test with a sample person_id
        persons_df = all_datasets.get('persons')
        if persons_df is not None and not persons_df.empty:
            sample_person_id = persons_df.iloc[0]['person_id']
            print(f"Testing with person_id: {sample_person_id}")
            
            # Mock risk details and summary
            mock_risk_details = {
                'final_risk_score': 75,
                'breakdown': {
                    'salary_mismatch': {'score': 30, 'label': 'Salary-Property Mismatch'},
                    'transaction_patterns': {'score': 25, 'label': 'Suspicious Transactions'},
                    'network_analysis': {'score': 20, 'label': 'High-Risk Network'}
                }
            }
            
            mock_summary = "Test individual shows elevated risk due to property ownership patterns inconsistent with declared income sources."
            
            # Generate the report
            print("Generating PDF report...")
            pdf_path = report_generator.generate_pdf(sample_person_id, mock_risk_details, mock_summary)
            
            if pdf_path and os.path.exists(pdf_path):
                print(f"✅ SUCCESS: PDF generated successfully at {pdf_path}")
                print(f"File size: {os.path.getsize(pdf_path)} bytes")
                return True
            else:
                print("❌ FAILED: PDF file was not created")
                return False
        else:
            print("❌ ERROR: No persons data found")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        import traceback
        print(f"Full traceback:\n{traceback.format_exc()}")
        return False

if __name__ == "__main__":
    success = test_report_generation()
    sys.exit(0 if success else 1)
