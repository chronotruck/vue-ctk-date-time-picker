import { shallowMount } from '@vue/test-utils'

import PickersContainer from '@/VueCtkDateTimePicker/_subs/PickersContainer'
import HeaderPicker from '@/VueCtkDateTimePicker/_subs/PickersContainer/_subs/HeaderPicker'
import ButtonValidate from '@/VueCtkDateTimePicker/_subs/PickersContainer/_subs/ButtonValidate'

describe('VueCtkDateTimePicker/PickersContainer', () => {
  let wrapper

  beforeEach(() => (
    wrapper = shallowMount(PickersContainer, {
      props: {
        visible: true
      }
    })
  ))

  it('should be defined', () => {
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.find('.datetimepicker').classes()).toContain('visible')
  })

  it('should have the "inline" class if the inline prop is defined', () => {
    let wrapper = shallowMount(PickersContainer, {
      props: {
        visible: true,
        inline: true
      }
    })
    expect(wrapper.find('.datetimepicker').classes()).toContain('inline')
    wrapper.unmount()

    wrapper = shallowMount(PickersContainer, {
      props: {
        visible: true,
        inline: false
      }
    })
    expect(wrapper.classes()).not.toContain('inline')
    wrapper.unmount()
  })

  it('should have the "is-dark" class if the dark prop is defined', () => {
    let wrapper = shallowMount(PickersContainer, {
      props: {
        visible: true,
        dark: true
      }
    })
    expect(wrapper.find('.datetimepicker').classes()).toContain('is-dark')
    wrapper.unmount()

    wrapper = shallowMount(PickersContainer, {
      props: {
        visible: true,
        dark: false
      }
    })
    expect(wrapper.classes()).not.toContain('is-dark')
    wrapper.unmount()
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
          props: {
            visible: true,
            noHeader: false
          }
        })

        const header = wrapper.findComponent(HeaderPicker)
        expect(header.exists()).toBeTruthy()
      })

      it('should not be defined if the "no-header" prop is defined', () => {
        const wrapper = shallowMount(PickersContainer, {
          props: {
            visible: true,
            noHeader: true
          }
        })

        const header = wrapper.findComponent(HeaderPicker)
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
          props: {
            visible: true,
            hasNoButton: false
          }
        })

        let footer = wrapper.findComponent(ButtonValidate)
        expect(footer.exists()).toBeTruthy()
        wrapper.unmount()

        wrapper = shallowMount(PickersContainer, {
          props: {
            visible: true,
            hasNoButton: false,
            inline: true
          }
        })

        footer = wrapper.findComponent(ButtonValidate)
        expect(footer.exists()).toBeTruthy()
        wrapper.unmount()

        wrapper = shallowMount(PickersContainer, {
          props: {
            visible: true,
            hasNoButton: false,
            inline: false,
            range: true
          }
        })

        footer = wrapper.findComponent(ButtonValidate)
        expect(footer.exists()).toBeTruthy()
        wrapper.unmount()
      })

      it('should not be defined if the "has-no-button" prop is defined, or it\'s inline or range mode', () => {
        const wrapper = shallowMount(PickersContainer, {
          props: {
            visible: true,
            hasNoButton: true
          }
        })

        const footer = wrapper.findComponent(ButtonValidate)
        expect(footer.exists()).toBeFalsy()
      })

      /**
       * TODO: Add tests to ensure the props are passed to the footer correctly
       */
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })
})
