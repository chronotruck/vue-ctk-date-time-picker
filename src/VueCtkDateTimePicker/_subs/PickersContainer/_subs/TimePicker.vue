<template>
  <div
    ref="time-picker"
    :class="{'inline': inline, 'is-dark': dark, 'with-border': !onlyTime }"
    :style="[{height: `${getHeight}px`}]"
    class="time-picker flex flex-fixed"
  >
    <div
      v-for="column in columns"
      :key="column.type"
      :ref="column.type"
      :style="[columnPadding()]"
      class="time-picker-column flex-1 flex flex-direction-column text-center"
    >
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
        @click="isActive(column.type, item.value) ? null : selectTime(item.value, column.type)"
      >
        <span
          :style="styleColor"
          class="time-picker-column-item-effect"
        />
        <span class="time-picker-column-item-text">
          {{ item.item }}
        </span>
      </button>
    </div>
  </div>
</template>
<script>
  import moment from 'moment-timezone'
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
  const ArrayMinuteRange = (end, twoDigit, step = 1) => {
    const len = Math.floor(end / step)
    return Array(len).fill().map((_, idx) => {
      const number = idx * step
      return {
        value: number,
        item: (twoDigit && (number < 10) ? '0' : '') + number
      }
    })
  }

  export default {
    name: 'TimePicker',
    props: {
      value: { type: String, default: String },
      format: { type: String, default: String },
      minuteInterval: { type: [String, Number], default: Number },
      month: { type: Object, default: Object },
      color: { type: String, default: String },
      inline: { type: Boolean, default: Boolean },
      visible: { type: Boolean, default: Boolean },
      onlyTime: { type: Boolean, default: Boolean },
      dark: { type: Boolean, default: Boolean },
      disabledHours: { type: Array, default: Array }
    },
    data () {
      return {
        hour: null,
        minute: null,
        apm: null,
        oldvalue: this.value
      }
    },
    computed: {
      monthDays () {
        return this.month.getMonthDays()
      },
      weekDay () {
        return this.month.getWeekStart()
      },
      getHeight () {
        return !this.onlyTime
          ? this.month
            ? (this.monthDays.length + this.weekDay) > 35 ? 347 : 307
            : 180
          : 200
      },
      styleColor () {
        return {
          backgroundColor: this.color
        }
      },
      twelveFormat () {
        return this.format.includes('h') // && (this.format.includes('a') || this.format.includes('A'))
      },
      hours () {
        const twoDigit = this.format.includes('hh') || this.format.includes('HH')
        const isAfternoon = this.apm ? this.apm === 'pm' || this.apm === 'PM' : false
        return ArrayHourRange(
          this.twelveFormat
            ? 1
            : 0,
          this.twelveFormat
            ? 12
            : 23,
          twoDigit,
          isAfternoon,
          this.disabledHours
        )
      },
      minutes () {
        const twoDigit = this.format.includes('mm') || this.format.includes('MM')
        return ArrayMinuteRange(60, twoDigit, this.minuteInterval)
      },
      apms () {
        const upper = [{ value: 'AM', item: 'AM' }, { value: 'PM', item: 'PM' }]
        const lower = [{ value: 'am', item: 'am' }, { value: 'pm', item: 'pm' }]
        return this.format.includes('A') || this.format.includes('a')
          ? this.format.includes('A') ? upper : lower
          : null
      },
      columns () {
        return [
          {type: 'hours', items: this.hours},
          {type: 'minutes', items: this.minutes},
          ...(this.apms ? [{type: 'apms', items: this.apms}] : []),
        ]
      }
    },
    watch: {
      visible (val) {
        if (val) {
          this.initPositionView()
        }
      },
      value () {
        this.buildComponent()
      }
    },
    mounted () {
      if (this.value) {
        this.buildComponent()
      }
    },
    methods: {
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
          : h
        return this.disabledHours.includes(hourToTest)
      },
      buildComponent () {
        const hour = moment(this.value, this.format).format('HH')
        this.hour = this.isHoursDisabled(hour) ? this.getAvailableHour() : parseInt(hour)
        this.minute = parseInt(moment(this.value, this.format).format('mm'))
        this.apm = this.apms ? parseInt(moment(this.value, this.format).format('HH')) >= 12 ? this.apms[1].value : this.apms[0].value : null
        this.initPositionView()
      },
      columnPadding () {
        const pad = this.getHeight / 2 - 25 / 2
        return {
          paddingTop: `${pad}px`,
          paddingBottom: `${pad}px`
        }
      },
      initPositionView () {
        const containers = ['hours', 'minutes']
        if (this.apms) containers.push('apms')
        this.$nextTick(() => {
          containers.forEach((container) => {
            const elem = this.$refs[container][0]
            elem.style.overflow = 'hidden'
            elem.scrollTop = 0
            const selected = elem.querySelector(`.time-picker-column-item.active`)
            if (selected) {
              const boundsSelected = selected.getBoundingClientRect()
              const boundsElem = elem.getBoundingClientRect()
              const timePickerHeight = this.$refs['time-picker'].clientHeight
              if (boundsSelected && boundsElem) {
                elem.scrollTop = (25 / 2) + boundsSelected.top - boundsElem.top - timePickerHeight / 2
              }
            }
            setTimeout(() => {
              elem.style.overflow = 'auto'
            }, 300)
          })
        })
      },
      getAvailableHour () {
        return this.hours.find((element) => {
          return element.disabled === false
        }).value
      },
      selectTime (item, type) {
        if (type === 'hours') {
          this.hour = item
        } else if (type === 'minutes') {
          this.minute = item
        } else if (type === 'apms') {
          const newHour = item === 'pm' || item === 'PM' ? this.hour + 12 : this.hour - 12
          this.hour = newHour
          this.apm = item
        }
        const availableHour = this.hour ? this.hour : this.getAvailableHour()
        let hour = availableHour >= 24 ? 0 : this.hour ? this.hour : availableHour
        hour = (hour < 10 ? '0' : '') + hour
        const minute = this.minute ? (this.minute < 10 ? '0' : '') + this.minute : '00'
        const time = `${hour}:${minute}`
        this.$emit('input', time)
        this.initPositionView()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .time-picker {
    width: 140px;
    &-column {
      overflow-y: auto;
      padding: 5px 0;
      &-item {
        height: 25px;
        min-height: 25px;
        padding: 0;
        color: #000;
        cursor: pointer;
        position: relative;
        border: none;
        background: transparent;
        font-size: 14px;
        width: 100%;
        outline: none;
        &-effect {
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
