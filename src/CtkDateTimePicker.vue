<template>
  <div :id="id" ref="bigParent" class="ctk-date-time-picker">
    <div ref="parent" class="field" @click="showDatePicker" :class="{'is-focused': isFocus || isVisible, 'has-value': dateFormatted, 'has-error': errorHint}" v-click-outside="cancel">
      <input type="text" :id="id"
             :value="dateFormatted"
             class="field-input"
             @focus="onFocus"
             @blur="onBlur"
             :placeholder="label"
             :style="isFocus && !errorHint || isVisible ? borderStyle : ''"
             ref="CtkDateTimePicker" readonly>
      <input type="hidden" :value="dateRaw" tabindex="-1">
      <label :for="id" class="field-label"
             :class="hint ? (errorHint ? 'text-danger' : 'text-primary') : ''"
             :style="isFocus || isVisible ? colorStyle : ''">{{hint || label}}</label>
      <div class="time-picker-overlay" v-if="isVisible" @click.stop="withoutButtonAction ? validate() : cancel()"></div>
      <ctk-date-picker-agenda ref="agenda"
                              :date-time="dateTime"
                              :color="color"
                              :visible="isVisible"
                              :without-header="!withoutHeader"
                              :without-button-action="!withoutButtonAction"
                              :disable-time="disableTime"
                              :disable-date="disableDate"
                              :minute-interval="minuteInterval"
                              :time-format="timeFormat"
                              :locale="locale"
                              :min-date="minDate"
                              :max-date="maxDate"
                              :agenda-position="agendaPosition"
                              @validate="validate"
                              @cancel="cancel"
                              @change-date="changeDate" />
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import CtkDatePickerAgenda from './_subs/CtkDatePickerAgenda'
  import ClickOutside from './modules/v-click-outside'
  function nearestMinutes (interval, someMoment, m) {
    const roundedMinutes = Math.ceil(someMoment.minute() / interval) * interval
    return m(someMoment.clone().minute(roundedMinutes).second(0))
  }
  export default {
    name: 'CtkDateTimePicker',
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
      withoutButtonAction: { type: Boolean, default: false }
    },
    data: function () {
      return {
        dateTime: this.getDateTime(),
        isVisible: false,
        isFocus: false,
        dateRaw: null,
        dateFormatted: this.getDateFormatted(),
        agendaPosition: 'top'
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
      getDateFormatted: function () {
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
      getDateTimeMoment: function () {
        return moment(this.dateTime).locale(this.locale)
      },
      getDateTime: function () {
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
      changeDate: function (day) {
        this.dateFormatted = moment(day).clone().locale(this.locale).format(this.formatted)
        this.dateTime = day
        if (this.withoutButtonAction) {
          this.$emit('input', moment(this.dateTime).clone().format(this.format))
          this.dateRaw = moment(this.dateTime).clone().format(this.format)
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
      hideDatePicker: function (target) {
        this.isVisible = false
      },
      onFocus: function () {
        this.isFocus = true
      },
      onBlur: function () {
        this.unFocus()
      },
      unFocus: function () {
        this.isFocus = false
      },
      validate: function () {
        this.unFocus()
        this.$emit('input', moment(this.dateTime).format(this.format))
        this.dateRaw = moment(this.dateTime).format(this.format)
        this.dateFormatted = moment(this.dateTime).locale(this.locale).format(this.formatted)
        this.hideDatePicker()
      },
      cancel: function () {
        this.unFocus()
        if (!this.withoutButtonAction) {
          this.dateFormatted = this.value ? this.getDateTime().locale(this.locale).format(this.formatted) : null
        }
        this.hideDatePicker()
      }
    },
    watch: {
      locale: function () {
        this.dateTime = this.dateTime
      }
    }
  }
</script>


<style lang="scss">
 @import "/assets/main.scss";
  .ctk-date-time-picker {
    width: 100%;
    margin: 0 auto;
    text-align: left;
    font-size: 14px;
    border-radius: 4px;
    * {
      box-sizing: border-box;
    }
    .time-picker-overlay {
      z-index: 2;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
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
