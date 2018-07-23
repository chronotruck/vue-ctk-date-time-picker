<template>
  <div id="app">
    <div id="vueCtkDateTimePicker" style="width: 90%; margin: 0 auto;">
      <header>
        <img src="./assets/logo.png" alt="">
        <h1>CtkDatetimePicker</h1>
        <h3>A VueJs component for select date & time</h3>
      </header>
      <div class="components-container flex">
        <div class="component-container flex-1">
          <h3>DateTimePicker</h3>
          <p>Inititale value : '2018-04-05T04:26'</p>
          <p>v-model = {{value || 'null'}}</p>
          <ctk-date-time-picker
            v-model="value"
            :minute-interval="10"
            color="#96bf31"
            enable-button-validate
            min-date="2018-04-03"
            max-date="2018-04-12"
          />
          <br>
          <textarea readonly tabindex="-1" style="height: 120px;">
            <ctk-date-time-picker
              v-model="value"
              :minute-interval="10"
              color="#96bf31"
              enable-button-validate
              min-date="2018-04-03"
              max-date="2018-04-12"
            />
          </textarea>

        </div>
        <div class="component-container flex-1">
          <h3>DatePicker</h3>
          <p>Inititale value : null</p>
          <p>v-model = {{value2 || 'null'}}</p>
          <ctk-date-time-picker
            format="YYYY-MM-DD"
            formatted="ddd D MMM YYYY"
            v-model="value2"
            label="Choose date"
          />
          <br>
          <textarea readonly tabindex="-1" style="height: 110px;">
            <ctk-date-time-picker
              format="YYYY-MM-DD"
              formatted="ddd D MMM YYYY"
              v-model="value2"
              label="Choose date"
              disable-time
            />
          </textarea>
        </div>
      </div>
      <div class="components-container flex">
        <div class="component-container flex-1">
          <h3>TimePicker</h3>
          <p>Inititale value : '14:26'</p>
          <p>v-model = {{timePickerValue || 'null'}}</p>
          <ctk-date-time-picker
            id="timepicker"
            formatted="h:mm a"
            format="HH:mm"
            time-format="h:mm a"
            v-model="timePickerValue"
            label="Choose time"
            :minute-interval="minuteInterval2"
            disable-date
            :disabled="false"
          />
          <br>
          <textarea readonly tabindex="-1" style="height: 130px;">
            <ctk-date-time-picker
              v-model="yourValue"
              formatted="h:mm a"
              format="HH:mm"
              time-format="h:mm a"
              label="Choose time"
              :minute-interval="10"
              disable-date
            />
          </textarea>
        </div>
        <div class="component-container flex-1">
          <h3>DateTimePicker without header & auto close</h3>
          <p>Inititale value : '2018-04-05T14:26'</p>
          <p>v-model = {{value3 || 'null'}}</p>
          <ctk-date-time-picker
            without-header
            auto-close
            v-model="value3"
            time-format="HH:mm"
            :minute-interval="10"
            :error-hint="errorHint"
            :hint="hint"
            locale="fr"
          />
          <br>
          <textarea readonly tabindex="-1" style="height: 130px;">
            <ctk-date-time-picker
              without-header
              auto-close
              v-model="yourValue"
              time-format="HH:mm"
              :minute-interval="10"
              :error-hint="true"
              hint="Error message"
              locale="fr"
            />
          </textarea>
        </div>
      </div>
      <div class="components-container flex">
        <div class="component-container flex-1">
          <h3>Inline DateTimePicker</h3>
          <p>v-model = {{value || 'null'}}</p>
          <ctk-date-time-picker
            v-model="value"
            label="Choose date time"
            no-weekends-days
            without-input
          />
          <br>
          <textarea readonly tabindex="-1" style="height: 100px;">
            <ctk-date-time-picker
              v-model="value"
              label="Choose date time"
              no-weekends-days
              without-input
            />
          </textarea>
        </div>
        <div class="component-container flex-1">
          <h3>DateTimePicker disabled</h3>
          <p>Option : 'disabled'</p>
          <ctk-date-time-picker
            disabled
          />
          <br>
          <textarea readonly tabindex="-1" style="height: 60px;">
            <ctk-date-time-picker
              disabled
            />
          </textarea>
        </div>
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
      timeFormat: 'hh:mm a',
      locale: 'fr'
    }
  }
}
</script>

<style lang="scss">
  @import "./vue-ctk-date-time-picker/assets/main.scss";
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  header {
    text-align: center;
  }
  *, *::before, *::after {
    box-sizing: border-box;
  }
  img {
    height: 140px;
  }
  h3, h1, p {
    margin-top: 0;
  }
  .component-container {
    margin: 0 10px;
    padding: 20px;
    background: #F2F2F2;
    border: 1px solid #EAEAEA;
    border-radius: 4px;
    margin-bottom: 20px;
    box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
  }
  textarea {
    background-color: #FFF;
    color: #bd4147;
    border: 1px solid #CCC;
    /* display: inline-block; */
    border-radius: 4px;
    outline: none;
    font-size: 85%;
    width: 100%;
    font-weight: 700;
    font-family: monospace, monospace;
    resize: none;
  }
  @media screen and (max-width: 1024px) {
    .components-container.flex {
      -webkit-flex-direction: column;
      -ms-flex-direction: column;
      flex-direction: column;
      flex-flow: column;
      -moz-flex-direction: column;
    }
  }
</style>
