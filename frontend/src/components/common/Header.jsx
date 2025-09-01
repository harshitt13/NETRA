import React from "react";
import { LogOut, UserCircle, Bell } from "lucide-react";
import Button from "./Button.jsx"; // Assuming Button component is in the same folder
import { useAuth } from "../../hooks/useAuth.jsx"; // Import the real useAuth hook

// A smaller version of the logo for the header
const MiniNetraLogo = () => (
  <div className="flex items-center">
    <svg
      width="40"
      height="40"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50C150 50 180 100 100 100C20 100 50 50 100 50Z"
        stroke="#00AEEF"
        strokeWidth="12"
      />
      <circle cx="100" cy="100" r="30" fill="#00AEEF" />
      <circle cx="100" cy="100" r="15" fill="#FFFFFF" />
      <path
        d="M100 150C50 150 20 100 100 100C180 100 150 150 100 150Z"
        stroke="#00AEEF"
        strokeWidth="12"
      />
    </svg>
    <h1 className="text-2xl font-bold text-gray-200 ml-3 tracking-wider hidden sm:block">
      NETRA
    </h1>
  </div>
);

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 h-20 px-4 md:px-8 flex items-center justify-between 
                 bg-gray-900/50 backdrop-blur-lg border-b border-cyan-500/20 shadow-lg"
    >
      <div className="flex items-center space-x-4">
        <MiniNetraLogo />
      </div>

      <div className="flex items-center space-x-4 md:space-x-6">
        <button className="text-gray-400 hover:text-cyan-400 transition-colors relative">
          <Bell size={24} />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </button>

        <div className="flex items-center space-x-3 border-l border-gray-700 pl-4 md:pl-6">
          <UserCircle size={32} className="text-cyan-400" />
          <div className="text-left hidden md:block">
            <p className="text-sm font-semibold text-gray-200">{user?.email}</p>
            <p className="text-xs text-gray-400">Senior Investigator</p>
          </div>
        </div>

        <Button onClick={logout} variant="secondary" className="h-10 px-4">
          <LogOut size={18} className="md:mr-2" />
          <span className="hidden md:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
