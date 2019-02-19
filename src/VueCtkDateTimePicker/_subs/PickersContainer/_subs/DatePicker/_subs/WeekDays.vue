<template>
  <div
    :class="{'is-dark': dark}"
    class="week-days flex"
  >
    <div
      v-for="(weekDay, index) in weekDays"
      :key="index"
      class="flex-1 text-muted lm-fs-12 flex justify-content-center align-center week-days-container"
    >
      {{ weekDay }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'WeekDays',
    props: {
      weekDays: { type: Array, default: Array, required: true },
      dark: { type: Boolean, default: Boolean }
    }
  }
</script>

<style lang="scss" scoped>
  .week-days {
    height: 41px;
    text-transform: capitalize;
    &.is-dark .week-days-container {
      color: #a8a8a8 !important;
    }
  }
  @media screen and (max-width: 415px) {
    &:not(.inline) {
      .datepicker-week {
        height: 21px !important;
      }
    }
  }
</style>
