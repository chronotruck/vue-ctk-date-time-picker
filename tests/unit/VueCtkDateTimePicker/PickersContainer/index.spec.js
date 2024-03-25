import { shallowMount } from '@vue/test-utils'

import PickersContainer from '@/VDatetimePicker/_subs/PickersContainer'
import HeaderPicker from '@/VDatetimePicker/_subs/PickersContainer/_subs/HeaderPicker'
import ButtonValidate from '@/VDatetimePicker/_subs/PickersContainer/_subs/ButtonValidate'

describe('VueCtkDateTimePicker/PickersContainer', () => {
  let wrapper

  beforeEach(() => (
    wrapper = shallowMount(PickersContainer, {
      propsData: {
        visible: true
      }
    })
  ))

  it('should be defined', () => {
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.classes()).toContain('visible')
  })

  it('should have the "inline" class if the inline prop is defined', () => {
    let wrapper = shallowMount(PickersContainer, {
      propsData: {
        visible: true,
        inline: true
      }
    })
    expect(wrapper.classes()).toContain('inline')
    wrapper.destroy()

    wrapper = shallowMount(PickersContainer, {
      propsData: {
        visible: true,
        inline: false
      }
    })
    expect(wrapper.classes()).not.toContain('inline')
    wrapper.destroy()
  })

  it('should have the "is-dark" class if the dark prop is defined', () => {
    let wrapper = shallowMount(PickersContainer, {
      propsData: {
        visible: true,
        dark: true
      }
    })
    expect(wrapper.classes()).toContain('is-dark')
    wrapper.destroy()

    wrapper = shallowMount(PickersContainer, {
      propsData: {
        visible: true,
        dark: false
      }
    })
    expect(wrapper.classes()).not.toContain('is-dark')
    wrapper.destroy()
  })

  describe('datepicker', () => {
    /**
     * TODO: Add test suite for the .datepicker div thing.
     * Check if it's necessary to nest the the header + date/time pickers inside
     * another div.
     */

    describe('header', () => {
      it('should be defined if the "no-header" prop is not defined', () => {
        const wrapper = shallowMount(PickersContainer, {
          propsData: {
            visible: true,
            noHeader: false
          }
        })

        const header = wrapper.find(HeaderPicker)
        expect(header.exists()).toBeTruthy()
      })

      it('should not be defined if the "no-header" prop is defined', () => {
        const wrapper = shallowMount(PickersContainer, {
          propsData: {
            visible: true,
            noHeader: true
          }
        })

        const header = wrapper.find(HeaderPicker)
        expect(header.exists()).toBeFalsy()
      })

      /**
       * TODO: Add tests to ensure the props are passed to the header correctly
       */
    })

    /**
     * TODO: Calling the component "footer" because it looks more like a footer
     * than a validation button.
     */
    describe('footer', () => {
      it('shoud be defined if the "has-no-button" prop is not defined and not inline or range mode', () => {
        let wrapper = shallowMount(PickersContainer, {
          propsData: {
            visible: true,
            hasNoButton: false
          }
        })

        let footer = wrapper.find(ButtonValidate)
        expect(footer.exists()).toBeTruthy()
        wrapper.destroy()

        wrapper = shallowMount(PickersContainer, {
          propsData: {
            visible: true,
            hasNoButton: false,
            inline: true
          }
        })

        footer = wrapper.find(ButtonValidate)
        expect(footer.exists()).toBeTruthy()
        wrapper.destroy()

        wrapper = shallowMount(PickersContainer, {
          propsData: {
            visible: true,
            hasNoButton: false,
            inline: false,
            range: true
          }
        })

        footer = wrapper.find(ButtonValidate)
        expect(footer.exists()).toBeTruthy()
        wrapper.destroy()
      })

      it('should not be defined if the "has-no-button" prop is defined, or it\'s inline or range mode', () => {
        const wrapper = shallowMount(PickersContainer, {
          propsData: {
            visible: true,
            hasNoButton: true
          }
        })

        const footer = wrapper.find(ButtonValidate)
        expect(footer.exists()).toBeFalsy()
      })

      /**
       * TODO: Add tests to ensure the props are passed to the footer correctly
       */
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })
})
