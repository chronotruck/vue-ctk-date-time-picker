<template>
  <div
    :class="{'is-dark': dark}"
    :style="[{height: `${height}px`}]"
    class="shortcuts-container"
  >
    <button
      v-for="shortcut in shortcuts"
      :key="shortcut.value"
      :style="[shortcut.isSelected ? getSelectedStyle : getStyle]"
      :class="{ 'is-selected': shortcut.isSelected }"
      class="shortcut-button"
      tabindex="-1"
      type="button"
      @mouseover="shortcut.isHover = true"
      @mouseleave="shortcut.isHover = false"
      @click="select(shortcut)"
    >
      <span
        :style="[getEffectStyle]"
        class="datepicker-button-effect"
      />
      <span class="shortcut-button-content">
        {{ shortcut.label }}
      </span>
    </button>
  </div>
</template>
<script>
  import moment from 'moment-timezone'

  export default {
    name: 'RangeShortcuts',
    props: {
      value: { type: Object, required: false, default: null },
      color: { type: String, default: String },
      dark: { type: Boolean, default: false },
      dateTime: {type: Object, default: Object},
      customShortcuts: { type: Array, default: Array },
      shortcutsTranslations: {type: Object, default: Object},
      height: { type: Number, default: Number, required: true }
    },
    data () {
      return {
        types: ['day', '-day', 'isoWeek', '-isoWeek', 'month', '-month', 'year', '-year', 'week', '-week'],
        shortcuts: [
          { label: 'This week', value: 'isoWeek', isHover: false, isSelected: false },
          { label: 'Last week', value: '-isoWeek', isHover: false, isSelected: false },
          { label: 'Last 7 days', value: 7, isHover: false, isSelected: false },
          { label: 'Last 30 days', value: 30, isHover: false, isSelected: false },
          { label: 'This month', value: 'month', isHover: false, isSelected: false },
          { label: 'Last month', value: '-month', isHover: false, isSelected: false },
          { label: 'This year', value: 'year', isHover: false, isSelected: false },
          { label: 'Last year', value: '-year', isHover: false, isSelected: false }
        ],
        computedTypes: {}
      }
    },
    computed: {
      getStyle () {
        return {
          color: this.color
        }
      },
      getSelectedStyle () {
        return {
          backgroundColor: this.color,
          color: '#FFF'
        }
      },
      getEffectStyle () {
        return {
          backgroundColor: this.color
        }
      }
    },
    watch: {
      customShortcuts (newVal, oldVal) {
        if (newVal && Array.isArray(newVal) && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          this.init()
        }
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        this.overrideCustomShortCuts()
        this.preparePreCalculatedTypes()

        const selected = this.shortcuts.filter(shortcut => shortcut.isSelected)
        if (selected[0]) {
          this.select(selected[0])
        }
      },
      preparePreCalculatedTypes () {
        this.shortcuts.forEach(shortcut => {
          const { value } = shortcut

          switch (true) {
          case value === 'isoWeek': case value === 'week': case value === 'month': case value === 'year': case value === 'day':
            shortcut.start = moment().startOf(value)
            shortcut.end = moment().endOf(value)
            break
          case typeof value === 'number':
            shortcut.end = moment()
            shortcut.start = moment().subtract(value, 'd')
            break
          case value === '-month':
            shortcut.start = moment().subtract(1, 'months').startOf('month')
            shortcut.end = moment().subtract(1, 'months').endOf('month')
            break
          case value === '-year':
            shortcut.start = moment().subtract(1, 'years').startOf('year')
            shortcut.end = moment().subtract(1, 'years').endOf('year')
            break
          case value === '-week':
            shortcut.start = moment().subtract(1, 'weeks').startOf('week')
            shortcut.end = moment().subtract(1, 'weeks').endOf('week')
            break
          case value === '-isoWeek':
            shortcut.start = moment().subtract(1, 'weeks').startOf('isoWeek')
            shortcut.end = moment().subtract(1, 'weeks').endOf('isoWeek')
            break
          case value === '-day':
            shortcut.start = moment().subtract(1, 'days').startOf('day')
            shortcut.end = moment().subtract(1, 'days').endOf('day')
            break
          }
        })
      },
      overrideCustomShortCuts () {
        const customShortCuts = []
        this.customShortcuts.forEach(customShortcut => {
          if (this.isValidValue(customShortcut.value) && customShortcut.label) {
            customShortCuts.push({
              label: customShortcut.label,
              value: customShortcut.value,
              isHover: !!customShortcut.isHover,
              isSelected: !!customShortcut.isSelected
            })
          } else if (!customShortcut.label) {
            window.console.warn(`The label of '${customShortcut.value}' custom shortcut must be indicated`)
          } else {
            window.console.warn(`This '${customShortcut.value}' shortcut is not allowed. The value must be in this options : ${JSON.stringify(this.types)}`)
          }
        })
        if (customShortCuts.length) {
          this.shortcuts = customShortCuts
        }
      },
      unSelectAllShortcuts () {
        this.shortcuts.forEach(sc => {
          sc.isSelected = false
        })
      },
      selectShortcut (shortcut) {
        this.unSelectAllShortcuts()
        shortcut.isSelected = true
      },
      select (shortcut) {
        this.selectShortcut(shortcut)
        const { start, end, value } = shortcut
        this.$emit('change-range', { start, end, value })
      },
      isValidValue (value) {
        return value && (this.types.indexOf(value) > -1 || (typeof value === 'number' && value > 0))
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
      width: 100%;
      position: relative;
      margin-bottom: 10px;
      border: 1px solid #eaeaea;
      background-color: white;
      height: 30px;
      font-weight: 300;
      line-height: 26px;
      border-radius: 4px;
      font-size: 12px;
      outline: none;
      cursor: pointer;
      -webkit-transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      .datepicker-button-effect {
        position: absolute;
        background: dodgerblue;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        margin: auto;
        height: 30px;
        border-radius: 4px;
        width: 100%;
        -webkit-transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
        transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
        transform: scale(0);
        opacity: .6;
      }
      .shortcut-button-content {
        position: relative;
      }
      &:hover {
        color: #FFF !important;
        border-color: transparent;
        .datepicker-button-effect {
          transform: scale(1);
        }
      }
      &.is-selected {
        border-color: transparent;
        font-weight: bold;
        .datepicker-button-effect {
          opacity: 1;
          transform: scale(1);
        }
      }
    }
    &.is-dark {
      button.shortcut-button {
        background: #424242;
        border-color: lighten(#424242, 20%);
        .shortcut-button-content {
          color: #FFF;
        }
        &:hover, &.is-selected {
          border-color: transparent;
        }
      }
    }
  }

  @media screen and (max-width: 415px) {
    .shortcuts-container:not(.inline) {
      width: 100%;
      border-bottom: 1px solid #EAEAEA;
    }
    .shortcuts-container.is-dark {
      border-color: lighten(#424242, 20%);
    }
  }
</style>
