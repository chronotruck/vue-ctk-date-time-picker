<template>
  <div
    ref="parent"
    v-click-outside="closePicker"
    :id="`${$attrs.id}-wrapper`"
    class="date-time-picker"
  >
    <!-- Input -->
    <CustomInput
      v-if="hasInput"
      ref="custom-input"
      v-model="dateFormatted"
      v-bind="$attrs"
      :id="`${$attrs.id}-input`"
      :dark="dark"
      :hint="hint"
      :error-hint="error"
      :is-focus="hasPickerOpen"
      :color="color"
      :label="label"
      :no-label="noLabel"
      :input-size="inputSize"
      :no-clear-button="noClearButton"
      @focus="toggleDatePicker(true)"
      @clear="$emit('update:model-value', null)"
    />
    <slot
      v-else
      :dateFormatted="dateFormatted"
      :toggleDatePicker="toggleDatePicker"
      :isOpen="hasPickerOpen"
      :close="closePicker"
    />

    <div
      v-if="hasPickerOpen && overlay"
      class="time-picker-overlay"
      @click.stop="closePicker"
    />

    <!-- Date picker container -->
    <PickersContainer
      v-if="!isDisabled"
      ref="agenda"
      v-model="dateTime"
      :id="`${$attrs.id}-picker-container`"
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
      :disabled-weekly="disabledWeekly"
      :has-button-validate="hasButtonValidate"
      :has-no-button="hasNoButton"
      :range="range"
      :disabled-dates="disabledDates"
      :disabled-hours="disabledHours"
      :enabled-dates="enabledDates"
      :no-shortcuts="noShortcuts"
      :button-now-translation="buttonNowTranslation"
      :no-button-now="noButtonNow"
      :first-day-of-week="firstDayOfWeek"
      :shortcut="shortcut"
      :custom-shortcuts="customShortcuts"
      :no-keyboard="noKeyboard"
      :right="right"
      :behaviour="_behaviour"
      @validate="validate"
      @close="closePicker"
    />
  </div>
</template>

<script>
  import moment from 'moment'
  import { directive as vClickOutside } from './directives/click-outside'

  import CustomInput from './_subs/CustomInput'
  import PickersContainer from './_subs/PickersContainer'

  import props from './props'

  const updateMomentLocale = (locale, firstDayOfWeek) => {
    moment.locale(locale)
    if (firstDayOfWeek) {
      const firstDayNumber = Number.isInteger(firstDayOfWeek) && firstDayOfWeek === 0
        ? 7
        : firstDayOfWeek || moment.localeData(locale).firstDayOfWeek()
      moment.updateLocale(locale, {
        week: {
          dow: firstDayNumber
        }
      })
    }
  }

  const nearestMinutes = (interval, date, format) => {
    const roundedMinutes = Math.ceil(date.minute() / interval) * interval
    return moment(date.clone().minute(roundedMinutes).second(0), format)
  }

  /**
   * Object containing the default behaviour values of the calendar.
   * Those values can be overrided by the `behaviour` property.
   * @const defaultBehaviour
   */
  const defaultBehaviour = {
    time: {
      nearestIfDisabled: true
    }
  }

  export default {
    name: 'VueCtkDateTimePicker',
    components: {
      CustomInput,
      PickersContainer
    },
    directives: {
      clickOutside: vClickOutside
    },
    inheritAttrs: false,
    props,
    emits: [
      'update:model-value',
      'formatted-value',
      'destroy',
      'is-hidden',
      'is-shown',
      'validate'
    ],
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
      hasNoButton () {
        return this.noButton
      },
      hasButtonValidate () {
        return !this.inline && !this.autoClose
      },
      hasOnlyDate () {
        return this.onlyDate || this.range
      },
      dateFormatted () {
        const dateFormatted = this.range
          ? this.getRangeDatesFormatted(this.locale)
          : this.getDateFormatted(this.locale)
        this.$emit('formatted-value', dateFormatted)
        return dateFormatted
      },
      hasInput () {
        return !this.inline && !this.$slots.default
      },
      dateTime: {
        get () {
          const dateTime = this.range
            ? {
              start: this.modelValue && this.modelValue.start ? moment(this.modelValue.start, this.formatOutput).format('YYYY-MM-DD') : null,
              end: this.modelValue && this.modelValue.end ? moment(this.modelValue.end, this.formatOutput).format('YYYY-MM-DD') : null
            }
            : this.getDateTime()
          return dateTime
        },
        set (value) {
          if (this.autoClose && this.range && (value.end && value.start)) {
            this.closePicker()
          } else if (this.autoClose && !this.range) {
            this.closePicker()
          }
          const newValue = this.range ? this.getRangeDateToSend(value) : this.getDateTimeToSend(value)
          this.$emit('update:model-value', newValue)
        }
      },
      formatOutput () {
        return this.outputFormat || this.format
      },
      /**
       * Returns true if the field is disabled
       * @function isDisabled
       * @returns {boolean}
       */
      isDisabled () {
        return typeof this.$attrs.disabled !== 'undefined' && this.$attrs.disabled !== false
      },
      /**
       * Returns the behaviour object with the overrided values
       * @function _behaviour
       * @returns {Object}
       */
      _behaviour () {
        const { time } = defaultBehaviour

        return {
          time: {
            ...time,
            ...this.behaviour.time
          }
        }
      }
    },
    watch: {
      open (val) {
        if (this.isDisabled) return
        this.pickerOpen = val
      },
      locale (value) {
        updateMomentLocale(value, this.firstDayOfWeek)
      }
    },
    created () {
      updateMomentLocale(this.locale, this.firstDayOfWeek)
    },
    mounted () {
      this.pickerPosition = this.getPosition()
      this.pickerOpen = this.open
      if (this.format === 'YYYY-MM-DD hh:mm a' && this.onlyTime) {
        console.warn('A (time) format must be indicated/ (Ex : format="HH:mm")')
      }
    },
    beforeUnmount () {
      this.$emit('destroy')
    },
    methods: {
      getRangeDatesFormatted () {
        const hasStartValues = this.modelValue && this.modelValue.start
        const hasEndValues = this.modelValue && this.modelValue.end
        if (hasStartValues || hasEndValues) {
          const datesFormatted = hasStartValues ? `${moment(this.modelValue.start, this.formatOutput).set({ hour: 0, minute: 0, second: 0 }).format(this.formatted)}` : '...'
          return hasEndValues ? `${datesFormatted} - ${moment(this.modelValue.end, this.formatOutput).set({ hour: 23, minute: 59, second: 59 }).format(this.formatted)}` : `${datesFormatted} - ...`
        } else {
          return null
        }
      },
      getDateFormatted () {
        const date = this.modelValue
          ? moment(this.modelValue, this.formatOutput).format(this.formatted)
          : null
        return date
      },
      getRangeDateToSend (payload) {
        const { start, end } = typeof payload !== 'undefined' ? payload : this.modelValue
        return start || end
          ? {
            start: start ? moment(start, 'YYYY-MM-DD').set({ hour: 0, minute: 0, second: 0 }).format(this.formatOutput) : null,
            end: end ? moment(end, 'YYYY-MM-DD').set({ hour: 23, minute: 59, second: 59 }).format(this.formatOutput) : null,
            shortcut: payload.value
          }
          : {
            start: moment().format(this.formatOutput),
            end: moment().format(this.formatOutput),
            shortcut: payload.value
          }
      },
      getDateTimeToSend (value) {
        const dateTime = typeof value !== 'undefined' ? value : this.modelValue
        const dateToSend = dateTime
          ? moment(dateTime, 'YYYY-MM-DD HH:mm')
          : null
        const dateTimeToSend = dateToSend ? nearestMinutes(this.minuteInterval, moment(dateToSend), 'YYYY-MM-DD HH:mm').format(this.formatOutput) : null
        return dateTimeToSend
      },
      getDateTime () {
        const date = this.modelValue
          ? moment(this.modelValue, this.formatOutput)
          : null
        return date ? nearestMinutes(this.minuteInterval, date, this.formatOutput).format('YYYY-MM-DD HH:mm') : null
      },
      /**
       * Closes the datepicker
       * @function closePicker
       */
      closePicker () {
        if (this.pickerOpen) {
          this.$emit('is-hidden')
          this.pickerOpen = false
          this.setBodyOverflow(false)
        }
      },
      toggleDatePicker (val) {
        if (this.isDisabled) return
        const isOpen = (val === false || val === true) ? val : !this.pickerOpen
        this.setBodyOverflow(isOpen)
        this.pickerOpen = isOpen

        if (isOpen) {
          this.$emit('is-shown')
        }

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
          const parentRect = this.$refs.parent.getBoundingClientRect()
          const windowHeight = window.innerHeight
          let datePickerHeight = 445

          datePickerHeight = this.noButton ? datePickerHeight - 41 : datePickerHeight
          datePickerHeight = this.noHeader ? datePickerHeight - 58 : datePickerHeight
          if (parentRect.top < datePickerHeight) {
            // No place on top --> bottom
            return 'bottom'
          } else if (windowHeight - (parentRect.height + datePickerHeight + parentRect.top) >= 0) {
            // Have place on bottom --> bottom
            return 'bottom'
          } else {
            // No place on bottom --> top
            return 'top'
          }
        }
      },
      validate () {
        this.$emit('validate')
        this.closePicker()
      }
    }
  }
</script>

<style lang="scss">
  @import "./assets/main.scss";
  .date-time-picker {
    width: 100%;
    margin: 0 auto;
    text-align: left;
    font-size: 14px;
    border-radius: 4px;
    position: relative;
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
