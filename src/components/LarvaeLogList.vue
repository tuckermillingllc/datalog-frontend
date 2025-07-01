<template>
  <div class="larvae-log-list">
    <div class="list-header">
      <h2>Larvae Logs</h2>
      <div class="filter-section">
        <input
          v-model="userFilter"
          type="text"
          placeholder="Filter by username..."
          @input="handleFilterChange"
        />
        <button @click="refreshLogs" :disabled="loading" class="btn-refresh">
          {{ loading ? 'Loading...' : 'Refresh' }}
        </button>
      </div>
    </div>

    <!-- Statistics Summary -->
    <div v-if="averageStats" class="stats-summary">
      <div class="stat-card">
        <h4>Average Larvae Count</h4>
        <p>{{ averageStats.avgLarvaeCount.toLocaleString() }}</p>
      </div>
      <div class="stat-card">
        <h4>Average Feed/Larvae</h4>
        <p>{{ averageStats.avgFeedPerLarvae }} mg</p>
      </div>
      <div class="stat-card">
        <h4>Average Water:Feed</h4>
        <p>{{ averageStats.avgWaterFeedRatio }}:1</p>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="error-message">
      Error loading logs: {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="loading && logs.length === 0" class="loading">
      Loading logs...
    </div>

    <!-- Logs Table -->
    <div v-else-if="logs.length > 0" class="table-container">
      <table class="logs-table">
        <thead>
          <tr>
            <th>Date/Time</th>
            <th>User</th>
            <th>Age (days)</th>
            <th>Row</th>
            <th>Weight (mg)</th>
            <th>Pct (%)</th>
            <th>Larvae (lb)</th>
            <th>Feed (lb)</th>
            <th>Water (lb)</th>
            <th>Refeed</th>
            <th>Count</th>
            <th>Feed/Larvae</th>
            <th>W:F Ratio</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.id" @click="selectLog(log)" class="log-row">
            <td>{{ formatDate(log.timestamp) }}</td>
            <td>{{ log.username }}</td>
            <td>{{ log.days_of_age }}</td>
            <td>{{ log.row_number || '-' }}</td>
            <td>{{ log.larva_weight }}</td>
            <td>{{ log.larva_pct }}</td>
            <td>{{ log.lb_larvae }}</td>
            <td>{{ log.lb_feed }}</td>
            <td>{{ log.lb_water }}</td>
            <td>{{ log.screen_refeed ? '✓' : '-' }}</td>
            <td>{{ log.larvae_count?.toLocaleString() || '-' }}</td>
            <td>{{ log.feed_per_larvae || '-' }}</td>
            <td>{{ log.water_feed_ratio || '-' }}</td>
            <td class="notes-cell">{{ log.notes || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <p>No logs found. Create your first log!</p>
    </div>

    <!-- Selected Log Details (Modal) -->
    <div v-if="selectedLog" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3>Log Details</h3>
        <div class="log-details">
          <div class="detail-row">
            <strong>ID:</strong> {{ selectedLog.id }}
          </div>
          <div class="detail-row">
            <strong>Timestamp:</strong> {{ formatDate(selectedLog.timestamp, true) }}
          </div>
          <div class="detail-row">
            <strong>Username:</strong> {{ selectedLog.username }}
          </div>
          <div class="detail-row">
            <strong>Notes:</strong> {{ selectedLog.notes || 'No notes' }}
          </div>
        </div>
        <button @click="closeModal" class="btn-close">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLarvaeLogStore } from '../stores/larvaeLog'

const store = useLarvaeLogStore()

// Local state
const userFilter = ref('')
const selectedLog = ref(null)

// Computed properties
const logs = computed(() => store.logsByUser)
const loading = computed(() => store.loading)
const error = computed(() => store.error)
const averageStats = computed(() => store.averageStats)

// Methods
async function refreshLogs() {
  await store.fetchLogs(userFilter.value || null)
}

function handleFilterChange() {
  store.setCurrentUser(userFilter.value)
}

function selectLog(log) {
  selectedLog.value = log
}

function closeModal() {
  selectedLog.value = null
}

function formatDate(timestamp, detailed = false) {
  const date = new Date(timestamp)
  if (detailed) {
    return date.toLocaleString()
  }
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// Load logs on mount
onMounted(() => {
  refreshLogs()
})
</script>

<style scoped>
.larvae-log-list {
  padding: 20px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-section {
  display: flex;
  gap: 10px;
}

.filter-section input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 200px;
}

.btn-refresh {
  padding: 8px 16px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-refresh:hover:not(:disabled) {
  background-color: #3aa876;
}

.btn-refresh:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.stat-card {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.stat-card h4 {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
}

.stat-card p {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
  color: #42b883;
}

.table-container {
  overflow-x: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.logs-table {
  width: 100%;
  border-collapse: collapse;
}

.logs-table th,
.logs-table td {
  padding: 12px 8px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.logs-table th {
  background-color: #f5f5f5;
  font-weight: 600;
  color: #666;
  position: sticky;
  top: 0;
}

.log-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.log-row:hover {
  background-color: #f9f9f9;
}

.notes-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.loading,
.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error-message {
  color: #dc3545;
  padding: 10px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin-bottom: 20px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content h3 {
  margin: 0 0 20px 0;
}

.log-details {
  margin-bottom: 20px;
}

.detail-row {
  margin-bottom: 10px;
  word-break: break-all;
}

.detail-row strong {
  display: inline-block;
  width: 120px;
  color: #666;
}

.btn-close {
  padding: 10px 20px;
  background-color: #666;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-close:hover {
  background-color: #555;
}

@media (max-width: 640px) {
  .list-header {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-section {
    flex-direction: column;
    width: 100%;
  }

  .filter-section input,
  .filter-section button {
    width: 100%;
  }

  .filter-section button {
    margin-top: 8px;
  }

  .list-header h2 {
    text-align: center;
    margin-bottom: 12px;
  }
}
</style>