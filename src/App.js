import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Activity, 
  Cloud, 
  Globe,
  Github,
  Linkedin,
  Menu,
  X,
  Newspaper,
  Zap,
  Bell
} from 'lucide-react';

// Components (these would be imported from actual component files)
import CryptoView from './components/CryptoView';
import CovidView from './components/CovidView';
import WeatherView from './components/WeatherView';
import CountriesView from './components/CountriesView';
import NewsView from './components/NewsView';

// Unique Artistic Color Scheme - Consistent Across Dashboard
const designSystem = {
  primary: 'from-orange-400 via-rose-500 to-pink-600',
  secondary: 'from-cyan-400 via-blue-500 to-indigo-600',
  accent: 'from-emerald-400 via-teal-500 to-cyan-600',
  dark: 'from-slate-900 via-purple-900 to-slate-900',
  glow: 'from-orange-500 to-pink-500',
  glowCyan: 'from-cyan-500 to-blue-500',
  text: {
    primary: 'text-orange-300',
    secondary: 'text-cyan-300',
    accent: 'text-emerald-300'
  }
};

// Animated Background with Unique Artistic Elements
const ArtisticBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Primary Gradient Orb - Orange/Rose */}
      <motion.div
        className={`absolute w-96 h-96 bg-gradient-to-br ${designSystem.primary} rounded-full blur-3xl opacity-25`}
        animate={{
          x: [0, 150, -100, 0],
          y: [0, -150, 100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{ top: '-5%', right: '-10%' }}
      />
      
      {/* Secondary Gradient Orb - Cyan/Blue */}
      <motion.div
        className={`absolute w-80 h-80 bg-gradient-to-br ${designSystem.secondary} rounded-full blur-3xl opacity-20`}
        animate={{
          x: [-150, 50, 150, -150],
          y: [50, -100, 0, 50],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{ bottom: '-10%', left: '-5%' }}
      />

      {/* Tertiary Gradient Orb - Emerald/Teal */}
      <motion.div
        className={`absolute w-72 h-72 bg-gradient-to-br ${designSystem.accent} rounded-full blur-3xl opacity-15`}
        animate={{
          x: [100, -100, 50, 100],
          y: [-50, 100, -100, -50],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{ top: '50%', right: '10%' }}
      />

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full opacity-40"
          style={{
            background: i % 3 === 0 
              ? 'linear-gradient(45deg, #fb7185, #f97316)' 
              : i % 3 === 1 
              ? 'linear-gradient(45deg, #06b6d4, #3b82f6)'
              : 'linear-gradient(45deg, #10b981, #14b8a6)',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%'
          }}
          animate={{
            y: [0, -150],
            opacity: [0.4, 0],
            x: Math.sin(i) * 100
          }}
          transition={{
            duration: Math.random() * 5 + 4,
            repeat: Infinity,
            ease: 'easeOut'
          }}
        />
      ))}
    </div>
  );
};

// Subtle Grid Background
const GridBackground = () => {
  return (
    <div className="fixed inset-0 opacity-5 pointer-events-none">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
};

function App() {
  const [selectedData, setSelectedData] = useState('news');
  const [theme, setTheme] = useState('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const dataOptions = [
    { 
      id: 'news', 
      name: 'Tech News', 
      icon: Newspaper,
      description: 'Latest tech headlines',
      component: NewsView
    },
    { 
      id: 'crypto', 
      name: 'Cryptocurrency', 
      icon: TrendingUp,
      description: 'Real-time crypto market data',
      component: CryptoView
    },
    { 
      id: 'covid', 
      name: 'COVID-19 Stats', 
      icon: Activity,
      description: 'Global health metrics',
      component: CovidView
    },
    { 
      id: 'weather', 
      name: 'Weather Forecast', 
      icon: Cloud,
      description: 'Live weather conditions',
      component: WeatherView
    },
    { 
      id: 'countries', 
      name: 'Countries Data', 
      icon: Globe,
      description: 'World population data',
      component: CountriesView
    },
    
  ];

  const currentOption = dataOptions.find(opt => opt.id === selectedData);
  const CurrentComponent = currentOption.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Animated Artistic Background */}
      <ArtisticBackground />
      <GridBackground />

      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="hidden lg:flex flex-col w-72 bg-gradient-to-b from-slate-950/95 via-slate-900/95 to-slate-950/95 backdrop-blur-2xl border-r border-orange-500/20"
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-orange-500/20">
            <motion.div 
              className="flex items-center space-x-3 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                className={`w-12 h-12 bg-gradient-to-br ${designSystem.primary} rounded-xl flex items-center justify-center shadow-2xl shadow-orange-500/50`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-orange-300 to-pink-300 bg-clip-text text-transparent">Nexus</h2>
                <p className="text-xs text-slate-400">Analytics Engine</p>
              </div>
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {dataOptions.map((option, idx) => (
              <motion.button
                key={option.id}
                onClick={() => {
                  setSelectedData(option.id);
                  setMobileMenuOpen(false);
                }}
                whileHover={{ x: 8 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all relative group overflow-hidden ${
                  selectedData === option.id
                    ? 'text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {/* Gradient Background on Active */}
                {selectedData === option.id && (
                  <motion.div
                    layoutId="active-bg"
                    className={`absolute inset-0 bg-gradient-to-r ${designSystem.primary} opacity-30`}
                    initial={false}
                  />
                )}
                
                {/* Border glow on active */}
                {selectedData === option.id && (
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-padding pointer-events-none opacity-50" />
                )}
                
                <motion.div className="relative z-10">
                  <option.icon className="w-5 h-5 flex-shrink-0" />
                </motion.div>

                <div className="text-left flex-1 relative z-10">
                  <p className="font-semibold text-sm">{option.name}</p>
                  <p className="text-xs opacity-70">{option.description}</p>
                </div>

                {selectedData === option.id && (
                  <motion.div 
                    className="w-2.5 h-2.5 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full relative z-10"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.8, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-orange-500/20 space-y-3 bg-gradient-to-b from-slate-900/50 to-slate-950/50">
            <motion.div 
              className="flex items-center space-x-2 text-xs text-slate-400 px-2"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <motion.div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
              <span>Live Updates Active</span>
            </motion.div>
            <div className="flex space-x-2">
              <a
                href="https://github.com/abiddasurkar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 p-2 rounded-lg bg-slate-800/50 hover:bg-gradient-to-br hover:from-orange-600/30 hover:to-pink-600/30 transition-all backdrop-blur-sm border border-slate-700/50 flex items-center justify-center group"
              >
                <motion.div whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.9 }}>
                  <Github className="w-4 h-4 text-slate-400 group-hover:text-orange-300 transition-colors" />
                </motion.div>
              </a>
              <a
                href="https://www.linkedin.com/in/abiddasurkar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 p-2 rounded-lg bg-slate-800/50 hover:bg-gradient-to-br hover:from-orange-600/30 hover:to-pink-600/30 transition-all backdrop-blur-sm border border-slate-700/50 flex items-center justify-center group"
              >
                <motion.div whileHover={{ scale: 1.2, rotate: 10 }} whileTap={{ scale: 0.9 }}>
                  <Linkedin className="w-4 h-4 text-slate-400 group-hover:text-orange-300 transition-colors" />
                </motion.div>
              </a>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-gradient-to-r from-slate-950/50 via-slate-900/50 to-slate-950/50 backdrop-blur-2xl border-b border-orange-500/20 shadow-2xl">
            <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-slate-800/50 hover:bg-gradient-to-br hover:from-orange-600/30 hover:to-pink-600/30 backdrop-blur-sm border border-slate-700/50 transition-all"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>

              {/* Header Title */}
              <motion.div 
                className="flex-1 ml-4 lg:ml-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.h1 
                  key={selectedData}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold bg-gradient-to-r from-orange-300 via-pink-300 to-rose-300 bg-clip-text text-transparent"
                >
                  {currentOption.name}
                </motion.h1>
                <p className="text-sm text-cyan-300/80">{currentOption.description}</p>
              </motion.div>

              {/* Header Controls */}
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-lg border border-cyan-500/30 backdrop-blur-sm"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <motion.div 
                    className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-xs text-slate-300">Live Feed</span>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.08, rotate: 20 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-lg bg-slate-800/50 hover:bg-gradient-to-br hover:from-orange-600/30 hover:to-pink-600/30 backdrop-blur-sm border border-slate-700/50 transition-all text-xl"
                >
                  {theme === 'dark' ? '🌞' : '🌙'}
                </motion.button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <div className="px-4 sm:px-6 lg:px-8 py-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedData}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="mb-8"
                >
                  <CurrentComponent />
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-orange-500/20 bg-gradient-to-r from-slate-950/50 via-slate-900/50 to-slate-950/50 backdrop-blur-lg px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 text-xs text-slate-400">
              <p>
                Built by{' '}
                <a
                  href="https://abiddasurkar.github.io/portfolio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-orange-300 to-pink-300 bg-clip-text text-transparent hover:brightness-150 transition-all font-semibold"
                >
                  Abid Dasurkar
                </a>
              </p>
              <div className="flex space-x-4">
                <span>Public APIs</span>
                <span>•</span>
                <span>No tokens required</span>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed left-0 top-0 h-screen w-72 z-40 bg-gradient-to-b from-slate-950/95 via-slate-900/95 to-slate-950/95 backdrop-blur-2xl border-r border-orange-500/20 shadow-2xl overflow-y-auto"
            >
              <div className="p-6 border-b border-orange-500/20">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${designSystem.primary} rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/50`}>
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold bg-gradient-to-r from-orange-300 to-pink-300 bg-clip-text text-transparent">Nexus</h2>
                    <p className="text-xs text-slate-400">Analytics</p>
                  </div>
                </div>
              </div>

              <nav className="p-4 space-y-2">
                {dataOptions.map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() => {
                      setSelectedData(option.id);
                      setMobileMenuOpen(false);
                    }}
                    whileHover={{ x: 4 }}
                    className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all relative overflow-hidden ${
                      selectedData === option.id
                        ? 'text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {selectedData === option.id && (
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${designSystem.primary} opacity-30`}
                        layoutId="mobile-active"
                      />
                    )}
                    <option.icon className="w-5 h-5 relative z-10" />
                    <div className="text-left relative z-10">
                      <p className="font-semibold text-sm">{option.name}</p>
                      <p className="text-xs opacity-70">{option.description}</p>
                    </div>
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;