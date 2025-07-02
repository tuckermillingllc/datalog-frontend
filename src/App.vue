<template>
  <f7-app :params="f7params">
    <!-- Panel (Sidebar) -->
    <f7-panel left reveal :backdrop="false">
      <f7-view>
        <f7-page>
          <f7-navbar title="DataLog Menu" />
          <f7-list>
            <f7-list-item 
              link="#" 
              title="Home" 
              @click="navigateTo('/')"
              :class="{ 'item-selected': currentRoute === '/' }"
            >
              <f7-icon slot="media" ios="f7:house" md="material:home" />
            </f7-list-item>
            <f7-list-item 
              link="#" 
              title="Larvae Logs" 
              @click="navigateTo('/larvae/')"
              :class="{ 'item-selected': currentRoute === '/larvae/' }"
            >
              <f7-icon slot="media" ios="f7:ant" md="material:bug_report" />
            </f7-list-item>
            <f7-list-item 
              link="#" 
              title="Container Logs" 
              @click="navigateTo('/container/')"
              :class="{ 'item-selected': currentRoute === '/container/' }"
            >
              <f7-icon slot="media" ios="f7:cube_box" md="material:inventory" />
            </f7-list-item>
            <f7-list-item 
              link="#" 
              title="Microwave Logs" 
              @click="navigateTo('/microwave/')"
              :class="{ 'item-selected': currentRoute === '/microwave/' }"
            >
              <f7-icon slot="media" ios="f7:bolt" md="material:microwave" />
            </f7-list-item>
          </f7-list>
        </f7-page>
      </f7-view>
    </f7-panel>

    <!-- Main View -->
    <f7-view main :url="initialRoute" />
  </f7-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { f7 } from 'framework7-vue'

const currentRoute = ref('/')
const initialRoute = ref('/')

const f7params = {
  name: 'DataLog',
  theme: 'auto',
  routes: [
    {
      path: '/',
      component: () => import('./pages/HomePage.vue')
    },
    {
      path: '/larvae/',
      component: () => import('./pages/LarvaePage.vue')
    },
    {
      path: '/container/',
      component: () => import('./pages/ContainerPage.vue')
    },
    {
      path: '/microwave/',
      component: () => import('./pages/MicrowavePage.vue')
    }
  ]
}

onMounted(() => {
  if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
    document.body.classList.add('ios')
  }
})

const navigateTo = (route) => {
  currentRoute.value = route
  f7.views.main.router.navigate(route)
  f7.panel.close()
}
</script>

<style>
.item-selected {
  background-color: var(--f7-list-item-selected-bg-color, rgba(0, 122, 255, 0.15));
}

/* Custom color scheme */
:root {
  --f7-theme-color: #42b883;
  --f7-theme-color-rgb: 66, 184, 131;
}
</style>