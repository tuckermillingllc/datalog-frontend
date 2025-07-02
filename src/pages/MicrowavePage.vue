<template>
  <f7-page name="microwave">
    <f7-navbar title="Microwave Logs" back-link="Back">
      <f7-nav-right>
        <f7-link panel-open="left" icon-ios="f7:bars" icon-md="material:menu" />
      </f7-nav-right>
    </f7-navbar>

    <!-- Main Tab Segmented Control -->
    <f7-block>
      <f7-segmented raised>
        <f7-button 
          :class="{ 'button-active': activeTab === 'new' }"
          @click="activeTab = 'new'"
        >
          New Run
        </f7-button>
        <f7-button 
          :class="{ 'button-active': activeTab === 'view' }"
          @click="activeTab = 'view'"
        >
          View Logs
        </f7-button>
        <f7-button 
          :class="{ 'button-active': activeTab === 'update' }"
          @click="activeTab = 'update'"
        >
          Update Results
        </f7-button>
      </f7-segmented>
    </f7-block>

    <!-- New Production Run -->
    <div v-show="activeTab === 'new'">
      <f7-block-title>New Production Run</f7-block-title>
      <f7-list>
        <f7-list-input
          label="Username"
          type="text"
          v-model:value="productionForm.username"
          placeholder="Enter username"
          required
        />
        <f7-list-input
          label="Microwave Power Generator 1"
          type="number"
          step="0.01"
          v-model:value="productionForm.microwave_power_gen1"
          placeholder="Enter power setting"
        />
        <f7-list-input
          label="Microwave Power Generator 2"
          type="number"
          step="0.01"
          v-model:value="productionForm.microwave_power_gen2"
          placeholder="Enter power setting"
        />
        <f7-list-input
          label="Fan Speed Cavity 1"
          type="number"
          step="0.01"
          v-model:value="productionForm.fan_speed_cavity1"
          placeholder="Enter fan speed"
        />
        <f7-list-input
          label="Fan Speed Cavity 2"
          type="number"
          step="0.01"
          v-model:value="productionForm.fan_speed_cavity2"
          placeholder="Enter fan speed"
        />
        <f7-list-input
          label="Belt Speed"
          type="number"
          step="0.01"
          v-model:value="productionForm.belt_speed"
          placeholder="Enter belt speed"
        />
        <f7-list-input
          label="lb Larvae per Tub"
          type="number"
          step="0.01"
          v-model:value="productionForm.lb_larvae_per_tub"
          placeholder="Enter larvae weight per tub"
        />
        <f7-list-input
          label="Number of Ramp Up Tubs"
          type="number"
          v-model:value="productionForm.num_ramp_up_tubs"
          placeholder="Enter number of tubs"
        />
        <f7-list-input
          label="Number of Ramp Down Tubs"
          type="number"
          v-model:value="productionForm.num_ramp_down_tubs"
          placeholder="Enter number of tubs"
        />
        <f7-list-input
          label="Notes"
          type="textarea"
          v-model:value="productionForm.notes"
          placeholder="Additional notes..."
        />
      </f7-list>
      <f7-block>
        <f7-button 
          fill 
          @click="submitProductionRun"
          :disabled="submitting"
        >
          {{ submitting ? 'Saving...' : 'Start Production Run' }}
        </f7-button>
      </f7-block>
    </div>

    <!-- Update Results -->
    <div v-show="activeTab === 'update'">
      <f7-block-title>Update Production Run Results</f7-block-title>
      
      <f7-list v-if="incompleteRuns.length > 0">
        <f7-list-input
          label="Select Production Run"
          type="select"
          v-model:value="selectedRunId"
          @change="loadSelectedRun"
        >
          <option value="">Select a run...</option>
          <option 
            v-for="log in incompleteRuns" 
            :key="log.id" 
            :value="log.id"
          >
            {{ formatDate(log.timestamp) }} - {{ log.username }}
          </option>
        </f7-list-input>
      </f7-list>

      <f7-block v-else>
        <p class="text-align-center color-gray">No incomplete production runs found.</p>
      </f7-block>

      <div v-if="selectedRunId">
        <f7-list>
          <f7-list-input
            label="Tubs of Live Larvae"
            type="number"
            v-model:value="updateForm.tubs_live_larvae"
            placeholder="Enter number of tubs"
            required
          />
          <f7-list-input
            label="lb of Dried Larvae"
            type="number"
            step="0.01"
            v-model:value="updateForm.lb_dried_larvae"
            placeholder="Enter dried larvae weight"
            required
          />
          <f7-list-input
            label="Additional Notes"
            type="textarea"
            v-model:value="updateForm.notes"
            placeholder="Additional notes..."
          />
        </f7-list>
        
        <f7-block v-if="calculatedYield">
          <f7-card>
            <f7-card-content class="yield-card">
              <h3>Calculated Yield: {{ calculatedYield }}%</h3>
            </f7-card-content>
          </f7-card>
        </f7-block>

        <f7-block>
          <f7-button 
            fill 
            @click="updateProductionRun"
            :disabled="submitting"
          >
            {{ submitting ? 'Updating...' : 'Update Results' }}
          </f7-button>
        </f7-block>
      </div>
    </div>

    <!-- View Production Logs -->
    <div v-show="activeTab === 'view'">
      <f7-block-title>Production Logs</f7-block-title>
      <f7-list v-if="microwaveLogs.length > 0">
        <f7-list-item 
          v-for="log in microwaveLogs" 
          :key="log.id"
          :title="log.username"
          :subtitle="formatDate(log.timestamp)"
          :text="getLogSummary(log)"
          :badge="getStatus(log)"
          :badge-color="getStatusColor(log)"
        >
          <f7-icon slot="media" ios="f7:bolt" md="material:microwave" />
        </f7-list-item>
      </f7-list>
      <f7-block v-else>
        <p class="text-align-center color-gray">No production logs found.</p>
      </f7-block>
    </div>
  </f7-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { f7 } from 'framework7-vue'

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
      f7.toast.create({
        text: 'Production run started successfully!',
        closeTimeout: 2000,
      }).open()
    } else {
      throw new Error('Failed to save production run')
    }
  } catch (error) {
    console.error('Error saving production run:', error)
    f7.dialog.alert('Error saving production run. Please try again.')
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
      f7.toast.create({
        text: 'Production run updated successfully!',
        closeTimeout: 2000,
      }).open()
    } else {
      throw new Error('Failed to update production run')
    }
  } catch (error) {
    console.error('Error updating production run:', error)
    f7.dialog.alert('Error updating production run. Please try again.')
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

const getStatusColor = (log) => {
  if (log.tubs_live_larvae && log.lb_dried_larvae) {
    return 'green'
  }
  return 'orange'
}

const getLogSummary = (log) => {
  const yield_text = log.yield_percentage ? `Yield: ${log.yield_percentage.toFixed(1)}%` : 'Yield: Pending'
  const power = log.microwave_power_gen1 ? `Power: ${log.microwave_power_gen1}` : 'Power: N/A'
  return `${power}, ${yield_text}`
}
</script>

<style scoped>
.button-active {
  background-color: var(--f7-theme-color) !important;
  color: white !important;
}

.yield-card {
  text-align: center;
  background: linear-gradient(135deg, #4CAF50, #8BC34A);
  color: white;
  border-radius: 8px;
}

.yield-card h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}
</style>