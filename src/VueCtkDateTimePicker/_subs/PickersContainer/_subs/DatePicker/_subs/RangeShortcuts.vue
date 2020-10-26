<template>
  <div
    :class="{'is-dark': dark}"
    :style="[{height: `${height}px`}]"
    class="shortcuts-container"
  >
    <CustomButton
      v-for="shortcut in customShortcuts"
      :key="shortcut.key"
      :dark="dark"
      :color="color"
      :selected="selectedShortcut === shortcut.key"
      with-border
      class="shortcut-button"
      @click="select(shortcut)"
    >
      <span class="lm-fs-12 flex-1">
        {{ shortcut.label }}
      </span>
    </CustomButton>
  </div>
</template>

<script>
  import moment from 'moment'
  import CustomButton from '@/VueCtkDateTimePicker/_subs/CustomButton'

  const SHORTCUT_TYPES = ['day', 'date', '-day', 'isoWeek', 'quarter', '-isoWeek', 'month', '-month', 'year', '-year', 'week', '-week']

  /**
   * Component used to show a list of the shortcuts currently available
   * and select one of them.
   * @module component - RangeShortcuts
   * @param {Array} customShortcuts
   */
  export default {
    name: 'RangeShortcuts',
    components: { CustomButton },
    props: {
      modelValue: { type: String, required: false, default: null },
      color: { type: String, default: null },
      dark: { type: Boolean, default: false },
      dateTime: { type: Object, default: null },
      customShortcuts: {
        type: Array,
        default: () => ([]),
        validator: val => val.every(shortcut => {
          const isValueInteger = Number.isInteger(shortcut.value)
          const isFunction = typeof shortcut.value === 'function'
          return shortcut.key && shortcut.label && (isValueInteger || isFunction ? true : SHORTCUT_TYPES.includes(shortcut.value))
        })
      },
      height: { type: Number, required: true }
    },
    emits: ['change-range'],
    data () {
      return {
        computedTypes: {},
        selectedShortcut: null
      }
    },
    watch: {
      customShortcuts () {
        this.init()
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.noticeDeprecation()

        /**
         * Find the pre-selected shortcut
         */
        if (this.modelValue) {
          const selectedShortcut = this.customShortcuts.find(shortcut => shortcut.key === this.modelValue)
          if (selectedShortcut) this.select(selectedShortcut)
        }
      },
      /**
       * Notify the developer that he's using a deprecated API for the shortcut.
       * @function noticeDeprecation
       */
      noticeDeprecation () {
        const useDeprecatedAPI = this.customShortcuts.find(shortcut => typeof shortcut.isSelected !== 'undefined' || typeof shortcut.key === 'undefined')
        if (useDeprecatedAPI) console.warn('[vue-ctk-date-time-picker]: You\'re using a deprecated API. Check the changelog (https://github.com/chronotruck/vue-ctk-date-time-picker/releases) for migration guide.')
      },
      /**
       * Returns the shortcut values according to the key
       * @function getShortcutByKey
       * @param {string} shortcutKey
       * @returns {Object}
       */
      getShortcutByKey (shortcutKey) {
        const shortcut = this.customShortcuts.find(sc => sc.key === shortcutKey)
        if (!shortcut) return false
        const { value } = shortcut

        /**
         * Case where the value is a specific number of days.
         */
        if (typeof value === 'number') {
          return {
            start: moment().subtract(value, 'd'),
            end: moment(),
            value
          }
        }

        /**
         * Case where the value is a function that is in charge of
         * handling the start & end values
         */
        if (typeof value === 'function') {
          const { start, end } = value()

          if (!start || !end) throw new Error('Missing "start" or "end" values.')
          if (!moment.isMoment(start) || !moment.isMoment(end)) throw new Error('The "start" or "end" values are not moment objects.')

          return {
            start,
            end
          }
        }

        switch (value) {
        case 'year': case 'month': case 'quarter': case 'week': case 'isoWeek': case 'day': case 'date':
          return {
            start: moment().startOf(value),
            end: moment().endOf(value),
            value
          }
        case '-month':
          return {
            start: moment().subtract(1, 'months').startOf('month'),
            end: moment().subtract(1, 'months').endOf('month'),
            value
          }
        case '-year':
          return {
            start: moment().subtract(1, 'years').startOf('year'),
            end: moment().subtract(1, 'years').endOf('year'),
            value
          }
        case '-week':
          return {
            start: moment().subtract(1, 'weeks').startOf('week'),
            end: moment().subtract(1, 'weeks').endOf('week'),
            value
          }
        case '-isoWeek':
          return {
            start: moment().subtract(1, 'weeks').startOf('isoWeek'),
            end: moment().subtract(1, 'weeks').endOf('isoWeek'),
            value
          }
        case '-day':
          return {
            start: moment().subtract(1, 'days').startOf('day'),
            end: moment().subtract(1, 'days').endOf('day'),
            value
          }
        }
      },
      select (shortcut) {
        this.selectedShortcut = shortcut.key
        const { start, end, value } = this.getShortcutByKey(this.selectedShortcut)
        this.$emit('change-range', { start, end, value })

        /**
         * Calls a callback function (if defined) on shortcut click
         */
        if (shortcut.callback) {
          if (typeof shortcut.callback !== 'function') throw new Error('The callback must be a function.')
          shortcut.callback({
            shortcut,
            start,
            end
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .shortcuts-container {
    width: 140px;
    max-width: 140px;
    min-width: 140px;
    padding: 10px 5px;
    border-right: 1px solid #EAEAEA;
    overflow: auto;
    button.shortcut-button {
      margin-bottom: 10px;
      width: 100%;
    }
    &.is-dark {
      border-color: lighten(#424242, 20%);
    }
  }

  @media screen and (max-width: 415px) {
    .shortcuts-container:not(.inline) {
      width: 100%;
      max-width: 100%;
      min-width: 100%;
      max-width: 100vw;
      min-width: 100vw;
      border-right: 0;
      border-bottom: 1px solid #EAEAEA;
      height: 52px !important;
      flex-direction: row;
      display: flex;
      white-space: nowrap;

      .shortcut-button {
        margin-bottom: 0;
      }

      .shortcut-button:not(:last-child) {
        margin-right: 10px;
      }
    }

    .shortcuts-container.is-dark {
      border-color: lighten(#424242, 20%);
    }
  }
</style>
