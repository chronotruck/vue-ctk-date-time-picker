import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'
import CtkDateTimePicker from './components/CtkDateTimePicker'
import VueMoment from 'vue-moment'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)
Vue.use(VueMoment, {
  moment
})
const CustomElement = wrap(Vue, CtkDateTimePicker)

window.customElements.define('ctk-date-time-picker', CustomElement)
