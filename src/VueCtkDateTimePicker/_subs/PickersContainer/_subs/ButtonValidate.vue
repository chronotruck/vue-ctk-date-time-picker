<template>
  <div
    :class="[{'is-dark': dark}]"
    class="datepicker-buttons-container flex justify-content-right"
  >
    <button
      v-if="hasButtonNow"
      class="datepicker-button now flex align-center justify-content-center"
      :class="{'right-margin': hasButtonValidate}"
      tabindex="-1"
      type="button"
      @click="emitNow()"
    >
      <span
        :style="[bgStyle]"
        class="datepicker-button-effect"
      />
      <span
        class="datepicker-button-content"
        :style="[colorStyle]"
      >
        {{ buttonNowTranslation || 'Now' }}
      </span>
    </button>
    <button
      v-if="hasButtonValidate"
      type="button"
      tabindex="-1"
      class="datepicker-button validate flex align-center justify-content-center"
      @click.stop="$emit('validate')"
    >
      <span
        class="datepicker-button-effect"
        :style="[bgStyle]"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        :style="[colorStyle]"
      >
        <path
          d="M0 0h24v24H0z"
          fill="none"
        />
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
      </svg>
    </button>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'ButtonValidate',
    props: {
      /**
       * TODO: Remove wrong default values
       */
      dark: { type: Boolean, default: null },
      buttonColor: { type: String, default: null },
      buttonNowTranslation: { type: String, default: null },
      onlyTime: { type: Boolean, default: null },
      noButtonNow: { type: Boolean, default: null },
      range: { type: Boolean, default: null },
      hasButtonValidate: { type: Boolean, default: null }
    },
    emits: ['validate', 'now'],
    computed: {
      colorStyle () {
        return {
          color: this.buttonColor,
          fill: this.buttonColor
        }
      },
      bgStyle () {
        return {
          backgroundColor: this.buttonColor
        }
      },
      hasButtonNow () {
        return !this.onlyTime && !this.noButtonNow && !this.range
      }
    },
    methods: {
      emitNow () {
        this.$emit('now', moment().format('YYYY-MM-DD HH:mm'))
      }
    }
  }
</script>

<style lang="scss" scoped>
  .datepicker-buttons-container {
    padding: 5px;
    border-top: 1px solid #EAEAEA;
    background-color: #FFF;
    z-index: 1;
    display: flex !important;
    .datepicker-button {
      padding: 0px 20px;
      position: relative;
      background-color: white;
      border: 1px solid transparent;
      border-radius: 4px;
      height: 30px;
      font-size: 14px;
      outline: none;
      cursor: pointer;
      -webkit-transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      color: #FFF;
      font-weight: 500;
      &-content {
        position: relative;
      }
      svg {
        position: relative;
        -webkit-transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
        transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
        fill: #00C853;
      }
      .datepicker-button-effect {
        position: absolute;
        background: #00C853;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        height: 30px;
        border-radius: 4px;
        width: 100%;
        -webkit-transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
        transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
        transform: scale(0);
      }
      &:hover {
        border: 1px solid transparent;
        .datepicker-button-effect {
          transform: scale(1);
        }
        svg {
          fill: white !important;
        }
        .datepicker-button-content {
          color: #fff !important;
        }
      }
      &.now {
        &.right-margin {
          margin-right: 10px;
        }
        .datepicker-button-content {
          color: dodgerblue;
        }
        .datepicker-button-effect {
          background: dodgerblue;
        }
      }
      &.validate {
        border: 1px solid #eaeaea;
      }
    }
    &.is-dark, &.is-dark .datepicker-button {
      background-color: #424242;
      &:not(.now) {
        border-color: lighten(#424242, 20%);
      }
      svg {
        fill: white !important;
      }
    }
  }
</style>
