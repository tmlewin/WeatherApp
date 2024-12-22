import React from 'react';
import { Palette } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

const ThemeSelector = () => {
  const { currentTheme, changeTheme, themes } = useDarkMode();

  return (
    <div className="relative group">
      <button
        className="p-2 rounded-lg transition-colors duration-200
          dark:bg-gray-800 dark:hover:bg-gray-700
          bg-gray-100 hover:bg-gray-200"
        aria-label="Change theme"
      >
        <Palette className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
      
      <div className="absolute right-0 mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible">
        {Object.keys(themes).map((theme) => (
          <button
            key={theme}
            onClick={() => changeTheme(theme)}
            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700
              ${currentTheme === theme ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full ${themes[theme].accent}`} />
              <span className="capitalize dark:text-white">{theme}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector; 