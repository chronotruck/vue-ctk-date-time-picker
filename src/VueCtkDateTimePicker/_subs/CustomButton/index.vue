<template>
  <button
    class="custom-button flex align-center justify-content-center"
    :class="{
      'is-dark': dark,
      'with-border': withBorder,
      'is-hover': hover,
      'is-selected': selected,
      'round': round
    }"
    tabindex="-1"
    type="button"
    @click.stop="$emit('click')"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
    @mouseover="$emit('mouseover')"
    @mouseleave="$emit('mouseleave')"
  >
    <span
      :style="[bgStyle]"
      class="custom-button-effect"
    />
    <span
      class="custom-button-content flex align-center justify-content-center"
      :style="[colorStyle]"
    >
      <slot :style="[colorStyle]" />
    </span>
  </button>
</template>

<script>
  export default {
    name: 'CustomButton',
    props: {
      color: { type: String, default: 'dodgerblue' },
      dark: { type: Boolean, default: false },
      withBorder: { type: Boolean, default: false },
      hover: { type: Boolean, default: false },
      selected: { type: Boolean, default: false },
      round: { type: Boolean, default: false }
    },
    emits: [
      'click',
      'focus',
      'blur',
      'mouseover',
      'mouseleave'
    ],
    computed: {
      colorStyle () {
        const color = this.dark ? 'white' : this.color
        return {
          color: color,
          fill: color
        }
      },
      bgStyle () {
        return {
          backgroundColor: this.color
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .custom-button {
    padding: 0px 20px;
    position: relative;
    background-color: white;
    border: 1px solid transparent;
    border-radius: 4px;
    height: 30px;
    font-size: 13px;
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
      fill: dodgerblue;
    }
    .custom-button-effect {
      position: absolute;
      background: dodgerblue;
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
    &.with-border {
      border: 1px solid #eaeaea;
    }
    &:hover, &.is-hover {
      border: 1px solid transparent !important;
      .custom-button-effect {
        transform: scale(1);
        opacity: (.6);
      }
      svg {
        fill: white !important;
      }
      .custom-button-content {
        color: #fff !important;
      }
    }
    &.is-selected {
      border: 1px solid transparent !important;
      .custom-button-effect {
        transform: scale(1);
        opacity: (1);
      }
      svg {
        fill: white !important;
      }
      .custom-button-content {
        color: #fff !important;
      }
    }
    &.is-dark {
      background-color: #424242;
      &.with-border {
        border-color: lighten(#424242, 20%);
      }
      svg {
        fill: white !important;
      }
    }
    &.round {
      padding: 0;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      .custom-button-effect {
        border-radius: 50%;
        height: 24px;
      }
    }
  }
</style>
