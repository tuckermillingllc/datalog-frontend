import { createApp } from 'vue';
import { createPinia } from 'pinia'
import Framework7 from 'framework7/lite-bundle';
import Framework7Vue, { registerComponents } from 'framework7-vue/bundle';
import App from './App.vue';

// Import Framework7 Styles
import 'framework7/css/bundle';
import 'framework7-icons/css/framework7-icons.css';

Framework7.use(Framework7Vue);

const app = createApp(App);
registerComponents(app);
const pinia = createPinia()

if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
  document.body.classList.add('ios');
}

app.use(pinia)

// Add haptic feedback globally
app.panel.on('open', function(panel) {
  app.device.haptic('light')
})

app.panel.on('close', function(panel) {
  app.device.haptic('selection')
})

app.mount('#app');
