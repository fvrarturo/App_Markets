import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import './Dashboard.css'

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [equitiesData, setEquitiesData] = useState([])
  const [fxData, setFxData] = useState([])
  const [ratesData, setRatesData] = useState([])
  const [newsData, setNewsData] = useState([])
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    fetchAllData()
    const interval = setInterval(fetchAllData, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const fetchAllData = async () => {
    try {
      const [equities, fx, rates, news, chart] = await Promise.all([
        axios.get('/api/equities'),
        axios.get('/api/fx'),
        axios.get('/api/rates'),
        axios.get('/api/news'),
        axios.get('/api/equities/chart/^GSPC?period=1d&interval=5m')
      ])

      setEquitiesData(equities.data.data || [])
      setFxData(fx.data.data || [])
      setRatesData(rates.data.data || [])
      setNewsData(news.data.data || [])
      setChartData(chart.data.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  const getChangeIcon = (change) => {
    if (change > 0) return <FiTrendingUp className="positive" />
    if (change < 0) return <FiTrendingDown className="negative" />
    return <FiMinus className="neutral" />
  }

  const getChangeClass = (change) => {
    if (change > 0) return 'positive'
    if (change < 0) return 'negative'
    return 'neutral'
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Markets Dashboard</h1>
        <p>Real-time market data across all asset classes</p>
      </div>

      {/* Market Overview Cards */}
      <div className="overview-section">
        <h2 className="section-title">Market Overview</h2>
        <div className="cards-grid">
          <div className="card overview-card">
            <div className="overview-card-icon equities">
              <FiTrendingUp />
            </div>
            <div className="overview-card-content">
              <h3>Equities</h3>
              <p className="overview-value">
                {equitiesData.length > 0 ? equitiesData[0].price : '--'}
              </p>
              <p className={`overview-change ${getChangeClass(equitiesData[0]?.change)}`}>
                {equitiesData[0]?.change > 0 ? '+' : ''}{equitiesData[0]?.change} 
                ({equitiesData[0]?.changePercent > 0 ? '+' : ''}{equitiesData[0]?.changePercent}%)
              </p>
            </div>
          </div>

          <div className="card overview-card">
            <div className="overview-card-icon fx">
              <FiTrendingUp />
            </div>
            <div className="overview-card-content">
              <h3>FX Markets</h3>
              <p className="overview-value">
                {fxData.length} pairs
              </p>
              <p className="overview-subtitle">Real-time rates</p>
            </div>
          </div>

          <div className="card overview-card">
            <div className="overview-card-icon rates">
              <FiTrendingUp />
            </div>
            <div className="overview-card-content">
              <h3>Treasury Rates</h3>
              <p className="overview-value">
                {ratesData.length > 0 ? `${ratesData[0].yield}%` : '--'}
              </p>
              <p className="overview-subtitle">10Y US Treasury</p>
            </div>
          </div>

          <div className="card overview-card">
            <div className="overview-card-icon credit">
              <FiTrendingUp />
            </div>
            <div className="overview-card-content">
              <h3>Credit Markets</h3>
              <p className="overview-value">Active</p>
              <p className="overview-subtitle">All spreads tracked</p>
            </div>
          </div>
        </div>
      </div>

      {/* S&P 500 Chart */}
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">S&P 500 - Intraday</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#667eea" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 146, 176, 0.1)" />
            <XAxis 
              dataKey="timestamp" 
              stroke="#8b92b0"
              tick={{ fill: '#8b92b0' }}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
              }}
            />
            <YAxis 
              stroke="#8b92b0"
              tick={{ fill: '#8b92b0' }}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ 
                background: '#1e2447', 
                border: '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '8px',
                color: '#ffffff'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="close" 
              stroke="#667eea" 
              strokeWidth={2}
              fill="url(#colorPrice)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Major Indices */}
      <div className="section">
        <h2 className="section-title">Major Indices</h2>
        <div className="cards-grid">
          {equitiesData.slice(0, 6).map((equity) => (
            <div key={equity.ticker} className="card">
              <div className="card-header">
                <span className="card-title">{equity.name}</span>
                {getChangeIcon(equity.change)}
              </div>
              <div className="card-value">{equity.price.toLocaleString()}</div>
              <div className={`card-change ${getChangeClass(equity.change)}`}>
                {equity.change > 0 ? '+' : ''}{equity.change} ({equity.changePercent > 0 ? '+' : ''}{equity.changePercent}%)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FX Rates */}
      <div className="section">
        <h2 className="section-title">Major Currency Pairs</h2>
        <div className="cards-grid">
          {fxData.slice(0, 6).map((fx) => (
            <div key={fx.pair} className="card">
              <div className="card-header">
                <span className="card-title">{fx.pair}</span>
                {getChangeIcon(fx.change)}
              </div>
              <div className="card-value">{fx.rate.toFixed(4)}</div>
              <div className={`card-change ${getChangeClass(fx.change)}`}>
                {fx.change > 0 ? '+' : ''}{fx.change} ({fx.changePercent > 0 ? '+' : ''}{fx.changePercent}%)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market News */}
      <div className="news-container">
        <h2 className="section-title">Market News</h2>
        {newsData.slice(0, 5).map((news, index) => (
          <div key={index} className="news-item">
            <div className="news-title">{news.title}</div>
            <div className="news-meta">
              <span>{news.source}</span>
              <span>•</span>
              <span>{new Date(news.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard

