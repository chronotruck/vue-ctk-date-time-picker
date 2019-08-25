<template>
  <div
    :class="{'is-dark': dark}"
    :style="[{height: `${height}px`}]"
    class="shortcuts-container"
  >
    <CustomButton
      v-for="shortcut in shortcuts"
      :key="shortcut.value"
      :dark="dark"
      :color="color"
      :selected="shortcut.isSelected"
      with-border
      class="shortcut-button"
      @mouseover="shortcut.isHover = true"
      @mouseleave="shortcut.isHover = false"
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

  export default {
    name: 'RangeShortcuts',
    components: { CustomButton },
    props: {
      value: { type: Object, required: false, default: null },
      color: { type: String, default: null },
      dark: { type: Boolean, default: false },
      dateTime: { type: Object, default: null },
      customShortcuts: { type: Array, default: () => ([]) },
      height: { type: Number, required: true }
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
      border-right: 0;
      border-bottom: 1px solid #EAEAEA;
    }
    .shortcuts-container.is-dark {
      border-color: lighten(#424242, 20%);
    }
  }
</style>
