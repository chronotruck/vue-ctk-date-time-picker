<template>
  <transition
    :name="agendaPosition === 'top' ? 'slide' : 'slideinvert'"
  >
    <div
      v-show="visible || withoutInput"
      :class="{'inline': withoutInput}"
      :style="position"
      class="datetimepicker flex"
      @click.stop
    >
      <div
        :style="position"
        class="datepicker">
        <div
          v-if="withoutHeader"
          :style="bgStyle"
          class="datepicker-header">

          <div
            class="datepicker-year">
            <transition-group :name="transitionDayName" >
              <div
                v-for="year in [year]"
                :key="year">{{ year }}</div>
            </transition-group>
          </div>

          <div class="flex justify-content-between">
            <transition-group
              :name="transitionDayName"
              class="datepicker-date dots-text flex-1">
              <span
                v-for="dateFormatted in [getDateFormatted()]"
                :key="dateFormatted">{{ getDateFormatted() }}</span>
            </transition-group>
          </div>

        </div>
        <div class="datetimepicker-container flex">

          <ctk-date-picker
            :without-input="withoutInput"
            :no-weekends-days="noWeekendsDays"
            :month="month"
            :date-time="dateTime"
            :locale="locale"
            :color="color"
            :min-date="minDate"
            :max-date="maxDate"
            :value="value"
            :range-mode="rangeMode"
            @change-date="selectDate"
            @change-month="changeMonth"
          />

        </div>
        <ctk-button-validate
          v-if="enableButtonValidate && !withoutInput && !autoClose"
          @validate="validate"
        />
      </div>
    </div>
  </transition>
</template>

<script>
  import CtkDatePicker from './_subs/CtkDatePicker'
  import CtkButtonValidate from './_subs/CtkButtonValidate'
  import Month from './../modules/month'
  import moment from 'moment'
  export default {
    name: 'CtkDateRangePicker',
    components: {
      CtkDatePicker,
      CtkButtonValidate
    },
    props: {
      dateTime: { type: Object, default: Object },
      visible: { type: Boolean, required: true, default: true },
      color: { type: String, default: String },
      withoutHeader: { type: Boolean, default: Boolean },
      locale: { type: String, default: String },
      maxDate: { type: String, default: String },
      minDate: { type: String, default: String },
      withoutInput: { type: Boolean, default: Boolean },
      agendaPosition: { type: String, default: String },
      noWeekendsDays: { type: Boolean, default: Boolean },
      autoClose: { type: Boolean, default: Boolean },
      enableButtonValidate: { type: Boolean, default: Boolean },
      value: { type: [String, Object], default: String },
      rangeMode: {type: Boolean, default: false}
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
          padding: '10px 0 10px 10px'
        }
      },
      year () {
        const date = this.rangeMode ? this.dateTime.start : this.dateTime
        return date.format('YYYY')
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
      }
    },
    methods: {
      getMonth () {
        const date = this.rangeMode ? this.dateTime.start : this.dateTime
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
        const date = this.rangeMode ? this.dateTime.start : this.dateTime
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
  }
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
      border-bottom: 1px solid #EAEAEA;
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
    }
    .datepicker-buttons-container {
      padding: 5px 10px;
      border-top: 1px solid #EAEAEA;
      .datepicker-button {
        cursor: pointer;
        height: 35px;
        width: 35px;
        border: none;
        outline: none;
        appearance: none;
        border-radius: 50%;
        padding: 0;
        position: relative;
        svg {
          position: relative;
          -webkit-transition: all 450s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
          transition: all 450s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
        }
        .datepicker-button-effect {
          position: absolute;
          opacity: 0.6;
          height: 30px;
          width: 30px;
          top: 2px;
          left: 2px;
          border-radius: 50%;
          -webkit-transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
          transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
          transform: scale(0);
        }
        &.validation {
          svg {
            fill: green;
            position: relative;
          }
          .datepicker-button-effect {
            background: green;
          }
          &:hover {
            .datepicker-button-effect {
              transform: scale(1);
              opacity: 0.6;
            }
            svg {
              fill: white !important;
            }
          }
        }
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
    }
  }
  @media screen and (max-width: 412px) {
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
        top: 50px !important;
        bottom: unset !important;
        left: 5%;
        width: 90%;
        max-width: inherit;
        position: fixed;
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
