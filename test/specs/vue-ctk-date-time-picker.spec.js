import Vue from 'vue'
import Component from '../../src/VueCtkDateTimePicker'

describe('vue-ctk-date-time-picker.vue', () => {
  const Constructor = Vue.extend(Component)
  const propsData = {label: 'Kikoo les amis'}

  it('should instance the right component', () => {
    const vm = new Constructor({propsData})
    expect(vm.$options.name).to.equal('VueCtkDateTimePicker')
  })

  it('should render correct content', () => {
    const vm = new Constructor({propsData}).$mount()
    expect(vm.$refs.label.value).to.equal(propsData.text)
  })
})
