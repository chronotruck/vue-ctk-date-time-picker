<template>
  <div
    id="app"
    :class="{'dark': darkMode}"
  >
    <div
      id="vueCtkDateTimePicker"
      class="ctk-date-time-picker"
    >
      <header>
        <img
          v-if="!darkMode"
          src="./assets/logo.png"
          alt="logo-chronotruck"
        >
        <img
          v-else
          src="./assets/logo-dark.png"
          alt="logo-chronotruck-dark"
        >
        <h1>CtkDatetimePicker</h1>
        <h3>A VueJs component for select date & time</h3>
        <button
          class="btn"
          @click="darkMode = !darkMode"
          style="margin-top: 20px;"
        >
          {{ darkMode ? 'Disable' : 'Enable' }} Dark Mode
        </button>
      </header>
      <div
        v-if="devMode"
        class="container"
      >
        <div class="flex flex-wrap align-center justify-content-center">
          <div
            :class="{'dark': darkMode}"
            class="component-container"
          >
            <p>Inititale value : '2018-04-05T04:26'</p>
            <p>v-model = {{ value || 'null' }}</p>
            <CtkDateTimePicker
              v-model="value"
              color="purple"
              :dark="darkMode"
              open
              range
            />
          </div>
        </div>
      </div>
      <div
        v-else
        class="container"
      >
        <div class="components-container">
          <div
            v-for="demo in demoComponents"
            :key="demo.title"
            :class="{'dark': darkMode}"
            class="component-container"
          >
            <div class="flex flex-wrap justify-content-between">
              <h3>{{ demo.title }}</h3>
              <h4>{{ demo.description }}</h4>
            </div>
            <hr>
            <div class="flex flex-wrap justify-content-between">
              <p><b>Inititale value</b> : {{ demo.initial }}</p>
              <p><b>v-model</b> = {{ demo.value || 'null' }}</p>
            </div>
            <hr>
            <button
              class="btn option"
              @click="demo.editOption = !demo.editOption"
            >
              Edit options
            </button>
            <div
              v-show="demo.editOption"
              class="flex flex-wrap"
            >
              <div class="flex-1">
                <h4 style="margin-bottom: 10px;">
                  String options
                </h4>
                <div
                  v-for="str in stringOptions"
                  :key="str"
                  class="flex"
                  style="margin-bottom: 10px;"
                >
                  <input
                    type="text"
                    v-model="demo.options[str]"
                  >
                  <span style="margin-left: 15px;">
                    {{ str }}
                  </span>
                </div>
                <hr>
                <h4 style="margin-bottom: 10px;">
                  Integer options
                </h4>
                <div
                  v-for="int in intOptions"
                  :key="int"
                  class="flex"
                  style="margin-bottom: 10px;"
                >
                  <input
                    type="number"
                    v-model="demo.options[int]"
                  >
                  <span style="margin-left: 15px;">
                    {{ int }}
                  </span>
                </div>
                <hr>
              </div>
              <div class="flex-1">
                <h4 style="margin-bottom: 10px;">
                  Boolean options
                </h4>
                <div
                  v-for="opt in booleanOptions"
                  :key="opt"
                  class="flex"
                  style="margin-bottom: 10px;"
                >
                  <CheckboxInput
                    v-model="demo.options[opt]"
                    :id="`${demo.id}${opt}`"
                  />
                  <span style="margin-left: 15px;">
                    {{ opt }}
                  </span>
                </div>
              </div>
            </div>
            <CtkDateTimePicker
              v-model="demo.value"
              :only-date="demo.options.onlyDate"
              :only-time="demo.options.onlyTime"
              :range="demo.options.range"
              :format="demo.options.format"
              :formatted="demo.options.formatted"
              :output-format="demo.options.outputFormat"
              :inline="demo.options.inline"
              :color="demo.options.color"
              :button-color="demo.options.buttonColor"
              :no-header="demo.options.noHeader"
              :auto-close="demo.options.autoClose"
              :error="demo.options.error"
              :hint="demo.options.hint"
              :open="demo.options.open"
              :dark="darkMode || demo.options.dark"
              :overlay="demo.options.overlay"
              :position="demo.options.position"
              :disabled-dates="demo.options.disabledDates"
              :disabled-hours="demo.options.disabledHours"
              :minute-interval="demo.options.minuteInterval"
              :min-date="demo.options.minDate"
              :max-date="demo.options.maxDate"
              :no-weekends-days="demo.options.noWeekendDays"
              :no-shortcuts="demo.options.noShortcuts"
              :no-button="demo.options.noButton"
              :shortcuts-translations="demo.options.shortcutsTranslations"
              :locale="demo.options.locale"
              :input-size="demo.options.inputSize"
            >
              <input
                v-if="demo.options && demo.options.slot && demo.options.slot.type === 'input'"
                type="text"
              >
              <button
                v-else-if="demo.options && demo.options.slot && demo.options.slot.type === 'button'"
                type="button"
                class="btn"
                style="margin: 0;"
              />
            </CtkDateTimePicker>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CtkDateTimePicker from './VueCtkDateTimePicker'
  import CheckboxInput from './CheckboxInput'

  export default {
    name: 'App',
    components: {
      CtkDateTimePicker, CheckboxInput
    },
    data () {
      return {
        devMode: true,
        booleanOptions: [
          'noHeader', 'autoClose', 'error', 'dark', 'overlay', 'noWeekendDays', 'noShortcuts', 'noButton'
        ],
        stringOptions: [
          'hint', 'color', 'buttonColor', 'position', 'format', 'formatted', 'outputFormat',
          'minDate', 'maxDate', 'disabledDates', 'disabledHours'
        ],
        intOptions: [
          'minuteInterval'
        ],
        demoComponents: [
          {
            id: "1",
            title: 'Date Time Picker',
            description: 'Date & Time selector - With small input (input-size="sm")',
            initial: '2018-04-05 20:26',
            value: '2018-04-05 20:26',
            editOption: false,
            options: {
              inputSize: 'sm'
            }
          },
          {
            id: "2",
            title: 'Range Date Picker',
            description: 'Date Range selector - With custom element to trigger the component (only input or button)',
            editOption: false,
            initial: {
              start: '2018-04-05',
              end: '2018-04-20'
            },
            value: {
              start: '2018-04-05',
              end: '2018-04-20'
            },
            options: {
              slot: {
                type: 'button'
              },
              range: true,
              formatted: 'll',
              format: 'YYYY-MM-DD',
              color: 'purple'
            }
          },
          {
            id: "3",
            title: 'Date Picker',
            description: 'Date selector - With large input (input-size="lg")',
            editOption: false,
            initial: '2018-04-05',
            value: '2018-04-05',
            options: {
              onlyDate: true,
              color: 'coral',
              inputSize: 'lg',
              buttonColor: 'green'
            }
          },
          {
            id: "4",
            title: 'Time Picker',
            description: 'Time selector',
            editOption: false,
            initial: '11:26 am',
            value: '11:26 am',
            options: {
              format: 'hh:mm a',
              formatted: 'hh:mm a',
              onlyTime: true,
              color: 'firebrick',
              minuteInterval: '10'
            }
          },
          {
            id: "5",
            title: 'Inline Picker',
            description: 'Inline selector (available for all pickers)',
            editOption: false,
            initial: {
              start: '2018-04-05',
              end: '2018-04-20'
            },
            value: {
              start: '2018-04-05',
              end: '2018-04-20'
            },
            options: {
              onlyDate: true,
              inline: true,
              format: 'YYYY-MM-DD',
              formatted: 'll',
              range: true
            }
          }
        ],
        value: '2018-04-05 20:26',
        value2: null,
        value3: '2018-04-05T14:26',
        rangeValues: {
          start: '2018-04-05',
          end: '2018-04-20'
        },
        rangeValues2: {
          start: null,
          end: null
        },
        timePickerValue: '11:26 am',
        minuteInterval: 5,
        minuteInterval2: 10,
        hint: 'Error message',
        errorHint: true,
        timeFormat: 'hh:mm a',
        minDate: '2018-04-03',
        maxDate: '2018-04-12',
        darkMode: false,
        shortcutsTranslation: {
          'this_week': 'Cette semaine',
          'last_30_days': '30 derniers jours',
          'last_month': 'Mois précédent',
          'last_year': 'L\'année dernière'
        },
        disabledDates: ['2018-04-03', '2018-04-07', '2018-04-09', '2018-04-11', '2018-04-13', '2018-04-15', '2018-04-17', '2018-04-19'],
        disabledHours: Array.from(new Array(8), (x, i) => `0${i}`).concat(
          Array.from(new Array(23), (x, i) => {
            if (i + 1 > 18) {
              return `${i + 1}`
            } else {
              return null
            }
          })
        )
      }
    }
  }
</script>

<style lang="scss">
  @import "./VueCtkDateTimePicker/assets/main.scss";
  html, body, #app, #vueCtkDateTimePicker {
    margin: 0;
    min-height: 100%;
    min-width: 100%;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    &.dark {
      background-color: darken(#424242, 20%);
      header {
        color: #ffffffb3;
      }
    }
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
  h3, h4, h1, p {
    margin: 0;
  }
  hr {
    border-top: 1px solid #CCC;
    border-bottom: 0;
    margin: 20px 0;
  }
  textarea {
    background-color: #FFF;
    color: #bd4147;
    border: 1px solid #CCC;
    border-radius: 4px;
    outline: none;
    font-size: 85%;
    width: 100%;
    font-weight: 700;
    font-family: monospace, monospace;
    resize: none;
  }
  .btn {
    padding: 10px 20px;
    margin-bottom: 20px;
    border: none;
    border-radius: 30px;
    font-size: 14px;
    outline: none;
    cursor: pointer;
    -webkit-transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
    background-color: #96bf31;
    color: #FFF;
    font-weight: 500;
    &:hover {
      background-color: darken(#96bf31, 10%);
    }
    &.option {
      background-color: #424242;
      &:hover {
        background-color: darken(#424242, 10%);
      }
    }
  }
  .component-container {
    margin: 0 10px 20px 10px;
    padding: 20px;
    background: #F2F2F2;
    border-radius: 4px;
    box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12);
    min-width: 300px;
    &.dark {
      background-color: darken(#424242, 10%);
      color: #FFF;
      textarea {
        background: #424242;
        color: dodgerblue;
      }
      .btn.option {
        background-color: #424242;
        &:hover {
          background-color: lighten(#424242, 10%);
        }
      }
    }
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
