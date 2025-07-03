<template>
  <f7-page name="larvae">
    <f7-navbar title="Larvae Logs" back-link="Back">
      <f7-nav-right>
        <f7-link panel-open="left" icon-ios="f7:bars" icon-md="material:menu" />
      </f7-nav-right>
    </f7-navbar>

    <!-- Segmented Control for tabs -->
    <f7-block>
      <f7-segmented raised>
        <f7-button 
          :class="{ 'button-active': activeTab === 'form' }"
          @click="activeTab = 'form'"
        >
          New Log
        </f7-button>
        <f7-button 
          :class="{ 'button-active': activeTab === 'list' }"
          @click="activeTab = 'list'"
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

    <!-- Tab Content -->
    <div v-show="activeTab === 'form'">
      <LarvaeLogForm />
    </div>
    
    <div v-show="activeTab === 'list'">
      <LarvaeLogList />
    </div>

    <div v-show="activeTab === 'update'">
      <LarvaeUpdateResults />
    </div>
  </f7-page>
</template>

<script setup>
import { ref } from 'vue'
import LarvaeLogForm from '../components/LarvaeLogForm.vue'
import LarvaeLogList from '../components/LarvaeLogList.vue'
import LarvaeUpdateResults from '../components/LarvaeUpdateResults.vue'

const activeTab = ref('form')
</script>

<style scoped>
.button-active {
  background-color: var(--f7-theme-color) !important;
  color: white !important;
}
</style>
