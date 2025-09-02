// import React from 'react';
// import AlertCard from './AlertCard';
// import Loader from '../common/Loader'; // We'll use our loader for fetching state

// // --- Placeholder for actual API fetching hook ---
// const useAlerts = () => {
//   // In a real app, this would be `useFetchData('/api/alerts')`
//   // For now, we'll simulate a loading state and then show mock data.
//   const isLoading = false; // Set to true to see the loader
//   const error = null;
//   const data = [
//     {
//       person_id: 'PER-001',
//       person_name: 'Rohan Mehra',
//       risk_score: 92,
//       summary: 'High-value property purchase inconsistent with declared income and links to shell companies.',
//       timestamp: '2025-08-31T12:34:56Z'
//     },
//     {
//       person_id: 'PER-002',
//       person_name: 'Priya Sharma',
//       risk_score: 87,
//       summary: 'Multiple cash deposits under reporting threshold detected (Structuring).',
//       timestamp: '2025-08-30T09:15:22Z'
//     },
//     {
//         person_id: 'PER-003',
//         person_name: 'Vikram Singh',
//         risk_score: 75,
//         summary: 'Transactions identified with newly incorporated company with low paid-up capital.',
//         timestamp: '2025-08-29T18:45:10Z'
//     },
//      {
//         person_id: 'PER-004',
//         person_name: 'Aisha Khan',
//         risk_score: 65,
//         summary: 'Unusual rapid movement of funds to multiple unrelated accounts.',
//         timestamp: '2025-08-28T23:59:01Z'
//     }
//   ];
//   return { data, isLoading, error };
// };
// // --- End of Placeholder ---

// const AlertsList = () => {
//   const { data: alerts, isLoading, error } = useAlerts();

//   if (isLoading) {
//     return <Loader />;
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-64 bg-red-900/30 border border-red-500/50 rounded-lg">
//         <p className="text-red-300 text-xl">Error fetching alerts: {error.message}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
//       {alerts && alerts.map((alert) => (
//         <AlertCard key={alert.person_id} alert={alert} />
//       ))}
//     </div>
//   );
// };

// export default AlertsList;

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../common/Loader";
import { AlertCircle, User, ArrowRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.jsx";

const AlertsList = ({ refetchTrigger }) => {
  const { user } = useAuth();
  const [alerts, setAlerts] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  const fetchAlerts = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await user.getIdToken();
      const res = await fetch(`${API_BASE_URL}/alerts?limit=30`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        throw new Error(`Failed to load alerts (${res.status})`);
      }
      const data = await res.json();
      setAlerts(data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, user]);

  useEffect(() => { if (user) fetchAlerts(); }, [user, fetchAlerts]);

  // --- IMPORTANT: This effect listens for changes to the trigger ---
  // When the parent component changes 'refetchTrigger', this will run.
  useEffect(() => {
    // Don't refetch on the initial render (when trigger is 0)
    if (refetchTrigger > 0) fetchAlerts();
  }, [refetchTrigger, fetchAlerts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 text-red-300 p-4 rounded-lg flex items-center space-x-3">
        <AlertCircle className="h-6 w-6" />
        <div>
          <h3 className="font-bold">Failed to load alerts.</h3>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-gray-800/50 text-gray-400 p-4 rounded-lg text-center">
        <p>
          No high-priority alerts found. Run the analysis to generate new
          alerts.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
      {alerts.map((alert) => (
        <div
          key={alert.person_id}
          className="bg-gray-800/60 p-5 rounded-xl border border-gray-700 flex flex-col justify-between hover:border-cyan-500 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-3">
                <User className="h-6 w-6 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">
                  {alert.full_name}
                </h3>
              </div>
              <span className="bg-red-500/20 text-red-300 text-lg font-bold rounded-full h-12 w-12 flex items-center justify-center border-2 border-red-400">
                {alert.final_risk_score}
              </span>
            </div>
            <p className="text-gray-400 mb-4 h-16">{alert.summary}</p>
          </div>
          <Link
            to={`/triage/${alert.person_id}`}
            className="group mt-auto flex items-center justify-center w-full bg-cyan-600/50 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition-all"
          >
            Triage Case
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      ))}
    </div>
  );
};

export default AlertsList;
