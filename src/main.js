// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'

import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'

import './theme/index.less'

//浏览器兼容
import 'normalize.css'

Vue.use(ViewUI);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
