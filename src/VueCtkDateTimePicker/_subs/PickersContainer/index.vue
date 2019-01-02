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
        :style="responsivePosition"
        class="datepicker flex flex-direction-column"
      >
        <HeaderPicker
          v-if="!noHeader"
          v-model="value"
          :color="color"
          :only-time="onlyTime"
          :format="format"
          :time-format="timeFormat"
          :transition-name="transitionName"
          :no-time="onlyDate"
          :dark="dark"
          :range="range"
        />
        <div class="pickers-container flex">
          <!-- NEED 'YYYY-MM-DD' format -->
          <DatePicker
            v-if="!onlyTime"
            v-model="date"
            :dark="dark"
            :month="month"
            :inline="inline"
            :no-weekends-days="noWeekendsDays"
            :shortcuts-translations="shortcutsTranslations"
            :color="color"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled-dates="disabledDates"
            :range="range"
            :no-shortcuts="noShortcuts"
            :height="height"
            :first-day-of-week="firstDayOfWeek"
            :custom-shortcuts="customShortcuts"
            @change-month="changeMonth"
          />
          <!-- NEED 'HH:mm' format -->
          <TimePicker
            v-if="!onlyDate"
            ref="TimePicker"
            v-model="time"
            :dark="dark"
            :month="month"
            :color="color"
            :inline="inline"
            :format="timeFormat"
            :only-time="onlyTime"
            :minute-interval="minuteInterval"
            :visible="visible"
            :height="height"
            :disabled-hours="disabledHours"
          />
        </div>
        <ButtonValidate
          v-if="hasButtonValidate"
          :dark="dark"
          :button-color="buttonColor"
          :button-now-translation="buttonNowTranslation"
          class="button-validate flex-fixed"
          :only-time="onlyTime"
          :no-button-now="noButtonNow"
          :range="range"
          @validate="validate"
          @now="setNow"
        />
      </div>
    </div>
  </Transition>
</template>

<script>
  import moment from 'moment-timezone'

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
    props: {
      value: { type: [String, Object], default: String },
      visible: { type: Boolean, required: true, default: false },
      position: { type: String, default: 'bottom' },
      inline: { type: Boolean, default: false },
      dark: { type: Boolean, default: false },
      noHeader: { type: Boolean, default: Boolean },
      color: { type: String, default: String },
      onlyDate: { type: Boolean, default: false },
      onlyTime: { type: Boolean, default: Boolean },
      minuteInterval: { type: [String, Number], default: Number },
      format: { type: String, default: String },
      locale: { type: String, default: String },
      maxDate: { type: String, default: String },
      minDate: { type: String, default: String },
      hasButtonValidate: { type: Boolean, default: Boolean },
      noWeekendsDays: { type: Boolean, default: Boolean },
      disabledDates: { type: Array, default: Array },
      disabledHours: { type: Array, default: Array },
      range: { type: Boolean, default: Boolean },
      shortcutsTranslations: { type: Object, default: Object },
      noShortcuts: { type: Boolean, default: Boolean },
      buttonColor: { type: String, default: String },
      buttonNowTranslation: { type: String, default: String },
      noButtonNow: {type: Boolean, default: false},
      firstDayOfWeek: { type: Number, default: Number },
      customShortcuts: { type: Array, default: Array }
    },
    data () {
      return {
        month: this.getMonth(),
        transitionName: 'slidevnext'
      }
    },
    computed: {
      responsivePosition () {
        return !this.inline
          ? window.innerWidth < 412
            ? null
            : this.position === 'bottom'
              ? {top: '100%', marginBottom: '10px'}
              : {bottom: '100%', marginTop: '10px'}
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
          return this.value
            ? moment(this.value, 'YYYY-MM-DD HH:mm').format('HH:mm')
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
          const date = this.value
            ? this.onlyTime
              ? null
              : this.range
                ? { start: this.value.start ? moment(this.value.start).format('YYYY-MM-DD') : null,
                    end: this.value.end ? moment(this.value.end).format('YYYY-MM-DD') : null }
                : moment(this.value, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD')
            : this.range
              ? { start: null, end: null }
              : null
          return date
        }
      }
    },
    watch: {
      value (value) {
        this.month = this.getMonth(value)
      }
    },
    methods: {
      setNow (event) {
        this.$emit('input', event)
        this.validate()
      },
      emitValue (payload) {
        const dateTime = this.range ? payload.value : this.getDateTime(payload)
        this.$emit('input', dateTime)
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
          const rangeVal = payload || this.value
          const date = rangeVal && (rangeVal.end || rangeVal.start) ? moment(rangeVal.end ? rangeVal.end : rangeVal.start) : moment()
          return new Month(date.month(), date.year())
        } else if (this.value) {
          return new Month(moment(this.value, this.format).month(), moment(this.value, this.format).year(), this.locale)
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
      validate () {
        this.$emit('validate')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/VueCtkDateTimePicker/assets/animation.scss";
  .datetimepicker {
    position: absolute;
    z-index: 9;
    &.visible {
      z-index: 999;
    }
    .datepicker {
      font-family: 'Roboto', sans-serif;
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
    .pickers-container {
      -webkit-flex-direction: column;
      -ms-flex-direction: column;
      flex-direction: column;
      flex-flow: column;
      -moz-flex-direction: column;
    }
    .datetimepicker:not(.inline) {
      margin: 0 !important;
      position: absolute;
      top: 0 !important;
      bottom: 0;
      right: 0;
      left: 0;
      .datepicker {
        bottom: 0 !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100%;
        max-width: inherit;
        position: fixed;
        height: 100%;
        margin: 0 !important;
      }
    }
  }
</style>
