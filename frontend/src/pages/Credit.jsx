import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { FiRefreshCw } from 'react-icons/fi'
import './AssetClass.css'

const Credit = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/credit')
      setData(response.data.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching credit data:', error)
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
          <h1>Credit Markets</h1>
          <p>Corporate bonds, credit spreads, and fixed income securities</p>
        </div>
        <button className="refresh-btn" onClick={fetchData}>
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* Credit Instruments Grid */}
      <div className="cards-grid">
        {data.map((credit) => (
          <div key={credit.ticker} className="card">
            <div className="card-header">
              <span className="card-title">{credit.name}</span>
              <span className={`card-badge ${credit.change >= 0 ? 'up' : 'down'}`}>
                {credit.change >= 0 ? '↑' : '↓'}
              </span>
            </div>
            <div className="card-value">${credit.price.toFixed(2)}</div>
            <div className={`card-change ${credit.change >= 0 ? 'positive' : 'negative'}`}>
              {credit.change > 0 ? '+' : ''}{credit.change.toFixed(2)} 
              ({credit.changePercent > 0 ? '+' : ''}{credit.changePercent}%)
            </div>
            <div style={{ marginTop: '1rem' }}>
              <span style={{ 
                fontSize: '0.75rem', 
                padding: '0.25rem 0.5rem', 
                background: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '4px',
                color: '#8b92b0'
              }}>
                {credit.ticker}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Credit Spreads Table */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 className="section-title">Credit Instruments Overview</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Ticker</th>
              <th>Price</th>
              <th>Change</th>
              <th>Change %</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {data.map((credit) => (
              <tr key={credit.ticker}>
                <td style={{ fontWeight: 600 }}>{credit.name}</td>
                <td>{credit.ticker}</td>
                <td style={{ fontWeight: 600 }}>${credit.price.toFixed(2)}</td>
                <td className={credit.change >= 0 ? 'positive' : 'negative'}>
                  {credit.change > 0 ? '+' : ''}${credit.change.toFixed(2)}
                </td>
                <td className={credit.changePercent >= 0 ? 'positive' : 'negative'}>
                  {credit.changePercent > 0 ? '+' : ''}{credit.changePercent}%
                </td>
                <td style={{ color: '#8b92b0' }}>
                  {credit.ticker.includes('HY') || credit.ticker.includes('JNK') ? 'High Yield' : 
                   credit.ticker.includes('IG') || credit.ticker.includes('LQD') ? 'Investment Grade' : 
                   credit.ticker.includes('EM') ? 'Emerging Markets' : 'Fixed Income'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Market Insights */}
      <div className="cards-grid" style={{ marginTop: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📊</span>
            Investment Grade
          </h3>
          <p style={{ color: '#8b92b0', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: '1.6' }}>
            Corporate bonds rated BBB- or higher. Lower risk, lower yields.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#8b92b0', fontSize: '0.75rem' }}>Current Spread</span>
            <span style={{ fontWeight: 600, color: '#10b981' }}>+125 bps</span>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⚡</span>
            High Yield
          </h3>
          <p style={{ color: '#8b92b0', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: '1.6' }}>
            Bonds rated below BBB-. Higher risk, higher potential returns.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#8b92b0', fontSize: '0.75rem' }}>Current Spread</span>
            <span style={{ fontWeight: 600, color: '#f59e0b' }}>+425 bps</span>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🌍</span>
            Emerging Markets
          </h3>
          <p style={{ color: '#8b92b0', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: '1.6' }}>
            Sovereign and corporate debt from developing economies.
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#8b92b0', fontSize: '0.75rem' }}>Current Spread</span>
            <span style={{ fontWeight: 600, color: '#ef4444' }}>+350 bps</span>
          </div>
        </div>
      </div>

      {/* Credit Market Commentary */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 className="section-title">Credit Market Analysis</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Key Drivers</h3>
            <ul style={{ color: '#8b92b0', fontSize: '0.875rem', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
              <li>Central bank policy and rate expectations</li>
              <li>Corporate earnings and default rates</li>
              <li>Economic growth projections</li>
              <li>Credit spreads vs. historical averages</li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Trading Considerations</h3>
            <ul style={{ color: '#8b92b0', fontSize: '0.875rem', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
              <li>Duration risk and interest rate sensitivity</li>
              <li>Credit quality and default probability</li>
              <li>Liquidity conditions in corporate bonds</li>
              <li>Sector rotation and industry trends</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Credit

