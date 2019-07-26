<template>
  <div
    class="year-month-selector flex flex-direction-column"
    :class="{'dark': dark}"
  >
    <div class="datepicker-controls flex align-center justify-content-right">
      <div class="arrow-month h-100" v-if="!isMonthMode">
        <button
          type="button"
          tabindex="-1"
          class="datepicker-button datepicker-prev text-center h-100 flex align-center"
          @click="prevStepYears()"
        >
          <svg viewBox="0 0 1000 1000">
            <path
              d="M336.2 274.5l-210.1 210h805.4c13 0 23 10 23 23s-10 23-23 23H126.1l210.1 210.1c11 11 11 21 0 32-5 5-10 7-16 7s-11-2-16-7l-249.1-249c-11-11-11-21 0-32l249.1-249.1c21-21.1 53 10.9 32 32z"/>
          </svg>
        </button>
      </div>
      <div class="arrow-month h-100 text-right" v-if="!isMonthMode">
        <button
          type="button"
          tabindex="-1"
          class="datepicker-button datepicker-next text-center h-100 flex align-center justify-content-right"
          @click="nextStepYears()"
        >
          <svg viewBox="0 0 1000 1000">
            <path
              d="M694.4 242.4l249.1 249.1c11 11 11 21 0 32L694.4 772.7c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210.1-210.1H67.1c-13 0-23-10-23-23s10-23 23-23h805.4L662.4 274.5c-21-21.1 11-53.1 32-32.1z"/>
          </svg>
        </button>
      </div>

      <CustomButton
        :color="dark ? '#757575' : '#424242'"
        :dark="dark"
        with-border
        @click="$emit('back')"
      >
        <span class="fs-16">
          ✕
        </span>
      </CustomButton>
    </div>
    <div class="flex-1 flex flex-wrap justify-content-between align-center">
      <CustomButton
        v-for="(m, index) in months"
        :key="index"
        :color="color"
        :selected="currentMonth === index"
        :dark="dark"
        class="month-button"
        with-border
        @click="selectMonth(index)"
      >
        {{ m }}
      </CustomButton>
      <CustomButton
        v-for="year in years"
        :key="year"
        :color="color"
        :dark="dark"
        :selected="currentYear === year"
        with-border
        @click="selectYear(year)"
      >
        {{ year }}
      </CustomButton>
    </div>
  </div>
</template>

<script>
  import {getMonthsShort} from '@/VueCtkDateTimePicker/modules/month'
  import CustomButton from '@/VueCtkDateTimePicker/_subs/CustomButton'

  const ArrayRange = (start, end) => {
    return Array(end - start + 1).fill().map((_, idx) => {
      const n = start + idx
      return n
    })
  }

  export default {
    name: 'YearMonthSelector',
    components: {
      CustomButton
    },
    props: {
      locale: {type: String, default: String},
      dark: {type: Boolean, default: Boolean},
      color: {type: String, default: String},
      mode: {type: String, default: String},
      month: {type: Object, default: Object}
    },
    data() {
      return {
        months: null,
        years: null
      }
    },
    computed: {
      currentMonth() {
        return this.month.month
      },
      currentYear() {
        return this.month.year
      },
      isMonthMode() {
        return this.mode === 'month'
      }
    },
    mounted() {
      if (this.isMonthMode) {
        this.getMonths()
      } else {
        this.getYears()
      }
    },
    methods: {
      getMonths() {
        this.years = null
        this.months = getMonthsShort(this.locale)
      },
      getYears() {
        this.months = null
        this.years = ArrayRange(this.month.year - 7, this.month.year + 7)
      },
      prevStepYears() {
        this.years = ArrayRange(this.years[0] - 14, this.years[0])
      },
      nextStepYears() {
        this.years = ArrayRange(this.years[this.years.length - 1], this.years[this.years.length - 1] + 14)
      },
      selectMonth(monthNumber) {
        this.$emit('input', {month: monthNumber, year: this.currentYear})
      },
      selectYear(year) {
        this.$emit('input', {month: this.currentMonth, year: year})
      }
    }
  }
</script>

<style lang="scss" scoped>
  .year-month-selector {
    position: absolute;
    background-color: white;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    color: #424242;
    padding: 10px;

    &.dark {
      color: white;
      background-color: #424242;
    }

    .month-button {
      text-transform: capitalize;
    }
  }

  .datepicker-controls {
    /*height: 56px;*/
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
</style>
