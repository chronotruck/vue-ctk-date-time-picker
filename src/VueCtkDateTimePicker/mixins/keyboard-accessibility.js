import moment from 'moment'
/*
  * Vue mixin to inject the required methods, events to handle the date navigation
  * with the keyboard.
  * @module mixin - keyboardAccessibility
*/
export default {
  props: {
    noKeyboard: { type: Boolean, default: false }
  },
  emits: ['close'],
  data () {
    return {
      newValue: null
    }
  },
  computed: {
    currentValue () {
      return this.range
        ? this.newValue || this.modelValue.end || this.modelValue.start || moment()
        : this.newValue || this.modelValue || moment()
    }
  },
  methods: {
    keyPressed (e) {
      /*
        13 : Enter
        27 : Escape
        32 : Space
        35 : Page Down
        36 : Page Up
        37 : Left
        38 : Up
        39 : Right
        40 : Down
        40 : Right
      */
      if (e.keyCode === 38 || e.keyCode === 40 || e.keyCode === 35 || e.keyCode === 36) {
        e.view.event.preventDefault()
      }
      if (this.isKeyboardActive) {
        try {
          if (e.keyCode === 38) {
            this.previousWeek()
          } else if (e.keyCode === 37) {
            this.previousDay()
          } else if (e.keyCode === 39) {
            this.nextDay()
          } else if (e.keyCode === 40) {
            this.nextWeek()
          } else if (e.keyCode === 32 || e.keyCode === 13) {
            this.selectThisDay()
          } else if (e.keyCode === 36) {
            this.previousMonth()
          } else if (e.keyCode === 35) {
            this.nextMonth()
          } else if (e.keyCode === 27) {
            this.$emit('close')
          }
          if ('activeElement' in document) document.activeElement.blur()
        } catch (err) {
          window.console.error('An error occured while switch date', e)
        }
      }
    },
    previousWeek () {
      const newValue = moment(this.currentValue).subtract(1, 'week')
      if (!this.isDisabled(newValue)) {
        this.newValue = newValue
        this.checkMonth()
      }
    },
    previousDay () {
      const newValue = moment(this.currentValue).subtract(1, 'days')
      if (!this.isDisabled(newValue)) {
        this.newValue = newValue
        this.checkMonth()
      }
    },
    nextDay () {
      const newValue = moment(this.currentValue).add(1, 'days')
      if (!this.isDisabled(newValue)) {
        this.newValue = newValue
        this.checkMonth()
      }
    },
    nextWeek () {
      const newValue = moment(this.currentValue).add(1, 'week')
      if (!this.isDisabled(newValue)) {
        this.newValue = newValue
        this.checkMonth()
      }
    },
    previousMonth () {
      const newValue = moment(this.currentValue).subtract(1, 'month')
      if (!this.isDisabled(newValue)) {
        this.newValue = newValue
        this.checkMonth()
      }
    },
    nextMonth () {
      const newValue = moment(this.currentValue).add(1, 'month')
      if (!this.isDisabled(newValue)) {
        this.newValue = newValue
        this.checkMonth()
      }
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
    if (!this.noKeyboard && (this.inline || this.visible)) {
      window.addEventListener('keydown', this.keyPressed)
    }
  },
  beforeUnmount () {
    window.removeEventListener('keydown', this.keyPressed)
  },
  watch: {
    visible (value) {
      if (!this.noKeyboard && value) {
        window.addEventListener('keydown', this.keyPressed)
      } else {
        window.removeEventListener('keydown', this.keyPressed)
      }
    }
  }
}
