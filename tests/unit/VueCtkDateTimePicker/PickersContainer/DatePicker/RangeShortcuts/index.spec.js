import { shallowMount, mount, config } from '@vue/test-utils'

import RangeShortcuts from '@/VueCtkDateTimePicker/_subs/PickersContainer/_subs/DatePicker/_subs/RangeShortcuts'
import CustomButton from '@/VueCtkDateTimePicker/_subs/CustomButton'

describe('VueCtkDateTimePicker/PickersContainer/DatePicker/RangeShortcuts', () => {
  let wrapper

  config.renderStubDefaultSlot = true

  beforeEach(() => {
    wrapper = shallowMount(RangeShortcuts, {
      props: {
        customShortcuts: [
          { key: 'thisWeek', label: 'This week', value: 'isoWeek' },
          { key: 'lastWeek', label: 'Last week', value: '-isoWeek' },
          { key: 'last7Days', label: 'Last 7 days', value: 7 },
          { key: 'last30Days', label: 'Last 30 days', value: 30 },
          { key: 'thisMonth', label: 'This month', value: 'month' },
          { key: 'lastMonth', label: 'Last month', value: '-month' },
          { key: 'thisYear', label: 'This year', value: 'year' },
          { key: 'lastYear', label: 'Last year', value: '-year' }
        ],
        height: 200
      }
    })
  })

  it('should be defined', () => {
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.attributes().style).toMatch('height: 200px;')
  })

  describe('shortcut button', () => {
    it('should be defined', async () => {
      const button = wrapper.findComponent(CustomButton)
      expect(button.exists()).toBeTruthy()
      expect(button.text()).toEqual('This week')
    })

    it('should be selected if the "selectedShortcut" value is the current shortcut', async () => {
      /**
       * FIXME: Fix when issue is done - https://github.com/vuejs/vue-test-utils-next/issues/228
       */
      if (!wrapper.setData) {
        console.error('FIXME: wrapper.setData is not a function - https://github.com/vuejs/vue-test-utils-next/issues/228')
        return
      }
      await wrapper.setData({
        selectedShortcut: 'thisWeek'
      })
      const button = wrapper.findComponent(CustomButton)
      expect(button.props().selected).toBeTruthy()
    })

    it('should not be selected if the "selectedShortcut" value is different than current', async () => {
      /**
       * FIXME: Fix when issue is done - https://github.com/vuejs/vue-test-utils-next/issues/228
       */
      if (!wrapper.setData) {
        console.error('FIXME: wrapper.setData is not a function - https://github.com/vuejs/vue-test-utils-next/issues/228')
        return
      }
      await wrapper.setData({
        selectedShortcut: 'lastWeek'
      })
      const button = wrapper.findComponent(CustomButton)
      expect(button.props().selected).toBeFalsy()
    })

    it('should select the shortcut on click', async () => {
      const onChangeRange = jest.fn()

      const wrapper = mount(RangeShortcuts, {
        props: {
          customShortcuts: [
            { key: 'thisWeek', label: 'This week', value: 'isoWeek' }
          ],
          height: 200,
          onChangeRange
        }
      })

      const button = wrapper.findComponent(CustomButton)
      await button.trigger('click')
      expect(onChangeRange).toHaveBeenCalled()
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })
})
