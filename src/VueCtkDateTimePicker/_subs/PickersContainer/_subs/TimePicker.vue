<template>
  <div
    ref="time-picker"
    :class="{'inline': inline, 'is-dark': dark }"
    :style="[{height: `${getHeight}px`}]"
    class="time-picker flex"
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
        :key="item"
        type="button"
        tabindex="-1"
        class="time-picker-column-item flex align-center justify-content-center"
        :class="{active: (column.type === 'hours' ? hour : column.type === 'minutes' ? minute : apm) === item}"
        @click="selectTime(item, column.type)"
      >
        <span
          :style="styleColor"
          class="time-picker-column-item-effect"
        />
        <span class="time-picker-column-item-text">
          {{ item }}
        </span>
      </button>
    </div>
  </div>
</template>
<script>
  import moment from 'moment-timezone'

  const ArrayRange = (end, twoDigit, step = 1) => {
    const len = Math.floor(end / step)
    return Array(len).fill().map((_, idx) => {
      const number = idx * step
      return (twoDigit && number < 10 ? '0' : '') + number
    })
  }

  export default {
    name: 'TimePicker',
    props: {
      value: { type: String, default: String },
      format: { type: String, default: String },
      minuteInterval: { type: Number, default: Number },
      month: { type: Object, default: Object },
      dateTime: { type: Object, default: Object },
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
        apm: null
      }
    },
    computed: {
      timeFormat () {
        return this.format
          ? this.getTimeFormat()
          : 'h:mm a'
      },
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
      hours () {
        const twoDigit = this.timeFormat.includes('hh') || this.timeFormat.includes('HH')
        const twelve = this.timeFormat.includes('hh') || this.timeFormat.includes('h')
        return ArrayRange(twelve ? 12 : 24, twoDigit)
      },
      minutes () {
        const twoDigit = this.timeFormat.includes('mm') || this.timeFormat.includes('MM')
        return ArrayRange(60, twoDigit, this.minuteInterval)
      },
      apms () {
        return this.timeFormat.includes('A') || this.timeFormat.includes('a')
          ? this.timeFormat.includes('A') ? ['AM', 'PM'] : ['am', 'pm']
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
    mounted () {
      this.buildComponent()
    },
    methods: {
      getTimeFormat () {
        const formatLower = this.format.toLowerCase()
        const hasTimeFormat = formatLower.includes('h')
        if (hasTimeFormat) {
          const hasTime = this.format.includes('T')
          return hasTime ? this.format.split('T')[1] : this.format.split(' ')[1]
        } else {
          window.console.warn('A time format must be indicated') 
        }
      },
      buildComponent () {
        const formattedFormat = this.timeFormat.replace('A', '').replace('a', '').replace(' ', '')
        const formats = formattedFormat.split(':')
        this.hour = moment(this.dateTime).format(formats[0]),
        this.minute = moment(this.dateTime).format(formats[1])
        this.apm = this.apms ? moment(this.dateTime).format('HH') >= 12 ? this.apms[1] : this.apms[0] : null
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
      selectTime (item, type) {
        if (type === 'hours') {
          this.hour = item
        } else if (type === 'minutes') {
          this.minute = item
        } else if (type === 'apms') {
          this.apm = item
        }
        let time  
        if (this.apm) {
          time = moment(`${this.hour}:${this.minute} ${this.apm}`, 'HH:mm A').format('HH:mm')
        } else {
          time = moment(`${this.hour}:${this.minute}`, 'HH:mm').format('HH:mm')
        }
        const dateTime = moment(`${this.dateTime.format('YYYY-MM-DD')} ${time}`)
        this.$emit('change-time', dateTime)
        this.initPositionView()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .time-picker {
    width: 160px;
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
      }
    }
  }
</style>
