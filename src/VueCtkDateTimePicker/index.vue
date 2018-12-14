<template>
  <div
    :id="id"
    :class="{'inline': inline, 'is-dark': dark}"
    class="ctk-date-time-picker"
  >
    <div
      v-if="!inline"
      ref="parent"
      :class="{'is-focused': isFocus || isVisible, 'has-value': dateFormatted, 'has-error': errorHint, 'is-disabled': disabled}"
      class="field"
      @click="showDatePicker"
    >
      <input
        ref="CtkDateTimePicker"
        :id="id"
        :value="dateFormatted"
        :placeholder="label"
        :disabled="disabled"
        :style="[getBorderStyle]"
        type="text"
        class="field-input"
        readonly
        @focus="onFocus"
      >
      <label
        ref="label"
        :for="id"
        :class="hint ? (errorHint ? 'text-danger' : 'text-primary') : ''"
        :style="[getColorStyle]"
        class="field-label"
      >
        {{ hint || label }}
      </label>

    </div>

    <div
      v-if="overlay && isVisible && !inline"
      :class="{'has-background': overlayBackground}"
      class="time-picker-overlay"
      @click.stop="unFocus"
    />
    <ctk-date-picker-agenda
      v-if="!rangeMode"
      ref="agenda"
      v-model="value"
      :date-time="dateTime"
      :color="color"
      :visible="isVisible"
      :without-header="!withoutHeader"
      :disable-time="hasDisabledTime"
      :disable-date="disableDate"
      :minute-interval="minuteInterval"
      :time-format="timeFormat"
      :locale="locale"
      :min-date="minDate"
      :max-date="maxDate"
      :agenda-position="agendaPosition"
      :inline="inline"
      :no-weekends-days="noWeekendsDays"
      :enable-button-validate="enableButtonValidate"
      :auto-close="autoClose"
      :range-mode="rangeMode"
      :disabled-dates="disabledDates"
      :dark="dark"
      :disabled-hours="disabledHours"
      @change-date="changeDate"
      @validate="validate"
    />
    <ctk-date-range-picker
      v-else
      ref="range"
      v-model="value"
      :date-time="dateTime"
      :color="color"
      :visible="isVisible"
      :without-header="!withoutHeader"
      :disable-time="hasDisabledTime"
      :disable-date="disableDate"
      :minute-interval="minuteInterval"
      :time-format="timeFormat"
      :locale="locale"
      :min-date="minDate"
      :max-date="maxDate"
      :agenda-position="agendaPosition"
      :inline="isInline"
      :no-weekends-days="noWeekendsDays"
      :enable-button-validate="enableButtonValidate"
      :auto-close="autoClose"
      :range-mode="rangeMode"
      :disabled-dates="disabledDates"
      :without-range-shortcut="withoutRangeShortcut"
      :dark="dark"
      :shortcuts-translation="shortcutsTranslation"
      @change-date="changeDate"
      @validate="validate"
    />
  </div>
</template>

<script>
  import moment from 'moment-timezone'
  import CtkDatePickerAgenda from './_subs/CtkDatePickerAgenda'
  import CtkDateRangePicker from './_subs/CtkDateRangePicker'

  const nearestMinutes = (interval, someMoment, m) => {
    const roundedMinutes = Math.ceil(someMoment.minute() / interval) * interval
    return m(someMoment.clone().minute(roundedMinutes).second(0))
  }

  const getDefaultTZ = () => {
    return moment.tz.guess() || 'America/Los_Angeles'
  }

  const getDefaultLocale = () => {
    return (window.navigator.userLanguage || window.navigator.language || 'en').substr(0, 2)
  }

  export default {
    name: 'VueCtkDateTimePicker',
    components: {
      CtkDatePickerAgenda,
      CtkDateRangePicker
    },
    props: {
      label: { type: String, default: 'Select date & time' },
      hint: { type: String, default: String },
      errorHint: { type: Boolean, default: Boolean },
      value: { type: [String, Object], required: false, default: null },
      formatted: { type: String, default: 'llll' },
      format: { type: String, default: String },
      locale: { type: String, default: getDefaultLocale() },
      timeZone: { type: String, default: getDefaultTZ() },
      disableTime: { type: Boolean, default: false },
      disableDate: { type: Boolean, default: false },
      minuteInterval: { type: Number, default: 1 },
      color: { type: String, default: String },
      timeFormat: { type: String, default: 'h:mm a' },
      withoutHeader: { type: Boolean, default: false },
      id: { type: String, default: 'CtkDateTimePicker' },
      minDate: { type: String, default: String },
      maxDate: { type: String, default: String },
      withoutInput: { type: Boolean, default: false },
      inline: { type: Boolean, default: false },
      noWeekendsDays: {type: Boolean, default: false},
      autoClose: {type: Boolean, default: false},
      disabled: {type: Boolean, default: false},
      overlay: {type: Boolean, default: true},
      disabledDates: { type: Array, default: Array },
      rangeMode: {type: Boolean, default: false},
      overlayBackground: {type: Boolean, default: false},
      withoutRangeShortcut: {type: Boolean, default: false},
      dark: {type: Boolean, default: false},
      shortcutsTranslation: {type: Object, default: Object},
      disabledHours: {type: Array, default: Array}
    },
    data () {
      return {
        isVisible: false,
        isFocus: false,
        agendaPosition: 'top',
        oldValue: this.value,
        clientWidth: null
      }
    },
    computed: {
      enableButtonValidate () {
        return !this.inline && !this.autoClose
      },
      isInline () {
        return this.withoutInput || this.inline
      },
      getColorStyle () {
        const cond = this.isFocus || this.isVisible
        return cond
          ? { color: this.color }
          : null
      },
      getBorderStyle () {
        const cond = (this.isFocus && !this.errorHint) || this.isVisible
        return cond
          ? { borderColor: this.color }
          : null
      },
      dateTime () {
        return this.rangeMode ? this.getRangeDatesTime() : this.getDateTime()
      },
      dateFormatted () {
        return this.rangeMode ? this.getRangeDatesFormatted() : this.getDateFormatted()
      },
      hasDisabledTime () {
        return this.disableTime || this.rangeMode
      }
    },
    created () {
      if (this.value) {
        const val = this.rangeMode ? this.value : this.disableDate ? moment(`${moment().format('YYYY-MM-DD')} ${this.value}`) : moment(this.value).tz(this.timeZone)
        this.$emit('input', (this.rangeMode
          ? this.getRangeDatesTimeFormat(val)
          : this.getDateTimeFormat(val))
        )
      } else if (this.rangeMode) {
        this.$emit('input', this.getRangeDatesTimeFormat({}))
      }
      moment.tz(this.timeZone).locale(this.locale)
    },
    methods: {
      getDateTime () {
        const date = this.disableDate
          ? this.value ? moment(`${moment().tz(this.timeZone).format('YYYY-MM-DD')} ${this.value}`).tz(this.timeZone) : moment().tz(this.timeZone)
          : this.value ? moment(this.value).tz(this.timeZone) : moment().tz(this.timeZone)
        return nearestMinutes(this.minuteInterval, date, moment)
      },
      getDateTimeFormat (day) {
        return nearestMinutes(this.minuteInterval, day, moment).tz(this.timeZone).format(this.format)
      },
      getDateFormatted () {
        const date = this.value
          ? this.disableDate
            ? moment(`${moment().tz(this.timeZone).format('YYYY-MM-DD')} ${this.value}`).tz(this.timeZone)
            : moment(this.value).tz(this.timeZone)
          : null
        return date ? nearestMinutes(this.minuteInterval, date, moment).locale(this.locale).tz(this.timeZone).format(this.formatted) : null
      },
      getRangeDatesTime () {
        const hasStartValues = this.value && this.value.start
        const hasEndValues = this.value && this.value.end
        return { start: hasStartValues ? moment(this.value.start).tz(this.timeZone) : null, end: hasEndValues ? moment(this.value.end).tz(this.timeZone) : null }
      },
      getRangeDatesTimeFormat (day) {
        const { start, end } = day
        return {
          start: start ? moment(start).tz(this.timeZone).format(this.format) : null,
          end: end ? moment(end).tz(this.timeZone).format(this.format) : null
        }
      },
      getRangeDatesFormatted () {
        const hasStartValues = this.value && this.value.start
        const hasEndValues = this.value && this.value.end
        if (hasStartValues || hasEndValues) {
          const datesFormatted = hasStartValues ? `${moment(this.value.start).tz(this.timeZone).locale(this.locale).format(this.formatted)}` : '...'
          return hasEndValues ? `${datesFormatted} - ${moment(this.value.end).tz(this.timeZone).locale(this.locale).format(this.formatted)}` : `${datesFormatted} - ...`
        } else {
          return null
        }
      },
      changeDate (day) {
        this.$emit('input', (this.rangeMode ? this.getRangeDatesTimeFormat(day) : this.getDateTimeFormat(day)))
        if (this.autoClose && this.rangeMode && (day.end && day.start)) {
          this.hideDatePicker()
        } else if (this.autoClose && !this.rangeMode) {
          this.hideDatePicker()
        }
      },
      showDatePicker () {
        if (this.disabled) return
        this.setBodyOverflow(true)
        const rect = this.$refs.parent.getBoundingClientRect()
        const windowHeight = window.innerHeight
        let datePickerHeight = 428

        datePickerHeight = !this.enableButtonValidate ? 428 - 46 : datePickerHeight
        datePickerHeight = this.withoutHeader ? 428 - 65 : datePickerHeight

        const position = ((windowHeight - (rect.top + rect.height)) > datePickerHeight) || ((windowHeight - rect.top) > windowHeight / 2 + rect.height)
        this.agendaPosition = position ? 'top' : 'bottom'

        this.isVisible = true
      },
      hideDatePicker () {
        this.setBodyOverflow()
        this.isVisible = false
      },
      setBodyOverflow (value) {
        if (window.innerWidth < 412) {
          const body = document.getElementsByTagName('body')[0]
          body.style.overflow = value ? 'hidden' : null
        }
      },
      onFocus () {
        this.isFocus = true
        this.showDatePicker()
      },
      unFocus () {
        this.hideDatePicker()
        this.isFocus = false
      },
      validate () {
        this.unFocus()
      }
    }
  }
</script>

<style lang="scss">
  @import url('//fonts.googleapis.com/css?family=Roboto:400,500,700');
  @import "./assets/main.scss";
  .ctk-date-time-picker {
    width: 100%;
    margin: 0 auto;
    text-align: left;
    font-size: 14px;
    border-radius: 4px;
    position: relative;
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
      &.has-background {
        background: rgba(0, 0, 0, 0.4);
      }
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
        .field-label {
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
      &.is-disabled {
        .field-input {
          border-color: #CCC;
          background: #F2F2F2;
        }
        .field-label, .field-input {
          cursor: default;
        }
      }
    }
    .text-danger {
      color: orangered !important;
    }
    &.is-dark {
      .field-label{
        color: #ffffffb3;
      }
      .field-input{
        background-color: #424242;
        border-color: #ffffffb3;
        color: #ffffffb3;
      }
      ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
        color: #ffffffb3;
      }
      :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: #ffffffb3;
        opacity:  1;
      }
      ::-moz-placeholder { /* Mozilla Firefox 19+ */
        color: #ffffffb3;
        opacity:  1;
      }
      :-ms-input-placeholder { /* Internet Explorer 10-11 */
        color: #ffffffb3;
      }
      ::-ms-input-placeholder { /* Microsoft Edge */
        color: #ffffffb3;
      }
      ::placeholder { /* Most modern browsers support this now. */
        color: #ffffffb3;
      }
    }
  }

  @media screen and (max-width: 415px) {
    .time-picker-overlay {
      display: none;
    }
    .ctk-date-time-picker:not(.inline) {
      position: inherit !important;
    }
  }
</style>
