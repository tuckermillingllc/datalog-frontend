<template>
  <div class="container-logs">
    <div class="page-header">
      <h1>Container Logs</h1>
      <p>Monitor container conditions for prepupae and neonates</p>
    </div>

    <!-- Tab Navigation -->
    <div class="tabs">
      <button 
        class="tab-button"
        :class="{ active: activeTab === 'prepupae' }"
        @click="activeTab = 'prepupae'"
      >
        Prepupae Logs
      </button>
      <button 
        class="tab-button"
        :class="{ active: activeTab === 'neonates' }"
        @click="activeTab = 'neonates'"
      >
        Neonate Logs
      </button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Prepupae Tab -->
      <div v-if="activeTab === 'prepupae'" class="tab-panel">
        <div class="sub-tabs">
          <button 
            class="sub-tab-button"
            :class="{ active: prepupaeSubTab === 'new' }"
            @click="prepupaeSubTab = 'new'"
          >
            New Log
          </button>
          <button 
            class="sub-tab-button"
            :class="{ active: prepupaeSubTab === 'view' }"
            @click="prepupaeSubTab = 'view'"
          >
            View Logs
          </button>
        </div>

        <!-- New Prepupae Log -->
        <div v-if="prepupaeSubTab === 'new'" class="form-container">
          <h3>New Prepupae Log</h3>
          <form @submit.prevent="submitPrepupaeLog" class="log-form">
            <div class="form-row">
              <div class="form-group">
                <label>Username</label>
                <input v-model="prepupaeForm.username" type="text" required>
              </div>
              <div class="form-group">
                <label>Temperature (°F)</label>
                <input v-model="prepupaeForm.temperature" type="number" step="0.01">
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Humidity (%)</label>
                <input v-model="prepupaeForm.humidity" type="number" step="0.01">
              </div>
              <div class="form-group">
                <label>Prepupae Tubs Added</label>
                <input v-model="prepupaeForm.prepupae_tubs_added" type="number">
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Egg Nests Replaced</label>
                <input v-model="prepupaeForm.egg_nests_replaced" type="number">
              </div>
            </div>
            
            <div class="form-group full-width">
              <label>Notes</label>
              <textarea v-model="prepupaeForm.notes" rows="3"></textarea>
            </div>
            
            <button type="submit" class="submit-btn" :disabled="submitting">
              {{ submitting ? 'Saving...' : 'Save Log' }}
            </button>
          </form>
        </div>

        <!-- View Prepupae Logs -->
        <div v-if="prepupaeSubTab === 'view'" class="logs-container">
          <h3>Prepupae Logs</h3>
          <div class="logs-table-container">
            <table class="logs-table">
              <thead>
                <tr>
                  <th>Date/Time</th>
                  <th>Username</th>
                  <th>Temperature</th>
                  <th>Humidity</th>
                  <th>Tubs Added</th>
                  <th>Nests Replaced</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in prepupaeLogs" :key="log.id">
                  <td>{{ formatDate(log.timestamp) }}</td>
                  <td>{{ log.username }}</td>
                  <td>{{ log.temperature }}°F</td>
                  <td>{{ log.humidity }}%</td>
                  <td>{{ log.prepupae_tubs_added }}</td>
                  <td>{{ log.egg_nests_replaced }}</td>
                  <td>{{ log.notes }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Neonates Tab -->
      <div v-if="activeTab === 'neonates'" class="tab-panel">
        <div class="sub-tabs">
          <button 
            class="sub-tab-button"
            :class="{ active: neonatesSubTab === 'new' }"
            @click="neonatesSubTab = 'new'"
          >
            New Log
          </button>
          <button 
            class="sub-tab-button"
            :class="{ active: neonatesSubTab === 'view' }"
            @click="neonatesSubTab = 'view'"
          >
            View Logs
          </button>
        </div>

        <!-- New Neonate Log -->
        <div v-if="neonatesSubTab === 'new'" class="form-container">
          <h3>New Neonate Log</h3>
          <form @submit.prevent="submitNeonateLog" class="log-form">
            <div class="form-row">
              <div class="form-group">
                <label>Username</label>
                <input v-model="neonateForm.username" type="text" required>
              </div>
              <div class="form-group">
                <label>Temperature (°F)</label>
                <input v-model="neonateForm.temperature" type="number" step="0.01">
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Humidity (%)</label>
                <input v-model="neonateForm.humidity" type="number" step="0.01">
              </div>
              <div class="form-group">
                <label>Bait Tubs Replaced</label>
                <input v-model="neonateForm.bait_tubs_replaced" type="number">
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Shelf Tubs Removed</label>
                <input v-model="neonateForm.shelf_tubs_removed" type="number">
              </div>
              <div class="form-group">
                <label>Egg Nests Replaced</label>
                <input v-model="neonateForm.egg_nests_replaced" type="number">
              </div>
            </div>
            
            <div class="form-group full-width">
              <label>Notes</label>
              <textarea v-model="neonateForm.notes" rows="3"></textarea>
            </div>
            
            <button type="submit" class="submit-btn" :disabled="submitting">
              {{ submitting ? 'Saving...' : 'Save Log' }}
            </button>
          </form>
        </div>

        <!-- View Neonate Logs -->
        <div v-if="neonatesSubTab === 'view'" class="logs-container">
          <h3>Neonate Logs</h3>
          <div class="logs-table-container">
            <table class="logs-table">
              <thead>
                <tr>
                  <th>Date/Time</th>
                  <th>Username</th>
                  <th>Temperature</th>
                  <th>Humidity</th>
                  <th>Bait Tubs</th>
                  <th>Shelf Tubs</th>
                  <th>Nests Replaced</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in neonateLogs" :key="log.id">
                  <td>{{ formatDate(log.timestamp) }}</td>
                  <td>{{ log.username }}</td>
                  <td>{{ log.temperature }}°F</td>
                  <td>{{ log.humidity }}%</td>
                  <td>{{ log.bait_tubs_replaced }}</td>
                  <td>{{ log.shelf_tubs_removed }}</td>
                  <td>{{ log.egg_nests_replaced }}</td>
                  <td>{{ log.notes }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContainerLogs',
  data() {
    return {
      activeTab: 'prepupae',
      prepupaeSubTab: 'new',
      neonatesSubTab: 'new',
      submitting: false,
      prepupaeForm: {
        username: '',
        temperature: '',
        humidity: '',
        prepupae_tubs_added: '',
        egg_nests_replaced: '',
        notes: ''
      },
      neonateForm: {
        username: '',
        temperature: '',
        humidity: '',
        bait_tubs_replaced: '',
        shelf_tubs_removed: '',
        egg_nests_replaced: '',
        notes: ''
      },
      prepupaeLogs: [],
      neonateLogs: []
    }
  },
  mounted() {
    this.loadPrepupaeLogs()
    this.loadNeonateLogs()
  },
  methods: {
    async submitPrepupaeLog() {
      this.submitting = true
      try {
        const response = await fetch('/api/container-logs/prepupae', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.prepupaeForm)
        })
        
        if (response.ok) {
          this.resetPrepupaeForm()
          this.loadPrepupaeLogs()
          alert('Prepupae log saved successfully!')
        } else {
          throw new Error('Failed to save log')
        }
      } catch (error) {
        console.error('Error saving prepupae log:', error)
        alert('Error saving log. Please try again.')
      } finally {
        this.submitting = false
      }
    },
    
    async submitNeonateLog() {
      this.submitting = true
      try {
        const response = await fetch('/api/container-logs/neonates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.neonateForm)
        })
        
        if (response.ok) {
          this.resetNeonateForm()
          this.loadNeonateLogs()
          alert('Neonate log saved successfully!')
        } else {
          throw new Error('Failed to save log')
        }
      } catch (error) {
        console.error('Error saving neonate log:', error)
        alert('Error saving log. Please try again.')
      } finally {
        this.submitting = false
      }
    },
    
    async loadPrepupaeLogs() {
      try {
        const response = await fetch('/api/container-logs/prepupae')
        if (response.ok) {
          this.prepupaeLogs = await response.json()
        }
      } catch (error) {
        console.error('Error loading prepupae logs:', error)
      }
    },
    
    async loadNeonateLogs() {
      try {
        const response = await fetch('/api/container-logs/neonates')
        if (response.ok) {
          this.neonateLogs = await response.json()
        }
      } catch (error) {
        console.error('Error loading neonate logs:', error)
      }
    },
    
    resetPrepupaeForm() {
      this.prepupaeForm = {
        username: '',
        temperature: '',
        humidity: '',
        prepupae_tubs_added: '',
        egg_nests_replaced: '',
        notes: ''
      }
    },
    
    resetNeonateForm() {
      this.neonateForm = {
        username: '',
        temperature: '',
        humidity: '',
        bait_tubs_replaced: '',
        shelf_tubs_removed: '',
        egg_nests_replaced: '',
        notes: ''
      }
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleString()
    }
  }
}
</script>

<style scoped>
.container-logs {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #666;
  font-size: 1.1rem;
}

.tabs {
  display: flex;
  border-bottom: 2px solid #e9ecef;
  margin-bottom: 2rem;
}

.tab-button {
  padding: 1rem 2rem;
  background: none;
  border: none;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  color: #6c757d;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tab-button:hover {
  color: #495057;
  background-color: #f8f9fa;
}

.tab-button.active {
  color: #2196F3;
  border-bottom-color: #2196F3;
}

.sub-tabs {
  display: flex;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 0.25rem;
  margin-bottom: 2rem;
}

.sub-tab-button {
  flex: 1;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  font-weight: 500;
  cursor: pointer;
  color: #6c757d;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.sub-tab-button.active {
  background: white;
  color: #495057;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.07);
}

.log-form {
  max-width: 800px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #495057;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2196F3;
}

.submit-btn {
  background: #2196F3;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1rem;
}

.submit-btn:hover:not(:disabled) {
  background: #1976D2;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.logs-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.07);
}

.logs-table-container {
  overflow-x: auto;
  margin-top: 1rem;
}

.logs-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.logs-table th,
.logs-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.logs-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.logs-table tbody tr:hover {
  background: #f8f9fa;
}

@media (max-width: 768px) {
  .container-logs {
    padding: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .tabs {
    flex-direction: column;
  }
  
  .tab-button {
    text-align: left;
    border-bottom: none;
    border-left: 3px solid transparent;
  }
  
  .tab-button.active {
    border-left-color: #2196F3;
    border-bottom-color: transparent;
  }
}
</style>