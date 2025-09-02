import { useState } from 'react';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import { FileDown, BookCheck, Loader2 } from 'lucide-react';
import useFetchData from '../hooks/useFetchData';
import { useAuth } from '../hooks/useAuth';

const Reporting = () => {
    // --- THIS IS THE FIX: The URL no longer includes the '/api' prefix ---
    const { data: cases, loading: isLoading, error } = useFetchData('/cases');
    const [loadingStates, setLoadingStates] = useState({});
    const { user } = useAuth(); // Get user to provide token for downloads

    // --- A functional report generation handler ---
        const API_BASE = (import.meta.env?.VITE_API_URL || 'http://localhost:5001/api').replace(/\/$/, '');

        const handleGenerateReport = async (caseId, subjectName) => {
        setLoadingStates(prev => ({ ...prev, [caseId]: true }));
        
        try {
            if (!user) throw new Error("Authentication required.");
            const token = await user.getIdToken();
                        const reportUrl = `${API_BASE}/report/${caseId}`;
                        const response = await fetch(reportUrl, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });

            if (!response.ok) {
                                // Try to parse JSON error; if not possible use status text
                                let serverErr = '';
                                try { serverErr = (await response.json()).error; } catch(_) { /* ignore */ }
                                throw new Error(serverErr || `Report generation failed (HTTP ${response.status}).`);
            }

            // Handle the file download
                        const contentType = response.headers.get('Content-Type') || '';
                        if (!contentType.includes('application/pdf')) {
                            // Unexpected content type, attempt to parse error
                            try {
                                const errData = await response.json();
                                throw new Error(errData.error || 'Server returned non-PDF response.');
                            } catch(parseErr) {
                                throw new Error('Server returned unexpected non-PDF content.');
                            }
                        }
                        const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = downloadUrl;
            const fileName = `Investigation_Report_${subjectName.replace(/\s+/g, '_')}_${caseId}.pdf`;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);

        } catch (err) {
            console.error('Report generation failed:', err);
            alert(`Failed to generate report: ${err.message}`);
        } finally {
            setLoadingStates(prev => ({ ...prev, [caseId]: false }));
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900/50 p-6 pt-24">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-6 flex items-center space-x-3 animate-fadeIn">
                            <div className="bg-green-500/20 p-2 rounded-lg">
                                <BookCheck className="h-8 w-8 text-green-400" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-100">Reporting Center</h1>
                                <p className="text-gray-400">Generate and download final investigation reports for escalated cases.</p>
                            </div>
                        </div>

                        <div className="w-full bg-gray-900/60 backdrop-blur-md border border-cyan-500/20 rounded-lg shadow-lg overflow-hidden animate-fadeInUp">
                            {isLoading ? (
                                <div className="flex justify-center items-center h-64">
                                    <Loader2 className="h-8 w-8 animate-spin text-cyan-400"/>
                                    <span className="ml-4 text-lg text-gray-300">Loading Completed Cases...</span>
                                </div>
                            ) : error ? (
                                <div className="p-8 text-center text-red-400">
                                    <p>Failed to load cases: {error.message}</p>
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="bg-gray-800/50">
                                        <tr>
                                            <th className="p-4 text-sm font-semibold text-gray-300 tracking-wider">Case ID</th>
                                            <th className="p-4 text-sm font-semibold text-gray-300 tracking-wider">Subject</th>
                                            <th className="p-4 text-sm font-semibold text-gray-300 tracking-wider">Final Risk Score</th>
                                            <th className="p-4 text-sm font-semibold text-gray-300 tracking-wider">Date Escalated</th>
                                            <th className="p-4 text-sm font-semibold text-gray-300 tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700/50">
                                        {cases && cases.map((caseItem) => (
                                            <tr key={caseItem.caseId} className="hover:bg-gray-800/40 transition-colors">
                                                <td className="p-4 text-cyan-400 font-mono text-sm">{caseItem.caseId}</td>
                                                <td className="p-4 text-gray-200">{caseItem.subject}</td>
                                                <td className="p-4 font-semibold text-orange-400">{caseItem.riskScore}</td>
                                                <td className="p-4 text-gray-400">{caseItem.conclusionDate}</td>
                                                <td className="p-4">
                                                    <button
                                                        onClick={() => handleGenerateReport(caseItem.caseId, caseItem.subject)}
                                                        className="flex items-center space-x-2 bg-cyan-600/50 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold text-xs py-2 px-3 rounded-lg transition"
                                                        disabled={loadingStates[caseItem.caseId]}
                                                    >
                                                        {loadingStates[caseItem.caseId] ? 
                                                            <Loader2 className="h-4 w-4 animate-spin"/> : 
                                                            <FileDown className="h-4 w-4" />
                                                        }
                                                        <span>{loadingStates[caseItem.caseId] ? 'Generating...' : 'Generate Report'}</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Reporting;

