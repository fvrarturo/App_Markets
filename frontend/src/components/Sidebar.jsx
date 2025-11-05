import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  FiHome, FiTrendingUp, FiDollarSign, FiPercent, 
  FiCreditCard, FiLayers, FiGrid, FiMenu, FiX,
  FiBox, FiActivity
} from 'react-icons/fi'
import './Sidebar.css'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation()

  const menuItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/equities', icon: FiTrendingUp, label: 'Equities' },
    { path: '/fx', icon: FiDollarSign, label: 'FX' },
    { path: '/rates', icon: FiPercent, label: 'Rates' },
    { path: '/credit', icon: FiCreditCard, label: 'Credit' },
    { path: '/commodities', icon: FiBox, label: 'Commodities' },
    { path: '/securitized', icon: FiLayers, label: 'Securitized Products' },
    { path: '/structured', icon: FiGrid, label: 'Structured Products' },
    { path: '/macro', icon: FiActivity, label: 'Macro Indicators' },
  ]

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          {isOpen && (
            <>
              <div className="logo">MS</div>
              <div className="logo-text">
                <h2>Arturo's</h2>
                <p>Markets Dashboard</p>
              </div>
            </>
          )}
        </div>
        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              title={!isOpen ? item.label : ''}
            >
              <Icon className="nav-icon" />
              {isOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        {isOpen && (
          <div className="market-status">
            <div className="status-indicator">
              <span className="status-dot active"></span>
              <span>Markets Open</span>
            </div>
            <div className="last-update">
              Last update: {new Date().toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar

