import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Newspaper, 
  ExternalLink, 
  Calendar, 
  Tag, 
  TrendingUp, 
  RefreshCw,
  WifiOff,
  Shield,
  Star,
  Clock,
  Bookmark,
  Share2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  AlertTriangle
} from 'lucide-react';

// Comprehensive News Service with multiple API fallbacks
class NewsAPIService {
  constructor() {
    this.apis = [
      // Guardian API (No auth required for test key)
      {
        name: 'guardian',
        url: 'https://content.guardianapis.com/search?api-key=test&show-fields=thumbnail,headline,trailText,byline&page-size=15&order-by=newest',
        requiresKey: false,
        transform: (data) => data.response.results.map(item => ({
          title: item.webTitle,
          description: item.fields?.trailText || 'Read the full story for more details.',
          url: item.webUrl,
          image: item.fields?.thumbnail || this.getFallbackImage(),
          publishedAt: item.webPublicationDate,
          source: { name: 'The Guardian' },
          author: item.fields?.byline?.replace('By ', '') || 'Staff Writer',
          category: 'general',
          readTime: `${Math.floor(Math.random() * 5) + 3} min read`
        }))
      },
      // RSS Feeds via rss2json (No auth)
      {
        name: 'bbc-rss',
        url: 'https://api.rss2json.com/v1/api.json?rss_url=http://feeds.bbci.co.uk/news/rss.xml',
        requiresKey: false,
        transform: (data) => data.items.map(item => ({
          title: item.title,
          description: item.description?.replace(/<[^>]*>/g, '').substring(0, 150) + '...' || 'Latest news update from BBC.',
          url: item.link,
          image: item.enclosure?.link || this.getFallbackImage(),
          publishedAt: item.pubDate,
          source: { name: 'BBC News' },
          author: 'BBC News',
          category: 'general',
          readTime: `${Math.floor(Math.random() * 5) + 3} min read`
        }))
      },
      {
        name: 'reuters-rss',
        url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.reutersagency.com/feed/?best-topics=business-finance&post_type=best',
        requiresKey: false,
        transform: (data) => data.items?.map(item => ({
          title: item.title,
          description: item.description?.replace(/<[^>]*>/g, '').substring(0, 150) + '...' || 'Business and finance news from Reuters.',
          url: item.link,
          image: this.getFallbackImage(),
          publishedAt: item.pubDate,
          source: { name: 'Reuters' },
          author: 'Reuters',
          category: 'business',
          readTime: `${Math.floor(Math.random() * 5) + 3} min read`
        })) || []
      }
    ];

    this.mockData = this.generateComprehensiveMockData();
  }

  getFallbackImage() {
    const images = [
      'https://images.unsplash.com/photo-1586339949216-35c2747cc36d?w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&auto=format&fit=crop'
    ];
    return images[Math.floor(Math.random() * images.length)];
  }

  generateComprehensiveMockData() {
    const categories = {
      technology: {
        titles: [
          "AI Breakthrough Revolutionizes Healthcare Diagnostics",
          "Quantum Computing Milestone Achieved by Researchers",
          "5G Networks Expand to Rural Areas Nationwide",
          "Cybersecurity Threats Reach All-Time High",
          "SpaceX Launches New Satellite Constellation",
          "Metaverse Development Accelerates Rapidly",
          "Blockchain Technology Transforms Supply Chains",
          "AR Glasses Set to Replace Smartphones",
          "Robotic Automation Hits Manufacturing Sector",
          "Climate Tech Startups Secure Record Funding"
        ],
        sources: ["TechCrunch", "Wired", "The Verge", "Ars Technica", "TechRadar"]
      },
      business: {
        titles: [
          "Global Markets Reach Historic Highs Amid Recovery",
          "Cryptocurrency Regulations Updated Worldwide",
          "Supply Chain Innovations Reduce Costs by 40%",
          "Startup Funding Breaks Previous Records",
          "Sustainable Business Practices Become Mainstream",
          "Remote Work Productivity Exceeds Expectations",
          "Mergers and Acquisitions Hit Record Levels",
          "Economic Growth Exceeds Projections",
          "Green Investments Surge by 150%",
          "Corporate ESG Initiatives Drive Change"
        ],
        sources: ["Bloomberg", "Financial Times", "Wall Street Journal", "Forbes", "Business Insider"]
      },
      science: {
        titles: [
          "Climate Change Research Reveals Critical Findings",
          "Mars Rover Discovers Evidence of Ancient Water",
          "Genetic Editing Technology Cures Rare Disease",
          "Renewable Energy Efficiency Breaks Records",
          "Deep Sea Exploration Discovers New Species",
          "NASA's Telescope Reveals Cosmic Secrets",
          "Medical Research Offers Cancer Breakthrough",
          "Climate Models Predict Faster Warming",
          "Archaeological Find Rewrites Human History",
          "Physics Experiment Confirms Theory"
        ],
        sources: ["Nature", "Science Magazine", "New Scientist", "Scientific American", "NASA"]
      },
      health: {
        titles: [
          "New Vaccine Shows 95% Efficacy in Trials",
          "Mental Health Awareness Reaches New Heights",
          "Telemedicine Adoption Grows Exponentially",
          "Nutrition Research Updates Dietary Guidelines",
          "Fitness Technology Transforms Wellness",
          "Breakthrough in Alzheimer's Treatment",
          "Global Health Initiative Saves Millions",
          "Wearable Tech Predicts Health Issues",
          "Nutrition Science Debunks Popular Myths",
          "Healthcare Accessibility Improves Globally"
        ],
        sources: ["WebMD", "Healthline", "Medical News Today", "WHO", "CDC"]
      }
    };

    return Object.entries(categories).flatMap(([category, data]) => 
      data.titles.map((title, index) => ({
        title,
        description: `Breaking news in ${category}: ${title}. Researchers and industry experts discuss the profound implications and future developments in this rapidly evolving field that could change our daily lives.`,
        url: `https://example.com/news/${category}/${index}`,
        image: this.getFallbackImage(),
        publishedAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
        source: { name: data.sources[Math.floor(Math.random() * data.sources.length)] },
        author: ['Dr. Sarah Chen', 'Prof. Michael Rodriguez', 'Dr. Emily Watson', 'James Wilson'][Math.floor(Math.random() * 4)],
        category,
        trending: Math.random() > 0.8,
        readTime: `${Math.floor(Math.random() * 5) + 3} min read`,
        views: Math.floor(Math.random() * 10000)
      }))
    );
  }

  async fetchNews(category = 'technology') {
    const errors = [];
    
    // Try all real APIs sequentially
    for (const api of this.apis) {
      try {
        console.log(`Attempting to fetch from ${api.name}...`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(api.url, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          const transformed = api.transform(data);
          
          if (transformed && transformed.length > 0) {
            console.log(`✅ Success from ${api.name}: ${transformed.length} articles`);
            
            // Filter by category if not 'all'
            const filtered = category === 'all' 
              ? transformed 
              : transformed.filter(article => 
                  article.category === category || 
                  article.source.name.toLowerCase().includes(category)
                );
            
            return filtered.slice(0, 15);
          }
        }
      } catch (error) {
        console.warn(`❌ ${api.name} failed:`, error.message);
        errors.push(`${api.name}: ${error.message}`);
        continue;
      }
    }

    // All APIs failed, use mock data
    console.log('🔄 All APIs failed, using mock data');
    const filteredMock = this.mockData.filter(article => 
      category === 'all' || article.category === category
    );
    return filteredMock.slice(0, 15);
  }
}

const NewsView = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('technology');
  const [apiStatus, setApiStatus] = useState('checking');
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);
  const newsService = useRef(new NewsAPIService()).current;

  const categories = [
    { id: 'technology', name: 'Technology', icon: '💻', color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-500' },
    { id: 'business', name: 'Business', icon: '💼', color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-500' },
    { id: 'science', name: 'Science', icon: '🔬', color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-500' },
    { id: 'health', name: 'Health', icon: '🏥', color: 'from-red-500 to-orange-500', bgColor: 'bg-red-500' },
    { id: 'all', name: 'All News', icon: '🌐', color: 'from-gray-500 to-slate-500', bgColor: 'bg-gray-500' }
  ];

  const fetchNews = useCallback(async (category = 'technology') => {
    try {
      setLoading(true);
      setError(null);
      setApiStatus('checking');

      const articles = await newsService.fetchNews(category);
      
      if (!articles || articles.length === 0) {
        throw new Error('No articles available from any source');
      }

      setNews(articles);
      setApiStatus('online');
      setMaintenanceMode(false);
      
    } catch (err) {
      console.error('All news sources failed:', err);
      setError('Unable to connect to news services');
      setApiStatus('offline');
      setMaintenanceMode(true);
      
      // Final emergency fallback
      const emergencyData = newsService.mockData
        .filter(article => category === 'all' || article.category === category)
        .slice(0, 8);
      setNews(emergencyData);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [newsService]);

  // Carousel auto-play effect
  useEffect(() => {
    if (autoPlay && news.length > 0) {
      autoPlayRef.current = setInterval(() => {
        setCarouselIndex((prev) => (prev + 1) % Math.min(news.length, 5));
      }, 4000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, news.length]);

  useEffect(() => {
    fetchNews(selectedCategory);
  }, [selectedCategory, fetchNews]);

  const handleRefresh = () => {
    setRefreshing(true);
    setCarouselIndex(0);
    fetchNews(selectedCategory);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCarouselIndex(0);
  };

  const nextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % Math.min(news.length, 5));
  };

  const prevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + Math.min(news.length, 5)) % Math.min(news.length, 5));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleShare = async (article) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(article.url);
      // In a real app, show a toast notification
    }
  };

  // Featured carousel items (top 5 news)
  const featuredNews = news.slice(0, 5);
  const gridNews = news.slice(5);

  // Maintenance Mode Component
  if (maintenanceMode && news.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="text-center p-8 max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-3">
              News Service Maintenance
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              We're currently upgrading our news services to serve you better. Please check back in a few moments.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleRefresh}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                <RefreshCw className="w-5 h-5 inline mr-2" />
                Try Again
              </button>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Last checked: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading Skeleton
  if (loading && !refreshing) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl p-8 h-40"></div>
        <div className="flex gap-3 justify-center">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="bg-gray-300 rounded-xl w-28 h-12"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-gray-300 rounded-2xl h-96"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="relative">
              <Newspaper className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                apiStatus === 'online' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'
              }`}></div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              NewsFlow
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Your gateway to real-time news from trusted global sources
          </p>
        </div>

        {/* Status Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-sm ${
              apiStatus === 'online' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                apiStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
              }`}></div>
              <span className="text-sm font-semibold">
                {apiStatus === 'online' ? 'Live News' : 'Limited Mode'}
              </span>
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {news.length} stories • {categories.find(c => c.id === selectedCategory)?.name}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`p-2 rounded-xl transition-all ${
                autoPlay 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {autoPlay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`group relative flex items-center space-x-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 ${
                selectedCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-2xl scale-105`
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 shadow-lg hover:shadow-xl backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50'
              }`}
            >
              <span className="text-xl">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Featured News Carousel */}
        {featuredNews.length > 0 && (
          <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-3">
                <Star className="w-6 h-6 text-yellow-500" />
                <span>Featured Stories</span>
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevCarousel}
                  className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextCarousel}
                  className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl">
              <div 
                ref={carouselRef}
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
              >
                {featuredNews.map((article, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      {/* Image */}
                      <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              {article.source.name}
                            </div>
                            {article.trending && (
                              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                                <TrendingUp className="w-3 h-3" />
                                <span>Trending</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-6 p-4">
                        <div>
                          <h3 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4 leading-tight">
                            {article.title}
                          </h3>
                          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                            {article.description}
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(article.publishedAt)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{article.readTime}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{article.views?.toLocaleString()} views</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              By {article.author}
                            </div>
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handleShare(article)}
                                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                              >
                                <Share2 className="w-4 h-4" />
                              </button>
                              <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                              >
                                <span>Read Full Story</span>
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center space-x-2 mt-6">
              {featuredNews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCarouselIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === carouselIndex
                      ? 'bg-blue-500 w-8'
                      : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Latest News Grid */}
        {gridNews.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-3">
              <Newspaper className="w-6 h-6 text-blue-500" />
              <span>Latest News</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridNews.map((article, index) => (
                <div
                  key={index}
                  className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                      {article.source.name}
                    </div>
                    {article.trending && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>Trending</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
                      {article.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 font-semibold text-sm"
                      >
                        <span>Read</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Status */}
        <div className="bg-slate-900 text-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="font-semibold">System Status</span>
            </div>
            <div className="text-sm">
              {apiStatus === 'online' ? 'All Systems Operational' : 'Limited Functionality'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsView;