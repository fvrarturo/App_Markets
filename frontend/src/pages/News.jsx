import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FiRefreshCw, FiExternalLink, FiClock } from 'react-icons/fi'
import './News.css'

const News = () => {
  const [newsData, setNewsData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews()
    const interval = setInterval(fetchNews, 120000) // Refresh every 2 minutes
    return () => clearInterval(interval)
  }, [])

  const fetchNews = async () => {
    try {
      const response = await axios.get('/api/news')
      setNewsData(response.data.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching news:', error)
      setLoading(false)
    }
  }

  // Group news by time period
  const getTodayNews = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return newsData.filter(news => {
      const newsDate = new Date(news.timestamp)
      return newsDate >= today
    })
  }

  const getLastWeekNews = () => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return newsData.filter(news => {
      const newsDate = new Date(news.timestamp)
      return newsDate < today && newsDate >= weekAgo
    })
  }

  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const then = new Date(timestamp)
    const diffMs = now - then
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Markets': '#667eea',
      'Economics': '#10b981',
      'Central Banks': '#f59e0b',
      'Equities': '#764ba2',
      'FX': '#3b82f6',
      'Rates': '#8b5cf6',
      'Credit': '#ec4899',
      'Breaking': '#ef4444'
    }
    return colors[category] || '#8b92b0'
  }

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>
  }

  return (
    <div className="news-page">
      <div className="page-header">
        <div>
          <h1>Market News</h1>
          <p>Latest updates from global financial markets</p>
        </div>
        <button className="refresh-btn" onClick={fetchNews}>
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* Today's News */}
      <div className="news-section">
        <h2 className="news-section-title">📰 Today's Market News</h2>
        <div className="news-grid">
          {getTodayNews().map((news, index) => (
            <a 
              key={index} 
              href={news.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="news-card"
            >
              <div className="news-card-header">
                <span 
                  className="news-category" 
                  style={{ background: `${getCategoryColor(news.category)}20`, color: getCategoryColor(news.category) }}
                >
                  {news.category || 'Markets'}
                </span>
                <span className="news-time">
                  <FiClock size={14} />
                  {getTimeAgo(news.timestamp)}
                </span>
              </div>
              
              <h3 className="news-title">
                {news.title}
                <FiExternalLink className="external-link-icon" />
              </h3>
              
              {news.description && (
                <p className="news-description">{news.description}</p>
              )}
              
              <div className="news-footer">
                <span className="news-source">{news.source}</span>
                {news.region && (
                  <span className="news-region">{news.region}</span>
                )}
              </div>
            </a>
          ))}
        </div>
        {getTodayNews().length === 0 && (
          <div className="no-news">
            <p>No news from today yet. Check back later.</p>
          </div>
        )}
      </div>

      {/* Last Week's News */}
      <div className="news-section" style={{ marginTop: '3rem' }}>
        <h2 className="news-section-title">📅 Last Week's Major Market News</h2>
        <div className="news-grid">
          {getLastWeekNews().map((news, index) => (
            <a 
              key={index} 
              href={news.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="news-card"
            >
              <div className="news-card-header">
                <span 
                  className="news-category" 
                  style={{ background: `${getCategoryColor(news.category)}20`, color: getCategoryColor(news.category) }}
                >
                  {news.category || 'Markets'}
                </span>
                <span className="news-time">
                  <FiClock size={14} />
                  {getTimeAgo(news.timestamp)}
                </span>
              </div>
              
              <h3 className="news-title">
                {news.title}
                <FiExternalLink className="external-link-icon" />
              </h3>
              
              {news.description && (
                <p className="news-description">{news.description}</p>
              )}
              
              <div className="news-footer">
                <span className="news-source">{news.source}</span>
                {news.region && (
                  <span className="news-region">{news.region}</span>
                )}
              </div>
            </a>
          ))}
        </div>
        {getLastWeekNews().length === 0 && (
          <div className="no-news">
            <p>No major news from last week.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default News

