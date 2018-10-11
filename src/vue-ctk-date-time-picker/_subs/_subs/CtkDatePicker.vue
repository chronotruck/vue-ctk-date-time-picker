<template>
  <div
    id="CtkDatePicker"
    :class="{'flex-1 inline': inline, 'p-0': rangeMode}"
    class="datepicker-container">
    <div class="datepicker-controls flex align-center justify-content-center">
      <div class="arrow-month h-100">
        <button
          type="button"
          tabindex="-1"
          class="datepicker-button datepicker-prev text-center h-100 flex align-center"
          @click="changeMonth('prev')">
          <svg viewBox="0 0 1000 1000"><path d="M336.2 274.5l-210.1 210h805.4c13 0 23 10 23 23s-10 23-23 23H126.1l210.1 210.1c11 11 11 21 0 32-5 5-10 7-16 7s-11-2-16-7l-249.1-249c-11-11-11-21 0-32l249.1-249.1c21-21.1 53 10.9 32 32z"/></svg>
        </button>
      </div>
      <div class="datepicker-container-label flex-1">
        <transition-group
          :name="transitionLabelName"
          class="h-100 flex align-center justify-content-center">
          <div
            v-for="month in [month]"
            :key="month.month"
            class="datepicker-label fs-16"
            v-text="getMonthFormatted()"/>
        </transition-group>
      </div>
      <div class="arrow-month h-100 text-right">
        <button
          type="button"
          tabindex="-1"
          class="datepicker-button datepicker-next text-center h-100 flex align-center justify-content-right"
          @click="changeMonth('next')">
          <svg viewBox="0 0 1000 1000"><path d="M694.4 242.4l249.1 249.1c11 11 11 21 0 32L694.4 772.7c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210.1-210.1H67.1c-13 0-23-10-23-23s10-23 23-23h805.4L662.4 274.5c-21-21.1 11-53.1 32-32.1z"/></svg>
        </button>
      </div>
    </div>
    <div class="datepicker-week flex">
      <div
        v-for="(weekDay, index) in weekDays"
        :key="index"
        class="flex-1 text-muted fs-12 flex justify-content-center align-center">
        {{ weekDay }}
      </div>
    </div>
    <div
      :style="{height: (monthDays.length + weekDay) > 35 ? '250px' : '210px'}"
      class="month-container">
      <transition-group :name="transitionDaysName">
        <div
          v-for="month in [month]"
          :key="month.month"
          class="datepicker-days flex">
          <button
            v-for="start in weekDay"
            :key="start + 'startEmptyDay'"
            class="datepicker-day align-center justify-content-center"/>
          <button
            v-for="day in monthDays"
            :key="day.format('D')"
            :class="{
              selected: isSelected(day) && value && !isDisabled(day),
              disabled: (isDisabled(day) || isWeekEndDay(day)),
              enable: !(isDisabled(day) || isWeekEndDay(day)),
              between: isBetween(day) && rangeMode,
              first: firstInRange(day) && rangeMode,
              last: lastInRange(day) && !!dateTime.end && rangeMode
            }"
            type="button"
            tabindex="-1"
            class="datepicker-day flex align-center justify-content-center"
            @click="isDisabled(day) || isWeekEndDay(day) ? '' : selectDate(day)">
            <span
              :style="bgStyle"
              class="datepicker-day-effect"/>
            <span class="datepicker-day-text">{{ day.format('D') }}</span>
          </button>
          <div
            v-for="end in endEmptyDays"
            :key="end + 'endEmptyDay'"
            class="datepicker-day flex align-center justify-content-center"/>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import { getWeekDays } from './../../modules/month'
  export default {
    name: 'CtkDatePicker',
    props: {
      month: {type: Object, default: Object},
      dateTime: {type: Object, default: Object},
      color: {type: String, default: String},
      minDate: {type: String, default: String},
      maxDate: {type: String, default: String},
      locale: {type: String, default: String},
      inline: {type: Boolean, default: Boolean},
      noWeekendsDays: {type: Boolean, default: Boolean},
      value: {type: [String, Object], default: String},
      rangeMode: {type: Boolean, default: false},
      disabledDates: { type: Array, default: Array }
    },
    data () {
      return {
        transitionDaysName: 'slidenext',
        transitionLabelName: 'slidevnext',
        weekDays: getWeekDays(this.locale),
        days: {
          start: null,
          end: null
        }
      }
    },
    computed: {
      bgStyle () {
        return {
          backgroundColor: this.color
        }
      },
      endEmptyDays () {
        const getDays = (this.monthDays.length + this.weekDay) > 35
        const number = getDays ? 42 : 35
        return number - this.monthDays.length - this.weekDay
      },
      monthDays () {
        return this.month.getMonthDays()
      },
      weekDay () {
        return this.month.getWeekStart()
      }
    },
    methods: {
      getMonthFormatted () {
        return this.month.getFormatted()
      },
      isDisabled (day) {
        return (
          this.isDateDisabled(day) ||
          this.isBeforeMinDate(day) ||
          this.isAfterEndDate(day)
        )
      },
      isDateDisabled (day) {
        return this.disabledDates.indexOf(day.format('YYYY-MM-DD')) > -1
      },
      isBeforeMinDate (day) {
        return moment(day).isBefore(this.minDate)
      },
      isAfterEndDate (day) {
        return moment(day).isAfter(this.maxDate)
      },
      isSelected (day) {
        const date = [
          ...(this.dateTime.start ? [this.dateTime.start.format('YYYY-MM-DD')] : [this.dateTime.format('YYYY-MM-DD')]),
          ...(this.dateTime.end ? [this.dateTime.end.format('YYYY-MM-DD')] : [])
        ]
        return date.indexOf(day.format('YYYY-MM-DD')) > -1
      },
      isBetween (day) {
        const range = this.dateTime.end
          ? moment.range(this.dateTime.start, this.dateTime.end).contains(day)
          : false
        return range
      },
      firstInRange (day) {
        return this.dateTime.start ? moment(this.dateTime.start.format('YYYY-MM-DD')).isSame(day.format('YYYY-MM-DD')) : false
      },
      lastInRange (day) {
        return this.dateTime.end ? moment(this.dateTime.end.format('YYYY-MM-DD')).isSame(day.format('YYYY-MM-DD')) : false
      },
      isWeekEndDay (day) {
        const dayConst = moment(day).day()
        const weekendsDaysNumbers = [6, 0]
        return this.noWeekendsDays ? weekendsDaysNumbers.indexOf(dayConst) > -1 : false
      },
      selectDate (day) {
        if (this.rangeMode) {
          if (!this.days.start || this.days.end || day.isBefore(this.days.start)) {
            this.days.start = day
            this.days.end = null
          } else {
            this.days.end = day
          }
          this.$emit('change-date', this.days)
        } else {
          this.$emit('change-date', day)
        }
      },
      changeMonth (val) {
        this.transitionDaysName = `slide${val}`
        this.transitionLabelName = `slidev${val}`
        this.$emit('change-month', val)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/animation.scss";
  #CtkDatePicker {
    width: 290px;
    padding: 0 5px;
    &.p-0 {
      padding: 0;
    }
    .datepicker-controls {
      height: 56px;
      .arrow-month {
        flex: 0 0 40px;
      }
      .datepicker-button {
        background: transparent;
        cursor: pointer;
        padding: 0 10px;
        border: none;
        outline: none;
        svg {
          height: 17px;
          width: 17px;
          fill: #2c3e50;
        }
        &.datepicker-prev {
          text-align: left !important;
        }
        &.datepicker-next {
          text-align: right !important;
        }
      }
      .datepicker-container-label {
        text-transform: capitalize;
        font-size: 18px;
        line-height: 18px;
        position: relative;
        height: 18px;
        overflow: hidden;
      }
      .datepicker-label {
        text-transform: capitalize;
      }
    }
    .datepicker-week {
      height: 41px;
      text-transform: capitalize;
      // border-bottom: 1px solid #eaeaea;
    }
    .month-container {
      position: relative;
      overflow: hidden;
    }
    .datepicker-days {
      display: flex;
      display: -ms-flexbox;
      overflow: hidden;
      flex-wrap: wrap;
      -ms-flex-wrap: wrap;
      .datepicker-day {
        height: 41px;
        flex-grow: 1;
        width: calc(100% / 7);
        position: relative;
        border: none;
        background: transparent;
        font-size: 13px;
        outline: none;
        &.enable {
          cursor: pointer;
        }
        .datepicker-day-effect {
          position: absolute;
          opacity: 0.6;
          background: dodgerblue;
          height: 30px;
          width: 30px;
          border-radius: 50%;
          -webkit-transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
          transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
          transform: scale(0);
        }
        .datepicker-day-text {
          position: relative;
        }
        &:hover {
          color: #FFF;
          .datepicker-day-effect {
            transform: scale(1);
            opacity: 0.6;
          }
        }

        &.between {
          color: #FFF;
          .datepicker-day-effect {
            transform: scale(1);
            opacity: 0.5;
            border-radius: 0;
            width: 100%;
          }
          /*TODO*/
          &.first .datepicker-day-effect {
            border-top-left-radius: 30px;
            border-bottom-left-radius: 30px;
          }
          /*TODO*/
          &.last .datepicker-day-effect {
            border-top-right-radius: 30px;
            border-bottom-right-radius: 30px;
          }
        }
        &.selected {
          color: #FFF;
          .datepicker-day-effect {
            transform: scale(1);
            opacity: 1;
          }
        }
        &.disabled {
          color: #CCC;
          &.selected {
            color: #fff;
          }
          .datepicker-day-effect {
            transform: scale(0);
            opacity: 0;
          }
        }
      }
    }
  }
  @media screen and (max-width: 412px) {
    #CtkDatePicker {
      width: 100%;
      &:not(.inline) {
        .datepicker-controls {
          height: 36px !important;
        }
        .datepicker-week {
          height: 21px !important;
        }
      }
    }
  }
</style>
