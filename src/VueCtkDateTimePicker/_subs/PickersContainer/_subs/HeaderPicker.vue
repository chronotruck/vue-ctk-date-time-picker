<template>
  <div
    :style="bgStyle"
    class="header-picker"
    :class="{'is-dark': dark}"
  >
    <div
      v-if="!onlyTime"
      class="header-picker-year"
    >
      <TransitionGroup
        :name="transitionName"
        tag="span"
      >
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
        tag="span"
        class="header-picker-date dots-text flex-1"
      >
        <span
          v-for="dateFormatted in [getDateFormatted]"
          :key="dateFormatted"
        >
          {{ modelValue ? getDateFormatted : '...' }}
        </span>
      </TransitionGroup>
      <div
        v-if="!isFormatTwelve && !noTime && modelValue"
        class="header-picker-time flex"
        :style="[getTimePickerWidth()]"
        :class="[!onlyTime ? 'pl-10' : 'flex-1 justify-content-center']"
      >
        <TransitionGroup
          :name="transitionName"
          tag="span"
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
          tag="span"
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
        v-else-if="!noTime && modelValue"
        :style="[getTimePickerWidth()]"
        class="header-picker-time flex flex-fixed"
        :class="[!onlyTime ? 'pl-10' : 'flex-1 justify-content-center']"
      >
        <TransitionGroup
          :name="transitionName"
          tag="span"
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
      <div
        v-else-if="!noTime"
        :style="[getTimePickerWidth()]"
        class="header-picker-time flex flex-fixed"
        :class="[!onlyTime ? 'pl-10' : 'flex-1 justify-content-center']"
      >
        <span>...</span>
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
  import moment from 'moment'

  export default {
    name: 'HeaderPicker',
    props: {
      modelValue: { type: [String, Object], default: null },
      color: { type: String, default: null },
      onlyTime: { type: Boolean, default: null },
      transitionName: { type: String, default: null },
      format: { type: String, default: null },
      timeFormat: { type: String, default: null },
      noTime: { type: Boolean, default: null },
      range: { type: Boolean, default: null },
      dark: { type: Boolean, default: null }
    },
    computed: {
      bgStyle () {
        return {
          padding: this.onlyTime ? '10px 0' : '10px 0 10px 10px',
          backgroundColor: this.color
        }
      },
      dateTime () {
        const date = this.modelValue
          ? this.range
            ? (this.modelValue.end || this.modelValue.start)
              ? moment(this.modelValue.end ? this.modelValue.end : this.modelValue.start, 'YYYY-MM-DD HH:mm')
              : moment()
            : moment(this.modelValue, 'YYYY-MM-DD HH:mm')
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
        const hasStartValues = this.modelValue && this.modelValue.start
        const hasEndValues = this.modelValue && this.modelValue.end
        if (!hasStartValues && !hasEndValues) {
          return '... - ...'
        } else if (hasStartValues || hasEndValues) {
          const datesFormatted = hasStartValues ? `${moment(this.modelValue.start).format('ll')}` : '...'
          return hasEndValues ? `${datesFormatted} - ${moment(this.modelValue.end).format('ll')}` : `${datesFormatted} - ...`
        } else {
          return null
        }
      }
    },
    methods: {
      getTimePickerWidth () {
        const width = this.onlyTime ? '100%' : '160px'
        const result = {
          flex: `0 0 ${width}`,
          width: `${width}`,
          minWidth: `${width}`,
          maxWidth: `${width}`
        }
        return result
      }
    }
  }
</script>

<style lang="scss" scoped>
  $headerTextSize: 18px;
  .header-picker {
    background: #FFF;
    border-bottom: 1px solid #EAEAEA;
    color: #FFF;
    position: relative;
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
      min-width: 74px;
    }
    .pl-10 {
      padding-left: 10px;
    }
    .time-number {
      width: 22px;
    }
    &.is-dark {
      border: 0;
      color: #FFF !important;
    }
  }
</style>
