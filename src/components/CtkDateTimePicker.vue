<template>
  <div id="CtkDateTimePicker" class="time-picker">
    <div ref="parent" class="field" :class="{'is-focused': isFocus || isVisible, 'has-value': dateTime, 'has-error': errorHint}"  @click.stop="showDatePicker">
      <input type="text" :id="id"
             :value="getDateTimeMoment()"
             class="field-input"
             @focus="onFocus"
             @blur="onBlur"
             :style="isFocus && !errorHint || isVisible ? borderStyle : ''"
             ref="CtkDateTimePicker" readonly>

      <input type="hidden" :value="dateRaw">
      <label :for="id" class="field-label"
             :class="hint ? (errorHint ? 'text-danger' : 'text-primary') : ''"
             :style="isFocus || isVisible ? colorStyle : ''">{{hint || label}}</label>
      <ctk-date-picker-agenda :date-time="dateTime"
                              :color="color"
                              :visible="isVisible"
                              :without-header="!withoutHeader"
                              :disable-time="disableTime"
                              :disable-date="disableDate"
                              :minute-interval="minuteInterval"
                              :time-format="timeFormat"
                              :locale="locale"
                              :min-date="minDate"
                              :max-date="maxDate"
                              @change-date="changeDate" />
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueMoment from 'vue-moment'
  import Moment from 'moment'
  import { extendMoment } from 'moment-range'
  const moment = extendMoment(Moment)
  Vue.use(VueMoment, {
    moment
  })
  import CtkDatePickerAgenda from './_subs/CtkDatePickerAgenda'
  function nearestMinutes (interval, someMoment, m) {
    const roundedMinutes = Math.ceil(someMoment.minute() / interval) * interval
    return m(someMoment.clone().minute(roundedMinutes).second(0))
  }
  export default {
    name: 'CtkDateTimePicker',
    components: {
      CtkDatePickerAgenda
    },
    props: {
      label: { type: String, default: 'Select date & time' },
      hint: { type: String },
      errorHint: { type: Boolean },
      value: { required: false },
      formatted: { type: String, default: 'llll' },
      format: { type: String },
      locale: { type: String, default: 'en' },
      disableTime: { type: Boolean, default: false },
      disableDate: { type: Boolean, default: false },
      minuteInterval: { type: Number, default: 1 },
      color: { type: String },
      timeFormat: { type: String, default: 'HH:mm' },
      withoutHeader: { type: Boolean, default: false },
      id: { type: String, default: 'CtkDateTimePicker'},
      minDate: { type: String },
      maxDate: { type: String }
    },
    data: function () {
      return {
        dateTime: this.getDateTime(),
        isVisible: false,
        isFocus: false
      }
    },
    computed: {
      colorStyle: function () {
        return {
          color: this.color
        }
      },
      borderStyle: function () {
        return {
          borderColor: this.color
        }
      },
      dateRaw: function () {
        this.$emit('input', this.$moment(this.dateTime).clone().format(this.format))
        return this.$moment(this.dateTime).clone().format(this.format)
      }
    },
    created: function () {
      this.$moment.locale(this.locale)
    },
    methods: {
      getDateTimeMoment: function () {
        return this.$moment(this.dateTime).locale(this.locale).format(this.formatted)
      },
      getDateTime: function () {
        if (this.disableDate) {
          if (this.value) {
            return nearestMinutes(this.minuteInterval, this.$moment(this.value).clone(), this.$moment)
          }
          return nearestMinutes(this.minuteInterval, this.$moment().clone(), this.$moment)
        }
        return nearestMinutes(this.minuteInterval, this.value ? this.$moment(this.value).clone() : this.$moment().clone(), this.$moment)
      },
      changeDate: function (day) {
        this.dateTime = day
      },
      showDatePicker: function () {
        this.isVisible = true
        const vm = this
        setTimeout(function () {
          document.addEventListener('click', vm.hideDatePicker)
        }, 0)
      },
      hideDatePicker: function () {
        document.removeEventListener('click', this.hideDatePicker)
        this.isVisible = false
      },
      onFocus: function () {
        this.isFocus = true
      },
      onBlur: function () {
        this.isFocus = false
      }
    },
    watch: {
      locale: function () {
        this.dateTime = this.getDateTime()
      }
    }
  }
</script>


<style lang="scss">
 @import "../assets/main.scss";
  #CtkDateTimePicker {
    position: relative;
    width: 100%;
    margin: 0 auto;
    text-align: left;
    font-size: 14px;
    border-radius: 4px;
    * {
      box-sizing: border-box;
    }
    .field{
      position: relative;
      .field-label{
        position: absolute;
        top: 3px;
        left: 13px;
        -webkit-transform: translateY(25%);
        transform: translateY(25%);
        opacity: 0;
        -webkit-transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
        font-size: 11px;
        color: rgba(0, 0, 0, 0.54);
      }
      .field-input{
        background-color: #FFF;
        -webkit-transition-duration: 0.3s;
        transition-duration: 0.3s;
        position: relative;
        width: 100%;
        height: 42px;
        min-height: 42px;
        padding: 0 12px;
        font-weight: 300;
        -webkit-appearance: none;
        outline: none;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        font-size: 14px;
      }
      &.has-error {
        .field-input {
          border-color: orangered !important;
        }
        .field-label{
          opacity: 1;
          -webkit-transform: translateY(0);
          transform: translateY(0);
          font-size: 11px;
        }
        .field-input {
          padding-top: 14px;
        }
      }
      &.has-value {
        .field-label{
          opacity: 1;
          -webkit-transform: translateY(0);
          transform: translateY(0);
          font-size: 11px;
        }
        .field-input {
          padding-top: 14px;
        }
      }
      &.is-focused {
        .field-input {
          border-color: dodgerblue;
        }
        .field-label {
          color: dodgerblue;
        }
      }
    }
    .text-danger {
      color: orangered !important;
    }
  }
</style>
