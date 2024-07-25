import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'animate.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import "~/assets/font.css"

import App from './App.vue'
import router from './router'
import 'virtual:windi.css'

import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: '/api'
});


const app = createApp(App)
const pinia = createPinia()

app.provide('axios', axiosInstance);

app.use(pinia)
app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
})

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.mount('#app')