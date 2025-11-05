import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { FiRefreshCw, FiBookOpen, FiEye, FiMessageCircle, FiExternalLink } from 'react-icons/fi'
import { cachedFetch } from '../utils/cache'
import './AssetClass.css'

const Equities = () => {
  const [data, setData] = useState([])
  const [chartData, setChartData] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingNews, setLoadingNews] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState('^GSPC')
  const [timeframe, setTimeframe] = useState('1d')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchData()
    fetchNews()
    const interval = setInterval(() => {
      fetchData()
      fetchNews()
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetchChartData()
  }, [selectedIndex, timeframe])

  const fetchData = async () => {
    try {
      const response = await cachedFetch('/api/equities', { durationType: 'realtime' })
      setData(response.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching equities:', error)
      setLoading(false)
    }
  }

  const fetchNews = async () => {
    try {
      const response = await cachedFetch('/api/news/equities', { durationType: 'news' })
      setNews(response.data || [])
      setLoadingNews(false)
    } catch (error) {
      console.error('Error fetching news:', error)
      setLoadingNews(false)
    }
  }

  const fetchChartData = async () => {
    try {
      const intervalMap = {
        '1d': '5m',
        '5d': '30m',
        '1mo': '1d',
        '3mo': '1d'
      }
      const response = await cachedFetch(
        `/api/equities/chart/${selectedIndex}?period=${timeframe}&interval=${intervalMap[timeframe]}`,
        { durationType: 'realtime' }
      )
      
      // Transform data to match chart format
      const transformedData = (response.data || []).map(item => ({
        time: new Date(item.timestamp).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        price: item.close,
        date: item.timestamp
      }))
      
      setChartData(transformedData)
    } catch (error) {
      console.error('Error fetching chart:', error)
    }
  }

  if (loading) {
    return (
      <div className="asset-class">
        <div className="loading">Loading equities data...</div>
      </div>
    )
  }

  return (
    <div className="asset-class">
      {/* Header */}
      <div className="asset-header">
        <h1>Equities</h1>
        <button className="refresh-btn" onClick={() => { fetchData(); fetchNews(); }}>
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="tab-nav">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'desk' ? 'active' : ''}`}
          onClick={() => setActiveTab('desk')}
        >
          <FiBookOpen /> What the Desk Does
        </button>
        <button 
          className={`tab-btn ${activeTab === 'indicators' ? 'active' : ''}`}
          onClick={() => setActiveTab('indicators')}
        >
          <FiEye /> How to View Indicators
        </button>
        {/* <button 
          className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          <FiMessageCircle /> Questions to Ask
        </button> */}
        <button 
          className={`tab-btn ${activeTab === 'news' ? 'active' : ''}`}
          onClick={() => setActiveTab('news')}
        >
          📰 News
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Chart */}
          <div className="chart-section">
            <div className="chart-controls">
              <select 
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(e.target.value)}
                className="index-selector"
              >
                <option value="^GSPC">S&P 500</option>
                <option value="^IXIC">NASDAQ</option>
                <option value="^DJI">Dow Jones</option>
                <option value="^FTSE">FTSE 100</option>
                <option value="^GDAXI">DAX</option>
                <option value="^FCHI">CAC 40</option>
                <option value="^N225">Nikkei 225</option>
                <option value="^HSI">Hang Seng</option>
              </select>
              
              <div className="timeframe-buttons">
                {['1d', '5d', '1mo', '3mo'].map(tf => (
                  <button
                    key={tf}
                    className={`timeframe-btn ${timeframe === tf ? 'active' : ''}`}
                    onClick={() => setTimeframe(tf)}
                  >
                    {tf === '1d' ? '1D' : tf === '5d' ? '5D' : tf === '1mo' ? '1M' : '3M'}
                  </button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                <XAxis 
                  dataKey="time" 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8' }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8' }}
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Data Cards */}
          <div className="data-grid">
            {data.map((item, index) => (
              <div key={index} className="data-card">
                <h3>{item.name}</h3>
                <div className="price">${item.price?.toLocaleString()}</div>
                <div className={`change ${item.change < 0 ? 'negative' : 'positive'}`}>
                  {item.change?.toFixed(2)} ({item.changePercent?.toFixed(2)}%)
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* What the Desk Does Tab */}
      {activeTab === 'desk' && (
        <div className="info-section">
          <div className="info-card">
            <h2><FiBookOpen /> What the Equities Desk Does</h2>
            <ul className="info-list">
              <li>Trades stocks, ETFs, and equity derivatives to provide liquidity and market access.</li>
              <li>Focuses on client execution, risk management, and pricing volatility (options).</li>
              <li>In London: heavy focus on European equities, structured equity, and financing (prime brokerage).</li>
            </ul>
          </div>
        </div>
      )}

      {/* How to View Indicators Tab */}
      {activeTab === 'indicators' && (
        <div className="info-section">
          <div className="info-card">
            <h2><FiEye /> How to View Indicators</h2>
            <div className="indicator-list">
              <div className="indicator-item">
                <h3>📈 Rising indices (EuroStoxx, FTSE, DAX)</h3>
                <p>Risk-on tone, equity traders long-biased.</p>
              </div>
              <div className="indicator-item">
                <h3>📉 Falling implied vol (VIX/VStoxx)</h3>
                <p>Quieter markets, more structured-yield issuance.</p>
              </div>
              <div className="indicator-item">
                <h3>💹 Widening vol</h3>
                <p>Hedging demand, index options pricing more expensive.</p>
              </div>
              <div className="indicator-item">
                <h3>🔄 Sector performance shifts (banks vs tech)</h3>
                <p>Rotation themes, affect flow and hedging.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Questions to Ask Tab */}
      {/* {activeTab === 'questions' && (
        <div className="info-section">
          <div className="info-card">
            <h2><FiMessageCircle /> Questions to Ask the Desk</h2>
            <div className="questions-list">
              <div className="question-item">
                <span className="q-mark">Q:</span>
                <p>"Which sectors are driving most of your flow recently?"</p>
              </div>
              <div className="question-item">
                <span className="q-mark">Q:</span>
                <p>"How does lower volatility affect your book or client activity?"</p>
              </div>
              <div className="question-item">
                <span className="q-mark">Q:</span>
                <p>"Do you see more demand for yield structures or protection lately?"</p>
              </div>
              <div className="question-item">
                <span className="q-mark">Q:</span>
                <p>"How do you hedge large client orders when liquidity dries up?"</p>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* News Tab */}
      {activeTab === 'news' && (
        <div className="info-section">
          <div className="info-card">
            <h2>📰 Equities News</h2>
            {loadingNews ? (
              <p className="loading-text">Loading news...</p>
            ) : news.length > 0 ? (
              <div className="news-list">
                {news.map((article, index) => (
                  <div key={index} className="news-item">
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-link">
                      <h3>
                        {article.title}
                        <FiExternalLink className="external-icon" />
                      </h3>
                      <div className="news-meta">
                        <span className="news-source">{article.source}</span>
                        <span className="news-time">{new Date(article.timestamp).toLocaleString()}</span>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No news articles found for this category.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Equities

