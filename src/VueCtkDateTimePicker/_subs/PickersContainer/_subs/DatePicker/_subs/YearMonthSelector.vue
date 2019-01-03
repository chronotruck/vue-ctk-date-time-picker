<template>
  <div
    class="year-month-selector flex flex-direction-column"
    :class="{'dark': dark}"
  >
    <div class="flex justify-content-right">
      <CustomButton
        color="#424242"
        @click="$emit('back')"
      >
        <span class="fs-16">
          ✕
        </span>
      </CustomButton>
    </div>
    <div class="flex-1 flex flex-wrap justify-content-between align-center">
      <CustomButton
        v-for="(month, index) in months"
        :key="index"
        :color="color"
        :is-selected="currentMonth === index + 1"
        class="month-button"
        with-border
        @click="selectMonth(index)"
      >
        {{ month }}
      </CustomButton>
      <CustomButton
        v-for="year in years"
        :key="year"
        :color="color"
        :is-selected="currentYear === year"
        with-border
        @click="selectYear(year)"
      >
        {{ year }}
      </CustomButton>
    </div>
  </div>
</template>

<script>
  import { getMonthsShort } from '@/VueCtkDateTimePicker/modules/month'
  import CustomButton from '@/VueCtkDateTimePicker/_subs/CustomButton'
  import moment from 'moment-timezone'

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
      locale: { type: String, default: String },
      dark: { type: Boolean, default: Boolean },
      color: { type: String, default: String },
      value: { type: [String, Object], default: String },
      mode: { type: String, default: String }
    },
    data () {
      return {
        months: null,
        years: null
      }
    },
    computed: {
      currentDate () {
        return this.value
      },
      currentMonth () {
        return parseInt(moment(this.currentDate, 'YYYY-MM-DD').format('M'))
      },
      currentYear () {
        return this.currentDate ? parseInt(moment(this.currentDate, 'YYYY-MM-DD').format('YYYY')) : parseInt(moment().format('YYYY'))
      },
      currentDay () {
        return parseInt(moment(this.currentDate, 'YYYY-MM-DD').format('DD'))
      },
      isMonthMode () {
        return this.mode === 'month'
      }
    },
    mounted () {
      if (this.isMonthMode) {
        this.getMonths()
      } else {
        this.getYears()
      }
    },
    methods: {
      getMonths () {
        this.years = null
        this.months = getMonthsShort(this.locale)
      },
      getYears () {
        this.months = null
        this.years = ArrayRange(this.currentYear - 7, this.currentYear + 7)
      },
      selectMonth (monthNumber) {
        const arrayDate = this.currentDate ? [this.currentYear, this.currentMonth, this.currentDay] : []
        const newDate = moment(arrayDate).month(monthNumber).format('YYYY-MM-DD')
        this.$emit('input', newDate)
      },
      selectYear (year) {
        const arrayDate = this.currentDate ? [this.currentYear, this.currentMonth, this.currentDay] : []
        const newDate = moment(arrayDate).year(year).format('YYYY-MM-DD')
        this.$emit('input', newDate)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .year-month-selector{
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
</style>