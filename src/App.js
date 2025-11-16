import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Activity, 
  Cloud, 
  Globe,
  Github,
  Linkedin,
  ChevronDown,
  Newspaper
} from 'lucide-react';

// Components
import CryptoView from './components/CryptoView';
import CovidView from './components/CovidView';
import WeatherView from './components/WeatherView';
import CountriesView from './components/CountriesView';
import NewsView from './components/NewsView';

function App() {
  const [selectedData, setSelectedData] = useState('crypto');
  const [theme, setTheme] = useState('dark');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const dataOptions = [
    { 
      id: 'crypto', 
      name: 'Cryptocurrency Prices', 
      icon: TrendingUp,
      description: 'Real-time crypto market data',
      component: CryptoView
    },
    { 
      id: 'covid', 
      name: 'COVID-19 Statistics', 
      icon: Activity,
      description: 'India & global COVID data',
      component: CovidView
    },
    { 
      id: 'weather', 
      name: 'Weather Forecast', 
      icon: Cloud,
      description: 'Current weather conditions',
      component: WeatherView
    },
    { 
      id: 'countries', 
      name: 'Countries Data', 
      icon: Globe,
      description: 'Population, currencies, flags',
      component: CountriesView
    },
    { 
      id: 'news', 
      name: 'Tech News', 
      icon: Newspaper,
      description: 'Latest technology headlines',
      component: NewsView
    }
  ];

  const currentOption = dataOptions.find(opt => opt.id === selectedData);
  const CurrentComponent = currentOption.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Multi-Data Dashboard
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Real-time Analytics</p>
              </div>
            </motion.div>

            {/* Data Source Dropdown */}
            <div className="relative flex-1 max-w-md mx-4">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <currentOption.icon className="w-5 h-5 text-blue-500" />
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {currentOption.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                      {currentOption.description}
                    </p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50"
                  >
                    {dataOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSelectedData(option.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          selectedData === option.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''
                        }`}
                      >
                        <option.icon className={`w-5 h-5 ${selectedData === option.id ? 'text-blue-500' : 'text-gray-400'}`} />
                        <div className="text-left flex-1">
                          <p className={`font-medium text-sm ${selectedData === option.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            {option.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {option.description}
                          </p>
                        </div>
                        {selectedData === option.id && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle & Social Links */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Toggle theme"
              >
                {theme === 'dark' ? '🌞' : '🌙'}
              </button>
              <a
                href="https://github.com/abiddasurkar"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="GitHub"
              >
                <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </a>
              <a
                href="https://www.linkedin.com/in/abiddasurkar"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedData}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentComponent />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Built by{' '}
              <a
                href="https://abiddasurkar.github.io/portfolio/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-500 hover:text-blue-600 transition-colors"
              >
                Abid Dasurkar
              </a>
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span>Data from public APIs</span>
              <span>•</span>
              <span>No API tokens required</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;