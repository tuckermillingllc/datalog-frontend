// stores/larvaeLog.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || 'https://datalog-backend.onrender.com'

export const useLarvaeLogStore = defineStore('larvaeLog', () => {
  // State
  const logs = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentUser = ref('')
  
  // Computed
  const totalLogs = computed(() => logs.value.length)
  
  const logsByUser = computed(() => {
    if (!currentUser.value) return logs.value
    return logs.value.filter(log => log.username === currentUser.value)
  })
  
  const latestLog = computed(() => {
    if (logs.value.length === 0) return null
    return logs.value[0] // Assuming logs are sorted by timestamp desc
  })
  
  const averageStats = computed(() => {
    if (logs.value.length === 0) return null
    
    const stats = logs.value.reduce((acc, log) => {
      acc.larvaeCount += log.larvae_count || 0
      acc.feedPerLarvae += log.feed_per_larvae || 0
      acc.waterFeedRatio += log.water_feed_ratio || 0
      return acc
    }, { larvaeCount: 0, feedPerLarvae: 0, waterFeedRatio: 0 })
    
    const count = logs.value.length
    return {
      avgLarvaeCount: Math.round(stats.larvaeCount / count),
      avgFeedPerLarvae: (stats.feedPerLarvae / count).toFixed(1),
      avgWaterFeedRatio: (stats.waterFeedRatio / count).toFixed(1)
    }
  })
  
  // Actions
  async function fetchLogs(username = null) {
    loading.value = true
    error.value = null
    
    try {
      const params = new URLSearchParams()
      if (username) params.append('username', username)
      
      const response = await fetch(`${API_URL}/api/logs?${params}`)
      if (!response.ok) throw new Error('Failed to fetch logs')
      
      const data = await response.json()
      logs.value = data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching logs:', err)
    } finally {
      loading.value = false
    }
  }
  
  async function createLog(logData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${API_URL}/api/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to create log')
      }
      
      const newLog = await response.json()
      
      // Add to the beginning of the array (assuming newest first)
      logs.value.unshift(newLog)
      
      return newLog
    } catch (err) {
      error.value = err.message
      console.error('Error creating log:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function getLogById(id) {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`${API_URL}/api/logs/${id}`)
      if (!response.ok) throw new Error('Log not found')
      
      const data = await response.json()
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching log:', err)
      throw err
    } finally {
      loading.value = false
    }
  }
  
  function setCurrentUser(username) {
    currentUser.value = username
  }
  
  function clearError() {
    error.value = null
  }
  
  // Return everything that should be exposed
  return {
    // State
    logs,
    loading,
    error,
    currentUser,
    
    // Computed
    totalLogs,
    logsByUser,
    latestLog,
    averageStats,
    
    // Actions
    fetchLogs,
    createLog,
    getLogById,
    setCurrentUser,
    clearError
  }
})