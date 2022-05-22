import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import Notifications from '@kyvg/vue3-notification'
import './assets/css/index.css';

createApp(App).use(store).use(Notifications).mount('#app')
