import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Activity, 
  Cloud, 
  Globe,
  Github,
  Linkedin,
  ChevronRight,
  Newspaper,
  Sparkles,
  Zap,
  LayoutDashboard,
  Menu,
  X,
  Sun,
  Moon,
  Cpu,
  BarChart3,
  Satellite
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dataOptions = [
    { 
      id: 'crypto', 
      name: 'Cryptocurrency', 
      icon: TrendingUp,
      description: 'Real-time market data',
      component: CryptoView,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
      color: 'text-purple-400'
    },
    { 
      id: 'covid', 
      name: 'COVID-19 Stats', 
      icon: Activity,
      description: 'Global health data',
      component: CovidView,
      gradient: 'from-red-500 to-orange-500',
      bgGradient: 'from-red-500/10 to-orange-500/10',
      color: 'text-red-400'
    },
    { 
      id: 'weather', 
      name: 'Weather', 
      icon: Cloud,
      description: 'Forecast & conditions',
      component: WeatherView,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
      color: 'text-blue-400'
    },
    { 
      id: 'countries', 
      name: 'Countries', 
      icon: Globe,
      description: 'Global demographics',
      component: CountriesView,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-500/10 to-emerald-500/10',
      color: 'text-green-400'
    },
    { 
      id: 'news', 
      name: 'Tech News', 
      icon: Newspaper,
      description: 'Latest headlines',
      component: NewsView,
      gradient: 'from-indigo-500 to-purple-500',
      bgGradient: 'from-indigo-500/10 to-purple-500/10',
      color: 'text-indigo-400'
    }
  ];

  const currentOption = dataOptions.find(opt => opt.id === selectedData);
  const CurrentComponent = currentOption.component;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/10 transition-all duration-500">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-300/10 dark:bg-cyan-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg' 
            : 'backdrop-blur-lg bg-white/60 dark:bg-slate-900/60'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all lg:hidden"
              >
                <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></div>
              </div>
              
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Nexus Dashboard
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Real-time Analytics Platform
                </p>
              </div>
            </motion.div>

            {/* Theme Toggle & Social Links */}
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all group"
                title="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
                ) : (
                  <Moon className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                )}
              </button>
              
              <div className="flex items-center space-x-2">
                <a
                  href="https://github.com/abiddasurkar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all group"
                  title="GitHub"
                >
                  <Github className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform" />
                </a>
                <a
                  href="https://www.linkedin.com/in/abiddasurkar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all group hidden sm:flex"
                  title="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Sidebar */}
      <motion.div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 transform transition-transform duration-500 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0`}
        initial={false}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Data Modules
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
              >
                <X className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Select a data module to explore
            </p>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-6 space-y-2">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              {dataOptions.map((option, index) => (
                <motion.button
                  key={option.id}
                  variants={itemVariants}
                  onClick={() => {
                    setSelectedData(option.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 group ${
                    selectedData === option.id
                      ? `bg-gradient-to-r ${option.bgGradient} border border-${option.color}/20 shadow-lg`
                      : 'bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/80 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${
                    selectedData === option.id
                      ? `bg-gradient-to-r ${option.gradient} text-white shadow-lg`
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform'
                  }`}>
                    <option.icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <h3 className={`font-semibold transition-colors ${
                      selectedData === option.id
                        ? 'text-slate-800 dark:text-slate-200'
                        : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                    }`}>
                      {option.name}
                    </h3>
                    <p className={`text-sm transition-colors ${
                      selectedData === option.id
                        ? 'text-slate-600 dark:text-slate-400'
                        : 'text-slate-500 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400'
                    }`}>
                      {option.description}
                    </p>
                  </div>

                  <ChevronRight className={`w-4 h-4 transition-all ${
                    selectedData === option.id
                      ? `text-${option.color} transform scale-125`
                      : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                  }`} />
                </motion.button>
              ))}
            </motion.div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-slate-200/50 dark:border-slate-700/50">
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl p-4 border border-purple-500/20">
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Live Data
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Updated in real-time
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="lg:pl-80">
        <motion.main 
          className="min-h-screen pt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Content Header */}
          <div className="border-b border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className={`p-3 rounded-2xl bg-gradient-to-r ${currentOption.bgGradient} border border-${currentOption.color}/20`}>
                  <currentOption.icon className={`w-6 h-6 ${currentOption.color}`} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                    {currentOption.name}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    {currentOption.description}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Component Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedData}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ 
                  duration: 0.4,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                {/* Animated background for current component */}
                <div className={`absolute inset-0 -z-10 opacity-5 bg-gradient-to-br ${currentOption.gradient} rounded-3xl blur-3xl`}></div>
                
                <CurrentComponent />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.main>

        {/* Footer */}
        <motion.footer 
          className="border-t border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
              {/* Brand */}
              <motion.div 
                className="flex items-center space-x-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Nexus Dashboard
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Built with modern technologies
                  </p>
                </div>
              </motion.div>

              {/* Links */}
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-8 text-sm">
                <div className="flex items-center space-x-6 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Satellite className="w-4 h-4 text-green-500" />
                    <span>Live APIs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    <span>Real-time Data</span>
                  </div>
                </div>
                
                <div className="h-4 w-px bg-slate-300 dark:bg-slate-600 hidden sm:block"></div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-center sm:text-left"
                >
                  <p className="text-slate-600 dark:text-slate-400">
                    Crafted by{' '}
                    <a
                      href="https://abiddasurkar.github.io/portfolio/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 transition-all"
                    >
                      Abid Dasurkar
                    </a>
                  </p>
                </motion.div>
              </div>
            </div>
            
            {/* Bottom Bar */}
            <motion.div 
              className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-xs text-slate-500 dark:text-slate-500">
                Powered by public APIs • No authentication required • Built with React & Tailwind CSS
              </p>
            </motion.div>
          </div>
        </motion.footer>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;