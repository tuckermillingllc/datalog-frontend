<template>
  <f7-page name="container">
    <f7-navbar title="Container Logs" back-link="Back">
      <f7-nav-right>
        <f7-link panel-open="left" icon-ios="f7:bars" icon-md="material:menu" />
      </f7-nav-right>
    </f7-navbar>

    <!-- Main Tab Segmented Control -->
    <f7-block>
      <f7-segmented raised>
        <f7-button 
          :class="{ 'button-active': activeTab === 'prepupae' }"
          @click="activeTab = 'prepupae'"
        >
          Prepupae Logs
        </f7-button>
        <f7-button 
          :class="{ 'button-active': activeTab === 'neonates' }"
          @click="activeTab = 'neonates'"
        >
          Neonate Logs
        </f7-button>
      </f7-segmented>
    </f7-block>

    <!-- Prepupae Tab -->
    <div v-show="activeTab === 'prepupae'">
      <!-- Sub-tabs for Prepupae -->
      <f7-block>
        <f7-segmented>
          <f7-button 
            :class="{ 'button-active': prepupaeSubTab === 'new' }"
            @click="prepupaeSubTab = 'new'"
          >
            New Log
          </f7-button>
          <f7-button 
            :class="{ 'button-active': prepupaeSubTab === 'view' }"
            @click="prepupaeSubTab = 'view'"
          >
            View Logs
          </f7-button>
        </f7-segmented>
      </f7-block>

      <!-- New Prepupae Log Form -->
      <div v-show="prepupaeSubTab === 'new'">
        <f7-block-title>New Prepupae Log</f7-block-title>
        <f7-list>
          <f7-list-input
            label="Username"
            type="text"
            v-model:value="prepupaeForm.username"
            placeholder="Enter username"
            required
          />
          <f7-list-input
            label="Temperature (°F)"
            type="number"
            step="0.01"
            v-model:value="prepupaeForm.temperature"
            placeholder="Enter temperature"
          />
          <f7-list-input
            label="Humidity (%)"
            type="number"
            step="0.01"
            v-model:value="prepupaeForm.humidity"
            placeholder="Enter humidity"
          />
          <f7-list-input
            label="Prepupae Tubs Added"
            type="number"
            v-model:value="prepupaeForm.prepupae_tubs_added"
            placeholder="Number of tubs"
          />
          <f7-list-input
            label="Egg Nests Replaced"
            type="number"
            v-model:value="prepupaeForm.egg_nests_replaced"
            placeholder="Number of nests"
          />
          <f7-list-input
            label="Notes"
            type="textarea"
            v-model:value="prepupaeForm.notes"
            placeholder="Additional notes..."
          />
        </f7-list>
        <f7-block>
          <f7-button 
            fill 
            @click="submitPrepupaeLog"
            :disabled="submitting"
          >
            {{ submitting ? 'Saving...' : 'Save Prepupae Log' }}
          </f7-button>
        </f7-block>
      </div>

      <!-- View Prepupae Logs -->
      <div v-show="prepupaeSubTab === 'view'">
        <f7-block-title>Prepupae Logs</f7-block-title>
        <f7-list v-if="prepupaeLogs.length > 0">
          <f7-list-item 
            v-for="log in prepupaeLogs" 
            :key="log.id"
            :title="log.username"
            :subtitle="formatDate(log.timestamp)"
            :text="`Temp: ${log.temperature || 'N/A'}°F, Humidity: ${log.humidity || 'N/A'}%, Tubs: ${log.prepupae_tubs_added || 'N/A'}`"
          >
            <f7-icon slot="media" ios="f7:doc_text" md="material:description" />
          </f7-list-item>
        </f7-list>
        <f7-block v-else>
          <p class="text-align-center color-gray">No prepupae logs found.</p>
        </f7-block>
      </div>
    </div>

    <!-- Neonates Tab -->
    <div v-show="activeTab === 'neonates'">
      <!-- Sub-tabs for Neonates -->
      <f7-block>
        <f7-segmented>
          <f7-button 
            :class="{ 'button-active': neonatesSubTab === 'new' }"
            @click="neonatesSubTab = 'new'"
          >
            New Log
          </f7-button>
          <f7-button 
            :class="{ 'button-active': neonatesSubTab === 'view' }"
            @click="neonatesSubTab = 'view'"
          >
            View Logs
          </f7-button>
        </f7-segmented>
      </f7-block>

      <!-- New Neonate Log Form -->
      <div v-show="neonatesSubTab === 'new'">
        <f7-block-title>New Neonate Log</f7-block-title>
        <f7-list>
          <f7-list-input
            label="Username"
            type="text"
            v-model:value="neonateForm.username"
            placeholder="Enter username"
            required
          />
          <f7-list-input
            label="Temperature (°F)"
            type="number"
            step="0.01"
            v-model:value="neonateForm.temperature"
            placeholder="Enter temperature"
          />
          <f7-list-input
            label="Humidity (%)"
            type="number"
            step="0.01"
            v-model:value="neonateForm.humidity"
            placeholder="Enter humidity"
          />
          <f7-list-input
            label="Bait Tubs Replaced"
            type="number"
            v-model:value="neonateForm.bait_tubs_replaced"
            placeholder="Number of bait tubs"
          />
          <f7-list-input
            label="Shelf Tubs Removed"
            type="number"
            v-model:value="neonateForm.shelf_tubs_removed"
            placeholder="Number of shelf tubs"
          />
          <f7-list-input
            label="Egg Nests Replaced"
            type="number"
            v-model:value="neonateForm.egg_nests_replaced"
            placeholder="Number of nests"
          />
          <f7-list-input
            label="Notes"
            type="textarea"
            v-model:value="neonateForm.notes"
            placeholder="Additional notes..."
          />
        </f7-list>
        <f7-block>
          <f7-button 
            fill 
            @click="submitNeonateLog"
            :disabled="submitting"
          >
            {{ submitting ? 'Saving...' : 'Save Neonate Log' }}
          </f7-button>
        </f7-block>
      </div>

      <!-- View Neonate Logs -->
      <div v-show="neonatesSubTab === 'view'">
        <f7-block-title>Neonate Logs</f7-block-title>
        <f7-list v-if="neonateLogs.length > 0">
          <f7-list-item 
            v-for="log in neonateLogs" 
            :key="log.id"
            :title="log.username"
            :subtitle="formatDate(log.timestamp)"
            :text="`Temp: ${log.temperature || 'N/A'}°F, Humidity: ${log.humidity || 'N/A'}%, Bait: ${log.bait_tubs_replaced || 'N/A'}, Shelf: ${log.shelf_tubs_removed || 'N/A'}`"
          >
            <f7-icon slot="media" ios="f7:doc_text" md="material:description" />
          </f7-list-item>
        </f7-list>
        <f7-block v-else>
          <p class="text-align-center color-gray">No neonate logs found.</p>
        </f7-block>
      </div>
    </div>
  </f7-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { f7 } from 'framework7-vue'

const activeTab = ref('prepupae')
const prepupaeSubTab = ref('new')
const neonatesSubTab = ref('new')
const submitting = ref(false)

const prepupaeForm = ref({
  username: '',
  temperature: '',
  humidity: '',
  prepupae_tubs_added: '',
  egg_nests_replaced: '',
  notes: ''
})

const neonateForm = ref({
  username: '',
  temperature: '',
  humidity: '',
  bait_tubs_replaced: '',
  shelf_tubs_removed: '',
  egg_nests_replaced: '',
  notes: ''
})

const prepupaeLogs = ref([])
const neonateLogs = ref([])

onMounted(() => {
  loadPrepupaeLogs()
  loadNeonateLogs()
})

const submitPrepupaeLog = async () => {
  submitting.value = true
  try {
    const response = await fetch('https://datalog-backend.onrender.com/api/container-logs/prepupae', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(prepupaeForm.value)
    })
    
    if (response.ok) {
      resetPrepupaeForm()
      await loadPrepupaeLogs()
      f7.toast.create({
        text: 'Prepupae log saved successfully!',
        closeTimeout: 2000,
      }).open()
    } else {
      throw new Error('Failed to save log')
    }
  } catch (error) {
    console.error('Error saving prepupae log:', error)
    f7.dialog.alert('Error saving log. Please try again.')
  } finally {
    submitting.value = false
  }
}

const submitNeonateLog = async () => {
  submitting.value = true
  try {
    const response = await fetch('https://datalog-backend.onrender.com/api/container-logs/neonates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(neonateForm.value)
    })
    
    if (response.ok) {
      resetNeonateForm()
      await loadNeonateLogs()
      f7.toast.create({
        text: 'Neonate log saved successfully!',
        closeTimeout: 2000,
      }).open()
    } else {
      throw new Error('Failed to save log')
    }
  } catch (error) {
    console.error('Error saving neonate log:', error)
    f7.dialog.alert('Error saving log. Please try again.')
  } finally {
    submitting.value = false
  }
}

const loadPrepupaeLogs = async () => {
  try {
    const response = await fetch('https://datalog-backend.onrender.com/api/container-logs/prepupae')
    if (response.ok) {
      prepupaeLogs.value = await response.json()
    }
  } catch (error) {
    console.error('Error loading prepupae logs:', error)
  }
}

const loadNeonateLogs = async () => {
  try {
    const response = await fetch('https://datalog-backend.onrender.com/api/container-logs/neonates')
    if (response.ok) {
      neonateLogs.value = await response.json()
    }
  } catch (error) {
    console.error('Error loading neonate logs:', error)
  }
}

const resetPrepupaeForm = () => {
  prepupaeForm.value = {
    username: '',
    temperature: '',
    humidity: '',
    prepupae_tubs_added: '',
    egg_nests_replaced: '',
    notes: ''
  }
}

const resetNeonateForm = () => {
  neonateForm.value = {
    username: '',
    temperature: '',
    humidity: '',
    bait_tubs_replaced: '',
    shelf_tubs_removed: '',
    egg_nests_replaced: '',
    notes: ''
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}
</script>

<style scoped>
.button-active {
  background-color: var(--f7-theme-color) !important;
  color: white !important;
}
</style>