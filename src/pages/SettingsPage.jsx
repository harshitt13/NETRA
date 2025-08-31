// import React, { useState } from 'react';
// import Header from '../components/common/Header';
// import Sidebar from '../components/common/Sidebar';
// import { Settings, User, Key, Database, Sun, Moon, Save, RefreshCw, Trash2 } from 'lucide-react';

// // A reusable card component for different settings sections
// const SettingsCard = ({ title, icon: Icon, children }) => (
//     <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 animate-fadeInUp">
//         <div className="flex items-center space-x-3 mb-4">
//             <div className="bg-purple-500/20 p-2 rounded-lg">
//                 <Icon className="h-6 w-6 text-purple-400" />
//             </div>
//             <h2 className="text-xl font-bold">{title}</h2>
//         </div>
//         <div className="space-y-4">
//             {children}
//         </div>
//     </div>
// );

// // A reusable input field component
// const InputField = ({ label, id, type = 'text', value, onChange, placeholder }) => (
//     <div>
//         <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
//         <input
//             type={type}
//             id={id}
//             value={value}
//             onChange={onChange}
//             placeholder={placeholder}
//             className="w-full bg-gray-900/70 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
//         />
//     </div>
// );

// const SettingsPage = () => {
//     // --- State Management for Settings ---
//     const [profile, setProfile] = useState({ displayName: 'Senior Investigator', email: 'investigator@netra.gov' });
//     const [apiKey, setApiKey] = useState('AIzaSy...wdVEIMk'); // Using a masked key for display
//     const [theme, setTheme] = useState('dark');

//     // Handlers for updating state (in a real app, these would also make API calls)
//     const handleProfileChange = (e) => {
//         setProfile({ ...profile, [e.target.id]: e.target.value });
//     };

//     const handleSaveProfile = () => {
//         // Mock API call
//         console.log("Saving profile:", profile);
//         alert("User profile updated successfully!");
//     };

//     const handleSaveApiKey = () => {
//         console.log("Saving API Key:", apiKey);
//         alert("Gemini API Key saved!");
//     };
    
//     const handleDataAction = (action) => {
//         const confirmation = window.confirm(`Are you sure you want to ${action.replace('-', ' ')}? This action cannot be undone.`);
//         if (confirmation) {
//             console.log(`Performing data action: ${action}`);
//             alert(`Data action '${action}' initiated successfully!`);
//         }
//     };


//     return (
//         <div className="flex h-screen bg-gray-900 text-white font-sans">
//             <Sidebar />
//             <div className="flex-1 flex flex-col overflow-hidden">
//                 <Header />
//                 <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900/50 p-6 pt-24">
//                     <div className="max-w-4xl mx-auto">
//                         {/* Page Header */}
//                         <div className="mb-8 flex items-center space-x-3 animate-fadeIn">
//                             <div className="bg-purple-500/20 p-2 rounded-lg">
//                                 <Settings className="h-8 w-8 text-purple-400" />
//                             </div>
//                             <div>
//                                 <h1 className="text-3xl font-bold text-gray-100">Application Settings</h1>
//                                 <p className="text-gray-400">Manage your profile, API keys, and data configurations.</p>
//                             </div>
//                         </div>

//                         {/* Settings Grid */}
//                         <div className="space-y-8">
//                             {/* User Profile Settings */}
//                             <SettingsCard title="User Profile" icon={User}>
//                                 <InputField
//                                     label="Display Name"
//                                     id="displayName"
//                                     value={profile.displayName}
//                                     onChange={handleProfileChange}
//                                 />
//                                 <InputField
//                                     label="Email Address"
//                                     id="email"
//                                     type="email"
//                                     value={profile.email}
//                                     onChange={handleProfileChange}
//                                     placeholder="your-email@netra.gov"
//                                 />
//                                 <button
//                                     onClick={handleSaveProfile}
//                                     className="flex items-center justify-center w-full sm:w-auto mt-2 bg-purple-600/50 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition"
//                                 >
//                                     <Save className="h-4 w-4 mr-2" />
//                                     Save Profile
//                                 </button>
//                             </SettingsCard>

//                             {/* API Configuration */}
//                             <SettingsCard title="API Configuration" icon={Key}>
//                                 <InputField
//                                     label="Google Gemini API Key"
//                                     id="apiKey"
//                                     type="password"
//                                     value={apiKey}
//                                     onChange={(e) => setApiKey(e.target.value)}
//                                 />
//                                 <button
//                                      onClick={handleSaveApiKey}
//                                     className="flex items-center justify-center w-full sm:w-auto mt-2 bg-purple-600/50 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition"
//                                 >
//                                     <Save className="h-4 w-4 mr-2" />
//                                     Update API Key
//                                 </button>
//                             </SettingsCard>
                            
//                              {/* Data Management */}
//                             <SettingsCard title="Data Management" icon={Database}>
//                                 <p className="text-sm text-gray-400">Manage the synthetic dataset used by the application. Be careful, these actions are destructive.</p>
//                                 <div className="flex flex-col sm:flex-row gap-4 pt-2">
//                                      <button
//                                         onClick={() => handleDataAction('regenerate-dataset')}
//                                         className="flex flex-1 items-center justify-center space-x-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 px-4 py-2 rounded-lg transition"
//                                     >
//                                         <RefreshCw className="h-4 w-4" />
//                                         <span className="text-sm">Regenerate Dataset</span>
//                                     </button>
//                                      <button
//                                         onClick={() => handleDataAction('clear-all-cases')}
//                                         className="flex flex-1 items-center justify-center space-x-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 px-4 py-2 rounded-lg transition"
//                                     >
//                                         <Trash2 className="h-4 w-4" />
//                                         <span className="text-sm">Clear All Cases</span>
//                                     </button>
//                                 </div>
//                             </SettingsCard>

//                             {/* Appearance Settings */}
//                             <SettingsCard title="Appearance" icon={theme === 'dark' ? Moon : Sun}>
//                                 <div className="flex items-center justify-between">
//                                     <p className="text-gray-300">Theme</p>
//                                     <div className="relative inline-flex items-center cursor-pointer bg-gray-700 p-1 rounded-full">
//                                         <button onClick={() => setTheme('dark')} className={`px-4 py-1 text-sm rounded-full transition ${theme === 'dark' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}>Dark</button>
//                                         <button onClick={() => setTheme('light')} className={`px-4 py-1 text-sm rounded-full transition ${theme === 'light' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}>Light</button>
//                                     </div>
//                                 </div>
//                             </SettingsCard>
//                         </div>
//                     </div>
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default SettingsPage;

import React, { useState } from 'react';
import Header from '../components/common/Header.jsx';
import Sidebar from '../components/common/Sidebar.jsx';
import Button from '../components/common/Button.jsx'; // Assuming you have a custom Button component
import { Settings, User, Key, Database, Sun, Moon, RefreshCw, Trash2 } from 'lucide-react';
import { regenerateDataset, clearAllCases } from '../services/api.js'; // Import the new API functions

// A reusable card component for different settings sections
const SettingsCard = ({ title, icon: Icon, children }) => (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 animate-fadeInUp">
        <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-500/20 p-2 rounded-lg">
                <Icon className="h-6 w-6 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

// A reusable input field component
const InputField = ({ label, id, type = 'text', value, onChange, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-gray-900/70 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
        />
    </div>
);

const SettingsPage = () => {
    // --- State Management for Settings ---
    const [profile, setProfile] = useState({ displayName: 'Senior Investigator', email: 'investigator@netra.gov' });
    const [apiKey, setApiKey] = useState('AIzaSy...wdVEIMk');
    const [theme, setTheme] = useState('dark');
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    const showFeedback = (message, type) => {
        setFeedback({ message, type });
        setTimeout(() => setFeedback({ message: '', type: '' }), 5000); // Hide after 5 seconds
    };

    const handleRegenerate = async () => {
        if (!window.confirm("Are you sure you want to regenerate the entire dataset? This will create new data and alerts.")) return;
        
        setIsRegenerating(true);
        try {
            const response = await regenerateDataset();
            showFeedback(response.message, 'success');
        } catch (error) {
            showFeedback(error.message || 'Failed to regenerate dataset.', 'error');
        } finally {
            setIsRegenerating(false);
        }
    };

    const handleClearCases = async () => {
        if (!window.confirm("Are you sure you want to delete ALL saved cases from the database? This action cannot be undone.")) return;

        setIsClearing(true);
        try {
            const response = await clearAllCases();
            showFeedback(response.message, 'success');
        } catch (error) {
            showFeedback(error.message || 'Failed to clear cases.', 'error');
        } finally {
            setIsClearing(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900/50 p-6 pt-24">
                    <div className="max-w-4xl mx-auto">
                        {/* Page Header */}
                        <div className="mb-8 flex items-center space-x-3 animate-fadeIn">
                            <div className="bg-purple-500/20 p-2 rounded-lg">
                                <Settings className="h-8 w-8 text-purple-400" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-100">Application Settings</h1>
                                <p className="text-gray-400">Manage your profile, API keys, and data configurations.</p>
                            </div>
                        </div>

                        {/* Feedback Message */}
                        {feedback.message && (
                            <div className={`p-4 mb-4 rounded-lg text-white ${feedback.type === 'success' ? 'bg-green-500/30' : 'bg-red-500/30'}`}>
                                {feedback.message}
                            </div>
                        )}

                        <div className="space-y-8">
                            <SettingsCard title="User Profile" icon={User}>
                                {/* User profile form... */}
                            </SettingsCard>

                            <SettingsCard title="API Configuration" icon={Key}>
                                {/* API Key form... */}
                            </SettingsCard>
                            
                            <SettingsCard title="Data Management" icon={Database}>
                                <p className="text-sm text-gray-400">Manage the synthetic dataset used by the application. Be careful, these actions are destructive.</p>
                                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                    <Button
                                        onClick={handleRegenerate}
                                        isLoading={isRegenerating}
                                        disabled={isRegenerating || isClearing}
                                        variant="secondary"
                                        className="flex-1"
                                        icon={RefreshCw}
                                    >
                                        Regenerate Dataset
                                    </Button>
                                    <Button
                                        onClick={handleClearCases}
                                        isLoading={isClearing}
                                        disabled={isRegenerating || isClearing}
                                        variant="danger"
                                        className="flex-1"
                                        icon={Trash2}
                                    >
                                        Clear All Cases
                                    </Button>
                                </div>
                            </SettingsCard>

                            <SettingsCard title="Appearance" icon={theme === 'dark' ? Moon : Sun}>
                                {/* Theme toggle... */}
                            </SettingsCard>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SettingsPage;

