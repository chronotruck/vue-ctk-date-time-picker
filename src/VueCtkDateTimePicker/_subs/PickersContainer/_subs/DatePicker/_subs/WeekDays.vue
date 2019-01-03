<template>
  <div class="week-days flex">
    <div
      v-for="(weekDay, index) in weekDays"
      :key="index"
      class="flex-1 text-muted fs-12 flex justify-content-center align-center"
    >
      {{ weekDay }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'WeekDays',
    props: {
      weekDays: { type: Array, default: Array, required: true }
    }
  }
</script>

<style lang="scss" scoped>
  .week-days{
    height: 41px;
    text-transform: capitalize;
  }
  @media screen and (max-width: 415px) {
    &:not(.inline) {
      .datepicker-week {
        height: 21px !important;
      }
    }
  }
</style>