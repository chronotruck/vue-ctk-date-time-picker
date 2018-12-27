<template>
  <div
    :id="id"
    ref="parent"
    v-click-outside="() => { pickerOpen = false }"
    class="date-time-picker"
  >
    <CustomInput
      v-if="hasInput"
      ref="custom-input"
      v-model="dateFormatted"
      :disabled="disabled"
      :dark="dark"
      :hint="hint"
      :error-hint="error"
      :is-focus="hasPickerOpen"
      :color="color"
      :label="label"
      :input-size="inputSize"
      @click.native="toggleDatePicker(true)"
    />
    <slot v-else />
    <div
      v-if="hasPickerOpen && overlay"
      class="time-picker-overlay"
      @click.stop="toggleDatePicker(false)"
    />
    <PickersContainer
      ref="agenda"
      v-if="!disabled"
      v-model="dateTime"
      :visible="hasPickerOpen"
      :position="pickerPosition"
      :inline="inline"
      :color="color"
      :button-color="buttonColor"
      :dark="dark"
      :no-header="noHeader"
      :only-time="onlyTime"
      :only-date="hasOnlyDate"
      :minute-interval="minuteInterval"
      :locale="locale"
      :min-date="minDate"
      :max-date="maxDate"
      :format="format"
      :no-weekends-days="noWeekendsDays"
      :has-button-validate="hasButtonValidate"
      :range="range"
      :disabled-dates="disabledDates"
      :disabled-hours="disabledHours"
      :shortcuts-translations="shortcutsTranslations"
      :no-shortcuts="noShortcuts"
      :button-now-translation="buttonNowTranslation"
      :no-button-now="noButtonNow"
      @validate="validate"
    />
  </div>
</template>

<script>
  import moment from 'moment-timezone'
  import vClickOutside from 'v-click-outside'

  import CustomInput from './_subs/CustomInput'
  import PickersContainer from './_subs/PickersContainer'

  const getDefaultTZ = () => {
    const tz = moment.tz.guess() || 'America/Los_Angeles'
    moment.locale(tz)
    return tz
  }

  const getDefaultLocale = () => {
    const locale = (window.navigator.userLanguage || window.navigator.language || 'en').substr(0, 2)
    moment.locale(locale)
    return locale
  }

  const nearestMinutes = (interval, date) => {
    const roundedMinutes = Math.ceil(date.minute() / interval) * interval
    return moment(date.clone().minute(roundedMinutes).second(0))
  }

  export default {
    name: 'VueCtkDateTimePicker',
    components: {
      CustomInput,
      PickersContainer
    },
    directives: {
      clickOutside: vClickOutside.directive
    },
    props: {
      value: { type: [String, Object], default: null },
      label: { type: String, default: 'Select date & time' },
      hint: { type: String, default: String },
      error: { type: Boolean, default: Boolean },
      color: { type: String, default: 'dodgerblue' },
      buttonColor: { type: String, default: String },
      id: { type: String, default: 'DateTimePicker' },
      disabled: { type: Boolean, default: false },
      dark: { type: Boolean, default: false },
      overlay: { type: Boolean, default: false },
      inline: { type: Boolean, default: false },
      position: { type: String, default: String },
      locale: { type: String, default: getDefaultLocale() },
      timeZone: { type: String, default: getDefaultTZ() },
      formatted: { type: String, default: 'llll' },
      format: { type: String, default: 'YYYY-MM-DD hh:mm a' },
      outputFormat: { type: String, default: String },
      minuteInterval: { type: [String, Number], default: 1 },
      minDate: { type: String, default: String },
      maxDate: { type: String, default: String },
      autoClose: { type: Boolean, default: false },
      onlyTime: { type: Boolean, default: false },
      onlyDate: { type: Boolean, default: false },
      noHeader: { type: Boolean, default: false },
      range: {type: Boolean, default: false},
      noWeekendsDays: { type: Boolean, default: false },
      noShortcuts: { type: Boolean, default: false },
      noButton: { type: Boolean, default: false },
      shortcutsTranslations: { type: Object, default: Object },
      disabledDates: { type: Array, default: Array },
      disabledHours: {type: Array, default: Array},
      open: { type: Boolean, default: false },
      persistent: { type: Boolean, default: false },
      inputSize: { type: String, default: String },
      buttonNowTranslation: { type: String, default: String },
      noButtonNow: {type: Boolean, default: false}
    },
    data () {
      return {
        pickerOpen: false,
        pickerPosition: this.position
      }
    },
    computed: {
      hasPickerOpen () {
        return this.persistent || this.pickerOpen
      },
      hasButtonValidate () {
        return !this.inline && !this.autoClose && !this.noButton
      },
      hasOnlyDate () {
        return this.onlyDate || this.range
      },
      dateFormatted () {
        return this.range
          ? this.getRangeDatesFormatted()
          : this.getDateFormatted()
      },
      hasCustomElem () {
        return this.$slots.default
      },
      hasInput () {
        return !this.inline && !this.$slots.default
      },
      dateTime: {
        get () {
          const dateTime = this.range
            ? this.value
            : this.getDateTime()
          return dateTime
        },
        set (value) {
          if (this.autoClose && this.range && (value.end && value.start)) {
            this.toggleDatePicker()
          } else if (this.autoClose && !this.range) {
            this.toggleDatePicker()
          }
          const newValue = this.range ? this.getRangeDateToSend(value) : this.getDateTimeToSend(value)
          this.$emit('input', newValue)
          if (this.hasCustomElem) {
            this.$nextTick(() => {
              this.setValueToCustomElem()
            })
          }
        }
      },
      formatOutput () {
        return this.outputFormat || this.format
      }
    },
    watch: {
      open (val) {
        if (this.disabled) return
        this.pickerOpen = val
      }
    },
    mounted () {
      this.pickerPosition = this.getPosition()
      this.pickerOpen = this.open
      if (this.hasCustomElem) {
        this.addEventToTriggerElement()
        this.setValueToCustomElem()
      }
    },
    methods: {
      setValueToCustomElem () {
        const target = this.$slots.default[0]
        if (target) {
          if (target.tag === 'button') {
            target.elm.innerHTML = this.dateFormatted
          } else {
            target.elm.value = this.dateFormatted
          }
        } else {
          window.console.warn(`Impossible to find custom element`)
        }
      },
      addEventToTriggerElement () {
        const target = this.$slots.default[0].elm
        if (target) {
          target.addEventListener('click', () => {
            this.toggleDatePicker()
          })
        } else {
          window.console.warn(`Impossible to find custom element`)
        }
      },
      getRangeDatesFormatted () {
        const hasStartValues = this.value && this.value.start
        const hasEndValues = this.value && this.value.end
        if (hasStartValues || hasEndValues) {
          const datesFormatted = hasStartValues ? `${moment(this.value.start).format(this.formatted)}` : '...'
          return hasEndValues ? `${datesFormatted} - ${moment(this.value.end).format(this.formatted)}` : `${datesFormatted} - ...`
        } else {
          return null
        }
      },
      getDateFormatted () {
        const date = this.value
          ? moment(this.value, this.format).format(this.formatted)
          : null
        return date
      },
      getRangeDateToSend (payload) {
        const { start, end } = typeof payload !== 'undefined' ? payload : this.value
        return start || end
          ? { start: start ? moment(start).format('YYYY-MM-DD') : null,
              end: end ? moment(end).format('YYYY-MM-DD') : null }
          : { start: moment().format('YYYY-MM-DD'),
              end: moment().format('YYYY-MM-DD') }
      },
      getDateTimeToSend (value) {
        const dateTime = typeof value !== 'undefined' ? value : this.value
        const dateToSend = dateTime
          ? moment(dateTime)
          : null
        return dateToSend ? nearestMinutes(this.minuteInterval, moment(dateToSend)).format(this.formatOutput) : null
      },
      getDateTime () {
        const date = this.value
          ? moment(this.value, this.format)
          : null
        return date ? nearestMinutes(this.minuteInterval, date).format('YYYY-MM-DD HH:mm') : null
      },
      toggleDatePicker (val) {
        if (this.disabled) return
        const isOpen = val || !this.pickerOpen
        this.setBodyOverflow(isOpen)
        this.pickerOpen = isOpen
        if (this.pickerOpen && !this.position) {
          this.pickerPosition = this.getPosition()
        }
      },
      setBodyOverflow (value) {
        if (window.innerWidth < 412) {
          const body = document.getElementsByTagName('body')[0]
          body.style.overflow = value ? 'hidden' : null
        }
      },
      getPosition () {
        if (this.position) {
          return this.position
        } else {
          const rect = this.$refs.parent.getBoundingClientRect()
          const windowHeight = window.innerHeight
          let datePickerHeight = 428

          datePickerHeight = !this.noButton ? 428 - 46 : datePickerHeight
          datePickerHeight = this.noHeader ? 428 - 65 : datePickerHeight

          const position = ((windowHeight - (rect.top + rect.height)) > datePickerHeight) || ((windowHeight - rect.top) > windowHeight / 2 + rect.height)
          return position ? 'top' : 'bottom'
        }
      },
      validate () {
        this.toggleDatePicker()
      }
    },
    beforeDestroy () {
      if (this.hasCustomElem) {
        const target = this.$slots.default[0].elm
        target.addEventListener('click', () => {
          this.toggleDatePicker()
        })
      }
    }
  }
</script>

<style lang="scss">
  @import url('//fonts.googleapis.com/css?family=Roboto:400,500,700');
  @import "./assets/main.scss";
  .date-time-picker {
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
      background: rgba(0, 0, 0, 0.4);
    }
  }

  @media screen and (max-width: 415px) {
    .time-picker-overlay {
      display: none;
    }
    .date-time-picker:not(.inline) {
      position: inherit !important;
    }
  }
</style>
