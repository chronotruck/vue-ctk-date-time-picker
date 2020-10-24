<template>
  <div
    ref="parent"
    :class="[{
      'is-focused': isFocus,
      'has-value': modelValue,
      'has-error': errorHint,
      'is-disabled': isDisabled,
      'is-dark': dark,
      'no-label': noLabel
    }, inputSize]"
    class="field flex align-center"
    @click="focusInput"
  >
    <input
      ref="CustomInput"
      v-bind="$attrs"
      :id="$attrs.id"
      :value="modelValue"
      :placeholder="label"
      :style="[borderStyle]"
      type="text"
      class="field-input"
      :class="{ 'no-clear-button': noClearButton }"
      readonly
      @focus="$emit('focus')"
      @blur="$emit('blur')"
      @click="$emit('click')"
    >
    <label
      v-if="!noLabel"
      ref="label"
      :for="$attrs.id"
      :class="errorHint ? 'text-danger' : null"
      :style="[colorStyle]"
      class="field-label"
      @click="focusInput"
    >
      {{ hint || label }}
    </label>
    <CustomButton
      v-if="hasClearButton"
      :color="dark ? '#757575' : 'rgba(0, 0, 0, 0.54)'"
      :dark="dark"
      class="field-clear-button"
      round
      @click="$emit('clear')"
    >
      <span class="fs-16">
        ✕
      </span>
    </CustomButton>
  </div>
</template>

<script>
  import CustomButton from './../CustomButton'

  export default {
    name: 'CustomInput',
    components: {
      CustomButton
    },
    inheritAttrs: false,
    props: {
      isFocus: { type: Boolean, default: false },
      modelValue: { type: [String, Object], required: false, default: null },
      label: { type: String, default: 'Select date & time' },
      noLabel: { type: Boolean, default: false },
      hint: { type: String, default: null },
      errorHint: { type: Boolean, default: null },
      color: { type: String, default: null },
      dark: { type: Boolean, default: false },
      inputSize: { type: String, default: null },
      noClearButton: { type: Boolean, default: false }
    },
    emits: [
      'focus',
      'blur',
      'click',
      'clear'
    ],
    computed: {
      borderStyle () {
        const cond = (this.isFocus && !this.errorHint)
        return cond
          ? { border: `1px solid ${this.color}` }
          : null
      },
      colorStyle () {
        const cond = this.isFocus
        return cond
          ? { color: `${this.color}` }
          : null
      },
      hasClearButton () {
        return !this.noClearButton && !this.isDisabled && this.modelValue
      },
      /**
       * Returns true if the field is disabled
       * @function isDisabled
       * @returns {boolean}
       */
      isDisabled () {
        return typeof this.$attrs.disabled !== 'undefined' && this.$attrs.disabled !== false
      }
    },
    methods: {
      focusInput () {
        this.$refs.CustomInput.focus()
        this.$emit('focus')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .field{
    position: relative;
    &.is-dark {
      .field-label{
        color: rgba(255, 255, 255, 0.70);
      }
      .field-input{
        background-color: #424242;
        border-color: rgba(255, 255, 255, 0.70);
        color: rgba(255, 255, 255, 0.70);
      }
      &.is-disabled {
        .field-label, .field-input {
          color: #000;
        }
      }
    }
    &-label{
      position: absolute;
      top: 5px;
      cursor: pointer;
      left: 13px;
      -webkit-transform: translateY(25%);
      transform: translateY(25%);
      opacity: 0;
      -webkit-transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      font-size: 11px;
      color: rgba(0, 0, 0, 0.54);
    }
    &-input{
      cursor: pointer;
      background-color: #FFF;
      -webkit-transition-duration: 0.3s;
      transition-duration: 0.3s;
      position: relative;
      width: 100%;
      height: 42px;
      min-height: 42px;
      padding-left: 12px;
      padding-right: 44px;
      font-weight: 400;
      -webkit-appearance: none;
      outline: none;
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      font-size: 14px;
      z-index: 0;
      &.no-clear-button {
        padding: 0 12px;
      }
    }
    &-clear-button {
      position: absolute;
      right: 12px;
      top: 0px;
      bottom: 0px;
      margin: auto 0;
    }
    &.has-error {
      .field-input {
        border-color: orangered;
      }
      .field-label{
        opacity: 1;
        -webkit-transform: translateY(0);
        transform: translateY(0);
        font-size: 11px;
      }
      .field-input {
        padding-top: 14px;
      }
    }
    &.has-value {
      .field-label {
        opacity: 1;
        -webkit-transform: translateY(0);
        transform: translateY(0);
        font-size: 11px;
      }
      &:not(.no-label) {
        .field-input {
          padding-top: 14px;
        }
      }
    }
    &.is-focused {
      .field-input {
        border-color: dodgerblue;
      }
      .field-label {
        color: dodgerblue;
      }
    }
    &.is-disabled {
      .field-input {
        border-color: #CCC;
        background: #F2F2F2;
      }
      .field-label, .field-input {
        cursor: default;
      }
    }
    .text-danger {
      color: orangered;
    }
    &.is-dark {
      ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
        color: rgba(255, 255, 255, 0.70);
      }
      :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color: rgba(255, 255, 255, 0.70);
        opacity:  1;
      }
      ::-moz-placeholder { /* Mozilla Firefox 19+ */
        color: rgba(255, 255, 255, 0.70);
        opacity:  1;
      }
      :-ms-input-placeholder { /* Internet Explorer 10-11 */
        color: rgba(255, 255, 255, 0.70);
      }
      ::-ms-input-placeholder { /* Microsoft Edge */
        color: rgba(255, 255, 255, 0.70);
      }
      ::placeholder { /* Most modern browsers support this now. */
        color: rgba(255, 255, 255, 0.70);
      }
      &.is-disabled {
        ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
          color: #424242;
        }
        :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
          color: #424242;
          opacity:  1;
        }
        ::-moz-placeholder { /* Mozilla Firefox 19+ */
          color: #424242;
          opacity:  1;
        }
        :-ms-input-placeholder { /* Internet Explorer 10-11 */
          color: #424242;
        }
        ::-ms-input-placeholder { /* Microsoft Edge */
          color: #424242;
        }
        ::placeholder { /* Most modern browsers support this now. */
          color: #424242;
        }
      }
    }
    &.sm {
      .field-input {
        height: 36px;
        min-height: 36px;
        font-size: 12px;
      }
      .field-label {
        font-size: 10px;
      }
      &.has-value:not(.no-label) {
        .field-input {
          padding-top: 12px;
        }
      }
    }
    &.lg {
      .field-input {
        height: 48px;
        min-height: 48px;
        font-size: 16px;
      }
      .field-label {
        font-size: 14px;
      }
      &.has-value:not(.no-label) {
        .field-input {
          padding-top: 16px;
        }
      }
    }
  }
</style>
