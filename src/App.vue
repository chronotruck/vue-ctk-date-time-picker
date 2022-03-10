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
        <div
          class="container lm-mt-4"
        >
          <a
            class="lm-btn lm-btn-dark lm-mr-2"
            target="_blank"
            href="https://github.com/chronotruck/vue-ctk-date-time-picker"
          >
            Github
          </a>
          <a
            class="lm-btn lm-btn-dark lm-mr-2"
            target="_blank"
            href="https://github.com/chronotruck/vue-ctk-date-time-picker/releases"
          >
            Changelog
          </a>
          <a
            class="lm-btn lm-btn-danger"
            target="_blank"
            href="https://www.npmjs.com/package/vue-ctk-date-time-picker"
          >
            Npm
          </a>
        </div>
        <button
          class="lm-btn lm-btn-success"
          @click="darkMode = !darkMode"
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
            <p>v-model = {{ value2 || 'null' }}</p>
            <br>
            <div class="flex">
              <CtkDateTimePicker
                v-model="value2"
                color="purple"
                :dark="darkMode"
                locale="fr"
                no-label
                :format="'YYYY-MM-DD HH:mm'"
                :min-date="'2020-10-10 12:15'"
                :max-date="'2020-10-30 18:45'"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="container"
      >
        <div class="components-container flex flex-wrap">
          <div
            v-for="demo in demoComponents"
            :key="demo.title"
            :class="{'dark': darkMode}"
            class="component-container"
          >
            <h3>{{ demo.title }}</h3>
            <h4>{{ demo.description }}</h4>
            <hr>
            <div class="flex flex-wrap justify-content-between">
              <p><b>Inititale value</b> : {{ demo.initial }}</p>
              <p><b>v-model</b> = {{ demo.value || 'null' }}</p>
            </div>
            <hr>
            <button
              class="lm-btn option"
              @click="demo.editOption = !demo.editOption"
            >
              Edit options
            </button>
            <div
              v-show="demo.editOption"
              class="flex flex-wrap component options"
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
                    v-model="demo.options[str]"
                    type="text"
                  >
                  <span style="margin-left: 15px;">
                    {{ str }}
                  </span>
                </div>
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
                    v-model="demo.options[int]"
                    type="number"
                  >
                  <span style="margin-left: 15px;">
                    {{ int }}
                  </span>
                </div>
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
                    :disabled="opt === 'onlyDate' || opt === 'onlyTime' || opt === 'range'"
                  />
                  <span style="margin-left: 15px;">
                    {{ opt }} {{ opt === 'onlyDate' || opt === 'onlyTime' || opt === 'range' ? '(disabled)' : '' }}
                  </span>
                </div>
              </div>
              <div>
                <h4 style="margin-bottom: 10px;">
                  Options not editable (is Array)
                </h4>
                <span
                  v-for="opt in optionsNotEditable"
                  :key="opt"
                >
                  {{ opt + ', ' }}
                </span>
              </div>
            </div>
            <div class="component">
              <CtkDateTimePicker
                v-model="demo.value"
                :id="demo.options.id"
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
                :label="demo.options.label"
                :no-label="demo.options.noLabel"
                :auto-close="demo.options.autoClose"
                :error="demo.options.error"
                :hint="demo.options.hint"
                :open="demo.options.open"
                :dark="darkMode || demo.options.dark"
                :overlay="demo.options.overlay"
                :position="demo.options.position"
                :disabled="demo.options.disabled"
                :disabled-dates="demo.options.disabledDates"
                :disabled-hours="demo.options.disabledHours"
                :enabled-dates="demo.options.enabledDates"
                :minute-interval="demo.options.minuteInterval"
                :first-day-of-week="demo.options.firstDayOfWeek"
                :min-date="demo.options.minDate"
                :max-date="demo.options.maxDate"
                :no-weekends-days="demo.options.noWeekendDays"
                :no-shortcuts="demo.options.noShortcuts"
                :no-button="demo.options.noButton"
                :button-now-translation="demo.options.buttonNowTranslation"
                :no-button-now="demo.options.noButtonNow"
                :locale="demo.options.locale"
                :input-size="demo.options.inputSize"
                :custom-shortcuts="demo.options.customShortcuts"
                :persistent="demo.options.persistent"
                :no-keyboard="demo.options.noKeyboard"
                :disabled-weekly="demo.options.disabledWeekly"
                :right="demo.options.right"
                :no-clear-button="demo.options.noClearButton"
              >
                <template
                  v-if="demo.options && demo.options.slot && demo.options.slot.type === 'input'"
                  v-slot="{ dateFormatted, toggleDatePicker }"
                >
                  <input
                    type="text"
                    :value="dateFormatted"
                    @focus="toggleDatePicker(true)"
                  >
                </template>
                <template
                  v-else-if="demo.options && demo.options.slot && demo.options.slot.type === 'button'"
                  v-slot="{ dateFormatted, toggleDatePicker, isOpen }"
                >
                  <button
                    type="button"
                    class="lm-btn"
                    style="margin: 0;"
                    :class="{ 'lm-btn-success': isOpen }"
                    @click="isOpen ? toggleDatePicker(false) : toggleDatePicker(true)"
                  >
                    {{ dateFormatted }}
                  </button>
                </template>
              </CtkDateTimePicker>
            </div>
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
        devMode: false,
        booleanOptions: [
          'noHeader', 'autoClose', 'error', 'dark', 'overlay', 'noWeekendDays', 'noShortcuts',
          'noButton', 'onlyDate', 'range', 'onlyTime', 'inline', 'persistent', 'disabled', 'noButtonNow',
          'noKeyboard', 'right', 'noClearButton', 'noLabel'
        ],
        stringOptions: [
          'id', 'label', 'hint', 'color', 'buttonColor', 'position', 'format', 'formatted', 'outputFormat',
          'minDate', 'maxDate', 'inputSize', 'buttonNowTranslation', 'disabledWeekly'
        ],
        optionsNotEditable: [
          'customShortcuts', 'disabledDates', 'disabledHours', 'locale'
        ],
        intOptions: [
          'minuteInterval', 'firstDayOfWeek'
        ],
        demoComponents: [
          {
            id: '1',
            title: 'Date Time Picker',
            description: 'Date & Time selector',
            initial: '2018-04-07 20:26',
            value: '2018-04-07 20:26',
            editOption: false,
            options: {
              format: 'YYYY-MM-DD HH:mm',
              id: 'DateTimePicker',
              minDate: '2018-04-05',
              maxDate: '2018-04-24'
            }
          },
          {
            id: '2',
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
              color: 'purple',
              label: 'Select date range',
              id: 'RangeDatePicker'
            }
          },
          {
            id: '3',
            title: 'Date Picker',
            description: 'Date selector - right position - noLabel true - With large input (input-size="lg") - format: "MM-DD-YYYY" - formatted: "ll"',
            editOption: false,
            initial: '14-01-2019',
            value: '14-01-2019',
            options: {
              onlyDate: true,
              color: 'coral',
              inputSize: 'lg',
              buttonColor: 'green',
              buttonNowTranslation: 'Maintenant',
              id: 'DatePicker',
              format: 'DD-MM-YYYY',
              formatted: 'll',
              right: true,
              noLabel: true
            }
          },
          {
            id: '4',
            title: 'Time Picker - With small input (input-size="sm") & minute-interval="10"',
            description: 'Time selector',
            editOption: false,
            initial: '11:26 am',
            value: '11:26 am',
            options: {
              format: 'hh:mm a',
              formatted: 'hh:mm a',
              onlyTime: true,
              color: 'firebrick',
              minuteInterval: '10',
              label: 'Select time',
              inputSize: 'sm',
              id: 'TimePicker',
              noLabel: true
            }
          },
          {
            id: '5',
            title: 'Inline Picker',
            description: 'Inline selector with keyboard accessibility disabled & disabled weekly dates (available for all pickers)',
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
              inline: true,
              format: 'YYYY-MM-DD',
              formatted: 'll',
              range: true,
              id: 'InlinePicker',
              disabledWeekly: [0, 4, 6],
              noKeyboard: true
            }
          },
          {
            id: '6',
            title: 'Disabled Picker',
            description: '(disabled="true")',
            editOption: false,
            initial: 'null',
            value: null,
            options: {
              disabled: true,
              label: 'Is Disabled',
              id: 'DisabledPicker'
            }
          },
          {
            id: '7',
            title: 'Min and Max date with time in 24h-format',
            description: 'minDate: 2019-03-03 20:10, maxDate: 2019-06-24 09:14',
            initial: '2019-03-04 20:26',
            value: '2019-03-04 20:26',
            editOption: false,
            options: {
              format: 'YYYY-MM-DD HH:mm',
              id: 'DateTimePicker',
              minDate: '2019-03-03 20:10',
              maxDate: '2019-06-24 09:14'
            }
          },
          {
            id: '8',
            title: 'Min and Max date with time in 12h-format',
            description: 'minDate: 2019-03-03 8:10 pm, maxDate: 2019-06-24 9:14 am',
            initial: '2019-03-03 8:10 pm',
            value: '2019-03-06 8:20 pm',
            editOption: false,
            options: {
              format: 'YYYY-MM-DD h:mm a',
              id: 'DateTimePicker',
              minDate: '2019-03-03 8:10 pm',
              maxDate: '2019-03-24 9:14 am'
            }
          },
          {
            id: '9',
            title: 'Enabled/Disabled dates Picker',
            description: '',
            editOption: false,
            initial: { disabledDates: ['2021-02-22'], enabledDates: ['2021-02-21', '2021-02-22', '2021-02-23'] },
            value: '2021-02-22',
            options: {
              id: 'EnabledDisabledDatesPicker',
              disabledDates: ['2021-02-22'],
              enabledDates: ['2021-02-21', '2021-02-22', '2021-02-23'],
              inline: true,
              format: 'YYYY-MM-DD HH:mm'
            }
          }
        ],
        value: '06-01-2014 05:00',
        value2: null,
        value3: '2018-04-05T14:26',
        rangeValues: {
          start: '2018-04-04',
          end: '2018-04-20'
        },
        rangeValues2: {
          start: null,
          end: null
        },
        timePickerValue: '11:26',
        minuteInterval: 5,
        minuteInterval2: 10,
        hint: 'Error message',
        errorHint: true,
        timeFormat: 'hh:mm a',
        minDate: '2018-04-03',
        maxDate: '2018-04-12',
        darkMode: false,
        shortcutsTranslation: {
          this_week: 'Cette semaine',
          last_30_days: '30 derniers jours',
          last_month: 'Mois précédent',
          last_year: 'L\'année dernière'
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
        ),
        customShortcuts: [
          { key: 'thisWeek', label: 'This week', value: 'isoWeek' },
          { key: 'lastWeek', label: 'Last week', value: '-isoWeek' },
          { key: 'last7Days', label: 'Last 7 days', value: 7 },
          { key: 'last30Days', label: 'Last 30 days', value: 30 },
          { key: 'thisMonth', label: 'This month', value: 'month' },
          { key: 'lastMonth', label: 'Last month', value: '-month' },
          { key: 'thisYear', label: 'This year', value: 'year' },
          { key: 'lastYear', label: 'Last year', value: '-year' }
        ]
      }
    }
  }
</script>

<style lang="scss">
  @import "./assets/scss/main.scss";
  html, body, #app, #vueCtkDateTimePicker {
    margin: 0;
    min-height: 100%;
    min-width: 100%;
    font-size: 14px;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    &.dark {
      background-color: darken(#424242, 20%);
      header {
        color: rgba(255, 255, 255, 0.70);
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
  h3 {
    margin-bottom: 10px;
  }
  hr {
    border-top: 1px solid #ebebeb;
    border-bottom: 0;
    margin: 20px 0;
  }
</style>
