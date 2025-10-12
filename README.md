# Morgan Stanley Markets Dashboard

A comprehensive real-time market data application for tracking multiple asset classes including Equities, FX, Rates, Credit, Securitized Products, and Structured Products.

## Features

- **Real-time Market Data**: Live quotes and updates across all major asset classes
- **Interactive Charts**: Beautiful visualizations using Recharts
- **Multi-Asset Coverage**: 
  - Equities (Major global indices)
  - FX (Major currency pairs)
  - Rates (Treasury yields)
  - Credit (Corporate bonds and spreads)
  - Securitized Products (MBS, ABS, CMBS)
  - Structured Products (Volatility, Commodities)
- **News Aggregation**: Market news from multiple sources
- **Modern UI**: Sleek, professional design with smooth animations
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- **Python 3.8+**
- **Flask**: Web framework
- **yfinance**: Market data API
- **BeautifulSoup4**: Web scraping
- **Flask-SocketIO**: Real-time updates

### Frontend
- **React 18**: UI framework
- **Vite**: Build tool
- **Recharts**: Charting library
- **Axios**: HTTP client
- **React Router**: Navigation
- **Framer Motion**: Animations

## Installation

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

1. Start the backend server first
2. Start the frontend development server
3. Navigate to `http://localhost:3000` in your browser
4. Use the sidebar to navigate between different asset classes
5. Data refreshes automatically every minute (configurable)

## API Endpoints

- `GET /api/equities` - Major equity indices
- `GET /api/equities/chart/<ticker>` - Historical chart data
- `GET /api/fx` - Currency pairs
- `GET /api/rates` - Treasury yields
- `GET /api/credit` - Credit instruments
- `GET /api/securitized` - Securitized products
- `GET /api/structured` - Structured products
- `GET /api/news` - Market news
- `GET /api/dashboard` - Dashboard summary

## Project Structure

```
App_Markets/
├── backend/
│   ├── app.py              # Flask application
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Features by Asset Class

### Equities
- Major global indices (S&P 500, Dow, Nasdaq, FTSE, DAX, Nikkei)
- Real-time prices and changes
- Intraday charts with multiple timeframes

### FX
- Major currency pairs (EUR/USD, GBP/USD, USD/JPY, etc.)
- Bid/Ask spreads
- Trading session information

### Rates
- US Treasury yields (3M, 5Y, 10Y, 30Y)
- Yield curve visualization
- Rate change tracking

### Credit
- Investment grade and high yield bonds
- Credit spreads
- Emerging market debt

### Securitized Products
- Mortgage-backed securities (MBS)
- Commercial MBS (CMBS)
- Asset-backed securities (ABS)

### Structured Products
- VIX volatility index
- Precious metals (Gold, Silver)
- Energy commodities (Oil, Gas)
- Commodity indices

## Data Sources

- **Yahoo Finance API** (via yfinance): Primary market data source
- **Financial Times**: News scraping (when available)
- Real-time data updates via WebSocket connections

## Customization

### Adding New Instruments

Edit the backend `app.py` to add new tickers to any asset class:

```python
# In the respective endpoint
instruments = ['TICKER1', 'TICKER2', 'TICKER3']
```

### Changing Refresh Intervals

Modify the interval in each page component:

```javascript
const interval = setInterval(fetchData, 60000) // 60000ms = 1 minute
```

## Performance

- Optimized API calls with caching
- Efficient React rendering
- Lazy loading of chart data
- Debounced updates

## Security Considerations

- CORS configured for development
- No API keys exposed in frontend
- Rate limiting on backend endpoints recommended for production

## Future Enhancements

- [ ] User authentication and portfolios
- [ ] Custom watchlists
- [ ] Price alerts and notifications
- [ ] Advanced charting with technical indicators
- [ ] Historical data export
- [ ] Mobile app version
- [ ] Integration with additional data providers
- [ ] Machine learning price predictions

## License

This project is for educational and personal use.

## Contributing

Contributions are welcome! Please feel free to submit pull requests.

## Support

For questions or issues, please open an issue on the repository.

---

Built with ❤️ for Morgan Stanley S&T Division

