import { shallowMount } from '@vue/test-utils'

import TimePicker from '@/VueCtkDateTimePicker/_subs/PickersContainer/_subs/TimePicker'

describe('VueCtkDateTimePicker/PickersContainer/TimePicker', () => {
  let wrapper

  beforeEach(() => (
    wrapper = shallowMount(TimePicker, {
      props: {
        height: 200,
        format: 'HH:mm',
        minuteInterval: 1
      }
    })
  ))

  it('should be defined', () => {
    expect(wrapper.exists()).toBeTruthy()
    const classes = ['flex', 'flex-fixed', 'flex-1']
    classes.forEach(C => expect(wrapper.classes()).toContain(C))
  })

  describe('dark class', () => {
    it('should have the "is-dark" class if the dark prop is specified', async () => {
      await wrapper.setProps({
        dark: true
      })
      expect(wrapper.classes()).toContain('is-dark')
    })

    it('should not have the "is-dark" class if the dark prop is not specified', async () => {
      await wrapper.setProps({
        dark: false
      })
      expect(wrapper.classes()).not.toContain('is-dark')
    })
  })

  describe('inline class', () => {
    it('should have the "inline" class if the inline prop is specified', async () => {
      await wrapper.setProps({
        inline: true
      })
      expect(wrapper.classes()).toContain('inline')
    })

    it('should not have the "inline" class if the inline prop is not specified', async () => {
      await wrapper.setProps({
        inline: false
      })
      expect(wrapper.classes()).not.toContain('inline')
    })
  })

  describe('columns', () => {
    it('should have 2 columns if there isnt amp', async () => {
      await wrapper.setProps({
        format: 'HH:mm'
      })

      const columns = wrapper.findAll('.time-picker-column')
      expect(columns.length).toEqual(2)

      const column = columns[0]
      const classes = ['flex-1', 'flex', 'flex-direction-column', 'text-center']
      classes.forEach(C => {
        expect(column.classes()).toContain(C)
      })
    })

    it('should have 3 columns if there is apm', async () => {
      await wrapper.setProps({
        format: 'HH:mm A'
      })

      const columns = wrapper.findAll('.time-picker-column')
      expect(columns.length).toEqual(3)
    })

    /**
     * TODO: Test the hours & minute column
     */

    describe('Time periods column', () => {
      it('should be defined if the format includes time period', async () => {
        await wrapper.setProps({
          format: 'HH:mm A'
        })

        const column = wrapper.find('.time-picker-column-apms')
        expect(column.exists()).toBeTruthy()
      })

      it('should not be defined if the format does not includes time period', async () => {
        await wrapper.setProps({
          format: 'HH:mm'
        })

        const column = wrapper.find('.time-picker-column-apms')
        expect(column.exists()).toBeFalsy()
      })

      describe('items', () => {
        it('should have 2 items', async () => {
          await wrapper.setProps({
            format: 'HH:mm A'
          })

          const items = wrapper.findAll('.time-picker-column-apms .time-picker-column-item')
          expect(items.length).toBeGreaterThan(0)
          expect(items.map(item => item.element.tagName)).toEqual(new Array(items.length).fill('BUTTON'))

          const am = items[0]
          expect(am.attributes().type).toEqual('button')
          expect(am.attributes().tabindex).toEqual('-1')
          const classes = ['flex', 'align-center', 'justify-content-center']
          classes.forEach(C => expect(am.classes()).toContain(C))

          const amText = am.find('.time-picker-column-item-text')
          expect(amText.text()).toEqual('AM')

          const pm = items[1]
          const pmText = pm.find('.time-picker-column-item-text')
          expect(pmText.text()).toEqual('PM')
        })
      })
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })
})
