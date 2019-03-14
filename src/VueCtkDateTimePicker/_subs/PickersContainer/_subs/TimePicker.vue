<template>
  <div
    ref="time-picker"
    :class="{'inline': inline, 'is-dark': dark, 'with-border': !onlyTime }"
    :style="[{height: `${height}px`}]"
    class="time-picker flex flex-fixed flex-1"
  >
    <div
      v-for="column in columns"
      :key="column.type"
      :ref="column.type"
      class="time-picker-column flex-1 flex flex-direction-column text-center"
      @scroll="noScrollEvent
        ? null
        : column.type === 'hours' ? onScrollHours($event) : column.type === 'minutes' ? onScrollMinutes($event) : onScrollApms($event)
      "
    >
      <div>
        <div
          class="before"
          :style="[columnPadding]"
        />
        <button
          v-for="item in column.items"
          :key="item.item"
          type="button"
          tabindex="-1"
          class="time-picker-column-item flex align-center justify-content-center"
          :class="{
            active: isActive(column.type, item.value),
            disabled: item.disabled
          }"
          @click="isActive(column.type, item.value) ? null : setTime(item.value, column.type)"
        >
          <span
            :style="styleColor"
            class="time-picker-column-item-effect"
          />
          <span class="time-picker-column-item-text flex-1">
            {{ item.item }}
          </span>
        </button>
        <div
          class="after"
          :style="[columnPadding]"
        />
      </div>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'

  const ArrayHourRange = (start, end, twoDigit, isAfternoon, disabledHours) => {
    return Array(end - start + 1).fill().map((_, idx) => {
      const n = start + idx
      const number = !isAfternoon ? n : n + 12
      const numberToTest = (n < 10 ? '0' : '') + n
      return {
        value: number,
        item: (twoDigit && (n < 10) ? '0' : '') + n,
        disabled: disabledHours.includes(numberToTest)
      }
    })
  }
  const ArrayMinuteRange = (start, end, twoDigit, step = 1) => {
    const len = Math.floor(end / step) - start
    
    return Array(len).fill().map((_, idx) => {
      const number = start + idx * step
      return {
        value: number,
        item: (twoDigit && (number < 10) ? '0' : '') + number
      }
    })
  }

  const debounce = (fn, time) => {
    let timeout

    return function () {
      const functionCall = () => fn.apply(this, arguments)
      clearTimeout(timeout)
      timeout = setTimeout(functionCall, time)
    }
  }

  export default {
    name: 'TimePicker',
    props: {
      value: { type: String, default: String },
      format: { type: String, default: String },
      minuteInterval: { type: [String, Number], default: Number },
      height: { type: Number, default: Number, required: true },
      color: { type: String, default: String },
      inline: { type: Boolean, default: Boolean },
      visible: { type: Boolean, default: Boolean },
      onlyTime: { type: Boolean, default: Boolean },
      dark: { type: Boolean, default: Boolean },
      disabledHours: { type: Array, default: Array },
      minTime: { type: String, default: String },
      maxTime: { type: String, default: String },
    },
    data () {
      return {
        hour: null,
        minute: null,
        apm: null,
        oldvalue: this.value,
        columnPadding: {},
        noScrollEvent: !!(this.value && !this.inline),
        delay: 0
      }
    },
    computed: {
      styleColor () {
        return {
          backgroundColor: this.color
        }
      },
      isTwelveFormat () {
        return this.format.includes('A') || this.format.includes('a')
      },
      hours () {
        const twoDigit = this.format.includes('hh') || this.format.includes('HH')
        const isAfternoon = this.apm ? this.apm === 'pm' || this.apm === 'PM' : false
        let min_h = this.isTwelveFormat ? 1 : 0
        let max_h = this.isTwelveFormat ? 12 : 23
        if (this.minTime)
          min_h = this.isTwelveFormat ? moment(this.minTime, 'h:mm a').format('h') : moment(this.minTime, 'HH:mm').format('HH')
        if (this.maxTime)
          max_h = this.isTwelveFormat ? moment(this.maxTime, 'h:mm a').format('h') : moment(this.maxTime, 'HH:mm').format('HH')
        
        // In case if hour present as 08, 09, etc
        min_h = parseInt(min_h, 10)
        max_h = parseInt(max_h, 10)

        return ArrayHourRange(
          min_h,
          max_h,
          twoDigit,
          isAfternoon,
          this.disabledHours
        )
      },
      minutes () {
        const twoDigit = this.format.includes('mm') || this.format.includes('MM')
        let min_m = 0
        let max_m = 60
        if (this.minTime)
          min_m = this.isTwelveFormat ? moment(this.minTime, 'h:mm a').format('mm') : moment(this.minTime, 'HH:mm').format('mm')
        if (this.maxTime)
          max_m = this.isTwelveFormat ? moment(this.maxTime, 'h:mm a').format('mm') : moment(this.maxTime, 'HH:mm').format('mm')
        
        // In case if minute present as 08, 09, etc
        min_m = parseInt(min_m, 10)
        max_m = parseInt(max_m, 10)

        return ArrayMinuteRange(min_m, max_m, twoDigit, this.minuteInterval)
      },
      apms () {
        let am_pm = ''

        if (this.isTwelveFormat && this.minTime)
          am_pm = moment(this.minTime, 'h:mm a').format('a')
        if (this.isTwelveFormat && this.maxTime)
          am_pm = moment(this.maxTime, 'h:mm a').format('a')

        const upper = am_pm ? 
                      [{value : am_pm.toUpperCase(), item : am_pm.toUpperCase()}] : 
                      [{ value: 'AM', item: 'AM' }, { value: 'PM', item: 'PM' }]
        const lower = am_pm ? 
                      [{value : am_pm, item : am_pm}] : 
                      [{ value: 'am', item: 'am' }, { value: 'pm', item: 'pm' }]
        
        return this.isTwelveFormat
          ? this.format.includes('A') ? upper : lower
          : null
      },
      columns () {
        return [
          { type: 'hours', items: this.hours },
          { type: 'minutes', items: this.minutes },
          ...(this.apms ? [{ type: 'apms', items: this.apms }] : [])
        ]
      }
    },
    watch: {
      visible (val) {
        if (val) {
          this.columnPad()
          this.initPositionView()
        }
      },
      value (value) {
        if (value) {
          this.buildComponent()
          this.initPositionView()
        }
      },
      height (newValue, oldValue) {
        if (newValue !== oldValue) {
          this.initPositionView()
        }
      }
    },
    mounted () {
      this.buildComponent()
      this.initPositionView()
    },
    methods: {
      getValue (scroll) {
        const itemHeight = 28
        const scrollTop = scroll.target.scrollTop
        return Math.round(scrollTop / itemHeight)
      },
      onScrollHours: debounce(function (scroll) {
        const value = this.getValue(scroll)
        const hour = this.isTwelveFormat
          ? this.apm === this.apms[0].value
            ? value + 1
            : (value + 1 + 12)
          : value
        if (this.isHoursDisabled(hour)) return
        this.hour = hour === 24 && !this.isTwelveFormat ? 23 : hour
        this.emitValue()
      }, 100),
      onScrollMinutes: debounce(function (scroll) {
        const value = this.getValue(scroll)
        this.minute = value * this.minuteInterval
        this.emitValue()
      }, 100),
      onScrollApms: debounce(function (scroll) {
        const value = this.getValue(scroll)
        if (this.apms && this.apms[value] && this.apm !== this.apms[value].value) {
          const newHour = this.apm === 'pm' || this.apm === 'PM' ? this.hour - 12 : this.hour + 12
          this.hour = newHour
        }
        this.apm = this.apms[value].value
        this.emitValue()
      }, 100),
      isActive (type, value) {
        return (type === 'hours'
          ? this.hour
          : type === 'minutes'
            ? this.minute
            : this.apm ? this.apm : null) === value
      },
      isHoursDisabled (h) {
        const hourToTest = this.apmType
          ? moment(`${h} ${this.apm}`, [`${this.hourType} ${this.apmType}`]).format('HH')
          : h < 10 ? '0' + h : '' + h
        return this.disabledHours.includes(hourToTest)
      },
      buildComponent () {
        if (this.isTwelveFormat && !this.apms) window.console.error(`VueCtkDateTimePicker - Format Error : To have the twelve hours format, the format must have "A" or "a" (Ex : ${this.format} a)`)
        const tmpHour = parseInt(moment(this.value, this.format).format('HH'))
        const hourToSet = this.isTwelveFormat && (tmpHour === 12 || tmpHour === 0)
          ? tmpHour === 0 ? 12 : 24
          : tmpHour
        this.hour = this.isHoursDisabled(hourToSet) ? this.getAvailableHour() : hourToSet
        this.minute = parseInt(moment(this.value, this.format).format('mm'))
        this.apm = this.apms && this.value
          ? this.hour > 12
            ? this.apms.length > 1 ? this.apms[1].value : this.apms[0].value
            : this.apms[0].value
          : null
        this.columnPad()
      },
      columnPad () {
        if (this.$refs['time-picker'] && (this.visible || this.inline)) {
          const run = (pad) => {
            this.columnPadding = {
              height: `${pad}px`
            }
          }
          this.$nextTick(() => {
            const pad = this.$refs['time-picker'].clientHeight / 2 - 28 / 2
            run(pad)
          })
        } else {
          return null
        }
      },
      initPositionView () {
        this.noScrollEvent = true
        const containers = ['hours', 'minutes']
        if (this.apms) containers.push('apms')
        setTimeout(() => {
          containers.forEach((container) => {
            const elem = this.$refs[container][0]
            elem.scrollTop = 0
            const selected = elem.querySelector(`.time-picker-column-item.active`)
            if (selected) {
              const boundsSelected = selected.getBoundingClientRect()
              const boundsElem = elem.getBoundingClientRect()
              const timePickerHeight = this.$refs['time-picker'].clientHeight
              if (boundsSelected && boundsElem) {
                elem.scrollTop = (28 / 2) + boundsSelected.top - boundsElem.top - timePickerHeight / 2
              }
            }
            setTimeout(() => {
              this.noScrollEvent = false
            }, 500)
          })
        }, 0)
      },
      getAvailableHour () {
        return this.hours.find((element) => {
          return element.disabled === false
        }).value
      },
      setTime (item, type) {
        if (type === 'hours') {
          this.hour = item
        } else if (type === 'minutes') {
          this.minute = item
        } else if (type === 'apms') {
          const newHour = item === 'pm' || item === 'PM' ? this.hour + 12 : this.hour - 12
          this.hour = newHour
          this.apm = item
        }
        this.emitValue()
      },
      emitValue () {
        const tmpHour = this.hour ? this.hour : this.getAvailableHour()
        let hour = this.isTwelveFormat && (tmpHour === 24 || tmpHour === 12)
          ? this.apm === this.apms[0].value ? 0 : 12
          : tmpHour
        hour = (hour < 10 ? '0' : '') + hour
        const minute = this.minute ? (this.minute < 10 ? '0' : '') + this.minute : '00'
        const time = `${hour}:${minute}`
        this.$emit('input', time)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .time-picker-column::-webkit-scrollbar {
    display: none;
  }
  .time-picker {
    width: 160px;
    max-width: 160px;
    position: relative;
    z-index: 1;
    &.inline {
      width: 100%;
      max-width: 100%;
    }
    &::after, &::before {
      content: "";
      top: 50%;
      position: absolute;
      margin: 0 auto;
      margin-top: -14px;
      height: 30px;
      z-index: -1;
      width: 85%;
      left: 0;
      right: 0;
      box-sizing: border-box;
      text-align: left;
      border-top: 1px solid #CCC;
      border-bottom: 1px solid #CCC;
    }
    &-column {
      position: relative;
      overflow-y: auto;
      &-item {
        height: 28px;
        min-height: 28px;
        padding: 0;
        color: #252525;
        cursor: pointer;
        position: relative;
        border: none;
        background: transparent;
        font-size: 13px;
        width: 100%;
        outline: none;
        &-effect {
          position: absolute;
          opacity: 0.6;
          background: dodgerblue;
          height: 24px;
          width: 70%;
          top: 2px;
          left: 15%;
          -webkit-transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
          transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
          transform: scale(0);
          border-radius: 4px;
          &:hover {
            transform: scale(1);
          }
        }
        &-text {
          position: relative;
        }
        &:hover {
          .time-picker-column-item-text {
            color: #FFF;
            transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
          }
          .time-picker-column-item-effect {
            transform: scale(1);
          }
        }
        &.active {
          color: #FFF;
          font-weight: bold;
          .time-picker-column-item-effect {
            transform: scale(1);
            opacity: 1;
          }
        }
        &.disabled {
          .time-picker-column-item-text {
            color: #CCC;
            &:hover {
              color: #CCC !important;
            }
          }
          .time-picker-column-item-effect {
            transform: scale(0) !important;
            opacity: 0 !important;
          }
        }
      }
    }
    &.with-border {
      border-left: 1px solid #EAEAEA;
      &.is-dark {
        border-left: 1px solid #757575;
      }
    }
    &.is-dark {
      .time-picker-column-item-text {
        color: #FFF;
      }
    }
  }
  @media screen and (max-width: 415px) {
    .time-picker:not(.inline) {
      border: 0;
      border-top: 1px solid #EAEAEA;
      width: 100%;
      max-width: 100%;
      height: unset !important;
      overflow: hidden;
      &.dark {
        border-top: 1px solid #757575;
      }
    }
    .timepicker-container.is-dark {
      border-color: lighten(#424242, 20%);
    }
  }
</style>
