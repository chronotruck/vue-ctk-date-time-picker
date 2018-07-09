<template>
  <div id="app">
    <div id="vueCtkDateTimePicker" style="width: 90%; margin: 0 auto;">
      <h1>CtkDatetimePicker</h1>
      <h3>A VueJs component for select date & time</h3>
      <div class="component-container">
        <h3>DateTimePicker</h3>
        <p>color="#96bf31"</p>
        <p>Inititale value : '2018-04-05T04:26'</p>
        <p>v-model = {{value}}</p>
        <p>no format, no formatted</p>
        <p>min-date="2018-06-03" max-date="2018-06-12"</p>
        <ctk-date-time-picker v-model="value"
                              :minute-interval="minuteInterval" name="start" color="#96bf31"
                              min-date="2018-04-03" max-date="2018-04-12" />
      </div>
      <div class="component-container">
        <h3>DatePicker</h3>
        <p>-</p>
        <p>Inititale value : null</p>
        <p>v-model = {{value2}}</p>
        <p>format="YYYY-MM-DD" formatted="ddd D MMM YYYY"</p>
        <p>disable-timepicker</p>
        <ctk-date-time-picker format="YYYY-MM-DD"
                              formatted="ddd D MMM YYYY"
                              v-model="value2" name="end"
                              label="Choose date"
                              disable-time />
      </div>
      <br>
      <div class="component-container">
        <h3>TimePicker</h3>
        <p>Inititale value : '14:26'</p>
        <p>v-model = {{timePickerValue}}</p>
        <p>minute-interval = 10</p>
        <p>format="HH:mm" time-format="h:mm a" formatted="h:mm a"</p>
        <ctk-date-time-picker id="timepicker" format="HH:mm" formatted="h:mm a" :time-format="timeFormat" v-model="timePickerValue" label="Choose time" :minute-interval="minuteInterval2" disable-date />
      </div>
      <br>
      <div class="component-container">
        <h3>DateTimePicker without header</h3>
        <p>Inititale value : '2018-04-05T14:26'</p>
        <p>v-model = {{value3}}</p>
        <p>locale="{{locale}}" time-format="HH:mm"</p>
        <p>format="null" formatted="null"</p>
        <p>Option : 'auto-close' (Close component on select date)</p>
        <ctk-date-time-picker without-header
                              v-model="value3"
                              time-format="HH:mm"
                              id="datetimepicker-optins"
                              label="Custom label"
                              :minute-interval="minuteInterval2"
                              :error-hint="errorHint"
                              :locale="locale"
                              :hint="hint"
                              auto-close />
      </div>
      <div class="component-container">
        <p>v-model = {{value}}</p>
        <p>Option : 'without-input' && 'no-weekends-days' && 'auto-close'</p>
        <ctk-date-time-picker v-model="value" name="end"
                              label="Choose date time"
                              no-weekends-days
                              without-input/>
      </div>
      <div class="component-container">
        <p>Option : 'disabled'</p>
        <ctk-date-time-picker
          disabled
        />
      </div>
    </div>
  </div>
</template>

<script>
  import CtkDateTimePicker from './vue-ctk-date-time-picker/vue-ctk-date-time-picker.vue'

  export default {
    name: 'App',
    components: {
      CtkDateTimePicker
    },
    data () {
      return {
        value: '2018-04-05T04:26',
        value2: null,
        value3: '2018-04-05T14:26',
        timePickerValue: '14:26',
        minuteInterval: 5,
        minuteInterval2: 10,
        hint: 'Error message',
        errorHint: true,
        timeFormat: 'h:mm a',
        locale: 'fr'
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
  }
  #app {
    width: 90%;
    margin: 0 auto;
  }
  *, *::before, *::after {
    box-sizing: border-box;
  }
  img {
    height: 140px;
  }
  h1 {
    margin-top: 0;
  }
  .component-container {
    float: left;
    width: 46%;
    margin: 0 2%;
    padding: 20px;
    background: #F2F2F2;
    border: 1px solid #EAEAEA;
    border-radius: 4px;
    margin-bottom: 20px;
    box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  }
</style>
