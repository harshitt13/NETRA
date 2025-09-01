// // The base URL for our Flask API.
// // This should be in a .env file in a real production app.
// const API_BASE_URL = 'http://localhost:5000/api';

// /**
//  * A generic helper function to handle API requests.
//  * @param {string} endpoint - The API endpoint to call (e.g., '/alerts').
//  * @param {object} options - Optional fetch options (method, body, headers).
//  * @returns {Promise<any>} - The JSON response from the API.
//  */
// const apiRequest = async (endpoint, options = {}) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//       method: options.method || 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         ...options.headers,
//       },
//       body: options.body ? JSON.stringify(options.body) : null,
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error || `API error: ${response.statusText}`);
//     }

//     // Handle different content types. PDF reports will not be JSON.
//     const contentType = response.headers.get('content-type');
//     if (contentType && contentType.includes('application/pdf')) {
//       return response.blob();
//     }
    
//     return response.json();

//   } catch (error) {
//     console.error(`API request to ${endpoint} failed:`, error);
//     throw error; // Re-throw the error to be caught by the calling component
//   }
// };

// // --- API Service Functions ---

// /**
//  * Fetches the prioritized list of alerts for the dashboard.
//  */
// export const getAlerts = () => apiRequest('/alerts');

// /**
//  * Fetches the detailed data for a specific person for the Triage page.
//  * @param {string} personId - The ID of the person to fetch.
//  */
// export const getTriageData = (personId) => apiRequest(`/triage/${personId}`);

// /**
//  * Fetches the complete dataset for the Investigation Workspace.
//  * This includes entity details, graph data, and AI summary.
//  * @param {string} personId - The ID of the person to investigate.
//  */
// export const getWorkspaceData = (personId) => apiRequest(`/workspace/${personId}`);

// /**
//  * Sends a request to escalate an alert into a formal case.
//  * @param {string} personId - The ID of the person whose alert is being escalated.
//  */
// export const escalateCase = (personId) => {
//   return apiRequest('/cases/escalate', {
//     method: 'POST',
//     body: { person_id: personId },
//   });
// };

// /**
//  * Saves the investigator's notes for a specific case.
//  * @param {string} caseId - The ID of the case.
//  * @param {string} notes - The notes content to save.
//  */
// export const saveNotes = (caseId, notes) => {
//   return apiRequest(`/notes/${caseId}`, {
//     method: 'POST',
//     body: { content: notes },
//   });
// };

// /**
//  * Requests the generation of a PDF report for a case.
//  * Returns a blob which can be used to create a download link.
//  * @param {string} caseId - The ID of the case to generate a report for.
//  */
// export const generateReport = (caseId) => apiRequest(`/generate-report/${caseId}`);



// The base URL for our Flask API.
// Note: Your latest app.py uses port 5001.
const API_BASE_URL = 'http://localhost:5001/api';

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

