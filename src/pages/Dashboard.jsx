import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header.jsx';
import Sidebar from '../components/common/Sidebar.jsx';
import AlertsList from '../components/dashboard/AlertsList.jsx';
import useFetchData from '../hooks/useFetchData.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { LayoutDashboard, Search, User, FileText, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth(); // Hook to get the current user for auth tokens
    const [searchQuery, setSearchQuery] = useState('');
    const [analysisStatus, setAnalysisStatus] = useState({ loading: false, message: '', type: '' });
    
    // 1. This state is the "signal" to tell the AlertsList to refresh.
    const [refetchCounter, setRefetchCounter] = useState(0);

    // Custom hook for the live search functionality
    const { data: searchResults, loading: searchLoading, setUrl: setSearchUrl } = useFetchData(null);

    // Effect for debounced search (triggers when user stops typing)
    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchUrl(null); // Clear results if search is too short
            return;
        }
        const handler = setTimeout(() => {
            setSearchUrl(`/persons?q=${searchQuery}`);
        }, 500); // 500ms delay
        return () => clearTimeout(handler);
    }, [searchQuery, setSearchUrl]);

    // 2. This function triggers the backend's core analysis process.
    const handleRunAnalysis = async () => {
        setAnalysisStatus({ loading: true, message: 'Running money laundering pattern detection...', type: 'info' });
        
        try {
            const token = await user.getIdToken();
            const response = await fetch('http://localhost:5001/api/run-analysis', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Analysis failed to run.');
            }
            
            setAnalysisStatus({ loading: false, message: result.message, type: 'success' });
            
            // 3. IMPORTANT: After success, we change the signal to trigger a refresh.
            setRefetchCounter(prev => prev + 1);

        } catch (err) {
            setAnalysisStatus({ loading: false, message: err.message, type: 'error' });
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900/50 p-6 pt-24">
                    <div className="max-w-7xl mx-auto">
                        {/* Page Header and Analysis Button */}
                        <div className="mb-6 flex items-center justify-between animate-fadeIn">
                            <div className="flex items-center space-x-3">
                                <div className="bg-cyan-500/20 p-2 rounded-lg">
                                    <LayoutDashboard className="h-8 w-8 text-cyan-400" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-100">Intelligence Dashboard</h1>
                                    <p className="text-gray-400">Search for individuals or review prioritized alerts.</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleRunAnalysis}
                                disabled={analysisStatus.loading}
                                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-700 disabled:cursor-not-allowed"
                            >
                                <Zap className={`h-5 w-5 ${analysisStatus.loading ? 'animate-spin' : ''}`} />
                                <span>{analysisStatus.loading ? 'Analyzing...' : 'Run Full Analysis'}</span>
                            </button>
                        </div>
                        
                        {/* Analysis Status Message */}
                        {analysisStatus.message && (
                            <div className={`mb-4 p-3 rounded-lg flex items-center space-x-2 text-sm animate-fadeInUp ${
                                analysisStatus.type === 'success' ? 'bg-green-500/20 text-green-300' :
                                analysisStatus.type === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
                            }`}>
                                {analysisStatus.type === 'success' && <CheckCircle className="h-5 w-5" />}
                                {analysisStatus.type === 'error' && <AlertCircle className="h-5 w-5" />}
                                <span>{analysisStatus.message}</span>
                            </div>
                        )}

                        {/* Search Bar */}
                        <div className="mb-8 relative animate-fadeIn">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for a person by name or ID (e.g., 'Rohan Mehra' or 'PER00123')..."
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        {/* Search Results Display */}
                        {searchQuery.length >= 2 && (
                            <div className="mb-8 animate-fadeInUp">
                                 <h2 className="text-xl font-semibold mb-4 text-gray-300">Search Results</h2>
                                 {searchLoading && <p className="text-gray-400">Searching...</p>}
                                 {!searchLoading && searchResults && searchResults.length > 0 && (
                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                         {searchResults.map(person => (
                                             <div key={person.person_id} className="bg-gray-800/60 p-4 rounded-lg border border-gray-700 hover:border-cyan-500 transition">
                                                 <div className="flex items-center space-x-3 mb-2"><User className="text-cyan-400" /><h3 className="font-bold text-lg text-white">{person.full_name}</h3></div>
                                                 <p className="text-sm text-gray-400 mb-4">{person.person_id}</p>
                                                 <Link to={`/triage/${person.person_id}`} className="flex items-center justify-center w-full bg-cyan-600/50 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                                                     <FileText className="mr-2 h-4 w-4" /> View Details
                                                 </Link>
                                             </div>
                                         ))}
                                     </div>
                                 )}
                                  {!searchLoading && searchResults && searchResults.length === 0 && (
                                      <p className="text-gray-400">No results found for "{searchQuery}".</p>
                                 )}
                            </div>
                        )}

                        {/* Alerts List */}
                        <div className="animate-fadeInUp">
                            <h2 className="text-xl font-semibold mb-4 text-gray-300">High-Priority Alerts</h2>
                            <AlertsList refetchTrigger={refetchCounter} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;

