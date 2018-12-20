<template>
  <Transition
    :name="position === 'bottom' ? 'slide' : 'slideinvert'"
  >
    <div
      v-show="visible"
      :class="{'inline': inline, 'is-dark': dark}"
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
            :color="color"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled-dates="disabledDates"
            @change-month="changeMonth"
          />
          <!-- NEED 'HH:mm' format -->
          <TimePicker
            ref="TimePicker"
            v-if="!onlyDate"
            v-model="time"
            :dark="dark"
            :month="month"
            :color="color"
            :format="timeFormat"
            :only-time="onlyTime"
            :minute-interval="minuteInterval"
            :visible="visible"
            :disabled-hours="disabledHours"
          />
        </div>
        <ButtonValidate
          v-if="hasButtonValidate"
          :dark="dark"
          class="button-validate flex-fixed"
          @validate="validate"
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
      minuteInterval: { type: Number, default: Number },
      format: { type: String, default: String },
      locale: { type: String, default: String },
      maxDate: { type: String, default: String },
      minDate: { type: String, default: String },
      autoClose: { type: Boolean, default: Boolean },
      hasButtonValidate: { type: Boolean, default: Boolean },
      noWeekendsDays: { type: Boolean, default: false },
      disabledDates: { type: Array, default: Array },
      disabledHours: { type: Array, default: Array }
    },
    data () {
      return {
        month: this.getMonth(),
        transitionName: 'slidevnext'
      }
    },
    computed: {
      responsivePosition () {
        return window.innerWidth < 412
          ? null : this.position === 'bottom'
            ? {top: '100%', marginBottom: '10px'} : {bottom: '100%', marginTop: '10px'}
      },
      timeFormat () {
        return this.onlyTime
          ? this.format
          : this.getTimeFormat()
      },
      dateFormat () {
        return this.onlyTime
          ? null
          : this.getDateFormat()
      },
      time: {
        set (value) {
          this.emitValue({
            value: value,
            type: 'time'
          })
        },
        get () {
          return this.onlyTime
            ? moment(this.value, this.timeFormat).format('HH:mm')
            : moment(this.value).format('HH:mm')
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
          return this.onlyTime
            ? null
            : moment(this.value).format('YYYY-MM-DD')
        }
      }
    },
    methods: {
      emitValue (payload) {
        const date = !this.onlyTime
          ? payload.type === 'date'
            ? `${payload.value} ${this.time}`
            : `${this.date} ${payload.value}`
          : `${moment().format('YYYY-MM-DD')} ${payload.value}`
        const isBigger = moment(date) > moment(`${this.date || moment().format('YYYY-MM-DD')} ${this.time}`)
        this.transitionName = isBigger ? 'slidevnext' : 'slidevprev'
        this.$emit('input', date)
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
      getMonth () {
        const date = this.onlyTime
          ? moment(this.value, this.format)
          : moment(this.value)
        return new Month(date.month(), date.year())
      },
      changeMonth (val) {
        let month = this.month.month + (val === 'prev' ? -1 : +1)
        let year = this.month.year
        if (month > 11 || month < 0) {
          year += (val === 'prev' ? -1 : +1)
          month = (val === 'prev' ? 11 : 0)
        }
        this.month = new Month(month, year)
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
    .datepicker {
      font-family: 'Roboto', sans-serif;
      position: absolute;
      z-index: 5;
      border-radius: 4px;
      overflow: hidden;
      background: #FFF;
      -webkit-box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
      box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
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
