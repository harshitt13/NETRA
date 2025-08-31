import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // <-- 1. Import the useAuth hook
import { Eye, EyeOff, LogIn } from 'lucide-react';

// SVG Logo Component for NETRA (no changes needed here)
const NetraLogo = () => (
    <div className="flex items-center justify-center mb-6">
        <svg width="100" height="100" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50C150 50 180 100 100 100C20 100 50 50 100 50Z" stroke="#00AEEF" strokeWidth="8"/>
            <circle cx="100" cy="100" r="30" fill="#00AEEF"/>
            <circle cx="100" cy="100" r="15" fill="#FFFFFF"/>
            <path d="M100 150C50 150 20 100 100 100C180 100 150 150 100 150Z" stroke="#00AEEF" strokeWidth="8"/>
            <style>{`
                @keyframes pulse {
                    0%, 100% { fill: #00AEEF; }
                    50% { fill: #9EFF00; }
                }
                circle:nth-of-type(1) { animation: pulse 4s infinite; }
            `}</style>
        </svg>
        <h1 className="text-5xl font-bold text-gray-200 ml-4 tracking-wider">NETRA</h1>
    </div>
);


const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    // --- 2. Get the login function and navigation hook ---
    const { login } = useAuth();
    const navigate = useNavigate();

    // --- 3. Update the handleLogin function ---
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Call the actual login function from our auth hook
            await login(email, password);
            // On success, navigate to the main dashboard
            navigate('/dashboard');
        } catch (err) {
            // If login fails, the auth hook throws an error. We catch it here.
            setError(err.message || "Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-300 font-sans"
             style={{ 
                 backgroundImage: `
                     radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0),
                     radial-gradient(circle at 25px 25px, rgba(255,255,255,0.05) 1px, transparent 0)
                 `,
                 backgroundSize: '50px 50px'
             }}>
            <div 
                className="w-full max-w-md p-8 space-y-8 rounded-2xl shadow-2xl bg-gray-800/60 backdrop-blur-xl border border-cyan-500/30"
            >
                <NetraLogo />
                
                <h2 className="text-center text-2xl font-light text-cyan-400">
                    Financial Crimes Investigation Portal
                </h2>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="relative">
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="peer w-full h-12 px-4 text-lg text-gray-100 bg-gray-900/50 border-2 border-gray-600 rounded-lg placeholder-transparent focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                            placeholder="Investigator ID"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label 
                            htmlFor="email-address"
                            className="absolute left-4 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-cyan-400 peer-focus:text-sm"
                        >
                            Investigator ID
                        </label>
                    </div>

                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            required
                            className="peer w-full h-12 px-4 text-lg text-gray-100 bg-gray-900/50 border-2 border-gray-600 rounded-lg placeholder-transparent focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                            placeholder="Secure Access Key"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label 
                            htmlFor="password"
                            className="absolute left-4 -top-3.5 text-gray-400 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-cyan-400 peer-focus:text-sm"
                        >
                            Secure Access Key
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-cyan-400"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {error && <p className="text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-900 transition-all duration-300 ease-in-out disabled:bg-gray-600 disabled:cursor-not-allowed overflow-hidden"
                        >
                            <span className="absolute left-0 top-0 h-full w-0 bg-cyan-500 transition-all duration-500 group-hover:w-full"></span>
                            <span className="relative flex items-center">
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="mr-2" size={24} />
                                        Authenticate
                                    </>
                                )}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
