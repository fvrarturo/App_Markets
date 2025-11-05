import React, { useState, useEffect } from 'react'
import { FiWifi, FiWifiOff, FiDatabase, FiRefreshCw } from 'react-icons/fi'
import { getCacheStats, clearCache, clearOldCache } from '../utils/cache'
import './CacheIndicator.css'

const CacheIndicator = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine)
    const [showStats, setShowStats] = useState(false)
    const [stats, setStats] = useState(null)

    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    useEffect(() => {
        if (showStats) {
            setStats(getCacheStats())
        }
    }, [showStats])

    const handleClearCache = () => {
        if (window.confirm('Clear all cached data? The app will fetch fresh data on next load.')) {
            clearCache()
            setStats(getCacheStats())
            window.location.reload()
        }
    }

    const handleCleanCache = () => {
        clearOldCache()
        setStats(getCacheStats())
    }

    return (
        <div className="cache-indicator">
            <div 
                className={`cache-status ${isOnline ? 'online' : 'offline'}`}
                onClick={() => setShowStats(!showStats)}
                title={isOnline ? 'Online - Live Data' : 'Offline - Using Cached Data'}
            >
                {isOnline ? (
                    <FiWifi className="status-icon" />
                ) : (
                    <FiWifiOff className="status-icon" />
                )}
                <span className="status-text">
                    {isOnline ? 'Live' : 'Offline'}
                </span>
            </div>

            {showStats && (
                <div className="cache-stats-modal">
                    <div className="cache-stats-header">
                        <h3><FiDatabase /> Cache Statistics</h3>
                        <button onClick={() => setShowStats(false)}>×</button>
                    </div>
                    
                    {stats && (
                        <div className="cache-stats-content">
                            <div className="stat-row">
                                <span>Total Entries:</span>
                                <strong>{stats.entries}</strong>
                            </div>
                            <div className="stat-row">
                                <span>Valid Cache:</span>
                                <strong className="green">{stats.validCount}</strong>
                            </div>
                            <div className="stat-row">
                                <span>Expired:</span>
                                <strong className="orange">{stats.expiredCount}</strong>
                            </div>
                            <div className="stat-row">
                                <span>Storage Used:</span>
                                <strong>{stats.totalSizeKB} KB</strong>
                            </div>

                            <div className="cache-actions">
                                <button 
                                    className="btn-clean"
                                    onClick={handleCleanCache}
                                >
                                    <FiRefreshCw /> Clean Expired
                                </button>
                                <button 
                                    className="btn-clear"
                                    onClick={handleClearCache}
                                >
                                    Clear All Cache
                                </button>
                            </div>

                            <div className="cache-info">
                                <p>💡 Cached data allows the app to work offline</p>
                                <p>🔄 Data refreshes automatically when online</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default CacheIndicator

