<template>
  <div
    :id="`${$attrs.id}-wrapper`"
    ref="parent"
    v-click-outside="() => { toggleDatePicker(false) }"
    class="date-time-picker"
  >
    <!-- Input -->
    <CustomInput
      v-if="hasInput"
      :id="`${$attrs.id}-input`"
      ref="custom-input"
      v-model="dateFormatted"
      :disabled="disabled"
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
      @clear="$emit('input', null)"
    />
    <slot v-else />

    <div
      v-if="hasPickerOpen && overlay"
      class="time-picker-overlay"
      @click.stop="toggleDatePicker(false)"
    />

    <!-- Date picker container -->
    <PickersContainer
      v-if="!disabled"
      :id="`${$attrs.id}-picker-container`"
      ref="agenda"
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
      :custom-shortcuts="customShortcuts"
      :no-keyboard="noKeyboard"
      :right="right"
      @validate="validate"
      @close="toggleDatePicker(false)"
    />
  </div>
</template>

<script>
  import moment from 'moment'
  import vClickOutside from 'v-click-outside'

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

  export default {
    name: 'VueCtkDateTimePicker',
    components: {
      CustomInput,
      PickersContainer
    },
    directives: {
      clickOutside: vClickOutside.directive
    },
    inheritAttrs: false,
    props,
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
      hasCustomElem () {
        return this.$slots.default
      },
      hasInput () {
        return !this.inline && !this.$slots.default
      },
      dateTime: {
        get () {
          const dateTime = this.range
            ? { start: this.value && this.value.start ? moment(this.value.start, this.formatOutput).format('YYYY-MM-DD') : null,
                end: this.value && this.value.end ? moment(this.value.end, this.formatOutput).format('YYYY-MM-DD') : null }
            : this.getDateTime()
          return dateTime
        },
        set (value) {
          if (this.autoClose && this.range && (value.end && value.start)) {
            this.toggleDatePicker(false)
          } else if (this.autoClose && !this.range) {
            this.toggleDatePicker(false)
          }
          const newValue = this.range ? this.getRangeDateToSend(value) : this.getDateTimeToSend(value)
          this.$emit('input', newValue)
          if (this.hasCustomElem && !this.noValueToCustomElem) {
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
      },
      locale (value) {
        updateMomentLocale(value, this.firstDayOfWeek)
      }
    },
    mounted () {
      updateMomentLocale(this.locale, this.firstDayOfWeek)
      this.pickerPosition = this.getPosition()
      this.pickerOpen = this.open
      if (this.hasCustomElem) {
        this.addEventToTriggerElement()
        if (!this.noValueToCustomElem) {
          this.setValueToCustomElem()
        }
      }
      if (this.format === 'YYYY-MM-DD hh:mm a' && this.onlyTime) {
        window.console.warn(`A (time) format must be indicated/ (Ex : format="HH:mm")`)
      }
    },
    beforeDestroy () {
      this.$emit('destroy')
      if (this.hasCustomElem) {
        this.addEventToTriggerElement()
      }
    },
    methods: {
      setValueToCustomElem () {
        const target = this.$slots.default[0]
        if (target) {
          if (target.tag === 'input') {
            target.elm.value = this.dateFormatted
          } else {
            target.elm.innerHTML = this.dateFormatted ? this.dateFormatted : this.label
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
          const datesFormatted = hasStartValues ? `${moment(this.value.start, this.formatOutput).set({ hour: 0, minute: 0, second: 0 }).format(this.formatted)}` : '...'
          return hasEndValues ? `${datesFormatted} - ${moment(this.value.end, this.formatOutput).set({ hour: 23, minute: 59, second: 59 }).format(this.formatted)}` : `${datesFormatted} - ...`
        } else {
          return null
        }
      },
      getDateFormatted () {
        const date = this.value
          ? moment(this.value, this.formatOutput).format(this.formatted)
          : null
        return date
      },
      getRangeDateToSend (payload) {
        const { start, end } = typeof payload !== 'undefined' ? payload : this.value
        return start || end
          ? { start: start ? moment(start, 'YYYY-MM-DD').set({ hour: 0, minute: 0, second: 0 }).format(this.formatOutput) : null,
              end: end ? moment(end, 'YYYY-MM-DD').set({ hour: 23, minute: 59, second: 59 }).format(this.formatOutput) : null,
              shortcut: payload.value }
          : { start: moment().format(this.formatOutput),
              end: moment().format(this.formatOutput),
              shortcut: payload.value }
      },
      getDateTimeToSend (value) {
        const dateTime = typeof value !== 'undefined' ? value : this.value
        const dateToSend = dateTime
          ? moment(dateTime, 'YYYY-MM-DD HH:mm')
          : null
        const dateTimeToSend = dateToSend ? nearestMinutes(this.minuteInterval, moment(dateToSend), 'YYYY-MM-DD HH:mm').format(this.formatOutput) : null
        return dateTimeToSend
      },
      getDateTime () {
        const date = this.value
          ? moment(this.value, this.formatOutput)
          : null
        return date ? nearestMinutes(this.minuteInterval, date, this.formatOutput).format('YYYY-MM-DD HH:mm') : null
      },
      toggleDatePicker (val) {
        if (this.disabled) return
        const isOpen = (val === false || val === true) ? val : !this.pickerOpen
        this.setBodyOverflow(isOpen)
        this.pickerOpen = isOpen
        this.$emit(isOpen ? 'is-shown' : 'is-hidden')
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
        this.toggleDatePicker(false)
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
