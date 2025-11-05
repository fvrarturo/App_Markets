import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FiRefreshCw, FiBookOpen, FiEye, FiMessageCircle, FiExternalLink } from 'react-icons/fi'
import { cachedFetch } from '../utils/cache'
import './AssetClass.css'

const Credit = () => {
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
      const response = await cachedFetch('/api/credit', { durationType: 'rates' })
      setData(response.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching credit:', error)
      setLoading(false)
    }
  }

  const fetchNews = async () => {
    try {
      const response = await cachedFetch('/api/news/credit', { durationType: 'news' })
      setNews(response.data || [])
      setLoadingNews(false)
    } catch (error) {
      console.error('Error fetching news:', error)
      setLoadingNews(false)
    }
  }

  if (loading) return <div className="asset-class"><div className="loading">Loading credit data...</div></div>

  return (
    <div className="asset-class">
      <div className="asset-header">
        <h1>Credit</h1>
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
            <h2><FiBookOpen /> What the Credit Desk Does</h2>
            <ul className="info-list">
              <li>Trades corporate bonds, credit default swaps (CDS), and loan products.</li>
              <li>Provides liquidity and hedging for investors exposed to credit risk.</li>
              <li>London desks: focus on European investment-grade (IG) and high-yield (HY) credit.</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'indicators' && (
        <div className="info-section">
          <div className="info-card">
            <h2><FiEye /> How to View Indicators</h2>
            <div className="indicator-list">
              <div className="indicator-item"><h3>📉 Tightening spreads</h3><p>Improving sentiment, risk-on.</p></div>
              <div className="indicator-item"><h3>📈 Widening spreads</h3><p>Risk aversion, rising default risk.</p></div>
              <div className="indicator-item"><h3>📊 iTraxx Main and Xover</h3><p>Benchmark indices for IG and HY credit spreads.</p></div>
              <div className="indicator-item"><h3>💹 New issuance spikes</h3><p>Positive sign for market confidence.</p></div>
            </div>
          </div>
        </div>
      )}

      {/* {activeTab === 'questions' && (
        <div className="info-section">
          <div className="info-card">
            <h2><FiMessageCircle /> Questions to Ask the Desk</h2>
            <div className="questions-list">
              <div className="question-item"><span className="q-mark">Q:</span><p>"Are you seeing more flow in IG or HY lately?"</p></div>
              <div className="question-item"><span className="q-mark">Q:</span><p>"How are clients positioned—buying protection or selling?"</p></div>
              <div className="question-item"><span className="q-mark">Q:</span><p>"Do you think spreads reflect fundamentals or just liquidity flows?"</p></div>
            </div>
          </div>
        </div>
      )} */}

      {activeTab === 'news' && (
        <div className="info-section">
          <div className="info-card">
            <h2>📰 Credit News</h2>
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

export default Credit

