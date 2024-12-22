import React, { createContext, useContext, useEffect, useState } from 'react';

const DarkModeContext = createContext();

const THEMES = {
  blue: {
    light: 'from-blue-100 via-blue-50 to-white',
    dark: 'from-gray-900 via-gray-800 to-gray-900',
    accent: 'text-blue-600 dark:text-blue-400'
  },
  purple: {
    light: 'from-purple-100 via-purple-50 to-white',
    dark: 'from-gray-900 via-purple-900 to-gray-900',
    accent: 'text-purple-600 dark:text-purple-400'
  },
  green: {
    light: 'from-green-100 via-green-50 to-white',
    dark: 'from-gray-900 via-green-900 to-gray-900',
    accent: 'text-green-600 dark:text-green-400'
  }
};

export function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return JSON.parse(savedMode);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'blue';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    localStorage.setItem('theme', currentTheme);
  }, [isDarkMode, currentTheme]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const changeTheme = (theme) => {
    setCurrentTheme(theme);
  };

  return (
    <DarkModeContext.Provider value={{ 
      isDarkMode, 
      toggleDarkMode, 
      currentTheme,
      changeTheme,
      themes: THEMES 
    }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
}; 