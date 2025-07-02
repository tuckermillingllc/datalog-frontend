<template>
  <f7-app :params="f7params">
    <!-- Main View -->
    <f7-view main>
      <f7-page>
        <f7-navbar title="DataLog System">
          <f7-nav-right>
            <f7-link @click="showMenu = !showMenu">Menu</f7-link>
          </f7-nav-right>
        </f7-navbar>

        <!-- Simple page navigation -->
        <f7-block v-if="currentPage === 'home'">
          <h1>Welcome to DataLog</h1>
          <f7-list>
            <f7-list-item link="#" title="Larvae Logs" @click="currentPage = 'larvae'" />
            <f7-list-item link="#" title="Container Logs" @click="currentPage = 'container'" />
            <f7-list-item link="#" title="Microwave Logs" @click="currentPage = 'microwave'" />
          </f7-list>
        </f7-block>

        <!-- Larvae Page -->
        <f7-block v-if="currentPage === 'larvae'">
          <h1>Larvae Logs</h1>
          <f7-button @click="currentPage = 'home'">Back to Home</f7-button>
          <p>Your larvae logging functionality will go here</p>
        </f7-block>

        <!-- Container Page -->
        <f7-block v-if="currentPage === 'container'">
          <h1>Container Logs</h1>
          <f7-button @click="currentPage = 'home'">Back to Home</f7-button>
          <p>Your container logging functionality will go here</p>
        </f7-block>

        <!-- Microwave Page -->
        <f7-block v-if="currentPage === 'microwave'">
          <h1>Microwave Logs</h1>
          <f7-button @click="currentPage = 'home'">Back to Home</f7-button>
          <p>Your microwave logging functionality will go here</p>
        </f7-block>
      </f7-page>
    </f7-view>
  </f7-app>
</template>

<script setup>
import { ref } from 'vue'

const currentPage = ref('home')
const showMenu = ref(false)

const f7params = {
  name: 'DataLog',
  theme: 'auto'
}

console.log('Simple Framework7 app loading...')
</script>

<style>
:root {
  --f7-theme-color: #42b883;
}
</style>