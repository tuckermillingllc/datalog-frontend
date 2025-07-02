<template>
  <f7-page name="home">
    <f7-navbar title="DataLog System" />
    
    <f7-block class="welcome-block">
      <h2>Welcome to DataLog System</h2>
      <p>Select a logging system to get started</p>
    </f7-block>

    <f7-block-title>Logging Systems</f7-block-title>
    
    <f7-list>
      <!-- Larvae Logs Card -->
      <f7-list-item 
        link="/larvae/" 
        title="Larvae Logs"
        subtitle="Track larvae feeding, weight, and development data"
        text="Daily monitoring • Feed calculations • Growth tracking"
        class="larvae-card"
      >
        <div slot="media" class="card-icon">🐛</div>
        <f7-icon slot="after" ios="f7:chevron_right" md="material:chevron_right" />
      </f7-list-item>

      <!-- Container Logs Card -->
      <f7-list-item 
        link="/container/" 
        title="Container Logs"
        subtitle="Monitor container conditions for prepupae and neonates"
        text="Temperature • Humidity • Tub management"
        class="container-card"
      >
        <div slot="media" class="card-icon">📦</div>
        <f7-icon slot="after" ios="f7:chevron_right" md="material:chevron_right" />
      </f7-list-item>

      <!-- Microwave Logs Card -->
      <f7-list-item 
        link="/microwave/" 
        title="Microwave Logs"
        subtitle="Production run data and yield calculations"
        text="Power settings • Production runs • Yield tracking"
        class="microwave-card"
      >
        <div slot="media" class="card-icon">⚡</div>
        <f7-icon slot="after" ios="f7:chevron_right" md="material:chevron_right" />
      </f7-list-item>
    </f7-list>

    <!-- Quick Stats -->
    <f7-block-title>Quick Stats</f7-block-title>
    <f7-block>
      <f7-row>
        <f7-col width="33">
          <f7-card>
            <f7-card-content class="stat-card">
              <div class="stat-number">{{ totalLogs }}</div>
              <div class="stat-label">Total Logs</div>
            </f7-card-content>
          </f7-card>
        </f7-col>
        <f7-col width="33">
          <f7-card>
            <f7-card-content class="stat-card">
              <div class="stat-number">{{ todayLogs }}</div>
              <div class="stat-label">Today's Logs</div>
            </f7-card-content>
          </f7-card>
        </f7-col>
        <f7-col width="33">
          <f7-card>
            <f7-card-content class="stat-card">
              <div class="stat-number">3</div>
              <div class="stat-label">Active Systems</div>
            </f7-card-content>
          </f7-card>
        </f7-col>
      </f7-row>
    </f7-block>
  </f7-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const totalLogs = ref('---')
const todayLogs = ref('---')

onMounted(() => {
  loadQuickStats()
})

const loadQuickStats = async () => {
  try {
    // Placeholder for now
    totalLogs.value = '---'
    todayLogs.value = '---'
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}
</script>

<style scoped>
.welcome-block {
  text-align: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin: 0;
  border-radius: 0;
}

.welcome-block h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.welcome-block p {
  opacity: 0.9;
  font-size: 1.1rem;
}

.card-icon {
  font-size: 2.5rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 12px;
}

.larvae-card .card-icon {
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
}

.container-card .card-icon {
  background: linear-gradient(135deg, #2196F3, #03A9F4);
}

.microwave-card .card-icon {
  background: linear-gradient(135deg, #FF9800, #FFC107);
}

.stat-card {
  text-align: center;
  padding: 1rem;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--f7-theme-color);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>