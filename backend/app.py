# import os
# from flask import Flask, jsonify, request, send_file
# from flask_cors import CORS
# import pandas as pd

# # Import all our custom services and utilities
# from utils.data_loader import DataLoader
# from utils.auth import token_required
# from services.risk_scoring import HybridRiskScorer
# from services.ai_summarizer import AI_Summarizer
# from services.graph_analysis import GraphAnalyzer
# from services.report_generator import ReportGenerator
# from services.case_manager import CaseManager

# # --- APPLICATION SETUP & SERVICE INITIALIZATION ---
# app = Flask(__name__)
# CORS(app)

# print("Initializing Project Netra Backend Services...")
# DATA_PATH = os.path.join(os.path.dirname(__file__), 'generated-data')
# data_loader = DataLoader(data_path=DATA_PATH)
# all_datasets = data_loader.load_all_data()

# risk_scorer = HybridRiskScorer(all_datasets)
# ai_summarizer = AI_Summarizer()
# graph_analyzer = GraphAnalyzer()
# report_generator = ReportGenerator(all_datasets)
# case_manager = CaseManager() # Initialize the case manager

# print("All services initialized successfully. Backend is ready.")

# # --- API ENDPOINTS ---

# @app.route('/api/health', methods=['GET'])
# def health_check():
#     return jsonify({"status": "healthy", "message": "Project Netra backend is running."})

# @app.route('/api/persons', methods=['GET'])
# @token_required
# def search_persons():
#     search_query = request.args.get('q', '')
#     try:
#         search_results = risk_scorer.search_persons(search_query)
#         return jsonify(search_results), 200
#     except Exception as e:
#         print(f"ERROR in /api/persons: {e}")
#         return jsonify({"error": "Failed to search for persons."}), 500

# @app.route('/api/run-analysis', methods=['POST'])
# @token_required
# def run_analysis():
#     try:
#         print("Received request to run analysis...")
#         risk_results = risk_scorer.run_full_analysis()
#         return jsonify({
#             "message": f"Full risk analysis complete. {len(risk_results)} alerts generated.",
#             "alerts_generated": len(risk_results)
#         }), 200
#     except Exception as e:
#         print(f"ERROR in /api/run-analysis: {e}")
#         return jsonify({"error": str(e)}), 500

# @app.route('/api/alerts', methods=['GET'])
# @token_required
# def get_alerts():
#     # Attempt to load alerts from memory, or from file if not present
#     if risk_scorer.risk_scores_df is None or risk_scorer.risk_scores_df.empty:
#         try:
#             alerts_path = os.path.join(DATA_PATH, 'AlertScores.csv')
#             if os.path.exists(alerts_path):
#                 risk_scorer.risk_scores_df = pd.read_csv(alerts_path)
#             else:
#                  return jsonify([]), 200 # Return empty if no analysis has been run
#         except Exception:
#             return jsonify([]), 200
    
#     try:
#         limit = int(request.args.get('limit', 50))
#         top_alerts_df = risk_scorer.risk_scores_df.nlargest(limit, 'final_risk_score')
#         alerts = top_alerts_df.to_dict(orient='records')
#         return jsonify(alerts), 200
#     except Exception as e:
#         print(f"ERROR in /api/alerts: {e}")
#         return jsonify({"error": "Failed to retrieve alerts."}), 500

# @app.route('/api/investigate/<string:person_id>', methods=['GET'])
# @token_required
# def investigate_person(person_id):
#     try:
#         risk_details = risk_scorer.get_person_risk_details(person_id)
#         if not risk_details:
#             return jsonify({"error": "Person ID not found or has no risk score."}), 404
#         summary = ai_summarizer.generate_summary_from_details(risk_details)
#         response_data = {
#             "person_id": person_id, "risk_profile": risk_details, "ai_summary": summary
#         }
#         return jsonify(response_data), 200
#     except Exception as e:
#         print(f"ERROR in /api/investigate/{person_id}: {e}")
#         return jsonify({"error": "Failed to fetch investigation data."}), 500

# # --- THIS IS THE FIX: A single route to handle both GET and POST for /api/cases ---
# @app.route('/api/cases', methods=['GET', 'POST'])
# @token_required
# def handle_cases():
#     """
#     Handles fetching all cases (GET) and creating a new case (POST).
#     """
#     if request.method == 'GET':
#         try:
#             all_cases = case_manager.get_all_cases()
#             return jsonify(all_cases), 200
#         except Exception as e:
#             print(f"ERROR in /api/cases [GET]: {e}")
#             return jsonify({"error": "An unexpected error occurred while fetching cases."}), 500
            
#     elif request.method == 'POST':
#         case_data = request.get_json()
#         if not case_data:
#             return jsonify({"error": "Invalid request body."}), 400
#         try:
#             case_id = case_manager.create_case(case_data)
#             if case_id:
#                 print(f"Successfully created case {case_id} in Firestore.")
#                 return jsonify({"message": "Case created successfully.", "case_id": case_id}), 201
#             else:
#                 return jsonify({"error": "Failed to create case in database."}), 500
#         except Exception as e:
#             print(f"ERROR in /api/cases [POST]: {e}")
#             return jsonify({"error": "An unexpected error occurred."}), 500

# @app.route('/api/cases/<string:case_id>', methods=['GET'])
# @token_required
# def get_case(case_id):
#     """Retrieves a single case file from Firestore for the Workspace."""
#     try:
#         case = case_manager.get_case(case_id)
#         if case:
#             return jsonify(case), 200
#         else:
#             return jsonify({"error": "Case not found."}), 404
#     except Exception as e:
#         print(f"ERROR in /api/cases/{case_id} GET: {e}")
#         return jsonify({"error": "An unexpected error occurred."}), 500

# @app.route('/api/graph/<string:person_id>', methods=['GET'])
# @token_required
# def get_graph_data(person_id):
#     try:
#         network_data = graph_analyzer.get_transaction_network(person_id)
#         if not network_data or not network_data.get("nodes"):
#             return jsonify({"message": f"No transaction network found for {person_id}."}), 404
#         return jsonify(network_data), 200
#     except Exception as e:
#         print(f"ERROR in /api/graph/{person_id}: {e}")
#         return jsonify({"error": "Failed to fetch graph data from Neo4j."}), 500

# @app.route('/api/report/<string:person_id>', methods=['GET'])
# @token_required
# def generate_report(person_id):
#     try:
#         risk_details = risk_scorer.get_person_risk_details(person_id)
#         if not risk_details:
#             return jsonify({"error": "Cannot generate report. Person ID not found."}), 404
#         summary = ai_summarizer.generate_summary_from_details(risk_details)
#         pdf_path = report_generator.generate_pdf(person_id, risk_details, summary)
#         if not pdf_path or not os.path.exists(pdf_path):
#             return jsonify({"error": "Failed to create the PDF report on the server."}), 500
#         return send_file(pdf_path, as_attachment=True, download_name=f"Investigation_Report_{person_id}.pdf", mimetype='application/pdf')
#     except Exception as e:
#         print(f"ERROR in /api/report/{person_id}: {e}")
#         return jsonify({"error": "Failed to generate PDF report."}), 500

# # --- Error Handlers ---
# @app.errorhandler(404)
# def not_found(error):
#     return jsonify({"error": "Not Found", "message": "The requested URL was not found on the server."}), 404

# @app.errorhandler(500)
# def internal_server_error(error):
    
#     return jsonify({"error": "Internal Server Error", "message": "An unexpected error occurred."}), 500

# # --- MAIN EXECUTION ---
# if __name__ == '__main__':
#     app.run(host='127.0.0.1', port=5001, debug=True)















































import os
import json
import uuid
import threading
from datetime import datetime, timezone
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import pandas as pd
import subprocess # We'll use this to run our data generation script

# Import all our custom services and utilities
from utils.data_loader import DataLoader
from utils.auth import token_required
from services.risk_scoring import HybridRiskScorer
from services.ai_summarizer import AI_Summarizer
from services.graph_analysis import GraphAnalyzer
from services.report_generator import ReportGenerator
from services.case_manager import CaseManager

# --- APPLICATION SETUP & SERVICE INITIALIZATION ---
app = Flask(__name__)

# Configure CORS for production and development
raw_frontend_url = os.environ.get('FRONTEND_URL', 'https://netra-ai.vercel.app/')
# Normalize: remove trailing slash and whitespace
frontend_url = raw_frontend_url.strip().rstrip('/')
allowed_origins = [
    'http://localhost:3000', 'http://127.0.0.1:3000',
    'http://localhost:5173', 'http://127.0.0.1:5173',
    frontend_url,  # canonical (no slash)
]
# Also add explicit trailing slash variant to be safe (some mis-configured CORS libs compare literally)
allowed_origins.append(frontend_url + '/')

# Remove duplicates and None values
allowed_origins = list(set(filter(None, allowed_origins)))

print(f"Configuring CORS for origins: {allowed_origins}")
CORS(app, origins=allowed_origins, supports_credentials=True, allow_headers=['Content-Type','Authorization'], expose_headers=['Content-Type'])

@app.before_request
def _cors_debug_log():
    # Lightweight debug to help diagnose production fetch issues (only first few prints to avoid noise)
    if not hasattr(app, '_cors_debug_count'):
        app._cors_debug_count = 0
    if app._cors_debug_count < 25:  # cap logging
        origin = request.headers.get('Origin')
        print(f"[CORS-DEBUG] Origin={origin} Path={request.path}")
        app._cors_debug_count += 1

print("Initializing Project Netra Backend Services...")
DATA_PATH = os.path.join(os.path.dirname(__file__), 'generated-data')
DATA_GENERATION_SCRIPT_PATH = os.path.join(os.path.dirname(__file__), '..', 'data-generation', 'generate_data.py')

data_loader = DataLoader(data_path=DATA_PATH)
all_datasets = data_loader.load_all_data()

risk_scorer = HybridRiskScorer(all_datasets)
ai_summarizer = AI_Summarizer()
graph_analyzer = GraphAnalyzer()
report_generator = ReportGenerator(all_datasets)
case_manager = CaseManager()

print("All services initialized successfully. Backend is ready.")

# --- Simple local settings persistence (non-sensitive demo storage) ---
SETTINGS_FILE = os.path.join(os.path.dirname(__file__), 'app_settings.json')
NOTIFICATIONS_FILE = os.path.join(os.path.dirname(__file__), 'notifications.json')

def _load_settings():
    if os.path.exists(SETTINGS_FILE):
        try:
            with open(SETTINGS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"WARN: Failed to load settings file: {e}")
    return {
        "profile": {"displayName": "Senior Investigator", "email": "admin@netra.com", "department": "Financial Crimes Unit", "badge": "FC-001"},
        "apiKey": "",
        "theme": "dark"
    }

def _save_settings(data):
    try:
        with open(SETTINGS_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        return True
    except Exception as e:
        print(f"WARN: Failed to save settings: {e}")
        return False

def _load_notifications():
    try:
        if os.path.exists(NOTIFICATIONS_FILE):
            with open(NOTIFICATIONS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f).get('notifications', [])
    except Exception as e:
        print(f"WARN: Failed to load notifications: {e}")
    return []

def _save_notifications(items):
    try:
        with open(NOTIFICATIONS_FILE, 'w', encoding='utf-8') as f:
            json.dump({'notifications': items}, f, indent=2)
        return True
    except Exception as e:
        print(f"WARN: Failed to save notifications: {e}")
        return False

# Auto-run analysis once on startup if no existing alert scores cached
try:
    if (risk_scorer.risk_scores_df is None) or risk_scorer.risk_scores_df.empty:
        print("[Startup] Running initial full risk analysis to populate alert scores...")
        risk_scorer.run_full_analysis()
except Exception as e:
    print(f"WARN: Initial analysis run failed: {e}")

# --- API ENDPOINTS (Existing endpoints remain the same) ---

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Project Netra backend is running."})

# ... (all your other endpoints like /api/alerts, /api/investigate, etc., go here) ...
@app.route('/api/persons', methods=['GET'])
@token_required
def search_persons():
    search_query = request.args.get('q', '')
    try:
        search_results = risk_scorer.search_persons(search_query)
        return jsonify(search_results), 200
    except Exception as e:
        print(f"ERROR in /api/persons: {e}")
        return jsonify({"error": "Failed to search for persons."}), 500

analysis_state = {
    'running': False,
    'started_at': None,
    'completed_at': None,
    'alerts_generated': None,
    'error': None
}
_analysis_lock = threading.Lock()

def _background_full_analysis():
    global analysis_state
    try:
        print("[ANALYSIS] Background full analysis started...")
        results = risk_scorer.run_full_analysis()
        with _analysis_lock:
            analysis_state['running'] = False
            analysis_state['completed_at'] = datetime.now(timezone.utc).isoformat()
            analysis_state['alerts_generated'] = len(results)
            analysis_state['error'] = None
        print(f"[ANALYSIS] Completed. {len(results)} alerts generated.")
    except Exception as e:
        with _analysis_lock:
            analysis_state['running'] = False
            analysis_state['completed_at'] = datetime.now(timezone.utc).isoformat()
            analysis_state['error'] = str(e)
        print(f"ERROR in background analysis: {e}")

@app.route('/api/run-analysis/status', methods=['GET'])
@token_required
def run_analysis_status():
    # Return current state; hide None values for cleanliness
    with _analysis_lock:
        state_copy = {k: v for k, v in analysis_state.items() if v is not None}
    return jsonify(state_copy), 200

@app.route('/api/run-analysis', methods=['POST'])
@token_required
def run_analysis():
    """Trigger a full analysis.
    Modes:
      - Async (default): returns 202 quickly and performs work in background thread.
      - Sync: pass query param sync=1 to run inline (may timeout on free hosting).
    """
    sync_mode = request.args.get('sync') == '1'
    try:
        if sync_mode:
            print("[ANALYSIS] Synchronous run requested...")
            results = risk_scorer.run_full_analysis()
            with _analysis_lock:
                analysis_state.update({
                    'running': False,
                    'started_at': analysis_state.get('started_at') or datetime.now(timezone.utc).isoformat(),
                    'completed_at': datetime.now(timezone.utc).isoformat(),
                    'alerts_generated': len(results),
                    'error': None
                })
            return jsonify({
                "message": f"Full risk analysis complete. {len(results)} alerts generated.",
                "alerts_generated": len(results),
                "mode": "sync"
            }), 200
        # Async path
        with _analysis_lock:
            if analysis_state['running']:
                return jsonify({
                    'message': 'Analysis already running.',
                    'running': True,
                    'started_at': analysis_state['started_at']
                }), 202
            # Initialize state and launch thread
            analysis_state.update({
                'running': True,
                'started_at': datetime.now(timezone.utc).isoformat(),
                'completed_at': None,
                'alerts_generated': None,
                'error': None
            })
        t = threading.Thread(target=_background_full_analysis, daemon=True)
        t.start()
        return jsonify({
            'message': 'Full risk analysis started in background.',
            'running': True,
            'mode': 'async'
        }), 202
    except Exception as e:
        print(f"ERROR in /api/run-analysis: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/alerts', methods=['GET'])
@token_required
def get_alerts():
    try:
        # Debug: Print all request parameters
        print(f"[ALERTS] Request args: {dict(request.args)}")
        print(f"[ALERTS] Headers: {dict(request.headers)}")
        
        # Always load from AlertScores.csv directly
        alerts_path = os.path.join(DATA_PATH, 'AlertScores.csv')
        print(f"[ALERTS] Looking for alerts at: {alerts_path}")
        
        if not os.path.exists(alerts_path):
            print("[ALERTS] AlertScores.csv not found")
            return jsonify([]), 200
            
        # Load the alerts data directly
        alerts_df = pd.read_csv(alerts_path)
        print(f"[ALERTS] Loaded alerts DataFrame with shape: {alerts_df.shape}")
        print(f"[ALERTS] Columns: {list(alerts_df.columns)}")
        
        # If final_risk_score missing but risk_score present, align columns
        if 'final_risk_score' not in alerts_df.columns and 'risk_score' in alerts_df.columns:
            alerts_df['final_risk_score'] = alerts_df['risk_score']
        if 'risk_score' not in alerts_df.columns and 'final_risk_score' in alerts_df.columns:
            alerts_df['risk_score'] = alerts_df['final_risk_score']
        # Force integer types for consistency
        for col in ['final_risk_score','risk_score']:
            if col in alerts_df.columns:
                try:
                    alerts_df[col] = alerts_df[col].fillna(0).astype(int)
                except Exception:
                    pass

        # Check if there's actual data (rows) after normalization
        if len(alerts_df) == 0:
            print("[ALERTS] AlertScores.csv is empty (no data rows)")
            # Check if demo mode is requested
            demo_mode = request.args.get('demo', 'false').lower() == 'true'
            
            if demo_mode:
                print("No alert data found, returning mock data for demo")
                # Return mock alert data for demonstration
                mock_alerts = [
                    {
                        "alert_id": "ALT-001",
                        "person_id": "PER-001",
                        "full_name": "Rohan Mehra",
                        "final_risk_score": 92,
                        "risk_score": 92,
                        "timestamp": "2025-08-31T12:34:56Z",
                        "summary": "High-value property purchase inconsistent with declared income and links to shell companies.",
                        "status": "active"
                    },
                    {
                        "alert_id": "ALT-002", 
                        "person_id": "PER-002",
                        "full_name": "Priya Sharma",
                        "final_risk_score": 87,
                        "risk_score": 87,
                        "timestamp": "2025-08-30T09:15:22Z",
                        "summary": "Multiple cash deposits under reporting threshold detected (Structuring).",
                        "status": "active"
                    },
                    {
                        "alert_id": "ALT-003",
                        "person_id": "PER-003", 
                        "full_name": "Vikram Singh",
                        "final_risk_score": 75,
                        "risk_score": 75,
                        "timestamp": "2025-08-29T16:42:11Z",
                        "summary": "Transactions identified with newly incorporated company with low paid-up capital.",
                        "status": "active"
                    },
                    {
                        "alert_id": "ALT-004",
                        "person_id": "PER-004",
                        "full_name": "Anjali Verma", 
                        "final_risk_score": 81,
                        "risk_score": 81,
                        "timestamp": "2025-08-28T14:18:33Z",
                        "summary": "Unusual international wire transfers to high-risk jurisdictions without clear business purpose.",
                        "status": "active"
                    },
                    {
                        "alert_id": "ALT-005",
                        "person_id": "PER-005",
                        "full_name": "Rajesh Gupta",
                        "final_risk_score": 69,
                        "risk_score": 69, 
                        "timestamp": "2025-08-27T11:55:17Z",
                        "summary": "Complex layered transactions through multiple shell companies to obscure fund origins.",
                        "status": "active"
                    }
                ]
                return jsonify(mock_alerts), 200
            else:
                print("No alert data found, returning empty array")
                return jsonify([]), 200
        
        # We have data, proceed normally
        print(f"[ALERTS] Found {len(alerts_df)} alerts in CSV file")
        
        # Get limit parameter
        limit = int(request.args.get('limit', 50))
        
        # Sort by risk_score and get top alerts
        top_alerts_df = alerts_df.nlargest(limit, 'risk_score')
        alerts = top_alerts_df.to_dict(orient='records')
        
        print(f"[ALERTS] Returning {len(alerts)} alerts (limited to {limit})")
        return jsonify(alerts), 200
        
    except Exception as e:
        print(f"[ALERTS] ERROR in /api/alerts: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to retrieve alerts."}), 500


# Add a simple alerts endpoint without authentication for debugging
@app.route('/api/alerts-debug', methods=['GET'])
def get_alerts_debug():
    try:
        print(f"[ALERTS-DEBUG] Request received")
        
        # Always load from AlertScores.csv directly
        alerts_path = os.path.join(DATA_PATH, 'AlertScores.csv')
        print(f"[ALERTS-DEBUG] Looking for alerts at: {alerts_path}")
        
        if not os.path.exists(alerts_path):
            print("[ALERTS-DEBUG] AlertScores.csv not found")
            return jsonify([]), 200
            
        # Load the alerts data directly
        alerts_df = pd.read_csv(alerts_path)
        print(f"[ALERTS-DEBUG] Loaded alerts DataFrame with shape: {alerts_df.shape}")
        
        if len(alerts_df) == 0:
            print("[ALERTS-DEBUG] No alerts found")
            return jsonify([]), 200
        
        # Get limit parameter
        limit = int(request.args.get('limit', 10))
        
        # Sort by risk_score and get top alerts
        top_alerts_df = alerts_df.nlargest(limit, 'risk_score')
        alerts = top_alerts_df.to_dict(orient='records')
        
        print(f"[ALERTS-DEBUG] Returning {len(alerts)} alerts")
        return jsonify(alerts), 200
        
    except Exception as e:
        print(f"[ALERTS-DEBUG] ERROR: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to retrieve alerts."}), 500

@app.route('/api/test-alerts', methods=['GET'])
def test_alerts():
    """Test endpoint to verify alert generation without authentication"""
    try:
        alerts_path = os.path.join(DATA_PATH, 'AlertScores.csv')
        print(f"DEBUG: Looking for alerts at: {alerts_path}")
        
        if os.path.exists(alerts_path):
            alerts_df = pd.read_csv(alerts_path)
            print(f"DEBUG: Found {len(alerts_df)} alerts")
            print(f"DEBUG: Columns: {list(alerts_df.columns)}")
            
            # Test the same logic as the main alerts endpoint
            if len(alerts_df) == 0:
                return jsonify({
                    "alerts_file_exists": True,
                    "alerts_count": 0,
                    "message": "File exists but is empty"
                })
            
            # Get top 5 alerts by risk score
            top_alerts_df = alerts_df.nlargest(5, 'risk_score')
            alerts = top_alerts_df.to_dict(orient='records')
            
            return jsonify({
                "alerts_file_exists": True,
                "alerts_count": len(alerts_df),
                "columns": list(alerts_df.columns),
                "top_5_alerts": alerts,
                "sample_alert": alerts_df.iloc[0].to_dict() if len(alerts_df) > 0 else None
            })
        else:
            print(f"DEBUG: AlertScores.csv not found at {alerts_path}")
            return jsonify({"alerts_file_exists": False, "path_checked": alerts_path})
    except Exception as e:
        print(f"DEBUG: Error in test-alerts: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)})

@app.route('/api/investigate/<string:person_id>', methods=['GET'])
@token_required
def investigate_person(person_id):
    try:
        risk_details = risk_scorer.get_person_risk_details(person_id)
        if not risk_details:
            return jsonify({"error": "Person ID not found or has no risk score."}), 404
        summary = ai_summarizer.generate_summary_from_details(risk_details)
        response_data = {
            "person_id": person_id, "risk_profile": risk_details, "ai_summary": summary
        }
        return jsonify(response_data), 200
    except Exception as e:
        print(f"ERROR in /api/investigate/{person_id}: {e}")
        return jsonify({"error": "Failed to fetch investigation data."}), 500

@app.route('/api/cases', methods=['GET', 'POST'])
@token_required
def handle_cases():
    if request.method == 'GET':
        try:
            all_cases = case_manager.get_all_cases()
            return jsonify(all_cases), 200
        except Exception as e:
            print(f"ERROR in /api/cases [GET]: {e}")
            return jsonify({"error": "An unexpected error occurred while fetching cases."}), 500
            
    elif request.method == 'POST':
        case_data = request.get_json()
        if not case_data:
            return jsonify({"error": "Invalid request body."}), 400
        try:
            case_id = case_manager.create_case(case_data)
            if case_id:
                print(f"Successfully created case {case_id} in Firestore.")
                return jsonify({"message": "Case created successfully.", "case_id": case_id}), 201
            else:
                return jsonify({"error": "Failed to create case in database."}), 500
        except Exception as e:
            print(f"ERROR in /api/cases [POST]: {e}")
            return jsonify({"error": "An unexpected error occurred."}), 500

@app.route('/api/cases/<string:case_id>', methods=['GET'])
@token_required
def get_case(case_id):
    try:
        case = case_manager.get_case(case_id)
        if case:
            return jsonify(case), 200
        else:
            return jsonify({"error": "Case not found."}), 404
    except Exception as e:
        print(f"ERROR in /api/cases/{case_id} GET: {e}")
        return jsonify({"error": "An unexpected error occurred."}), 500

NOTES_STORE_PATH = os.path.join(os.path.dirname(__file__), 'generated-data', 'case_notes.json')

def _read_local_notes():
    try:
        if os.path.exists(NOTES_STORE_PATH):
            with open(NOTES_STORE_PATH, 'r', encoding='utf-8') as f:
                return json.load(f)
    except Exception as e:
        print(f"WARN: Failed reading local notes store: {e}")
    return {}

def _write_local_notes(data):
    try:
        os.makedirs(os.path.dirname(NOTES_STORE_PATH), exist_ok=True)
        with open(NOTES_STORE_PATH, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"WARN: Failed writing local notes store: {e}")
        return False

@app.route('/api/cases/<string:case_id>/notes', methods=['GET', 'PUT'])
@token_required
def case_notes(case_id):
    try:
        if request.method == 'GET':
            case = case_manager.get_case(case_id)
            firestore_notes = case.get('notes') if case else None
            if firestore_notes is not None:
                return jsonify({"case_id": case_id, "notes": firestore_notes, "source": "firestore"}), 200
            # Fallback to local file
            local_notes_map = _read_local_notes()
            notes_text = local_notes_map.get(case_id, '')
            if case is None and not notes_text:
                return jsonify({"error": "Case not found."}), 404
            return jsonify({"case_id": case_id, "notes": notes_text, "source": "local"}), 200
        else:  # PUT
            body = request.get_json() or {}
            notes = body.get('notes')
            if notes is None:
                return jsonify({"error": "'notes' field is required."}), 400
            updated = case_manager.update_case_notes(case_id, notes)
            # Always also persist locally as fallback
            local_notes_map = _read_local_notes()
            local_notes_map[case_id] = notes
            _write_local_notes(local_notes_map)
            if not updated:
                # Firestore failed but local saved
                return jsonify({"message": "Notes saved locally (Firestore unavailable).", "fallback": True}), 200
            return jsonify({"message": "Notes saved successfully.", "fallback": False}), 200
    except Exception as e:
        print(f"ERROR in /api/cases/{case_id}/notes: {e}")
        return jsonify({"error": "Failed to process notes request."}), 500

@app.route('/api/graph/<string:person_id>', methods=['GET'])
@token_required
def get_graph_data(person_id):
    """Return transaction network for an entity. Always 200 with empty graph if no data.

    Query params:
      limit: optional int (default 100) max 500
    """
    try:
        try:
            limit = int(request.args.get('limit', 100))
        except ValueError:
            limit = 100
        limit = max(1, min(limit, 500))

        network_data = graph_analyzer.get_transaction_network(person_id, limit=limit)
        if not network_data or not network_data.get("nodes"):
            # --- Fallback: synthesize a tiny network from CSV data (no Neo4j) ---
            try:
                persons_df = all_datasets.get('persons')
                accounts_df = all_datasets.get('accounts')
                tx_df = all_datasets.get('transactions')
                if persons_df is not None and accounts_df is not None and tx_df is not None:
                    # Find accounts belonging to this person
                    person_accounts = accounts_df[accounts_df['owner_id'] == person_id]['account_number'].tolist()
                    if person_accounts:
                        # Get up to N related transactions where person is source or target
                        related_tx = tx_df[(tx_df['from_account'].isin(person_accounts)) | (tx_df['to_account'].isin(person_accounts))].head(25)
                        # Map counterpart accounts -> owners
                        counterpart_accounts = set()
                        for _, row in related_tx.iterrows():
                            if row['from_account'] in person_accounts:
                                counterpart_accounts.add(row['to_account'])
                            if row['to_account'] in person_accounts:
                                counterpart_accounts.add(row['from_account'])
                        counterpart_owners = accounts_df[accounts_df['account_number'].isin(list(counterpart_accounts))]
                        # Build nodes
                        nodes = []
                        person_row = persons_df[persons_df['person_id'] == person_id]
                        label = person_row.iloc[0]['full_name'] if not person_row.empty else person_id
                        nodes.append({"id": person_id, "label": label, "type": "Person", "isCenter": True})
                        for _, acct in counterpart_owners.iterrows():
                            owner_id = acct['owner_id']
                            if owner_id == person_id:
                                continue
                            owner_row = persons_df[persons_df['person_id'] == owner_id]
                            owner_label = owner_row.iloc[0]['full_name'] if not owner_row.empty else owner_id
                            # Avoid duplicates
                            if not any(n['id'] == owner_id for n in nodes):
                                nodes.append({"id": owner_id, "label": owner_label, "type": "Person", "isCenter": False})
                        # Build edges (aggregate amounts per counterpart for brevity)
                        edges_map = {}
                        for _, tx in related_tx.iterrows():
                            src_is_person = tx['from_account'] in person_accounts
                            dst_is_person = tx['to_account'] in person_accounts
                            if src_is_person or dst_is_person:
                                counterpart_acct = tx['to_account'] if src_is_person else tx['from_account']
                                counterpart_owner_row = accounts_df[accounts_df['account_number'] == counterpart_acct]
                                if counterpart_owner_row.empty:
                                    continue
                                counterpart_owner = counterpart_owner_row.iloc[0]['owner_id']
                                if counterpart_owner == person_id:
                                    continue
                                key = counterpart_owner
                                amt = int(tx['amount_inr']) if not pd.isna(tx['amount_inr']) else 0
                                if key not in edges_map:
                                    edges_map[key] = {"amount": 0, "isOutgoing": src_is_person}
                                edges_map[key]["amount"] += amt
                        edges = []
                        for target_id, meta in edges_map.items():
                            edges.append({
                                "source": person_id,
                                "target": target_id,
                                "label": f"₹{meta['amount']:,}",
                                "isOutgoing": meta['isOutgoing']
                            })
                        synthesized = {"person_id": person_id, "nodes": nodes, "edges": edges, "message": "Synthesized network (Neo4j unavailable or no data)."}
                        return jsonify(synthesized), 200
            except Exception as synth_err:
                print(f"WARN: Failed to synthesize fallback graph for {person_id}: {synth_err}")
            # Return empty graph if synthesis not possible
            return jsonify({
                "person_id": person_id,
                "nodes": [],
                "edges": [],
                "message": f"No transaction network found for {person_id}."
            }), 200
        # Attach person_id for consistency
        network_data["person_id"] = person_id
        return jsonify(network_data), 200
    except Exception as e:
        print(f"ERROR in /api/graph/{person_id}: {e}")
        return jsonify({"error": "Failed to fetch graph data from Neo4j."}), 500

@app.route('/api/report/<string:person_id>', methods=['GET'])
@token_required
def generate_report(person_id):
    try:
        risk_details = risk_scorer.get_person_risk_details(person_id)
        if not risk_details:
            return jsonify({"error": "Cannot generate report. Person ID not found."}), 404
        # Harmonize: ensure we use the canonical alert score (from AlertScores.csv) so PDF matches dashboard
        try:
            alerts_path = os.path.join(DATA_PATH, 'AlertScores.csv')
            if os.path.exists(alerts_path):
                alerts_df = pd.read_csv(alerts_path)
                row = alerts_df[alerts_df['person_id'] == person_id]
                if not row.empty:
                    canonical_score = int(row.iloc[0].get('final_risk_score', row.iloc[0].get('risk_score', 0)))
                    # Only override if canonical differs; keep recalculated score accessible for debugging
                    risk_details['final_risk_score'] = canonical_score
                    risk_details['canonical_alert_score'] = canonical_score
                    print(f"[REPORT] Using canonical score {canonical_score} for {person_id} (recalc {risk_details.get('recalculated_risk_score')})")
                else:
                    print(f"[REPORT] No canonical alert row found for {person_id}, using recalculated {risk_details.get('final_risk_score')}")
        except Exception as _harm_err:
            print(f"WARN: Failed to harmonize PDF score for {person_id}: {_harm_err}")
        summary = ai_summarizer.generate_summary_from_details(risk_details)
        pdf_path = report_generator.generate_pdf(person_id, risk_details, summary)
        if not pdf_path or not os.path.exists(pdf_path):
            debug = request.args.get('debug') == '1' or os.environ.get('NETRA_REPORT_DEBUG') == '1'
            msg = {"error": "Failed to create the PDF report on the server."}
            if debug:
                msg["details"] = "PDF generation returned no path. Check server logs for 'FATAL ERROR during primary PDF generation' entries."
            return jsonify(msg), 500
        return send_file(pdf_path, as_attachment=True, download_name=f"Investigation_Report_{person_id}.pdf", mimetype='application/pdf')
    except Exception as e:
        print(f"ERROR in /api/report/{person_id}: {e}")
        debug = request.args.get('debug') == '1' or os.environ.get('NETRA_REPORT_DEBUG') == '1'
        msg = {"error": "Failed to generate PDF report."}
        if debug:
            import traceback
            msg['details'] = traceback.format_exc()
        return jsonify(msg), 500
        
# --- NEW: Settings & Data Management Endpoints ---
@app.route('/api/settings/regenerate-data', methods=['POST'])
@token_required
def regenerate_data():
    """
    Triggers the data generation script to create a new synthetic dataset.
    """
    try:
        print("Received request to regenerate dataset...")
        # We use subprocess to run the script in a way that doesn't block the server
        # for too long. For a hackathon, this is a very effective demonstration.
        process = subprocess.Popen(['python', DATA_GENERATION_SCRIPT_PATH], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()
        
        if process.returncode == 0:
            # Important: After generating new data, we must reload it into our services
            print("Data regeneration successful. Reloading services...")
            global all_datasets, risk_scorer, report_generator
            all_datasets = data_loader.load_all_data()
            risk_scorer = HybridRiskScorer(all_datasets)
            report_generator = ReportGenerator(all_datasets)
            print("Services reloaded with new data.")
            return jsonify({"message": "New synthetic dataset generated and loaded successfully."}), 200
        else:
            print(f"ERROR during data regeneration: {stderr.decode()}")
            return jsonify({"error": "Failed to regenerate dataset.", "details": stderr.decode()}), 500
            
    except Exception as e:
        print(f"ERROR in /api/settings/regenerate-data: {e}")
        return jsonify({"error": "An unexpected error occurred during data regeneration."}), 500

@app.route('/api/settings/clear-cases', methods=['POST'])
@token_required
def clear_all_cases():
    """
    Deletes all case files from the Firestore database.
    """
    try:
        print("Received request to clear all cases from Firestore...")
        deleted_count = case_manager.clear_all_cases()
        return jsonify({"message": f"Successfully deleted {deleted_count} cases from Firestore."}), 200
    except Exception as e:
        print(f"ERROR in /api/settings/clear-cases: {e}")
        return jsonify({"error": "An unexpected error occurred while clearing cases."}), 500

@app.route('/api/settings/profile', methods=['GET','POST'])
@token_required
def settings_profile():
    settings = _load_settings()
    if request.method == 'GET':
        return jsonify(settings.get('profile', {})), 200
    body = request.get_json(force=True, silent=True) or {}
    print(f"[PROFILE] Incoming profile update body: {body}")
    missing = [k for k in ['displayName','email'] if k not in body]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400
    profile = settings.get('profile', {})
    for k in ['displayName','email','department','badge']:
        if k in body:
            profile[k] = body[k]
    settings['profile'] = profile
    if not _save_settings(settings):
        return jsonify({"error": "Failed to persist profile settings"}), 500
    print(f"[PROFILE] Updated profile saved: {profile}")
    return jsonify({"message": "Profile updated", "profile": profile}), 200

@app.route('/api/settings/api-key', methods=['GET','POST'])
@token_required
def settings_api_key():
    settings = _load_settings()
    if request.method == 'GET':
        key = settings.get('apiKey','')
        masked = key[:4] + '...' + key[-4:] if len(key) > 8 else key
        return jsonify({"apiKeyMasked": masked, "configured": bool(key)}), 200
    body = request.get_json(force=True, silent=True) or {}
    new_key = body.get('apiKey','').strip()
    settings['apiKey'] = new_key
    _save_settings(settings)
    if new_key:
        os.environ['GEMINI_API_KEY'] = new_key
    return jsonify({"message": "API key updated"}), 200

@app.route('/api/settings/theme', methods=['GET','POST'])
@token_required
def settings_theme():
    settings = _load_settings()
    if request.method == 'GET':
        return jsonify({"theme": settings.get('theme','dark')}), 200
    body = request.get_json(force=True, silent=True) or {}
    theme = body.get('theme','dark')
    if theme not in ['dark','light']:
        return jsonify({"error": "Invalid theme"}), 400
    settings['theme'] = theme
    _save_settings(settings)
    return jsonify({"message": "Theme updated", "theme": theme}), 200

# --- Notifications Endpoints ---
@app.route('/api/notifications', methods=['GET'])
@token_required
def get_notifications():
    """Return list of notifications. If none exist, synthesize a few from top alerts."""
    force = request.args.get('force') == '1'
    items = _load_notifications()
    if force:
        # Rebuild notifications from latest top alerts
        items = []
    if not items or force:
        try:
            alerts_path = os.path.join(DATA_PATH, 'AlertScores.csv')
            if os.path.exists(alerts_path):
                df = pd.read_csv(alerts_path)
                if 'risk_score' in df.columns and len(df) > 0:
                    # Get top 5 most recent high risk (sort by risk then maybe person_id to stabilize)
                    top = df.nlargest(5, 'risk_score').to_dict(orient='records')
                    now_iso = datetime.now(timezone.utc).isoformat()
                    for rec in top:
                        items.append({
                            'id': str(uuid.uuid4()),
                            'type': 'alert',
                            'person_id': rec.get('person_id'),
                            'title': f"High Risk Alert: {rec.get('person_id')}",
                            'message': f"Score {int(rec.get('risk_score', rec.get('final_risk_score', 0)))} for {rec.get('person_id')} - {rec.get('full_name','Unknown')}",
                            'severity': 'high' if rec.get('risk_score',0) >= 80 else 'medium',
                            'created_at': now_iso,
                            'read': False
                        })
        except Exception as e:
            print(f"WARN: Failed to synthesize notifications: {e}")
        _save_notifications(items)
    else:
        # Opportunistically append any new high risk alerts not already represented
        try:
            existing_person_ids = {n.get('person_id') for n in items if n.get('person_id')}
            alerts_path = os.path.join(DATA_PATH, 'AlertScores.csv')
            if os.path.exists(alerts_path):
                df = pd.read_csv(alerts_path)
                if 'risk_score' in df.columns and len(df) > 0:
                    top_new = df.nlargest(5, 'risk_score')
                    now_iso = datetime.now(timezone.utc).isoformat()
                    for _, rec in top_new.iterrows():
                        pid = rec.get('person_id')
                        if pid not in existing_person_ids:
                            items.append({
                                'id': str(uuid.uuid4()),
                                'type': 'alert',
                                'person_id': pid,
                                'title': f"High Risk Alert: {pid}",
                                'message': f"Score {int(rec.get('risk_score', rec.get('final_risk_score', 0)))} for {pid} - {rec.get('full_name','Unknown')}",
                                'severity': 'high' if rec.get('risk_score',0) >= 80 else 'medium',
                                'created_at': now_iso,
                                'read': False
                            })
                    _save_notifications(items)
        except Exception as e:
            print(f"WARN: Failed to augment notifications: {e}")
    # Sort newest first
    try:
        items.sort(key=lambda x: x.get('created_at',''), reverse=True)
    except Exception:
        pass
    # Filtering
    unread_only = request.args.get('unread') == '1'
    limit_param = request.args.get('limit')
    filtered = [n for n in items if (not unread_only or not n.get('read'))]
    if limit_param:
        try:
            lim = max(1, min(int(limit_param), 100))
            filtered = filtered[:lim]
        except ValueError:
            pass
    unread = sum(1 for n in items if not n.get('read'))
    return jsonify({"notifications": filtered, "unread": unread, "total": len(items)}), 200

@app.route('/api/notifications', methods=['POST'])
@token_required
def create_notification():
    body = request.get_json(silent=True) or {}
    title = body.get('title') or 'Notification'
    message = body.get('message') or ''
    severity = body.get('severity','info')
    person_id = body.get('person_id')
    if severity not in ['info','low','medium','high','critical']:
        severity = 'info'
    items = _load_notifications()
    new_item = {
        'id': str(uuid.uuid4()),
        'type': body.get('type','general'),
        'title': title,
        'message': message,
        'severity': severity,
        'person_id': person_id,
        'created_at': datetime.now(timezone.utc).isoformat(),
        'read': False
    }
    items.append(new_item)
    _save_notifications(items)
    return jsonify({"message": "Notification created", "notification": new_item}), 201

@app.route('/api/notifications/<string:notif_id>', methods=['PATCH'])
@token_required
def update_notification(notif_id):
    body = request.get_json(silent=True) or {}
    items = _load_notifications()
    updated = None
    for n in items:
        if n.get('id') == notif_id:
            if 'read' in body:
                n['read'] = bool(body['read'])
                if n['read']:
                    n['read_at'] = datetime.now(timezone.utc).isoformat()
                else:
                    n.pop('read_at', None)
            if 'title' in body:
                n['title'] = body['title']
            if 'message' in body:
                n['message'] = body['message']
            if 'severity' in body and body['severity'] in ['info','low','medium','high','critical']:
                n['severity'] = body['severity']
            updated = n
            break
    if updated is None:
        return jsonify({"error": "Notification not found"}), 404
    _save_notifications(items)
    return jsonify({"message": "Notification updated", "notification": updated}), 200

@app.route('/api/notifications/<string:notif_id>', methods=['DELETE'])
@token_required
def delete_notification(notif_id):
    items = _load_notifications()
    new_items = [n for n in items if n.get('id') != notif_id]
    if len(new_items) == len(items):
        return jsonify({"error": "Notification not found"}), 404
    _save_notifications(new_items)
    return jsonify({"message": "Notification deleted"}), 200

@app.route('/api/notifications/mark-read', methods=['POST'])
@token_required
def mark_notifications_read():
    body = request.get_json(silent=True) or {}
    ids = body.get('ids')  # optional list
    items = _load_notifications()
    updated = 0
    now_iso = datetime.now(timezone.utc).isoformat()
    if ids and isinstance(ids, list):
        id_set = set(ids)
        for n in items:
            if n.get('id') in id_set and not n.get('read'):
                n['read'] = True
                n['read_at'] = now_iso
                updated += 1
    else:
        for n in items:
            if not n.get('read'):
                n['read'] = True
                n['read_at'] = now_iso
                updated += 1
    _save_notifications(items)
    return jsonify({"message": "Notifications marked read", "updated": updated}), 200


# --- Error Handlers ---
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not Found", "message": "The requested URL was not found on the server."}), 404

@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({"error": "Internal Server Error", "message": "An unexpected error occurred."}), 500

# --- MAIN EXECUTION ---
if __name__ == '__main__':
    # Use environment variables for production deployment
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)

