import Vue from 'vue'
import CtkDateTimePicker from './CtkDateTimePicker.vue'
import 'classlist-polyfill'
import 'babel-polyfill'
if (document.querySelector('#vueCtkDateTimePicker')) {
  Vue.component('ctk-date-time-picker', CtkDateTimePicker)
  new Vue({
    el: '#vueCtkDateTimePicker',
    data: function () {
      return {
        value: '2018-04-05T04:26',
        value2: null,
        value3: '2018-04-05T14:26',
        timePickerValue: '14:26',
        minuteInterval: 5,
        minuteInterval2: 10,
        hint: 'Error message',
        errorHint: true,
        timeFormat: 'h:mm a',
        locale: 'fr'
      }
    }
  })
}

export default CtkDateTimePicker
