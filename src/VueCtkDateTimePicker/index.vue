<template>
  <div
    :id="id"
    ref="parent"
    v-click-outside="() => { pickerOpen = false }"
    class="date-time-picker"
  >
    <CustomInput
      ref="custom-input"
      v-model="dateFormatted"
      :disabled="disabled"
      :dark="dark"
      :hint="hint"
      :error-hint="errorHint"
      :is-focus="hasPickerOpen"
      :color="color"
      @click.native="toggleDatePicker"
    />
    <div
      v-if="hasPickerOpen && overlay"
      class="time-picker-overlay"
      @click.stop="toggleDatePicker"
    />
    <PickersContainer
      ref="agenda"
      v-model="dateTime"
      :visible="hasPickerOpen"
      :position="pickerPosition"
      :inline="inline"
      :color="color"
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
      :auto-close="autoClose"
      :range="range"
      :disabled-dates="disabledDates"
      :disabled-hours="disabledHours"
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
    return moment.tz.guess() || 'America/Los_Angeles'
  }

  const getDefaultLocale = () => {
    return (window.navigator.userLanguage || window.navigator.language || 'en').substr(0, 2)
  }

  // const nearestMinutes = (interval, someMoment, m) => {
  //   const roundedMinutes = Math.ceil(someMoment.minute() / interval) * interval
  //   return m(someMoment.clone().minute(roundedMinutes).second(0))
  // }

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
      label: { type: String, default: 'Select date & time' },
      hint: { type: String, default: String },
      errorHint: { type: Boolean, default: Boolean },
      value: { type: [String, Object], default: null },
      color: { type: String, default: String },
      id: { type: String, default: 'CtkDateTimePicker' },
      disabled: { type: Boolean, default: false },
      dark: { type: Boolean, default: false },
      overlay: { type: Boolean, default: false },
      inline: { type: Boolean, default: false },
      position: { type: String, default: null },
      locale: { type: String, default: getDefaultLocale() },
      timeZone: { type: String, default: getDefaultTZ() },
      formatted: { type: String, default: 'llll' },
      format: { type: String, default: 'YYYY-MM-DD HH:mm' },
      minuteInterval: { type: Number, default: 1 },
      minDate: { type: String, default: String },
      maxDate: { type: String, default: String },
      autoClose: {type: Boolean, default: false},
      onlyTime: { type: Boolean, default: false },
      onlyDate: { type: Boolean, default: false },
      noHeader: { type: Boolean, default: false },
      range: {type: Boolean, default: false},
      noInput: { type: Boolean, default: false },
      noWeekendsDays: {type: Boolean, default: false},
      noShortcuts: {type: Boolean, default: false},
      shortcutsTranslation: {type: Object, default: Object},
      disabledDates: { type: Array, default: Array },
      disabledHours: {type: Array, default: Array},
      open: {type: Boolean, default: false}
    },
    data () {
      return {
        pickerOpen: this.open,
        pickerPosition: this.position
      }
    },
    computed: {
      hasPickerOpen () {
        return this.pickerOpen
      },
      hasButtonValidate () {
        return !this.isInline && !this.autoClose
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
      hasOnlyDate () {
        return this.onlyDate || this.range
      },
      dateFormatted () {
        return this.onlyTime
          ? moment(this.value, this.format).format(this.formatted)
          : moment(this.value).format(this.formatted)
      },
      dateTime: {
        get () {
          const date = this.onlyTime
            ? moment(this.value, this.format).format('HH:mm')
            : moment(this.value).format('YYYY-MM-DD HH:mm')
          return date
        },
        set (value) {
          const date = moment(value).format(this.format)
          this.$emit('input', date)
        }
      }
    },
    watch: {
      open (val) {
        this.pickerOpen = val
      }
    },
    created () {
      moment.tz(this.timeZone)
      moment.locale(this.locale)
      // this.$emit('input', this.dateTime)
    },
    methods: {
      toggleDatePicker () {
        this.getPosition()
        this.pickerOpen = !this.pickerOpen
      },
      getPosition () {
        if (this.position) {
          this.pickerPosition = this.position
        } else {
          const rect = this.$refs.parent.getBoundingClientRect()
          const windowHeight = window.innerHeight
          let datePickerHeight = 428

          datePickerHeight = !this.enableButtonValidate ? 428 - 46 : datePickerHeight
          datePickerHeight = this.noHeader ? 428 - 65 : datePickerHeight

          const position = ((windowHeight - (rect.top + rect.height)) > datePickerHeight) || ((windowHeight - rect.top) > windowHeight / 2 + rect.height)
          this.pickerPosition = position ? 'top' : 'bottom'
        }
      },
      validate () {
        this.toggleDatePicker()
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
