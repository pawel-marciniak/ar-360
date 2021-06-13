import Vue from 'vue';
import App from './App.vue';
import { VueHammer } from 'vue2-hammer';

Vue.config.productionTip = false;

// import VueThreeSixty from 'vue-360';
//
// import 'vue-360/dist/css/style.css';
//
// Vue.use(VueThreeSixty);
Vue.use(VueHammer)

new Vue({
  render: h => h(App),
}).$mount('#app');
