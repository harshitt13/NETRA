import { createContext, useContext, useState, useEffect } from 'react';

// Create the theme context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Get initial theme from localStorage or default to 'dark'
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('netra-theme');
      return savedTheme || 'dark';
    } catch (error) {
      console.warn('Could not access localStorage:', error);
      return 'dark';
    }
  });

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
    if (newTheme === 'light' || newTheme === 'dark') {
      setTheme(newTheme);
    }
  };

  const value = {
    theme,
    setTheme: setSpecificTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
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
