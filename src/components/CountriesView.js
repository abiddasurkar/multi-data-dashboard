import React, { useState, useEffect } from 'react';
import { Globe, Users, MapPin, DollarSign, Languages, Search } from 'lucide-react';
import axios from 'axios';

const CountriesView = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCountriesData();
  }, []);

  useEffect(() => {
    filterCountries();
  }, [searchQuery, selectedRegion, countries]);

  const fetchCountriesData = async () => {
    try {
      setLoading(true);
      // Corrected API call with required fields filtering
      const response = await axios.get(
        'https://restcountries.com/v3.1/all?fields=name,flags,capital,region,subregion,population,currencies,languages,area,cca3'
      );
      const sortedCountries = response.data.sort((a, b) => 
        b.population - a.population
      );
      setCountries(sortedCountries);
      setFilteredCountries(sortedCountries.slice(0, 20));
      setError(null);
    } catch (err) {
      setError('Failed to fetch countries data. Please try again later.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterCountries = () => {
    let filtered = [...countries];

    // Filter by region
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(country => 
        country.region?.toLowerCase() === selectedRegion.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(country =>
        country.name?.common?.toLowerCase().includes(query) ||
        (country.capital && country.capital[0]?.toLowerCase().includes(query)) ||
        country.name?.official?.toLowerCase().includes(query)
      );
    }

    setFilteredCountries(filtered.slice(0, 50));
  };

  // Alternative API endpoints you can use:
  const alternativeEndpoints = {
    byRegion: (region) => `https://restcountries.com/v3.1/region/${region}`,
    byName: (name) => `https://restcountries.com/v3.1/name/${name}`,
    byCode: (code) => `https://restcountries.com/v3.1/alpha/${code}`,
  };

  const regions = ['all', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  // Format population with commas
  const formatPopulation = (pop) => {
    return pop ? pop.toLocaleString() : 'N/A';
  };

  // Format area with commas
  const formatArea = (area) => {
    return area ? area.toLocaleString() : 'N/A';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-600 dark:text-gray-400">Loading countries data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button 
          onClick={fetchCountriesData}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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
        <div className="flex items-center space-x-3 mb-2">
          <Globe className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Countries Explorer
          </h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Data from REST Countries API - {countries.length} countries available
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by country name, capital, or official name..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Region Filter */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          >
            {regions.map(region => (
              <option key={region} value={region}>
                {region === 'all' ? 'All Regions' : region}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400 px-2">
        Showing {filteredCountries.length} of {countries.length} countries
        {selectedRegion !== 'all' && ` in ${selectedRegion}`}
        {searchQuery && ` matching "${searchQuery}"`}
      </div>

      {/* Countries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCountries.map((country) => (
          <div
            key={country.cca3}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {/* Flag & Name */}
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={country.flags?.svg || country.flags?.png}
                alt={`${country.name?.common} flag`}
                className="w-16 h-12 object-cover rounded shadow-md border border-gray-200"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div 
                className="w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs text-gray-500 hidden"
              >
                No flag
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                  {country.name?.common || 'Unknown Country'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {country.name?.official}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
              {/* Capital */}
              {country.capital && country.capital[0] && (
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">Capital:</span>
                  <span className="font-semibold text-gray-900 dark:text-white truncate">
                    {country.capital[0]}
                  </span>
                </div>
              )}

              {/* Region */}
              <div className="flex items-center space-x-2 text-sm">
                <Globe className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">Region:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {country.region || 'N/A'} 
                  {country.subregion && ` (${country.subregion})`}
                </span>
              </div>

              {/* Population */}
              <div className="flex items-center space-x-2 text-sm">
                <Users className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-400">Population:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatPopulation(country.population)}
                </span>
              </div>

              {/* Currencies */}
              {country.currencies && Object.keys(country.currencies).length > 0 && (
                <div className="flex items-center space-x-2 text-sm">
                  <DollarSign className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400">Currency:</span>
                  <span className="font-semibold text-gray-900 dark:text-white truncate">
                    {Object.values(country.currencies)[0]?.name} 
                    {Object.values(country.currencies)[0]?.symbol && 
                      ` (${Object.values(country.currencies)[0]?.symbol})`
                    }
                  </span>
                </div>
              )}

              {/* Languages */}
              {country.languages && Object.keys(country.languages).length > 0 && (
                <div className="flex items-start space-x-2 text-sm">
                  <Languages className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <span className="text-gray-600 dark:text-gray-400">Languages:</span>
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {Object.values(country.languages).slice(0, 2).join(', ')}
                      {Object.values(country.languages).length > 2 && '...'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Area */}
            {country.area && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Area</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatArea(country.area)} km²
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredCountries.length === 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No countries found
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default CountriesView;