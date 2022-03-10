import { shallowMount } from '@vue/test-utils'
import CustomInput from '@/VueCtkDateTimePicker/_subs/CustomInput'

describe('CustomInput.vue', () => {
  it('renders label when passed (input & label)', async () => {
    const wrapper = shallowMount(CustomInput)
    expect(wrapper.find('label').text()).toMatch('Select date & time')
    expect(wrapper.find('input').attributes('placeholder')).toMatch('Select date & time')
    await wrapper.setProps({ label: 'the label' })
    expect(wrapper.find('label').text()).toMatch('the label')
    expect(wrapper.find('input').attributes('placeholder')).toMatch('the label')
  })
  it('renders hint instead label', async () => {
    const wrapper = shallowMount(CustomInput, {
      props: { label: 'the label' }
    })
    expect(wrapper.find('label').text()).toMatch('the label')
    await wrapper.setProps({ hint: 'the hint' })
    expect(wrapper.find('label').text()).toMatch('the hint')
  })
  it('has is-focused class when isFocus passed', async () => {
    const wrapper = shallowMount(CustomInput)
    expect(wrapper.classes('is-focused')).toBe(false)
    await wrapper.setProps({ isFocus: true })
    expect(wrapper.classes('is-focused')).toBe(true)
  })
  it('render value passed in props', async () => {
    const wrapper = shallowMount(CustomInput)
    expect(wrapper.find('input').element.value).toMatch('')
    await wrapper.setProps({ modelValue: 'The value' })
    expect(wrapper.find('input').element.value).toMatch('The value')
  })
  it('has has-value class when have class in props', async () => {
    const wrapper = shallowMount(CustomInput)
    expect(wrapper.classes('has-value')).toBe(false)
    await wrapper.setProps({ modelValue: 'value' })
    expect(wrapper.classes('has-value')).toBe(true)
  })
  it('has has-error class when have errorHint prop', async () => {
    const wrapper = shallowMount(CustomInput)
    expect(wrapper.classes('has-error')).toBe(false)
    await wrapper.setProps({ errorHint: true })
    expect(wrapper.classes('has-error')).toBe(true)
  })
  it('has is-dark class when have dark prop', async () => {
    const wrapper = shallowMount(CustomInput)
    expect(wrapper.classes('is-dark')).toBe(false)
    await wrapper.setProps({ dark: true })
    expect(wrapper.classes('is-dark')).toBe(true)
  })
  it('is disabled when has disabled prop', async () => {
    const wrapper = shallowMount(CustomInput)
    expect(wrapper.find('input').attributes('disabled')).toBe(undefined)
    await wrapper.setProps({ disabled: true })
    expect(wrapper.find('input').attributes('disabled')).toBe('')
  })
  it('has inputSize class', async () => {
    const wrapper = shallowMount(CustomInput, {
      props: { inputSize: 'sm' }
    })
    expect(wrapper.classes('sm')).toBe(true)
    await wrapper.setProps({ inputSize: 'lg' })
    expect(wrapper.classes('lg')).toBe(true)
  })
  it('check colorStyle computed data', async () => {
    const wrapper = shallowMount(CustomInput, {
      props: { color: 'purple' }
    })
    expect(wrapper.vm.colorStyle).toBe(null)
    await wrapper.setProps({ isFocus: true })
    expect(wrapper.vm.colorStyle.color).toContain('purple')
    expect(wrapper.vm.borderStyle.border).toContain('purple')
  })
})
