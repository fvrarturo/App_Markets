import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { FiRefreshCw } from 'react-icons/fi'
import './AssetClass.css'

const Commodities = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/commodities')
      setData(response.data.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching commodities data:', error)
      setLoading(false)
    }
  }

  const getCategoryData = (category) => {
    return data.filter(item => item.category === category)
  }

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>
  }

  return (
    <div className="asset-class-page">
      <div className="page-header">
        <div>
          <h1>Commodities</h1>
          <p>Precious metals, energy, and agricultural commodities</p>
        </div>
        <button className="refresh-btn" onClick={fetchData}>
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* Precious Metals */}
      <div className="section">
        <h2 className="section-title">💰 Precious Metals</h2>
        <div className="cards-grid">
          {getCategoryData('Precious Metals').map((commodity) => (
            <div key={commodity.ticker} className="card">
              <div className="card-header">
                <span className="card-title">{commodity.name}</span>
                <span className={`card-badge ${commodity.change >= 0 ? 'up' : 'down'}`}>
                  {commodity.change >= 0 ? '↑' : '↓'}
                </span>
              </div>
              <div className="card-value">${commodity.price.toFixed(2)}</div>
              <div className={`card-change ${commodity.change >= 0 ? 'positive' : 'negative'}`}>
                {commodity.change > 0 ? '+' : ''}{commodity.change.toFixed(2)} 
                ({commodity.changePercent > 0 ? '+' : ''}{commodity.changePercent.toFixed(2)}%)
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#8b92b0' }}>
                {commodity.unit}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Energy */}
      <div className="section">
        <h2 className="section-title">⚡ Energy</h2>
        <div className="cards-grid">
          {getCategoryData('Energy').map((commodity) => (
            <div key={commodity.ticker} className="card">
              <div className="card-header">
                <span className="card-title">{commodity.name}</span>
                <span className={`card-badge ${commodity.change >= 0 ? 'up' : 'down'}`}>
                  {commodity.change >= 0 ? '↑' : '↓'}
                </span>
              </div>
              <div className="card-value">${commodity.price.toFixed(2)}</div>
              <div className={`card-change ${commodity.change >= 0 ? 'positive' : 'negative'}`}>
                {commodity.change > 0 ? '+' : ''}{commodity.change.toFixed(2)} 
                ({commodity.changePercent > 0 ? '+' : ''}{commodity.changePercent.toFixed(2)}%)
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#8b92b0' }}>
                {commodity.unit}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Industrial Metals */}
      <div className="section">
        <h2 className="section-title">🔩 Industrial Metals</h2>
        <div className="cards-grid">
          {getCategoryData('Industrial Metals').map((commodity) => (
            <div key={commodity.ticker} className="card">
              <div className="card-header">
                <span className="card-title">{commodity.name}</span>
                <span className={`card-badge ${commodity.change >= 0 ? 'up' : 'down'}`}>
                  {commodity.change >= 0 ? '↑' : '↓'}
                </span>
              </div>
              <div className="card-value">${commodity.price.toFixed(2)}</div>
              <div className={`card-change ${commodity.change >= 0 ? 'positive' : 'negative'}`}>
                {commodity.change > 0 ? '+' : ''}{commodity.change.toFixed(2)} 
                ({commodity.changePercent > 0 ? '+' : ''}{commodity.changePercent.toFixed(2)}%)
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#8b92b0' }}>
                {commodity.unit}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agricultural */}
      <div className="section">
        <h2 className="section-title">🌾 Agricultural Commodities</h2>
        <div className="cards-grid">
          {getCategoryData('Agricultural').map((commodity) => (
            <div key={commodity.ticker} className="card">
              <div className="card-header">
                <span className="card-title">{commodity.name}</span>
                <span className={`card-badge ${commodity.change >= 0 ? 'up' : 'down'}`}>
                  {commodity.change >= 0 ? '↑' : '↓'}
                </span>
              </div>
              <div className="card-value">${commodity.price.toFixed(2)}</div>
              <div className={`card-change ${commodity.change >= 0 ? 'positive' : 'negative'}`}>
                {commodity.change > 0 ? '+' : ''}{commodity.change.toFixed(2)} 
                ({commodity.changePercent > 0 ? '+' : ''}{commodity.changePercent.toFixed(2)}%)
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#8b92b0' }}>
                {commodity.unit}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Table */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 className="section-title">All Commodities</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Commodity</th>
              <th>Category</th>
              <th>Price</th>
              <th>Change</th>
              <th>Change %</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            {data.map((commodity) => (
              <tr key={commodity.ticker}>
                <td style={{ fontWeight: 600 }}>{commodity.name}</td>
                <td style={{ color: '#8b92b0' }}>{commodity.category}</td>
                <td style={{ fontWeight: 600 }}>${commodity.price.toFixed(2)}</td>
                <td className={commodity.change >= 0 ? 'positive' : 'negative'}>
                  {commodity.change > 0 ? '+' : ''}{commodity.change.toFixed(2)}
                </td>
                <td className={commodity.changePercent >= 0 ? 'positive' : 'negative'}>
                  {commodity.changePercent > 0 ? '+' : ''}{commodity.changePercent.toFixed(2)}%
                </td>
                <td style={{ color: '#8b92b0', fontSize: '0.875rem' }}>{commodity.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Commodities

