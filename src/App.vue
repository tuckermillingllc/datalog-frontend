<template>
  <f7-app :params="f7params">
    <!-- Main View -->
    <f7-view main>
      <f7-page :class="getPageClass()">
        <f7-navbar :class="getNavbarClass()">
          <f7-nav-left>
            <f7-link @click="showUserSelector" class="user-button">
              <f7-icon f7="person_circle" size="24px"></f7-icon>
            </f7-link>
          </f7-nav-left>
          <f7-nav-title>{{ getPageTitle() }}</f7-nav-title>
          <f7-nav-right>
            <span class="current-user">{{ currentUser || 'No User' }}</span>
          </f7-nav-right>
        </f7-navbar>

        <!-- Home Page -->
        <f7-block v-if="currentPage === 'home'">
          <div style="height: 20px;"></div>
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
        <f7-block v-if="currentPage === 'larvae'">
          <f7-segmented raised class="larvae-segmented">
            <f7-button :class="{ 'button-active larvae-active': larvaeTab === 'form' }" @click="larvaeTab = 'form'">New Log</f7-button>
            <f7-button :class="{ 'button-active larvae-active': larvaeTab === 'list' }" @click="larvaeTab = 'list'">View Logs</f7-button>
            <f7-button :class="{ 'button-active larvae-active': larvaeTab === 'update' }" @click="larvaeTab = 'update'">Update Results</f7-button>
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
                    <f7-badge :color="getLarvaeStatusColor(log)">{{ getLarvaeStatus(log) }}</f7-badge>
                  </div>
                  <div class="log-date">{{ formatDate(log.timestamp) }}</div>
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
                      <div class="log-field">
                        <span class="field-label">lb Water:</span>
                        <span class="field-value">{{ log.lb_water || 'N/A' }}</span>
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
                        <span class="field-label">Larvae Count:</span>
                        <span class="field-value">{{ log.larvae_count ? log.larvae_count.toLocaleString() : 'N/A' }}</span>
                      </div>
                      <div class="log-field">
                        <span class="field-label">Feed/Larvae:</span>
                        <span class="field-value">{{ log.feed_per_larvae || 'N/A' }}</span>
                      </div>
                      <div class="log-field">
                        <span class="field-label">Water/Feed Ratio:</span>
                        <span class="field-value">{{ log.water_feed_ratio || 'N/A' }}</span>
                      </div>
                    </f7-col>
                  </f7-row>
                  <div v-if="log.post_feed_condition" class="condition-info">
                    <span class="field-label">Post Feed Condition:</span>
                    <span class="field-value condition-value">{{ log.post_feed_condition }}</span>
                  </div>
                </f7-card-content>
              </f7-card>
            </div>
            <f7-block v-else>
              <p class="text-align-center color-gray">No larvae logs found.</p>
            </f7-block>
          </div>

          <div v-if="larvaeTab === 'update'">
            <f7-list v-if="incompleteLarvaeRuns.length > 0">
              <f7-list-input
                label="Select Larvae Run"
                type="select"
                v-model:value="selectedLarvaeRunId"
                @change="loadSelectedLarvaeRun"
              >
                <option value="">Select a run...</option>
                <option 
                  v-for="log in incompleteLarvaeRuns" 
                  :key="log.id" 
                  :value="log.id"
                >
                  {{ formatDate(log.timestamp) }} - {{ log.username }}
                </option>
              </f7-list-input>
            </f7-list>

            <f7-block v-else>
              <p class="text-align-center color-gray">No incomplete larvae runs found.</p>
            </f7-block>

            <div v-if="selectedLarvaeRunId">
              <f7-list>
                <f7-list-input
                  label="Post Feed Condition"
                  type="select"
                  v-model:value="larvaeUpdateForm.post_feed_condition"
                  placeholder="Select condition"
                  required
                >
                  <option value="">Select condition...</option>
                  <option value="No Feed/Dry Frass">No Feed/Dry Frass</option>
                  <option value="No Feed/Wet Frass">No Feed/Wet Frass</option>
                  <option value="Feed Left/Dry Frass">Feed Left/Dry Frass</option>
                  <option value="Feed Left/Wet Frass">Feed Left/Wet Frass</option>
                </f7-list-input>
                <f7-list-input
                  label="Additional Notes"
                  type="textarea"
                  v-model:value="larvaeUpdateForm.update_notes"
                  placeholder="Additional notes..."
                />
              </f7-list>

              <f7-button fill class="larvae-button-fill" @click="updateLarvaeRun" :disabled="submitting">
                {{ submitting ? 'Updating...' : 'Update Results' }}
              </f7-button>
            </div>
          </div>
        </f7-block>

        <!-- Prepupae Page -->
        <f7-block v-if="currentPage === 'prepupae'">
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
        <f7-block v-if="currentPage === 'neonates'">
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
        <f7-block v-if="currentPage === 'microwave'">
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
                type="text"
                readonly
                class="belt-speed-input"
              >
                <template v-slot:input>
                  <div class="belt-speed-stepper">
                    <button class="stepper-btn" @click="decrementBeltSpeed" :disabled="parseFloat(productionForm.belt_speed) <= 0">−</button>
                    <input 
                      type="number" 
                      class="belt-speed-value" 
                      :value="productionForm.belt_speed" 
                      @input="(e) => productionForm.belt_speed = e.target.value"
                      step="0.5" 
                      min="0" 
                      max="100"
                    >
                    <span class="belt-speed-unit">cm/min</span>
                    <button class="stepper-btn" @click="incrementBeltSpeed" :disabled="parseFloat(productionForm.belt_speed) >= 100">+</button>
                  </div>
                </template>
              </f7-list-input>
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

        <!-- Bottom padding to prevent content from being hidden behind tabs -->
        <div class="bottom-tab-spacer"></div>
      </f7-page>
    </f7-view>

    <!-- Bottom Tab Navigation -->
    <div class="bottom-tabs" :class="getBottomTabsClass()">
      <div 
        class="tab-item" 
        :class="{ 'tab-active': currentPage === 'home' }"
        @click="navigateTo('home')"
      >
        <div class="tab-icon">
          <i class="f7-icons">house_fill</i>
        </div>
        <div class="tab-label">Home</div>
      </div>
      
      <div 
        class="tab-item larvae-tab" 
        :class="{ 'tab-active': currentPage === 'larvae' }"
        @click="navigateTo('larvae')"
      >
        <div class="tab-icon">
          <i class="f7-icons">ant_fill</i>
        </div>
        <div class="tab-label">Larvae</div>
        <div class="tab-indicator larvae-indicator"></div>
      </div>
      
      <div 
        class="tab-item prepupae-tab" 
        :class="{ 'tab-active': currentPage === 'prepupae' }"
        @click="navigateTo('prepupae')"
      >
        <div class="tab-icon">
          <i class="f7-icons">cube_box_fill</i>
        </div>
        <div class="tab-label">Prepupae</div>
        <div class="tab-indicator prepupae-indicator"></div>
      </div>
      
      <div 
        class="tab-item neonate-tab" 
        :class="{ 'tab-active': currentPage === 'neonates' }"
        @click="navigateTo('neonates')"
      >
        <div class="tab-icon">
          <i class="f7-icons">circle_grid_3x3_fill</i>
        </div>
        <div class="tab-label">Neonates</div>
        <div class="tab-indicator neonate-indicator"></div>
      </div>
      
      <div 
        class="tab-item microwave-tab" 
        :class="{ 'tab-active': currentPage === 'microwave' }"
        @click="navigateTo('microwave')"
      >
        <div class="tab-icon">
          <i class="f7-icons">bolt_fill</i>
        </div>
        <div class="tab-label">Microwave</div>
        <div class="tab-indicator microwave-indicator">        </div>
      </div>
    </div>

    <!-- User Selection Modal -->
    <f7-popup class="user-popup" :opened="userPopupOpen" @popup:closed="userPopupOpen = false">
      <f7-page>
        <f7-navbar title="Select User">
          <f7-nav-right>
            <f7-link popup-close>Done</f7-link>
          </f7-nav-right>
        </f7-navbar>
        
        <f7-block>
          <f7-block-title>Current User</f7-block-title>
          <f7-list>
            <f7-list-item v-if="currentUser" :title="currentUser" badge="Active" badge-color="green">
              <f7-icon slot="media" f7="person_fill" color="green"></f7-icon>
            </f7-list-item>
            <f7-list-item v-else title="No user selected" text-color="red">
              <f7-icon slot="media" f7="person" color="red"></f7-icon>
            </f7-list-item>
          </f7-list>
        </f7-block>

        <f7-block>
          <f7-block-title>Add New User</f7-block-title>
          <f7-list>
            <f7-list-input
              label="Username"
              type="text"
              placeholder="Enter username"
              v-model:value="newUsername"
              @keyup.enter="addUser"
            />
          </f7-list>
          <f7-button fill @click="addUser" :disabled="!newUsername.trim()">
            Add User
          </f7-button>
        </f7-block>

        <f7-block v-if="recentUsers.length > 0">
          <f7-block-title>Recent Users</f7-block-title>
          <f7-list>
            <f7-list-item 
              v-for="user in recentUsers" 
              :key="user.username"
              :title="user.username"
              :after="formatLastActive(user.last_active)"
              @click="selectUser(user.username)"
              link
            >
              <f7-icon slot="media" f7="person_circle"></f7-icon>
            </f7-list-item>
          </f7-list>
        </f7-block>

        <f7-block v-if="currentUser">
          <f7-button color="red" @click="clearUser">
            Clear Current User
          </f7-button>
        </f7-block>
      </f7-page>
    </f7-popup>
  </f7-app>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { f7 } from 'framework7-vue'

const prepareFormData = (form) => {
const cleaned = {}
for (const [key, value] of Object.entries(form)) {
  if (value === '' || value === null || value === undefined) {
      cleaned[key] = null
    } else if (!isNaN(value) && value !== true && value !== false) {
      cleaned[key] = Number(value)
    } else {
      cleaned[key] = value
    }
  }
  return cleaned
}

// User management state
const currentUser = ref('')
const userPopupOpen = ref(false)
const newUsername = ref('')
const recentUsers = ref([])
const browserFingerprint = ref('')

// Navigation state
const currentPage = ref('home')
const larvaeTab = ref('form')
const prepupaeTab = ref('form')
const neonateTab = ref('form')
const microwaveTab = ref('new')

// Form state
const submitting = ref(false)
const selectedRunId = ref('')
const selectedLarvaeRunId = ref('')

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
  microwave_power_gen1: '75',
  microwave_power_gen2: '65',
  fan_speed_cavity1: '100',
  fan_speed_cavity2: '100',
  belt_speed: '25',
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

const larvaeUpdateForm = ref({
  post_feed_condition: '',
  update_notes: ''
})

// Data arrays
const larvaeLogs = ref([])
const prepupaeLogs = ref([])
const neonateLogs = ref([])
const microwaveLogs = ref([])
const selectedRun = ref(null)
const selectedLarvaeRun = ref(null)

// Framework7 configuration
const f7params = {
  name: 'DataLog',
  theme: 'auto',
  colors: {
    primary: '#42b883'
  }
}

// Computed properties
const incompleteRuns = computed(() => {
  return microwaveLogs.value.filter(log => !log.tubs_live_larvae || !log.lb_dried_larvae)
})

const incompleteLarvaeRuns = computed(() => {
  return larvaeLogs.value.filter(log => !log.post_feed_condition)
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

const calculatedGrowthRate = computed(() => {
  // Remove growth rate calculation for larvae - not needed
  return null
})

// Lifecycle
onMounted(() => {
  initializeUser()
  loadAllData()
  
  // Apply dynamic theming after F7 initialization
  setTimeout(() => {
    applyPageTheme()
  }, 100)
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

// User Management Functions
const generateBrowserFingerprint = () => {
  const fingerprint = btoa(JSON.stringify({
    userAgent: navigator.userAgent.substring(0, 100),
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen: `${screen.width}x${screen.height}`,
    timestamp: Date.now()
  }))
  return fingerprint.substring(0, 50)
}

const initializeUser = () => {
  // Generate browser fingerprint
  browserFingerprint.value = generateBrowserFingerprint()
  
  // Load current user from localStorage
  const savedUser = localStorage.getItem('bsfl_current_user')
  if (savedUser) {
    currentUser.value = savedUser
    updateUserActivity()
    populateUsernameForms()
  } else {
    // Show user selector on first visit
    setTimeout(() => {
      userPopupOpen.value = true
    }, 500)
  }
  
  // Load recent users
  loadRecentUsers()
}

const loadRecentUsers = () => {
  const saved = localStorage.getItem('bsfl_recent_users')
  if (saved) {
    recentUsers.value = JSON.parse(saved)
  }
}

const saveRecentUsers = () => {
  localStorage.setItem('bsfl_recent_users', JSON.stringify(recentUsers.value))
}

const selectUser = (username) => {
  currentUser.value = username
  localStorage.setItem('bsfl_current_user', username)
  updateUserActivity()
  populateUsernameForms()
  userPopupOpen.value = false
  
  f7.toast.create({
    text: `Switched to user: ${username}`,
    closeTimeout: 2000,
  }).open()
}

const addUser = () => {
  const username = newUsername.value.trim()
  if (!username) return
  
  // Add to recent users if not already there
  const existingIndex = recentUsers.value.findIndex(u => u.username === username)
  if (existingIndex >= 0) {
    recentUsers.value.splice(existingIndex, 1)
  }
  
  recentUsers.value.unshift({
    username: username,
    last_active: new Date().toISOString(),
    device_id: browserFingerprint.value
  })
  
  // Keep only last 10 users
  recentUsers.value = recentUsers.value.slice(0, 10)
  saveRecentUsers()
  
  // Select this user
  selectUser(username)
  newUsername.value = ''
}

const updateUserActivity = () => {
  const now = new Date().toISOString()
  
  // Update in recent users
  const userIndex = recentUsers.value.findIndex(u => u.username === currentUser.value)
  if (userIndex >= 0) {
    recentUsers.value[userIndex].last_active = now
  } else if (currentUser.value) {
    recentUsers.value.unshift({
      username: currentUser.value,
      last_active: now,
      device_id: browserFingerprint.value
    })
  }
  
  saveRecentUsers()
  localStorage.setItem('bsfl_last_active', now)
}

const populateUsernameForms = () => {
  if (currentUser.value) {
    larvaeForm.value.username = currentUser.value
    prepupaeForm.value.username = currentUser.value
    neonateForm.value.username = currentUser.value
    productionForm.value.username = currentUser.value
  }
}

const showUserSelector = () => {
  userPopupOpen.value = true
}

const clearUser = () => {
  currentUser.value = ''
  localStorage.removeItem('bsfl_current_user')
  
  // Clear username from all forms
  larvaeForm.value.username = ''
  prepupaeForm.value.username = ''
  neonateForm.value.username = ''
  productionForm.value.username = ''
  
  userPopupOpen.value = false
  
  f7.toast.create({
    text: 'User cleared',
    closeTimeout: 2000,
  }).open()
}

const formatLastActive = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

// Belt Speed Stepper Functions
const incrementBeltSpeed = () => {
  const current = parseFloat(productionForm.value.belt_speed) || 0
  if (current < 100) {
    productionForm.value.belt_speed = (current + 0.5).toFixed(1)
  }
}

const decrementBeltSpeed = () => {
  const current = parseFloat(productionForm.value.belt_speed) || 0
  if (current > 0) {
    productionForm.value.belt_speed = (current - 0.5).toFixed(1)
  }
}

// Methods
const navigateTo = (page) => {
  currentPage.value = page
}

const getPageTitle = () => {
  const titles = {
    home: 'Tucker BSFL Data Logger',
    larvae: 'Larvae Logs',
    prepupae: 'Prepupae Logs',
    neonates: 'Neonate Logs',
    microwave: 'Microwave Logs'
  }
  return titles[currentPage.value] || 'DataLog'
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

const getBottomTabsClass = () => {
  const classes = {
    larvae: 'larvae-tabs',
    prepupae: 'prepupae-tabs',
    neonates: 'neonate-tabs',
    microwave: 'microwave-tabs'
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
  // Load stats after all data is loaded
  loadQuickStats()
}

const loadQuickStats = async () => {
  try {
    // Calculate total logs from all arrays
    const total = larvaeLogs.value.length + prepupaeLogs.value.length + 
                  neonateLogs.value.length + microwaveLogs.value.length;
    totalLogs.value = total;
    
    // Calculate today's logs
    const today = new Date().toDateString();
    const todayCount = [...larvaeLogs.value, ...prepupaeLogs.value, ...neonateLogs.value, ...microwaveLogs.value]
      .filter(log => new Date(log.timestamp).toDateString() === today).length;
    todayLogs.value = todayCount;
    
    // Active runs
    runningRuns.value = incompleteRuns.value.length;
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

// Larvae methods
const submitLarvaeLog = async () => {
  submitting.value = true
  try {
    // Only send the exact fields from the form, no auto-calculated fields
    const larvaeData = {
      username: larvaeForm.value.username,
      days_of_age: larvaeForm.value.days_of_age ? Number(larvaeForm.value.days_of_age) : null,
      larva_weight: larvaeForm.value.larva_weight ? Number(larvaeForm.value.larva_weight) : null,
      larva_pct: larvaeForm.value.larva_pct ? Number(larvaeForm.value.larva_pct) : null,
      lb_larvae: larvaeForm.value.lb_larvae ? Number(larvaeForm.value.lb_larvae) : null,
      lb_feed: larvaeForm.value.lb_feed ? Number(larvaeForm.value.lb_feed) : null,
      lb_water: larvaeForm.value.lb_water ? Number(larvaeForm.value.lb_water) : null,
      row_number: larvaeForm.value.row_number || null,
      notes: larvaeForm.value.notes || null
    }
    
    console.log('Submitting larvae data:', larvaeData)
    
    const response = await fetch('https://datalog-backend.onrender.com/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(larvaeData)
    })
    
    if (response.ok) {
      resetLarvaeForm()
      await loadLarvaeLogs()
      f7.toast.create({
        text: 'Larvae log saved successfully!',
        closeTimeout: 2000,
      }).open()
    } else {
      const errorData = await response.text()
      console.error('Server response:', response.status, errorData)
      throw new Error(`Server error: ${response.status}`)
    }
  } catch (error) {
    console.error('Error saving larvae log:', error)
    f7.dialog.alert(`Error saving log: ${error.message}. Please try again.`)
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
    username: currentUser.value || '',
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

const updateLarvaeRun = async () => {
  submitting.value = true
  try {
    const response = await fetch(`https://datalog-backend.onrender.com/api/logs/${selectedLarvaeRunId.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(prepareFormData(larvaeUpdateForm.value))
    })
    
    if (response.ok) {
      resetLarvaeUpdateForm()
      selectedLarvaeRunId.value = ''
      selectedLarvaeRun.value = null
      await loadLarvaeLogs()
      f7.toast.create({
        text: 'Larvae run updated successfully!',
        closeTimeout: 2000,
      }).open()
    } else {
      throw new Error('Failed to update larvae run')
    }
  } catch (error) {
    console.error('Error updating larvae run:', error)
    f7.dialog.alert('Error updating larvae run. Please try again.')
  } finally {
    submitting.value = false
  }
}

const loadSelectedLarvaeRun = () => {
  if (selectedLarvaeRunId.value) {
    selectedLarvaeRun.value = larvaeLogs.value.find(log => log.id === selectedLarvaeRunId.value)
    resetLarvaeUpdateForm()
  } else {
    selectedLarvaeRun.value = null
  }
}

const resetLarvaeUpdateForm = () => {
  larvaeUpdateForm.value = {
    post_feed_condition: '',
    update_notes: ''
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
      body: JSON.stringify(prepareFormData(prepupaeForm.value))
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
      body: JSON.stringify(prepareFormData(neonateForm.value))
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
    username: currentUser.value || '',
    temperature: '',
    humidity: '',
    prepupae_tubs_added: '',
    egg_nests_replaced: '',
    notes: ''
  }
}

const resetNeonateForm = () => {
  neonateForm.value = {
    username: currentUser.value || '',
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
      body: JSON.stringify(prepareFormData(productionForm.value))
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
      body: JSON.stringify(prepareFormData(updateForm.value))
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
    username: currentUser.value || '',
    microwave_power_gen1: '75',
    microwave_power_gen2: '65',
    fan_speed_cavity1: '100',
    fan_speed_cavity2: '100',
    belt_speed: '25',
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

const getLarvaeStatus = (log) => {
  if (log.post_feed_condition) {
    return 'Complete'
  }
  return 'In Progress'
}

const getLarvaeStatusColor = (log) => {
  if (log.post_feed_condition) {
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

.larvae-yield {
  background: linear-gradient(135deg, var(--larvae-color), var(--larvae-color-light)) !important;
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
  margin: 0 0.5rem 0.5rem 0.5rem;
}

.prepupae-theme {
  background: rgba(33, 150, 243, 0.05);
  border-radius: 12px;
  margin: 0 0.5rem 0.5rem 0.5rem;
}

.neonate-theme {
  background: rgba(156, 39, 176, 0.05);
  border-radius: 12px;
  margin: 0 0.5rem 0.5rem 0.5rem;
}

.microwave-theme {
  background: rgba(255, 152, 0, 0.05);
  border-radius: 12px;
  margin: 0 0.5rem 0.5rem 0.5rem;
}

/* Mobile-friendly log cards */
.log-card {
  margin-bottom: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Center all block titles globally */
.f7-block-title {
  width: 100%;
  text-align: center;
  padding: 0;
  margin: 0 auto;
  font-weight: bold;
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

.condition-info {
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.condition-value {
  font-size: 1.0rem;
  font-weight: 600;
  color: #4CAF50;
}

/* Bottom Tab Navigation Styles */
.bottom-tabs {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
  z-index: 10000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.bottom-tab-spacer {
  height: calc(90px + env(safe-area-inset-bottom));
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  flex: 1;
  padding: 8px 4px;
}

.tab-icon {
  font-size: 24px;
  margin-bottom: 4px;
  transition: transform 0.3s ease, color 0.3s ease;
  color: #8e8e93;
}

.tab-label {
  font-size: 10px;
  font-weight: 500;
  text-align: center;
  transition: color 0.3s ease;
  color: #8e8e93;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tab-indicator {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 2px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* Active tab states */
.tab-item.tab-active .tab-icon {
  transform: scale(1.1);
}

.tab-item.tab-active .tab-label {
  font-weight: 600;
}

.tab-item.tab-active .tab-indicator {
  opacity: 1;
}

/* Home tab active state */
.tab-item.tab-active:not(.larvae-tab):not(.prepupae-tab):not(.neonate-tab):not(.microwave-tab) .tab-icon,
.tab-item.tab-active:not(.larvae-tab):not(.prepupae-tab):not(.neonate-tab):not(.microwave-tab) .tab-label {
  color: #42b883;
}

/* Themed tab states */
.larvae-tab.tab-active .tab-icon,
.larvae-tab.tab-active .tab-label {
  color: var(--larvae-color);
}

.larvae-indicator {
  background: var(--larvae-color);
}

.prepupae-tab.tab-active .tab-icon,
.prepupae-tab.tab-active .tab-label {
  color: var(--prepupae-color);
}

.prepupae-indicator {
  background: var(--prepupae-color);
}

.neonate-tab.tab-active .tab-icon,
.neonate-tab.tab-active .tab-label {
  color: var(--neonate-color);
}

.neonate-indicator {
  background: var(--neonate-color);
}

.microwave-tab.tab-active .tab-icon,
.microwave-tab.tab-active .tab-label {
  color: var(--microwave-color);
}

.microwave-indicator {
  background: var(--microwave-color);
}

/* Tab bar theming based on current page */
.bottom-tabs.larvae-tabs {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(76, 175, 80, 0.05) 100%);
  border-top-color: rgba(76, 175, 80, 0.2);
}

.bottom-tabs.prepupae-tabs {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(33, 150, 243, 0.05) 100%);
  border-top-color: rgba(33, 150, 243, 0.2);
}

.bottom-tabs.neonate-tabs {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(156, 39, 176, 0.05) 100%);
  border-top-color: rgba(156, 39, 176, 0.2);
}

.bottom-tabs.microwave-tabs {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 152, 0, 0.05) 100%);
  border-top-color: rgba(255, 152, 0, 0.2);
}

/* Hover effects for desktop */
@media (hover: hover) {
  .tab-item:hover .tab-icon {
    transform: scale(1.05);
  }
  
  .tab-item:hover:not(.tab-active) .tab-icon,
  .tab-item:hover:not(.tab-active) .tab-label {
    color: #666;
  }
}

/* Touch feedback */
.tab-item:active {
  transform: scale(0.95);
}

.tab-item:active .tab-icon {
  transform: scale(1.0);
}

/* Responsive adjustments */
@media (max-width: 375px) {
  .tab-label {
    font-size: 9px;
  }
  
  .tab-icon {
    font-size: 22px;
  }
}

@media (max-width: 320px) {
  .tab-label {
    font-size: 8px;
  }
  
  .tab-icon {
    font-size: 20px;
  }
  
  .tab-item {
    padding: 6px 2px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .bottom-tabs {
    background: rgba(28, 28, 30, 0.95);
    border-top-color: rgba(255, 255, 255, 0.1);
  }
  
  .tab-icon,
  .tab-label {
    color: #8e8e93;
  }
  
  .bottom-tabs.larvae-tabs {
    background: linear-gradient(180deg, rgba(28, 28, 30, 0.95) 0%, rgba(76, 175, 80, 0.1) 100%);
  }
  
  .bottom-tabs.prepupae-tabs {
    background: linear-gradient(180deg, rgba(28, 28, 30, 0.95) 0%, rgba(33, 150, 243, 0.1) 100%);
  }
  
  .bottom-tabs.neonate-tabs {
    background: linear-gradient(180deg, rgba(28, 28, 30, 0.95) 0%, rgba(156, 39, 176, 0.1) 100%);
  }
  
  .bottom-tabs.microwave-tabs {
    background: linear-gradient(180deg, rgba(28, 28, 30, 0.95) 0%, rgba(255, 152, 0, 0.1) 100%);
  }
}

.navbar .title {
  font-size: 22px;
  font-weight: 600;
}

/* Belt Speed Custom Stepper */
.belt-speed-stepper {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 152, 0, 0.1);
  border: 1px solid rgba(255, 152, 0, 0.2);
  border-radius: 10px;
  padding: 4px;
  width: 120px;
  justify-self: flex-start;
}

.stepper-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: #FF9800;
  color: white;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.stepper-btn:hover {
  background: #F57C00;
  transform: scale(1.05);
}

.stepper-btn:active {
  background: #E65100;
  transform: scale(0.95);
}

.stepper-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.belt-speed-value {
  font-size: 16px;
  font-weight: 600;
  width: 40px;
  text-align: center;
  color: #333;
  background: transparent;
  border: none;
  outline: none;
}

.belt-speed-unit {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  flex-shrink: 0;
}

/* Remove extra spacing above Belt Speed field */
.belt-speed-stepper {
  margin-top: -8px;
}

/* User Management Styles */
.user-button {
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.user-button:active {
  background-color: rgba(255, 255, 255, 0.2);
}

.current-user {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-popup .popup {
  background: var(--f7-page-bg-color);
}

.user-popup .navbar {
  background: var(--f7-navbar-bg-color);
}

/* Dark mode user interface */
@media (prefers-color-scheme: dark) {
  .current-user {
    color: rgba(255, 255, 255, 0.8);
  }
  
  .user-button:active {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
</style>