import { createApp } from 'vue';
import Framework7 from 'framework7/lite-bundle';
import 'framework7/lite-bundle.css';
import Framework7Vue, { registerComponents } from 'framework7-vue/bundle';
import App from './App.vue';
import routes from './routes';

Framework7.use(Framework7Vue);

const app = createApp(App);
registerComponents(app);

// Inject routes into the Framework7 app
app.config.globalProperties.$f7routes = routes;

app.mount('#app');

