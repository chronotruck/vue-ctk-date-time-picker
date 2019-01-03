import Moment from 'moment-timezone'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

export default class Month {
  constructor (month, year, locale) {
    moment.locale(locale)
    this.start = moment([year, month])
    this.end = this.start.clone().endOf('month')
    this.month = month
    this.year = year
  }

  getWeekStart () {
    return this.start.weekday()
  }

  getDays () {
    return Array.from(moment.range(this.start, this.end).by('days'))
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
  const first = moment.localeData(locale).firstDayOfWeek()
  let days = moment.weekdaysShort(first === 1)
  if (firstDay) {
    const keep = days.splice(firstDay)
    const stay = days
    days = keep.concat(stay)
  }
  return days
}

export const getMonthsShort = (locale) => {
  return Array.apply(0, Array(12)).map(function(_,i){return moment().locale(locale).month(i).format('MMM')})
}
