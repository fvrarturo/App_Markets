import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FiRefreshCw, FiBookOpen, FiEye, FiMessageCircle, FiExternalLink } from 'react-icons/fi'
import { cachedFetch } from '../utils/cache'
import './AssetClass.css'

const Securitized = () => {
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
      const response = await cachedFetch('/api/securitized', { durationType: 'rates' })
      setData(response.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching securitized:', error)
      setLoading(false)
    }
  }

  const fetchNews = async () => {
    try {
      const response = await cachedFetch('/api/news/securitized', { durationType: 'news' })
      setNews(response.data || [])
      setLoadingNews(false)
    } catch (error) {
      console.error('Error fetching news:', error)
      setLoadingNews(false)
    }
  }

  if (loading) return <div className="asset-class"><div className="loading">Loading securitized products data...</div></div>

  return (
    <div className="asset-class">
      <div className="asset-header">
        <h1>Securitized Products</h1>
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
            <h2><FiBookOpen /> What the SPG Desk Does</h2>
            <ul className="info-list">
              <li>Trades and structures securities backed by loans (RMBS, CMBS, ABS, CLOs).</li>
              <li>Connects lenders/investors via securitization, managing yield and risk tranching.</li>
              <li>London focus: European RMBS, ABS, and CLOs.</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'indicators' && (
        <div className="info-section">
          <div className="info-card">
            <h2><FiEye /> How to View Indicators</h2>
            <div className="indicator-list">
              <div className="indicator-item"><h3>📈 Widening RMBS/ABS spreads</h3><p>Stress in housing or consumer credit.</p></div>
              <div className="indicator-item"><h3>💹 New issuance levels</h3><p>Gauge investor appetite and funding conditions.</p></div>
              <div className="indicator-item"><h3>📊 Default and prepayment data</h3><p>Key to valuation and performance.</p></div>
              <div className="indicator-item"><h3>🔍 CLO tranche spreads</h3><p>Signal credit-cycle sentiment.</p></div>
            </div>
          </div>
        </div>
      )}

      {/* {activeTab === 'questions' && (
        <div className="info-section">
          <div className="info-card">
            <h2><FiMessageCircle /> Questions to Ask the Desk</h2>
            <div className="questions-list">
              <div className="question-item"><span className="q-mark">Q:</span><p>"How has issuance evolved given higher rates?"</p></div>
              <div className="question-item"><span className="q-mark">Q:</span><p>"Are investors demanding more protection in mezz tranches?"</p></div>
              <div className="question-item"><span className="q-mark">Q:</span><p>"Which asset classes (RMBS, autos, CLOs) are most active right now?"</p></div>
            </div>
          </div>
        </div>
      )} */}

      {activeTab === 'news' && (
        <div className="info-section">
          <div className="info-card">
            <h2>📰 Securitized Products News</h2>
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

export default Securitized

