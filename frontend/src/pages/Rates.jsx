import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { FiRefreshCw, FiBookOpen, FiEye, FiMessageCircle, FiExternalLink } from 'react-icons/fi'
import { cachedFetch } from '../utils/cache'
import './AssetClass.css'

const Rates = () => {
  const [data, setData] = useState([])
  const [yieldCurves, setYieldCurves] = useState(null)
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingNews, setLoadingNews] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchData()
    fetchYieldCurves()
    fetchNews()
    const interval = setInterval(() => {
      fetchData()
      fetchYieldCurves()
      fetchNews()
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const response = await cachedFetch('/api/rates', { durationType: 'rates' })
      setData(response.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching rates:', error)
      setLoading(false)
    }
  }

  const fetchYieldCurves = async () => {
    try {
      const response = await cachedFetch('/api/rates/yield-curves', { durationType: 'rates' })
      setYieldCurves(response.data || null)
    } catch (error) {
      console.error('Error fetching yield curves:', error)
    }
  }

  const fetchNews = async () => {
    try {
      const response = await cachedFetch('/api/news/rates', { durationType: 'news' })
      setNews(response.data || [])
      setLoadingNews(false)
    } catch (error) {
      console.error('Error fetching news:', error)
      setLoadingNews(false)
    }
  }

  if (loading) {
    return (
      <div className="asset-class">
        <div className="loading">Loading rates data...</div>
      </div>
    )
  }

  const yieldCurveData = data.map(rate => ({
    name: rate.name.replace('US Treasury ', ''),
    yield: rate.yield
  }))

  return (
    <div className="asset-class">
      {/* Header */}
      <div className="asset-header">
        <h1>Rates</h1>
        <button className="refresh-btn" onClick={() => { fetchData(); fetchYieldCurves(); fetchNews(); }}>
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
          {/* Yield Curve Comparison Chart */}
          {yieldCurves && (
            <div className="chart-section">
              <h2>US Treasury Yield Curve Comparison</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={yieldCurves.comparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis 
                    dataKey="maturity" 
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8' }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    tick={{ fill: '#94a3b8' }}
                    label={{ value: 'Yield (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="today" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Today"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="threeMonthsAgo" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="3 Months Ago"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="oneYearAgo" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="1 Year Ago"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="threeYearsAgo" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="3 Years Ago"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Current Yield Curve */}
          <div className="chart-section">
            <h2>Current Yield Curve</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yieldCurveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8' }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8' }}
                  label={{ value: 'Yield (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Bar dataKey="yield" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Data Cards */}
          <div className="data-grid">
            {data.map((rate, index) => (
              <div key={index} className="data-card">
                <h3>{rate.name}</h3>
                <div className="price">{rate.yield}%</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* What the Desk Does Tab */}
      {activeTab === 'desk' && (
        <div className="info-section">
          <div className="info-card">
            <h2><FiBookOpen /> What the Rates Desk Does</h2>
            <ul className="info-list">
              <li>Trades government bonds, swaps, and rate derivatives.</li>
              <li>Manages interest rate exposure, curve shape (2s10s, 5s30s), and policy expectations.</li>
              <li>Provides hedging to corporates, sovereigns, and funds.</li>
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
                <h3>📈 Rising yields</h3>
                <p>Tightening policy or higher inflation expectations.</p>
              </div>
              <div className="indicator-item">
                <h3>📉 Falling yields</h3>
                <p>Risk-off or recession fears.</p>
              </div>
              <div className="indicator-item">
                <h3>📊 Curve steepening</h3>
                <p>Easing expectations or fiscal supply.</p>
              </div>
              <div className="indicator-item">
                <h3>📉 Curve flattening</h3>
                <p>Tighter policy, growth worries.</p>
              </div>
              <div className="indicator-item">
                <h3>💹 Volatility index (MOVE)</h3>
                <p>Measures rate uncertainty; high MOVE = more trading opportunity.</p>
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
                <p>"How are you positioned on the curve—expecting more steepening or flattening?"</p>
              </div>
              <div className="question-item">
                <span className="q-mark">Q:</span>
                <p>"What's driving the long end: fiscal issuance or term premium?"</p>
              </div>
              <div className="question-item">
                <span className="q-mark">Q:</span>
                <p>"How sensitive is your book to ECB/BOE policy expectations?"</p>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* News Tab */}
      {activeTab === 'news' && (
        <div className="info-section">
          <div className="info-card">
            <h2>📰 Rates News</h2>
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

export default Rates

