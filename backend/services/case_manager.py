# import firebase_admin
# from firebase_admin import credentials, firestore
# from datetime import datetime, timezone

# class CaseManager:
#     """
#     Handles all interactions with the Firestore database for managing investigation cases.
#     """
#     def __init__(self):
#         """
#         Initializes the connection to the Firestore database.
#         """
#         # This assumes firebase_admin was already initialized in auth.py
#         # If running standalone, you would initialize it here.
#         if not firebase_admin._apps:
#              raise Exception("Firebase Admin SDK not initialized. Please ensure auth.py runs first.")
#         self.db = firestore.client()
#         print("CaseManager initialized and connected to Firestore.")

#     def create_case(self, case_data):
#         """
#         Creates a new investigation case document in Firestore.
#         The person_id is used as the document ID for easy retrieval.

#         Args:
#             case_data (dict): A dictionary containing all investigation details
#                               (person_id, risk_profile, ai_summary, etc.).

#         Returns:
#             str: The ID of the created case document.
#         """
#         try:
#             # The person_id will be the unique ID for the case document
#             case_id = case_data.get('person_id')
#             if not case_id:
#                 raise ValueError("person_id is missing from case data.")

#             # Add server-side metadata to the case
#             case_data['createdAt'] = datetime.now(timezone.utc)
#             case_data['status'] = 'Open' # Initial status
            
#             # Get a reference to the document and set the data
#             case_ref = self.db.collection('cases').document(case_id)
#             case_ref.set(case_data)
            
#             print(f"Successfully created case {case_id} in Firestore.")
#             return case_id
#         except Exception as e:
#             print(f"ERROR creating case in Firestore: {e}")
#             # Re-raise the exception so the API endpoint can handle it
#             raise

#     def get_case(self, case_id):
#         """
#         Retrieves a specific case document from Firestore.

#         Args:
#             case_id (str): The ID of the case to retrieve.

#         Returns:
#             dict or None: The case data as a dictionary, or None if not found.
#         """
#         try:
#             case_ref = self.db.collection('cases').document(case_id)
#             doc = case_ref.get()

#             if doc.exists:
#                 return doc.to_dict()
#             else:
#                 return None
#         except Exception as e:
#             print(f"ERROR retrieving case {case_id} from Firestore: {e}")
#             raise


import os
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

class CaseManager:
    """
    Manages all interactions with the Firestore database for investigation cases.
    """
    def __init__(self):
        try:
            # Path to your service account key file
            key_path = os.path.join(os.path.dirname(__file__), '..', 'serviceAccountKey.json')
            cred = credentials.Certificate(key_path)
            
            # Check if the app is already initialized
            if not firebase_admin._apps:
                firebase_admin.initialize_app(cred)
            
            self.db = firestore.client()
            print("CaseManager initialized and connected to Firestore.")
        except Exception as e:
            print(f"ERROR: Failed to initialize Firestore. Details: {e}")
            self.db = None

    def create_case(self, case_data):
        """Creates a new case document in Firestore using the person_id as the document ID."""
        if not self.db: return None
        try:
            case_id = case_data.get('person_id')
            if not case_id:
                raise ValueError("person_id is missing from case data.")
            
            # Add a server timestamp for when the case was created
            case_data['createdAt'] = firestore.SERVER_TIMESTAMP
            
            case_ref = self.db.collection('cases').document(case_id)
            case_ref.set(case_data)
            return case_id
        except Exception as e:
            print(f"ERROR: Could not create case in Firestore. Details: {e}")
            return None

    def get_case(self, case_id):
        """Retrieves a single case document from Firestore."""
        if not self.db: return None
        try:
            case_ref = self.db.collection('cases').document(case_id)
            case = case_ref.get()
            if case.exists:
                return case.to_dict()
            else:
                return None
        except Exception as e:
            print(f"ERROR: Could not retrieve case {case_id} from Firestore. Details: {e}")
            return None

    # --- THIS IS THE NEW METHOD ---
    def get_all_cases(self):
        """Retrieves all case documents from the 'cases' collection for the reporting page."""
        if not self.db: return []
        try:
            cases_ref = self.db.collection('cases').stream()
            cases = []
            for case in cases_ref:
                case_data = case.to_dict()
                # Format the data to match what the frontend table expects
                cases.append({
                    'caseId': case.id,
                    'subject': case_data.get('risk_profile', {}).get('person_details', {}).get('full_name', 'N/A'),
                    'riskScore': case_data.get('risk_profile', {}).get('final_risk_score', 0),
                    'status': 'Ready for Reporting', # This can be a dynamic field later
                    'conclusionDate': case_data.get('createdAt').strftime('%Y-%m-%d') if case_data.get('createdAt') else 'N/A',
                })
            return cases
        except Exception as e:
            print(f"ERROR: Could not retrieve all cases from Firestore. Details: {e}")
            return []

