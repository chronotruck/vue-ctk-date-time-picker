import { shallowMount } from '@vue/test-utils'

import ButtonValidate from '@/VueCtkDateTimePicker/_subs/PickersContainer/_subs/ButtonValidate'

describe('VueCtkDateTimePicker/PickersContainer/ButtonValidate', () => {
  let wrapper

  beforeEach(() => (
    wrapper = shallowMount(ButtonValidate, {
      props: {
        visible: true
      }
    })
  ))

  it('should be defined', () => {
    expect(wrapper.exists()).toBeTruthy()
    const classes = ['flex', 'justify-content-right']
    classes.forEach(C => expect(wrapper.classes()).toContain(C))
  })

  it('should have a dark class if the "dark" prop is define', async () => {
    await wrapper.setProps({
      dark: true
    })
    expect(wrapper.classes()).toContain('is-dark')
  })

  it('should not have a dark class if the "dark" prop is not defined', async () => {
    await wrapper.setProps({
      dark: false
    })
    expect(wrapper.classes()).not.toContain('is-dark')
  })

  describe('now button', () => {
    it('should be defined if not time only, nor the "noButtonNow" prop is defined nor range mode', async () => {
      await wrapper.setProps({
        noButtonNow: false,
        range: false,
        onlyTime: false
      })
      const button = wrapper.find('.now')
      expect(button.exists()).toBeTruthy()
      expect(button.element.tagName).toEqual('BUTTON')
      const { tabindex, type } = button.attributes()
      expect(tabindex).toEqual('-1')
      expect(type).toEqual('button')

      const classes = ['flex', 'align-center', 'justify-content-center']
      classes.forEach(C => expect(button.classes()).toContain(C))

      const buttonContent = button.find('.datepicker-button-content')
      expect(buttonContent.exists()).toBeTruthy()
      expect(buttonContent.text()).toEqual('Now')
    })

    it('should have a custom text if "buttonNowTranslation" prop is defined', async () => {
      await wrapper.setProps({
        noButtonNow: false,
        range: false,
        onlyTime: false,
        buttonNowTranslation: 'My button content'
      })
      const buttonContent = wrapper.find('.now .datepicker-button-content')
      expect(buttonContent.text()).toEqual('My button content')
    })

    it('should emit a now event on click', async () => {
      await wrapper.setProps({
        noButtonNow: false,
        range: false,
        onlyTime: false
      })
      const button = wrapper.find('.now')
      button.trigger('click')
      expect(wrapper.emitted().now).toBeTruthy()
    })

    it('should be undefined if time only, or the "noButtonNow" prop is defined or range mode', async () => {
      await wrapper.setProps({
        noButtonNow: true,
        range: false,
        onlyTime: false
      })
      let button = wrapper.find('.now')
      expect(button.exists()).toBeFalsy()

      await wrapper.setProps({
        noButtonNow: false,
        range: true,
        onlyTime: false
      })
      button = wrapper.find('.now')
      expect(button.exists()).toBeFalsy()

      await wrapper.setProps({
        noButtonNow: false,
        range: false,
        onlyTime: true
      })
      button = wrapper.find('.now')
      expect(button.exists()).toBeFalsy()
    })

    describe('right margin', () => {
      it('should have the class if there is a validate button', async () => {
        await wrapper.setProps({
          noButtonNow: false,
          range: false,
          onlyTime: false,
          hasButtonValidate: true
        })
        const button = wrapper.find('.now')
        expect(button.classes()).toContain('right-margin')
      })

      it('should not have the class if validate button not present', async () => {
        await wrapper.setProps({
          noButtonNow: false,
          range: false,
          onlyTime: false,
          hasButtonValidate: false
        })
        const button = wrapper.find('.now')
        expect(button.classes()).not.toContain('right-margin')
      })
    })
  })

  describe('validate button', () => {
    it('should be defined if the "hasButtonValidate" is true', async () => {
      await wrapper.setProps({
        hasButtonValidate: true
      })
      const button = wrapper.find('.validate')
      expect(button.exists()).toBeTruthy()
      expect(button.element.tagName).toEqual('BUTTON')
      expect(button.attributes().tabindex).toEqual('-1')

      const classes = ['flex', 'align-center', 'justify-content-center']
      classes.forEach(C => expect(button.classes()).toContain(C))
    })

    it('should emit a validate event on click', async () => {
      await wrapper.setProps({
        hasButtonValidate: true
      })
      const button = wrapper.find('.validate')
      button.trigger('click')
      expect(wrapper.emitted().validate).toBeTruthy()
    })

    it('should be undefined if the "hasButtonValidate" is false', async () => {
      await wrapper.setProps({
        hasButtonValidate: false
      })
      const button = wrapper.find('.validate')
      expect(button.exists()).toBeFalsy()
    })

    /**
     * TODO: Test the button content.
     * See if we don't want to change the validate content value.
     */
  })

  afterEach(() => {
    wrapper.unmount()
  })
})
