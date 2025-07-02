<template>
  <div class="microwave-logs">
    <div class="page-header">
      <h1>Microwave Logs</h1>
      <p>Production run data and yield calculations</p>
    </div>

    <!-- Tab Navigation -->
    <div class="tabs">
      <button 
        class="tab-button"
        :class="{ active: activeTab === 'new' }"
        @click="activeTab = 'new'"
      >
        New Production Run
      </button>
      <button 
        class="tab-button"
        :class="{ active: activeTab === 'view' }"
        @click="activeTab = 'view'"
      >
        View Production Logs
      </button>
      <button 
        class="tab-button"
        :class="{ active: activeTab === 'update' }"
        @click="activeTab = 'update'"
      >
        Update Run Results
      </button>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- New Production Run -->
      <div v-if="activeTab === 'new'" class="form-container">
        <h3>New Production Run</h3>
        <form @submit.prevent="submitProductionRun" class="log-form">
          <div class="form-row">
            <div class="form-group">
              <label>Username</label>
              <input v-model="productionForm.username" type="text" required>
            </div>
            <div class="form-group">
              <label>Microwave Power Generator 1</label>
              <input v-model="productionForm.microwave_power_gen1" type="number" step="0.01">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Microwave Power Generator 2</label>
              <input v-model="productionForm.microwave_power_gen2" type="number" step="0.01">
            </div>
            <div class="form-group">
              <label>Fan Speed Cavity 1</label>
              <input v-model="productionForm.fan_speed_cavity1" type="number" step="0.01">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Fan Speed Cavity 2</label>
              <input v-model="productionForm.fan_speed_cavity2" type="number" step="0.01">
            </div>
            <div class="form-group">
              <label>Belt Speed</label>
              <input v-model="productionForm.belt_speed" type="number" step="0.01">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>lb Larvae per Tub</label>
              <input v-model="productionForm.lb_larvae_per_tub" type="number" step="0.01">
            </div>
            <div class="form-group">
              <label>Number of Ramp Up Tubs</label>
              <input v-model="productionForm.num_ramp_up_tubs" type="number">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Number of Ramp Down Tubs</label>
              <input v-model="productionForm.num_ramp_down_tubs" type="number">
            </div>
          </div>
          
          <div class="form-group full-width">
            <label>Notes</label>
            <textarea v-model="productionForm.notes" rows="3"></textarea>
          </div>
          
          <button type="submit" class="submit-btn" :disabled="submitting">
            {{ submitting ? 'Saving...' : 'Start Production Run' }}
          </button>
        </form>
      </div>

      <!-- Update Run Results -->
      <div v-if="activeTab === 'update'" class="form-container">
        <h3>Update Production Run Results</h3>
        
        <!-- Select Run to Update -->
        <div class="form-group" style="margin-bottom: 2rem;">
          <label>Select Production Run to Update</label>
          <select v-model="selectedRunId" @change="loadSelectedRun">
            <option value="">Select a run...</option>
            <option v-for="log in incompleteRuns" :key="log.id" :value="log.id">
              {{ formatDate(log.timestamp) }} - {{ log.username }}
            </option>
          </select>
        </div>

        <form v-if="selectedRunId" @submit.prevent="updateProductionRun" class="log-form">
          <div class="form-row">
            <div class="form-group">
              <label>Tubs of Live Larvae</label>
              <input v-model="updateForm.tubs_live_larvae" type="number" required>
            </div>
            <div class="form-group">
              <label>lb of Dried Larvae</label>
              <input v-model="updateForm.lb_dried_larvae" type="number" step="0.01" required>
            </div>
          </div>
          
          <div class="form-group full-width">
            <label>Additional Notes</label>
            <textarea v-model="updateForm.notes" rows="3"></textarea>
          </div>
          
          <div v-if="calculatedYield" class="yield-display">
            <strong>Calculated Yield: {{ calculatedYield }}%</strong>
          </div>
          
          <button type="submit" class="submit-btn" :disabled="submitting">
            {{ submitting ? 'Updating...' : 'Update Results' }}
          </button>
        </form>
      </div>

      <!-- View Production Logs -->
      <div v-if="activeTab === 'view'" class="logs-container">
        <h3>Production Logs</h3>
        <div class="logs-table-container">
          <table class="logs-table">
            <thead>
              <tr>
                <th>Date/Time</th>
                <th>Username</th>
                <th>Power Gen 1</th>
                <th>Power Gen 2</th>
                <th>Belt Speed</th>
                <th>lb/Tub</th>
                <th>Ramp Up</th>
                <th>Ramp Down</th>
                <th>Live Tubs</th>
                <th>Dried lb</th>
                <th>Yield %</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in microwaveLogs" :key="log.id">
                <td>{{ formatDate(log.timestamp) }}</td>
                <td>{{ log.username }}</td>
                <td>{{ log.microwave_power_gen1 || '-' }}</td>
                <td>{{ log.microwave_power_gen2 || '-' }}</td>
                <td>{{ log.belt_speed || '-' }}</td>
                <td>{{ log.lb_larvae_per_tub || '-' }}</td>
                <td>{{ log.num_ramp_up_tubs || '-' }}</td>
                <td>{{ log.num_ramp_down_tubs || '-' }}</td>
                <td>{{ log.tubs_live_larvae || '-' }}</td>
                <td>{{ log.lb_dried_larvae || '-' }}</td>
                <td>{{ log.yield_percentage ? log.yield_percentage.toFixed(1) + '%' : '-' }}</td>
                <td>
                  <span :class="getStatusClass(log)">
                    {{ getStatus(log) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const activeTab = ref('new')
const submitting = ref(false)
const selectedRunId = ref('')

const productionForm = ref({
  username: '',
  microwave_power_gen1: '',
  microwave_power_gen2: '',
  fan_speed_cavity1: '',
  fan_speed_cavity2: '',
  belt_speed: '',
  lb_larvae_per_tub: '',
  num_ramp_up_tubs: '',
  num_ramp_down_tubs: '',
  notes: ''
})

const updateForm = ref({
  tubs_live_larvae: '',
  lb_dried_larvae: '',
  notes: ''
})

const microwaveLogs = ref([])
const selectedRun = ref(null)

const incompleteRuns = computed(() => {
  return microwaveLogs.value.filter(log => !log.tubs_live_larvae || !log.lb_dried_larvae)
})

const calculatedYield = computed(() => {
  if (selectedRun.value && updateForm.value.tubs_live_larvae && updateForm.value.lb_dried_larvae) {
    const totalLarvae = selectedRun.value.lb_larvae_per_tub * updateForm.value.tubs_live_larvae
    if (totalLarvae > 0) {
      return ((updateForm.value.lb_dried_larvae / totalLarvae) * 100).toFixed(1)
    }
  }
  return null
})

onMounted(() => {
  loadMicrowaveLogs()
})

const submitProductionRun = async () => {
  submitting.value = true
  try {
    const response = await fetch('https://datalog-backend.onrender.com/api/microwave-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productionForm.value)
    })
    
    if (response.ok) {
      resetProductionForm()
      await loadMicrowaveLogs()
      alert('Production run started successfully!')
    } else {
      throw new Error('Failed to save production run')
    }
  } catch (error) {
    console.error('Error saving production run:', error)
    alert('Error saving production run. Please try again.')
  } finally {
    submitting.value = false
  }
}

const updateProductionRun = async () => {
  submitting.value = true
  try {
    const response = await fetch(`https://datalog-backend.onrender.com/api/microwave-logs/${selectedRunId.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateForm.value)
    })
    
    if (response.ok) {
      resetUpdateForm()
      selectedRunId.value = ''
      selectedRun.value = null
      await loadMicrowaveLogs()
      alert('Production run updated successfully!')
    } else {
      throw new Error('Failed to update production run')
    }
  } catch (error) {
    console.error('Error updating production run:', error)
    alert('Error updating production run. Please try again.')
  } finally {
    submitting.value = false
  }
}

const loadMicrowaveLogs = async () => {
  try {
    const response = await fetch('https://datalog-backend.onrender.com/api/microwave-logs')
    if (response.ok) {
      microwaveLogs.value = await response.json()
    }
  } catch (error) {
    console.error('Error loading microwave logs:', error)
  }
}

const loadSelectedRun = () => {
  if (selectedRunId.value) {
    selectedRun.value = microwaveLogs.value.find(log => log.id === selectedRunId.value)
    resetUpdateForm()
  } else {
    selectedRun.value = null
  }
}

const resetProductionForm = () => {
  productionForm.value = {
    username: '',
    microwave_power_gen1: '',
    microwave_power_gen2: '',
    fan_speed_cavity1: '',
    fan_speed_cavity2: '',
    belt_speed: '',
    lb_larvae_per_tub: '',
    num_ramp_up_tubs: '',
    num_ramp_down_tubs: '',
    notes: ''
  }
}

const resetUpdateForm = () => {
  updateForm.value = {
    tubs_live_larvae: '',
    lb_dried_larvae: '',
    notes: ''
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const getStatus = (log) => {
  if (log.tubs_live_larvae && log.lb_dried_larvae) {
    return 'Complete'
  }
  return 'In Progress'
}

const getStatusClass = (log) => {
  if (log.tubs_live_larvae && log.lb_dried_larvae) {
    return 'status-complete'
  }
  return 'status-progress'
}
</script>

<style scoped>
.microwave-logs {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background-color: #f5f5f5;
  min-height: calc(100vh - 70px);
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
  color: #FF9800;
  border-bottom-color: #FF9800;
}

.form-container {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.07);
}

.log-form {
  max-width: 900px;
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
.form-group textarea,
.form-group select {
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #FF9800;
}

.yield-display {
  background: #e8f5e8;
  border: 2px solid #4CAF50;
  border-radius: 6px;
  padding: 1rem;
  margin: 1rem 0;
  text-align: center;
  color: #2e7d32;
  font-size: 1.1rem;
}

.submit-btn {
  background: #FF9800;
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
  background: #F57C00;
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
  min-width: 1200px;
}

.logs-table th,
.logs-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
  font-size: 0.9rem;
}

.logs-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #495057;
}

.logs-table tbody tr:hover {
  background: #f8f9fa;
}

.status-complete {
  background: #d4edda;
  color: #155724;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-progress {
  background: #fff3cd;
  color: #856404;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .microwave-logs {
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
    border-left-color: #FF9800;
    border-bottom-color: transparent;
  }
}
</style>