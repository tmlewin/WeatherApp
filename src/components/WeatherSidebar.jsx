import React from 'react';
import {
  Cloud,
  Map,
  Calendar,
  BarChart2,
  Compass,
  Activity,
  AlertTriangle,
  Sun,
  Lightbulb,
  Moon,
} from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import ThemeSelector from './ThemeSelector';
import { useDarkMode } from '../contexts/DarkModeContext';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors rounded-lg
      ${active 
        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium' 
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </button>
);

const WeatherSidebar = ({ activeView, onViewChange }) => {
  const { currentTheme, themes } = useDarkMode();
  const navigationItems = [
    { id: 'current', label: 'Current Weather', icon: Cloud },
    { id: 'forecast', label: '5-Day Forecast', icon: Calendar },
    { id: 'map', label: 'Weather Map', icon: Map },
    { id: 'charts', label: 'Weather Charts', icon: BarChart2 },
    { id: 'radar', label: 'Weather Radar', icon: Compass },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'air-quality', label: 'Air Quality', icon: Sun },
  ];

  return (
    <div className="w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-lg p-4 space-y-2">
      <div className="mb-6">
        <div className="flex items-center justify-between px-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Weather Dashboard
          </h2>
          <div className="flex items-center gap-2">
            <ThemeSelector />
            <DarkModeToggle />
          </div>
        </div>
      </div>
      <nav className="space-y-1">
        {navigationItems.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeView === item.id}
            onClick={() => onViewChange(item.id)}
          />
        ))}
      </nav>
    </div>
  );
};

export default WeatherSidebar; 