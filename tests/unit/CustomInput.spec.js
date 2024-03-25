import { shallowMount } from '@vue/test-utils'
import CustomInput from '@/VDatetimePicker/_subs/CustomInput'

describe('CustomInput.vue', () => {
  it('renders label when passed (input & label)', () => {
    const wrapper = shallowMount(CustomInput)
    expect(wrapper.find('label').text()).toMatch('Select date & time')
    expect(wrapper.find('input').attributes('placeholder')).toMatch('Select date & time')
    wrapper.setProps({ label: 'the label' })
    expect(wrapper.find('label').text()).toMatch('the label')
    expect(wrapper.find('input').attributes('placeholder')).toMatch('the label')
  })
  it('renders hint instead label', () => {
    const wrapper = shallowMount(CustomInput, {
      propsData: { label: 'the label' }
    })
    expect(wrapper.find('label').text()).toMatch('the label')
    wrapper.setProps({ hint: 'the hint' })
    expect(wrapper.find('label').text()).toMatch('the hint')
  })
  it('has is-focused class when isFocus passed', () => {
    const wrapper = shallowMount(CustomInput)
    expect(wrapper.classes('is-focused')).toBe(false)
    wrapper.setProps({ isFocus: true })
    expect(wrapper.classes('is-focused')).toBe(true)
  })
  it('render value passed in props', () => {
    const wrapper = shallowMount(CustomInput)
    expect(wrapper.find('input').element.value).toMatch('')
    wrapper.setProps({ value: 'The value' })
    expect(wrapper.find('input').element.value).toMatch('The value')
  })
  it('has has-value class when have class in props', () => {
    const wrapper = shallowMount(CustomInput)
    expect(wrapper.classes('has-value')).toBe(false)
    wrapper.setProps({ value: 'value' })
    expect(wrapper.classes('has-value')).toBe(true)
  })
  it('has has-error class when have errorHint prop', () => {
    const wrapper = shallowMount(CustomInput)
    expect(wrapper.classes('has-error')).toBe(false)
    wrapper.setProps({ errorHint: true })
    expect(wrapper.classes('has-error')).toBe(true)
  })
  it('has is-dark class when have dark prop', () => {
    const wrapper = shallowMount(CustomInput)
    expect(wrapper.classes('is-dark')).toBe(false)
    wrapper.setProps({ dark: true })
    expect(wrapper.classes('is-dark')).toBe(true)
  })
  it('is disabled when has disabled prop', () => {
    const wrapper = shallowMount(CustomInput)
    expect(wrapper.find('input').attributes('disabled')).toBe(undefined)
    wrapper.setProps({ disabled: true })
    expect(wrapper.find('input').attributes('disabled')).toBe('disabled')
  })
  it('has inputSize class', () => {
    const wrapper = shallowMount(CustomInput, {
      propsData: { inputSize: 'sm' }
    })
    expect(wrapper.classes('sm')).toBe(true)
    wrapper.setProps({ inputSize: 'lg' })
    expect(wrapper.classes('lg')).toBe(true)
  })
  it('check colorStyle computed data', () => {
    const wrapper = shallowMount(CustomInput, {
      propsData: { color: 'purple' }
    })
    expect(wrapper.vm.colorStyle).toBe(null)
    wrapper.setProps({ isFocus: true })
    expect(wrapper.vm.colorStyle.color).toContain('purple')
    expect(wrapper.vm.borderStyle.border).toContain('purple')
  })
})
