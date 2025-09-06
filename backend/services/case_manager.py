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
import json
import base64
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

class CaseManager:
    """
    Manages all interactions with the Firestore database for investigation cases.
    """
    def __init__(self):
        self.db = None
        self._local_cases_path = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', 'generated-data', 'cases_local.json'))
        try:
            cred = None

            # Prefer credentials from environment for cloud deployments
            env_creds = os.getenv('FIREBASE_CREDENTIALS')
            creds_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
            local_key_path = os.path.normpath(os.path.join(os.path.dirname(__file__), '..', 'serviceAccountKey.json'))

            if env_creds:
                try:
                    # Accept either raw JSON or base64-encoded JSON
                    if env_creds.strip().startswith('{'):
                        cred_dict = json.loads(env_creds)
                    else:
                        decoded = base64.b64decode(env_creds)
                        cred_dict = json.loads(decoded)
                    cred = credentials.Certificate(cred_dict)
                except Exception as e:
                    print(f"WARN: Failed to parse FIREBASE_CREDENTIALS. Details: {e}")
            elif creds_path and os.path.exists(creds_path):
                cred = credentials.Certificate(creds_path)
            elif os.path.exists(local_key_path):
                cred = credentials.Certificate(local_key_path)

            if not firebase_admin._apps:
                if cred is not None:
                    firebase_admin.initialize_app(cred)
                else:
                    # Initialize default app if ADC available; may still fail later
                    firebase_admin.initialize_app()

            # If app is initialized, obtain Firestore client
            if firebase_admin._apps:
                self.db = firestore.client()
                print("CaseManager initialized. Firestore client is available." if self.db else "CaseManager initialized without Firestore client.")
        except Exception as e:
            print(f"ERROR: Failed to initialize Firestore. Details: {e}")
            self.db = None

    def create_case(self, case_data):
        """Creates a new case document in Firestore (or local file fallback) using person_id as the ID."""
        try:
            case_id = case_data.get('person_id')
            if not case_id:
                raise ValueError("person_id is missing from case data.")

            if self.db:
                try:
                    case_data['createdAt'] = firestore.SERVER_TIMESTAMP
                    case_ref = self.db.collection('cases').document(case_id)
                    case_ref.set(case_data)
                    return case_id
                except Exception as e:
                    print(f"ERROR: Could not create case in Firestore. Details: {e}")
                    # fall through to local fallback

            # Local fallback: persist to JSON
            os.makedirs(os.path.dirname(self._local_cases_path), exist_ok=True)
            existing = self._read_local_cases()
            case_data_local = dict(case_data)
            case_data_local['createdAt'] = datetime.utcnow().isoformat() + 'Z'
            existing[case_id] = case_data_local
            self._write_local_cases(existing)
            print(f"INFO: Created case {case_id} in local store (fallback).")
            return case_id
        except Exception as e:
            print(f"ERROR: create_case failed. Details: {e}")
            return None

    def get_case(self, case_id):
        """Retrieves a single case document from Firestore or local fallback."""
        try:
            if self.db:
                case_ref = self.db.collection('cases').document(case_id)
                case = case_ref.get()
                if case.exists:
                    return case.to_dict()
            # Local fallback
            cases = self._read_local_cases()
            return cases.get(case_id)
        except Exception as e:
            print(f"ERROR: Could not retrieve case {case_id}. Details: {e}")
            return None

    def update_case_notes(self, case_id, notes):
        """Upserts investigator notes for a case, with local fallback."""
        try:
            if self.db:
                case_ref = self.db.collection('cases').document(case_id)
                if not case_ref.get().exists:
                    print(f"WARN: Tried to update notes for non-existent case {case_id}")
                    return False
                case_ref.update({
                    'notes': notes,
                    'updatedAt': firestore.SERVER_TIMESTAMP
                })
                print(f"DEBUG: Updated notes for case {case_id} (length={len(notes)})")
                return True

            # Local fallback
            cases = self._read_local_cases()
            if case_id not in cases:
                print(f"WARN: Tried to update notes for non-existent local case {case_id}")
                return False
            case = cases[case_id]
            case['notes'] = notes
            case['updatedAt'] = datetime.utcnow().isoformat() + 'Z'
            cases[case_id] = case
            self._write_local_cases(cases)
            return True
        except Exception as e:
            print(f"ERROR: Failed to update notes for {case_id}. Details: {e}")
            return False

    # --- THIS IS THE NEW METHOD ---
    def get_all_cases(self):
        """Retrieves all case documents for the reporting page (Firestore or local fallback)."""
        try:
            cases = []
            if self.db:
                try:
                    cases_ref = self.db.collection('cases').stream()
                    for case in cases_ref:
                        case_data = case.to_dict()
                        created_at = case_data.get('createdAt')
                        # Firestore timestamp may be None or Timestamp; format safely
                        try:
                            conclusion_date = created_at.strftime('%Y-%m-%d') if created_at else 'N/A'
                        except Exception:
                            conclusion_date = 'N/A'
                        cases.append({
                            'caseId': case.id,
                            'subject': case_data.get('risk_profile', {}).get('person_details', {}).get('full_name', 'N/A'),
                            'riskScore': case_data.get('risk_profile', {}).get('final_risk_score', 0),
                            'status': 'Ready for Reporting',
                            'conclusionDate': conclusion_date,
                        })
                    return cases
                except Exception as e:
                    print(f"WARN: Firestore get_all_cases failed. Falling back to local. Details: {e}")

            # Local fallback
            local_cases = self._read_local_cases()
            for cid, case_data in local_cases.items():
                created_at = case_data.get('createdAt')
                if isinstance(created_at, str) and len(created_at) >= 10:
                    conclusion_date = created_at[:10]
                else:
                    conclusion_date = 'N/A'
                cases.append({
                    'caseId': cid,
                    'subject': case_data.get('risk_profile', {}).get('person_details', {}).get('full_name', 'N/A'),
                    'riskScore': case_data.get('risk_profile', {}).get('final_risk_score', 0),
                    'status': 'Ready for Reporting',
                    'conclusionDate': conclusion_date,
                })
            return cases
        except Exception as e:
            print(f"ERROR: Could not retrieve all cases. Details: {e}")
            return []

    def clear_all_cases(self):
        """Deletes all documents in the 'cases' collection. Returns count deleted. Fallback clears local."""
        try:
            if self.db:
                try:
                    batch = self.db.batch()
                    collection_ref = self.db.collection('cases')
                    docs = list(collection_ref.stream())
                    count = 0
                    for doc in docs:
                        batch.delete(doc.reference)
                        count += 1
                        if count % 450 == 0:  # commit periodically
                            batch.commit()
                            batch = self.db.batch()
                    batch.commit()
                    print(f"INFO: Deleted {count} case documents from Firestore.")
                    return count
                except Exception as e:
                    print(f"WARN: Firestore clear_all_cases failed. Falling back to local. Details: {e}")

            # Local fallback: remove local file
            if os.path.exists(self._local_cases_path):
                try:
                    os.remove(self._local_cases_path)
                    print("INFO: Cleared local cases store.")
                    return 1
                except Exception:
                    pass
            return 0
        except Exception as e:
            print(f"ERROR: Failed to clear cases. Details: {e}")
            return 0

    # ---- Local store helpers ----
    def _read_local_cases(self):
        try:
            if os.path.exists(self._local_cases_path):
                with open(self._local_cases_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
        except Exception as e:
            print(f"WARN: Failed reading local cases store: {e}")
        return {}

    def _write_local_cases(self, data):
        try:
            os.makedirs(os.path.dirname(self._local_cases_path), exist_ok=True)
            with open(self._local_cases_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            return True
        except Exception as e:
            print(f"WARN: Failed writing local cases store: {e}")
            return False

