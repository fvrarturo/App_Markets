import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { FiRefreshCw } from 'react-icons/fi'
import { cachedFetch } from '../utils/cache'
import './AssetClass.css'
import './Macro.css'

const Macro = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 300000) // 5 minutes
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const response = await cachedFetch('/api/macro', { durationType: 'macro' })
      setData(response.data || null)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching macro data:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>
  }

  if (!data) {
    return <div className="error">Failed to load macro data</div>
  }

  return (
    <div className="macro-page">
      <div className="page-header">
        <div>
          <h1>Macroeconomic Indicators</h1>
          <p>Key economic data for US, UK, and EU</p>
        </div>
        <button className="refresh-btn" onClick={fetchData}>
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* Inflation */}
      <div className="macro-section">
        <h2 className="section-title">📊 Inflation Rates (CPI YoY)</h2>
        <div className="cards-grid">
          <div className="card macro-card">
            <div className="macro-flag">🇺🇸</div>
            <div className="macro-country">United States</div>
            <div className="macro-value">{data.inflation.us.current}%</div>
            <div className={`macro-change ${data.inflation.us.trend === 'up' ? 'negative' : 'positive'}`}>
              {data.inflation.us.trend === 'up' ? '↑' : '↓'} {data.inflation.us.change} from prev
            </div>
            <div className="macro-updated">Updated: {data.inflation.us.date}</div>
          </div>

          <div className="card macro-card">
            <div className="macro-flag">🇬🇧</div>
            <div className="macro-country">United Kingdom</div>
            <div className="macro-value">{data.inflation.uk.current}%</div>
            <div className={`macro-change ${data.inflation.uk.trend === 'up' ? 'negative' : 'positive'}`}>
              {data.inflation.uk.trend === 'up' ? '↑' : '↓'} {data.inflation.uk.change} from prev
            </div>
            <div className="macro-updated">Updated: {data.inflation.uk.date}</div>
          </div>

          <div className="card macro-card">
            <div className="macro-flag">🇪🇺</div>
            <div className="macro-country">Eurozone</div>
            <div className="macro-value">{data.inflation.eu.current}%</div>
            <div className={`macro-change ${data.inflation.eu.trend === 'up' ? 'negative' : 'positive'}`}>
              {data.inflation.eu.trend === 'up' ? '↑' : '↓'} {data.inflation.eu.change} from prev
            </div>
            <div className="macro-updated">Updated: {data.inflation.eu.date}</div>
          </div>
        </div>
      </div>

      {/* Employment */}
      <div className="macro-section">
        <h2 className="section-title">👔 Unemployment Rates</h2>
        <div className="cards-grid">
          <div className="card macro-card">
            <div className="macro-flag">🇺🇸</div>
            <div className="macro-country">United States</div>
            <div className="macro-value">{data.employment.us.rate}%</div>
            <div className={`macro-change ${data.employment.us.trend === 'up' ? 'negative' : 'positive'}`}>
              {data.employment.us.trend === 'up' ? '↑' : '↓'} {data.employment.us.change} from prev
            </div>
            <div className="macro-detail">NFP: {data.employment.us.nfp}K jobs</div>
            <div className="macro-updated">Updated: {data.employment.us.date}</div>
          </div>

          <div className="card macro-card">
            <div className="macro-flag">🇬🇧</div>
            <div className="macro-country">United Kingdom</div>
            <div className="macro-value">{data.employment.uk.rate}%</div>
            <div className={`macro-change ${data.employment.uk.trend === 'up' ? 'negative' : 'positive'}`}>
              {data.employment.uk.trend === 'up' ? '↑' : '↓'} {data.employment.uk.change} from prev
            </div>
            <div className="macro-detail">Employment: {data.employment.uk.employed}M</div>
            <div className="macro-updated">Updated: {data.employment.uk.date}</div>
          </div>

          <div className="card macro-card">
            <div className="macro-flag">🇪🇺</div>
            <div className="macro-country">Eurozone</div>
            <div className="macro-value">{data.employment.eu.rate}%</div>
            <div className={`macro-change ${data.employment.eu.trend === 'up' ? 'negative' : 'positive'}`}>
              {data.employment.eu.trend === 'up' ? '↑' : '↓'} {data.employment.eu.change} from prev
            </div>
            <div className="macro-detail">Employed: {data.employment.eu.employed}M</div>
            <div className="macro-updated">Updated: {data.employment.eu.date}</div>
          </div>
        </div>
      </div>

      {/* GDP Growth */}
      <div className="macro-section">
        <h2 className="section-title">📈 GDP Growth (Annual %)</h2>
        <div className="cards-grid">
          <div className="card macro-card">
            <div className="macro-flag">🇺🇸</div>
            <div className="macro-country">United States</div>
            <div className="macro-value">{data.gdp.us.current}%</div>
            <div className={`macro-change ${data.gdp.us.trend === 'up' ? 'positive' : 'negative'}`}>
              {data.gdp.us.trend === 'up' ? '↑' : '↓'} Q-o-Q growth
            </div>
            <div className="macro-updated">Q{data.gdp.us.quarter} {data.gdp.us.year}</div>
          </div>

          <div className="card macro-card">
            <div className="macro-flag">🇬🇧</div>
            <div className="macro-country">United Kingdom</div>
            <div className="macro-value">{data.gdp.uk.current}%</div>
            <div className={`macro-change ${data.gdp.uk.trend === 'up' ? 'positive' : 'negative'}`}>
              {data.gdp.uk.trend === 'up' ? '↑' : '↓'} Q-o-Q growth
            </div>
            <div className="macro-updated">Q{data.gdp.uk.quarter} {data.gdp.uk.year}</div>
          </div>

          <div className="card macro-card">
            <div className="macro-flag">🇪🇺</div>
            <div className="macro-country">Eurozone</div>
            <div className="macro-value">{data.gdp.eu.current}%</div>
            <div className={`macro-change ${data.gdp.eu.trend === 'up' ? 'positive' : 'negative'}`}>
              {data.gdp.eu.trend === 'up' ? '↑' : '↓'} Q-o-Q growth
            </div>
            <div className="macro-updated">Q{data.gdp.eu.quarter} {data.gdp.eu.year}</div>
          </div>
        </div>
      </div>

      {/* Central Bank Rates */}
      <div className="macro-section">
        <h2 className="section-title">🏦 Central Bank Policy Rates</h2>
        <div className="cards-grid">
          <div className="card macro-card">
            <div className="macro-flag">🇺🇸</div>
            <div className="macro-country">Federal Reserve</div>
            <div className="macro-value">{data.centralBankRates.us.rate}%</div>
            <div className="macro-detail">{data.centralBankRates.us.range}</div>
            <div className="macro-updated">Last change: {data.centralBankRates.us.lastChange}</div>
          </div>

          <div className="card macro-card">
            <div className="macro-flag">🇬🇧</div>
            <div className="macro-country">Bank of England</div>
            <div className="macro-value">{data.centralBankRates.uk.rate}%</div>
            <div className="macro-detail">Bank Rate</div>
            <div className="macro-updated">Last change: {data.centralBankRates.uk.lastChange}</div>
          </div>

          <div className="card macro-card">
            <div className="macro-flag">🇪🇺</div>
            <div className="macro-country">European Central Bank</div>
            <div className="macro-value">{data.centralBankRates.eu.rate}%</div>
            <div className="macro-detail">Deposit Facility</div>
            <div className="macro-updated">Last change: {data.centralBankRates.eu.lastChange}</div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 className="section-title">💡 Key Economic Insights</h2>
        <div className="insights-grid">
          <div className="insight-item">
            <h3>🔥 Inflation Trends</h3>
            <p>{data.insights.inflation}</p>
          </div>
          <div className="insight-item">
            <h3>📊 Labor Markets</h3>
            <p>{data.insights.employment}</p>
          </div>
          <div className="insight-item">
            <h3>💹 Growth Outlook</h3>
            <p>{data.insights.gdp}</p>
          </div>
          <div className="insight-item">
            <h3>🏦 Monetary Policy</h3>
            <p>{data.insights.policy}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Macro

