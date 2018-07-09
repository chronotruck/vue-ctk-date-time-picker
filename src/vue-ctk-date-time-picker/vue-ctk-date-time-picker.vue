<template>
  <div :id="id" ref="bigParent" class="ctk-date-time-picker">
    <div
      ref="parent"
      class="field"
      @click="showDatePicker"
      :class="{'is-focused': isFocus || isVisible, 'has-value': dateFormatted, 'has-error': errorHint}"
      v-click-outside="unFocus"
    >
      <div v-if="!withoutInput">
        <input
          type="text" :id="id"
          :value="dateFormatted"
          class="field-input"
          @focus="onFocus"
          :placeholder="label"
          :style="isFocus && !errorHint || isVisible ? borderStyle : ''"
          ref="CtkDateTimePicker" readonly
        >
        <input type="hidden" :value="dateRaw" tabindex="-1">
        <label
          :for="id"
          class="field-label"
          :class="hint ? (errorHint ? 'text-danger' : 'text-primary') : ''"
          :style="isFocus || isVisible ? colorStyle : ''"
        >
          {{hint || label}}
         </label>
      </div>
      <ctk-date-picker-agenda
        ref="agenda"
        :date-time="dateTime"
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
        :agenda-position="agendaPosition"
        :without-input="withoutInput"
        :no-weekends-days="noWeekendsDays"
        :auto-close="autoClose"
        @change-date="changeDate"
      />
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import CtkDatePickerAgenda from './_subs/CtkDatePickerAgenda.vue'
  import ClickOutside from './modules/v-click-outside'
  function nearestMinutes (interval, someMoment, m) {
    const roundedMinutes = Math.ceil(someMoment.minute() / interval) * interval
    return m(someMoment.clone().minute(roundedMinutes).second(0))
  }
  export default {
    name: 'ctk-date-time-picker',
    components: {
      CtkDatePickerAgenda
    },
    directives: {
      'click-outside': ClickOutside
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
      timeFormat: { type: String, default: 'H:mm a' },
      withoutHeader: { type: Boolean, default: false },
      id: { type: String, default: 'CtkDateTimePicker'},
      minDate: { type: String },
      maxDate: { type: String },
      withoutInput: { type: Boolean, default: false },
      noWeekendsDays: {type: Boolean, default: false},
      autoClose: {type: Boolean, default: false}
    },
    data: function () {
      return {
        isVisible: false,
        isFocus: false,
        dateRaw: null,
        agendaPosition: 'top',
        oldValue: this.value
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
      dateTime: {
        get () {
          if (this.disableDate) {
            if (this.value) {
              let date
              if (!moment(this.value, 'YYYY-MM-DD').isValid()) {
                date = moment(moment().format('YYYY-MM-DD') + ' ' + this.value)
              } else {
                date = moment(this.value)
              }
              return nearestMinutes(this.minuteInterval, date, moment)
            } else {
              return nearestMinutes(this.minuteInterval, moment().clone(), moment)
            }
          }
          return nearestMinutes(this.minuteInterval, this.value ? moment(this.value).clone() : moment().clone(), moment)
        },
        set (val) {
          this.dateTime = val
        }
      },
      dateFormatted: {
        get () {
          let dateFormat
          if (this.value) {
            if (!moment(this.value, 'YYYY-MM-DD').isValid()) {
              dateFormat = moment(moment().format('YYYY-MM-DD') + ' ' + this.value)
            } else {
              dateFormat = moment(this.value)
            }
          } else {
            dateFormat = null
          }
          if (dateFormat) {
            return nearestMinutes(this.minuteInterval, dateFormat, moment).locale(this.locale).format(this.formatted)
          } else {
            return null
          }
        },
        set (val) {
          this.dateFormatted = val
        }
      }
    },
    created: function () {
      if (this.value) {
        this.$emit('input', this.dateTime.format(this.format))
        this.dateRaw = this.dateTime.format(this.format)
      }
      moment.locale(this.locale)
    },
    methods: {
      changeDate: function (day) {
        this.$emit('input', moment(day).clone().format(this.format))
        this.dateRaw = moment(day).clone().format(this.format)
        if (this.autoClose) {
          this.hideDatePicker()
        }
      },
      showDatePicker: function () {
        const rect = this.$refs.parent.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const datePickerHeight = 300
        if (((windowHeight - (rect.top + rect.height)) > datePickerHeight) || ((windowHeight - rect.top) > windowHeight / 2 + rect.height)) {
          this.agendaPosition = 'top'
        } else {
          this.agendaPosition = 'bottom'
        }
        this.isVisible = true
      },
      hideDatePicker: function () {
        this.isVisible = false
      },
      onFocus: function () {
        this.isFocus = true
        this.showDatePicker()
      },
      unFocus: function () {
        this.hideDatePicker()
        this.isFocus = false
      }
    }
  }
</script>


<style lang="scss">
  @import "./assets/main.scss";
  .ctk-date-time-picker {
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
        cursor: pointer;
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
        cursor: pointer;
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
        z-index: 0;
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
