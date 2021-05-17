import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//vant-------------------------------------
import Vant from 'vant';
import 'vant/lib/index.css';

//setting
import {initFn} from './settings'
//是否开启vconsole调试
initFn(false)

Vue.use(Vant);

Vue.config.productionTip = false



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
