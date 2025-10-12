import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { FiRefreshCw } from 'react-icons/fi'
import './AssetClass.css'

const Rates = () => {
  const [data, setData] = useState([])
  const [yieldCurves, setYieldCurves] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    fetchYieldCurves()
    const interval = setInterval(() => {
      fetchData()
      fetchYieldCurves()
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/rates')
      setData(response.data.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching rates:', error)
      setLoading(false)
    }
  }

  const fetchYieldCurves = async () => {
    try {
      const response = await axios.get('/api/rates/yield-curves')
      setYieldCurves(response.data.data || null)
    } catch (error) {
      console.error('Error fetching yield curves:', error)
    }
  }

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>
  }

  const yieldCurveData = data.map(rate => ({
    name: rate.name.replace('US Treasury ', ''),
    yield: rate.yield
  }))

  return (
    <div className="asset-class-page">
      <div className="page-header">
        <div>
          <h1>Interest Rates</h1>
          <p>Treasury yields and government bond rates</p>
        </div>
        <button className="refresh-btn" onClick={fetchData}>
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* Yield Curve Comparison Chart */}
      {yieldCurves && (
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">US Treasury Yield Curve Comparison</h3>
            <p style={{ color: '#8b92b0', fontSize: '0.875rem' }}>Today vs 1 Month vs 3 Months Ago</p>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={yieldCurves}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 146, 176, 0.1)" />
              <XAxis 
                dataKey="maturity" 
                stroke="#8b92b0"
                tick={{ fill: '#8b92b0' }}
              />
              <YAxis 
                stroke="#8b92b0"
                tick={{ fill: '#8b92b0' }}
                label={{ value: 'Yield (%)', angle: -90, position: 'insideLeft', fill: '#8b92b0' }}
              />
              <Tooltip 
                contentStyle={{ 
                  background: '#1e2447', 
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
              />
              <Legend 
                wrapperStyle={{ color: '#8b92b0' }}
              />
              <Line 
                type="monotone" 
                dataKey="today" 
                stroke="#667eea" 
                strokeWidth={3}
                name="Today"
                dot={{ r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="oneMonthAgo" 
                stroke="#f59e0b" 
                strokeWidth={2}
                name="1 Month Ago"
                dot={{ r: 4 }}
                strokeDasharray="5 5"
              />
              <Line 
                type="monotone" 
                dataKey="threeMonthsAgo" 
                stroke="#10b981" 
                strokeWidth={2}
                name="3 Months Ago"
                dot={{ r: 4 }}
                strokeDasharray="3 3"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Current Yield Curve */}
      <div className="chart-container">
        <div className="chart-header">
          <h3 className="chart-title">Current Yield Curve</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={yieldCurveData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 146, 176, 0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="#8b92b0"
              tick={{ fill: '#8b92b0' }}
            />
            <YAxis 
              stroke="#8b92b0"
              tick={{ fill: '#8b92b0' }}
              label={{ value: 'Yield (%)', angle: -90, position: 'insideLeft', fill: '#8b92b0' }}
            />
            <Tooltip 
              contentStyle={{ 
                background: '#1e2447', 
                border: '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '8px',
                color: '#ffffff'
              }}
            />
            <Bar 
              dataKey="yield" 
              fill="#667eea"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Rates Cards */}
      <div className="cards-grid">
        {data.map((rate) => (
          <div key={rate.ticker} className="card">
            <div className="card-header">
              <span className="card-title">{rate.name}</span>
              <span className={`card-badge ${rate.change >= 0 ? 'up' : 'down'}`}>
                {rate.change >= 0 ? '↑' : '↓'}
              </span>
            </div>
            <div className="card-value">{rate.yield.toFixed(3)}%</div>
            <div className={`card-change ${rate.change >= 0 ? 'positive' : 'negative'}`}>
              {rate.change > 0 ? '+' : ''}{rate.change.toFixed(3)} bps
            </div>
          </div>
        ))}
      </div>

      {/* Rates Table */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 className="section-title">Treasury Rates Details</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Maturity</th>
              <th>Current Yield</th>
              <th>Change (bps)</th>
              <th>Previous Close</th>
              <th>52W High</th>
              <th>52W Low</th>
            </tr>
          </thead>
          <tbody>
            {data.map((rate) => (
              <tr key={rate.ticker}>
                <td style={{ fontWeight: 600 }}>{rate.name}</td>
                <td style={{ fontWeight: 600 }}>{rate.yield.toFixed(3)}%</td>
                <td className={rate.change >= 0 ? 'positive' : 'negative'}>
                  {rate.change > 0 ? '+' : ''}{rate.change.toFixed(3)}
                </td>
                <td>{(rate.yield - rate.change).toFixed(3)}%</td>
                <td style={{ color: '#8b92b0' }}>--</td>
                <td style={{ color: '#8b92b0' }}>--</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Market Commentary */}
      <div className="cards-grid" style={{ marginTop: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Yield Curve Analysis</h3>
          <p style={{ color: '#8b92b0', fontSize: '0.875rem', lineHeight: '1.6' }}>
            The yield curve shows the relationship between Treasury yields and maturities. 
            A normal curve slopes upward, indicating higher yields for longer maturities.
          </p>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Key Factors</h3>
          <div style={{ color: '#8b92b0', fontSize: '0.875rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>• Federal Reserve Policy</div>
            <div style={{ marginBottom: '0.5rem' }}>• Inflation Expectations</div>
            <div style={{ marginBottom: '0.5rem' }}>• Economic Growth</div>
            <div>• Global Demand</div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Trading Implications</h3>
          <p style={{ color: '#8b92b0', fontSize: '0.875rem', lineHeight: '1.6' }}>
            Rising rates typically strengthen USD, impact equity valuations, and affect 
            corporate borrowing costs across all markets.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Rates

