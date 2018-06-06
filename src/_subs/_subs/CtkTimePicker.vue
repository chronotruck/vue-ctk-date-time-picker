<template>
  <div class="timepicker-container flex" :style="[{height: this.month ? (monthDays.length + weekDay) > 35 ? '347px' : '307px' : '180px' }]">
    <div class="time-container hours-container flex flex-1 flex-direction-column h-100 mh-100 w-100">
      <div class="flex align-center justify-content-center time-label text-muted">{{hourType}}</div>
      <div class="h-100 mh-100 numbers-container">
        <div v-for="hr in hours" :key="hr"
             class="item flex align-center justify-content-center"
             :class="[{active: hour === hr}, hr]"
             @click.stop="select('hour', hr)">
          <span class="timepicker-day-effect" :style="styleColor"></span>
          <span class="timepicker-day-text">{{hr}}</span>
        </div>
      </div>
    </div>
    <div class="time-container minutes-container flex-1 flex flex-direction-column h-100 mh-100 w-100">
      <div class="flex align-center justify-content-center time-label text-muted">{{minuteType}}</div>
      <div class="h-100 mh-100 numbers-container">
        <div v-for="m in minutes" :key="m"
             :class="[{active: minute === m}, m]"
             @click.stop="select('minute', m)"
             class="item flex align-center justify-content-center">
          <span class="timepicker-day-effect" :style="styleColor"></span>
          <span class="timepicker-day-text">{{m}}</span>
        </div>
      </div>
    </div>
    <div class="time-container apms-container flex flex-1 flex-direction-column h-100 mh-100 w-100" v-if="apmType">
      <div class="flex align-center justify-content-center time-label text-muted">{{apmType}}</div>
      <div class="h-100 mh-100 numbers-container">
        <div v-for="a in apms" :key="a"
             :class="[{active: apm === a}, a]"
             @click.stop="select('apm', a)"
             class="item flex align-center justify-content-center">
          <span class="timepicker-day-effect" :style="styleColor"></span>
          <span class="timepicker-day-text">{{a}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  const CONFIG = {
    HOUR_TOKENS: ['HH', 'H', 'hh', 'h', 'kk', 'k'],
    MINUTE_TOKENS: ['mm', 'm'],
    APM_TOKENS: ['A', 'a']
  }
  export default {
    name: 'CtkTimePicker',
    props: {
      format: {type: String},
      minuteInterval: {type: Number},
      month: {},
      dateTime: {type: Object},
      color: { type: String }
    },
    data: function () {
      return {
        hours: [],
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
      styleColor: function () {
        return {
          backgroundColor: this.color
        }
      },
      monthDays: function () {
        const r1 = this.$moment.range(this.month.start, this.month.end).by('days')
        return Array.from(r1)
      },
      weekDay: function () {
        return this.month.start.weekday()
      }
    },
    watch: {
      'format': 'renderFormat',
      minuteInterval: function (newInteval) {
        this.renderList('minute', newInteval)
      },
      'displayTime': 'fillValues'
    },
    methods: {
      formatValue: function (type, i) {
        switch (type) {
          case 'H':
          case 'm':
            return String(i)
          case 'HH':
          case 'mm':
            return i < 10 ? `0${i}` : String(i)
          case 'h':
          case 'k':
            return String(i + 1)
          case 'hh':
          case 'kk':
            return (i + 1) < 10 ? `0${i + 1}` : String(i + 1)
          default:
            return ''
        }
      },
      checkAcceptingType: function (validValues, formatString, fallbackValue) {
        if (!validValues || !formatString || !formatString.length) { return '' }
        for (let i = 0; i < validValues.length; i++) {
          if (formatString.indexOf(validValues[i]) > -1) {
            return validValues[i]
          }
        }
        return fallbackValue || ''
      },
      renderFormat: function (newFormat) {
        newFormat = newFormat || this.format
        this.hourType = this.checkAcceptingType(CONFIG.HOUR_TOKENS, newFormat, 'HH')
        this.minuteType = this.checkAcceptingType(CONFIG.MINUTE_TOKENS, newFormat, 'mm')
        this.apmType = this.checkAcceptingType(CONFIG.APM_TOKENS, newFormat)
        this.renderHoursList()
        this.renderList('minute')
        if (this.apmType) {
          this.renderApmList()
        }
        const self = this
        this.$nextTick(() => {
          self.readValues()
        })
      },
      renderHoursList: function () {
        const hoursCount = (this.hourType === 'h' || this.hourType === 'hh') ? 12 : 24
        this.hours = []
        for (let i = 0; i < hoursCount; i++) {
          this.hours.push(this.formatValue(this.hourType, i))
        }
      },
      renderList: function (listType, interval) {
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
      renderApmList: function () {
        this.apms = []
        if (!this.apmType) { return }
        this.apms = this.apmType === 'A' ? ['AM', 'PM'] : ['am', 'pm']
      },
      readValues: function () {
        this.hour = this.dateTime.format(this.hourType)
        this.minute = this.dateTime.format(this.minuteType)
        if (this.apmType) {
          this.apm = this.dateTime.format('HH') >= 12 ? this.apms[1] : this.apms[0]
        }

        // if (!this.value || this.muteWatch) { return }
        // const timeValue = JSON.parse(JSON.stringify(this.value || {}))
        // const values = Object.keys(timeValue)
        // if (values.length === 0) { return }
        // if (values.indexOf(this.hourType) > -1) {
        //   this.hour = timeValue[this.hourType]
        // }
        // if (values.indexOf(this.minuteType) > -1) {
        //   this.minute = timeValue[this.minuteType]
        // }
        // if (values.indexOf(this.apmType) > -1) {
        //   this.apm = timeValue[this.apmType]
        // }
        this.fillValues()
      },
      fillValues: function () {
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
      updateTimeValue: function (fullValues) {
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
      isTwelveHours: function (token) {
        return token === 'h' || token === 'hh'
      },
      select: function (type, value) {
        if (type === 'hour') {
          this.hour = value
        } else if (type === 'minute') {
          this.minute = value
        } else if (type === 'apm') {
          this.apm = value
        }
        let time
        if (this.apm) {
          time = this.$moment(this.hour + ':' + this.minute + (this.apm ? this.apm : ''), 'HH:mm A').format('HH:mm')
        } else{
          time = this.$moment(this.hour + ':' + this.minute + (this.apm ? this.apm : ''), 'HH:mm').format('HH:mm')
        }
        let dateTime = this.$moment(this.$moment(this.dateTime).format('YYYY-MM-DD') + ' ' + time)
        this.$emit('change-time', dateTime)
      }
  },
    mounted: function () {
      this.renderFormat()
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
      }
      .numbers-container {
        padding: 0;
        margin: 0;
        list-style: none;
        overflow: auto;
        .item {
          padding: .3em 0;
          color: #161616;
          cursor: pointer;
          position: relative;
          .timepicker-day-effect {
            position: absolute;
            opacity: 0.6;
            background: dodgerblue;
            height: 100%;
            width: 100%;
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
              opacity: 0.6;
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
        }
      }
    }
  }
</style>
