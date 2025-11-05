/**
 * localStorage Cache Utility
 * Caches API responses with timestamps for offline functionality
 */

const CACHE_DURATION = {
    realtime: 5 * 60 * 1000,      // 5 minutes for real-time data (equities, FX)
    rates: 30 * 60 * 1000,         // 30 minutes for rates/yields
    macro: 24 * 60 * 60 * 1000,    // 24 hours for macro indicators
    news: 60 * 60 * 1000,          // 1 hour for news
    commodities: 15 * 60 * 1000,   // 15 minutes for commodities
}

/**
 * Get cached data if valid, otherwise return null
 */
export const getCachedData = (key) => {
    try {
        const cached = localStorage.getItem(key)
        if (!cached) return null

        const { data, timestamp, duration } = JSON.parse(cached)
        const age = Date.now() - timestamp

        // Check if cache is still valid
        if (age < duration) {
            console.log(`✅ Cache HIT for ${key} (age: ${Math.round(age / 1000)}s)`)
            return { data, fromCache: true, age }
        } else {
            console.log(`⏰ Cache EXPIRED for ${key} (age: ${Math.round(age / 1000)}s)`)
            return null
        }
    } catch (error) {
        console.error('Cache read error:', error)
        return null
    }
}

/**
 * Save data to cache with timestamp
 */
export const setCachedData = (key, data, durationType = 'realtime') => {
    try {
        const duration = CACHE_DURATION[durationType] || CACHE_DURATION.realtime
        const cacheObject = {
            data,
            timestamp: Date.now(),
            duration
        }
        localStorage.setItem(key, JSON.stringify(cacheObject))
        console.log(`💾 Cached ${key} (duration: ${duration / 1000}s)`)
    } catch (error) {
        console.error('Cache write error:', error)
        // If localStorage is full, clear old entries
        if (error.name === 'QuotaExceededError') {
            clearOldCache()
            try {
                localStorage.setItem(key, JSON.stringify(cacheObject))
            } catch (e) {
                console.error('Still cannot cache after cleanup:', e)
            }
        }
    }
}

/**
 * Clear all cached data
 */
export const clearCache = () => {
    const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('api_') || key.startsWith('cache_')
    )
    keys.forEach(key => localStorage.removeItem(key))
    console.log(`🗑️ Cleared ${keys.length} cache entries`)
}

/**
 * Clear cache entries older than their duration
 */
export const clearOldCache = () => {
    const keys = Object.keys(localStorage)
    let cleared = 0

    keys.forEach(key => {
        try {
            const cached = JSON.parse(localStorage.getItem(key))
            if (cached.timestamp) {
                const age = Date.now() - cached.timestamp
                if (age > cached.duration) {
                    localStorage.removeItem(key)
                    cleared++
                }
            }
        } catch (e) {
            // Invalid entry, remove it
            localStorage.removeItem(key)
            cleared++
        }
    })

    console.log(`🧹 Cleaned ${cleared} old cache entries`)
}

/**
 * Cached fetch wrapper - tries cache first, then fetches
 */
export const cachedFetch = async (url, options = {}) => {
    const { durationType = 'realtime', forceRefresh = false } = options

    // Generate cache key from URL
    const cacheKey = `api_${url.replace(/[^a-zA-Z0-9]/g, '_')}`

    // Try to get cached data first (unless force refresh)
    if (!forceRefresh) {
        const cached = getCachedData(cacheKey)
        if (cached) {
            return { ...cached.data, _fromCache: true, _cacheAge: cached.age }
        }
    }

    // No cache or expired - fetch fresh data
    try {
        console.log(`🌐 Fetching fresh data: ${url}`)
        const response = await fetch(url)
        const data = await response.json()

        // Cache the successful response
        setCachedData(cacheKey, data, durationType)

        return { ...data, _fromCache: false, _cacheAge: 0 }
    } catch (error) {
        console.error(`❌ Fetch failed for ${url}:`, error)

        // If fetch fails, try to return stale cache as fallback
        const staleCache = localStorage.getItem(cacheKey)
        if (staleCache) {
            const { data, timestamp } = JSON.parse(staleCache)
            console.log(`🔄 Using STALE cache for ${url} (offline fallback)`)
            return { ...data, _fromCache: true, _isStale: true, _cacheAge: Date.now() - timestamp }
        }

        // No cache available, throw error
        throw error
    }
}

/**
 * Get cache statistics
 */
export const getCacheStats = () => {
    const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('api_') || key.startsWith('cache_')
    )
    
    let totalSize = 0
    let validCount = 0
    let expiredCount = 0

    keys.forEach(key => {
        const value = localStorage.getItem(key)
        totalSize += value.length
        
        try {
            const cached = JSON.parse(value)
            const age = Date.now() - cached.timestamp
            if (age < cached.duration) {
                validCount++
            } else {
                expiredCount++
            }
        } catch (e) {
            expiredCount++
        }
    })

    return {
        entries: keys.length,
        validCount,
        expiredCount,
        totalSizeKB: (totalSize / 1024).toFixed(2)
    }
}

