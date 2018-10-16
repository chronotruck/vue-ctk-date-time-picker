<template>
  <div
    :class="{'is-dark': dark}"
    class="shortcuts-container"
  >
    <button
      v-for="shortcut in shortcuts"
      :style="[shortcut.isSelected ? getSelectedStyle : getStyle]"
      :key="shortcut.value"
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
  import moment from 'moment'
  import shortcutsTranslations from './_subs/shortcutsTranslations'

  export default {
    name: 'CtkCalendarShortcur',
    props: {
      color: { type: String, default: String },
      locale: { type: String, default: String },
      dark: { type: Boolean, default: false },
      dateTime: {type: Object, default: Object},
      shortcutsTranslations: {type: Object, default: Object}
    },
    data () {
      return {
        shortcuts: [
          { key: 'this_week', value: 'isoWeek', isHover: false, isSelected: false },
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
        let dates = { start: null, end: null }
        this.unSelectAllShortcuts()
        shortcut.isSelected = true

        switch (value) {
        case 'isoWeek': case 'month': case 'year':
          dates.start = moment().locale(this.locale).startOf(value)
          dates.end = moment().locale(this.locale).endOf(value)
          break
        case 7: case 30:
          dates.end = moment().locale(this.locale)
          dates.start = moment().locale(this.locale).subtract(value, 'd')
          break
        case '-month':
          dates.start = moment().locale(this.locale).subtract(1, 'months').startOf('month')
          dates.end = moment().locale(this.locale).subtract(1, 'months').endOf('month')
          break
        case '-year':
          dates.start = moment().locale(this.locale).subtract(1, 'years').startOf('year')
          dates.end = moment().locale(this.locale).subtract(1, 'years').endOf('year')
          break
        }

        this.$emit('change-range', dates)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .shortcuts-container {
    width: 160px;
    padding: 10px 5px;
    button.shortcut-button {
      width: 100%;
      position: relative;
      margin-bottom: 10px;
      border: 1px solid #eaeaea;
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
        background: #00C853;
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

  @media screen and (max-width: 412px) {
    .shortcuts-container:not(.inline) {
      width: 100%;
      border-bottom: 1px solid #EAEAEA;
      height: 120px !important;
      overflow: auto;
    }
  }
</style>
