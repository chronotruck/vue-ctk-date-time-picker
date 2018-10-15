<template>
  <transition
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
        class="datepicker">
        <div
          v-if="withoutHeader"
          :style="bgStyle"
          class="datepicker-header">

          <div class="datepicker-year">
            <div>{{ year }}</div>
          </div>

          <div class="flex justify-content-between">
            <span class="datepicker-date dots-text flex-1">{{ getDateFormatted() }}</span>
          </div>
        </div>
        <div class="datetimepicker-container flex">

          <ctk-calendar-shortcut
            v-if="!withoutRangeShortcut"
            ref="calendar-shortcut"
            :color="color"
            :locale="locale"
            :dark="dark"
            :date-time="dateTime"
            @change-range="selectShortcut"
          />

          <ctk-date-picker
            :inline="inline"
            :no-weekends-days="noWeekendsDays"
            :month="month"
            :date-time="dateTime"
            :locale="locale"
            :color="color"
            :min-date="minDate"
            :max-date="maxDate"
            :value="value"
            :dark="dark"
            class="date-range-picker"
            range-mode
            @change-date="selectDate"
            @change-month="changeMonth"
          />

        </div>
        <ctk-button-validate
          v-if="enableButtonValidate && !inline && !autoClose"
          :dark="dark"
          @validate="validate"
        />
      </div>
    </div>
  </transition>
</template>

<script>
  import CtkDatePicker from './_subs/CtkDatePicker'
  import CtkButtonValidate from './_subs/CtkButtonValidate'
  import CtkCalendarShortcut from './_subs/CtkCalendarShortcut'
  import Month from './../modules/month'
  import moment from 'moment'
  export default {
    name: 'CtkDateRangePicker',
    components: {
      CtkDatePicker,
      CtkButtonValidate,
      CtkCalendarShortcut
    },
    props: {
      dateTime: { type: Object, default: Object },
      visible: { type: Boolean, required: true, default: true },
      color: { type: String, default: String },
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
      withoutRangeShortcut: { type: Boolean, default: false },
      dark: { type: Boolean, default: Boolean }
    },
    data () {
      return {
        month: this.getMonth()
      }
    },
    computed: {
      position () {
        return window.innerWidth < 412
          ? null : this.agendaPosition === 'top'
            ? {top: '100%', marginBottom: '10px'} : {bottom: '100%', marginTop: '10px'}
      },
      bgStyle () {
        return {
          backgroundColor: this.color,
          padding: '10px 0 10px 10px'
        }
      },
      year () {
        const date = this.dateTime.end ? this.dateTime.end : this.dateTime.start
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
        const date = this.dateTime.end ? this.dateTime.end : this.dateTime.start
        return new Month(date.month(), date.year())
      },
      getDateFormatted () {
        const datesFormatted = `${moment(this.dateTime.start).locale(this.locale).format('ddd D MMM')}`
        return this.dateTime.end ? `${datesFormatted} - ${moment(this.dateTime.end).locale(this.locale).format('ddd D MMM')}` : `${datesFormatted} - ?`
      },
      selectDate (dateTime) {
        this.$emit('change-date', dateTime)
        this.$refs['calendar-shortcut'].unSelectAllShortcuts()
      },
      selectShortcut (dateTime) {
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
      }
      .date-range-picker {
        border-left: 1px solid #EAEAEA
      }
    }
    &.is-dark {
      .datetimepicker-container {
        background: #424242;
      }
      .date-range-picker {
        border-left: 1px solid lighten(#424242, 20%);
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
      .date-range-picker {
        border-left: none;
        border-bottom: 1px solid #EAEAEA
      }
    }
  }
</style>
