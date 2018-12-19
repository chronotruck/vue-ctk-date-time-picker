<template>
  <transition
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
        class="datepicker flex flex-direction-column">
        <header-picker
          v-if="!noHeader"
          :color="color"
          :date-time="dateTime"
          :only-time="onlyTime"
          :format="format"
          :transitionName="transitionName"
        />
        <div class="pickers-container flex">
          <date-picker
            v-if="!onlyTime"
            :date-time="dateTime"
            :dark="dark"
            :month="month"
            :inline="inline"
            :no-weekends-days="noWeekendsDays"
            :color="color"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled-dates="disabledDates"
            @change-date="selectDate"
            @change-month="changeMonth"
          />
          <time-picker
            v-if="!onlyDate"
            ref="timePickerComponent"
            :date-time="dateTime"
            :dark="dark"
            :month="month"
            :color="color"
            :format="format"
            :only-time="onlyTime"
            :minute-interval="minuteInterval"
            :visible="visible"
            :disabled-hours="disabledHours"
            @change-time="selectTime"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import DatePicker from './_subs/DatePicker'
  import TimePicker from './_subs/TimePicker'
  import HeaderPicker from './_subs/HeaderPicker'
  
  import Month from '@/VueCtkDateTimePicker/modules/month'

  export default {
    name: 'PickersContainer',
    props: {
      value: { type: [String, Object], default: String },
      visible: { type: Boolean, required: true, default: false },
      position: { type: String, default: 'bottom' },
      inline: { type: Boolean, default: false },
      dark: { type: Boolean, default: false },
      noHeader: { type: Boolean, default: Boolean },
      color: { type: String, default: String },
      dateTime: { type: Object, default: Object },
      onlyDate: { type: Boolean, default: false },
      onlyTime: { type: Boolean, default: Boolean },
      minuteInterval: { type: Number, default: Number },
      format: { type: String, default: String },
      locale: { type: String, default: String },
      maxDate: { type: String, default: String },
      minDate: { type: String, default: String },
      autoClose: { type: Boolean, default: Boolean },
      enableButtonValidate: { type: Boolean, default: Boolean },
      noWeekendsDays: { type: Boolean, default: false },
      disabledDates: { type: Array, default: Array },
      disabledHours: { type: Array, default: Array }
    },
    components: {
      DatePicker, TimePicker, HeaderPicker
    },
    data () {
      return {
        month: this.getMonth(),
        timeWidth: !this.disableTime ? this.getTimePickerWidth() : null,
        transitionName: 'slidevnext'
      }
    },
    computed: {
      responsivePosition () {
        return window.innerWidth < 412
          ? null : this.position === 'bottom'
            ? {top: '100%', marginBottom: '10px'} : {bottom: '100%', marginTop: '10px'}
      }
    },
    methods: {
      getMonth () {
        const date = this.dateTime
        return new Month(date.month(), date.year())
      },
      selectTime (dateTime) {
        const isBigger = dateTime > this.dateTime
        this.transitionName = isBigger ? 'slidevnext' : 'slidevprev'
        this.$emit('change-date', dateTime)
      },
      selectDate (dateTime) {
        const isBefore = dateTime.isBefore(this.dateTime)
        this.transitionName = isBefore ? 'slidevprev' : 'slidevnext'
        const date = this.dateTime
        dateTime.add(date.hour(), 'hours')
        dateTime.add(date.minute(), 'minutes')
        this.$emit('change-date', dateTime)
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
      getTimePickerWidth () {
        const timePickerComponentPresent = this.$refs.timePickerComponent && this.$refs.timePickerComponent.$el.clientWidth
        const width = timePickerComponentPresent ? this.$refs.timePickerComponent.$el.clientWidth : 160
        const result = {
          flex: `0 0 ${width}px`,
          width: `${width}px`,
          minWidth: `${width}px`,
          maxWidth: `${width}px`
        }
        return result
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
