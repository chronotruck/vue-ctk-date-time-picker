import { shallowMount } from '@vue/test-utils'

import VueCtkDateTimePicker from '@/VueCtkDateTimePicker'
import CustomInput from '@/VueCtkDateTimePicker/_subs/CustomInput'
import PickersContainer from '@/VueCtkDateTimePicker/_subs/PickersContainer'

describe('VueCtkDateTimePicker', () => {
  let wrapper

  beforeEach(() => (
    wrapper = shallowMount(VueCtkDateTimePicker, {
      propsData: {}
    })
  ))

  describe('input', () => {
    it('should be defined if the "inline" prop is not specified and there isnt a default slot', () => {
      const wrapper = shallowMount(VueCtkDateTimePicker, {
        propsData: {
          inline: false
        }
      })

      const input = wrapper.find(CustomInput)
      expect(input.exists()).toBeTruthy()
    })

    it('should not be defined if the "inline" prop is specified and there is a slot value', () => {
      const wrapper = shallowMount(VueCtkDateTimePicker, {
        propsData: {
          inline: true
        },
        slots: {
          default: '<span>Something</span>'
        }
      })

      const input = wrapper.find(CustomInput)
      expect(input.exists()).toBeFalsy()
    })
  })

  describe('picker container', () => {
    it('should be defined if the "disabled" prop is not defined', () => {
      wrapper.setProps({
        disabled: false
      })

      const container = wrapper.find(PickersContainer)
      expect(container.exists()).toBeTruthy()
    })

    it('should not be defined if the "disabled" prop is defined', () => {
      wrapper.setProps({
        disabled: true
      })

      const container = wrapper.find(PickersContainer)
      expect(container.exists()).toBeFalsy()
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })
})
