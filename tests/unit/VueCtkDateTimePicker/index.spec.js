import { shallowMount } from '@vue/test-utils'

import VueCtkDateTimePicker from '../../../src/VDatetimePicker'
import CustomInput from '@/VDatetimePicker/_subs/CustomInput'
import PickersContainer from '@/VDatetimePicker/_subs/PickersContainer'

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

    describe('id attr', () => {
      it('should have the id prop from the attribute', () => {
        const wrapper = shallowMount(VueCtkDateTimePicker, {
          propsData: {
            inline: false
          },
          attrs: {
            id: 'myField'
          }
        })

        const input = wrapper.find(CustomInput)
        expect(input.attributes().id).toEqual('myField-input')
      })
    })

    describe('disabled attr', () => {
      it('should have the disabled prop from the attribute', () => {
        const wrapper = shallowMount(VueCtkDateTimePicker, {
          propsData: {
            inline: false
          },
          attrs: {
            disabled: true
          }
        })

        const input = wrapper.find(CustomInput)
        expect(input.attributes().disabled).toBeDefined()
      })
    })

    describe('name attr', () => {
      it('should have the name attr', () => {
        const wrapper = shallowMount(VueCtkDateTimePicker, {
          propsData: {
            inline: false
          },
          attrs: {
            name: 'myFieldName'
          }
        })

        const input = wrapper.find(CustomInput)
        expect(input.attributes().name).toEqual('myFieldName')
      })
    })
  })

  describe('picker container', () => {
    it('should be defined if the "disabled" attribute is not defined', () => {
      const wrapper = shallowMount(VueCtkDateTimePicker, {
        propsData: {
          inline: false
        },
        attrs: {
          disabled: false
        }
      })

      const container = wrapper.find(PickersContainer)
      expect(container.exists()).toBeTruthy()
    })

    it('should not be defined if the "disabled" attribute is defined', () => {
      const wrapper = shallowMount(VueCtkDateTimePicker, {
        propsData: {
          inline: false
        },
        attrs: {
          disabled: true
        }
      })

      const container = wrapper.find(PickersContainer)
      expect(container.exists()).toBeFalsy()
    })

    describe('id attribute', () => {
      it('should have the id attribute', () => {
        const wrapper = shallowMount(VueCtkDateTimePicker, {
          propsData: {
            inline: false
          },
          attrs: {
            id: 'myField'
          }
        })

        const container = wrapper.find(PickersContainer)
        expect(container.attributes().id).toEqual('myField-picker-container')
      })
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })
})
