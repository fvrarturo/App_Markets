import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { FiRefreshCw } from 'react-icons/fi'
import './AssetClass.css'

const Securitized = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/securitized')
      setData(response.data.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching securitized products data:', error)
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
          <h1>Securitized Products</h1>
          <p>MBS, ABS, CMBS and structured credit products</p>
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
            <div className="card-value">${product.price.toFixed(2)}</div>
            <div className={`card-change ${product.change >= 0 ? 'positive' : 'negative'}`}>
              {product.change > 0 ? '+' : ''}{product.change.toFixed(2)} 
              ({product.changePercent > 0 ? '+' : ''}{product.changePercent}%)
            </div>
            <div style={{ marginTop: '1rem' }}>
              <span style={{ 
                fontSize: '0.75rem', 
                padding: '0.25rem 0.5rem', 
                background: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '4px',
                color: '#8b92b0'
              }}>
                {product.ticker}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Securitized Products Table */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 className="section-title">Products Overview</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Ticker</th>
              <th>Price</th>
              <th>Change</th>
              <th>Change %</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product) => (
              <tr key={product.ticker}>
                <td style={{ fontWeight: 600 }}>{product.name}</td>
                <td>{product.ticker}</td>
                <td style={{ fontWeight: 600 }}>${product.price.toFixed(2)}</td>
                <td className={product.change >= 0 ? 'positive' : 'negative'}>
                  {product.change > 0 ? '+' : ''}${product.change.toFixed(2)}
                </td>
                <td className={product.changePercent >= 0 ? 'positive' : 'negative'}>
                  {product.changePercent > 0 ? '+' : ''}{product.changePercent}%
                </td>
                <td style={{ color: '#8b92b0' }}>
                  {product.ticker.includes('MBS') || product.ticker.includes('MBB') ? 'MBS' :
                   product.ticker.includes('CMBS') ? 'CMBS' : 
                   product.ticker.includes('SCH') || product.ticker.includes('MINT') ? 'Short Duration' :
                   'Fixed Income'}
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
            <span style={{ fontSize: '1.5rem' }}>🏠</span>
            Mortgage-Backed Securities
          </h3>
          <p style={{ color: '#8b92b0', fontSize: '0.875rem', lineHeight: '1.6' }}>
            Securities backed by pools of residential mortgages. Agency MBS carry implicit 
            government backing through Fannie Mae and Freddie Mac.
          </p>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🏢</span>
            Commercial MBS
          </h3>
          <p style={{ color: '#8b92b0', fontSize: '0.875rem', lineHeight: '1.6' }}>
            Backed by commercial real estate loans. Includes office buildings, retail centers, 
            hotels, and multifamily properties.
          </p>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>💳</span>
            Asset-Backed Securities
          </h3>
          <p style={{ color: '#8b92b0', fontSize: '0.875rem', lineHeight: '1.6' }}>
            Collateralized by various asset types including auto loans, credit card receivables, 
            student loans, and equipment leases.
          </p>
        </div>
      </div>

      {/* Market Insights */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 className="section-title">Securitized Products Market Insights</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#10b981' }}>
              Key Characteristics
            </h3>
            <ul style={{ color: '#8b92b0', fontSize: '0.875rem', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
              <li>Prepayment risk from underlying borrowers</li>
              <li>Credit enhancement through tranching</li>
              <li>Interest rate sensitivity varies by product</li>
              <li>High liquidity in agency MBS markets</li>
              <li>Monthly cash flows from principal and interest</li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#667eea' }}>
              Risk Factors
            </h3>
            <ul style={{ color: '#8b92b0', fontSize: '0.875rem', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
              <li>Housing market conditions and home prices</li>
              <li>Economic growth and employment trends</li>
              <li>Federal Reserve MBS purchase programs</li>
              <li>Credit quality of underlying collateral</li>
              <li>Extension and contraction risk</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Securitized

