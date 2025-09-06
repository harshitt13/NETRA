import { createContext, useState, useEffect, useRef } from 'react';
import { getTheme as apiGetTheme, setTheme as apiSetTheme } from '../services/api.js';

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

  // Initial fetch from backend (if available)
  useEffect(() => {
    const fetchRemoteTheme = async () => {
      try {
        const stored = localStorage.getItem('netra-theme-fetched');
        if (stored) return; // already synced once this session
        const data = await apiGetTheme();
        if (data?.theme && (data.theme === 'dark' || data.theme === 'light')) {
          setTheme(data.theme);
          localStorage.setItem('netra-theme', data.theme);
        }
        localStorage.setItem('netra-theme-fetched', '1');
      } catch {
        // Silent fail – backend theme not critical
      }
    };
    fetchRemoteTheme();
  }, []);

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
      if (import.meta.env?.DEV) console.warn('Could not apply theme:', error);
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
        await apiSetTheme(newTheme);
      } catch {
        // ignore persistence errors
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

export default ThemeContext;
