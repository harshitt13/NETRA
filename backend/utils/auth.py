import os
from functools import wraps
from flask import request, jsonify
import firebase_admin
from firebase_admin import credentials, auth

# --- Initialize Firebase Admin SDK ---
# This looks for the service account key file you downloaded.
try:
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred)
    print("Firebase Admin SDK initialized successfully.")
except Exception as e:
    print(f"ERROR initializing Firebase Admin SDK: {e}")
    print("Please ensure 'serviceAccountKey.json' is in the 'backend' directory.")

def token_required(f):
    """A decorator to protect API routes."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        # Check for the token in the Authorization header
        if 'Authorization' in request.headers:
            # The header is expected to be in the format "Bearer <token>"
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({"error": "Authorization token is missing!"}), 401

        try:
            # Verify the token with Firebase
            decoded_token = auth.verify_id_token(token)
            # You can optionally store the user info in the request context
            request.user = decoded_token
        except Exception as e:
            print(f"Token verification failed: {e}")
            return jsonify({"error": "Invalid or expired token!"}), 403
        
        return f(*args, **kwargs)
    return decorated_function
