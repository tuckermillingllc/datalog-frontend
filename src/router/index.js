import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import LarvaeLogs from '../views/LarvaeLogs.vue'
import ContainerLogs from '../views/ContainerLogs.vue'
import MicrowaveLogs from '../views/MicrowaveLogs.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/larvae-logs',
    name: 'LarvaeLogs',
    component: LarvaeLogs
  },
  {
    path: '/container-logs',
    name: 'ContainerLogs',
    component: ContainerLogs
  },
  {
    path: '/microwave-logs',
    name: 'MicrowaveLogs',
    component: MicrowaveLogs
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router