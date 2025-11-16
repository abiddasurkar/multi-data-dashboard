// src/services.js
// Weather API using Open-Meteo (FREE - NO API KEY REQUIRED)
// ENHANCED VERSION WITH ALL AVAILABLE FEATURES

import axios from "axios";

console.log("🟦 services.js loaded - ENHANCED VERSION");

// ================================================
// CONFIG
// ================================================

const OPEN_METEO_BASE = "https://api.open-meteo.com/v1";
const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1";

const axiosInstance = axios.create({
  baseURL: OPEN_METEO_BASE,
  timeout: 10000,
});

// ================================================
// GEOCODING API
// ================================================

export const searchCity = async (query, limit = 5) => {
  console.log("🔎 searchCity() called with →", query, "limit:", limit);

  try {
    const response = await axios.get(`${GEOCODING_API}/search`, {
      params: {
        name: query,
        count: limit,
        language: "en",
        format: "json",
      },
    });

    console.log("📦 Raw geocoding response:", response.data);

    const results = response.data.results || [];
    console.log("📍 Parsed city results:", results);

    return results;
  } catch (error) {
    console.error("❌ searchCity() ERROR:", error.message);
    throw new Error("Failed to search cities");
  }
};

// ================================================
// GET WEATHER BY CITY NAME
// ================================================

export const getWeather = async (city) => {
  console.log("🌤️ getWeather() called for city →", city);

  try {
    console.log("➡️ Step 1: Searching for city coordinates…");

    const cities = await searchCity(city, 1);

    console.log("🏙️ City search result:", cities);

    if (!cities || cities.length === 0) {
      console.warn("⚠️ No city found for:", city);
      throw new Error(`City "${city}" not found`);
    }

    const cityData = cities[0];
    console.log("📍 Using city coordinates:", cityData);

    console.log("➡️ Step 2: Fetching weather using coordinates…");

    const weather = await getWeatherByCoords(
      cityData.latitude,
      cityData.longitude
    );

    console.log("🌡️ Weather raw response:", weather);

    weather.name = cityData.name;
    weather.country = cityData.country;
    weather.region = cityData.admin1 || "";

    console.log("✨ Final merged weather:", weather);

    return weather;
  } catch (error) {
    console.error("❌ getWeather() ERROR:", error.message);
    throw error;
  }
};

// ================================================
// WEATHER BY COORDINATES
// ================================================

export const getWeatherByCoords = async (latitude, longitude) => {
  console.log("🗺️ getWeatherByCoords() →", { latitude, longitude });

  try {
    const response = await axiosInstance.get("/forecast", {
      params: {
        latitude,
        longitude,
        current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,is_day,pressure_msl",
        hourly: "temperature_2m,weather_code,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,wind_direction_10m,precipitation_probability",
        daily: "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant,sunrise,sunset",
        timezone: "auto",
        forecast_days: 7,
      },
    });

    console.log("📦 Raw weather API data:", response.data);

    const formatted = formatOpenMeteoResponse(response.data);

    console.log("🔧 Formatted weather →", formatted);

    return formatted;
  } catch (error) {
    console.error("❌ getWeatherByCoords() ERROR:", error.message);
    throw new Error("Failed to fetch weather data");
  }
};

// ================================================
// SOLAR RADIATION DATA
// ================================================

export const getSolarRadiation = async (
  latitude,
  longitude,
  tilt = 45,
  azimuth = 0,
  forecastDays = 7
) => {
  console.log("☀️ getSolarRadiation() →", {
    latitude,
    longitude,
    tilt,
    azimuth,
    forecastDays,
  });

  try {
    const response = await axiosInstance.get("/forecast", {
      params: {
        latitude,
        longitude,
        hourly: "shortwave_radiation,direct_radiation,direct_normal_irradiance,diffuse_radiation,global_tilted_irradiance",
        daily: "shortwave_radiation_sum",
        tilt,
        azimuth,
        timezone: "auto",
        forecast_days: forecastDays,
      },
    });

    console.log("📦 Solar radiation data:", response.data);

    return {
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      timezone: response.data.timezone,
      hourly: {
        time: response.data.hourly.time,
        shortwave_radiation: response.data.hourly.shortwave_radiation,
        direct_radiation: response.data.hourly.direct_radiation,
        direct_normal_irradiance: response.data.hourly.direct_normal_irradiance,
        diffuse_radiation: response.data.hourly.diffuse_radiation,
        global_tilted_irradiance: response.data.hourly.global_tilted_irradiance,
      },
      daily: {
        time: response.data.daily.time,
        shortwave_radiation_sum: response.data.daily.shortwave_radiation_sum,
      },
      units: response.data.hourly_units,
    };
  } catch (error) {
    console.error("❌ getSolarRadiation() ERROR:", error.message);
    throw new Error("Failed to fetch solar radiation data");
  }
};

// ================================================
// 15-MINUTELY FORECAST DATA
// ================================================

export const get15MinutelyForecast = async (latitude, longitude, days = 7) => {
  console.log("⏱️ get15MinutelyForecast() →", {
    latitude,
    longitude,
    days,
  });

  try {
    const response = await axiosInstance.get("/forecast", {
      params: {
        latitude,
        longitude,
        minutely_15: "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m,shortwave_radiation,lightning_potential",
        timezone: "auto",
        forecast_days: days,
      },
    });

    console.log("📦 15-minutely data:", response.data);

    return {
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      timezone: response.data.timezone,
      minutely_15: response.data.minutely_15,
      units: response.data.minutely_15_units,
      note: "Available in North America (HRRR) and Central Europe (ICON-D2, AROME). Other regions interpolated from hourly.",
    };
  } catch (error) {
    console.error("❌ get15MinutelyForecast() ERROR:", error.message);
    throw new Error("Failed to fetch 15-minutely forecast");
  }
};

// ================================================
// SOIL MOISTURE & TEMPERATURE DATA
// ================================================

export const getSoilMoistureData = async (latitude, longitude, days = 7) => {
  console.log("🌱 getSoilMoistureData() →", { latitude, longitude, days });

  try {
    const response = await axiosInstance.get("/forecast", {
      params: {
        latitude,
        longitude,
        hourly: "soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_temperature_54cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm,soil_moisture_27_to_81cm",
        timezone: "auto",
        forecast_days: days,
      },
    });

    console.log("📦 Soil data:", response.data);

    return {
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      timezone: response.data.timezone,
      hourly: {
        time: response.data.hourly.time,
        soil_temperature: {
          surface_0cm: response.data.hourly.soil_temperature_0cm,
          depth_6cm: response.data.hourly.soil_temperature_6cm,
          depth_18cm: response.data.hourly.soil_temperature_18cm,
          depth_54cm: response.data.hourly.soil_temperature_54cm,
        },
        soil_moisture: {
          layer_0_to_1cm: response.data.hourly.soil_moisture_0_to_1cm,
          layer_1_to_3cm: response.data.hourly.soil_moisture_1_to_3cm,
          layer_3_to_9cm: response.data.hourly.soil_moisture_3_to_9cm,
          layer_9_to_27cm: response.data.hourly.soil_moisture_9_to_27cm,
          layer_27_to_81cm: response.data.hourly.soil_moisture_27_to_81cm,
        },
      },
      units: response.data.hourly_units,
    };
  } catch (error) {
    console.error("❌ getSoilMoistureData() ERROR:", error.message);
    throw new Error("Failed to fetch soil data");
  }
};

// ================================================
// EVAPOTRANSPIRATION DATA
// ================================================

export const getEvapotranspirationData = async (latitude, longitude, days = 7) => {
  console.log("💧 getEvapotranspirationData() →", { latitude, longitude, days });

  try {
    const response = await axiosInstance.get("/forecast", {
      params: {
        latitude,
        longitude,
        hourly: "evapotranspiration,et0_fao_evapotranspiration",
        daily: "et0_fao_evapotranspiration",
        timezone: "auto",
        forecast_days: days,
      },
    });

    console.log("📦 Evapotranspiration data:", response.data);

    return {
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      timezone: response.data.timezone,
      hourly: {
        time: response.data.hourly.time,
        evapotranspiration: response.data.hourly.evapotranspiration,
        et0_fao_evapotranspiration: response.data.hourly.et0_fao_evapotranspiration,
      },
      daily: {
        time: response.data.daily.time,
        et0_fao_evapotranspiration: response.data.daily.et0_fao_evapotranspiration,
      },
      units: response.data.hourly_units,
    };
  } catch (error) {
    console.error("❌ getEvapotranspirationData() ERROR:", error.message);
    throw new Error("Failed to fetch evapotranspiration data");
  }
};

// ================================================
// HISTORICAL WEATHER DATA
// ================================================

export const getHistoricalWeather = async (
  latitude,
  longitude,
  startDate,
  endDate
) => {
  console.log("📊 getHistoricalWeather() →", {
    latitude,
    longitude,
    startDate,
    endDate,
  });

  try {
    const response = await axiosInstance.get("/forecast", {
      params: {
        latitude,
        longitude,
        start_date: startDate,
        end_date: endDate,
        hourly: "temperature_2m,weather_code,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m",
        daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max",
        timezone: "auto",
      },
    });

    console.log("📦 Historical weather data:", response.data);

    return {
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      timezone: response.data.timezone,
      period: { start: startDate, end: endDate },
      hourly: response.data.hourly,
      daily: response.data.daily,
      units: response.data.hourly_units,
    };
  } catch (error) {
    console.error("❌ getHistoricalWeather() ERROR:", error.message);
    throw new Error("Failed to fetch historical weather data");
  }
};

// ================================================
// VISIBILITY & ATMOSPHERIC DATA
// ================================================

export const getVisibilityData = async (latitude, longitude, days = 7) => {
  console.log("👁️ getVisibilityData() →", { latitude, longitude, days });

  try {
    const response = await axiosInstance.get("/forecast", {
      params: {
        latitude,
        longitude,
        hourly: "visibility,freezing_level_height",
        timezone: "auto",
        forecast_days: days,
      },
    });

    console.log("📦 Visibility data:", response.data);

    return {
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      timezone: response.data.timezone,
      hourly: {
        time: response.data.hourly.time,
        visibility: response.data.hourly.visibility,
        freezing_level_height: response.data.hourly.freezing_level_height,
      },
      units: response.data.hourly_units,
    };
  } catch (error) {
    console.error("❌ getVisibilityData() ERROR:", error.message);
    throw new Error("Failed to fetch visibility data");
  }
};

// ================================================
// SEVERE WEATHER PREDICTION (CAPE)
// ================================================

export const getSevereWeatherRisk = async (latitude, longitude, days = 7) => {
  console.log("⛈️ getSevereWeatherRisk() →", { latitude, longitude, days });

  try {
    const response = await axiosInstance.get("/forecast", {
      params: {
        latitude,
        longitude,
        hourly: "cape,weather_code",
        timezone: "auto",
        forecast_days: days,
      },
    });

    console.log("📦 Severe weather data:", response.data);

    return {
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      timezone: response.data.timezone,
      hourly: {
        time: response.data.hourly.time,
        cape: response.data.hourly.cape,
        weather_code: response.data.hourly.weather_code,
      },
      interpretation: {
        cape_low: "CAPE < 1000 J/kg - Low convective potential",
        cape_moderate: "CAPE 1000-2500 J/kg - Moderate thunderstorm potential",
        cape_high: "CAPE > 2500 J/kg - High severe weather risk",
      },
      units: response.data.hourly_units,
    };
  } catch (error) {
    console.error("❌ getSevereWeatherRisk() ERROR:", error.message);
    throw new Error("Failed to fetch severe weather data");
  }
};

// ================================================
// PLANT STRESS DATA (VAPOUR PRESSURE DEFICIT)
// ================================================

export const getPlantStressData = async (latitude, longitude, days = 7) => {
  console.log("🌿 getPlantStressData() →", { latitude, longitude, days });

  try {
    const response = await axiosInstance.get("/forecast", {
      params: {
        latitude,
        longitude,
        hourly: "vapour_pressure_deficit,relative_humidity_2m,temperature_2m",
        timezone: "auto",
        forecast_days: days,
      },
    });

    console.log("📦 Plant stress data:", response.data);

    return {
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      timezone: response.data.timezone,
      hourly: {
        time: response.data.hourly.time,
        vapour_pressure_deficit: response.data.hourly.vapour_pressure_deficit,
        relative_humidity_2m: response.data.hourly.relative_humidity_2m,
        temperature_2m: response.data.hourly.temperature_2m,
      },
      interpretation: {
        vpd_low: "VPD < 0.4 kPa - Low plant stress, reduced transpiration",
        vpd_moderate: "VPD 0.4-1.6 kPa - Optimal for most plants",
        vpd_high: "VPD > 1.6 kPa - High plant stress, increased transpiration",
      },
      units: response.data.hourly_units,
    };
  } catch (error) {
    console.error("❌ getPlantStressData() ERROR:", error.message);
    throw new Error("Failed to fetch plant stress data");
  }
};

// ================================================
// PRESSURE LEVEL VARIABLES (ALTITUDE DATA)
// ================================================

export const getWeatherPressureLevels = async (latitude, longitude, days = 7) => {
  console.log("🏔️ getWeatherPressureLevels() →", { latitude, longitude, days });

  try {
    const response = await axiosInstance.get("/forecast", {
      params: {
        latitude,
        longitude,
        hourly: "temperature_1000hPa,temperature_925hPa,temperature_850hPa,temperature_700hPa,temperature_500hPa,temperature_250hPa,relative_humidity_1000hPa,relative_humidity_925hPa,relative_humidity_850hPa,relative_humidity_700hPa,wind_speed_1000hPa,wind_speed_925hPa,wind_speed_850hPa,wind_speed_700hPa,wind_direction_1000hPa,wind_direction_925hPa,wind_direction_850hPa,wind_direction_700hPa,geopotential_height_1000hPa,geopotential_height_925hPa,geopotential_height_850hPa,geopotential_height_700hPa,geopotential_height_500hPa",
        timezone: "auto",
        forecast_days: days,
      },
    });

    console.log("📦 Pressure level data:", response.data);

    return {
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      timezone: response.data.timezone,
      pressure_levels: {
        "1000hPa": {
          altitude: "~110m",
          temperature: response.data.hourly.temperature_1000hPa,
          humidity: response.data.hourly.relative_humidity_1000hPa,
          wind_speed: response.data.hourly.wind_speed_1000hPa,
          wind_direction: response.data.hourly.wind_direction_1000hPa,
          geopotential_height: response.data.hourly.geopotential_height_1000hPa,
        },
        "925hPa": {
          altitude: "~800m",
          temperature: response.data.hourly.temperature_925hPa,
          humidity: response.data.hourly.relative_humidity_925hPa,
          wind_speed: response.data.hourly.wind_speed_925hPa,
          wind_direction: response.data.hourly.wind_direction_925hPa,
          geopotential_height: response.data.hourly.geopotential_height_925hPa,
        },
        "850hPa": {
          altitude: "~1500m",
          temperature: response.data.hourly.temperature_850hPa,
          humidity: response.data.hourly.relative_humidity_850hPa,
          wind_speed: response.data.hourly.wind_speed_850hPa,
          wind_direction: response.data.hourly.wind_direction_850hPa,
          geopotential_height: response.data.hourly.geopotential_height_850hPa,
        },
        "700hPa": {
          altitude: "~3km",
          temperature: response.data.hourly.temperature_700hPa,
          humidity: response.data.hourly.relative_humidity_700hPa,
          wind_speed: response.data.hourly.wind_speed_700hPa,
          wind_direction: response.data.hourly.wind_direction_700hPa,
          geopotential_height: response.data.hourly.geopotential_height_700hPa,
        },
        "500hPa": {
          altitude: "~5.6km",
          temperature: response.data.hourly.temperature_500hPa,
          wind_speed: response.data.hourly.wind_speed_1000hPa,
          geopotential_height: response.data.hourly.geopotential_height_500hPa,
        },
        "250hPa": {
          altitude: "~10.4km",
          temperature: response.data.hourly.temperature_250hPa,
        },
      },
      hourly: {
        time: response.data.hourly.time,
      },
      units: response.data.hourly_units,
    };
  } catch (error) {
    console.error("❌ getWeatherPressureLevels() ERROR:", error.message);
    throw new Error("Failed to fetch pressure level data");
  }
};

// ================================================
// MULTIPLE LOCATIONS (BATCH QUERY)
// ================================================

export const getWeatherMultipleLocations = async (locations) => {
  console.log("🗺️ getWeatherMultipleLocations() →", locations);

  try {
    const latitudes = locations.map((l) => l.latitude).join(",");
    const longitudes = locations.map((l) => l.longitude).join(",");

    const response = await axiosInstance.get("/forecast", {
      params: {
        latitude: latitudes,
        longitude: longitudes,
        current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,is_day,pressure_msl",
        hourly: "temperature_2m,weather_code,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,wind_direction_10m,precipitation_probability",
        daily: "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,wind_speed_10m_max,sunrise,sunset",
        timezone: "auto",
        forecast_days: 7,
      },
    });

    console.log("📦 Multiple locations weather data:", response.data);

    // Convert to array of formatted responses if multiple locations
    if (Array.isArray(response.data)) {
      return response.data.map((data, idx) => {
        const formatted = formatOpenMeteoResponse(data);
        formatted.location_id = idx;
        formatted.query_name = locations[idx].name;
        return formatted;
      });
    } else {
      const formatted = formatOpenMeteoResponse(response.data);
      formatted.query_name = locations[0].name;
      return [formatted];
    }
  } catch (error) {
    console.error("❌ getWeatherMultipleLocations() ERROR:", error.message);
    throw new Error("Failed to fetch weather for multiple locations");
  }
};

// ================================================
// CUSTOM TIME RANGE QUERY
// ================================================

export const getWeatherTimeRange = async (
  latitude,
  longitude,
  startDate,
  endDate
) => {
  console.log("📅 getWeatherTimeRange() →", {
    latitude,
    longitude,
    startDate,
    endDate,
  });

  try {
    const response = await axiosInstance.get("/forecast", {
      params: {
        latitude,
        longitude,
        start_date: startDate,
        end_date: endDate,
        start_hour: `${startDate}T00:00`,
        end_hour: `${endDate}T23:00`,
        hourly: "temperature_2m,weather_code,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,wind_direction_10m,precipitation_probability",
        daily: "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,wind_speed_10m_max,sunrise,sunset",
        timezone: "auto",
      },
    });

    console.log("📦 Time range weather data:", response.data);

    return {
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      timezone: response.data.timezone,
      period: { start: startDate, end: endDate },
      hourly: response.data.hourly,
      daily: response.data.daily,
      units: response.data.hourly_units,
    };
  } catch (error) {
    console.error("❌ getWeatherTimeRange() ERROR:", error.message);
    throw new Error("Failed to fetch weather for time range");
  }
};

// ================================================
// SEA/OCEAN WEATHER DATA
// ================================================

export const getSeaWeatherData = async (latitude, longitude, days = 7) => {
  console.log("🌊 getSeaWeatherData() →", { latitude, longitude, days });

  try {
    const response = await axiosInstance.get("/forecast", {
      params: {
        latitude,
        longitude,
        current: "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,wave_height,wave_direction,wave_period",
        hourly: "temperature_2m,precipitation,wind_speed_10m,wind_direction_10m,wave_height,wave_direction,wave_period",
        daily: "weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_sum",
        cell_selection: "sea",
        timezone: "auto",
        forecast_days: days,
      },
    });

    console.log("📦 Sea weather data:", response.data);

    return {
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      timezone: response.data.timezone,
      current: response.data.current,
      hourly: response.data.hourly,
      daily: response.data.daily,
      units: response.data.hourly_units,
      note: "Optimized for ocean/marine forecasting",
    };
  } catch (error) {
    console.warn("⚠️ getSeaWeatherData() may not have wave data:", error.message);
    // Fallback to regular weather data
    return getWeatherByCoords(latitude, longitude);
  }
};

// ================================================
// AIR QUALITY
// ================================================

export const getAirQuality = async (latitude, longitude) => {
  console.log("💨 getAirQuality() →", { latitude, longitude });

  try {
    const response = await axios.get(`${OPEN_METEO_BASE}/air-quality`, {
      params: {
        latitude,
        longitude,
        current: "us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide,sulphur_dioxide",
        hourly: "us_aqi,pm2_5,pm10",
        timezone: "auto",
        forecast_days: 7,
      },
    });

    console.log("📦 Air Quality Response:", response.data);

    return response.data;
  } catch (error) {
    console.warn("⚠️ getAirQuality() failed:", error.message);
    return null;
  }
};

// ================================================
// HELPERS: ICON / DESCRIPTION / MAIN
// ================================================

export const getWeatherIcon = (code, isDay = true) => {
  console.log("🎨 getWeatherIcon() → code:", code, "isDay:", isDay);

  const timeCode = isDay ? "d" : "n";

  if (code === 0) return `01${timeCode}`;
  if ([1, 2].includes(code)) return `02${timeCode}`;
  if (code === 3) return `04${timeCode}`;
  if ([45, 48].includes(code)) return `50${timeCode}`;
  if ([51, 53, 55, 56, 57].includes(code)) return `09${timeCode}`;
  if ([61, 63, 65, 66, 67].includes(code)) return `10${timeCode}`;
  if ([71, 73, 75, 77].includes(code)) return `13${timeCode}`;
  if ([80, 81, 82].includes(code)) return `10${timeCode}`;
  if ([85, 86].includes(code)) return `13${timeCode}`;
  if ([95, 96, 99].includes(code)) return `11${timeCode}`;

  return `01${timeCode}`;
};

export const getWeatherDescription = (code) => {
  console.log("📖 getWeatherDescription() for code:", code);

  const descriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };

  return descriptions[code] || "Unknown";
};

export const getWeatherMain = (code) => {
  console.log("🗂️ getWeatherMain() for code:", code);

  if (code === 0) return "Clear";
  if ([1, 2].includes(code)) return "Clouds";
  if (code === 3) return "Clouds";
  if ([45, 48].includes(code)) return "Mist";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";

  return "Unknown";
};

// ================================================
// DAILY FORECAST
// ================================================

export const processDailyForecasts = (weatherData) => {
  console.log("📅 processDailyForecasts() called");

  if (!weatherData.daily) {
    console.warn("⚠️ No daily forecast data available");
    return [];
  }

  const data = weatherData.daily.time.map((date, idx) => {
    const entry = {
      date,
      tempMax: weatherData.daily.temperature_2m_max[idx],
      tempMin: weatherData.daily.temperature_2m_min[idx],
      weather: getWeatherMain(weatherData.daily.weather_code[idx]),
      description: getWeatherDescription(weatherData.daily.weather_code[idx]),
      icon: getWeatherIcon(weatherData.daily.weather_code[idx], true),
      precipitation: weatherData.daily.precipitation_sum[idx],
      precipitationProbability: weatherData.daily.precipitation_probability_max[idx],
      windSpeed: weatherData.daily.wind_speed_10m_max[idx],
      windDirection: weatherData.daily.wind_direction_10m_dominant[idx],
      sunrise: weatherData.daily.sunrise[idx],
      sunset: weatherData.daily.sunset[idx],
    };

    console.log("📌 Daily item:", entry);
    return entry;
  });

  return data;
};

// ================================================
// HOURLY FORECAST
// ================================================

export const getHourlyForecast = (weatherData, hours = 24) => {
  console.log("⏳ getHourlyForecast() hours:", hours);

  if (!weatherData.hourly) {
    console.warn("⚠️ No hourly forecast data");
    return [];
  }

  const data = weatherData.hourly.time.slice(0, hours).map((time, idx) => {
    const hour = new Date(time).getHours();
    const isDay = hour >= 6 && hour < 20; // Simple day/night determination
    
    const item = {
      time,
      temp: weatherData.hourly.temperature_2m[idx],
      feelsLike: weatherData.hourly.apparent_temperature[idx],
      weather: getWeatherMain(weatherData.hourly.weather_code[idx]),
      description: getWeatherDescription(weatherData.hourly.weather_code[idx]),
      icon: getWeatherIcon(weatherData.hourly.weather_code[idx], isDay),
      humidity: weatherData.hourly.relative_humidity_2m[idx],
      precipitation: weatherData.hourly.precipitation[idx],
      precipitationProbability: weatherData.hourly.precipitation_probability[idx],
      windSpeed: weatherData.hourly.wind_speed_10m[idx],
      windDirection: weatherData.hourly.wind_direction_10m[idx],
    };

    console.log("🕒 Hourly item:", item);
    return item;
  });

  return data;
};

// ================================================
// PROCESS 15-MINUTELY DATA
// ================================================

export const process15MinutelyForecast = (data15min, minutes = 360) => {
  console.log("⏱️ process15MinutelyForecast() minutes:", minutes);

  if (!data15min.minutely_15) {
    console.warn("⚠️ No 15-minutely data");
    return [];
  }

  const dataPoints = data15min.minutely_15.time.slice(0, minutes / 15);

  const processed = dataPoints.map((time, idx) => {
    const item = {
      time,
      temp: data15min.minutely_15.temperature_2m?.[idx],
      humidity: data15min.minutely_15.relative_humidity_2m?.[idx],
      precipitation: data15min.minutely_15.precipitation?.[idx],
      weather_code: data15min.minutely_15.weather_code?.[idx],
      wind_speed: data15min.minutely_15.wind_speed_10m?.[idx],
      wind_direction: data15min.minutely_15.wind_direction_10m?.[idx],
      radiation: data15min.minutely_15.shortwave_radiation?.[idx],
      lightning_potential: data15min.minutely_15.lightning_potential?.[idx],
    };

    console.log("⏱️ 15-min item:", item);
    return item;
  });

  return processed;
};

// ================================================
// FORMAT OPEN-METEO RESPONSE
// ================================================

const formatOpenMeteoResponse = (data) => {
  console.log("🔧 formatOpenMeteoResponse() called with raw data:", data);

  const current = data.current;
  const isDay = current.is_day === 1;

  const formatted = {
    main: {
      temp: current.temperature_2m,
      feels_like: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      pressure: current.pressure_msl,
    },

    weather: [
      {
        main: getWeatherMain(current.weather_code),
        description: getWeatherDescription(current.weather_code),
        icon: getWeatherIcon(current.weather_code, isDay),
        code: current.weather_code,
      },
    ],

    wind: {
      speed: current.wind_speed_10m,
      deg: current.wind_direction_10m,
    },

    sys: {
      sunrise: data.daily?.sunrise?.[0] || null,
      sunset: data.daily?.sunset?.[0] || null,
    },

    timezone: data.timezone,
    timezone_offset: data.utc_offset_seconds,
    daily: data.daily,
    hourly: data.hourly,
    dt: Math.floor(Date.now() / 1000),
    coord: {
      lat: data.latitude,
      lon: data.longitude,
    },
  };

  console.log("✨ Formatted data:", formatted);

  return formatted;
};

// ================================================
// UTILITY: CONVERT TEMPERATURE
// ================================================

export const convertTemperature = (celsius, toUnit = "fahrenheit") => {
  console.log("🌡️ convertTemperature() →", celsius, "to", toUnit);

  if (toUnit.toLowerCase() === "fahrenheit") {
    return (celsius * 9) / 5 + 32;
  }
  return celsius;
};

// ================================================
// UTILITY: WIND DIRECTION TO COMPASS
// ================================================

export const windDegreeToCompass = (degree) => {
  console.log("🧭 windDegreeToCompass() →", degree);

  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];

  const index = Math.round(degree / 22.5) % 16;
  return directions[index];
};

// ================================================
// UTILITY: INTERPRET CAPE VALUE
// ================================================

export const interpretCAPE = (capeValue) => {
  console.log("⛈️ interpretCAPE() →", capeValue);

  if (capeValue < 1000)
    return { level: "Low", risk: "Minimal convective activity" };
  if (capeValue < 2500)
    return { level: "Moderate", risk: "Thunderstorms possible" };
  if (capeValue < 3500)
    return { level: "High", risk: "Strong thunderstorms likely" };
  return { level: "Extreme", risk: "Severe thunderstorms/tornadoes possible" };
};

// ================================================
// UTILITY: INTERPRET VPD VALUE
// ================================================

export const interpretVPD = (vpdValue) => {
  console.log("🌿 interpretVPD() →", vpdValue);

  if (vpdValue < 0.4)
    return { level: "Low", effect: "Reduced plant transpiration" };
  if (vpdValue < 1.6) return { level: "Optimal", effect: "Normal plant growth" };
  return { level: "High", effect: "Increased plant water stress" };
};

// ================================================
// UTILITY: INTERPRET SOIL MOISTURE
// ================================================

export const interpretSoilMoisture = (volumetricMoisture) => {
  console.log("🌱 interpretSoilMoisture() →", volumetricMoisture);

  if (volumetricMoisture < 0.1)
    return { level: "Dry", needsWater: true, irrigation: "High" };
  if (volumetricMoisture < 0.2)
    return { level: "Moderate", needsWater: false, irrigation: "Low" };
  if (volumetricMoisture < 0.35)
    return { level: "Moist", needsWater: false, irrigation: "None" };
  return { level: "Saturated", needsWater: false, irrigation: "None" };
};

// ================================================
// TEST API CONNECTION
// ================================================

export const testAPIConnection = async () => {
  console.log("🧪 Testing API connection…");

  try {
    const result = await getWeather("London");

    console.log("✅ API working!", result);

    return true;
  } catch (error) {
    console.error("❌ API test FAILED:", error);
    return false;
  }
};

// ================================================
// TEST ALL ENHANCED FEATURES
// ================================================

export const testAllEnhancedAPIs = async (latitude = 51.5074, longitude = -0.1278) => {
  console.log("🧪 Testing all enhanced APIs for London…");

  const results = {
    status: "Testing...",
    tests: {},
  };

  try {
    console.log("Test 1: Solar Radiation");
    results.tests.solarRadiation = await getSolarRadiation(latitude, longitude);
    console.log("✅ Solar Radiation OK");
  } catch (e) {
    console.warn("⚠️ Solar Radiation failed:", e.message);
    results.tests.solarRadiation = "Failed";
  }

  try {
    console.log("Test 2: 15-Minutely Forecast");
    results.tests.fifteenMinutely = await get15MinutelyForecast(latitude, longitude);
    console.log("✅ 15-Minutely OK");
  } catch (e) {
    console.warn("⚠️ 15-Minutely failed:", e.message);
    results.tests.fifteenMinutely = "Failed";
  }

  try {
    console.log("Test 3: Soil Moisture");
    results.tests.soilMoisture = await getSoilMoistureData(latitude, longitude);
    console.log("✅ Soil Moisture OK");
  } catch (e) {
    console.warn("⚠️ Soil Moisture failed:", e.message);
    results.tests.soilMoisture = "Failed";
  }

  try {
    console.log("Test 4: Evapotranspiration");
    results.tests.evapotranspiration = await getEvapotranspirationData(
      latitude,
      longitude
    );
    console.log("✅ Evapotranspiration OK");
  } catch (e) {
    console.warn("⚠️ Evapotranspiration failed:", e.message);
    results.tests.evapotranspiration = "Failed";
  }

  try {
    console.log("Test 5: Visibility");
    results.tests.visibility = await getVisibilityData(latitude, longitude);
    console.log("✅ Visibility OK");
  } catch (e) {
    console.warn("⚠️ Visibility failed:", e.message);
    results.tests.visibility = "Failed";
  }

  try {
    console.log("Test 6: Severe Weather");
    results.tests.severeWeather = await getSevereWeatherRisk(latitude, longitude);
    console.log("✅ Severe Weather OK");
  } catch (e) {
    console.warn("⚠️ Severe Weather failed:", e.message);
    results.tests.severeWeather = "Failed";
  }

  try {
    console.log("Test 7: Plant Stress");
    results.tests.plantStress = await getPlantStressData(latitude, longitude);
    console.log("✅ Plant Stress OK");
  } catch (e) {
    console.warn("⚠️ Plant Stress failed:", e.message);
    results.tests.plantStress = "Failed";
  }

  try {
    console.log("Test 8: Pressure Levels");
    results.tests.pressureLevels = await getWeatherPressureLevels(
      latitude,
      longitude
    );
    console.log("✅ Pressure Levels OK");
  } catch (e) {
    console.warn("⚠️ Pressure Levels failed:", e.message);
    results.tests.pressureLevels = "Failed";
  }

  results.status = "Complete";
  console.log("🎉 All tests completed:", results);

  return results;
};
