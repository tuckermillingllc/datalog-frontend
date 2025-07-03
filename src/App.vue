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
          <f7-navbar title="BSFL Logger" />
          <f7-list menu-list>
            <f7-list-item 
              link="#" 
              title="Home" 
              @click="navigateTo('home')"
              :class="{ 'item-selected': currentPage === 'home' }"
            >
              <f7-icon slot="media" f7="house" />
            </f7-list-item>
            <f7-list-item 
              link="#" 
              title="Larvae Logs" 
              @click="navigateTo('larvae')"
              :class="{ 'item-selected larvae-selected': currentPage === 'larvae' }"
            >
              <f7-icon slot="media" ios="f7:ant"/>
            </f7-list-item>
            <f7-list-item 
              link="#" 
              title="Prepupae Logs" 
              @click="navigateTo('prepupae')"
              :class="{ 'item-selected prepupae-selected': currentPage === 'prepupae' }"
            >
              <f7-icon slot="media" ios="f7:cube_box"/>
            </f7-list-item>
            <f7-list-item 
              link="#" 
              title="Neonate Logs" 
              @click="navigateTo('neonates')"
              :class="{ 'item-selected neonate-selected': currentPage === 'neonates' }"
            >
              <f7-icon slot="media" ios="f7:circle_grid_3x3"/>
            </f7-list-item>
            <f7-list-item 
              link="#" 
              title="Microwave Logs" 
              @click="navigateTo('microwave')"
              :class="{ 'item-selected microwave-selected': currentPage === 'microwave' }"
            >
              <f7-icon slot="media" ios="f7:bolt"/>
            </f7-list-item>
          </f7-list>
        </f7-page>
      </f7-view>
    </f7-panel>

    <!-- Main View -->
    <f7-view main>
      <f7-page :class="getPageClass()">
        <f7-navbar :class="getNavbarClass()">
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
          <f7-block>
            <div class="nav-buttons">
              <f7-button class="nav-button larvae-button" @click="navigateTo('larvae')">
                <div class="button-content">
                  <h3>Larvae Logs</h3>
                  <p>Track larvae feeding and development</p>
                </div>
              </f7-button>
              
              <f7-button class="nav-button prepupae-button" @click="navigateTo('prepupae')">
                <div class="button-content">
                  <h3>Prepupae Logs</h3>
                  <p>Monitor prepupae container conditions</p>
                </div>
              </f7-button>
              
              <f7-button class="nav-button neonate-button" @click="navigateTo('neonates')">
                <div class="button-content">
                  <h3>Neonate Logs</h3>
                  <p>Track neonate container management</p>
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
                    <div class="stat-number">{{ runningRuns }}</div>
                    <div class="stat-label">Active Runs</div>
                  </f7-card-content>
                </f7-card>
              </f7-col>
            </f7-row>
          </f7-block>
        </f7-block>

        <!-- Larvae Page -->
        <f7-block v-if="currentPage === 'larvae'" class="larvae-theme">
          <f7-block-title>Larvae Logs</f7-block-title>
          
          <f7-segmented raised class="larvae-segmented">
            <f7-button :class="{ 'button-active larvae-active': larvaeTab === 'form' }" @click="larvaeTab = 'form'">New Log</f7-button>
            <f7-button :class="{ 'button-active larvae-active': larvaeTab === 'list' }" @click="larvaeTab = 'list'">View Logs</f7-button>
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
            <f7-button fill class="larvae-button-fill" @click="submitLarvaeLog" :disabled="submitting">
              {{ submitting ? 'Saving...' : 'Save Larvae Log' }}
            </f7-button>
          </div>
          
          <div v-if="larvaeTab === 'list'">
            <div v-if="larvaeLogs.length > 0">
              <f7-card v-for="log in larvaeLogs" :key="log.id" class="log-card">
                <f7-card-header>
                  <div class="card-header-content">
                    <div class="user-info">{{ log.username }}</div>
                    <div class="log-date">{{ formatDate(log.timestamp) }}</div>
                  </div>
                </f7-card-header>
                <f7-card-content>
                  <f7-row>
                    <f7-col width="50">
                      <div class="log-field">
                        <span class="field-label">Age:</span>
                        <span class="field-value">{{ log.days_of_age || 'N/A' }} days</span>
                      </div>
                      <div class="log-field">
                        <span class="field-label">Weight:</span>
                        <span class="field-value">{{ log.larva_weight || 'N/A' }} mg</span>
                      </div>
                      <div class="log-field">
                        <span class="field-label">lb Feed:</span>
                        <span class="field-value">{{ log.lb_feed || 'N/A' }}</span>
                      </div>
                      <div v-if="log.row_number" class="log-field">
                        <span class="field-label">Row:</span>
                        <span class="field-value">{{ log.row_number }}</span>
                      </div>
                    </f7-col>
                    <f7-col width="50">
                      <div class="log-field">
                        <span class="field-label">Larva %:</span>
                        <span class="field-value">{{ log.larva_pct || 'N/A' }}%</span>
                      </div>
                      <div class="log-field">
                        <span class="field-label">lb Larvae:</span>
                        <span class="field-value">{{ log.lb_larvae || 'N/A' }}</span>
                      </div>
                      <div class="log-field">
                        <span class="field-label">lb Water:</span>
                        <span class="field-value">{{ log.lb_water || 'N/A' }}</span>
                      </div>
                    </f7-col>
                  </f7-row>
                </f7-card-content>
              </f7-card>
            </div>
            <f7-block v-else>
              <p class="text-align-center color-gray">No larvae logs found.</p>
            </f7-block>
          </div>
        </f7-block>

        <!-- Prepupae Page -->
        <f7-block v-if="currentPage === 'prepupae'" class="prepupae-theme">
          <f7-block-title>Prepupae Logs</f7-block-title>
          
          <f7-segmented raised class="prepupae-segmented">
            <f7-button :class="{ 'button-active prepupae-active': prepupaeTab === 'form' }" @click="prepupaeTab = 'form'">New Log</f7-button>
            <f7-button :class="{ 'button-active prepupae-active': prepupaeTab === 'list' }" @click="prepupaeTab = 'list'">View Logs</f7-button>
          </f7-segmented>
          
          <div v-if="prepupaeTab === 'form'">
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
            <f7-button fill class="prepupae-button-fill" @click="submitPrepupaeLog" :disabled="submitting">
              {{ submitting ? 'Saving...' : 'Save Prepupae Log' }}
            </f7-button>
          </div>
          
          <div v-if="prepupaeTab === 'list'">
            <div v-if="prepupaeLogs.length > 0">
              <f7-card v-for="log in prepupaeLogs" :key="log.id" class="log-card">
                <f7-card-header>
                  <div class="card-header-content">
                    <div class="user-info">{{ log.username }}</div>
                    <div class="log-date">{{ formatDate(log.timestamp) }}</div>
                  </div>
                </f7-card-header>
                <f7-card-content>
                  <f7-row>
                    <f7-col width="50">
                      <div class="log-field">
                        <span class="field-label">Temperature:</span>
                        <span class="field-value">{{ log.temperature || 'N/A' }}°F</span>
                      </div>
                      <div class="log-field">
                        <span class="field-label">Tubs Added:</span>
                        <span class="field-value">{{ log.prepupae_tubs_added || 'N/A' }}</span>
                      </div>
                    </f7-col>
                    <f7-col width="50">
                      <div class="log-field">
                        <span class="field-label">Humidity:</span>
                        <span class="field-value">{{ log.humidity || 'N/A' }}%</span>
                      </div>
                      <div class="log-field">
                        <span class="field-label">Nests Replaced:</span>
                        <span class="field-value">{{ log.egg_nests_replaced || 'N/A' }}</span>
                      </div>
                    </f7-col>
                  </f7-row>
                </f7-card-content>
              </f7-card>
            </div>
            <f7-block v-else>
              <p class="text-align-center color-gray">No prepupae logs found.</p>
            </f7-block>
          </div>
        </f7-block>

        <!-- Neonates Page -->
        <f7-block v-if="currentPage === 'neonates'" class="neonate-theme">
          <f7-block-title>Neonate Logs</f7-block-title>
          
          <f7-segmented raised class="neonate-segmented">
            <f7-button :class="{ 'button-active neonate-active': neonateTab === 'form' }" @click="neonateTab = 'form'">New Log</f7-button>
            <f7-button :class="{ 'button-active neonate-active': neonateTab === 'list' }" @click="neonateTab = 'list'">View Logs</f7-button>
          </f7-segmented>
          
          <div v-if="neonateTab === 'form'">
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
            <f7-button fill class="neonate-button-fill" @click="submitNeonateLog" :disabled="submitting">
              {{ submitting ? 'Saving...' : 'Save Neonate Log' }}
            </f7-button>
          </div>
          
          <div v-if="neonateTab === 'list'">
            <div v-if="neonateLogs.length > 0">
              <f7-card v-for="log in neonateLogs" :key="log.id" class="log-card">
                <f7-card-header>
                  <div class="card-header-content">
                    <div class="user-info">{{ log.username }}</div>
                    <div class="log-date">{{ formatDate(log.timestamp) }}</div>
                  </div>
                </f7-card-header>
                <f7-card-content>
                  <f7-row>
                    <f7-col width="50">
                      <div class="log-field">
                        <span class="field-label">Temperature:</span>
                        <span class="field-value">{{ log.temperature || 'N/A' }}°F</span>
                      </div>
                      <div class="log-field">
                        <span class="field-label">Bait Tubs:</span>
                        <span class="field-value">{{ log.bait_tubs_replaced || 'N/A' }}</span>
                      </div>
                      <div class="log-field">
                        <span class="field-label">Nests Replaced:</span>
                        <span class="field-value">{{ log.egg_nests_replaced || 'N/A' }}</span>
                      </div>
                    </f7-col>
                    <f7-col width="50">
                      <div class="log-field">
                        <span class="field-label">Humidity:</span>
                        <span class="field-value">{{ log.humidity || 'N/A' }}%</span>
                      </div>
                      <div class="log-field">
                        <span class="field-label">Shelf Tubs:</span>
                        <span class="field-value">{{ log.shelf_tubs_removed || 'N/A' }}</span>
                      </div>
                    </f7-col>
                  </f7-row>
                </f7-card-content>
              </f7-card>
            </div>
            <f7-block v-else>
              <p class="text-align-center color-gray">No neonate logs found.</p>
            </f7-block>
          </div>
        </f7-block>

        <!-- Microwave Page -->
        <f7-block v-if="currentPage === 'microwave'" class="microwave-theme">
          <f7-block-title>Microwave Logs</f7-block-title>
          
          <f7-segmented raised class="microwave-segmented">
            <f7-button :class="{ 'button-active microwave-active': microwaveTab === 'new' }" @click="microwaveTab = 'new'">New Run</f7-button>
            <f7-button :class="{ 'button-active microwave-active': microwaveTab === 'view' }" @click="microwaveTab = 'view'">View Logs</f7-button>
            <f7-button :class="{ 'button-active microwave-active': microwaveTab === 'update' }" @click="microwaveTab = 'update'">Update Results</f7-button>
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
            <f7-button fill class="microwave-button-fill" @click="submitProductionRun" :disabled="submitting">
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
                  <f7-card-content class="yield-card microwave-yield">
                    <h3>Calculated Yield: {{ calculatedYield }}%</h3>
                  </f7-card-content>
                </f7-card>
              </f7-block>

              <f7-button fill class="microwave-button-fill" @click="updateProductionRun" :disabled="submitting">
                {{ submitting ? 'Updating...' : 'Update Results' }}
              </f7-button>
            </div>
          </div>
          
          <div v-if="microwaveTab === 'view'">
            <div v-if="microwaveLogs.length > 0">
              <f7-card v-for="log in microwaveLogs" :key="log.id" class="log-card">
                <f7-card-header>
                  <div class="card-header-content">
                    <div class="user-info">{{ log.username }}</div>
                    <f7-badge :color="getStatusColor(log)">{{ getStatus(log) }}</f7-badge>
                  </div>
                  <div class="log-date">{{ formatDate(log.timestamp) }}</div>
                </f7-card-header>
                <f7-card-content>
                  <f7-row>
                    <f7-col width="50">
                      <div class="log-field">
                        <span class="field-label">Power Gen 1:</span>
                        <span class="field-value">{{ log.microwave_power_gen1 || 'N/A' }}</span>
                      </div>
                      <div class="log-field">
                        <span class="field-label">Fan Cavity 1:</span>
                        <span class="field-value">{{ log.fan_speed_cavity1 || 'N/A' }}</span>
                      </div>
                      <div class="log-field">
                        <span class="field-label">Ramp Up:</span>
                        <span class="field-value">{{ log.num_ramp_up_tubs || 'N/A' }}</span>
                      </div>
                    </f7-col>
                    <f7-col width="50">
                      <div class="log-field">
                        <span class="field-label">Power Gen 2:</span>
                        <span class="field-value">{{ log.microwave_power_gen2 || 'N/A' }}</span>
                      </div>
                      <div class="log-field">
                        <span class="field-label">Belt Speed:</span>
                        <span class="field-value">{{ log.belt_speed || 'N/A' }}</span>
                      </div>
                      <div class="log-field">
                        <span class="field-label">Ramp Down:</span>
                        <span class="field-value">{{ log.num_ramp_down_tubs || 'N/A' }}</span>
                      </div>
                    </f7-col>
                  </f7-row>
                  <div v-if="log.yield_percentage" class="yield-info">
                    <span class="field-label">Yield:</span>
                    <span class="field-value yield-value">{{ log.yield_percentage.toFixed(1) }}%</span>
                  </div>
                </f7-card-content>
              </f7-card>
            </div>
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
import { ref, computed, onMounted, watch } from 'vue'
import { f7 } from 'framework7-vue'

// Navigation state
const currentPage = ref('home')
const larvaeTab = ref('form')
const prepupaeTab = ref('form')
const neonateTab = ref('form')
const microwaveTab = ref('new')

// Form state
const submitting = ref(false)
const selectedRunId = ref('')

// Stats
const totalLogs = ref('---')
const todayLogs = ref('---')
const runningRuns = ref('---')

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
  name: 'BSFL Logger',
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
  },
  // Theme configuration
  colors: {
    primary: '#42b883'
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

onMounted(() => {
  loadAllData()
  
  // Apply dynamic theming after F7 initialization
  setTimeout(() => {
    applyPageTheme()
  }, 100)
  
  // Add haptic feedback
  f7.ready(() => {
    // Panel haptic feedback
    f7.panel.on('open', function(panel) {
      f7.device.haptic('light')
    })
    
    f7.panel.on('close', function(panel) {
      f7.device.haptic('selection')
    })
    
    // Optional: haptic during swipe
    f7.panel.on('swipe', function(panel) {
      f7.device.haptic('selection')
    })
  })
})

// Watch for page changes to update theme
const currentPageWatcher = computed(() => currentPage.value)
watch(currentPageWatcher, () => {
  setTimeout(() => {
    applyPageTheme()
  }, 50)
})

// Dynamic theme application
const applyPageTheme = () => {
  const root = document.documentElement
  const body = document.body
  
  // Remove existing theme classes
  body.classList.remove('larvae-theme-active', 'prepupae-theme-active', 'neonate-theme-active', 'microwave-theme-active')
  
  // Apply theme based on current page
  switch(currentPage.value) {
    case 'larvae':
      body.classList.add('larvae-theme-active')
      root.style.setProperty('--f7-navbar-bg-color', '#4CAF50')
      root.style.setProperty('--f7-bars-bg-color', '#4CAF50')
      break
    case 'prepupae':
      body.classList.add('prepupae-theme-active')
      root.style.setProperty('--f7-navbar-bg-color', '#2196F3')
      root.style.setProperty('--f7-bars-bg-color', '#2196F3')
      break
    case 'neonates':
      body.classList.add('neonate-theme-active')
      root.style.setProperty('--f7-navbar-bg-color', '#9C27B0')
      root.style.setProperty('--f7-bars-bg-color', '#9C27B0')
      break
    case 'microwave':
      body.classList.add('microwave-theme-active')
      root.style.setProperty('--f7-navbar-bg-color', '#FF9800')
      root.style.setProperty('--f7-bars-bg-color', '#FF9800')
      break
    default:
      root.style.setProperty('--f7-navbar-bg-color', '#f7f7f8')
      root.style.setProperty('--f7-bars-bg-color', '#f7f7f8')
  }
}

// Methods
const navigateTo = (page) => {
  currentPage.value = page
  f7.panel.close()
}

const getPageTitle = () => {
  const titles = {
    home: 'Tucker BSFL Logger',
    larvae: 'Larvae Logs',
    prepupae: 'Prepupae Logs',
    neonates: 'Neonate Logs',
    microwave: 'Microwave Logs'
  }
  return titles[currentPage.value] || 'BSFL Logger'
}

const getPageClass = () => {
  const classes = {
    larvae: 'larvae-page',
    prepupae: 'prepupae-page',
    neonates: 'neonate-page',
    microwave: 'microwave-page'
  }
  return classes[currentPage.value] || ''
}

const getNavbarClass = () => {
  const classes = {
    larvae: 'larvae-navbar',
    prepupae: 'prepupae-navbar',
    neonates: 'neonate-navbar',
    microwave: 'microwave-navbar'
  }
  return classes[currentPage.value] || ''
}

const loadAllData = async () => {
  await Promise.all([
    loadLarvaeLogs(),
    loadPrepupaeLogs(),
    loadNeonateLogs(),
    loadMicrowaveLogs()
  ])
	await loadQuickStats()
}

const loadQuickStats = async () => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0]
    
    // Count total logs across all systems
    let total = 0
    let todayCount = 0
    
    // Count larvae logs
    if (larvaeLogs.value.length > 0) {
      total += larvaeLogs.value.length
      todayCount += larvaeLogs.value.filter(log => 
        log.timestamp && log.timestamp.startsWith(today)
      ).length
    }
    
    // Count prepupae logs
    if (prepupaeLogs.value.length > 0) {
      total += prepupaeLogs.value.length
      todayCount += prepupaeLogs.value.filter(log => 
        log.timestamp && log.timestamp.startsWith(today)
      ).length
    }
    
    // Count neonate logs
    if (neonateLogs.value.length > 0) {
      total += neonateLogs.value.length
      todayCount += neonateLogs.value.filter(log => 
        log.timestamp && log.timestamp.startsWith(today)
      ).length
    }
    
    // Count microwave logs
    if (microwaveLogs.value.length > 0) {
      total += microwaveLogs.value.length
      todayCount += microwaveLogs.value.filter(log => 
        log.timestamp && log.timestamp.startsWith(today)
      ).length
    }
    
    // Update stats
    totalLogs.value = total
    todayLogs.value = todayCount
    runningRuns.value = incompleteRuns.value.length
    
  } catch (error) {
    console.error('Error loading stats:', error)
    totalLogs.value = 0
    todayLogs.value = 0
    runningRuns.value = 0
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

// Prepupae methods
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

// Neonate methods
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
      runningRuns.value = incompleteRuns.value.length
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
  
  /* Color scheme definitions */
  --larvae-color: #4CAF50;
  --larvae-color-light: #8BC34A;
  --larvae-color-rgb: 76, 175, 80;
  
  --prepupae-color: #2196F3;
  --prepupae-color-light: #03A9F4;
  --prepupae-color-rgb: 33, 150, 243;
  
  --neonate-color: #9C27B0;
  --neonate-color-light: #E91E63;
  --neonate-color-rgb: 156, 39, 176;
  
  --microwave-color: #FF9800;
  --microwave-color-light: #FFC107;
  --microwave-color-rgb: 255, 152, 0;
  
  /* iOS status bar color matching */
  --f7-bars-bg-color: #f7f7f8;
  --f7-bars-bg-color-rgb: 247, 247, 248;
  --f7-navbar-bg-color: #f7f7f8;
  --f7-navbar-bg-color-rgb: 247, 247, 248;
}

/* Page-specific themes - includes status bar */
.larvae-page {
  --f7-theme-color: var(--larvae-color);
  --f7-theme-color-rgb: var(--larvae-color-rgb);
  --f7-bars-bg-color: var(--larvae-color);
  --f7-navbar-bg-color: var(--larvae-color);
}

.prepupae-page {
  --f7-theme-color: var(--prepupae-color);
  --f7-theme-color-rgb: var(--prepupae-color-rgb);
  --f7-bars-bg-color: var(--prepupae-color);
  --f7-navbar-bg-color: var(--prepupae-color);
}

.neonate-page {
  --f7-theme-color: var(--neonate-color);
  --f7-theme-color-rgb: var(--neonate-color-rgb);
  --f7-bars-bg-color: var(--neonate-color);
  --f7-navbar-bg-color: var(--neonate-color);
}

.microwave-page {
  --f7-theme-color: var(--microwave-color);
  --f7-theme-color-rgb: var(--microwave-color-rgb);
  --f7-bars-bg-color: var(--microwave-color);
  --f7-navbar-bg-color: var(--microwave-color);
}

/* Aggressive theming overrides using CSS custom properties and body classes */
body.larvae-theme-active {
  --f7-navbar-bg-color: #4CAF50 !important;
  --f7-bars-bg-color: #4CAF50 !important;
  --f7-navbar-text-color: #ffffff !important;
  --f7-navbar-link-color: #ffffff !important;
}

body.prepupae-theme-active {
  --f7-navbar-bg-color: #2196F3 !important;
  --f7-bars-bg-color: #2196F3 !important;
  --f7-navbar-text-color: #ffffff !important;
  --f7-navbar-link-color: #ffffff !important;
}

body.neonate-theme-active {
  --f7-navbar-bg-color: #9C27B0 !important;
  --f7-bars-bg-color: #9C27B0 !important;
  --f7-navbar-text-color: #ffffff !important;
  --f7-navbar-link-color: #ffffff !important;
}

body.microwave-theme-active {
  --f7-navbar-bg-color: #FF9800 !important;
  --f7-bars-bg-color: #FF9800 !important;
  --f7-navbar-text-color: #ffffff !important;
  --f7-navbar-link-color: #ffffff !important;
}

/* Force navbar styling with highest specificity */
body.larvae-theme-active .navbar,
body.larvae-theme-active .navbar-bg,
body.larvae-theme-active .navbar-inner {
  background: #4CAF50 !important;
  background-color: #4CAF50 !important;
  color: white !important;
}

body.prepupae-theme-active .navbar,
body.prepupae-theme-active .navbar-bg,
body.prepupae-theme-active .navbar-inner {
  background: #2196F3 !important;
  background-color: #2196F3 !important;
  color: white !important;
}

body.neonate-theme-active .navbar,
body.neonate-theme-active .navbar-bg,
body.neonate-theme-active .navbar-inner {
  background: #9C27B0 !important;
  background-color: #9C27B0 !important;
  color: white !important;
}

body.microwave-theme-active .navbar,
body.microwave-theme-active .navbar-bg,
body.microwave-theme-active .navbar-inner {
  background: #FF9800 !important;
  background-color: #FF9800 !important;
  color: white !important;
}

/* Text color overrides */
body.larvae-theme-active .navbar .link,
body.larvae-theme-active .navbar .nav-title,
body.prepupae-theme-active .navbar .link,
body.prepupae-theme-active .navbar .nav-title,
body.neonate-theme-active .navbar .link,
body.neonate-theme-active .navbar .nav-title,
body.microwave-theme-active .navbar .link,
body.microwave-theme-active .navbar .nav-title {
  color: white !important;
}

/* iOS status bar override */
body.larvae-theme-active .framework7-root {
  background: #4CAF50 !important;
}

body.prepupae-theme-active .framework7-root {
  background: #2196F3 !important;
}

body.neonate-theme-active .framework7-root {
  background: #9C27B0 !important;
}

body.microwave-theme-active .framework7-root {
  background: #FF9800 !important;
}

.button-active {
  background-color: var(--f7-theme-color) !important;
  color: white !important;
}

/* Segmented control theming */
.larvae-active {
  background-color: var(--larvae-color) !important;
  color: white !important;
}

.prepupae-active {
  background-color: var(--prepupae-color) !important;
  color: white !important;
}

.neonate-active {
  background-color: var(--neonate-color) !important;
  color: white !important;
}

.microwave-active {
  background-color: var(--microwave-color) !important;
  color: white !important;
}

.larvae-segmented .segmented .button.button-active,
.prepupae-segmented .segmented .button.button-active,
.neonate-segmented .segmented .button.button-active,
.microwave-segmented .segmented .button.button-active {
  color: white !important;
}

/* Button theming */
.larvae-button-fill {
  background: linear-gradient(135deg, var(--larvae-color), var(--larvae-color-light)) !important;
  color: white !important;
}

.prepupae-button-fill {
  background: linear-gradient(135deg, var(--prepupae-color), var(--prepupae-color-light)) !important;
  color: white !important;
}

.neonate-button-fill {
  background: linear-gradient(135deg, var(--neonate-color), var(--neonate-color-light)) !important;
  color: white !important;
}

.microwave-button-fill {
  background: linear-gradient(135deg, var(--microwave-color), var(--microwave-color-light)) !important;
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

.microwave-yield {
  background: linear-gradient(135deg, var(--microwave-color), var(--microwave-color-light)) !important;
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
  background: linear-gradient(135deg, var(--larvae-color), var(--larvae-color-light)) !important;
}

.prepupae-button {
  background: linear-gradient(135deg, var(--prepupae-color), var(--prepupae-color-light)) !important;
}

.neonate-button {
  background: linear-gradient(135deg, var(--neonate-color), var(--neonate-color-light)) !important;
}

.microwave-button {
  background: linear-gradient(135deg, var(--microwave-color), var(--microwave-color-light)) !important;
}

/* Theme-specific backgrounds */
.larvae-theme {
  background: rgba(76, 175, 80, 0.05);
  border-radius: 12px;
  margin: 0.5rem;
}

.prepupae-theme {
  background: rgba(33, 150, 243, 0.05);
  border-radius: 12px;
  margin: 0.5rem;
}

.neonate-theme {
  background: rgba(156, 39, 176, 0.05);
  border-radius: 12px;
  margin: 0.5rem;
}

.microwave-theme {
  background: rgba(255, 152, 0, 0.05);
  border-radius: 12px;
  margin: 0.5rem;
}

/* Mobile-friendly log cards */
.log-card {
  margin-bottom: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.user-info {
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
}

.log-date {
  font-size: 0.9rem;
  color: #666;
  text-align: right;
}

.log-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.log-field:last-child {
  border-bottom: none;
}

.field-label {
  font-weight: 500;
  color: #666;
  font-size: 0.9rem;
}

.field-value {
  font-weight: 600;
  color: #333;
  text-align: right;
}

.yield-info {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.yield-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #4CAF50;
}

/* Add space above first button on home page */
.nav-buttons {
  margin-top: 3rem !important;
  padding-top: 2rem !important;
}

</style>