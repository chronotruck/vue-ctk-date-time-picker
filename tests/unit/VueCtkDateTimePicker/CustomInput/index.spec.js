import { shallowMount } from '@vue/test-utils'

import CustomInput from '@/VDatetimePicker/_subs/CustomInput'
import CustomButton from '@/VDatetimePicker/_subs/CustomButton'

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
  describe('clear button', () => {
    it('should be defined if the "noClearButton" prop is not defined, the input is not disabled and there is a value', () => {
      const wrapper = shallowMount(CustomInput, {
        propsData: {
          value: '2020-06-20 12:00:00',
          noClearButton: false
        },
        attrs: {
          disabled: false
        }
      })

      const button = wrapper.find(CustomButton)
      expect(button.exists()).toBeTruthy()
      expect(button.is(CustomButton)).toBeTruthy()
    })

    it('should undefined if the "noClearButton" prop is defined or the input is disabled or there is no value', () => {
      let wrapper = shallowMount(CustomInput, {
        propsData: {
          value: '2020-06-20 12:00:00',
          noClearButton: true
        },
        attrs: {
          disabled: false
        }
      })

      let button = wrapper.find('.field-clear-button')
      expect(button.exists()).toBeFalsy()

      wrapper = shallowMount(CustomInput, {
        propsData: {
          value: null,
          noClearButton: false
        },
        attrs: {
          disabled: false
        }
      })

      button = wrapper.find('.field-clear-button')
      expect(button.exists()).toBeFalsy()

      wrapper = shallowMount(CustomInput, {
        propsData: {
          value: '2020-06-20 12:00:00',
          noClearButton: false
        },
        attrs: {
          disabled: true
        }
      })

      button = wrapper.find('.field-clear-button')
      expect(button.exists()).toBeFalsy()
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })
})
