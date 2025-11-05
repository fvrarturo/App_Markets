import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { FiRefreshCw, FiBookOpen, FiEye, FiMessageCircle, FiExternalLink } from 'react-icons/fi'
import { cachedFetch } from '../utils/cache'
import './AssetClass.css'

const FX = () => {
  const [data, setData] = useState([])
  const [news, setNews] = useState([])
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingNews, setLoadingNews] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [timeframe, setTimeframe] = useState('5d')

  useEffect(() => {
    fetchData()
    fetchNews()
    fetchChartData()
    const interval = setInterval(() => {
      fetchData()
      fetchNews()
      fetchChartData()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetchChartData()
  }, [timeframe])

  const fetchData = async () => {
    try {
      const response = await cachedFetch('/api/fx', { durationType: 'realtime' })
      setData(response.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching FX data:', error)
      setLoading(false)
    }
  }

  const fetchNews = async () => {
    try {
      const response = await cachedFetch('/api/news/fx', { durationType: 'news' })
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
        `/api/equities/chart/DX-Y.NYB?period=${timeframe}&interval=${intervalMap[timeframe]}`,
        { durationType: 'realtime' }
      )
      
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
      console.error('Error fetching DXY chart:', error)
    }
  }

  if (loading) {
    return (
      <div className="asset-class">
        <div className="loading">Loading FX data...</div>
      </div>
    )
  }

  return (
    <div className="asset-class">
      <div className="asset-header">
        <h1>FX (Foreign Exchange)</h1>
        <button className="refresh-btn" onClick={() => { fetchData(); fetchNews(); }}>
          <FiRefreshCw /> Refresh
        </button>
      </div>

      <div className="tab-nav">
        <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`tab-btn ${activeTab === 'desk' ? 'active' : ''}`} onClick={() => setActiveTab('desk')}><FiBookOpen /> What the Desk Does</button>
        <button className={`tab-btn ${activeTab === 'indicators' ? 'active' : ''}`} onClick={() => setActiveTab('indicators')}><FiEye /> How to View Indicators</button>
        {/* <button className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`} onClick={() => setActiveTab('questions')}><FiMessageCircle /> Questions to Ask</button> */}
        <button className={`tab-btn ${activeTab === 'news' ? 'active' : ''}`} onClick={() => setActiveTab('news')}>📰 News</button>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* DXY Chart */}
          <div className="chart-section">
            <div className="chart-header">
              <h2>US Dollar Index (DXY)</h2>
              <div className="timeframe-buttons">
                {['5d', '1mo', '3mo'].map(tf => (
                  <button
                    key={tf}
                    className={`timeframe-btn ${timeframe === tf ? 'active' : ''}`}
                    onClick={() => setTimeframe(tf)}
                  >
                    {tf.toUpperCase()}
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

          {/* FX Pairs Data Cards */}
          <div className="data-grid">
            {data.map((pair, index) => (
              <div key={index} className="data-card">
                <h3>{pair.pair}</h3>
                <div className="price">{pair.rate}</div>
                <div className={`change ${pair.change < 0 ? 'negative' : 'positive'}`}>
                  {pair.change?.toFixed(4)} ({pair.changePercent?.toFixed(2)}%)
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'desk' && (
        <div className="info-section">
          <div className="info-card">
            <h2><FiBookOpen /> What the FX Desk Does</h2>
            <ul className="info-list">
              <li>Trades currency pairs (spot, forwards, swaps, options).</li>
              <li>Provides liquidity, hedging, and speculative access to FX markets.</li>
              <li>London is the global hub for G10 and EMEA currencies.</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'indicators' && (
        <div className="info-section">
          <div className="info-card">
            <h2><FiEye /> How to View Indicators</h2>
            <div className="indicator-list">
              <div className="indicator-item">
                <h3>📈 DXY up</h3>
                <p>USD strength; often risk-off.</p>
              </div>
              <div className="indicator-item">
                <h3>💰 Carry differentials</h3>
                <p>Drive EM and high-yield currency flows.</p>
              </div>
              <div className="indicator-item">
                <h3>📊 FX vol rising</h3>
                <p>Option traders busy, more hedging flows.</p>
              </div>
              <div className="indicator-item">
                <h3>💹 Basis swaps widening</h3>
                <p>USD funding tightness.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* {activeTab === 'questions' && (
        <div className="info-section">
          <div className="info-card">
            <h2><FiMessageCircle /> Questions to Ask the Desk</h2>
            <div className="questions-list">
              <div className="question-item">
                <span className="q-mark">Q:</span>
                <p>"Where do you see most client flow—hedging or speculation?"</p>
              </div>
              <div className="question-item">
                <span className="q-mark">Q:</span>
                <p>"How have carry trades behaved with recent rate differentials?"</p>
              </div>
              <div className="question-item">
                <span className="q-mark">Q:</span>
                <p>"What's been driving EUR/USD skew—more demand for calls or puts?"</p>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {activeTab === 'news' && (
        <div className="info-section">
          <div className="info-card">
            <h2>📰 FX News</h2>
            {loadingNews ? (
              <p className="loading-text">Loading news...</p>
            ) : news.length > 0 ? (
              <div className="news-list">
                {news.map((article, index) => (
                  <div key={index} className="news-item">
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-link">
                      <h3>{article.title}<FiExternalLink className="external-icon" /></h3>
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

export default FX

