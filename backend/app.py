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
CORS(app)

print("Initializing Project Netra Backend Services...")
DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'generated-data')
DATA_GENERATION_SCRIPT_PATH = os.path.join(os.path.dirname(__file__), '..', 'data-generation', 'generate_data.py')

data_loader = DataLoader(data_path=DATA_PATH)
all_datasets = data_loader.load_all_data()

risk_scorer = HybridRiskScorer(all_datasets)
ai_summarizer = AI_Summarizer()
graph_analyzer = GraphAnalyzer()
report_generator = ReportGenerator(all_datasets)
case_manager = CaseManager()

print("All services initialized successfully. Backend is ready.")

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

@app.route('/api/run-analysis', methods=['POST'])
@token_required
def run_analysis():
    try:
        print("Received request to run analysis...")
        risk_results = risk_scorer.run_full_analysis()
        return jsonify({
            "message": f"Full risk analysis complete. {len(risk_results)} alerts generated.",
            "alerts_generated": len(risk_results)
        }), 200
    except Exception as e:
        print(f"ERROR in /api/run-analysis: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/alerts', methods=['GET'])
@token_required
def get_alerts():
    if risk_scorer.risk_scores_df is None or risk_scorer.risk_scores_df.empty:
        try:
            alerts_path = os.path.join(DATA_PATH, 'AlertScores.csv')
            if os.path.exists(alerts_path):
                risk_scorer.risk_scores_df = pd.read_csv(alerts_path)
            else:
                return jsonify([]), 200
        except Exception:
            return jsonify([]), 200
    
    try:
        limit = int(request.args.get('limit', 50))
        top_alerts_df = risk_scorer.risk_scores_df.nlargest(limit, 'final_risk_score')
        alerts = top_alerts_df.to_dict(orient='records')
        return jsonify(alerts), 200
    except Exception as e:
        print(f"ERROR in /api/alerts: {e}")
        return jsonify({"error": "Failed to retrieve alerts."}), 500

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

@app.route('/api/graph/<string:person_id>', methods=['GET'])
@token_required
def get_graph_data(person_id):
    try:
        network_data = graph_analyzer.get_transaction_network(person_id)
        if not network_data or not network_data.get("nodes"):
            return jsonify({"message": f"No transaction network found for {person_id}."}), 404
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
        summary = ai_summarizer.generate_summary_from_details(risk_details)
        pdf_path = report_generator.generate_pdf(person_id, risk_details, summary)
        if not pdf_path or not os.path.exists(pdf_path):
            return jsonify({"error": "Failed to create the PDF report on the server."}), 500
        return send_file(pdf_path, as_attachment=True, download_name=f"Investigation_Report_{person_id}.pdf", mimetype='application/pdf')
    except Exception as e:
        print(f"ERROR in /api/report/{person_id}: {e}")
        return jsonify({"error": "Failed to generate PDF report."}), 500
        
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


# --- Error Handlers ---
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Not Found", "message": "The requested URL was not found on the server."}), 404

@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({"error": "Internal Server Error", "message": "An unexpected error occurred."}), 500

# --- MAIN EXECUTION ---
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001, debug=True)

