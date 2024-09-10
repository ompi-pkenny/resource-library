import { createApp } from 'vue'
import App from './App.vue'

const pdfjsLib = window.pdfjsLib


const app = createApp(App)
app.config.globalProperties.$pdfjsLib = pdfjsLib

app.mount('#app')
