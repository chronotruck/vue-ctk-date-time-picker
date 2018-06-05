import Vue from 'vue'
import wrap from '@vue/web-component-wrapper'
import CtkDateTimePicker from './components/CtkDateTimePicker'

const CustomElement = wrap(Vue, CtkDateTimePicker)

window.customElements.define('ctk-date-time-picker', CustomElement)
