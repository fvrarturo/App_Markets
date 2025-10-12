import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { FiRefreshCw } from 'react-icons/fi'
import './AssetClass.css'

const FX = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/fx')
      setData(response.data.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching FX data:', error)
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
          <h1>Foreign Exchange</h1>
          <p>Major currency pairs and exchange rates</p>
        </div>
        <button className="refresh-btn" onClick={fetchData}>
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* Currency Pairs Grid */}
      <div className="cards-grid">
        {data.map((fx) => (
          <div key={fx.pair} className="card">
            <div className="card-header">
              <span className="card-title">{fx.pair}</span>
              <span className={`card-badge ${fx.change >= 0 ? 'up' : 'down'}`}>
                {fx.change >= 0 ? '↑' : '↓'}
              </span>
            </div>
            <div className="card-value">{fx.rate.toFixed(4)}</div>
            <div className={`card-change ${fx.change >= 0 ? 'positive' : 'negative'}`}>
              {fx.change > 0 ? '+' : ''}{fx.change.toFixed(4)} 
              ({fx.changePercent > 0 ? '+' : ''}{fx.changePercent}%)
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#8b92b0' }}>
              Last updated: {new Date(fx.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Table */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 className="section-title">Currency Pairs Details</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Pair</th>
              <th>Rate</th>
              <th>Change</th>
              <th>Change %</th>
              <th>Bid/Ask</th>
              <th>Last Update</th>
            </tr>
          </thead>
          <tbody>
            {data.map((fx) => (
              <tr key={fx.pair}>
                <td style={{ fontWeight: 600 }}>{fx.pair}</td>
                <td style={{ fontWeight: 600 }}>{fx.rate.toFixed(4)}</td>
                <td className={fx.change >= 0 ? 'positive' : 'negative'}>
                  {fx.change > 0 ? '+' : ''}{fx.change.toFixed(4)}
                </td>
                <td className={fx.changePercent >= 0 ? 'positive' : 'negative'}>
                  {fx.changePercent > 0 ? '+' : ''}{fx.changePercent}%
                </td>
                <td style={{ color: '#8b92b0' }}>
                  {(fx.rate - 0.0005).toFixed(4)} / {(fx.rate + 0.0005).toFixed(4)}
                </td>
                <td style={{ color: '#8b92b0' }}>
                  {new Date(fx.timestamp).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FX Market Info */}
      <div className="cards-grid" style={{ marginTop: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Market Status</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></span>
            <span style={{ fontWeight: 600 }}>Markets Open</span>
          </div>
          <p style={{ color: '#8b92b0', fontSize: '0.875rem' }}>
            FX markets operate 24/5 across global sessions
          </p>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Trading Sessions</h3>
          <div style={{ color: '#8b92b0', fontSize: '0.875rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>Sydney: 22:00 - 07:00 GMT</div>
            <div style={{ marginBottom: '0.5rem' }}>Tokyo: 00:00 - 09:00 GMT</div>
            <div style={{ marginBottom: '0.5rem' }}>London: 08:00 - 17:00 GMT</div>
            <div>New York: 13:00 - 22:00 GMT</div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Most Active Pairs</h3>
          <div style={{ color: '#8b92b0', fontSize: '0.875rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>EUR/USD - Most traded</div>
            <div style={{ marginBottom: '0.5rem' }}>USD/JPY - High liquidity</div>
            <div>GBP/USD - Cable</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FX

