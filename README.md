# Simple S&T Markets Dashboard

A comprehensive real-time market data application for tracking multiple asset classes including Equities, FX, Rates, Credit, Securitized Products, and Structured Products. Features live macroeconomic data from FRED API, category-specific news scraping, and offline caching capabilities.

## 🚀 Key Features

### Real-Time Market Data
- **Live quotes** across all major asset classes
- **Interactive charts** with multiple timeframes (5D, 1M, 3M)
- **Historical yield curve comparisons** (Today, 3 Months, 1 Year, 3 Years Ago)
- **DXY (Dollar Index) chart** with real-time updates

### Live Macroeconomic Data (FRED API)
- **US Economic Indicators**: 
  - Inflation (CPI, YoY %)
  - Unemployment Rate
  - GDP Growth (QoQ %)
  - Federal Reserve Rate
- **UK Economic Indicators**:
  - Inflation (CPI, YoY %)
  - Unemployment Rate
  - GDP Growth (QoQ %)
  - Bank of England Rate
- **EU Economic Indicators**:
  - Inflation (CPI, YoY %)
  - Unemployment Rate
  - GDP Growth (QoQ %)
  - ECB Rate

### Enhanced Category Pages
Each asset class page includes:
- **Overview Tab**: Live data, charts, and key metrics
- **What the Desk Does**: Educational content about trading desk operations
- **How to View Indicators**: Guide on interpreting market data
- **News Tab**: Category-specific news with keyword filtering

### Offline Caching System
- **localStorage-based caching** for offline functionality
- **Smart cache expiration** based on data type:
  - Equities/FX: 5 minutes (real-time)
  - Rates/Credit: 30 minutes
  - Commodities: 15 minutes
  - Macro: 24 hours
  - News: 1 hour
- **Cache status indicator** showing online/offline status
- **Automatic fallback** to cached data when offline
- **Manual cache management** tools

### News Aggregation
- **Category-specific news** filtered by keywords
- **Multiple sources**: Reuters, MarketWatch, CNBC, Financial Times, Wall Street Journal
- **Real-time web scraping** with link preservation
- **Keyword-based filtering** for relevant articles per asset class

## 📊 Asset Classes Covered

### Equities
- Major global indices (S&P 500, Dow, Nasdaq, FTSE, DAX, CAC 40, IBEX, FTSE MIB, AEX, SMI, Nikkei, Hang Seng)
- Real-time prices and percentage changes
- Intraday charts with multiple timeframes

### FX
- Major currency pairs (EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, USD/CAD, NZD/USD)
- DXY (US Dollar Index) chart with 5D, 1M, 3M timeframes
- Bid/Ask spreads
- Trading session information

### Rates
- US Treasury yields (3M, 5Y, 10Y, 30Y)
- **Yield curve visualization** comparing:
  - Today
  - 3 Months Ago
  - 1 Year Ago
  - 3 Years Ago
- Rate change tracking

### Credit
- Investment grade and high yield bonds
- Credit spreads
- Emerging market debt
- Corporate bond indices

### Commodities
- **Metals**: Gold, Silver, Platinum, Palladium, Copper
- **Energy**: WTI Crude Oil, Brent Crude, Natural Gas
- **Agricultural**: Wheat, Corn, Soybeans, Sugar, Coffee, Cotton
- Real-time prices and changes

### Securitized Products
- Mortgage-backed securities (MBS)
- Commercial MBS (CMBS)
- Asset-backed securities (ABS)
- CLO (Collateralized Loan Obligations)

### Structured Products
- VIX volatility index
- Custom derivatives
- Structured notes
- Hedging instruments

## 🛠️ Tech Stack

### Backend
- **Python 3.8+**
- **Flask**: Web framework
- **Flask-SocketIO**: Real-time updates
- **yfinance**: Market data API
- **BeautifulSoup4 & Requests**: Web scraping for news
- **FRED API**: Live macroeconomic data
- **Pandas & NumPy**: Data processing

### Frontend
- **React 18**: UI framework
- **Vite**: Build tool
- **Recharts**: Charting library
- **Axios**: HTTP client
- **React Router**: Navigation
- **localStorage API**: Offline caching

## 📦 Installation

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The backend will run on `http://localhost:5001`

**Note**: You'll need a FRED API key for macroeconomic data. Get one free at https://fred.stlouisfed.org/docs/api/api_key.html

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## 🎯 Usage

1. **Start the backend server first**:
   ```bash
   cd backend
   source venv/bin/activate
   python app.py
   ```

2. **Start the frontend development server**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Navigate to the app** in your browser (typically `http://localhost:5173`)

4. **Use the sidebar** to navigate between different asset classes

5. **Data refreshes automatically** based on cache expiration settings

6. **Check cache status** using the indicator in the top-right corner

## 🔌 API Endpoints

### Market Data
- `GET /api/equities` - Major equity indices
- `GET /api/equities/chart/<ticker>` - Historical chart data for equities
- `GET /api/fx` - Currency pairs
- `GET /api/rates` - Treasury yields
- `GET /api/rates/yield-curves` - Historical yield curve comparisons
- `GET /api/credit` - Credit instruments
- `GET /api/commodities` - Commodities data
- `GET /api/securitized` - Securitized products
- `GET /api/structured` - Structured products

### Macroeconomic Data
- `GET /api/macro` - Live macroeconomic indicators (US, UK, EU) from FRED API

### News
- `GET /api/news/<category>` - Category-specific news with keyword filtering
  - Categories: `equities`, `fx`, `rates`, `credit`, `commodities`, `securitized`, `structured`

## 📁 Project Structure

```
App_Markets/
├── backend/
│   ├── app.py              # Flask application with all API endpoints
│   ├── requirements.txt    # Python dependencies
│   └── venv/              # Python virtual environment
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── CacheIndicator.jsx
│   │   │   └── CacheIndicator.css
│   │   ├── pages/          # Page components
│   │   │   ├── Equities.jsx
│   │   │   ├── FX.jsx
│   │   │   ├── Rates.jsx
│   │   │   ├── Credit.jsx
│   │   │   ├── Commodities.jsx
│   │   │   ├── Securitized.jsx
│   │   │   ├── Structured.jsx
│   │   │   ├── Macro.jsx
│   │   │   └── AssetClass.css
│   │   ├── utils/
│   │   │   └── cache.js    # localStorage caching utilities
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── CACHE_INFO.md          # Caching system documentation
├── improvements.txt       # Content for category pages
└── README.md
```

## 💾 Offline Caching

The app includes a sophisticated caching system that allows it to work offline:

### How It Works
1. **First load**: Data is fetched from the API and cached in localStorage
2. **Subsequent loads**: Data is served from cache if still valid
3. **Offline mode**: When internet is unavailable, cached data is used automatically
4. **Cache expiration**: Different data types have different expiration times

### Cache Management
- **Visual indicator**: Top-right corner shows online/offline status
- **Click indicator**: View cache statistics and manage cache
- **Automatic cleanup**: Expired entries are automatically removed
- **Manual controls**: "Clean Expired" and "Clear All Cache" buttons

### Cache Durations
| Data Type | Duration | Reason |
|-----------|----------|---------|
| Equities/FX | 5 min | Real-time prices |
| Rates/Credit | 30 min | Less volatile |
| Commodities | 15 min | Moderate changes |
| Macro | 24 hrs | Updated daily |
| News | 1 hr | Articles stable |

## 📰 News Sources

The app scrapes news from:
- **Reuters** (reuters.com)
- **MarketWatch** (marketwatch.com)
- **CNBC** (cnbc.com)
- **Financial Times** (ft.com)
- **Wall Street Journal** (wsj.com)

News is filtered by category-specific keywords to ensure relevance.

## 🔧 Customization

### Adding New Instruments

Edit the backend `app.py` to add new tickers:

```python
# In the respective endpoint
indstruments = ['TICKER1', 'TICKER2', 'TICKER3']
```

### Changing Cache Durations

Modify `frontend/src/utils/cache.js`:

```javascript
const CACHE_DURATIONS = {
    realtime: 5 * 60 * 1000,      // 5 minutes
    rates: 30 * 60 * 1000,        // 30 minutes
    commodities: 15 * 60 * 1000,  // 15 minutes
    macro: 24 * 60 * 60 * 1000,   // 24 hours
    news: 60 * 60 * 1000,         // 1 hour
};
```

### Adding FRED API Series

To add new macroeconomic indicators, update the `series_ids` dictionary in `app.py`:

```python
series_ids = {
    'us_cpi': 'CPIAUCSL',
    'us_inflation': 'CPIAUCSL',
    # Add more series here
}
```

## 🔒 Security Considerations

- **CORS configured** for development
- **API keys** stored in backend only (FRED API key)
- **Rate limiting** recommended for production
- **Input validation** on all API endpoints
- **Error handling** for network failures

## 🐛 Troubleshooting

### Backend won't start
- Ensure Python 3.8+ is installed
- Activate virtual environment: `source venv/bin/activate`
- Install dependencies: `pip install -r requirements.txt`
- Check if port 5001 is available

### Frontend won't start
- Ensure Node.js 16+ is installed
- Install dependencies: `npm install`
- Check if port 5173 (or configured port) is available

### Charts not showing
- Check browser console for errors
- Verify backend is running and accessible
- Check network tab for API call failures

### Cache not working
- Check browser localStorage is enabled
- Verify cache utility is imported correctly
- Check console for cache-related errors

## 📈 Performance

- **Optimized API calls** with intelligent caching
- **Efficient React rendering** with proper state management
- **Lazy loading** of chart data
- **Debounced updates** to prevent excessive API calls
- **localStorage caching** reduces network requests

## 🚧 Future Enhancements

- [ ] User authentication and personalized portfolios
- [ ] Custom watchlists
- [ ] Price alerts and notifications
- [ ] Advanced charting with technical indicators
- [ ] Historical data export (CSV, Excel)
- [ ] Additional data providers integration
- [ ] Machine learning price predictions
- [ ] Real-time WebSocket updates
- [ ] Dark mode toggle
- [ ] Customizable dashboard layouts

## 📝 Recent Updates

### Version 2.0 (Current)
- ✅ FRED API integration for live US, UK, EU macroeconomic data
- ✅ Category-specific news scraping with keyword filtering
- ✅ Enhanced category pages with educational content
- ✅ Offline caching system with localStorage
- ✅ Cache status indicator and management tools
- ✅ DXY chart on FX page with multiple timeframes
- ✅ Yield curve comparison with 3-year historical data
- ✅ Support for Financial Times and Wall Street Journal news
- ✅ Improved error handling and offline fallback

### Version 1.0
- Initial release with basic market data
- Real-time quotes for major asset classes
- Interactive charts with Recharts
- News aggregation from multiple sources

## 📄 License

This project is for educational and personal use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests.

## 📞 Support

For questions or issues, please open an issue on the repository.

---

Built with ❤️ for Morgan Stanley S&T Division

**Last Updated**: October 2025
