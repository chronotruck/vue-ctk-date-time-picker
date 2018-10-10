<template>
  <div
    class="datepicker-buttons-container flex justify-content-right">
    <button
      type="button"
      tabindex="-1"
      class="datepicker-button validation flex align-center justify-content-center"
      @click="$emit('validate')">
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
      <span class="datepicker-button-effect"/>
    </button>
  </div>
</template>

<script>
  export default {
    name: 'CtkButtonValidate'
  }
</script>

<style lang="scss" scoped>
  .datepicker-buttons-container {
    padding: 5px 10px;
    border-top: 1px solid #EAEAEA;
    .datepicker-button {
      cursor: pointer;
      height: 35px;
      width: 35px;
      border: none;
      outline: none;
      appearance: none;
      border-radius: 50%;
      padding: 0;
      position: relative;
      svg {
        position: relative;
        -webkit-transition: all 450s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
        transition: all 450s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
      }
      .datepicker-button-effect {
        position: absolute;
        opacity: 0.6;
        height: 30px;
        width: 30px;
        top: 2px;
        left: 2px;
        border-radius: 50%;
        -webkit-transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
        transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
        transform: scale(0);
      }
      &.validation {
        svg {
          fill: green;
          position: relative;
        }
        .datepicker-button-effect {
          background: green;
        }
        &:hover {
          .datepicker-button-effect {
            transform: scale(1);
            opacity: 0.6;
          }
          svg {
            fill: white !important;
          }
        }
      }
    }
  }
</style>
