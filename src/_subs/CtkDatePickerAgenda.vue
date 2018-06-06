<template>
  <transition name="slide">
    <div class="datetimepicker flex" v-if="visible" @click.stop>
      <div class="datepicker">
        <div class="datepicker-header" :style="bgStyle" v-if="withoutHeader">
          <div class="datepicker-year" v-if="!disableDate">
            <transition-group :name="transitionDayName" >
              <div v-for="year in [year]" :key="year">{{year}}</div>
            </transition-group>
          </div>
          <div class="flex justify-content-between">
            <transition-group :name="transitionDayName" class="datepicker-date dots-text flex-1" v-if="!disableDate">
              <span v-for="dateFormatted in [getDateFormatted()]" :key="dateFormatted">{{ getDateFormatted() }}</span>
            </transition-group>
            <div class="datepicker-time flex justify-content-center" v-if="!disableTime && !isFormatTwelve" :style="dateTimeWidth">
              <transition-group :name="transitionDayName" class="dots-text datepicker-hour flex-1 flex justify-content-right">
                <span v-for="hour in [dateTime.format('HH')]" :key="hour">{{ hour }}</span>
              </transition-group>
              <span>:</span>
              <transition-group :name="transitionDayName" class="dots-text datepicker-minute flex-1 flex justify-content-left">
                <span v-for="min in [dateTime.format('mm')]" :key="min">{{ min }}</span>
              </transition-group>
            </div>
            <div class="datepicker-time flex justify-content-center" v-else-if="!disableTime" :style="dateTimeWidth">
              <transition-group :name="transitionDayName" class="dots-text datepicker-hour flex-1 flex justify-content-center">
                <span v-for="hour in [dateTime.format(timeFormat)]" :key="hour">{{ hour }}</span>
              </transition-group>
            </div>
          </div>
        </div>
        <div class="datetimepicker-container flex">
          <ctk-date-picker :month="month" :date-time="dateTime" :color="color" @change-date="selectDate" @change-month="changeMonth" v-if="!disableDate" :min-date="minDate" :max-date="maxDate" />
          <ctk-time-picker :month="month" :date-time="dateTime" :color="color" :format="timeFormat" :minute-interval="minuteInterval" v-if="!disableTime" @change-time="selectTime" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import CtkTimePicker from './_subs/CtkTimePicker'
  import CtkDatePicker from './_subs/CtkDatePicker'
  function Month (m, month, year) {
    return {
      start: m([year, month]),
      end: m([year, month]).clone().endOf('month'),
      month: month,
      year: year
    }
  }
  export default {
    name: 'CtkDatePickerAgenda',
    components: {
      CtkTimePicker, CtkDatePicker
    },
    props: {
      dateTime: {},
      visible: { type: Boolean, required: true, default: true },
      disableTime: { type: Boolean },
      disableDate: { type: Boolean },
      minuteInterval: { type: Number },
      color: { type: String },
      timeFormat: { type: String },
      withoutHeader: {},
      locale: {},
      maxDate: {},
      minDate: {}
    },
    data: function () {
      return {
        month: this.disableDate ? '' : Month(this.$moment, this.dateTime.month(), this.dateTime.year()),
        transitionDayName: 'slidevnext',
      }
    },
    computed: {
      isFormatTwelve: function () {
        if (this.timeFormat) {
          return (this.timeFormat.indexOf('a') > -1) || (this.timeFormat.indexOf('A') > -1)
        } else {
          return false
        }
      },
      bgStyle: function () {
        return {
          backgroundColor: this.color,
          padding: this.disableDate ? '10px 0' : '10px 0 10px 10px'
        }
      },
      year: function () {
        return this.dateTime.format('YYYY')
      },
      dateTimeWidth: function () {
        return {
          flex: '0 0 160px',
          width: '160px',
          minWidth: '160px',
          maxWidth: '160px'
        }
      }
    },
    methods: {
      getDateFormatted: function () {
        return this.$moment(this.dateTime).locale(this.locale).format('ddd D MMM')
      },
      selectTime: function (dateTime) {
        this.transitionDayName = 'slidevprev'
        if (dateTime > this.dateTime) {
          this.transitionDayName = 'slidevnext'
        }
        this.$emit('change-date', dateTime)
      },
      selectDate: function (dateTime) {
        this.transitionDayName = 'slidevnext'
        if (dateTime.isBefore(this.dateTime)) {
          this.transitionDayName = 'slidevprev'
        }
        dateTime.add(this.dateTime.hour(), 'hours')
        dateTime.add(this.dateTime.minute(), 'minutes')
        this.$emit('change-date', dateTime)
      },
      changeMonth: function (val) {
        let month = this.month.month + (val === 'prev' ? -1 : +1)
        let year = this.month.year
        if (month > 11 || month < 0) {
          year += (val === 'prev' ? -1 : +1)
          month = (val === 'prev' ? 11 : 0)
        }
        this.month = Month(this.$moment, month, year)
      }
    },
    watch: {
      dateTime: {
        handler: function () {
          this.month = this.disableDate ? '' : Month(this.$moment, this.dateTime.month(), this.dateTime.year())
          this.getDateFormatted()
        },
        deep: true
      },
      locale: function () {
        this.month = this.disableDate ? '' : Month(this.$moment, this.dateTime.month(), this.dateTime.year())
        this.getDateFormatted()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import url('https://fonts.googleapis.com/css?family=Roboto:400,500,700');
  @import "../component_assets/animation.scss";
  .datepicker {
    font-family: 'Roboto', sans-serif;
    position: absolute;
    top: 100%;
    z-index: 5;
    border-radius: 4px;
    background: #FFF;
    margin-bottom: 20px;
    -webkit-box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
    .datepicker-header {
      background: dodgerblue;
      color: #FFF;
      padding: 10px 0 10px 10px;
      position: relative;
      border-bottom: 1px solid #EAEAEA;
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
    }
  }
</style>
