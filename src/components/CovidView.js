import React, { useState, useEffect } from 'react';
import { Activity, Users, AlertCircle, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

const CovidView = () => {
  const [indiaData, setIndiaData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCovidData();
  }, []);

  const fetchCovidData = async () => {
    try {
      setLoading(true);
      
      // Current India data - disease.sh API (no token required)
      const currentResponse = await axios.get('https://disease.sh/v3/covid-19/countries/India');
      setIndiaData(currentResponse.data);

      // Historical data for charts
      const historicalResponse = await axios.get(
        'https://disease.sh/v3/covid-19/historical/India?lastdays=30'
      );
      
      const timeline = historicalResponse.data.timeline;
      const chartData = Object.keys(timeline.cases).slice(-14).map(date => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        cases: timeline.cases[date],
        deaths: timeline.deaths[date],
        recovered: timeline.recovered[date]
      }));
      
      setHistoricalData(chartData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch COVID-19 data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !indiaData) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button 
          onClick={fetchCovidData}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
  
  const pieData = [
    { name: 'Active', value: indiaData.active },
    { name: 'Recovered', value: indiaData.recovered },
    { name: 'Deaths', value: indiaData.deaths }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">COVID-19 India Statistics</h2>
            <p className="text-blue-100">Real-time data from disease.sh</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 text-blue-100">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Updated: {new Date(indiaData.updated).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cases */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-8 h-8 text-blue-500" />
            <span className="text-xs font-semibold text-blue-500 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
              +{indiaData.todayCases.toLocaleString()} today
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Cases</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {indiaData.cases.toLocaleString()}
          </p>
        </div>

        {/* Active Cases */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 text-orange-500" />
            <span className="text-xs font-semibold text-orange-500 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded-full">
              Active
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Active Cases</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {indiaData.active.toLocaleString()}
          </p>
        </div>

        {/* Recovered */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <span className="text-xs font-semibold text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
              +{indiaData.todayRecovered.toLocaleString()} today
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Recovered</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {indiaData.recovered.toLocaleString()}
          </p>
        </div>

        {/* Deaths */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-red-500" />
            <span className="text-xs font-semibold text-red-500 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">
              +{indiaData.todayDeaths.toLocaleString()} today
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Deaths</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {indiaData.deaths.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - 14 Day Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            14-Day Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
              <Line type="monotone" dataKey="cases" stroke="#3b82f6" strokeWidth={2} name="Cases" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Case Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${((entry.value / indiaData.cases) * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#fff'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Tests Conducted</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {indiaData.tests.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Population</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {(indiaData.population / 1e9).toFixed(2)}B
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">Cases per Million</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {indiaData.casesPerOneMillion.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CovidView;