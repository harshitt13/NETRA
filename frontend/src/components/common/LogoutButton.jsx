    import React from 'react';
    import { useNavigate } from 'react-router-dom';
    import { auth } from '../../firebase/firebase.js';
    import { signOut } from 'firebase/auth';
    import { LogOut } from 'lucide-react';

    const LogoutButton = () => {
      const navigate = useNavigate();

      const handleLogout = async () => {
        try {
          await signOut(auth);
          // Redirect to login page after successful logout
          navigate('/login');
        } catch (error) {
          console.error("Error signing out: ", error);
        }
      };

      return (
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
          <span className="hidden md:inline">Logout</span>
        </button>
      );
    };

    export default LogoutButton;
    
