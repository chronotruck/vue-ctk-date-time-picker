import { shallowMount } from '@vue/test-utils'

import CustomInput from '@/VueCtkDateTimePicker/_subs/CustomInput'

describe('VueCtkDateTimePicker/CustomInput', () => {
  let wrapper

  beforeEach(() => (
    wrapper = shallowMount(CustomInput, {
      propsData: {}
    })
  ))

  it('should be defined', () => {
    const field = wrapper.find('.field')
    expect(field.exists()).toBeTruthy()
  })

  describe('input', () => {
    it('should be defined', () => {
      const input = wrapper.find('.field-input')
      expect(input.exists()).toBeTruthy()
      expect(input.is('input')).toBeTruthy()

      const { type, readonly, placeholder } = input.attributes()
      expect(type).toEqual('text')
      expect(readonly).toBeTruthy()
      expect(placeholder).toEqual('Select date & time')
    })

    it('should have the id from the attributes', () => {
      const wrapper = shallowMount(CustomInput, {
        propsData: {},
        attrs: {
          id: 'fieldId'
        }
      })

      const input = wrapper.find('.field-input')
      expect(input.attributes().id).toEqual('fieldId')
    })

    it('should have the disabled from the attributes', () => {
      const wrapper = shallowMount(CustomInput, {
        attrs: {
          disabled: true
        }
      })

      const input = wrapper.find('.field-input')
      expect(input.attributes().disabled).toBeDefined()
    })

    it('should have any attribute from the attributes', () => {
      const wrapper = shallowMount(CustomInput, {
        attrs: {
          name: 'hello-world',
          rest: 'attribute'
        }
      })

      const input = wrapper.find('.field-input')
      expect(input.attributes().name).toEqual('hello-world')
      expect(input.attributes().rest).toEqual('attribute')
    })
  })

  /**
   * TODO: Add label test cases
   */

  /**
   * TODO: Add clear button test cases
   */

  afterEach(() => {
    wrapper.destroy()
  })
})
