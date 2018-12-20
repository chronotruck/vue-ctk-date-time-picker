<template>
  <Transition
    :name="agendaPosition === 'top' ? 'slide' : 'slideinvert'"
  >
    <div
      v-show="visible || inline"
      :class="{'inline': inline, 'is-dark': dark, 'has-validate-button': enableButtonValidate}"
      :style="position"
      class="datetimepicker flex"
      @click.stop
    >
      <div
        :style="position"
        class="datepicker flex flex-direction-column"
      >
        <div
          v-if="withoutHeader"
          :style="bgStyle"
          class="datepicker-header"
        >
          <div
            v-if="!disableDate"
            class="datepicker-year"
          >
            <TransitionGroup :name="transitionDayName">
              <div
                v-for="y in [year]"
                :key="y"
              >
                {{ y }}
              </div>
            </TransitionGroup>
          </div>

          <div class="flex justify-content-between">
            <TransitionGroup
              v-if="!disableDate"
              :name="transitionDayName"
              class="datepicker-date dots-text flex-1"
            >
              <span
                v-for="dateFormatted in [getDateFormatted()]"
                :key="dateFormatted"
              >
                {{ getDateFormatted() }}
              </span>
            </TransitionGroup>
            <div
              v-if="!disableTime && !isFormatTwelve"
              :style="timeWidth"
              class="datepicker-time flex justify-content-center"
            >
              <TransitionGroup
                :name="transitionDayName"
                class="dots-text datepicker-hour flex-1 flex justify-content-right"
              >
                <span
                  v-for="hour in [dateTime.format('HH')]"
                  :key="hour"
                >
                  {{ hour }}
                </span>
              </TransitionGroup>
              <span>:</span>
              <TransitionGroup
                :name="transitionDayName"
                class="dots-text datepicker-minute flex-1 flex justify-content-left"
              >
                <span
                  v-for="min in [dateTime.format('mm')]"
                  :key="min"
                >
                  {{ min }}
                </span>
              </TransitionGroup>
            </div>
            <div
              v-else-if="!disableTime"
              :style="timeWidth"
              class="datepicker-time flex"
            >
              <TransitionGroup
                :name="transitionDayName"
                :class="{'justify-content-center': disableDate}"
                class="dots-text datepicker-hour flex-1 flex"
              >
                <span
                  v-for="hour in [dateTime.format(timeFormat)]"
                  :key="hour"
                >
                  {{ hour }}
                </span>
              </TransitionGroup>
            </div>
          </div>
        </div>
        <div class="datetimepicker-container flex">
          <CtkDatePicker
            v-if="!disableDate"
            :inline="inline"
            :no-weekends-days="noWeekendsDays"
            :month="month"
            :date-time="dateTime"
            :locale="locale"
            :color="color"
            :min-date="minDate"
            :max-date="maxDate"
            :disabled-dates="disabledDates"
            :dark="dark"
            @change-date="selectDate"
            @change-month="changeMonth"
          />

          <CtkTimePicker
            v-if="!disableTime"
            ref="timePickerComponent"
            :month="month"
            :date-time="dateTime"
            :color="color"
            :format="timeFormat"
            :disable-date="disableDate"
            :minute-interval="minuteInterval"
            :visible="visible"
            :value="value"
            :dark="dark"
            :disabled-hours="disabledHours"
            @change-time="selectTime"
          />
        </div>
        <CtkButtonValidate
          v-if="enableButtonValidate"
          :dark="dark"
          class="button-validate flex-fixed"
          @validate="validate"
        />
      </div>
    </div>
  </Transition>
</template>

<script>
  import CtkTimePicker from './_subs/CtkTimePicker.vue'
  import CtkDatePicker from './_subs/CtkDatePicker.vue'
  import CtkButtonValidate from './_subs/CtkButtonValidate'
  import Month from './../modules/month'
  import moment from 'moment'
  export default {
    name: 'CtkDatePickerAgenda',
    components: {
      CtkTimePicker,
      CtkDatePicker,
      CtkButtonValidate
    },
    props: {
      dateTime: { type: Object, default: Object },
      visible: { type: Boolean, required: true, default: true },
      disableTime: { type: Boolean, default: Boolean },
      disableDate: { type: Boolean, default: Boolean },
      minuteInterval: { type: Number, default: Number },
      color: { type: String, default: String },
      timeFormat: { type: String, default: String },
      withoutHeader: { type: Boolean, default: Boolean },
      locale: { type: String, default: String },
      maxDate: { type: String, default: String },
      minDate: { type: String, default: String },
      inline: { type: Boolean, default: Boolean },
      agendaPosition: { type: String, default: String },
      noWeekendsDays: { type: Boolean, default: Boolean },
      autoClose: { type: Boolean, default: Boolean },
      enableButtonValidate: { type: Boolean, default: Boolean },
      value: { type: [String, Object], default: String },
      disabledDates: { type: Array, default: Array },
      dark: { type: Boolean, default: Boolean },
      disabledHours: { type: Array, default: Array }
    },
    data () {
      return {
        month: this.getMonth(),
        transitionDayName: 'slidevnext',
        timeWidth: !this.disableTime ? this.getTimePickerWidth() : null
      }
    },
    computed: {
      position () {
        return window.innerWidth < 412
          ? null : this.agendaPosition === 'top'
            ? {top: '100%', marginBottom: '10px'} : {bottom: '100%', marginTop: '10px'}
      },
      isFormatTwelve () {
        return this.timeFormat ? (this.timeFormat.indexOf('a') > -1) || (this.timeFormat.indexOf('A') > -1) : false
      },
      bgStyle () {
        return {
          backgroundColor: this.color,
          padding: this.disableDate ? '10px 0' : '10px 0 10px 10px'
        }
      },
      year () {
        return this.dateTime.format('YYYY')
      }
    },
    watch: {
      dateTime: {
        handler () {
          this.month = this.getMonth()
          this.getDateFormatted()
        },
        deep: true
      },
      locale () {
        this.month = this.getMonth()
        this.getDateFormatted()
      },
      visible (val) {
        if (val && !this.disableTime) {
          this.$nextTick(() => {
            this.timeWidth = this.getTimePickerWidth()
          })
        }
      }
    },
    methods: {
      getMonth () {
        const date = this.dateTime
        return new Month(date.month(), date.year())
      },
      getDateFormatted () {
        return moment(this.dateTime).locale(this.locale).format('ddd D MMM')
      },
      selectTime (dateTime) {
        const isBigger = dateTime > this.dateTime
        this.transitionDayName = isBigger ? 'slidevnext' : 'slidevprev'
        this.$emit('change-date', dateTime)
      },
      selectDate (dateTime) {
        const isBefore = dateTime.isBefore(this.dateTime)
        this.transitionDayName = isBefore ? 'slidevprev' : 'slidevnext'
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
      validate () {
        this.$emit('validate')
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
  @import "../assets/animation.scss";
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
      .datetimepicker-container {
        background: #FFF;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      &-header {
        background: dodgerblue;
        color: #FFF;
        padding: 10px 0 10px 10px;
        position: relative;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        .datepicker-year {
          opacity: 0.7;
          margin-bottom: 10px;
          font-size: 14px;
          line-height: 14px;
          position: relative;
          height: 14px;
        }
        .datepicker-date, .datepicker-time, .datepicker-minute, .datepicker-hour {
          font-size: 20px;
          line-height: 20px;
          position: relative;
          height: 20px;
        }
        .datepicker-date {
          text-transform: capitalize;
        }
        .datepicker-hour:not(.justify-content-center) {
          padding-left: 10px;
        }
      }
    }
    &.is-dark {
      .datepicker, .datetimepicker-container {
        background: #424242;
      }
    }
    &.has-validate-button {
      .datetimepicker-container {
        border-radius: 0;
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
    .datetimepicker-container {
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
      .datepicker-header {
        padding: 10px !important;
        .datepicker-time {
          min-width: 100px !important;
          max-width: 100px !important;
        }
        .datepicker-time, .datepicker-time .flex-1 {
          justify-content: flex-end;
          -ms-flex-pack: end;
          -moz-box-align: end;
          -moz-box-pack: end;
          -webkit-box-pack: end;
          -webkit-justify-content: flex-end;
          -webkit-box-align: end;
        }
      }
    }
  }
</style>
