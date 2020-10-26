<template>
  <div class="checkbox-container">
    <input
      :id="id"
      type="checkbox"
      name="open"
      :checked="modelValue"
      style="display:none"
      :class="{ 'checked': modelValue }"
      :disabled="disabled"
      class="checkbox-input"
      @change="$emit('update:model-value', $event.target.checked)"
    >
    <label
      :for="id"
      class="toggle"
    >
      <span />
    </label>
  </div>
</template>

<script>
  export default {
    name: 'CheckboxInput',
    props: {
      modelValue: {
        type: Boolean,
        default: false,
        required: true
      },
      id: {
        type: String,
        default: '',
        required: true
      },
      disabled: {
        type: Boolean,
        default: false,
        required: true
      }
    },
    emits: ['update:model-value']
  }
</script>

<style lang="scss" scoped>
  $primary: #96bf31;
  $primary-light: #c5e475;
  $gray: #9A9999;

  .toggle {
    position: relative;
    display: block;
    width: 40px;
    height: 20px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transform: translate3d(0,0,0);
    &:before {
      content: "";
      position: relative;
      top: 3px;
      left: 3px;
      width: 34px;
      height: 14px;
      display: block;
      background: $gray;
      border-radius: 8px;
      transition: all .2s ease;
    }
    span {
      position: absolute;
      top: -1px;
      left: 0;
      width: 20px;
      height: 20px;
      display: block;
      background: white;
      border-radius: 10px;
      box-shadow: 0 3px 8px rgba($gray,.5);
      transition: all .2s ease;
      &:before {
        content: "";
        position: absolute;
        display: block;
        margin: -18px;
        width: 56px;
        height: 56px;
        background: rgba($primary,.5);
        border-radius: 50%;
        transform: scale(0);
        opacity: 1;
        pointer-events: none;
      }
    }
  }
.checkbox-input.checked + .toggle {
  &:before {
    background: $primary-light;
  }
  span {
    background: $primary;
    transform: translateX(20px);
    transition: all .2s cubic-bezier(.8,.4,.3,1.25), background .15s ease;
    box-shadow: 0 3px 8px rgba($primary,.2);
    &:before {
      transform: scale(1);
      opacity: 0;
      transition: all .4s ease;
    }
  }
}
</style>
