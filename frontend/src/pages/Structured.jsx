import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'
import { FiRefreshCw } from 'react-icons/fi'
import './AssetClass.css'

const Structured = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/structured')
      setData(response.data.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching structured products data:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>
  }

  return (
    <div className="asset-class-page">
      <div className="page-header">
        <div>
          <h1>Structured Products</h1>
          <p>Volatility indices, commodities, and derivative instruments</p>
        </div>
        <button className="refresh-btn" onClick={fetchData}>
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* Product Cards */}
      <div className="cards-grid">
        {data.map((product) => (
          <div key={product.ticker} className="card">
            <div className="card-header">
              <span className="card-title">{product.name}</span>
              <span className={`card-badge ${product.change >= 0 ? 'up' : 'down'}`}>
                {product.change >= 0 ? '↑' : '↓'}
              </span>
            </div>
            <div className="card-value">
              {product.ticker === '^VIX' ? product.price.toFixed(2) : `$${product.price.toFixed(2)}`}
            </div>
            <div className={`card-change ${product.change >= 0 ? 'positive' : 'negative'}`}>
              {product.change > 0 ? '+' : ''}{product.change.toFixed(2)} 
              ({product.changePercent > 0 ? '+' : ''}{product.changePercent}%)
            </div>
            <div style={{ marginTop: '1rem' }}>
              <span style={{ 
                fontSize: '0.75rem', 
                padding: '0.25rem 0.5rem', 
                background: getProductTypeColor(product.ticker),
                borderRadius: '4px',
                color: '#ffffff'
              }}>
                {getProductType(product.ticker)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Products Table */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 className="section-title">Structured Products Overview</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Ticker</th>
              <th>Price</th>
              <th>Change</th>
              <th>Change %</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product) => (
              <tr key={product.ticker}>
                <td style={{ fontWeight: 600 }}>{product.name}</td>
                <td>{product.ticker}</td>
                <td style={{ fontWeight: 600 }}>
                  {product.ticker === '^VIX' ? product.price.toFixed(2) : `$${product.price.toFixed(2)}`}
                </td>
                <td className={product.change >= 0 ? 'positive' : 'negative'}>
                  {product.change > 0 ? '+' : ''}{product.change.toFixed(2)}
                </td>
                <td className={product.changePercent >= 0 ? 'positive' : 'negative'}>
                  {product.changePercent > 0 ? '+' : ''}{product.changePercent}%
                </td>
                <td style={{ color: '#8b92b0' }}>
                  {getProductType(product.ticker)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Categories */}
      <div className="cards-grid" style={{ marginTop: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📈</span>
            Volatility Products
          </h3>
          <p style={{ color: '#8b92b0', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: '1.6' }}>
            VIX measures expected S&P 500 volatility. Often called the "fear gauge" of the market.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#8b92b0', fontSize: '0.75rem' }}>Current VIX</span>
            <span style={{ fontWeight: 600, color: getVIXColor(data.find(d => d.ticker === '^VIX')?.price) }}>
              {data.find(d => d.ticker === '^VIX')?.price.toFixed(2) || '--'}
            </span>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>💰</span>
            Precious Metals
          </h3>
          <p style={{ color: '#8b92b0', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: '1.6' }}>
            Gold and silver ETFs provide exposure to precious metals markets and safe-haven assets.
          </p>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#8b92b0', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Gold</div>
              <div style={{ fontWeight: 600 }}>${data.find(d => d.ticker === 'GLD')?.price.toFixed(2) || '--'}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#8b92b0', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Silver</div>
              <div style={{ fontWeight: 600 }}>${data.find(d => d.ticker === 'SLV')?.price.toFixed(2) || '--'}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⚡</span>
            Energy & Commodities
          </h3>
          <p style={{ color: '#8b92b0', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: '1.6' }}>
            Exposure to oil, natural gas, and broad commodity indices.
          </p>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#8b92b0', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Oil</div>
              <div style={{ fontWeight: 600 }}>${data.find(d => d.ticker === 'USO')?.price.toFixed(2) || '--'}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#8b92b0', fontSize: '0.75rem', marginBottom: '0.25rem' }}>Gas</div>
              <div style={{ fontWeight: 600 }}>${data.find(d => d.ticker === 'UNG')?.price.toFixed(2) || '--'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Analysis */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 className="section-title">Structured Products Analysis</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Key Applications</h3>
            <ul style={{ color: '#8b92b0', fontSize: '0.875rem', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
              <li>Portfolio hedging and risk management</li>
              <li>Alternative return sources</li>
              <li>Inflation protection through commodities</li>
              <li>Volatility trading and market timing</li>
              <li>Diversification beyond traditional assets</li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Trading Considerations</h3>
            <ul style={{ color: '#8b92b0', fontSize: '0.875rem', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
              <li>High volatility and leverage characteristics</li>
              <li>Contango and backwardation in futures</li>
              <li>Roll costs in commodity ETFs</li>
              <li>Correlation dynamics during stress periods</li>
              <li>Regulatory and structural complexities</li>
            </ul>
          </div>
        </div>
      </div>

      {/* VIX Interpretation */}
      <div className="card" style={{ marginTop: '2rem', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)' }}>
        <h2 className="section-title">VIX Interpretation Guide</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginTop: '1rem' }}>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#10b981', marginBottom: '0.5rem' }}>0-12</div>
            <div style={{ fontSize: '0.875rem', color: '#8b92b0' }}>Low volatility</div>
            <div style={{ fontSize: '0.75rem', color: '#8b92b0', marginTop: '0.25rem' }}>Complacent market</div>
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#3b82f6', marginBottom: '0.5rem' }}>12-20</div>
            <div style={{ fontSize: '0.875rem', color: '#8b92b0' }}>Normal volatility</div>
            <div style={{ fontSize: '0.75rem', color: '#8b92b0', marginTop: '0.25rem' }}>Stable conditions</div>
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f59e0b', marginBottom: '0.5rem' }}>20-30</div>
            <div style={{ fontSize: '0.875rem', color: '#8b92b0' }}>Elevated volatility</div>
            <div style={{ fontSize: '0.75rem', color: '#8b92b0', marginTop: '0.25rem' }}>Increased caution</div>
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ef4444', marginBottom: '0.5rem' }}>30+</div>
            <div style={{ fontSize: '0.875rem', color: '#8b92b0' }}>High volatility</div>
            <div style={{ fontSize: '0.75rem', color: '#8b92b0', marginTop: '0.25rem' }}>Market stress</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions
const getProductType = (ticker) => {
  if (ticker === '^VIX') return 'Volatility'
  if (ticker === 'GLD' || ticker === 'SLV') return 'Precious Metals'
  if (ticker === 'USO' || ticker === 'UNG') return 'Energy'
  if (ticker === 'DBC') return 'Commodities'
  return 'Other'
}

const getProductTypeColor = (ticker) => {
  if (ticker === '^VIX') return 'rgba(239, 68, 68, 0.8)'
  if (ticker === 'GLD' || ticker === 'SLV') return 'rgba(251, 191, 36, 0.8)'
  if (ticker === 'USO' || ticker === 'UNG') return 'rgba(34, 197, 94, 0.8)'
  if (ticker === 'DBC') return 'rgba(59, 130, 246, 0.8)'
  return 'rgba(139, 146, 176, 0.8)'
}

const getVIXColor = (vix) => {
  if (!vix) return '#8b92b0'
  if (vix < 12) return '#10b981'
  if (vix < 20) return '#3b82f6'
  if (vix < 30) return '#f59e0b'
  return '#ef4444'
}

export default Structured

