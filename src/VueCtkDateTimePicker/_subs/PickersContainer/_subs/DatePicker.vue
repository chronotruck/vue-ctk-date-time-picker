<template>
  <div
    id="CtkDatePicker"
    :class="{'flex-1 inline': inline, 'p-0': rangeMode, 'is-dark': dark}"
    class="datepicker-container"
  >
    <div class="datepicker-controls flex align-center justify-content-center">
      <div class="arrow-month h-100">
        <button
          type="button"
          tabindex="-1"
          class="datepicker-button datepicker-prev text-center h-100 flex align-center"
          @click="changeMonth('prev')"
        >
          <svg viewBox="0 0 1000 1000">
            <path d="M336.2 274.5l-210.1 210h805.4c13 0 23 10 23 23s-10 23-23 23H126.1l210.1 210.1c11 11 11 21 0 32-5 5-10 7-16 7s-11-2-16-7l-249.1-249c-11-11-11-21 0-32l249.1-249.1c21-21.1 53 10.9 32 32z" />
          </svg>
        </button>
      </div>
      <div class="datepicker-container-label flex-1">
        <TransitionGroup
          :name="transitionLabelName"
          class="h-100 flex align-center justify-content-center"
        >
          <div
            v-for="m in [month]"
            :key="m.month"
            class="datepicker-label fs-16"
            v-text="getMonthFormatted()"
          />
        </TransitionGroup>
      </div>
      <div class="arrow-month h-100 text-right">
        <button
          type="button"
          tabindex="-1"
          class="datepicker-button datepicker-next text-center h-100 flex align-center justify-content-right"
          @click="changeMonth('next')"
        >
          <svg viewBox="0 0 1000 1000">
            <path d="M694.4 242.4l249.1 249.1c11 11 11 21 0 32L694.4 772.7c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210.1-210.1H67.1c-13 0-23-10-23-23s10-23 23-23h805.4L662.4 274.5c-21-21.1 11-53.1 32-32.1z" />
          </svg>
        </button>
      </div>
    </div>
    <div class="datepicker-week flex">
      <div
        v-for="(weekDay, index) in weekDays"
        :key="index"
        class="flex-1 text-muted fs-12 flex justify-content-center align-center"
      >
        {{ weekDay }}
      </div>
    </div>
    <div
      :style="{height: (monthDays.length + weekStart) > 35 ? '250px' : '210px'}"
      class="month-container"
    >
      <TransitionGroup :name="transitionDaysName">
        <div
          v-for="m in [month]"
          :key="m.month"
          class="datepicker-days flex"
        >
          <button
            v-for="start in weekStart"
            :key="start + 'startEmptyDay'"
            class="datepicker-day align-center justify-content-center"
          />
          <button
            v-for="day in monthDays"
            :key="day.format('D')"
            :class="{
              selected: isSelected(day) && !isDisabled(day),
              disabled: (isDisabled(day) || isWeekEndDay(day)),
              enable: !(isDisabled(day) || isWeekEndDay(day)),
              between: isBetween(day) && rangeMode,
              first: firstInRange(day) && rangeMode,
              last: lastInRange(day) && !!dateTime.end && rangeMode
            }"
            :disabled="isDisabled(day) || isWeekEndDay(day)"
            type="button"
            tabindex="-1"
            class="datepicker-day flex align-center justify-content-center"
            @click="selectDate(day)"
          >
            <span
              v-if="isToday(day)"
              class="datepicker-today"
            />
            <span
              v-show="!isDisabled(day) || isSelected(day)"
              :style="bgStyle"
              class="datepicker-day-effect"
            />
            <span class="datepicker-day-text">
              {{ day.format('D') }}
            </span>
          </button>
          <div
            v-for="end in endEmptyDays"
            :key="end + 'endEmptyDay'"
            class="datepicker-day flex align-center justify-content-center"
          />
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script>
  import moment from 'moment-timezone'
  import { getWeekDays } from '@/VueCtkDateTimePicker/modules/month'
  export default {
    name: 'DatePicker',
    props: {
      value: {type: String, default: String},
      color: {type: String, default: String},
      minDate: {type: String, default: String},
      maxDate: {type: String, default: String},
      locale: {type: String, default: String},
      inline: {type: Boolean, default: Boolean},
      noWeekendsDays: {type: Boolean, default: Boolean},
      rangeMode: {type: Boolean, default: false},
      disabledDates: {type: Array, default: Array},
      dark: {type: Boolean, default: false},
      month: {type: Object, default: Object}
    },
    data () {
      return {
        transitionDaysName: 'slidenext',
        transitionLabelName: 'slidevnext',
        weekDays: getWeekDays(this.locale)
      }
    },
    computed: {
      dateTime () {
        return moment(this.value)
      },
      bgStyle () {
        return {
          backgroundColor: this.color
        }
      },
      endEmptyDays () {
        const getDays = (this.monthDays.length + this.weekStart) > 35
        const number = getDays ? 42 : 35
        return number - this.monthDays.length - this.weekStart
      },
      monthDays () {
        return this.month.getMonthDays()
      },
      weekStart () {
        return this.month.getWeekStart()
      }
    },
    methods: {
      getMonthFormatted () {
        return this.month.getFormatted()
      },
      isToday (day) {
        return moment(day.format('YYYY-MM-DD')).isSame(moment().format('YYYY-MM-DD'))
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
          ...(this.dateTime.start
            ? [this.dateTime.start.format('YYYY-MM-DD')]
            : this.rangeMode ? [] : [this.dateTime.format('YYYY-MM-DD')]),
          ...(this.dateTime.end
            ? [this.dateTime.end.format('YYYY-MM-DD')]
            : this.rangeMode ? [] : [this.dateTime.format('YYYY-MM-DD')])
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
        // if (this.rangeMode) {
        //   if (!this.dateTime.start || this.dateTime.end || day.isBefore(this.dateTime.start)) {
        //     this.dateTime.start = day
        //     this.dateTime.end = null
        //   } else {
        //     this.dateTime.end = day
        //   }
        //   this.$emit('input', moment(this.dateTime).format('YYYY-MM-DD'))
        // } else {
        this.$emit('input', moment(day).format('YYYY-MM-DD'))
        // }
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
  @import "@/VueCtkDateTimePicker/assets/animation.scss";
  #CtkDatePicker.datepicker-container {
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

        &-effect, .datepicker-today{
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          height: 30px;
          width: 30px;

          border-radius: 50%;
          -webkit-transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
          transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
        }

        .datepicker-day-effect {
          margin: auto;
          opacity: 0.6;
          background: dodgerblue;
          transform: scale(0);
        }
        .datepicker-today {
          background-color: #eaeaea;
        }
        .datepicker-day-text {
          position: relative;
          color: #000;
        }
        &:hover {
          .datepicker-day-text {
            color: #FFF;
          }
          .datepicker-day-effect {
            transform: scale(1);
            opacity: 0.6;
          }
        }

        &.between {
          .datepicker-day-text {
            color: #FFF;
          }
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
          .datepicker-day-text {
            color: #FFF;
          }
          .datepicker-day-effect {
            transform: scale(1);
            opacity: 1;
          }
        }
        &.disabled {
          .datepicker-day-text {
            color: #CCC;
          }
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
    &.is-dark {
      .datepicker-days .datepicker-day:not(.between):not(.selected) {
        .datepicker-day-text {
          color: #FFF;
        }
        &.disabled .datepicker-day-text {
          color: lighten(#424242, 20%);
        }
      }
      .text-muted {
        color: lighten(#424242, 40%) !important;
      }
      .datepicker-button {
        svg {
          fill: #FFF;
        }
      }
      .datepicker-label {
        color: #FFF;
      }
      .datepicker-today {
        background-color: darken(#424242, 10%) !important;
      }
    }
  }
  @media screen and (max-width: 415px) {
    #CtkDatePicker.datepicker-container {
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
