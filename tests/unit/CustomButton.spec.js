import { shallowMount } from '@vue/test-utils'
import CustomButton from '@/VDatetimePicker/_subs/CustomButton'

describe('CustomButton.vue', () => {
  it('check colorStyle computed data', () => {
    const wrapper = shallowMount(CustomButton, {
      propsData: { color: 'purple' }
    })
    expect(wrapper.vm.colorStyle.color).toContain('purple')
    expect(wrapper.vm.colorStyle.fill).toContain('purple')
    expect(wrapper.vm.bgStyle.backgroundColor).toContain('purple')
  })
  it('has is-dark class when have dark prop', () => {
    const wrapper = shallowMount(CustomButton)
    expect(wrapper.classes('is-dark')).toBe(false)
    wrapper.setProps({ dark: true })
    expect(wrapper.classes('is-dark')).toBe(true)
  })
  it('has with-border class when have dark prop', () => {
    const wrapper = shallowMount(CustomButton)
    expect(wrapper.classes('with-border')).toBe(false)
    wrapper.setProps({ withBorder: true })
    expect(wrapper.classes('with-border')).toBe(true)
  })
  it('has is-hover class when have dark prop', () => {
    const wrapper = shallowMount(CustomButton)
    expect(wrapper.classes('is-hover')).toBe(false)
    wrapper.setProps({ hover: true })
    expect(wrapper.classes('is-hover')).toBe(true)
  })
  it('has is-selected class when have dark prop', () => {
    const wrapper = shallowMount(CustomButton)
    expect(wrapper.classes('is-selected')).toBe(false)
    wrapper.setProps({ selected: true })
    expect(wrapper.classes('is-selected')).toBe(true)
  })
  it('has round class when have round prop', () => {
    const wrapper = shallowMount(CustomButton)
    expect(wrapper.classes('round')).toBe(false)
    wrapper.setProps({ round: true })
    expect(wrapper.classes('round')).toBe(true)
  })
})
