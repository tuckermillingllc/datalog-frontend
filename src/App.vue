<template>
  <f7-app :params="f7params">
    <!-- Left Panel with swipe enabled -->
    <f7-panel 
      left 
      reveal 
      :swipe="true"
      :swipe-active-area="50"
    >
      <f7-view>
        <f7-page>
          <f7-navbar title="DataLog" />
          <f7-list>
            <f7-list-item link="#" title="Home" @click="navigateTo('home')">
              <f7-icon slot="media" f7="house" />
            </f7-list-item>
            <f7-list-item link="#" title="Larvae Logs" @click="navigateTo('larvae')">
              <f7-icon slot="media" ios="f7:ant"/>
            </f7-list-item>
            <f7-list-item link="#" title="Container Logs" @click="navigateTo('container')">
              <f7-icon slot="media" ios="f7:cube_box"/>
            </f7-list-item>
            <f7-list-item link="#" title="Microwave Logs" @click="navigateTo('microwave')">
              <f7-icon slot="media" ios="f7:bolt"/>
            </f7-list-item>
          </f7-list>
        </f7-page>
      </f7-view>
    </f7-panel>

    <!-- Main View -->
    <f7-view main>
      <f7-page>
        <f7-navbar>
          <f7-nav-left>
            <f7-link panel-open="left" icon-f7="bars" />
          </f7-nav-left>
          <f7-nav-title>{{ getPageTitle() }}</f7-nav-title>
          <f7-nav-right>
            <!-- Empty right side -->
          </f7-nav-right>
        </f7-navbar>

        <!-- Home Page -->
      <f7-block v-if="currentPage === 'home'">
        <f7-block-title class="text-align-center">Welcome to DataLog System</f7-block-title>
        <f7-block class="text-align-center">
          <p>Select a logging system to get started</p>
        </f7-block>
          
          <f7-block>
  <div class="nav-buttons">
    <f7-button class="nav-button larvae-button" @click="navigateTo('larvae')">
      <div class="button-content">
        <h3>Larvae Logs</h3>
        <p>Track larvae feeding and development</p>
      </div>
    </f7-button>
    
    <f7-button class="nav-button container-button" @click="navigateTo('container')">
      <div class="button-content">
        <h3>Container Logs</h3>
        <p>Monitor container conditions</p>
      </div>
    </f7-button>
    
    <f7-button class="nav-button microwave-button" @click="navigateTo('microwave')">
      <div class="button-content">
        <h3>Microwave Logs</h3>
        <p>Production run tracking</p>
      </div>
    </f7-button>
  </div>
</f7-block>
          
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
        </f7-block>

        <!-- Larvae Page -->
        <f7-block v-if="currentPage === 'larvae'">
          <f7-block-title>Larvae Logs</f7-block-title>
          
          <f7-segmented raised>
            <f7-button :class="{ 'button-active': larvaeTab === 'form' }" @click="larvaeTab = 'form'">New Log</f7-button>
            <f7-button :class="{ 'button-active': larvaeTab === 'list' }" @click="larvaeTab = 'list'">View Logs</f7-button>
          </f7-segmented>
          
          <div v-if="larvaeTab === 'form'">
            <f7-list>
              <f7-list-input 
                label="Username" 
                type="text" 
                placeholder="Enter username"
                v-model:value="larvaeForm.username"
                required 
              />
              <f7-list-input 
                label="Days of Age" 
                type="number" 
                placeholder="Enter days"
                v-model:value="larvaeForm.days_of_age"
              />
              <f7-list-input 
                label="Larva Weight" 
                type="number" 
                placeholder="Enter weight"
                v-model:value="larvaeForm.larva_weight"
              />
              <f7-list-input 
                label="Larva %" 
                type="number" 
                placeholder="Enter percentage"
                v-model:value="larvaeForm.larva_pct"
              />
              <f7-list-input 
                label="lb Larvae" 
                type="number" 
                placeholder="Enter larvae weight"
                v-model:value="larvaeForm.lb_larvae"
              />
              <f7-list-input 
                label="lb Feed" 
                type="number" 
                step="0.01"
                placeholder="Enter feed weight"
                v-model:value="larvaeForm.lb_feed"
              />
              <f7-list-input 
                label="lb Water" 
                type="number" 
                step="0.01"
                placeholder="Enter water weight"
                v-model:value="larvaeForm.lb_water"
              />
              <f7-list-input 
                label="Row Number" 
                type="text" 
                placeholder="Enter row number"
                v-model:value="larvaeForm.row_number"
              />
              <f7-list-input 
                label="Notes" 
                type="textarea" 
                placeholder="Additional notes..."
                v-model:value="larvaeForm.notes"
              />
            </f7-list>
            <f7-button fill @click="submitLarvaeLog" :disabled="submitting">
              {{ submitting ? 'Saving...' : 'Save Larvae Log' }}
            </f7-button>
          </div>
          
          <div v-if="larvaeTab === 'list'">
            <f7-list v-if="larvaeLogs.length > 0">
              <f7-list-item 
                v-for="log in larvaeLogs" 
                :key="log.id"
                :title="log.username"
                :subtitle="formatDate(log.timestamp)"
                :text="`Age: ${log.days_of_age} days, Weight: ${log.larva_weight}mg`"
              >
                <f7-icon slot="media" ios="f7:doc_text"  />
              </f7-list-item>
            </f7-list>
            <f7-block v-else>
              <p class="text-align-center color-gray">No larvae logs found.</p>
            </f7-block>
          </div>
        </f7-block>

        <!-- Container Page -->
        <f7-block v-if="currentPage === 'container'">
          <f7-block-title>Container Logs</f7-block-title>
          
          <f7-segmented raised>
            <f7-button :class="{ 'button-active': containerTab === 'prepupae' }" @click="containerTab = 'prepupae'">Prepupae</f7-button>
            <f7-button :class="{ 'button-active': containerTab === 'neonates' }" @click="containerTab = 'neonates'">Neonates</f7-button>
          </f7-segmented>
          
          <!-- Prepupae Sub-tabs -->
          <div v-if="containerTab === 'prepupae'">
            <f7-segmented>
              <f7-button :class="{ 'button-active': prepupaeSubTab === 'new' }" @click="prepupaeSubTab = 'new'">New Log</f7-button>
              <f7-button :class="{ 'button-active': prepupaeSubTab === 'view' }" @click="prepupaeSubTab = 'view'">View Logs</f7-button>
            </f7-segmented>
            
            <div v-if="prepupaeSubTab === 'new'">
              <f7-list>
                <f7-list-input 
                  label="Username" 
                  type="text" 
                  placeholder="Enter username"
                  v-model:value="prepupaeForm.username"
                  required 
                />
                <f7-list-input 
                  label="Temperature (°F)" 
                  type="number" 
                  step="0.01"
                  placeholder="Enter temperature"
                  v-model:value="prepupaeForm.temperature"
                />
                <f7-list-input 
                  label="Humidity (%)" 
                  type="number" 
                  step="0.01"
                  placeholder="Enter humidity"
                  v-model:value="prepupaeForm.humidity"
                />
                <f7-list-input 
                  label="Prepupae Tubs Added" 
                  type="number" 
                  placeholder="Number of tubs"
                  v-model:value="prepupaeForm.prepupae_tubs_added"
                />
                <f7-list-input 
                  label="Egg Nests Replaced" 
                  type="number" 
                  placeholder="Number of nests"
                  v-model:value="prepupaeForm.egg_nests_replaced"
                />
                <f7-list-input 
                  label="Notes" 
                  type="textarea" 
                  placeholder="Additional notes..."
                  v-model:value="prepupaeForm.notes"
                />
              </f7-list>
              <f7-button fill @click="submitPrepupaeLog" :disabled="submitting">
                {{ submitting ? 'Saving...' : 'Save Prepupae Log' }}
              </f7-button>
            </div>
            
            <div v-if="prepupaeSubTab === 'view'">
              <f7-list v-if="prepupaeLogs.length > 0">
                <f7-list-item 
                  v-for="log in prepupaeLogs" 
                  :key="log.id"
                  :title="log.username"
                  :subtitle="formatDate(log.timestamp)"
                  :text="`Temp: ${log.temperature || 'N/A'}°F, Humidity: ${log.humidity || 'N/A'}%`"
                >
                  <f7-icon slot="media" ios="f7:doc_text"  />
                </f7-list-item>
              </f7-list>
              <f7-block v-else>
                <p class="text-align-center color-gray">No prepupae logs found.</p>
              </f7-block>
            </div>
          </div>
          
          <!-- Neonates Sub-tabs -->
          <div v-if="containerTab === 'neonates'">
            <f7-segmented>
              <f7-button :class="{ 'button-active': neonatesSubTab === 'new' }" @click="neonatesSubTab = 'new'">New Log</f7-button>
              <f7-button :class="{ 'button-active': neonatesSubTab === 'view' }" @click="neonatesSubTab = 'view'">View Logs</f7-button>
            </f7-segmented>
            
            <div v-if="neonatesSubTab === 'new'">
              <f7-list>
                <f7-list-input 
                  label="Username" 
                  type="text" 
                  placeholder="Enter username"
                  v-model:value="neonateForm.username"
                  required 
                />
                <f7-list-input 
                  label="Temperature (°F)" 
                  type="number" 
                  step="0.01"
                  placeholder="Enter temperature"
                  v-model:value="neonateForm.temperature"
                />
                <f7-list-input 
                  label="Humidity (%)" 
                  type="number" 
                  step="0.01"
                  placeholder="Enter humidity"
                  v-model:value="neonateForm.humidity"
                />
                <f7-list-input 
                  label="Bait Tubs Replaced" 
                  type="number" 
                  placeholder="Number of bait tubs"
                  v-model:value="neonateForm.bait_tubs_replaced"
                />
                <f7-list-input 
                  label="Shelf Tubs Removed" 
                  type="number" 
                  placeholder="Number of shelf tubs"
                  v-model:value="neonateForm.shelf_tubs_removed"
                />
                <f7-list-input 
                  label="Egg Nests Replaced" 
                  type="number" 
                  placeholder="Number of nests"
                  v-model:value="neonateForm.egg_nests_replaced"
                />
                <f7-list-input 
                  label="Notes" 
                  type="textarea" 
                  placeholder="Additional notes..."
                  v-model:value="neonateForm.notes"
                />
              </f7-list>
              <f7-button fill @click="submitNeonateLog" :disabled="submitting">
                {{ submitting ? 'Saving...' : 'Save Neonate Log' }}
              </f7-button>
            </div>
            
            <div v-if="neonatesSubTab === 'view'">
              <f7-list v-if="neonateLogs.length > 0">
                <f7-list-item 
                  v-for="log in neonateLogs" 
                  :key="log.id"
                  :title="log.username"
                  :subtitle="formatDate(log.timestamp)"
                  :text="`Temp: ${log.temperature || 'N/A'}°F, Bait: ${log.bait_tubs_replaced || 'N/A'}`"
                >
                  <f7-icon slot="media" ios="f7:doc_text" />
                </f7-list-item>
              </f7-list>
              <f7-block v-else>
                <p class="text-align-center color-gray">No neonate logs found.</p>
              </f7-block>
            </div>
          </div>
        </f7-block>

        <!-- Microwave Page -->
        <f7-block v-if="currentPage === 'microwave'">
          <f7-block-title>Microwave Logs</f7-block-title>
          
          <f7-segmented raised>
            <f7-button :class="{ 'button-active': microwaveTab === 'new' }" @click="microwaveTab = 'new'">New Run</f7-button>
            <f7-button :class="{ 'button-active': microwaveTab === 'view' }" @click="microwaveTab = 'view'">View Logs</f7-button>
            <f7-button :class="{ 'button-active': microwaveTab === 'update' }" @click="microwaveTab = 'update'">Update Results</f7-button>
          </f7-segmented>
          
          <div v-if="microwaveTab === 'new'">
            <f7-list>
              <f7-list-input 
                label="Username" 
                type="text" 
                placeholder="Enter username"
                v-model:value="productionForm.username"
                required 
              />
              <f7-list-input 
                label="Power Generator 1" 
                type="number" 
                step="0.01"
                placeholder="Enter power"
                v-model:value="productionForm.microwave_power_gen1"
              />
              <f7-list-input 
                label="Power Generator 2" 
                type="number" 
                step="0.01"
                placeholder="Enter power"
                v-model:value="productionForm.microwave_power_gen2"
              />
              <f7-list-input 
                label="Fan Speed Cavity 1" 
                type="number" 
                step="0.01"
                placeholder="Enter fan speed"
                v-model:value="productionForm.fan_speed_cavity1"
              />
              <f7-list-input 
                label="Fan Speed Cavity 2" 
                type="number" 
                step="0.01"
                placeholder="Enter fan speed"
                v-model:value="productionForm.fan_speed_cavity2"
              />
              <f7-list-input 
                label="Belt Speed" 
                type="number" 
                step="0.01"
                placeholder="Enter belt speed"
                v-model:value="productionForm.belt_speed"
              />
              <f7-list-input 
                label="lb Larvae per Tub" 
                type="number" 
                step="0.01"
                placeholder="Enter larvae weight per tub"
                v-model:value="productionForm.lb_larvae_per_tub"
              />
              <f7-list-input 
                label="Ramp Up Tubs" 
                type="number" 
                placeholder="Number of ramp up tubs"
                v-model:value="productionForm.num_ramp_up_tubs"
              />
              <f7-list-input 
                label="Ramp Down Tubs" 
                type="number" 
                placeholder="Number of ramp down tubs"
                v-model:value="productionForm.num_ramp_down_tubs"
              />
              <f7-list-input 
                label="Notes" 
                type="textarea" 
                placeholder="Additional notes..."
                v-model:value="productionForm.notes"
              />
            </f7-list>
            <f7-button fill @click="submitProductionRun" :disabled="submitting">
              {{ submitting ? 'Saving...' : 'Start Production Run' }}
            </f7-button>
          </div>
          
          <div v-if="microwaveTab === 'update'">
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

              <f7-button fill @click="updateProductionRun" :disabled="submitting">
                {{ submitting ? 'Updating...' : 'Update Results' }}
              </f7-button>
            </div>
          </div>
          
          <div v-if="microwaveTab === 'view'">
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
                <f7-icon slot="media" ios="f7:bolt"  />
              </f7-list-item>
            </f7-list>
            <f7-block v-else>
              <p class="text-align-center color-gray">No production logs found.</p>
            </f7-block>
          </div>
        </f7-block>
      </f7-page>
    </f7-view>
  </f7-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { f7 } from 'framework7-vue'

// Navigation state
const currentPage = ref('home')
const larvaeTab = ref('form')
const containerTab = ref('prepupae')
const prepupaeSubTab = ref('new')
const neonatesSubTab = ref('new')
const microwaveTab = ref('new')

// Form state
const submitting = ref(false)
const selectedRunId = ref('')

// Stats
const totalLogs = ref('---')
const todayLogs = ref('---')

// Form data
const larvaeForm = ref({
  username: '',
  days_of_age: '',
  larva_weight: '',
  larva_pct: '',
  lb_larvae: '',
  lb_feed: '',
  lb_water: '',
  row_number: '',
  notes: ''
})

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

// Data arrays
const larvaeLogs = ref([])
const prepupaeLogs = ref([])
const neonateLogs = ref([])
const microwaveLogs = ref([])
const selectedRun = ref(null)

// Framework7 configuration
const f7params = {
  name: 'DataLog',
  theme: 'auto',
  // Enable touch/swipe features
  touch: {
    fastClicks: true,
    tapHold: true,
    tapHoldDelay: 250,
    iosTouchRipple: false
  },
  // Panel settings for iOS swipe
  panel: {
    swipe: true,
    swipeActiveArea: 50,
    swipeCloseOpposite: true
  }
}

// Computed properties
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

// Lifecycle
onMounted(() => {
  loadAllData()
})

// Methods
const navigateTo = (page) => {
  currentPage.value = page
  f7.panel.close()
}

const getPageTitle = () => {
  const titles = {
    home: 'DataLog System',
    larvae: 'Larvae Logs',
    container: 'Container Logs',
    microwave: 'Microwave Logs'
  }
  return titles[currentPage.value] || 'DataLog'
}

const loadAllData = async () => {
  await Promise.all([
    loadLarvaeLogs(),
    loadPrepupaeLogs(),
    loadNeonateLogs(),
    loadMicrowaveLogs(),
    loadQuickStats()
  ])
}

const loadQuickStats = async () => {
  try {
    totalLogs.value = '---'
    todayLogs.value = '---'
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

// Larvae methods
const submitLarvaeLog = async () => {
  submitting.value = true
  try {
    const response = await fetch('https://datalog-backend.onrender.com/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(larvaeForm.value)
    })
    
    if (response.ok) {
      resetLarvaeForm()
      await loadLarvaeLogs()
      f7.toast.create({
        text: 'Larvae log saved successfully!',
        closeTimeout: 2000,
      }).open()
    } else {
      throw new Error('Failed to save log')
    }
  } catch (error) {
    console.error('Error saving larvae log:', error)
    f7.dialog.alert('Error saving log. Please try again.')
  } finally {
    submitting.value = false
  }
}

const loadLarvaeLogs = async () => {
  try {
    const response = await fetch('https://datalog-backend.onrender.com/api/logs')
    if (response.ok) {
      larvaeLogs.value = await response.json()
    }
  } catch (error) {
    console.error('Error loading larvae logs:', error)
  }
}

const resetLarvaeForm = () => {
  larvaeForm.value = {
    username: '',
    days_of_age: '',
    larva_weight: '',
    larva_pct: '',
    lb_larvae: '',
    lb_feed: '',
    lb_water: '',
    row_number: '',
    notes: ''
  }
}

// Container methods
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

// Microwave methods
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

// Utility methods
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

<style>
:root {
  --f7-theme-color: #42b883;
  --f7-theme-color-rgb: 66, 184, 131;
  
  /* iOS status bar color matching */
  --f7-bars-bg-color: #f7f7f8;
  --f7-bars-bg-color-rgb: 247, 247, 248;
  --f7-navbar-bg-color: #f7f7f8;
  --f7-navbar-bg-color-rgb: 247, 247, 248;
}

/* iOS status bar styling */
.ios .navbar {
  background: var(--f7-navbar-bg-color);
}

/* Add status bar meta tag support */
.framework7-root {
  background: var(--f7-bars-bg-color);
}

.button-active {
  background-color: var(--f7-theme-color) !important;
  color: white !important;
}

.nav-icon {
  font-size: 2rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #f8f9fa;
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

.nav-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.nav-button {
  width: 100%;
  height: auto;
  min-height: 80px;
  border-radius: 12px;
  border: none;
  padding: 0;
  display: block;
}

.button-content {
  padding: 1rem;
  text-align: left;
  width: 100%;
}

.button-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
}

.button-content p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
  color: white;
}

.larvae-button {
  background: linear-gradient(135deg, #4CAF50, #8BC34A) !important;
}

.container-button {
  background: linear-gradient(135deg, #2196F3, #03A9F4) !important;
}

.microwave-button {
  background: linear-gradient(135deg, #FF9800, #FFC107) !important;
}
</style>
