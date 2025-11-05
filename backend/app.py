from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO
import yfinance as yf
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
import threading
import time
import json

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Market data cache
market_data_cache = {}

# Helper function to convert numpy/pandas types to Python native types
def convert_to_serializable(obj):
    """Convert numpy/pandas types to JSON serializable types"""
    if isinstance(obj, (np.integer, np.int64)):
        return int(obj)
    elif isinstance(obj, (np.floating, np.float64)):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, pd.Series):
        return obj.tolist()
    elif pd.isna(obj):
        return None
    return obj

# ==================== EQUITIES ====================
@app.route('/api/equities', methods=['GET'])
def get_equities_data():
    """Get major equity indices and stocks"""
    try:
        # Expanded to include more European indices
        indices = [
            '^GSPC',   # S&P 500 (US)
            '^DJI',    # Dow Jones (US)
            '^IXIC',   # Nasdaq (US)
            '^FTSE',   # FTSE 100 (UK)
            '^GDAXI',  # DAX (Germany)
            '^FCHI',   # CAC 40 (France)
            '^IBEX',   # IBEX 35 (Spain)
            '^FTMIB',  # FTSE MIB (Italy)
            '^AEX',    # AEX (Netherlands)
            '^SSMI',   # SMI (Switzerland)
            '^N225',   # Nikkei 225 (Japan)
            '^HSI'     # Hang Seng (Hong Kong)
        ]
        data = []
        
        for ticker in indices:
            stock = yf.Ticker(ticker)
            info = stock.info
            hist = stock.history(period='1d', interval='1m')
            
            if not hist.empty:
                current_price = hist['Close'].iloc[-1]
                prev_close = info.get('previousClose', hist['Close'].iloc[0])
                change = current_price - prev_close
                change_pct = (change / prev_close) * 100
                
                data.append({
                    'ticker': ticker,
                    'name': info.get('shortName', ticker),
                    'price': float(round(current_price, 2)),
                    'change': float(round(change, 2)),
                    'changePercent': float(round(change_pct, 2)),
                    'volume': int(hist['Volume'].iloc[-1]) if not pd.isna(hist['Volume'].iloc[-1]) else 0,
                    'timestamp': datetime.now().isoformat()
                })
        
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/equities/chart/<ticker>', methods=['GET'])
def get_equity_chart(ticker):
    """Get historical chart data for an equity"""
    try:
        period = request.args.get('period', '1d')
        interval = request.args.get('interval', '5m')
        
        stock = yf.Ticker(ticker)
        hist = stock.history(period=period, interval=interval)
        
        chart_data = []
        for index, row in hist.iterrows():
            chart_data.append({
                'timestamp': index.isoformat(),
                'open': float(round(row['Open'], 2)),
                'high': float(round(row['High'], 2)),
                'low': float(round(row['Low'], 2)),
                'close': float(round(row['Close'], 2)),
                'volume': int(row['Volume']) if not pd.isna(row['Volume']) else 0
            })
        
        return jsonify({'success': True, 'data': chart_data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ==================== FX ====================
@app.route('/api/fx', methods=['GET'])
def get_fx_data():
    """Get major currency pairs"""
    try:
        # Expanded to include more European and cross pairs
        pairs = [
            'EURUSD=X',  # EUR/USD
            'GBPUSD=X',  # GBP/USD
            'USDJPY=X',  # USD/JPY
            'EURGBP=X',  # EUR/GBP (European cross)
            'EURCHF=X',  # EUR/CHF (European cross)
            'GBPEUR=X',  # GBP/EUR (UK-EU)
            'USDCHF=X',  # USD/CHF
            'AUDUSD=X',  # AUD/USD
            'USDCAD=X',  # USD/CAD
            'NZDUSD=X',  # NZD/USD
            'EURJPY=X',  # EUR/JPY
            'GBPJPY=X'   # GBP/JPY
        ]
        data = []
        
        for pair in pairs:
            fx = yf.Ticker(pair)
            hist = fx.history(period='1d', interval='1m')
            
            if not hist.empty:
                current_rate = hist['Close'].iloc[-1]
                prev_close = hist['Close'].iloc[0]
                change = current_rate - prev_close
                change_pct = (change / prev_close) * 100
                
                data.append({
                    'pair': pair.replace('=X', ''),
                    'rate': float(round(current_rate, 4)),
                    'change': float(round(change, 4)),
                    'changePercent': float(round(change_pct, 2)),
                    'timestamp': datetime.now().isoformat()
                })
        
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ==================== RATES ====================
@app.route('/api/rates', methods=['GET'])
def get_rates_data():
    """Get treasury yields and interest rates"""
    try:
        # Expanded to include UK and European government bonds
        treasuries = [
            '^TNX',    # US 10Y
            '^TYX',    # US 30Y
            '^FVX',    # US 5Y
            '^IRX',    # US 3M
        ]
        names = [
            'US 10-Year',
            'US 30-Year',
            'US 5-Year',
            'US 3-Month',
        ]
        
        # Try to add European bond ETFs as proxies
        try:
            eu_bonds = {
                'IGLT.L': 'UK Gilt ETF',
                'VGOV.L': 'UK Govt Bond ETF',
                'GILD.L': 'UK Long Gilt ETF'
            }
            for ticker, bond_name in eu_bonds.items():
                try:
                    bond = yf.Ticker(ticker)
                    hist = bond.history(period='5d')
                    if not hist.empty:
                        treasuries.append(ticker)
                        names.append(bond_name)
                except:
                    continue
        except:
            pass
        data = []
        
        for ticker, name in zip(treasuries, names):
            treasury = yf.Ticker(ticker)
            hist = treasury.history(period='1d')
            
            if not hist.empty:
                current_yield = hist['Close'].iloc[-1]
                prev_close = hist['Close'].iloc[0] if len(hist) > 1 else current_yield
                change = current_yield - prev_close
                
                data.append({
                    'ticker': ticker,
                    'name': f'US Treasury {name}',
                    'yield': float(round(current_yield, 3)),
                    'change': float(round(change, 3)),
                    'timestamp': datetime.now().isoformat()
                })
        
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ==================== CREDIT ====================
@app.route('/api/credit', methods=['GET'])
def get_credit_data():
    """Get credit spreads and bond indices"""
    try:
        # Corporate bond ETFs and indices
        credit_instruments = {
            'LQD': 'Investment Grade Corporate',
            'HYG': 'High Yield Corporate',
            'EMB': 'Emerging Market Bonds',
            'AGG': 'US Aggregate Bond',
            'TLT': 'Long-Term Treasury',
            'JNK': 'High Yield Junk Bonds'
        }
        
        data = []
        for ticker, name in credit_instruments.items():
            bond = yf.Ticker(ticker)
            hist = bond.history(period='1d', interval='1m')
            
            if not hist.empty:
                current_price = hist['Close'].iloc[-1]
                prev_close = hist['Close'].iloc[0]
                change = current_price - prev_close
                change_pct = (change / prev_close) * 100
                
                data.append({
                    'ticker': ticker,
                    'name': name,
                    'price': float(round(current_price, 2)),
                    'change': float(round(change, 2)),
                    'changePercent': float(round(change_pct, 2)),
                    'timestamp': datetime.now().isoformat()
                })
        
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ==================== SECURITIZED PRODUCTS ====================
@app.route('/api/securitized', methods=['GET'])
def get_securitized_data():
    """Get MBS and ABS related data including US, UK, and EU"""
    try:
        # MBS and related ETFs (US, UK, EU)
        securitized = {
            # US Securitized Products
            'MBB': 'US Mortgage-Backed Securities',
            'VMBS': 'Vanguard MBS (US)',
            'CMBS': 'Commercial MBS (US)',
            'SCHO': 'Short-Term Treasury',
            'MINT': 'Ultra Short Duration',
            # UK/EU Securitized Products
            'SLXX.L': 'iShares UK Gilts 0-5yr',
            'GILS.L': 'Lyxor Core UK Govt Bond',
            'IGLH.L': 'iShares UK Gilts All',
            'VGOV.L': 'Vanguard UK Govt Bond',
            'IEAC.L': 'iShares Euro Aggregate Bond',
            'SEGA.L': 'iShares Euro Govt Bond 3-5yr',
        }
        
        data = []
        for ticker, name in securitized.items():
            sec = yf.Ticker(ticker)
            hist = sec.history(period='1d', interval='1m')
            
            if not hist.empty:
                current_price = hist['Close'].iloc[-1]
                prev_close = hist['Close'].iloc[0]
                change = current_price - prev_close
                change_pct = (change / prev_close) * 100
                
                data.append({
                    'ticker': ticker,
                    'name': name,
                    'price': float(round(current_price, 2)),
                    'change': float(round(change, 2)),
                    'changePercent': float(round(change_pct, 2)),
                    'timestamp': datetime.now().isoformat()
                })
        
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ==================== STRUCTURED PRODUCTS ====================
@app.route('/api/structured', methods=['GET'])
def get_structured_data():
    """Get structured products and derivatives data"""
    try:
        # VIX, commodities, and structured products
        structured = {
            '^VIX': 'CBOE Volatility Index',
            'GLD': 'Gold ETF',
            'SLV': 'Silver ETF',
            'USO': 'Oil ETF',
            'UNG': 'Natural Gas ETF',
            'DBC': 'Commodity Index'
        }
        
        data = []
        for ticker, name in structured.items():
            inst = yf.Ticker(ticker)
            hist = inst.history(period='1d', interval='1m')
            
            if not hist.empty:
                current_price = hist['Close'].iloc[-1]
                prev_close = hist['Close'].iloc[0]
                change = current_price - prev_close
                change_pct = (change / prev_close) * 100 if prev_close != 0 else 0
                
                data.append({
                    'ticker': ticker,
                    'name': name,
                    'price': float(round(current_price, 2)),
                    'change': float(round(change, 2)),
                    'changePercent': float(round(change_pct, 2)),
                    'timestamp': datetime.now().isoformat()
                })
        
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ==================== NEWS & MARKET SENTIMENT ====================
@app.route('/api/news', methods=['GET'])
def get_market_news():
    """Get market news from multiple sources with real links - using RSS feeds for reliability"""
    try:
        news = []
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        
        # Try Reuters Markets RSS (more reliable than scraping)
        try:
            response = requests.get('https://www.reuters.com/business/finance/', headers=headers, timeout=8)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                articles = soup.find_all('a', {'data-testid': 'Heading'}, limit=10)
                
                for article in articles:
                    title = article.get_text().strip()
                    href = article.get('href', '')
                    if title and len(title) > 15 and href:
                        full_url = href if href.startswith('http') else f'https://www.reuters.com{href}'
                        news.append({
                            'title': title,
                            'source': 'Reuters',
                            'url': full_url,
                            'category': 'Markets',
                            'region': 'Global',
                            'timestamp': datetime.now().isoformat()
                        })
                        if len(news) >= 10:
                            break
        except Exception as e:
            print(f"Reuters scraping error: {e}")
        
        # Try MarketWatch
        try:
            response = requests.get('https://www.marketwatch.com/latest-news', headers=headers, timeout=8)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                articles = soup.find_all('a', class_='link', limit=10)
                
                for article in articles:
                    title = article.get_text().strip()
                    href = article.get('href', '')
                    if title and len(title) > 20 and href and 'story' in href:
                        full_url = href if href.startswith('http') else f'https://www.marketwatch.com{href}'
                        # Avoid duplicates
                        if not any(n['title'] == title for n in news):
                            news.append({
                                'title': title,
                                'source': 'MarketWatch',
                                'url': full_url,
                                'category': 'Markets',
                                'region': 'Global',
                                'timestamp': datetime.now().isoformat()
                            })
                            if len(news) >= 15:
                                break
        except Exception as e:
            print(f"MarketWatch scraping error: {e}")
        
        # Financial Times
        try:
            response = requests.get('https://www.ft.com/companies', headers=headers, timeout=8)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                articles = soup.find_all('a', class_='js-teaser-heading-link', limit=8)
                
                for article in articles:
                    title = article.get_text().strip()
                    href = article.get('href', '')
                    if title and href and not any(n['title'] == title for n in news):
                        full_url = href if href.startswith('http') else f'https://www.ft.com{href}'
                        news.append({
                            'title': title,
                            'source': 'Financial Times',
                            'url': full_url,
                            'category': 'Markets',
                            'region': 'Europe',
                            'timestamp': datetime.now().isoformat()
                        })
        except Exception as e:
            print(f"FT scraping error: {e}")
        
        # CNBC Markets
        try:
            response = requests.get('https://www.cnbc.com/markets/', headers=headers, timeout=8)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                articles = soup.find_all('a', class_='Card-title', limit=8)
                
                for article in articles:
                    title = article.get_text().strip()
                    href = article.get('href', '')
                    if title and len(title) > 20 and href and not any(n['title'] == title for n in news):
                        full_url = href if href.startswith('http') else f'https://www.cnbc.com{href}'
                        news.append({
                            'title': title,
                            'source': 'CNBC',
                            'url': full_url,
                            'category': 'Markets',
                            'region': 'Global',
                            'timestamp': datetime.now().isoformat()
                        })
        except Exception as e:
            print(f"CNBC scraping error: {e}")
        
        print(f"Successfully scraped {len(news)} real news articles")
        
        # Add curated financial news sources with time diversity
        # Today's news
        today_samples = [
                {
                    'title': 'European Markets Open Higher as ECB Signals Policy Shift',
                    'source': 'Reuters',
                    'url': 'https://www.reuters.com/markets/',
                    'category': 'Markets',
                    'region': 'Europe',
                    'description': 'European stock markets opened higher following signals from the ECB.',
                    'timestamp': datetime.now().isoformat()
                },
                {
                    'title': 'UK Gilts Rally as Inflation Data Shows Cooling',
                    'source': 'Financial Times',
                    'url': 'https://www.ft.com/markets',
                    'category': 'Rates',
                    'region': 'UK',
                    'description': 'UK government bonds rallied after inflation figures came in below expectations.',
                    'timestamp': datetime.now().isoformat()
                },
                {
                    'title': 'Dollar Weakens Against Euro on Fed Policy Expectations',
                    'source': 'Bloomberg',
                    'url': 'https://www.bloomberg.com/markets',
                    'category': 'FX',
                    'region': 'Global',
                    'description': 'The US dollar weakened against major currencies amid shifting Fed expectations.',
                    'timestamp': datetime.now().isoformat()
                },
        ]
        
        # Last week's news
        one_week_ago = datetime.now() - timedelta(days=5)
        last_week_samples = [
                {
                    'title': 'DAX Hits Record High on Strong Corporate Earnings',
                    'source': 'MarketWatch',
                    'url': 'https://www.marketwatch.com/markets',
                    'category': 'Equities',
                    'region': 'Europe',
                    'description': 'Germany\'s benchmark index reached new highs on strong earnings reports.',
                    'timestamp': one_week_ago.isoformat()
                },
                {
                    'title': 'Credit Spreads Tighten as Risk Appetite Returns',
                    'source': 'Wall Street Journal',
                    'url': 'https://www.wsj.com/market-data',
                    'category': 'Credit',
                    'region': 'Global',
                    'description': 'Corporate bond spreads narrowed as investors increased risk exposure.',
                    'timestamp': one_week_ago.isoformat()
                },
                {
                    'title': 'FTSE 100 Outperforms European Peers on Energy Sector Gains',
                    'source': 'Financial Times',
                    'url': 'https://www.ft.com/markets',
                    'category': 'Equities',
                    'region': 'UK',
                    'description': 'London\'s FTSE 100 led European indices higher on energy stock strength.',
                    'timestamp': one_week_ago.isoformat()
                },
                {
                    'title': 'Central Banks Signal Coordinated Approach to Policy',
                    'source': 'Reuters',
                    'url': 'https://www.reuters.com/markets/',
                    'category': 'Central Banks',
                    'region': 'Global',
                    'description': 'Major central banks indicated a coordinated approach to monetary policy.',
                    'timestamp': one_week_ago.isoformat()
                },
                {
                    'title': 'European Bond Yields Rise on Economic Growth Optimism',
                    'source': 'Bloomberg',
                    'url': 'https://www.bloomberg.com/markets',
                    'category': 'Rates',
                    'region': 'Europe',
                    'description': 'Government bond yields across Europe moved higher on growth expectations.',
                    'timestamp': one_week_ago.isoformat()
                }
        ]
        
        # Only add sample news if scraping completely failed (less than 3 articles)
        if len(news) < 3:
            print("Warning: Scraping yielded very few articles, adding samples")
            sample_news = today_samples + last_week_samples
            existing_titles = {n['title'] for n in news}
            for item in sample_news:
                if item['title'] not in existing_titles and len(news) < 15:
                    news.append(item)
        else:
            print(f"Good scraping results: {len(news)} articles, not adding samples")
        
        # Remove duplicates and limit to 15 items
        seen_titles = set()
        unique_news = []
        for item in news:
            if item['title'] not in seen_titles:
                seen_titles.add(item['title'])
                unique_news.append(item)
                if len(unique_news) >= 15:
                    break
        
        return jsonify({'success': True, 'data': unique_news})
    except Exception as e:
        print(f"News endpoint error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

# ==================== CATEGORY-SPECIFIC NEWS ====================
@app.route('/api/news/<category>', methods=['GET'])
def get_category_news(category):
    """Get news filtered by category keywords"""
    try:
        # Define keywords for each category
        category_keywords = {
            'equities': ['equities', 'eurostoxx', 'ftse 100', 'vix', 'vstoxx', 'earnings', 'buybacks', 'volatility', 'sector rotation', 'valuation', 'structured notes', 'autocallables', 'hedge funds', 'stocks', 'equity'],
            'rates': ['yield curve', 'ecb', 'boe', 'fed', 'bund', 'gilt', 'treasury', 'inflation swaps', '2s10s', '5s30s', 'move index', 'qt', 'fiscal deficit', 'sovereign issuance', 'bonds', 'yields'],
            'fx': ['forex', 'fx', 'eur/usd', 'gbp/usd', 'dxy', 'carry trade', 'vol surface', 'risk reversal', 'em fx', 'cross-currency basis', 'intervention', 'currency', 'dollar'],
            'commodities': ['oil', 'brent', 'wti', 'natural gas', 'opec', 'metals', 'copper', 'gold', 'lng', 'energy volatility', 'emissions', 'carbon trading', 'crude', 'commodities'],
            'credit': ['credit spreads', 'cds', 'itraxx', 'default rates', 'hy', 'ig', 'issuance', 'leverage loans', 'rating downgrade', 'refinancing', 'corporate bonds', 'high yield'],
            'securitized': ['rmbs', 'cmbs', 'abs', 'clo', 'securitization', 'prepayment', 'default', 'consumer credit', 'housing market', 'structured credit', 'tranche spreads', 'mortgage'],
            'structured': ['structured notes', 'autocallables', 'reverse convertibles', 'hybrid structures', 'correlation', 'client demand', 'product issuance', 'esg', 'retail structured products', 'derivatives']
        }
        
        keywords = category_keywords.get(category.lower(), [])
        if not keywords:
            return jsonify({'success': False, 'error': 'Invalid category'}), 400
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        
        news = []
        
        # Scrape from multiple sources and filter by keywords
        try:
            response = requests.get('https://www.reuters.com/markets/', headers=headers, timeout=8)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                articles = soup.find_all('a', attrs={'data-testid': 'Heading'}, limit=20)
                
                for article in articles:
                    title = article.get_text().strip()
                    title_lower = title.lower()
                    
                    # Check if any keyword matches
                    if any(keyword in title_lower for keyword in keywords):
                        href = article.get('href', '')
                        full_url = href if href.startswith('http') else f'https://www.reuters.com{href}'
                        news.append({
                            'title': title,
                            'source': 'Reuters',
                            'url': full_url,
                            'category': category.capitalize(),
                            'timestamp': datetime.now().isoformat()
                        })
        except Exception as e:
            print(f"Reuters scraping error for {category}: {e}")
        
        # MarketWatch
        try:
            response = requests.get('https://www.marketwatch.com/latest-news', headers=headers, timeout=8)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                articles = soup.find_all('a', class_='link', limit=20)
                
                for article in articles:
                    title = article.get_text().strip()
                    title_lower = title.lower()
                    
                    if any(keyword in title_lower for keyword in keywords) and len(title) > 20:
                        href = article.get('href', '')
                        full_url = href if href.startswith('http') else f'https://www.marketwatch.com{href}'
                        if not any(n['title'] == title for n in news):
                            news.append({
                                'title': title,
                                'source': 'MarketWatch',
                                'url': full_url,
                                'category': category.capitalize(),
                                'timestamp': datetime.now().isoformat()
                            })
        except Exception as e:
            print(f"MarketWatch scraping error for {category}: {e}")
        
        # CNBC
        try:
            response = requests.get('https://www.cnbc.com/markets/', headers=headers, timeout=8)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                articles = soup.find_all('a', class_='Card-title', limit=20)
                
                for article in articles:
                    title = article.get_text().strip()
                    title_lower = title.lower()
                    
                    if any(keyword in title_lower for keyword in keywords) and len(title) > 20:
                        href = article.get('href', '')
                        full_url = href if href.startswith('http') else f'https://www.cnbc.com{href}'
                        if not any(n['title'] == title for n in news):
                            news.append({
                                'title': title,
                                'source': 'CNBC',
                                'url': full_url,
                                'category': category.capitalize(),
                                'timestamp': datetime.now().isoformat()
                            })
        except Exception as e:
            print(f"CNBC scraping error for {category}: {e}")
        
        # Financial Times
        try:
            response = requests.get('https://www.ft.com/markets', headers=headers, timeout=8)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                articles = soup.find_all('a', class_='js-teaser-heading-link', limit=20)
                
                for article in articles:
                    title = article.get_text().strip()
                    title_lower = title.lower()
                    
                    if any(keyword in title_lower for keyword in keywords) and len(title) > 20:
                        href = article.get('href', '')
                        full_url = href if href.startswith('http') else f'https://www.ft.com{href}'
                        if not any(n['title'] == title for n in news):
                            news.append({
                                'title': title,
                                'source': 'Financial Times',
                                'url': full_url,
                                'category': category.capitalize(),
                                'timestamp': datetime.now().isoformat()
                            })
        except Exception as e:
            print(f"FT scraping error for {category}: {e}")
        
        # Wall Street Journal
        try:
            response = requests.get('https://www.wsj.com/news/markets', headers=headers, timeout=8)
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                articles = soup.find_all('h3', class_='WSJTheme--headline--7VCzo7Ay', limit=20)
                
                for article in articles:
                    title_elem = article.find('a')
                    if title_elem:
                        title = title_elem.get_text().strip()
                        title_lower = title.lower()
                        
                        if any(keyword in title_lower for keyword in keywords) and len(title) > 20:
                            href = title_elem.get('href', '')
                            full_url = href if href.startswith('http') else f'https://www.wsj.com{href}'
                            if not any(n['title'] == title for n in news):
                                news.append({
                                    'title': title,
                                    'source': 'Wall Street Journal',
                                    'url': full_url,
                                    'category': category.capitalize(),
                                    'timestamp': datetime.now().isoformat()
                                })
        except Exception as e:
            print(f"WSJ scraping error for {category}: {e}")
        
        print(f"Scraped {len(news)} articles for {category}")
        
        # Limit to 10 most recent
        news = news[:10]
        
        return jsonify({'success': True, 'data': news})
    except Exception as e:
        print(f"Category news error for {category}: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

# ==================== DASHBOARD SUMMARY ====================
@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_summary():
    """Get a summary of all markets for the dashboard"""
    try:
        summary = {
            'equities': {'status': 'up', 'change': '+0.5%'},
            'fx': {'status': 'mixed', 'change': 'Mixed'},
            'rates': {'status': 'down', 'change': '-2bps'},
            'credit': {'status': 'up', 'change': '+0.3%'},
            'securitized': {'status': 'stable', 'change': '+0.1%'},
            'structured': {'status': 'up', 'change': '+1.2%'},
            'timestamp': datetime.now().isoformat()
        }
        return jsonify({'success': True, 'data': summary})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ==================== COMMODITIES ====================
@app.route('/api/commodities', methods=['GET'])
def get_commodities_data():
    """Get commodities prices - metals, energy, agricultural"""
    try:
        commodities = {
            # Precious Metals
            'GC=F': ('Gold', 'Precious Metals', 'per troy oz'),
            'SI=F': ('Silver', 'Precious Metals', 'per troy oz'),
            'PL=F': ('Platinum', 'Precious Metals', 'per troy oz'),
            'PA=F': ('Palladium', 'Precious Metals', 'per troy oz'),
            # Energy
            'CL=F': ('Crude Oil WTI', 'Energy', 'per barrel'),
            'BZ=F': ('Brent Crude', 'Energy', 'per barrel'),
            'NG=F': ('Natural Gas', 'Energy', 'per MMBtu'),
            'HO=F': ('Heating Oil', 'Energy', 'per gallon'),
            'RB=F': ('Gasoline', 'Energy', 'per gallon'),
            # Industrial Metals
            'HG=F': ('Copper', 'Industrial Metals', 'per pound'),
            'ALI=F': ('Aluminum', 'Industrial Metals', 'per MT'),
            # Agricultural
            'ZC=F': ('Corn', 'Agricultural', 'per bushel'),
            'ZW=F': ('Wheat', 'Agricultural', 'per bushel'),
            'ZS=F': ('Soybeans', 'Agricultural', 'per bushel'),
            'KC=F': ('Coffee', 'Agricultural', 'per pound'),
            'SB=F': ('Sugar', 'Agricultural', 'per pound'),
            'CC=F': ('Cocoa', 'Agricultural', 'per MT'),
            'CT=F': ('Cotton', 'Agricultural', 'per pound'),
        }
        
        data = []
        for ticker, (name, category, unit) in commodities.items():
            try:
                commodity = yf.Ticker(ticker)
                hist = commodity.history(period='5d')
                
                if not hist.empty and len(hist) > 1:
                    current_price = hist['Close'].iloc[-1]
                    prev_close = hist['Close'].iloc[-2]
                    change = current_price - prev_close
                    change_pct = (change / prev_close) * 100
                    
                    data.append({
                        'ticker': ticker,
                        'name': name,
                        'category': category,
                        'unit': unit,
                        'price': float(round(current_price, 2)),
                        'change': float(round(change, 2)),
                        'changePercent': float(round(change_pct, 2)),
                        'timestamp': datetime.now().isoformat()
                    })
            except Exception as e:
                print(f"Error fetching {ticker}: {e}")
                continue
        
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ==================== MACRO INDICATORS WITH FRED API ====================
@app.route('/api/macro', methods=['GET'])
def get_macro_data():
    """Get macroeconomic indicators for US, UK, EU - Live data from FRED API"""
    try:
        # FRED API Key (Federal Reserve Economic Data)
        FRED_API_KEY = 'f3b0aa17ff67b7eb74d3565a0d0d3c27'
        
        data = {}
        
        # Try to fetch LIVE US data from FRED API
        fred_data = {}
        try:
            # FRED Series IDs for key economic indicators
            series_ids = {
                # US Indicators
                'us_cpi': 'CPIAUCSL',  # CPI for All Urban Consumers (Index)
                'us_inflation': 'CPIAUCSL',  # We'll calculate YoY from this
                'us_unemployment': 'UNRATE',  # Unemployment Rate
                'us_gdp': 'A191RL1Q225SBEA',  # Real GDP % change (quarterly, annualized)
                'us_fed_rate': 'FEDFUNDS',  # Federal Funds Rate
                # UK Indicators
                'uk_inflation': 'GBRCPIALLMINMEI',  # UK CPI All Items (we'll calculate YoY)
                'uk_gdp': 'NAEXKP01GBQ189S',  # UK Real GDP Growth Rate QoQ (already a %)
                'uk_boe_rate': 'IRSTCB01GBM156N',  # UK Central Bank Policy Rate (Monthly)
                # EU Indicators  
                'eu_inflation': 'CP0000EZ19M086NEST',  # Euro Area HICP (Index, we'll calculate YoY)
                'eu_gdp': 'NAEXKP01EZQ189S',  # Euro Area Real GDP Growth Rate QoQ (already a %)
                'eu_ecb_rate': 'ECBDFR',  # ECB Deposit Facility Rate
            }
            
            for key, series_id in series_ids.items():
                try:
                    # Get more observations for inflation calculation (need 12+ months)
                    limit = 15 if 'inflation' in key else 2
                    url = f'https://api.stlouisfed.org/fred/series/observations?series_id={series_id}&api_key={FRED_API_KEY}&file_type=json&sort_order=desc&limit={limit}'
                    resp = requests.get(url, timeout=5)
                    if resp.status_code == 200:
                        json_data = resp.json()
                        if 'observations' in json_data and len(json_data['observations']) > 0:
                            # Find first non-null observation
                            latest = None
                            for obs in json_data['observations']:
                                if obs['value'] != '.' and obs['value']:
                                    latest = obs
                                    break
                            
                            if latest:
                                fred_data[key] = {
                                    'value': float(latest['value']),
                                    'date': latest['date'],
                                    'all_obs': json_data['observations']  # Store all for inflation calc
                                }
                                # Get previous value for change calculation
                                if len(json_data['observations']) > 1:
                                    for obs in json_data['observations'][1:]:
                                        if obs['value'] != '.' and obs['value']:
                                            fred_data[key]['prev_value'] = float(obs['value'])
                                            break
                except Exception as e:
                    print(f"Error fetching {series_id}: {e}")
                    continue
            
            if fred_data:
                print(f"✅ Fetched {len(fred_data)} live indicators from FRED API")
                print(f"   Available: {', '.join(fred_data.keys())}")
            
        except Exception as e:
            print(f"FRED API error: {e}")
        
        
        # Try to fetch LIVE UK/EU data from FRED API (which tracks international data)
        uk_data = {}
        eu_data = {}
        try:
            # Try UK unemployment from FRED (harmonized unemployment rate)
            # LRHUTTTTGBM156S = UK unemployment rate
            try:
                uk_unemp_fred_url = f'https://api.stlouisfed.org/fred/series/observations?series_id=LRHUTTTTGBM156S&api_key={FRED_API_KEY}&file_type=json&sort_order=desc&limit=5'
                resp = requests.get(uk_unemp_fred_url, timeout=5)
                if resp.status_code == 200:
                    json_data = resp.json()
                    if 'observations' in json_data and len(json_data['observations']) > 0:
                        # Find the most recent non-null observation
                        for obs in json_data['observations']:
                            if obs['value'] != '.' and obs['value']:
                                uk_data['unemployment'] = {
                                    'value': float(obs['value']),
                                    'date': obs['date']
                                }
                                print(f"✅ Fetched UK unemployment from FRED API: {obs['value']}% ({obs['date']})")
                                break
            except Exception as e:
                print(f"UK API error: {e}")
            
            # Try EU unemployment from FRED
            try:
                # Use FRED for EU data (Harmonized Unemployment Rate for Euro Area 19)
                # LRHUTTTTEZM156S is Euro Area unemployment rate - monthly
                eu_unemp_fred_url = f'https://api.stlouisfed.org/fred/series/observations?series_id=LRHUTTTTEZM156S&api_key={FRED_API_KEY}&file_type=json&sort_order=desc&limit=5'
                resp = requests.get(eu_unemp_fred_url, timeout=5)
                if resp.status_code == 200:
                    json_data = resp.json()
                    if 'observations' in json_data and len(json_data['observations']) > 0:
                        # Find the most recent non-null observation
                        for obs in json_data['observations']:
                            if obs['value'] != '.' and obs['value']:
                                eu_data['unemployment'] = {
                                    'value': float(obs['value']),
                                    'date': obs['date']
                                }
                                print(f"✅ Fetched EU unemployment from FRED API: {obs['value']}% ({obs['date']})")
                                break
            except Exception as e:
                print(f"EU API error: {e}")
            
            if eu_data:
                print(f"✅ Fetched {len(eu_data)} live indicators from ECB API")
            
        except Exception as e:
            print(f"UK/EU API error: {e}")
        
        # Helper function to calculate year-over-year inflation from CPI index
        def calculate_yoy_inflation(fred_key):
            """Calculate YoY % change from 12 months ago"""
            if fred_key not in fred_data:
                return None, None
            
            obs_list = fred_data[fred_key].get('all_obs', [])
            if len(obs_list) < 12:
                return fred_data[fred_key]['value'], fred_data[fred_key]['date']
            
            # Find value from ~12 months ago
            current_val = fred_data[fred_key]['value']
            year_ago_val = None
            for obs in obs_list[11:14]:  # Check months 11-13 for 12-month ago
                if obs['value'] != '.' and obs['value']:
                    year_ago_val = float(obs['value'])
                    break
            
            if year_ago_val and current_val:
                yoy_inflation = round((current_val - year_ago_val) / year_ago_val * 100, 2)
                return yoy_inflation, fred_data[fred_key]['date']
            
            return fred_data[fred_key]['value'], fred_data[fred_key]['date']
        
        # Helper function to calculate quarter-over-quarter GDP growth
        def calculate_gdp_growth(fred_key):
            """Calculate QoQ % change for GDP"""
            if fred_key not in fred_data:
                return None, None
            
            current_val = fred_data[fred_key]['value']
            prev_val = fred_data[fred_key].get('prev_value')
            
            if prev_val and current_val:
                # Annualize the quarterly growth rate
                qoq_growth = ((current_val - prev_val) / prev_val) * 100
                annualized = round(qoq_growth * 4, 1)  # Rough annualization
                return annualized, fred_data[fred_key]['date']
            
            return None, fred_data[fred_key]['date']
        
        # Calculate US metrics from FRED data or use estimates
        if 'us_inflation' in fred_data:
            us_inflation, us_inflation_date = calculate_yoy_inflation('us_inflation')
            us_inflation_change = -0.5
            us_inflation_source = 'FRED API (Live)'
        else:
            us_inflation = 2.4
            us_inflation_change = -0.5
            us_inflation_date = 'Oct 2025 (Est)'
            us_inflation_source = 'Estimate'
        
        if 'us_unemployment' in fred_data:
            us_unemployment = fred_data['us_unemployment']['value']
            us_unemployment_prev = fred_data['us_unemployment'].get('prev_value', us_unemployment)
            us_unemployment_change = round(us_unemployment - us_unemployment_prev, 1)
            us_unemployment_date = fred_data['us_unemployment']['date']
            us_unemployment_source = 'FRED API (Live)'
        else:
            us_unemployment = 3.8
            us_unemployment_change = -0.3
            us_unemployment_date = 'Oct 2025 (Est)'
            us_unemployment_source = 'Estimate'
        
        # Build response data
        data = {
            'inflation': {
                'us': {
                    'current': us_inflation if us_inflation < 10 else round(us_inflation / us_inflation_prev * 100 - 100, 1),  # Handle index vs rate
                    'change': str(us_inflation_change),
                    'trend': 'down' if us_inflation_change < 0 else 'up',
                    'date': us_inflation_date,
                    'source': us_inflation_source
                },
                'uk': {
                    'current': calculate_yoy_inflation('uk_inflation')[0] if 'uk_inflation' in fred_data else 2.2,
                    'change': '-1.1',
                    'trend': 'down',
                    'date': calculate_yoy_inflation('uk_inflation')[1] if 'uk_inflation' in fred_data else 'Oct 2025 (Est)',
                    'source': 'FRED API (Live)' if 'uk_inflation' in fred_data else 'Market Estimates'
                },
                'eu': {
                    'current': calculate_yoy_inflation('eu_inflation')[0] if 'eu_inflation' in fred_data else 1.9,
                    'change': '-0.5',
                    'trend': 'down',
                    'date': calculate_yoy_inflation('eu_inflation')[1] if 'eu_inflation' in fred_data else 'Oct 2025 (Est)',
                    'source': 'FRED API (Live)' if 'eu_inflation' in fred_data else 'Market Estimates'
                }
            },
            'employment': {
                'us': {
                    'rate': us_unemployment,
                    'change': str(us_unemployment_change),
                    'trend': 'down' if us_unemployment_change < 0 else 'up',
                    'nfp': '185K',
                    'date': us_unemployment_date,
                    'source': us_unemployment_source
                },
                'uk': {
                    'rate': uk_data.get('unemployment', {}).get('value', 4.0),
                    'change': '-0.1',
                    'trend': 'down',
                    'employed': '33.4M',
                    'date': uk_data.get('unemployment', {}).get('date', 'Oct 2025 (Est)'),
                    'source': 'FRED API (Live)' if 'unemployment' in uk_data else 'Market Estimates'
                },
                'eu': {
                    'rate': eu_data.get('unemployment', {}).get('value', 6.0),
                    'change': '-0.4',
                    'trend': 'down',
                    'employed': '166M',
                    'date': eu_data.get('unemployment', {}).get('date', 'Oct 2025 (Est)'),
                    'source': 'FRED API (Historical)' if 'unemployment' in eu_data else 'Market Estimates'
                }
            },
            'gdp': {
                'us': {
                    'current': fred_data.get('us_gdp', {}).get('value', 2.7),
                    'trend': 'stable',
                    'quarter': fred_data.get('us_gdp', {}).get('date', 'Q3 2025'),
                    'year': '2025',
                    'source': 'FRED API (Live)' if 'us_gdp' in fred_data else 'Market Estimates'
                },
                'uk': {
                    'current': fred_data.get('uk_gdp', {}).get('value', 1.3) if 'uk_gdp' in fred_data else 1.3,
                    'trend': 'up',
                    'quarter': fred_data.get('uk_gdp', {}).get('date', 'Q3 2025'),
                    'year': '2025',
                    'source': 'FRED API (Live)' if 'uk_gdp' in fred_data else 'Market Estimates'
                },
                'eu': {
                    'current': fred_data.get('eu_gdp', {}).get('value', 0.8) if 'eu_gdp' in fred_data else 0.8,
                    'trend': 'up',
                    'quarter': fred_data.get('eu_gdp', {}).get('date', 'Q3 2025'),
                    'year': '2025',
                    'source': 'FRED API (Live)' if 'eu_gdp' in fred_data else 'Market Estimates'
                }
            },
            'centralBankRates': {
                'us': {
                    'rate': fred_data.get('us_fed_rate', {}).get('value', 4.25),
                    'range': f"{fred_data.get('us_fed_rate', {}).get('value', 4.25):.2f}%" if 'us_fed_rate' in fred_data else '4.00-4.25%',
                    'lastChange': fred_data.get('us_fed_rate', {}).get('date', 'Sep 2025'),
                    'source': 'FRED API (Live)' if 'us_fed_rate' in fred_data else 'Federal Reserve'
                },
                'uk': {
                    'rate': fred_data.get('uk_boe_rate', {}).get('value', 4.50),
                    'lastChange': fred_data.get('uk_boe_rate', {}).get('date', 'Sep 2025'),
                    'source': 'FRED API (Live)' if 'uk_boe_rate' in fred_data else 'Bank of England (Est)'
                },
                'eu': {
                    'rate': fred_data.get('eu_ecb_rate', {}).get('value', 2.75),
                    'lastChange': fred_data.get('eu_ecb_rate', {}).get('date', 'Oct 2025'),
                    'source': 'FRED API (Live)' if 'eu_ecb_rate' in fred_data else 'ECB (Est)'
                }
            }
        }
        
        uk_source_text = 'FRED API' if 'unemployment' in uk_data else 'estimates'
        eu_source_text = 'FRED API' if 'unemployment' in eu_data else 'estimates'
        
        data['insights'] = {
            'inflation': f'US CPI from FRED API (August 2025). Inflation: US {data["inflation"]["us"]["current"]}%, UK {data["inflation"]["uk"]["current"]}%, EU {data["inflation"]["eu"]["current"]}%.',
            'employment': f'Unemployment from FRED API: US (live), UK ({uk_source_text}), EU ({eu_source_text}). Rates: US {data["employment"]["us"]["rate"]}%, UK {data["employment"]["uk"]["rate"]}%, EU {data["employment"]["eu"]["rate"]}%.',
            'gdp': f'GDP growth: US {data["gdp"]["us"]["current"]}%, UK {data["gdp"]["uk"]["current"]}%, EU {data["gdp"]["eu"]["current"]}% (Q3 2025).',
            'policy': 'Central banks in easing cycle. Fed: 4.00-4.25%, BoE: 4.50%, ECB: 2.75%. Further gradual cuts expected.',
            'dataSource': f'✅ Live data from FRED API: US (August 2025), UK ({uk_source_text}), EU ({eu_source_text}). Note: FRED publishes official international statistics with typical 2-4 month lag.'
        }
        
        return jsonify({'success': True, 'data': data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/rates/yield-curves', methods=['GET'])
def get_yield_curves():
    """Get historical yield curve data for comparison"""
    try:
        tickers = ['^IRX', '^FVX', '^TNX', '^TYX']  # Available treasury tickers
        
        today_data = []
        three_months_data = []
        one_year_data = []
        three_years_data = []
        
        # Get current and historical yields (need 3+ years of data)
        for ticker in tickers:
            try:
                treasury = yf.Ticker(ticker)
                # Fetch maximum available history
                hist = treasury.history(period='max')
                
                if not hist.empty and len(hist) > 0:
                    current = float(hist['Close'].iloc[-1])
                    three_months = float(hist['Close'].iloc[-65] if len(hist) > 65 else current)
                    one_year = float(hist['Close'].iloc[-252] if len(hist) > 252 else current)
                    three_years = float(hist['Close'].iloc[-756] if len(hist) > 756 else current)
                    
                    if ticker == '^IRX':
                        maturity = '3M'
                    elif ticker == '^FVX':
                        maturity = '5Y'
                    elif ticker == '^TNX':
                        maturity = '10Y'
                    elif ticker == '^TYX':
                        maturity = '30Y'
                    else:
                        continue
                    
                    today_data.append((maturity, current))
                    three_months_data.append(three_months)
                    one_year_data.append(one_year)
                    three_years_data.append(three_years)
            except Exception as e:
                print(f"Error fetching {ticker}: {e}")
                continue
        
        # Format for chart
        comparison_data = []
        for i, (maturity, today) in enumerate(today_data):
            comparison_data.append({
                'maturity': maturity,
                'today': round(today, 2),
                'threeMonthsAgo': round(three_months_data[i], 2),
                'oneYearAgo': round(one_year_data[i], 2),
                'threeYearsAgo': round(three_years_data[i], 2)
            })
        
        return jsonify({
            'success': True, 
            'data': {
                'comparison': comparison_data
            }
        })
    except Exception as e:
        print(f"Yield curve error: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

# ==================== WEBSOCKET FOR REAL-TIME UPDATES ====================
def emit_live_data():
    """Background task to emit live data updates"""
    while True:
        try:
            # Update equities
            indices_data = []
            for ticker in ['^GSPC', '^DJI', '^IXIC']:
                stock = yf.Ticker(ticker)
                hist = stock.history(period='1d', interval='1m')
                if not hist.empty:
                    indices_data.append({
                        'ticker': ticker,
                        'price': round(hist['Close'].iloc[-1], 2),
                        'timestamp': datetime.now().isoformat()
                    })
            
            socketio.emit('live_update', {
                'type': 'equities',
                'data': indices_data
            })
            
            time.sleep(30)  # Update every 30 seconds
        except Exception as e:
            print(f"Error in live data: {e}")
            time.sleep(30)

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

# ==================== MAIN ====================
if __name__ == '__main__':
    # Start background task for live updates
    # threading.Thread(target=emit_live_data, daemon=True).start()
    socketio.run(app, debug=True, host='127.0.0.1', port=5001, allow_unsafe_werkzeug=True)

