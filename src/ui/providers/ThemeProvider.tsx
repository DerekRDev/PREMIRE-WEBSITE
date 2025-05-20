import React, { createContext, useContext } from 'react';
import theme from '../design-system/theme';

// Create theme context
const ThemeContext = createContext(theme);

// Custom hook to use the theme
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;