import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from './langs'
import common from '../utils/common';
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: common.changeLang(),
  messages: messages
})
export default i18n