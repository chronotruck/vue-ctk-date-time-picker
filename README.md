# vue-ctk-time-picker

> A vue component for select date & time (by Chronotruck)

## Demo
An [example](https://htmlpreview.github.io/?https://github.com/chronotruck/vue-ctk-date-time-picker/blob/master/demo/dist/index.html) is available

## Install

``` bash
npm install vue-ctk-date-time-picker --save
```
#### In single component
``` js
import CtkDateTimePicker from 'vue-ctk-date-time-picker'

var yourComponent = new Vue({
  components: { CtkDateTimePicker },
  ...
})
```
``` html
<template>
  ...
  <ctk-date-time-picker
    v-model="value"
    :label="'Choose a time'"
    :hint="'Text'"
    :error-hint="true"
    :minute-interval="10" // (for time)
    color="#FF0000" />
  ...
</template>  
```

## Props API

| Props      | Type       | Required | Default    |
|------------|------------|----------|------------|
| v-model    | String/Int | true     | -          |
| label      | String     | false    | Enter Text |
| hint*       | text       | no       | -         |
| error-hint** | Boolean    | no      | false     |
| color***     | String (hex) | no    | dodgerblue |
| minute-interval | Int | no    | 1    |    -        |
| formatted   | string | no    | 1    | 'llll' (momentjs format) |
| format   | string | no    | 1    | 'YYYY-MM-DDTHH:mm' |
| time-format   | string | no    | 1    | 'H:mm a' |
| locale   | string | no    | 1    | en |
| disable-time   | Boolean | no    | 1    | false |
| disable-date   | Boolean | no    | 1    | false |
| without-header   | Boolean | no    | 1    | false |
| id  | string | no    | 1    | CtkDateTimePicker |
| min-date****  | string | no    | 1    | null |
| max-date****  | string | no    | 1    | null |

*hint : Is a text that replaces the label/placeholder

**error-hint : When is `true` --> Input border & label are red

***color: Replace color for the hint, the borders & time selected in dropdown

****min-date & max-date : Must be 'YYYY-MM-DD' format

## Contribution

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
```
