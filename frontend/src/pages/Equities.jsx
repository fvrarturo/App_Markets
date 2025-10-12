import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { FiRefreshCw } from 'react-icons/fi'
import './AssetClass.css'

const Equities = () => {
  const [data, setData] = useState([])
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState('^GSPC')
  const [timeframe, setTimeframe] = useState('1d')

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    fetchChartData()
  }, [selectedIndex, timeframe])

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/equities')
      setData(response.data.data || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching equities:', error)
      setLoading(false)
    }
  }

  const fetchChartData = async () => {
    try {
      const intervalMap = {
        '1d': '5m',
        '5d': '30m',
        '1mo': '1d',
        '3mo': '1d'
      }
      const response = await axios.get(`/api/equities/chart/${selectedIndex}?period=${timeframe}&interval=${intervalMap[timeframe]}`)
      setChartData(response.data.data || [])
    } catch (error) {
      console.error('Error fetching chart:', error)
    }
  }

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>
  }

  return (
    <div className="asset-class-page">
      <div className="page-header">
        <div>
          <h1>Equities</h1>
          <p>Global equity indices and major markets</p>
        </div>
        <button className="refresh-btn" onClick={fetchData}>
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* Chart */}
      <div className="chart-container">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">
              {data.find(d => d.ticker === selectedIndex)?.name || 'Chart'}
            </h3>
            <p style={{ color: '#8b92b0', fontSize: '0.875rem' }}>
              {data.find(d => d.ticker === selectedIndex)?.price.toLocaleString()}
            </p>
          </div>
          <div className="chart-controls">
            <button 
              className={`chart-button ${timeframe === '1d' ? 'active' : ''}`}
              onClick={() => setTimeframe('1d')}
            >
              1D
            </button>
            <button 
              className={`chart-button ${timeframe === '5d' ? 'active' : ''}`}
              onClick={() => setTimeframe('5d')}
            >
              5D
            </button>
            <button 
              className={`chart-button ${timeframe === '1mo' ? 'active' : ''}`}
              onClick={() => setTimeframe('1mo')}
            >
              1M
            </button>
            <button 
              className={`chart-button ${timeframe === '3mo' ? 'active' : ''}`}
              onClick={() => setTimeframe('3mo')}
            >
              3M
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 146, 176, 0.1)" />
            <XAxis 
              dataKey="timestamp" 
              stroke="#8b92b0"
              tick={{ fill: '#8b92b0' }}
              tickFormatter={(value) => {
                const date = new Date(value)
                if (timeframe === '1d') {
                  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                }
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              }}
            />
            <YAxis 
              stroke="#8b92b0"
              tick={{ fill: '#8b92b0' }}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ 
                background: '#1e2447', 
                border: '1px solid rgba(102, 126, 234, 0.3)',
                borderRadius: '8px',
                color: '#ffffff'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="close" 
              stroke="#667eea" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Data Table */}
      <div className="card">
        <h2 className="section-title">Major Indices</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Price</th>
              <th>Change</th>
              <th>Change %</th>
              <th>Volume</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((equity) => (
              <tr key={equity.ticker}>
                <td>
                  <div style={{ fontWeight: 600 }}>{equity.name}</div>
                  <div style={{ color: '#8b92b0', fontSize: '0.875rem' }}>{equity.ticker}</div>
                </td>
                <td style={{ fontWeight: 600 }}>{equity.price.toLocaleString()}</td>
                <td className={equity.change >= 0 ? 'positive' : 'negative'}>
                  {equity.change > 0 ? '+' : ''}{equity.change}
                </td>
                <td className={equity.changePercent >= 0 ? 'positive' : 'negative'}>
                  {equity.changePercent > 0 ? '+' : ''}{equity.changePercent}%
                </td>
                <td>{equity.volume?.toLocaleString() || '--'}</td>
                <td>
                  <button 
                    className="view-chart-btn"
                    onClick={() => setSelectedIndex(equity.ticker)}
                  >
                    View Chart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Equities

