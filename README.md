# 📊 Multi-Data Dashboard

A comprehensive real-time data dashboard built with React, featuring cryptocurrency prices, COVID-19 statistics, weather forecasts, country information, and tech news - **all without requiring API tokens!**

![Dashboard Preview](https://img.shields.io/badge/React-18.2.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🪙 Cryptocurrency Dashboard
- Real-time prices for top 10 cryptocurrencies
- 24h price changes and trends
- Market cap and trading volume
- 7-day price sparklines
- Data from **CoinGecko API** (no token required)

### 🦠 COVID-19 Statistics
- India-specific COVID data
- Total/active cases, recoveries, deaths
- 14-day trend charts
- Daily statistics
- Case distribution pie charts
- Data from **disease.sh API** (no token required)

### 🌤️ Weather Forecast
- Current weather conditions
- 24-hour temperature forecast
- Humidity, wind speed, precipitation
- Search any city worldwide
- Data from **Open-Meteo API** (no token required)

### 🌍 Countries Explorer
- 195+ countries database
- Filter by region
- Search by name or capital
- Population, currencies, languages
- Flags and detailed information
- Data from **REST Countries API** (no token required)

### 📰 Tech News
- Latest technology headlines
- Category filtering
- Demo mode with sample data
- Ready for NewsAPI/GNews integration

## 🚀 Live Demo

**[View Live Demo](https://abiddasurkar.github.io/multi-data-dashboard)**

## 📸 Screenshots

*(Add your screenshots here after deployment)*

## 🛠️ Tech Stack

- **Frontend:** React 18.2.0
- **Styling:** Tailwind CSS 3.4
- **Charts:** Recharts 2.15
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **HTTP Client:** Axios
- **State Management:** Zustand
- **Routing:** React Router DOM 7.9

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/abiddasurkar/multi-data-dashboard.git
cd multi-data-dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

The app will open at `http://localhost:3000`

4. **Build for production**
```bash
npm run build
```

5. **Deploy to GitHub Pages**
```bash
npm run deploy
```

## 📁 Project Structure

```
multi-data-dashboard/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── CryptoView.js
│   │   ├── CovidView.js
│   │   ├── WeatherView.js
│   │   ├── CountriesView.js
│   │   └── NewsView.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── generate-sitemap.js
```

## 🌐 APIs Used (All Free, No Tokens!)

| API | Purpose | Rate Limit | Documentation |
|-----|---------|-----------|---------------|
| [CoinGecko](https://coingecko.com/api) | Cryptocurrency prices | 50/min | [Docs](https://www.coingecko.com/en/api/documentation) |
| [disease.sh](https://disease.sh) | COVID-19 statistics | Unlimited | [Docs](https://disease.sh/docs/) |
| [Open-Meteo](https://open-meteo.com) | Weather forecast | Unlimited | [Docs](https://open-meteo.com/en/docs) |
| [REST Countries](https://restcountries.com) | Country data | Unlimited | [Docs](https://restcountries.com) |

## 🎨 Features

### Dark Mode Support
- Toggle between light and dark themes
- Persistent theme preference
- Smooth transitions

### Responsive Design
- Mobile-first approach
- Works on all screen sizes
- Touch-friendly interface

### Performance Optimized
- Lazy loading
- Efficient re-renders
- Optimized bundle size

### SEO Friendly
- Meta tags configured
- Sitemap generation
- Social media cards

## 🔧 Configuration

### Update Homepage URL
In `package.json`, update:
```json
"homepage": "https://yourusername.github.io/your-repo-name"
```

### Customize Cities (Weather)
Default city is set to "Pune" in `WeatherView.js`. Change line:
```javascript
const [city, setCity] = useState('YourCity');
```

## 📝 Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm run deploy     # Deploy to GitHub Pages
npm test           # Run tests
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Abid Dasurkar**
- Portfolio: [abiddasurkar.github.io/portfolio](https://abiddasurkar.github.io/portfolio/)
- LinkedIn: [linkedin.com/in/abiddasurkar](https://www.linkedin.com/in/abiddasurkar)
- GitHub: [@abiddasurkar](https://github.com/abiddasurkar)

## 🙏 Acknowledgments

- [CoinGecko](https://coingecko.com) for cryptocurrency data
- [disease.sh](https://disease.sh) for COVID-19 statistics
- [Open-Meteo](https://open-meteo.com) for weather data
- [REST Countries](https://restcountries.com) for country information
- All open-source contributors

## 📞 Support

If you found this project helpful, please give it a ⭐️!

For issues or questions, please [open an issue](https://github.com/abiddasurkar/multi-data-dashboard/issues).

---

**Built with ❤️ by Abid Dasurkar**