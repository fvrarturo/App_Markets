import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FiRefreshCw, FiBookOpen, FiEye, FiMessageCircle, FiExternalLink } from 'react-icons/fi'
import { cachedFetch } from '../utils/cache'
import './AssetClass.css'

const Structured = () => {
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
      const response = await cachedFetch('/api/structured', { durationType: 'rates' })
      setData(response.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching structured:', error)
      setLoading(false)
    }
  }

  const fetchNews = async () => {
    try {
      const response = await cachedFetch('/api/news/structured', { durationType: 'news' })
      setNews(response.data || [])
      setLoadingNews(false)
    } catch (error) {
      console.error('Error fetching news:', error)
      setLoadingNews(false)
    }
  }

  if (loading) return <div className="asset-class"><div className="loading">Loading structured products data...</div></div>

  return (
    <div className="asset-class">
      <div className="asset-header">
        <h1>Structured Products</h1>
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
              <div className="price">{item.price?.toFixed(2)}</div>
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
            <h2><FiBookOpen /> What the Structured Products Desk Does</h2>
            <ul className="info-list">
              <li>Designs and prices customized derivatives/notes combining asset classes.</li>
              <li>Balances client objectives (yield, protection, leverage) with hedge feasibility.</li>
              <li>London focus: equity-linked, credit-linked, and cross-asset payoffs.</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'indicators' && (
        <div className="info-section">
          <div className="info-card">
            <h2><FiEye /> How to View Indicators</h2>
            <div className="indicator-list">
              <div className="indicator-item"><h3>📉 Low volatility</h3><p>Cheaper options → more yield-enhancement demand.</p></div>
              <div className="indicator-item"><h3>📈 High volatility</h3><p>More hedging/protection products.</p></div>
              <div className="indicator-item"><h3>💰 Rate levels</h3><p>Affect coupon potential and product attractiveness.</p></div>
              <div className="indicator-item"><h3>🔀 Correlation shifts</h3><p>Impact multi-asset payoff structures.</p></div>
            </div>
          </div>
        </div>
      )}

      {/* {activeTab === 'questions' && (
        <div className="info-section">
          <div className="info-card">
            <h2><FiMessageCircle /> Questions to Ask the Desk</h2>
            <div className="questions-list">
              <div className="question-item"><span className="q-mark">Q:</span><p>"What kinds of payoffs are clients demanding right now—yield or protection?"</p></div>
              <div className="question-item"><span className="q-mark">Q:</span><p>"How do you hedge correlation risk across multi-asset structures?"</p></div>
              <div className="question-item"><span className="q-mark">Q:</span><p>"Have you seen more cross-asset or ESG-linked demand recently?"</p></div>
            </div>
          </div>
        </div>
      )} */}

      {activeTab === 'news' && (
        <div className="info-section">
          <div className="info-card">
            <h2>📰 Structured Products News</h2>
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

export default Structured

