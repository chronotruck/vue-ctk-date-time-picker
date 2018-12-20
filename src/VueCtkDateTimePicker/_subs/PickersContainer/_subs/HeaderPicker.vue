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

    <div class="flex justify-content-between">
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
        v-if="!isFormatTwelve"
        class="header-picker-time flex"
        :style="getTimePickerWidth()"
        :class="[!onlyTime ? 'pl-10' : 'flex-1']"
      >
        <TransitionGroup
          :name="transitionName"
          class="dots-text flex-1 header-picker-hour flex justify-content-right"
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
          class="dots-text flex-1 header-picker-minute flex justify-content-left"
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
        v-else
        :style="getTimePickerWidth()"
        class="header-picker-time flex justify-content-center flex-fixed"
        :class="[!onlyTime ? 'pl-10' : 'flex-1']"
      >
        <TransitionGroup
          :name="transitionName"
          class="dots-text header-picker-hour"
        >
          <span
            v-for="hour in [dateTime.format(format)]"
            :key="hour"
          >
            {{ hour }}
          </span>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment-timezone'

  export default {
    name: 'HeaderPicker',
    props: {
      color: { type: String, default: String },
      onlyTime: { type: Boolean, default: Boolean },
      dateTime: {type: Object, default: Object},
      transitionName: { type: String, default: String },
      format: { type: String, default: String }
    },
    computed: {
      bgStyle () {
        return {
          backgroundColor: this.color,
          padding: this.onlyTime ? '10px 0' : '10px 0 10px 10px'
        }
      },
      year () {
        return moment(this.dateTime).format('YYYY')
      },
      getDateFormatted () {
        return moment(this.dateTime).format('ddd D MMM')
      },
      isFormatTwelve () {
        return this.format ? (this.format.indexOf('a') > -1) || (this.format.indexOf('A') > -1) : false
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
  .header-picker {
    background: dodgerblue;
    color: #FFF;
    padding: 10px 0 10px 10px;
    position: relative;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    &-year {
      opacity: 0.7;
      margin-bottom: 10px;
      font-size: 14px;
      line-height: 14px;
      position: relative;
      height: 14px;
    }
    &-date, &-time, &-minute, &-hour {
      font-size: 20px;
      line-height: 20px;
      position: relative;
      height: 20px;
    }
    &-date {
      text-transform: capitalize;
    }
    .pl-10 {
      padding-left: 10px;
    }
  }
</style>