import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// code mirror
import VueCodemirror from "vue-codemirror";
import "codemirror/lib/codemirror.css"; // 样式
Vue.use(VueCodemirror);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
