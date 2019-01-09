import moment from 'moment-timezone'
/*
  * Vue mixin to inject the required methods, events to handle the date navigation
  * with the keyboard.
  * @module mixin - keyboardAccessibility
*/
export default {
  data () {
    return {
      newValue: null
    }
  },
  computed: {
    currentValue () {
      return this.range
        ? this.newValue || this.value.end || this.value.start || moment()
        : this.newValue || this.value || moment()
    }
  },
  methods: {
    keyPressed (e) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Home' || e.key === 'End') {
        e.view.event.preventDefault()
      }
      if (this.isKeyboardActive) {
        try {
          if (e.key === 'ArrowUp') {
            this.previousWeek()
          } else if (e.key === 'ArrowLeft') {
            this.previousDay()
          } else if (e.key === 'ArrowRight') {
            this.nextDay()
          } else if (e.key === 'ArrowDown') {
            this.nextWeek()
          } else if (e.code === 'Space' || e.key === 'Enter') {
            this.selectThisDay()
          } else if (e.key === 'Home') {
            this.previousMonth()
          } else if (e.key === 'End') {
            this.nextMonth()
          }
          if ('activeElement' in document) document.activeElement.blur()
        } catch (err) {
          window.console.error('An error occured while switch date', e)
        }
      }
    },
    previousWeek () {
      this.newValue = moment(this.currentValue).subtract(1, 'week')
      this.checkMonth()
    },
    previousDay () {
      this.newValue = moment(this.currentValue).subtract(1, 'days')
      this.checkMonth()
    },
    nextDay () {
      this.newValue = moment(this.currentValue).add(1, 'days')
      this.checkMonth()
    },
    nextWeek () {
      this.newValue = moment(this.currentValue).add(1, 'week')
      this.checkMonth()
    },
    previousMonth () {
      this.newValue = moment(this.currentValue).subtract(1, 'month')
      this.checkMonth()
    },
    nextMonth () {
      this.newValue = moment(this.currentValue).add(1, 'month')
      this.checkMonth()
    },
    selectThisDay () {
      this.selectDate(this.currentValue)
    },
    checkMonth () {
      this.$nextTick(() => {
        const newYear = parseInt(this.newValue.format('YYYY'))
        const currentYear = this.month.year
        const isSameYear = newYear === currentYear
        if (parseInt(this.newValue.format('MM') - 1) !== this.month.month && isSameYear) {
          if (parseInt(this.newValue.format('MM') - 1) > this.month.month) {
            this.changeMonth('next')
          } else {
            this.changeMonth('prev')
          }
        } else if (!isSameYear) {
          if (newYear > currentYear) {
            this.changeMonth('next')
          } else {
            this.changeMonth('prev')
          }
        }
      })
    }
  },
  mounted () {
    window.addEventListener('keydown', this.keyPressed)
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.keyPressed)
  },
  watch: {
    visible (value) {
      if (value) {
        window.addEventListener('keydown', this.keyPressed)
      } else {
        window.removeEventListener('keydown', this.keyPressed)
      }
    }
  }
}
