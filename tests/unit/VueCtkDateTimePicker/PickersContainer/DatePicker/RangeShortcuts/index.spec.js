import { shallowMount, mount } from '@vue/test-utils'

import RangeShortcuts from '@/VDatetimePicker/_subs/PickersContainer/_subs/DatePicker/_subs/RangeShortcuts'
import CustomButton from '@/VDatetimePicker/_subs/CustomButton'

describe('VueCtkDateTimePicker/PickersContainer/DatePicker/RangeShortcuts', () => {
  let wrapper

  beforeEach(() => (
    wrapper = shallowMount(RangeShortcuts, {
      propsData: {
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
  ))

  it('should be defined', () => {
    expect(wrapper.exists()).toBeTruthy()
    expect(wrapper.attributes().style).toMatch('height: 200px;')
  })

  describe('shortcut button', () => {
    it('should be defined', () => {
      const button = wrapper.find(CustomButton)
      expect(button.exists()).toBeTruthy()
      expect(button.text()).toEqual('This week')
    })

    it('should be selected if the "selectedShortcut" value is the current shortcut', () => {
      wrapper.setData({
        selectedShortcut: 'thisWeek'
      })
      const button = wrapper.find(CustomButton)
      expect(button.props().selected).toBeTruthy()
    })

    it('should not be selected if the "selectedShortcut" value is different than current', () => {
      wrapper.setData({
        selectedShortcut: 'lastWeek'
      })
      const button = wrapper.find(CustomButton)
      expect(button.props().selected).toBeFalsy()
    })

    it('should select the shortcut on click', () => {
      const wrapper = mount(RangeShortcuts, {
        propsData: {
          customShortcuts: [
            { key: 'thisWeek', label: 'This week', value: 'isoWeek' }
          ],
          height: 200
        }
      })

      const selectFn = jest.fn()
      wrapper.setMethods({
        select: selectFn
      })

      const button = wrapper.find(CustomButton)
      button.trigger('click')
      expect(selectFn).toHaveBeenCalled()
    })
  })

  afterEach(() => {
    wrapper.destroy()
  })
})
