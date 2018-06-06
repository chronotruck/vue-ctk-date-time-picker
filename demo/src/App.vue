<template>
  <div id="app">
    <img src="./assets/logo.png" alt="Ctk logo">
    <div>
      <h1>VueCtkTimePicker</h1>
      <h3>A VueJs component for select time</h3>
      <ctk-time-picker label="Choose a time" v-model="value" ></ctk-time-picker>
      <br>
      <ctk-time-picker label="With color" v-model="value2" color="#89c200" ></ctk-time-picker>
      <br>
      <ctk-time-picker label="Minute interval : 10" v-model="value2" color="#89c200" :minute-interval="10"></ctk-time-picker>
    </div>
  </div>
</template>

<script>
import CtkTimePicker from 'vue-ctk-time-picker'

export default {
  name: 'App',
  components: {
    CtkTimePicker
  },
  data () {
    return {
      value: '02:00',
      value2: null
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#app {
  width: 80%;
  margin: 0 auto;
}
*, *::before, *::after {
  box-sizing: border-box;
}
</style>
