import { createContext, useContext, useState, useEffect, useRef } from 'react';

// Create the theme context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Get initial theme from localStorage or default to 'dark'
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('netra-theme');
      return savedTheme || 'dark';
    } catch {
      return 'dark';
    }
  });
  const [loading, setLoading] = useState(false);
  const saveTimer = useRef(null);
  const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace(/\/$/, '');

  // Initial fetch from backend (if available)
  useEffect(() => {
    const fetchRemoteTheme = async () => {
      try {
        const stored = localStorage.getItem('netra-theme-fetched');
        if (stored) return; // already synced once this session
        const token = window?.currentUser?.getIdToken ? await window.currentUser.getIdToken() : null; // optional
        const res = await fetch(`${API_BASE}/settings/theme`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
            if (data.theme && (data.theme === 'dark' || data.theme === 'light')) {
              setTheme(data.theme);
              localStorage.setItem('netra-theme', data.theme);
            }
          localStorage.setItem('netra-theme-fetched', '1');
        }
      } catch (e) {
        // Silent fail – backend theme not critical
        console.warn('Theme fetch skipped:', e);
      }
    };
    fetchRemoteTheme();
  }, [API_BASE]);

  // Apply theme changes to the document
  useEffect(() => {
    try {
      // Remove existing theme classes
      document.documentElement.classList.remove('light', 'dark');
      
      // Add the current theme class
      document.documentElement.classList.add(theme);
      
      // Save theme to localStorage
      localStorage.setItem('netra-theme', theme);
    } catch (error) {
      console.warn('Could not apply theme:', error);
    }
  }, [theme]);

  // Function to set a specific theme
  const setSpecificTheme = (newTheme) => {
    if (newTheme !== 'light' && newTheme !== 'dark') return;
    setTheme(newTheme);
    // Debounced persistence to backend
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        setLoading(true);
        const token = window?.currentUser?.getIdToken ? await window.currentUser.getIdToken() : null;
        await fetch(`${API_BASE}/settings/theme`, {
          method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify({ theme: newTheme })
        });
      } catch (e) {
        console.warn('Failed to persist theme:', e);
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const value = {
    theme,
    setTheme: setSpecificTheme,
    isDark: theme === 'dark',
  isLight: theme === 'light',
  themeSaving: loading
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
