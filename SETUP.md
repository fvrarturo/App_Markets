# Quick Setup Guide

## Prerequisites

Before running the application, ensure you have:

- **Python 3.8+** installed ([Download](https://www.python.org/downloads/))
- **Node.js 16+** installed ([Download](https://nodejs.org/))
- **pip** (Python package manager - usually comes with Python)
- **npm** (Node package manager - comes with Node.js)

## Quick Start (Automated)

### macOS/Linux:
```bash
./start.sh
```

### Windows:
```batch
start.bat
```

The automated scripts will:
1. Create a Python virtual environment
2. Install all backend dependencies
3. Install all frontend dependencies
4. Start both servers
5. Open the application

## Manual Setup

If you prefer to set up manually or if the automated scripts don't work:

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python3 -m venv venv

# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py
```

The backend will start on `http://localhost:5000`

### Step 2: Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:3000`

### Step 3: Access the Application

Open your web browser and go to:
```
http://localhost:3000
```

## Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError` when running Python
- **Solution**: Make sure virtual environment is activated and dependencies are installed
  ```bash
  source venv/bin/activate  # or venv\Scripts\activate on Windows
  pip install -r requirements.txt
  ```

**Problem**: Port 5000 already in use
- **Solution**: Kill the process using port 5000 or change the port in `backend/app.py`:
  ```python
  socketio.run(app, debug=True, host='0.0.0.0', port=5001)  # Change port here
  ```

**Problem**: `yfinance` API errors or rate limiting
- **Solution**: The free Yahoo Finance API has rate limits. Wait a few minutes and try again.

### Frontend Issues

**Problem**: `npm install` fails
- **Solution**: Clear npm cache and try again:
  ```bash
  npm cache clean --force
  npm install
  ```

**Problem**: Port 3000 already in use
- **Solution**: Change the port in `frontend/vite.config.js`:
  ```javascript
  server: {
    port: 3001,  // Change port here
    ...
  }
  ```

**Problem**: Connection to backend fails
- **Solution**: Ensure backend is running on port 5000. Check the proxy configuration in `vite.config.js`.

### General Issues

**Problem**: Data not loading
- **Solution**: 
  1. Check that both backend and frontend are running
  2. Open browser console (F12) to check for errors
  3. Verify internet connection (needed for market data APIs)
  4. Check backend terminal for API errors

**Problem**: Charts not displaying
- **Solution**: 
  1. Wait a few seconds for data to load
  2. Check browser console for JavaScript errors
  3. Try refreshing the page

## Features Overview

Once running, you'll have access to:

### Dashboard
- Overview of all markets
- Key indices and rates
- Market news feed
- Live S&P 500 chart

### Equities
- Major global indices
- Real-time prices
- Interactive charts
- Multiple timeframes (1D, 5D, 1M, 3M)

### FX
- Major currency pairs
- Bid/Ask spreads
- Trading session information
- Real-time rate updates

### Rates
- US Treasury yields
- Yield curve visualization
- Change tracking

### Credit
- Investment grade bonds
- High yield bonds
- Emerging market debt
- Credit spread analysis

### Securitized Products
- Mortgage-backed securities (MBS)
- Commercial MBS
- Asset-backed securities
- Product category breakdown

### Structured Products
- VIX volatility index
- Precious metals (Gold, Silver)
- Energy commodities
- Commodity indices

## Data Refresh Rates

- **Equities**: Every 60 seconds
- **FX**: Every 30 seconds
- **Rates**: Every 60 seconds
- **Credit**: Every 60 seconds
- **News**: Every 60 seconds

You can manually refresh any page using the refresh button.

## Development

### Backend Development
- API endpoints are in `backend/app.py`
- Add new data sources by modifying the respective endpoint functions
- Uses Flask with CORS enabled for development

### Frontend Development
- React components in `frontend/src/components/`
- Pages in `frontend/src/pages/`
- Styles use CSS modules and global styles
- Vite provides hot module replacement (HMR) for instant updates

### Adding New Features

1. **New Asset Class**: 
   - Add endpoint in `backend/app.py`
   - Create new page component in `frontend/src/pages/`
   - Add route in `frontend/src/App.jsx`
   - Add navigation item in `frontend/src/components/Sidebar.jsx`

2. **New Data Source**:
   - Add API integration in backend
   - Update frontend to consume new endpoint
   - Add appropriate UI components

## Production Deployment

For production deployment:

1. **Backend**:
   ```bash
   # Use a production WSGI server like Gunicorn
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

2. **Frontend**:
   ```bash
   # Build for production
   npm run build
   
   # Serve the dist folder with a web server
   # or deploy to Vercel, Netlify, etc.
   ```

3. **Environment Variables**:
   - Set `FLASK_ENV=production` in backend
   - Configure CORS for your production domain
   - Use environment-specific API endpoints

## API Rate Limits

The application uses Yahoo Finance API (via yfinance), which is free but has rate limits:
- ~2000 requests per hour per IP
- Spread requests across different timeframes
- Implement caching for production use

## Support & Contribution

- Check `README.md` for detailed documentation
- Report issues or bugs
- Contributions welcome!

## License

For educational and personal use.

---

Happy Trading! 📈

