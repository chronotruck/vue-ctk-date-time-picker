<template>
  <button
    type="button"
    tabindex="-1"
    class="arrow-button"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <svg viewBox="0 0 1000 1000">
      <path :d="arrowPath" />
    </svg>
  </button>
</template>

<script>
const TYPES = {
  prev: 'prev',
  next: 'next'
}

const SVG_PATHS = {
  [TYPES.prev]: 'M336.2 274.5l-210.1 210h805.4c13 0 23 10 23 23s-10 23-23 23H126.1l210.1 210.1c11 11 11 21 0 32-5 5-10 7-16 7s-11-2-16-7l-249.1-249c-11-11-11-21 0-32l249.1-249.1c21-21.1 53 10.9 32 32z',
  [TYPES.next]: 'M694.4 242.4l249.1 249.1c11 11 11 21 0 32L694.4 772.7c-5 5-10 7-16 7s-11-2-16-7c-11-11-11-21 0-32l210.1-210.1H67.1c-13 0-23-10-23-23s10-23 23-23h805.4L662.4 274.5c-21-21.1 11-53.1 32-32.1z'
}

const DEFAULT_TYPE = TYPES.prev

export default {
  name: 'VBArrowButton',

  inheritAttrs: false,

  props: {
    type: {
      type: String,
      default: 'next',
      validator: (value) => {
        return Object.keys(TYPES).includes(value)
      }
    }
  },

  computed: {
    arrowPath () {
      return SVG_PATHS[this.type] || SVG_PATHS[DEFAULT_TYPE]
    }
  }
}
</script>

<style lang="scss" scoped>
.arrow-button {
  border: none;
  background: initial;
  padding: 0;
  cursor: pointer;
  width: 17px;
  height: 17px;
}
</style>
