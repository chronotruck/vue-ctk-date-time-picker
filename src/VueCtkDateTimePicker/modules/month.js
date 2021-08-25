import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

export default class Month {
  constructor (month, year, locale) {
    moment.locale(locale)
    moment.updateLocale('ja', {
      months: [
        '1月', '2月', '3月','4月', '5月', '6月',
        '7月', '8月', '9月', '10月', '11月', '12月'
      ]
    })
    this.start = moment([year, month])
    this.end = this.start.clone().endOf('month')
    this.month = month
    this.year = year
  }

  getWeekStart () {
    return this.start.weekday()
  }

  getFormatted () {
    return this.start.format('MMMM')
  }

  getYear () {
    return this.start.format('YYYY')
  }

  getWeeks () {
    return this.end.week() - this.start.week() + 1
  }

  getMonthDays () {
    const r1 = moment.range(this.start, this.end).by('days')
    return Array.from(r1)
  }
}

export const getWeekDays = (locale, firstDay) => {
  const firstDayNumber = firstDay === 0
    ? 7
    : firstDay || moment.localeData(locale).firstDayOfWeek()
  let days = moment.weekdaysShort()
  const keep = days.splice(firstDayNumber)
  const stay = days
  days = keep.concat(stay)
  return days
}

export const getMonthsShort = (locale) => {
  return Array.apply(0, Array(12)).map((_, i) => moment().locale(locale).month(i).format('MMM'))
}
