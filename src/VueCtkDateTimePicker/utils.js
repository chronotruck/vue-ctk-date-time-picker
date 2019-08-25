import moment from 'moment'

export const getDefaultLocale = () => {
  const { userLanguage, language } = window.navigator
  const locale = (userLanguage || language || 'en').substr(0, 2)
  moment.locale(locale)
  return locale
}
