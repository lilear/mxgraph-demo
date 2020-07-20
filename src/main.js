import Vue from 'vue';
import App from './App.vue';
import '@/style/mxgraph.css';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

import * as R from 'ramda';
Vue.prototype.R = R;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount('#app');
