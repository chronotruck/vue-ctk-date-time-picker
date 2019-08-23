import { shallowMount } from '@vue/test-utils'

import VueCtkDateTimePicker from '@/VueCtkDateTimePicker'
import CustomInput from '@/VueCtkDateTimePicker/_subs/CustomInput'

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

  afterEach(() => {
    wrapper.destroy()
  })
})
