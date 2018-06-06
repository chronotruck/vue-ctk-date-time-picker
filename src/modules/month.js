import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

export default class Month {

  constructor (month, year) {
    this.start = moment([year, month]);
    this.end = this.start.clone().endOf('month');
    this.month = month;
    this.year = year;
  }

  getWeekStart () {
    return this.start.weekday();
  }

  getDays () {
    return Array.from(moment.range(this.start, this.end).by('days'));
  }

  getFormatted () {
    return this.start.format('MMMM YYYY');
  }

  getWeeks () {
    return this.end.week() - this.start.week() + 1;
  }

  getMonthDays () {
    const r1 = moment.range(this.start, this.end).by('days')
    return Array.from(r1)
  }

  // getYears() {
  //   let start = moment([this.start.year() - 50, 0]);
  //   let end = moment([this.start.year() + 50, 0]);
  //
  //   return Array.from(moment.range(start, end).by('years'));
  // }
}

export const getWeekDays = function (locale) {
  const firstDay = moment.localeData(locale).firstDayOfWeek()
  return moment.weekdaysShort(firstDay === 1)
}
