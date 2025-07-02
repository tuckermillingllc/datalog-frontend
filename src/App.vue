<template>
  <f7-app :params="f7params">
    <!-- Left Panel (Sidebar) -->
    <f7-panel left reveal>
      <f7-view>
        <f7-page>
          <f7-navbar title="DataLog Menu" />
          <f7-list>
            <f7-list-item link="#" title="Home" @click="navigateTo('home')" />
            <f7-list-item link="#" title="Larvae Logs" @click="navigateTo('larvae')" />
            <f7-list-item link="#" title="Container Logs" @click="navigateTo('container')" />
            <f7-list-item link="#" title="Microwave Logs" @click="navigateTo('microwave')" />
          </f7-list>
        </f7-page>
      </f7-view>
    </f7-panel>

    <!-- Main View -->
    <f7-view main>
      <f7-page>
        <f7-navbar :title="getPageTitle()">
          <f7-nav-left>
            <f7-link panel-open="left" icon-ios="f7:bars" icon-md="material:menu">Menu</f7-link>
          </f7-nav-left>
        </f7-navbar>

        <!-- Home Page -->
        <f7-block v-if="currentPage === 'home'">
          <h1>Welcome to DataLog System</h1>
          <p>Select a logging system to get started</p>
          
          <f7-list>
            <f7-list-item link="#" title="Larvae Logs" subtitle="Track larvae feeding and development" @click="navigateTo('larvae')">
              <div slot="media">🐛</div>
            </f7-list-item>
            <f7-list-item link="#" title="Container Logs" subtitle="Monitor container conditions" @click="navigateTo('container')">
              <div slot="media">📦</div>
            </f7-list-item>
            <f7-list-item link="#" title="Microwave Logs" subtitle="Production run tracking" @click="navigateTo('microwave')">
              <div slot="media">⚡</div>
            </f7-list-item>
          </f7-list>
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
              <f7-list-input label="Username" type="text" placeholder="Enter username" />
              <f7-list-input label="Days of Age" type="number" placeholder="Enter days" />
              <f7-list-input label="Larva Weight" type="number" placeholder="Enter weight" />
              <f7-list-input label="Notes" type="textarea" placeholder="Additional notes..." />
            </f7-list>
            <f7-button fill>Save Larvae Log</f7-button>
          </div>
          
          <div v-if="larvaeTab === 'list'">
            <f7-list>
              <f7-list-item title="Sample Log 1" subtitle="2024-01-01" text="Test data..." />
              <f7-list-item title="Sample Log 2" subtitle="2024-01-02" text="More test data..." />
            </f7-list>
          </div>
        </f7-block>

        <!-- Container Page -->
        <f7-block v-if="currentPage === 'container'">
          <f7-block-title>Container Logs</f7-block-title>
          
          <f7-segmented raised>
            <f7-button :class="{ 'button-active': containerTab === 'prepupae' }" @click="containerTab = 'prepupae'">Prepupae</f7-button>
            <f7-button :class="{ 'button-active': containerTab === 'neonates' }" @click="containerTab = 'neonates'">Neonates</f7-button>
          </f7-segmented>
          
          <div v-if="containerTab === 'prepupae'">
            <f7-list>
              <f7-list-input label="Username" type="text" placeholder="Enter username" />
              <f7-list-input label="Temperature (°F)" type="number" placeholder="Enter temperature" />
              <f7-list-input label="Humidity (%)" type="number" placeholder="Enter humidity" />
              <f7-list-input label="Prepupae Tubs Added" type="number" placeholder="Number of tubs" />
            </f7-list>
            <f7-button fill>Save Prepupae Log</f7-button>
          </div>
          
          <div v-if="containerTab === 'neonates'">
            <f7-list>
              <f7-list-input label="Username" type="text" placeholder="Enter username" />
              <f7-list-input label="Temperature (°F)" type="number" placeholder="Enter temperature" />
              <f7-list-input label="Humidity (%)" type="number" placeholder="Enter humidity" />
              <f7-list-input label="Bait Tubs Replaced" type="number" placeholder="Number of tubs" />
            </f7-list>
            <f7-button fill>Save Neonate Log</f7-button>
          </div>
        </f7-block>

        <!-- Microwave Page -->
        <f7-block v-if="currentPage === 'microwave'">
          <f7-block-title>Microwave Logs</f7-block-title>
          
          <f7-segmented raised>
            <f7-button :class="{ 'button-active': microwaveTab === 'new' }" @click="microwaveTab = 'new'">New Run</f7-button>
            <f7-button :class="{ 'button-active': microwaveTab === 'view' }" @click="microwaveTab = 'view'">View Logs</f7-button>
          </f7-segmented>
          
          <div v-if="microwaveTab === 'new'">
            <f7-list>
              <f7-list-input label="Username" type="text" placeholder="Enter username" />
              <f7-list-input label="Power Generator 1" type="number" placeholder="Enter power" />
              <f7-list-input label="Power Generator 2" type="number" placeholder="Enter power" />
              <f7-list-input label="Belt Speed" type="number" placeholder="Enter speed" />
            </f7-list>
            <f7-button fill>Start Production Run</f7-button>
          </div>
          
          <div v-if="microwaveTab === 'view'">
            <f7-list>
              <f7-list-item title="Production Run 1" subtitle="2024-01-01" text="Yield: 85%" />
              <f7-list-item title="Production Run 2" subtitle="2024-01-02" text="Yield: 90%" />
            </f7-list>
          </div>
        </f7-block>
      </f7-page>
    </f7-view>
  </f7-app>
</template>

<script setup>
import { ref } from 'vue'
import { f7 } from 'framework7-vue'

const currentPage = ref('home')
const larvaeTab = ref('form')
const containerTab = ref('prepupae')
const microwaveTab = ref('new')

const f7params = {
  name: 'DataLog',
  theme: 'auto'
}

const navigateTo = (page) => {
  currentPage.value = page
  f7.panel.close() // Close the sidebar after navigation
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
</script>

<style>
:root {
  --f7-theme-color: #42b883;
}

.button-active {
  background-color: var(--f7-theme-color) !important;
  color: white !important;
}
</style>