<template>
  <div>
    <h1>
      Component:
    </h1>
    <VDatetimePicker
      v-model="date"
    />
  </div>
</template>

<script>
  import VDatetimePicker from '../VDatetimePicker'

  export default {
    components: {
      VDatetimePicker
    },
    data () {
      return {
        date: null
      }
    }
  }
</script>
