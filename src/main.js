// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import 'url-search-params-polyfill'
import Vue from 'vue'
import App from './App'
import $ from 'jquery';
import {
  router
} from './router'
import iView from 'view-design';
import i18n from './i18n'
import plugin from './utils/plugin/index';
import 'view-design/dist/styles/iview.css'
import '@/assets/css/color.css'
import '@/assets/iconfont/iconfont.css'
import '@/assets/css/common.css' //全局樣式表
import waterfall from 'vue-waterfall2'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {
  getSession,
  removePolicySession
} from "@/utils/assist"

console.log(window.g)
Vue.use(plugin);
Vue.use(waterfall);
Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.use(iView);

Vue.locale = () => {};
Vue.prototype.$Message.config({
  top: 10,
  duration: 3
})

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  next();
});

router.afterEach(route => {
  iView.LoadingBar.finish();
});
/* eslint-disable no-new */
window.vm = new Vue({
  el: '#app',
  router,
  i18n,
  components: {
    App,
  },
  template: '<App/>'
})
