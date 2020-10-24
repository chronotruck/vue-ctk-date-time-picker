<template>
  <div
    :id="`${id}-DatePicker`"
    :class="{'flex-1 inline': inline, 'p-0 range flex-1': range, 'is-dark': dark, 'has-shortcuts': range && !noShortcuts}"
    class="datepicker-container flex flex-fixed"
  >
    <RangeShortcuts
      v-if="range && !noShortcuts"
      ref="range-shortcuts"
      :model-value="shortcut"
      :color="color"
      :dark="dark"
      :custom-shortcuts="customShortcuts"
      :height="height"
      @change-range="$emit('update:model-value', $event)"
    />
    <div class="calendar lm-w-100">
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
        <div
          class="datepicker-container-label flex-1 flex justify-content-center"
        >
          <TransitionGroup
            :name="transitionLabelName"
            tag="span"
            class="h-100 flex align-center flex-1 flex justify-content-right"
          >
            <CustomButton
              v-for="m in [month]"
              :key="m.month"
              class="date-buttons lm-fs-16 padding-button flex-1"
              :color="color"
              :dark="dark"
              @click="selectingYearMonth = 'month'"
            >
              {{ monthFormatted }}
            </CustomButton>
          </TransitionGroup>
          <TransitionGroup
            :name="transitionLabelName"
            tag="span"
            class="h-100 flex align-center flex-1 flex"
          >
            <CustomButton
              v-for="y in [year]"
              :key="y"
              class="date-buttons lm-fs-16 padding-button flex-1"
              :color="color"
              :dark="dark"
              @click="selectingYearMonth = 'year'"
            >
              {{ year }}
            </CustomButton>
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
      <WeekDays
        :week-days="weekDays"
        :dark="dark"
      />
      <div
        :style="{height: (monthDays.length + weekStart) > 35 ? '250px' : '210px'}"
        class="month-container"
      >
        <TransitionGroup
          :name="transitionDaysName"
          tag="span"
        >
          <div
            v-for="m in [month]"
            :key="m.month"
            class="datepicker-days flex"
          >
            <div
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
                between: isBetween(day) && range,
                first: firstInRange(day) && range,
                last: lastInRange(day) && !!modelValue.end && range
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
              <span
                v-if="isKeyboardSelected(day)"
                class="datepicker-day-keyboard-selected"
              />
              <span class="datepicker-day-text flex-1">
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
      <YearMonthSelector
        v-if="selectingYearMonth"
        :locale="locale"
        :color="color"
        :dark="dark"
        :mode="selectingYearMonth"
        :month="month"
        @input="selectYearMonth"
        @back="selectingYearMonth = null"
      />
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import { getWeekDays } from '@/VueCtkDateTimePicker/modules/month'
  import RangeShortcuts from './_subs/RangeShortcuts'
  import YearMonthSelector from './_subs/YearMonthSelector'
  import WeekDays from './_subs/WeekDays'
  import CustomButton from '@/VueCtkDateTimePicker/_subs/CustomButton'
  import KeyboardAccessibility from '@/VueCtkDateTimePicker/mixins/keyboard-accessibility'

  export default {
    name: 'DatePicker',
    components: {
      RangeShortcuts, YearMonthSelector, WeekDays, CustomButton
    },
    mixins: [KeyboardAccessibility],
    props: {
      id: { type: String, default: null },
      modelValue: { type: [String, Object], default: null },
      shortcut: { type: String, default: null },
      color: { type: String, default: null },
      minDate: { type: String, default: null },
      maxDate: { type: String, default: null },
      locale: { type: String, default: null },
      inline: { type: Boolean, default: null },
      noWeekendsDays: { type: Boolean, default: null },
      disabledWeekly: { type: Array, default: () => ([]) },
      range: { type: Boolean, default: false },
      disabledDates: { type: Array, default: () => ([]) },
      enabledDates: { type: Array, default: () => ([]) },
      dark: { type: Boolean, default: false },
      month: { type: Object, default: null },
      height: { type: Number, default: null },
      noShortcuts: { type: Boolean, default: null },
      firstDayOfWeek: { type: Number, default: null },
      customShortcuts: { type: Array, default: () => ([]) },
      visible: { type: Boolean, default: null }
    },
    emits: [
      'update:model-value',
      'change-month',
      'change-year-month'
    ],
    data () {
      return {
        transitionDaysName: 'slidenext',
        transitionLabelName: 'slidevnext',
        selectingYearMonth: null,
        isKeyboardActive: true
      }
    },
    computed: {
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
      },
      monthFormatted () {
        return `${this.month.getFormatted()}`
      },
      year () {
        return `${this.month.getYear()}`
      },
      weekDays () {
        return getWeekDays(this.locale, this.firstDayOfWeek)
      }
    },
    methods: {
      isKeyboardSelected (day) {
        return day && this.newValue ? day.format('YYYY-MM-DD') === this.newValue.format('YYYY-MM-DD') : null
      },
      isToday (day) {
        return moment(day.format('YYYY-MM-DD')).isSame(moment().format('YYYY-MM-DD'))
      },
      isDisabled (day) {
        return (
          this.isDateDisabled(day) ||
          !this.isDateEnabled(day) ||
          this.isBeforeMinDate(day) ||
          this.isAfterEndDate(day) ||
          this.isDayDisabledWeekly(day) ||
          (this.isWeekEndDay(day) && this.noWeekendsDays)
        )
      },
      isDateDisabled (day) {
        return this.disabledDates.indexOf(day.format('YYYY-MM-DD')) > -1
      },
      isDateEnabled (day) {
        return this.enabledDates.length === 0 || this.enabledDates.indexOf(day.format('YYYY-MM-DD')) > -1
      },
      isBeforeMinDate (day) {
        return day.isBefore(moment(this.minDate, 'YYYY-MM-DD'))
      },
      isAfterEndDate (day) {
        return moment(day).isAfter(this.maxDate)
      },
      isSelected (day) {
        const date = [
          ...(this.modelValue && this.modelValue.start
            ? [moment(this.modelValue.start).format('YYYY-MM-DD')]
            : this.range ? [] : [moment(this.modelValue).format('YYYY-MM-DD')]),
          ...(this.modelValue && this.modelValue.end
            ? [moment(this.modelValue.end).format('YYYY-MM-DD')]
            : this.range ? [] : [moment(this.modelValue).format('YYYY-MM-DD')])
        ]
        return date.indexOf(day.format('YYYY-MM-DD')) > -1
      },
      isBetween (day) {
        const range = this.modelValue && this.modelValue.end
          ? moment.range(moment(this.modelValue.start), moment(this.modelValue.end)).contains(day)
          : false
        return range
      },
      firstInRange (day) {
        return this.modelValue && this.modelValue.start ? moment(moment(this.modelValue.start).format('YYYY-MM-DD')).isSame(day.format('YYYY-MM-DD')) : false
      },
      lastInRange (day) {
        return this.modelValue && this.modelValue.end ? moment(moment(this.modelValue.end).format('YYYY-MM-DD')).isSame(day.format('YYYY-MM-DD')) : false
      },
      isDayDisabledWeekly (day) {
        const dayConst = moment(day).day()
        return this.disabledWeekly.indexOf(dayConst) > -1
      },
      isWeekEndDay (day) {
        const dayConst = moment(day).day()
        const weekendsDaysNumbers = [6, 0]
        return this.noWeekendsDays ? weekendsDaysNumbers.indexOf(dayConst) > -1 : false
      },
      selectDate (day) {
        if (this.range && !this.noShortcuts) {
          this.$refs['range-shortcuts'].selectedShortcut = null
        }
        if (this.range) {
          if (!this.modelValue.start || this.modelValue.end || day.isBefore(moment(this.modelValue.start))) {
            // eslint-disable-next-line vue/no-mutating-props
            this.modelValue.start = day.format('YYYY-MM-DD')
            // eslint-disable-next-line vue/no-mutating-props
            this.modelValue.end = null
          } else {
            // eslint-disable-next-line vue/no-mutating-props
            this.modelValue.end = day.format('YYYY-MM-DD')
          }
          this.$emit('update:model-value', this.modelValue)
        } else {
          this.$emit('update:model-value', moment(day).format('YYYY-MM-DD'))
        }
      },
      changeMonth (val) {
        this.transitionDaysName = `slide${val}`
        this.transitionLabelName = `slidev${val}`
        this.$emit('change-month', val)
      },
      selectYearMonth (event) {
        const { month, year } = event
        const isBefore = year === this.month.year
          ? month < this.month.month
          : year < this.month.year
        this.transitionLabelName = isBefore ? 'slidevprev' : 'slidevnext'
        this.selectingYearMonth = null
        this.$emit('change-year-month', event)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .datepicker-container {
    width: 260px;
    padding: 0 5px;
    position: relative;
    &.range.has-shortcuts {
      width: 400px;
    }

    &.p-0 {
      padding: 0;
    }
    .padding-button {
      padding: 5px 3px !important;
    }
    .calendar {
      position: relative;
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
        font-size: 16px;
        position: relative;
        height: 56px;
        overflow: hidden;
      }
      .date-buttons {
        text-transform: capitalize;
        font-weight: 400;
      }
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

          border-radius: 4px;
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
        .datepicker-day-keyboard-selected {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          height: 26px;
          width: 26px;
          opacity: (.7);
          border-radius: 50%;
          -webkit-transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
          transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
          background-color: #afafaf;
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
          &.first .datepicker-day-effect {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
          }
          &.last .datepicker-day-effect {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
          }
          .datepicker-day-keyboard-selected, &.first .datepicker-day-keyboard-selected, &.last .datepicker-day-keyboard-selected {
            background-color: rgba(0, 0, 0, 0.66);
          }
        }
        &.selected {
          .datepicker-day-text {
            color: #FFF;
            font-weight: bold;
          }
          .datepicker-day-effect {
            transform: scale(1);
            opacity: 1;
          }
          .datepicker-day-keyboard-selected {
            background-color: rgba(0, 0, 0, 0.66);
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
      .datepicker-label {
        color: white;
      }
      .text-muted {
        color: lighten(#424242, 40%) !important;
      }
      .datepicker-button {
        svg {
          fill: #FFF;
        }
      }
      .datepicker-today {
        background-color: darken(#424242, 10%) !important;
      }
    }
  }
  @media screen and (max-width: 415px) {
    .datepicker-container {
      width: 100%;
      &:not(.inline) {
        .datepicker-controls {
          height: 36px !important;
        }
      }
      &.range.has-shortcuts {
        width: 100%;
      }
      -webkit-flex-direction: column;
      -ms-flex-direction: column;
      flex-direction: column;
      flex-flow: column;
      -moz-flex-direction: column;
    }
  }
</style>
