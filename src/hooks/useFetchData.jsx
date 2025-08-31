// import { useState, useEffect, useCallback } from 'react';
// import { auth } from '../firebase/firebaseConfig'; // <-- IMPORT FIREBASE AUTH

// const API_BASE_URL = 'http://localhost:5001/api';

// /**
//  * A custom React hook for fetching data from the backend API.
//  * It automatically includes the Firebase auth token.
//  */
// const useFetchData = (initialUrl) => {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [url, setUrl] = useState(initialUrl);

//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     setError(null);
    
//     // Get the currently logged-in user
//     const user = auth.currentUser;
//     if (!user) {
//       setError(new Error("No user is logged in."));
//       setLoading(false);
//       return;
//     }

//     try {
//       // Get the Firebase ID token
//       const token = await user.getIdToken();

//       // --- THIS IS THE KEY CHANGE ---
//       // Add the token to the request headers
//       const response = await fetch(`${API_BASE_URL}${url}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       // -----------------------------
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
//       }
      
//       const result = await response.json();
//       setData(result);

//     } catch (err) {
//       console.error("Fetch Error:", err);
//       setError(err);
//     } finally {
//       setLoading(false);
//     }
//   }, [url]);

//   useEffect(() => {
//     // Only fetch if there's a URL
//     if (url) {
//         fetchData();
//     } else {
//         setLoading(false);
//     }
//   }, [fetchData, url]);

//   const refetch = () => {
//     if (url) fetchData();
//   };

//   // Allow the component to change the URL to fetch new data
//   const setFetchUrl = (newUrl) => {
//     setUrl(newUrl);
//   };

//   return { data, loading, error, refetch, setFetchUrl };
// };

// export default useFetchData;





import { useState, useEffect, useCallback } from 'react';
// We are now using the useAuth hook to get the authenticated user state
import { useAuth } from './useAuth.jsx';

const API_BASE_URL = 'http://localhost:5001/api';

/**
 * A custom React hook for fetching data from the backend API.
 * It now handles authentication automatically and waits for the user to be authenticated.
 * @param {string} initialUrl - The initial API endpoint to fetch data from.
 * @returns {{data: any, loading: boolean, error: Error|null, refetch: function, setUrl: function}}
 */
const useFetchData = (initialUrl) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(initialUrl);
  
  // Get authentication state from our dedicated auth hook
  const { user, loading: authLoading } = useAuth();

  const fetchData = useCallback(async () => {
    // Don't fetch if the URL is null or empty
    if (!url) {
      setData(null);
      setLoading(false);
      return;
    }

    // Wait until Firebase has confirmed if a user is logged in or not
    if (authLoading) {
      return;
    }

    // If authentication is confirmed and there is no user, set an error
    if (!user) {
      setError(new Error("Authentication required. Please sign in."));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Get the token from the now-confirmed authenticated user
      const token = await user.getIdToken();

      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        let errorMessage = `HTTP error! Status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If response body is not JSON, use the default HTTP error
        }
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      setData(result);

    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, user, authLoading]); // Dependencies now include user and auth state

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Function to allow components to manually trigger a refetch
  const refetch = () => {
    fetchData();
  };

  // We return 'setUrl' so components can dynamically change the fetch URL
  return { data, loading, error, refetch, setUrl };
};

export default useFetchData;

