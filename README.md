![vue-ctk-date-time-picker](./assets/logo_sticky.png)

# vue-ctk-date-time-picker

> A vue component for select dates (range mode available) & time

![vue-ctk-date-time-picker](./assets/illu-animated.gif)
#### Dark mode
![vue-ctk-date-time-picker](./assets/illu-animated-dark.gif)
## Demo
[Enjoy here](https://htmlpreview.github.io/?https://github.com/chronotruck/vue-ctk-date-time-picker/blob/master/demo/index.html)

## Installation

Yarn
`yarn add vue-ctk-date-time-picker`
NPM
`npm i --save vue-ctk-date-time-picker`

## Usage

### ES6 Modules / CommonJS

```js
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker';
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css';

Vue.component('vue-ctk-date-time-picker', VueCtkDateTimePicker);
```

```html
<vue-ctk-date-time-picker></vue-ctk-date-time-picker>
```

### UMD

```html
<vue-ctk-date-time-picker></vue-ctk-date-time-picker>

<script src="https://unpkg.com/vue" charset="utf-8"></script>
<script src="./dist/vue-ctk-date-time-picker.umd.min.js" charset="utf-8"></script>
<link rel="stylesheet" type="text/css" href="./dist/vue-ctk-date-time-picker.css">

<script type="text/javascript">
  Vue.component('vue-ctk-date-time-picker', window.VueCtkDateTimePicker.default);
</script>
```
Here is an example of UMD implementation: https://codepen.io/louismazel/pen/jQWNzQ

## Props API

| Props      | Type       | Required | Default    |
|------------|------------|----------|------------|
| v-model    | String/Int | yes     | -          |
| label      | String     | no    | Select date & time |
| hint (1)       | text       | no       | -         |
| error-hint (2) | Boolean    | no      | false     |
| color (3)     | String (hex) | no    | dodgerblue |
| minute-interval | Int | no    | 1    |
| formatted   | string | no    | 'llll' (momentjs format) |
| format   | string | no      | - |
| time-format   | string | no  | 'H:mm a' |
| locale (4)  | string | no     | Browser Locale |
| time-zone (5)  | string | no  | Browser Time Zone |
| disable-time   | Boolean | no     | false |
| disable-date   | Boolean | no  | false |
| without-header   | Boolean | no   | false |
| id  | string | no  | CtkDateTimePicker |
| overlay | Boolean | no | true |
| enable-button-validate | Boolean | no | false |
| min-date (6)  | string | no  | - |
| max-date (6)  | string | no  | - |
| no-weekends-days | Boolean | no | false |
| auto-close | Boolean | no | false |
| without-input | Boolean | no | false |
| overlay-background | Boolean | no | false |
| disabled-dates (7) | Boolean | no | [] |
| range-mode | Boolean | no | false |
| dark | Boolean | no | false |
| without-range-shortcut | Boolean | no | false |
| shortcuts-translation (8) | Object | no | - |
| disabled-hours (9) | Array (of String) | no | - |

(1) hint : Is a text that replaces the label/placeholder

(2) error-hint : When is `true` --> Input border & label are red

(3) color: Replace color for the hint, the borders & time selected in dropdown

(4) locale : Default value is the locale of the browser - Ex : Set `locale="fr"` to force to French language

(5) time-zone : Default value is the time-zone of the browser - Ex : Set `Europe/Paris` to force to French TZ. Do not forget to use a format like this `YYYY-MM-DDTHH:mm:ssZ` to get the TZ
 
(6) min-date & max-date : Must be `'YYYY-MM-DD'` format

(7) Disabled-Dates is an Array of dates in 'YYYY-MM-DD' format (ex: `['2018-04-03', '2018-04-07', '2018-04-09']`)

(8) shortcuts-translation : Must be an Object like that

```
{
  "this_week": "This week",
  "last_7_days": "Last 7 days",
  "last_30_days": "Last 30 days",
  "this_month": "This month",
  "last_month": "Last month",
  "this_year": "This year",
  "last_year": "Last year"
}
```

(9) disabled-hours : Must be an Array of hours in 24h format ('00' to '23') : `['00','01','02','03','04','05','06','07','19','20','21','22','23']`

## Upcoming features (Todo)

- Disable specific hours & minutes on TimePicker
- Custom shortcuts on RangeDatePicker
- UI Improvements for TimePicker (Issue #35)
- Custom elements for trigger the component
- Double Calendar on RangeDatePicker
- Inputs Text to choose values (Issue #30)
- Keyboard Accessibility
- Select Year directly on DatePicker

## Contribution

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run serve
```

## Build

To build just run: `npm run build:lib`

## Tests

Work in progress

## License

This project is licensed under [MIT License](http://en.wikipedia.org/wiki/MIT_License)
