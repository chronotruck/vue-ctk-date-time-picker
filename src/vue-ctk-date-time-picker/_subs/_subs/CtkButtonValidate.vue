<template>
  <div
    :class="{'is-dark': dark}"
    class="datepicker-buttons-container flex justify-content-right">
    <button
      type="button"
      tabindex="-1"
      class="datepicker-button flex align-center justify-content-center"
      @click="$emit('validate')">
      <span class="datepicker-button-effect"/>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24">
        <path
          d="M0 0h24v24H0z"
          fill="none"/>
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
      </svg>
    </button>
  </div>
</template>

<script>
  export default {
    name: 'CtkButtonValidate',
    props: {
      dark: { type: Boolean, default: false }
    }
  }
</script>

<style lang="scss" scoped>
  .datepicker-buttons-container {
    padding: 5px 10px;
    border-top: 1px solid #EAEAEA;
    background-color: #FFF;
    .datepicker-button {
      padding: 0px 20px;
      position: relative;
      border: 1px solid #eaeaea;
      border-radius: 30px;
      height: 30px;
      font-size: 14px;
      outline: none;
      cursor: pointer;
      -webkit-transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
      color: #FFF;
      font-weight: 500;
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
        border-radius: 30px;
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
      }
    }
    &.is-dark, &.is-dark .datepicker-button {
      background-color: #424242;
      border-color: lighten(#424242, 20%);
      svg {
        fill: white !important;
      }
    }
  }
</style>
