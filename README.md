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
<link rel="stylesheet" type="text/css" href="${YOUR_PATH}/vue-ctk-date-time-picker.css">

<vue-ctk-date-time-picker></vue-ctk-date-time-picker>

<script src="https://unpkg.com/vue" charset="utf-8"></script>
<script src="${YOUR_PATH}/vue-ctk-date-time-picker.umd.min.js" charset="utf-8"></script>

<script type="text/javascript">
  Vue.component('vue-ctk-date-time-picker', window['vue-ctk-date-time-picker']);
</script>
```
Here is an example of UMD implementation: https://codepen.io/louismazel/pen/jQWNzQ

## Props API

| Props      | Type       | Required | Default    |
|------------|------------|----------|------------|
| v-model    | String | yes     | -          |
| id  | string | no  | CtkDateTimePicker |
| label      | String     | no    | Select date & time |
| disabled | Boolean | no | false |
| hint (1)       | text       | no       | -         |
| error (2) | Boolean    | no      | false     |
| color (3)     | String (hex) | no    | dodgerblue |
| button-color (4)    | String (hex) | no    | #00C853 |
| position     | String | no    | null |
| locale (5)  | String | no     | Browser Locale |
| persistent     | Boolean | no    | false |
| minute-interval | Int | no    | 1    |
| formatted   | String | no    | 'llll' (momentjs format) |
| format   | String | no      | - |
| output-format   | String | no  | null |
| time-zone (6)  | String | no  | Browser Time Zone |
| only-time   | Boolean | no     | false |
| only-date   | Boolean | no  | false |
| no-header   | Boolean | no   | false |
| overlay | Boolean | no | true |
| min-date (7)  | String | no  | - |
| max-date (7)  | String | no  | - |
| no-weekends-days | Boolean | no | false |
| auto-close | Boolean | no | false |
| inline | Boolean | no | false |
| overlay | Boolean | no | false |
| range-mode | Boolean | no | false |
| dark | Boolean | no | false |
| no-shortcuts | Boolean | no | false |
| no-button | Boolean | no | false |
| disabled-dates (8) | Array<string> | no | [] |
| disabled-hours (9) | Array<string> | no | - |
| shortcuts-translations (10) | Object | no | - |
| input-size | String (sm|lg) | no | null |
| buttonNowTranslation | String | no | 'Now' |
| noButtonNow | Boolean | no | false |

(1) hint : Is a text that replaces the label/placeholder (Ex : Error designation)

(2) error : When is `true` --> Input border & label are red

(3) color: Replace color for the hint, the borders & picker color

(4) button-color: Replace color for the buttons on bottom (validation & 'now')

(5) locale : Default value is the locale of the browser - Ex : Set `locale="fr"` to force to French language

(6) time-zone : Default value is the time-zone of the browser - Ex : Set `Europe/Paris` to force to French TZ. Do not forget to use a format like this `YYYY-MM-DDTHH:mm:ssZ` to get the TZ
 
(7) min-date & max-date : Must be `'YYYY-MM-DD'` format

(8) Disabled-Dates is an Array of dates in 'YYYY-MM-DD' format (ex: `['2018-04-03', '2018-04-07', '2018-04-09']`)

(9) disabled-hours : Must be an Array of hours in 24h format ('00' to '23') : `['00','01','02','03','04','05','06','07','19','20','21','22','23']`

(10) shortcuts-translation : Must be an Object like that

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


## Upcoming features (Todo)

- Custom shortcuts on RangeDatePicker
- UI Improvements for TimePicker (Issue #35)
- Double Calendar on RangeDatePicker
- Inputs Text to choose values (Issue #30)
- Keyboard Accessibility
- Select Year directly on DatePicker

## Contribution

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
