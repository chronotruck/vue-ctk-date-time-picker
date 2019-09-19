<template>
  <div>
    <h1>
      Component:
    </h1>
    <VueCtkDateTimePicker
      v-model="date"
    />
  </div>
</template>

<script>
  import VueCtkDateTimePicker from './../VueCtkDateTimePicker'

  export default {
    components: {
      VueCtkDateTimePicker
    },
    data () {
      return {
        date: null
      }
    }
  }
</script>
