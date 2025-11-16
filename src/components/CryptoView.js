import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const CryptoView = () => {
  const [cryptoData, setcryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCryptoData();
  }, []);

  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      // CoinGecko API - No token required
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=24h,7d'
      );
      setcryptoData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch cryptocurrency data');
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

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button 
          onClick={fetchCryptoData}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Top Cryptocurrencies
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time prices from CoinGecko (no API key required)
        </p>
      </div>

      {/* Crypto Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cryptoData.map((crypto) => (
          <div
            key={crypto.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img src={crypto.image} alt={crypto.name} className="w-10 h-10" />
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{crypto.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">{crypto.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Rank</p>
                <p className="font-bold text-gray-900 dark:text-white">#{crypto.market_cap_rank}</p>
              </div>
            </div>

            {/* Price */}
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {crypto.current_price.toLocaleString('en-US', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })}
                </p>
              </div>
            </div>

            {/* 24h Change */}
            <div className="flex items-center space-x-2 mb-4">
              {crypto.price_change_percentage_24h > 0 ? (
                <>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-green-500 font-semibold">
                    +{crypto.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-5 h-5 text-red-500" />
                  <span className="text-red-500 font-semibold">
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </>
              )}
              <span className="text-sm text-gray-500 dark:text-gray-400">24h</span>
            </div>

            {/* 7-day Sparkline */}
            {crypto.sparkline_in_7d && (
              <div className="h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={crypto.sparkline_in_7d.price.map((price, i) => ({ price, index: i }))}>
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke={crypto.price_change_percentage_24h > 0 ? '#10b981' : '#ef4444'}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Market Cap */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Market Cap</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  ${(crypto.market_cap / 1e9).toFixed(2)}B
                </span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-500 dark:text-gray-400">Volume (24h)</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  ${(crypto.total_volume / 1e9).toFixed(2)}B
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoView;