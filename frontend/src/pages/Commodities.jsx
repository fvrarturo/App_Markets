import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FiRefreshCw, FiBookOpen, FiEye, FiMessageCircle, FiExternalLink } from 'react-icons/fi'
import { cachedFetch } from '../utils/cache'
import './AssetClass.css'

const Commodities = () => {
  const [data, setData] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingNews, setLoadingNews] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchData()
    fetchNews()
    const interval = setInterval(() => { fetchData(); fetchNews(); }, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const response = await cachedFetch('/api/commodities', { durationType: 'commodities' })
      setData(response.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching commodities:', error)
      setLoading(false)
    }
  }

  const fetchNews = async () => {
    try {
      const response = await cachedFetch('/api/news/commodities', { durationType: 'news' })
      setNews(response.data || [])
      setLoadingNews(false)
    } catch (error) {
      console.error('Error fetching news:', error)
      setLoadingNews(false)
    }
  }

  if (loading) return <div className="asset-class"><div className="loading">Loading commodities data...</div></div>

  return (
    <div className="asset-class">
      <div className="asset-header">
        <h1>Commodities</h1>
        <button className="refresh-btn" onClick={() => { fetchData(); fetchNews(); }}><FiRefreshCw /> Refresh</button>
      </div>

      <div className="tab-nav">
        <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`tab-btn ${activeTab === 'desk' ? 'active' : ''}`} onClick={() => setActiveTab('desk')}><FiBookOpen /> What the Desk Does</button>
        <button className={`tab-btn ${activeTab === 'indicators' ? 'active' : ''}`} onClick={() => setActiveTab('indicators')}><FiEye /> How to View Indicators</button>
        {/* <button className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`} onClick={() => setActiveTab('questions')}><FiMessageCircle /> Questions to Ask</button> */}
        <button className={`tab-btn ${activeTab === 'news' ? 'active' : ''}`} onClick={() => setActiveTab('news')}>📰 News</button>
      </div>

      {activeTab === 'overview' && (
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
      )}

      {activeTab === 'desk' && (
        <div className="info-section">
          <div className="info-card">
            <h2><FiBookOpen /> What the Commodities Desk Does</h2>
            <ul className="info-list">
              <li>Trades energy (oil, gas, power), metals, and soft commodities.</li>
              <li>Provides hedging and structured solutions to corporates and investors.</li>
              <li>London desks often focus on energy, emissions, and metals markets.</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'indicators' && (
        <div className="info-section">
          <div className="info-card">
            <h2><FiEye /> How to View Indicators</h2>
            <div className="indicator-list">
              <div className="indicator-item"><h3>📈 Rising crude prices</h3><p>Energy traders active; inflation pressure → affects rates & equities.</p></div>
              <div className="indicator-item"><h3>⚖️ Backwardation vs contango</h3><p>Reveals physical tightness or surplus.</p></div>
              <div className="indicator-item"><h3>💹 Volatility spikes in oil/nat gas</h3><p>More client hedging, bigger P&L swings.</p></div>
              <div className="indicator-item"><h3>🔩 Metals prices (copper, gold)</h3><p>Global demand proxies and risk sentiment.</p></div>
            </div>
          </div>
        </div>
      )}

      {/* {activeTab === 'questions' && (
        <div className="info-section">
          <div className="info-card">
            <h2><FiMessageCircle /> Questions to Ask the Desk</h2>
            <div className="questions-list">
              <div className="question-item"><span className="q-mark">Q:</span><p>"What drives most of your client flow—hedging or directional views?"</p></div>
              <div className="question-item"><span className="q-mark">Q:</span><p>"How are you managing volatility in energy markets lately?"</p></div>
              <div className="question-item"><span className="q-mark">Q:</span><p>"Are clients still using structured products around oil prices?"</p></div>
            </div>
          </div>
        </div>
      )} */}

      {activeTab === 'news' && (
        <div className="info-section">
          <div className="info-card">
            <h2>📰 Commodities News</h2>
            {loadingNews ? <p className="loading-text">Loading news...</p> : news.length > 0 ? (
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
            ) : <p className="no-data">No news articles found for this category.</p>}
          </div>
        </div>
      )}
    </div>
  )
}

export default Commodities

