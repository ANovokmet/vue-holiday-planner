# vue-holiday-planner

This library consists of of a calendar component - Resource view which displays a scrollable overview of several people's calendars through months. Check out the [Demo](https://anovokmet.github.io/vue-holiday-planner/)

## Installation
```
npm install vue-holiday-planner
```

## Usage

```js
<template>
  <HolidayPlanner :resources="rows">    
  </HolidayPlanner>
</template>

<script lang="ts">
import Vue from 'vue';
import { HolidayPlanner } from 'vue-holiday-planner';
import dayjs from 'dayjs';

export default Vue.extend({
  name: "App",
  components: {
    HolidayPlanner,
  },
  data() {
    return {
      rows: [
        {
            id: 1,
            title: "Krystalle Logie",
            subtitle: "Senior Sales Associate",
            img: "assets/woman1.jpg",
            days: [
                {
                    date: dayjs(),
                    class: 'orange',
                },
                {
                    startDate: dayjs(),
                    endDate: dayjs().add(3, 'day'),
                    class: 'purple',
                }
            ],
        }
      ],
    };
  },
});
</script>
```

### Props

- `resources` - Array of items (rows) displayed in the calendar:
    - `id`
    - `title`
    - `subtitle`
    - `img` - Href of image displayed in the default row header template
    - `days` - Array of dates highlighted in the calendar for this resource
        - `date` {DayJs} - Highlighted date
        - `startDate` {DayJs} - Optional, if date is null, use as start of the interval of selected dates
        - `endDate` {DayJs} - Optional, if date is null, use as end of the interval of selected dates
        - `class` string|string[]
        - `style` {Object} - Optional, CSS styles to apply to day, eg. `style: { backgroundColor: "#3f51b5", color: "white" }`

```js
{
    /**
     * Rows to display
     */
    resources: {
      type: Array as PropType<Resource[]>,
      required: true,
    },
    /**
     * Planner initializes on this date and scrolls to it initially
     */
    startDate: {
      default: () => dayjs().startOf('day'),
    },
    /** if infinite scroll is disabled, this is max scrollable date */
    maxDate: {
      default: () => dayjs().endOf('year'),
    },
    /** if infinite scroll is disabled, this is min scrollable date */
    minDate: {
      default: () => dayjs().startOf('year'),
    },
    /** is infinite scroll enabled */
    infiniteScroll: {
      type: Boolean,
      default: true,
    },
    /** custom day classes to apply every row of the date, eg. national holidays */
    customDays: {
      type: Array as PropType<CustomDay[]>,
      default: () => ([]),
    },
    /** 
     * Function to generate classes of body days
     */
    getClassFn: {
      type: Function,
      default: (date: Dayjs) => {
        const d = date.day();
        if (d === 6 || d === 0) {
          return 'weekend';
        }
      },
    },
    /**
     * Function to generate classes of header days
     */
    getHeaderClassFn: {
      type: Function,
      default: (date: Dayjs) => {
        return {
          'today': date.isSame(dayjs(), 'day'),
          'start-of-month': date.date() === 1
        };
      },
    },
    /** function for date labels in body */
    getDayValueFn: {
      type: Function,
      default: (date: Dayjs) => {
        return date.date();
      },
    },
    /** function for date labels in header */
    getDayHeaderFn: {
      type: Function,
      default: (date: Dayjs) => {
        return date.format('dd')[0];
      },
    },
    /** enable selection of dates */
    selectionEnabled: {
      type: Boolean,
      default: true,
    }
}
```

### Events

Most are self-explanatory

 - `@header-click` - Emits when a date is clicked in the header.
 - `@row-click`
 - `@day-click`
    - `date` {DayJs}
    - `event`
    - `row`
    - `model` - If clicked on a highlighted date, returns the input model of the day
 - `@selection-end`
    - `dates` {DayJs[]} - Array of selected dates
    - `resources` - Array of selected resource input models
    - `event`

### Slots

 - `row-header` - Custom row template

Example:

```html
<template v-slot:row-header="{ row }">
    <div>Row:{{row.title}}</div>
</template>
```

 - `title` - Custom title template

Example:

```html
<template  v-slot:title="{ from, to }">
    <div>
        From:{{from && from.format('MMM D. YYYY')}}, To:{{to && to.format('MMM D. YYYY')}
    <div>
</template>  
```

  
 
  <!--  -->
  <!--   

## Development setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

