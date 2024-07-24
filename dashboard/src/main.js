import { createApp } from 'vue'

import 'animate.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import "~/assets/font.css"

import App from './App.vue'
import router from './router'
import 'virtual:windi.css'


const app = createApp(App)

app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
})

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.mount('#app')