<template>
  <div
    :class="{'is-dark': dark}"
    class="shortcuts-container"
  >
    <button
      v-for="shortcut in shortcuts"
      :key="shortcut.value"
      :style="[shortcut.isSelected ? getSelectedStyle : getStyle]"
      :class="{ 'is-selected': shortcut.isSelected }"
      class="shortcut-button"
      tabindex="-1"
      @mouseover="shortcut.isHover = true"
      @mouseleave="shortcut.isHover = false"
      @click="select(shortcut)"
    >
      <span
        :style="[getEffectStyle]"
        class="datepicker-button-effect"
      />
      <span class="shortcut-button-content">
        {{ getTranslation(shortcut.key) }}
      </span>
    </button>
  </div>
</template>
<script>
  import moment from 'moment-timezone'
  import shortcutsTranslations from './_subs/shortcutsTranslations'

  export default {
    name: 'CtkCalendarShortcur',
    props: {
      color: { type: String, default: String },
      dark: { type: Boolean, default: false },
      shortcutsTranslations: {type: Object, default: Object}
    },
    data () {
      return {
        shortcuts: [
          { key: 'this_week', value: 'week', isHover: false, isSelected: false },
          { key: 'last_7_days', value: 7, isHover: false, isSelected: false },
          { key: 'last_30_days', value: 30, isHover: false, isSelected: false },
          { key: 'this_month', value: 'month', isHover: false, isSelected: false },
          { key: 'last_month', value: '-month', isHover: false, isSelected: false },
          { key: 'this_year', value: 'year', isHover: false, isSelected: false },
          { key: 'last_year', value: '-year', isHover: false, isSelected: false }
        ]
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
    methods: {
      getTranslation (key) {
        return this.shortcutsTranslations[key] || shortcutsTranslations[key]
      },
      unSelectAllShortcuts () {
        this.shortcuts.forEach(sc => {
          sc.isSelected = false
        })
      },
      select (shortcut) {
        const { value } = shortcut
        const dates = { start: null, end: null }
        this.unSelectAllShortcuts()
        shortcut.isSelected = true
        switch (value) {
        case 'week': case 'month': case 'year':
          dates.start = moment().startOf(value)
          dates.end = moment().endOf(value)
          break
        case 7: case 30:
          dates.end = moment().subtract(1, 'd')
          dates.start = moment().subtract(value, 'd')
          break
        case '-month':
          dates.start = moment().subtract(1, 'months').startOf('month')
          dates.end = moment().subtract(1, 'months').endOf('month')
          break
        case '-year':
          dates.start = moment().subtract(1, 'years').startOf('year')
          dates.end = moment().subtract(1, 'years').endOf('year')
          break
        }
        dates.start = dates.start.format('YYYY-MM-DD')
        dates.end = dates.end.format('YYYY-MM-DD')
        this.$emit('change-range', dates)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .shortcuts-container {
    width: 160px;
    padding: 10px 5px;
    border-right: 1px solid #EAEAEA;
    button.shortcut-button {
      width: 100%;
      position: relative;
      margin-bottom: 10px;
      border: 1px solid #eaeaea;
      background-color: white;
      height: 30px;
      font-weight: 300;
      line-height: 26px;
      border-radius: 30px;
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
        border-radius: 30px;
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
      height: unset !important;
      overflow: auto;
    }
    .shortcuts-container.is-dark {
      border-color: lighten(#424242, 20%);
    }
  }
</style>
