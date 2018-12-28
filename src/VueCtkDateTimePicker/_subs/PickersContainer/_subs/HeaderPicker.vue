<template>
  <div
    :style="bgStyle"
    class="header-picker"
  >
    <div
      v-if="!onlyTime"
      class="header-picker-year"
    >
      <TransitionGroup :name="transitionName">
        <div
          v-for="y in [year]"
          :key="y"
        >
          {{ y }}
        </div>
      </TransitionGroup>
    </div>

    <div
      v-if="!range"
      class="flex justify-content-between"
    >
      <TransitionGroup
        v-if="!onlyTime"
        :name="transitionName"
        class="header-picker-date dots-text flex-1"
      >
        <span
          v-for="dateFormatted in [getDateFormatted]"
          :key="dateFormatted"
        >
          {{ getDateFormatted }}
        </span>
      </TransitionGroup>
      <div
        v-if="!isFormatTwelve && !noTime"
        class="header-picker-time flex"
        :style="getTimePickerWidth()"
        :class="[!onlyTime ? 'pl-10' : 'flex-1 justify-content-center']"
      >
        <TransitionGroup
          :name="transitionName"
          class="dots-text time-number header-picker-hour flex justify-content-right"
        >
          <span
            v-for="hour in [dateTime.format('HH')]"
            :key="hour"
          >
            {{ hour }}
          </span>
        </TransitionGroup>
        <span>:</span>
        <TransitionGroup
          :name="transitionName"
          class="dots-text time-number header-picker-minute flex justify-content-left"
        >
          <span
            v-for="min in [dateTime.format('mm')]"
            :key="min"
          >
            {{ min }}
          </span>
        </TransitionGroup>
      </div>
      <div
        v-else-if="!noTime"
        :style="getTimePickerWidth()"
        class="header-picker-time flex flex-fixed"
        :class="[!onlyTime ? 'pl-10' : 'flex-1 justify-content-center']"
      >
        <TransitionGroup
          :name="transitionName"
          class="dots-text header-picker-hour twelve"
        >
          <span
            v-for="hour in [dateTime.format(timeFormat)]"
            :key="hour"
            class="flex-fixed"
          >
            {{ hour }}
          </span>
        </TransitionGroup>
      </div>
    </div>
    <div
      v-else
      class="flex justify-content-between"
    >
      <div class="flex justify-content-between">
        <span class="header-picker-range dots-text flex-1">
          {{ getRangeDatesFormatted }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment-timezone'

  export default {
    name: 'HeaderPicker',
    props: {
      value: { type: [String, Object], default: String },
      color: { type: String, default: String },
      onlyTime: { type: Boolean, default: Boolean },
      transitionName: { type: String, default: String },
      format: { type: String, default: String },
      timeFormat: { type: String, default: String },
      noTime: { type: Boolean, default: Boolean },
      range: { type: Boolean, default: Boolean }
    },
    computed: {
      bgStyle () {
        return {
          backgroundColor: this.color,
          padding: this.onlyTime ? '10px 0' : '10px 0 10px 10px'
        }
      },
      dateTime () {
        const date = this.value
          ? this.range
            ? moment(this.value.end ? this.value.end : this.value.start, 'YYYY-MM-DD HH:mm')
            : moment(this.value, 'YYYY-MM-DD HH:mm')
          : moment()
        return date
      },
      year () {
        return this.dateTime.format('YYYY')
      },
      getDateFormatted () {
        return this.dateTime.format('ddd D MMM')
      },
      isFormatTwelve () {
        return this.format ? (this.format.indexOf('a') > -1) || (this.format.indexOf('A') > -1) : false
      },
      getRangeDatesFormatted () {
        const hasStartValues = this.value && this.value.start
        const hasEndValues = this.value && this.value.end
        if (!hasStartValues && !hasEndValues) {
          return '... - ...'
        } else if (hasStartValues || hasEndValues) {
          const datesFormatted = hasStartValues ? `${moment(this.value.start).format('ddd D MMM')}` : '...'
          return hasEndValues ? `${datesFormatted} - ${moment(this.value.end).format('ddd D MMM')}` : `${datesFormatted} - ...`
        } else {
          return null
        }
      }
    },
    methods: {
      getTimePickerWidth () {
        const width = 140
        const result = {
          flex: `0 0 ${width}px`,
          width: `${width}px`,
          minWidth: `${width}px`,
          maxWidth: `${width}px`
        }
        return result
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/VueCtkDateTimePicker/assets/animation.scss";
  $headerTextSize: 16px;
  .header-picker {
    background: dodgerblue;
    color: #FFF;
    position: relative;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    &-year {
      opacity: 0.7;
      margin-bottom: 5px;
      font-size: 14px;
      line-height: 14px;
      position: relative;
      height: 14px;
    }
    &-date, &-time, &-minute, &-hour, &-range {
      font-size: $headerTextSize;
      line-height: $headerTextSize;
      position: relative;
      height: $headerTextSize;
    }
    &-date {
      text-transform: capitalize;
    }
    &-hour.twelve {
      min-width: 82px;
    }
    .pl-10 {
      padding-left: 10px;
    }
    .time-number {
      width: 22px;
    }
  }
</style>