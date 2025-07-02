<template>
  <div class="home-container">
    <!-- Header -->
    <header class="header">
      <h1 class="title">DataLog System</h1>
      <p class="subtitle">Select a logging system to get started</p>
    </header>

    <!-- Navigation Cards -->
    <div class="cards-container">
      <!-- Larvae Logs Card -->
      <router-link to="/larvae-logs" class="nav-card larvae-card">
        <div class="card-icon">🐛</div>
        <h2 class="card-title">Larvae Logs</h2>
        <p class="card-description">
          Track larvae feeding, weight, and development data
        </p>
        <div class="card-stats">
          Daily monitoring • Feed calculations • Growth tracking
        </div>
      </router-link>

      <!-- Container Logs Card -->
      <router-link to="/container-logs" class="nav-card container-card">
        <div class="card-icon">📦</div>
        <h2 class="card-title">Container Logs</h2>
        <p class="card-description">
          Monitor container conditions for prepupae and neonates
        </p>
        <div class="card-stats">
          Temperature • Humidity • Tub management
        </div>
      </router-link>

      <!-- Microwave Logs Card -->
      <router-link to="/microwave-logs" class="nav-card microwave-card">
        <div class="card-icon">⚡</div>
        <h2 class="card-title">Microwave Logs</h2>
        <p class="card-description">
          Production run data and yield calculations
        </p>
        <div class="card-stats">
          Power settings • Production runs • Yield tracking
        </div>
      </router-link>
    </div>

    <!-- Quick Stats Section -->
    <div class="quick-stats">
      <div class="stat-item">
        <span class="stat-number">{{ totalLogs }}</span>
        <span class="stat-label">Total Logs</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ todayLogs }}</span>
        <span class="stat-label">Today's Logs</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">3</span>
        <span class="stat-label">Active Systems</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const totalLogs = ref('---')
const todayLogs = ref('---')

onMounted(() => {
  loadQuickStats()
})

const loadQuickStats = async () => {
  // You can implement this to fetch actual stats from your API
  try {
    // Example API calls (you'll need to implement these endpoints)
    // const response = await fetch('https://datalog-backend.onrender.com/api/stats')
    // const stats = await response.json()
    // totalLogs.value = stats.total
    // todayLogs.value = stats.today
    
    // For now, we'll use placeholder values
    totalLogs.value = '---'
    todayLogs.value = '---'
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  color: white;
}

.title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  font-weight: 300;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
  margin-bottom: 3rem;
}

.nav-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  text-align: center;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border: 3px solid transparent;
  position: relative;
  overflow: hidden;
  display: block;
}

.nav-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  transition: all 0.3s ease;
}

.nav-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  text-decoration: none;
  color: inherit;
}

.larvae-card::before {
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
}

.container-card::before {
  background: linear-gradient(90deg, #2196F3, #03A9F4);
}

.microwave-card::before {
  background: linear-gradient(90deg, #FF9800, #FFC107);
}

.larvae-card:hover {
  border-color: #4CAF50;
}

.container-card:hover {
  border-color: #2196F3;
}

.microwave-card:hover {
  border-color: #FF9800;
}

.card-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.card-description {
  font-size: 1rem;
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.card-stats {
  font-size: 0.9rem;
  color: #999;
  font-weight: 500;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #e9ecef;
}

.larvae-card .card-stats {
  border-left-color: #4CAF50;
}

.container-card .card-stats {
  border-left-color: #2196F3;
}

.microwave-card .card-stats {
  border-left-color: #FF9800;
}

.quick-stats {
  display: flex;
  gap: 2rem;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 1.5rem 2rem;
  border: 1px solid rgba(255,255,255,0.2);
}

.stat-item {
  text-align: center;
  color: white;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  font-weight: 300;
}

/* Responsive Design */
@media (max-width: 768px) {
  .home-container {
    padding: 1rem;
  }
  
  .title {
    font-size: 2.5rem;
  }
  
  .cards-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .nav-card {
    padding: 2rem 1.5rem;
  }
  
  .quick-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .stat-number {
    font-size: 1.5rem;
    margin-bottom: 0;
  }
}
</style>