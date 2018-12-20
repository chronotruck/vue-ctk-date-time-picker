<template>
  <div
    :class="{'inline': inline, 'is-dark': dark, 'only-time': disableDate}"
    :style="[getHeight]"
    class="timepicker-container flex"
  >
    <div class="time-container hours-container flex flex-1 flex-direction-column">
      <div class="flex align-center justify-content-center time-label text-muted">
        {{ hourType }}
      </div>
      <div
        ref="hours"
        class="h-100 mh-100 numbers-container"
      >
        <button
          v-for="hr in hours"
          :key="hr.value"
          :class="[
            {active: (hour === hr.value) && value},
            hr,
            {disabled: hr.disabled}
          ]"
          :disabled="hr.disabled"
          type="button"
          tabindex="-1"
          class="item flex align-center justify-content-center"
          @click.stop="select('hour', hr.value)"
        >
          <span
            :style="styleColor"
            class="timepicker-day-effect"
          />
          <span class="timepicker-day-text">
            {{ hr.value }}
          </span>
        </button>
      </div>
    </div>
    <div class="time-container minutes-container flex-1 flex flex-direction-column">
      <div class="flex align-center justify-content-center time-label text-muted">
        {{ minuteType }}
      </div>
      <div
        ref="minutes"
        class="h-100 mh-100 numbers-container"
      >
        <button
          v-for="m in minutes"
          :key="m"
          :class="[{active: (minute === m) && value}, m]"
          type="button"
          tabindex="-1"
          class="item flex align-center justify-content-center"
          @click.stop="select('minute', m)"
        >
          <span
            :style="styleColor"
            class="timepicker-day-effect"
          />
          <span class="timepicker-day-text">
            {{ m }}
          </span>
        </button>
      </div>
    </div>
    <div
      v-if="apmType"
      class="time-container apms-container flex flex-1 flex-direction-column"
    >
      <div class="flex align-center justify-content-center time-label text-muted">
        {{ apmType }}
      </div>
      <div class="h-100 mh-100 numbers-container">
        <button
          v-for="a in apms"
          :key="a"
          :class="[{active: (apm === a) && value}, a]"
          type="button"
          tabindex="-1"
          class="item flex align-center justify-content-center"
          @click.stop="select('apm', a)"
        >
          <span
            :style="styleColor"
            class="timepicker-day-effect"
          />
          <span class="timepicker-day-text">
            {{ a }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'

  const CONFIG = {
    HOUR_TOKENS: ['HH', 'H', 'hh', 'h', 'kk', 'k'],
    MINUTE_TOKENS: ['mm', 'm'],
    APM_TOKENS: ['A', 'a']
  }

  export default {
    name: 'CtkTimePicker',
    props: {
      format: {type: String, default: String},
      minuteInterval: {type: Number, default: Number},
      month: {type: Object, default: Object},
      dateTime: {type: Object, default: Object},
      color: {type: String, default: String},
      inline: {type: Boolean, default: Boolean},
      visible: {type: Boolean, default: Boolean},
      value: {type: String, default: String},
      disableDate: {type: Boolean, default: Boolean},
      dark: {type: Boolean, default: Boolean},
      disabledHours: { type: Array, default: Array }
    },
    data () {
      return {
        minutes: [],
        apms: [],
        muteWatch: false,
        hourType: 'HH',
        minuteType: 'mm',
        apmType: '',
        hour: '',
        minute: '',
        apm: '',
        fullValues: undefined
      }
    },
    computed: {
      styleColor () {
        return {
          backgroundColor: this.color
        }
      },
      monthDays () {
        return this.month.getMonthDays()
      },
      weekDay () {
        return this.month.getWeekStart()
      },
      getHeight () {
        return {
          height: !this.disableDate
            ? this.month
              ? (this.monthDays.length + this.weekDay) > 35 ? '347px' : '307px'
              : '180px'
            : '200px'
        }
      },
      hours () {
        const hoursCount = (this.hourType === 'h' || this.hourType === 'hh') ? 12 : 24
        let hours = []
        for (let i = 0; i < hoursCount; i++) {
          const formattedHours = this.formatValue(this.hourType, i)
          hours.push({ disabled: this.isHoursDisabled(formattedHours), value: formattedHours })
        }
        return hours
      }
    },
    watch: {
      'format': 'renderFormat',
      minuteInterval (interval) {
        this.renderList('minute', interval)
      },
      'displayTime': 'fillValues',
      visible (v) {
        if (v) {
          this.$nextTick(() => {
            const containers = ['hours', 'minutes']
            containers.forEach((container) => {
              const elem = this.$refs[`${container}`]
              const selected = this.$refs[`${container}`].querySelector(`.item.active`)
              if (selected) {
                elem.scrollTop = 0
                const boundsSelected = selected.getBoundingClientRect()
                const boundsElem = elem.getBoundingClientRect()
                if (elem && boundsSelected && boundsElem) {
                  elem.scrollTop = boundsSelected.top - boundsElem.top - 40
                }
              }
            })
          })
        }
      }
    },
    mounted () {
      this.renderFormat()
    },
    methods: {
      formatValue (type, i) {
        switch (type) {
        case 'H': case 'm':
          return String(i)
        case 'HH': case 'mm':
          return i < 10 ? `0${i}` : String(i)
        case 'h': case 'k':
          return String(i + 1)
        case 'hh': case 'kk':
          return (i + 1) < 10 ? `0${i + 1}` : String(i + 1)
        default:
          return ''
        }
      },
      checkAcceptingType (validValues, formatString, fallbackValue) {
        if (!validValues || !formatString || !formatString.length) {
          return ''
        }
        for (let i = 0; i < validValues.length; i++) {
          if (formatString.indexOf(validValues[i]) > -1) {
            return validValues[i]
          }
        }
        return fallbackValue || ''
      },
      renderFormat (newFormat) {
        newFormat = newFormat || this.format
        this.hourType = this.checkAcceptingType(CONFIG.HOUR_TOKENS, newFormat, 'HH')
        this.minuteType = this.checkAcceptingType(CONFIG.MINUTE_TOKENS, newFormat, 'mm')
        this.apmType = this.checkAcceptingType(CONFIG.APM_TOKENS, newFormat)
        this.renderList('minute')
        if (this.apmType) {
          this.renderApmList()
        }
        const self = this
        this.$nextTick(() => {
          self.readValues()
        })
      },
      renderList (listType, interval) {
        if (listType === 'minute') {
          interval = interval || this.minuteInterval
        } else {
          return
        }
        if (interval === 0) {
          interval = 60
        } else if (interval > 60) {
          window.console.warn('`' + listType + '-interval` should be less than 60. Current value is', interval)
          interval = 1
        } else if (interval < 1) {
          window.console.warn('`' + listType + '-interval` should be NO less than 1. Current value is', interval)
          interval = 1
        } else if (!interval) {
          interval = 1
        }
        this.minutes = []
        for (let i = 0; i < 60; i += interval) {
          this.minutes.push(this.formatValue(this.minuteType, i))
        }
      },
      renderApmList () {
        this.apms = []
        if (!this.apmType) {
          return
        }
        this.apms = this.apmType === 'A' ? ['AM', 'PM'] : ['am', 'pm']
      },
      readValues () {
        this.hour = this.dateTime.format(this.hourType)
        this.minute = this.dateTime.format(this.minuteType)
        if (this.apmType) {
          this.apm = this.dateTime.format('HH') >= 12 ? this.apms[1] : this.apms[0]
        }
        this.fillValues()
      },
      fillValues () {
        let fullValues = {}
        const baseHour = this.hour
        const baseHourType = this.hourType
        const hourValue = baseHour || baseHour === 0 ? Number(baseHour) : ''
        const baseOnTwelveHours = this.isTwelveHours(baseHourType)
        const apmValue = (baseOnTwelveHours && this.apm) ? String(this.apm).toLowerCase() : false
        CONFIG.HOUR_TOKENS.forEach((token) => {
          if (token === baseHourType) {
            fullValues[token] = baseHour
            return
          }
          let value
          let apm
          switch (token) {
          case 'H':
          case 'HH':
            if (!String(hourValue).length) {
              fullValues[token] = ''
              return
            } else if (baseOnTwelveHours) {
              if (apmValue === 'pm') {
                value = hourValue < 12 ? hourValue + 12 : hourValue
              } else {
                value = hourValue % 12
              }
            } else {
              value = hourValue % 24
            }
            fullValues[token] = (token === 'HH' && value < 10) ? `0${value}` : String(value)
            break
          case 'k':
          case 'kk':
            if (!String(hourValue).length) {
              fullValues[token] = ''
              return
            } else if (baseOnTwelveHours) {
              if (apmValue === 'pm') {
                value = hourValue < 12 ? hourValue + 12 : hourValue
              } else {
                value = hourValue === 12 ? 24 : hourValue
              }
            } else {
              value = hourValue === 0 ? 24 : hourValue
            }
            fullValues[token] = (token === 'kk' && value < 10) ? `0${value}` : String(value)
            break
          case 'h':
          case 'hh':
            if (apmValue) {
              value = hourValue
              apm = apmValue || 'am'
            } else {
              if (!String(hourValue).length) {
                fullValues[token] = ''
                fullValues.a = ''
                fullValues.A = ''
                return
              } else if (hourValue > 11) {
                apm = 'pm'
                value = hourValue === 12 ? 12 : hourValue % 12
              } else {
                if (baseOnTwelveHours) {
                  apm = ''
                } else {
                  apm = 'am'
                }
                value = hourValue % 12 === 0 ? 12 : hourValue
              }
            }
            fullValues[token] = (token === 'hh' && value < 10) ? `0${value}` : String(value)
            fullValues.a = apm
            fullValues.A = apm.toUpperCase()
            break
          }
        })
        if (this.minute || this.minute === 0) {
          const minuteValue = Number(this.minute)
          fullValues.m = String(minuteValue)
          fullValues.mm = minuteValue < 10 ? `0${minuteValue}` : String(minuteValue)
        } else {
          fullValues.m = ''
          fullValues.mm = ''
        }
        this.fullValues = fullValues
        this.updateTimeValue(fullValues)
        this.$emit('change', {data: fullValues})
      },
      updateTimeValue (fullValues) {
        this.muteWatch = true
        const self = this
        const baseTimeValue = JSON.parse(JSON.stringify(this.value || {}))
        let timeValue = {}
        Object.keys(baseTimeValue).forEach((key) => {
          timeValue[key] = fullValues[key]
        })
        this.$emit('input', timeValue)
        this.$nextTick(() => {
          self.muteWatch = false
        })
      },
      isTwelveHours (token) {
        return token === 'h' || token === 'hh'
      },
      isHoursDisabled (h) {
        let hourToTest = this.apmType
          ? moment(`${h} ${this.apm}`, [`${this.hourType} ${this.apmType}`]).format('HH')
          : h
        return this.disabledHours.includes(hourToTest)
      },
      selectAvailableHour () {
        const hourToSet = this.hours.find((element) => {
          return element.disabled === false
        })
        this.select('hour', hourToSet.value)
      },
      select (type, value) {
        if (type === 'hour') {
          this.hour = value
        } else if (type === 'minute') {
          this.minute = value
        } else if (type === 'apm') {
          this.apm = value
        }
        if (this.isHoursDisabled(this.hour)) {
          this.selectAvailableHour()
        }
        let time
        if (this.apm) {
          time = moment(this.hour + ':' + this.minute + (this.apm ? this.apm : ''), 'HH:mm A').format('HH:mm')
        } else {
          time = moment(this.hour + ':' + this.minute + (this.apm ? this.apm : ''), 'HH:mm').format('HH:mm')
        }
        const dateTime = moment(`${this.dateTime.format('YYYY-MM-DD')} ${time}`)
        this.$emit('change-time', dateTime)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .timepicker-container {
    width: 160px;
    .time-container {
      position: relative;
      &.hours-container {
        border-left: 1px solid #EAEAEA;
      }
      .time-label {
        padding: .3em 0;
        color: #000;
      }
      .numbers-container {
        padding: 0;
        margin: 0;
        list-style: none;
        overflow: auto;
        .item {
          padding: .3em 0;
          color: #000;
          cursor: pointer;
          position: relative;
          border: none;
          background: transparent;
          font-size: 14px;
          width: 100%;
          outline: none;
          .timepicker-day-effect {
            position: absolute;
            opacity: 0.6;
            background: dodgerblue;
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            -webkit-transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
            transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
            transform: scale(0);
          }
          .timepicker-day-text {
            position: relative;
          }
          &:hover {
            color: #FFF;
            transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
            .timepicker-day-effect {
              transform: scale(1);
            }
          }
          &.active,
          &.active:hover {
            color: #FFF;
            .timepicker-day-effect {
              transform: scale(1);
              opacity: 1;
            }
          }
          &.disabled {
            color: #CCC;
            &:hover {
              color: #CCC;
            }
            .timepicker-day-effect {
              transform: scale(0) !important;
              opacity: 0 !important;
            }
          }
        }
      }
    }
    &.is-dark {
      .time-container {
        &.hours-container {
          border-color: lighten(#424242, 20%);
        }
        .numbers-container .item {
          color: #FFF;
        }
        .time-label {
          color: lighten(#424242, 40%) !important;
        }
      }
    }
    &.only-time {
      .time-container.hours-container {
        border: none;
      }
    }
  }

  @media screen and (max-width: 415px) {
    .timepicker-container:not(.inline) {
      .time-container.hours-container {
        border: 0;
      }
      width: 100%;
      border-top: 1px solid #EAEAEA;
      height: unset !important;
    }
    .timepicker-container.is-dark {
      border-color: lighten(#424242, 20%);
    }
  }
</style>
