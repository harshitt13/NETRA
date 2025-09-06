// The base URL for our Flask API
// Use environment variable for production deployment
import { API_BASE } from '../utils/apiBase.js';
const API_BASE_URL = API_BASE;

/**
 * A generic helper function to handle API requests with authentication.
 * @param {string} endpoint - The API endpoint to call (e.g., '/alerts').
 * @param {object} options - Optional fetch options (method, body, headers).
 * @returns {Promise<any>} - The JSON response from the API.
 */
const apiRequest = async (endpoint, options = {}) => {
  // In a real app, the token is stored in localStorage after a successful login.
  const token = localStorage.getItem('authToken');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // If a token exists, add it to the request headers for protected routes.
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: options.method || 'GET',
      headers: headers,
      body: options.body ? JSON.stringify(options.body) : null,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API error: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/pdf')) {
      return response.blob();
    }
    
    // Handle responses that might not have a JSON body (e.g., 204 No Content)
    if (response.status === 204) {
        return null;
    }
    
    return response.json();

  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    throw error;
  }
};

// --- Core API Service Functions ---

export const getAlerts = () => apiRequest('/alerts');
export const getInvestigationData = (personId) => apiRequest(`/investigate/${personId}`);
export const createCase = (caseData) => apiRequest('/cases', { method: 'POST', body: caseData });
export const getCase = (caseId) => apiRequest(`/cases/${caseId}`);
export const generatePdfReport = (personId) => apiRequest(`/report/${personId}`);
export const getGraphData = (personId) => apiRequest(`/graph/${personId}`);


// --- NEW: API Functions for the Settings Page ---

/**
 * Sends a request to the backend to regenerate the entire synthetic dataset.
 */
export const regenerateDataset = () => {
  return apiRequest('/settings/regenerate-data', {
    method: 'POST',
  });
};

/**
 * Sends a request to the backend to delete all cases from Firestore.
 */
export const clearAllCases = () => {
  return apiRequest('/settings/clear-cases', {
    method: 'POST',
  });
};


// --- Authentication Mock ---
// In a real app, this would make a POST request to a /login endpoint.
export const loginUser = async (email, password) => {
    console.log("Simulating login for:", email, password);
    // This is a dummy token for demonstration purposes. Your backend would generate a real one.
    const dummyToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
    localStorage.setItem('authToken', dummyToken);
    return { success: true, token: dummyToken };
};

