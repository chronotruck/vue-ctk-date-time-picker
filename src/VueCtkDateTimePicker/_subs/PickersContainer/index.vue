<template>
  <Transition
    :name="position === 'bottom' ? 'slide' : 'slideinvert'"
  >
    <div
      v-show="visible || inline"
      :class="{'inline': inline, 'is-dark': dark, 'visible': visible}"
      :style="responsivePosition"
      class="datetimepicker flex"
      @click.stop
    >
      <div
        :style="[responsivePosition, width]"
        class="datepicker flex flex-direction-column"
        :class="{ 'right': right }"
      >
        <!-- eslint-disable vue/no-mutating-props -->
        <HeaderPicker
          v-if="!noHeader"
          :key="componentKey"
          v-model="modelValue"
          :color="color"
          :only-time="onlyTime"
          :format="format"
          :time-format="timeFormat"
          :transition-name="transitionName"
          :no-time="onlyDate"
          :dark="dark"
          :range="range"
        />
        <!--eslint-enable-->
        <div class="pickers-container flex">
          <!-- NEED 'YYYY-MM-DD' format -->
          <DatePicker
            v-if="!onlyTime"
            v-model="date"
            :id="$attrs.id"
            :dark="dark"
            :month="month"
            :inline="inline"
            :no-weekends-days="noWeekendsDays"
            :disabled-weekly="disabledWeekly"
            :color="color"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled-dates="disabledDates"
            :enabled-dates="enabledDates"
            :range="range"
            :no-shortcuts="noShortcuts"
            :height="height"
            :first-day-of-week="firstDayOfWeek"
            :visible="visible"
            :shortcut="shortcut"
            :custom-shortcuts="customShortcuts"
            :no-keyboard="noKeyboard"
            :locale="locale"
            @change-month="changeMonth"
            @change-year-month="changeYearMonth"
            @close="$emit('close')"
          />
          <!-- NEED 'HH:mm' format -->
          <TimePicker
            v-if="!onlyDate"
            ref="TimePicker"
            v-model="time"
            :dark="dark"
            :color="color"
            :inline="inline"
            :format="timeFormat"
            :only-time="onlyTime"
            :minute-interval="minuteInterval"
            :visible="visible"
            :height="height"
            :disabled-hours="disabledHours"
            :min-time="minTime"
            :max-time="maxTime"
            :behaviour="behaviour"
          />
        </div>
        <ButtonValidate
          v-if="!hasNoButton && !(inline && range)"
          class="button-validate flex-fixed"
          :dark="dark"
          :button-color="buttonColor"
          :button-now-translation="buttonNowTranslation"
          :only-time="onlyTime"
          :no-button-now="noButtonNow"
          :range="range"
          :has-button-validate="hasButtonValidate"
          @validate="$emit('validate')"
          @now="setNow"
        />
      </div>
    </div>
  </Transition>
</template>

<script>
  import moment from 'moment'

  import DatePicker from './_subs/DatePicker'
  import TimePicker from './_subs/TimePicker'
  import HeaderPicker from './_subs/HeaderPicker'
  import ButtonValidate from './_subs/ButtonValidate'

  import Month from '@/VueCtkDateTimePicker/modules/month'

  export default {
    name: 'PickersContainer',
    components: {
      DatePicker, TimePicker, HeaderPicker, ButtonValidate
    },
    inheritAttrs: false,
    props: {
      modelValue: { type: [String, Object], default: null },
      visible: { type: Boolean, required: true, default: false },
      position: { type: String, default: 'bottom' },
      inline: { type: Boolean, default: false },
      dark: { type: Boolean, default: false },
      noHeader: { type: Boolean, default: null },
      color: { type: String, default: null },
      onlyDate: { type: Boolean, default: false },
      onlyTime: { type: Boolean, default: null },
      minuteInterval: { type: [String, Number], default: 1 },
      format: { type: String, default: 'YYYY-MM-DD hh:mm a' },
      locale: { type: String, default: null },
      maxDate: { type: String, default: null },
      minDate: { type: String, default: null },
      hasButtonValidate: { type: Boolean, default: null },
      hasNoButton: { type: Boolean, default: null },
      noWeekendsDays: { type: Boolean, default: null },
      disabledWeekly: { type: Array, default: null },
      disabledDates: { type: Array, default: null },
      disabledHours: { type: Array, default: null },
      enabledDates: { type: Array, default: null },
      range: { type: Boolean, default: null },
      noShortcuts: { type: Boolean, default: null },
      buttonColor: { type: String, default: null },
      buttonNowTranslation: { type: String, default: null },
      noButtonNow: { type: Boolean, default: false },
      firstDayOfWeek: { type: Number, default: null },
      shortcut: { type: String, default: null },
      customShortcuts: { type: Array, default: null },
      noKeyboard: { type: Boolean, default: false },
      right: { type: Boolean, default: false },
      behaviour: { type: Object, default: () => ({}) }
    },
    emits: [
      'update:model-value',
      'close',
      'validate'
    ],
    data () {
      return {
        month: this.getMonth(),
        transitionName: 'slidevnext',
        componentKey: 0
      }
    },
    computed: {
      width () {
        const size = this.inline
          ? '100%'
          : this.onlyTime
            ? '160px'
            : !this.range
              ? this.onlyDate
                ? '260px'
                : '420px'
              : '400px'
        return {
          width: size,
          maxWidth: size,
          minWidth: size
        }
      },
      responsivePosition () {
        if (typeof window === 'undefined') return null

        return !this.inline
          ? window.innerWidth < 412
            ? null
            : this.position === 'bottom'
              ? { top: '100%', marginBottom: '10px' }
              : { bottom: '100%', marginTop: '10px' }
          : null
      },
      timeFormat () {
        return this.onlyTime
          ? this.format
          : this.onlyDate ? null : this.getTimeFormat()
      },
      dateFormat () {
        return this.onlyTime
          ? null
          : this.getDateFormat()
      },
      height () {
        return !this.onlyTime
          ? this.month
            ? (this.month.getMonthDays().length + this.month.getWeekStart()) > 35 ? 347 : 307
            : 180
          : 200
      },
      time: {
        set (value) {
          this.emitValue({
            value: value,
            type: 'time'
          })
        },
        get () {
          return this.modelValue
            ? moment(this.modelValue, 'YYYY-MM-DD HH:mm').format('HH:mm')
            : null
        }
      },
      date: {
        set (value) {
          this.emitValue({
            value: value,
            type: 'date'
          })
        },
        get () {
          const date = this.modelValue
            ? this.onlyTime
              ? null
              : this.range
                ? {
                  start: this.modelValue.start ? moment(this.modelValue.start).format('YYYY-MM-DD') : null,
                  end: this.modelValue.end ? moment(this.modelValue.end).format('YYYY-MM-DD') : null
                }
                : moment(this.modelValue, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD')
            : this.range
              ? { start: null, end: null }
              : null
          return date
        }
      },
      minTime () {
        const time = moment(this.minDate).format(this.timeFormat)
        if (
          this.minDate &&
          time !== '00:00' &&
          moment(this.date).isSame(moment(this.minDate, 'YYYY-MM-DD'))
        ) {
          return time
        }
        return ''
      },
      maxTime () {
        const time = moment(this.maxDate).format(this.timeFormat)
        if (this.maxDate &&
          time !== '00:00' &&
          moment(this.date).isSame(moment(this.maxDate, 'YYYY-MM-DD'))) {
          return time
        }
        return ''
      }
    },
    watch: {
      modelValue (value) {
        this.month = this.getMonth(value)
      },
      locale () {
        this.month = this.getMonth()
        this.componentKey += 1
      }
    },
    methods: {
      setNow (event) {
        this.$emit('update:model-value', event)
        this.$emit('close')
      },
      emitValue (payload) {
        const dateTime = this.range ? payload.value : this.getDateTime(payload)
        this.$emit('update:model-value', dateTime)
        if (!this.range) {
          this.getTransitionName(dateTime)
        }
      },
      getDateTime ({ value, type }) {
        return this.onlyTime
          ? `${moment().format('YYYY-MM-DD')} ${value}`
          : type === 'date'
            ? this.time ? `${value} ${this.time}` : `${value} ${moment().format('HH:mm')}`
            : this.date ? `${this.date} ${value}` : `${moment().format('YYYY-MM-DD')} ${value}`
      },
      getTransitionName (date) {
        const isBigger = moment(date) > moment(`${this.date || moment().format('YYYY-MM-DD')} ${this.time || moment().format('HH:mm')}`)
        this.transitionName = isBigger ? 'slidevnext' : 'slidevprev'
      },
      getDateFormat () {
        const hasTime = this.format.includes('T')
        return hasTime ? this.format.split('T')[0] : this.format.split(' ')[0]
      },
      getTimeFormat () {
        const formatLower = this.format.toLowerCase()
        const hasTimeFormat = formatLower.includes('h')
        if (hasTimeFormat) {
          const hasTime = this.format.includes('T')
          return hasTime ? this.format.split('T')[1] : this.format.split(' ').slice(1).join(' ')
        } else {
          window.console.warn('A time format must be indicated')
        }
      },
      getMonth (payload) {
        if (this.range) {
          const rangeVal = payload || this.modelValue
          const date = rangeVal && (rangeVal.end || rangeVal.start) ? moment(rangeVal.end ? rangeVal.end : rangeVal.start) : moment()
          return new Month(date.month(), date.year())
        } else if (this.modelValue) {
          return new Month(moment(this.modelValue, 'YYYY-MM-DD').month(), moment(this.modelValue, 'YYYY-MM-DD').year(), this.locale)
        } else {
          return new Month(moment().month(), moment().year(), this.locale)
        }
      },
      changeMonth (val) {
        let month = this.month.month + (val === 'prev' ? -1 : +1)
        let year = this.month.year
        if (month > 11 || month < 0) {
          year += (val === 'prev' ? -1 : +1)
          month = (val === 'prev' ? 11 : 0)
        }
        this.month = new Month(month, year, this.locale)
        if (this.$refs.TimePicker) {
          this.$refs.TimePicker.initPositionView()
        }
      },
      changeYearMonth ({ month, year }) {
        this.month = new Month(month, year, this.locale)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .datetimepicker {
    position: absolute;
    z-index: 9;
    width: 100%;
    &.visible {
      z-index: 999;
    }
    .datepicker {
      position: absolute;
      z-index: 5;
      border-radius: 4px;
      overflow: hidden;
      background: #FFF;
      -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      max-width: 400px;
      .pickers-container {
        background: #FFF;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      &.right {
        right: 0;
      }
    }
    &.is-dark {
      .datepicker, .pickers-container {
        background: #424242;
        border: 0;
      }
    }
  }
  .inline {
    &.datetimepicker, .datepicker {
      position: relative;
    }
    .datepicker {
      margin-bottom: 0 !important;
      box-shadow: none;
      -webkit-box-shadow: none;
      width: 100%;
      max-width: 100%;
      background-color: white;
    }
  }
  @media screen and (max-width: 415px) {
    $header-size: 58px;
    $footer-size: 41px;

    .pickers-container {
      -webkit-flex-direction: column;
      -ms-flex-direction: column;
      flex-direction: column;
      flex-flow: column;
      -moz-flex-direction: column;
      height: 100%;
    }

    .datepicker-container {
      width: 100%;

      &.has-shortcuts {
        flex-direction: column;
      }
    }

    .datetimepicker:not(.inline) {
      margin: 0 !important;
      position: absolute;
      top: 0 !important;
      bottom: 0;
      right: 0;
      left: 0;

      .pickers-container {
        height: calc(100% - #{$header-size} - #{$footer-size});
      }

      .datepicker {
        border-radius: 0 !important;
        bottom: 0 !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        max-width: inherit !important;
        min-width: inherit !important;
        position: fixed;
        height: 100%;
        margin: 0 !important;
      }
    }
  }
</style>
