export default [
  {
    path: '/',
    component: () => import('./pages/HomePage.vue'),
  },
  {
    path: '/larvae-logs/',
    component: () => import('./pages/LarvaeLogs.vue'),
  },
  {
    path: '/container-logs/',
    component: () => import('./pages/ContainerLogs.vue'),
  },
  {
    path: '/microwave-logs/',
    component: () => import('./pages/MicrowaveLogs.vue'),
  }
];