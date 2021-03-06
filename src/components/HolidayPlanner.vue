<template>
  <div class="hp-container">
    <div class="hp-header" v-if="enableHeader">
      <slot name="title" :from="from" :to="to">
        <div class="range" v-if="from != null && to != null">
          {{ dateFormat(from, "MMM YYYY") }} ― {{ dateFormat(to, "MMM YYYY") }}
        </div>
      </slot>
    </div>
    <div class="hp-header">
      <div class="side-header side"></div>
      <div
        class="main-header"
        @click="onHeaderClick"
        :class="{ 'hp-right-scrollbar-visible': rightScrollbarVisible }"
      >

        <div class="hp-floating-button move-left" @click="onMoveLeftClick">
          <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.81809 4.18179C8.99383 4.35753 8.99383 4.64245 8.81809 4.81819L6.13629 7.49999L8.81809 10.1818C8.99383 10.3575 8.99383 10.6424 8.81809 10.8182C8.64236 10.9939 8.35743 10.9939 8.1817 10.8182L5.1817 7.81819C5.09731 7.73379 5.0499 7.61933 5.0499 7.49999C5.0499 7.38064 5.09731 7.26618 5.1817 7.18179L8.1817 4.18179C8.35743 4.00605 8.64236 4.00605 8.81809 4.18179Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div class="hp-floating-button move-right" @click="onMoveRightClick">
          <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M6.18194 4.18185C6.35767 4.00611 6.6426 4.00611 6.81833 4.18185L9.81833 7.18185C9.90272 7.26624 9.95013 7.3807 9.95013 7.50005C9.95013 7.6194 9.90272 7.73386 9.81833 7.81825L6.81833 10.8182C6.6426 10.994 6.35767 10.994 6.18194 10.8182C6.0062 10.6425 6.0062 10.3576 6.18194 10.1819L8.86374 7.50005L6.18194 4.81825C6.0062 4.64251 6.0062 4.35759 6.18194 4.18185Z"
              fill="currentColor"
            />
          </svg>
        </div>


        <div class="hp-header-scroller" ref="scrollHeader">
          <div class="hp-header-row">
            <div
              v-for="(item, index) in months"
              class="header-month"
              :key="index"
              :style="{ 'flex-basis': item.width + 'px' }"
              :data-month-id="index"
            >
              <div class="hp-month-label">{{ item.title }}</div>
            </div>
          </div>
          <div class="hp-header-row">
            <div
              v-for="(item, index) in days"
              class="header-day"
              :key="index"
              :class="item.headerClass"
              :data-day-id="index"
            >
              {{ item.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="hp-body">
      <div class="side-body side hp-bottom-scrollbar-visible">
        <div class="hp-side-scroller" ref="scrollSide">
          <div v-for="row in resources" :key="row.id" class="hp-row row-side hp-card" :style="{'height': rowHeight + 'px' }">
            <slot name="row-header" :row="row">
              <img class="avatar" :src="row.img" />
              <div class="card-content">
                <div class="title">{{ row.title }}</div>
                <div class="subtitle">{{ row.subtitle }}</div>
              </div>
            </slot>
          </div>
        </div>
      </div>
      <div
        class="main-body"
        ref="scrollBody"
        @click="onBodyClick"
        @mousedown="onBodyMousedown"
      >
        <div ref="rowContainer" :style="{ 'width': days.length * 40 + 'px' }" style="overflow: hidden;position: relative;">
          <div
            v-for="row in resources"
            :key="row.id"
            class="hp-row row-main"
            :data-row-id="row.id" 
            :style="{'height': rowHeight + 'px' }"
          > 
            <div v-for="(item, index) in row.days"
              :key="'interval-'+index"
              class="hp-interval"
              :style="_getIntervalStyle(item)"
              :class="_getIntervalClass(item)">
            </div> 
            <div v-if="selectedRows[row.id]"
              class="hp-interval hp-selection"
              :style="_getSelectionStyle()">

            </div>
            <div
              v-for="(item, index) in days"
              :key="index"
              class="day-main"
              :class="[
                _getDateClasses(row, item),
                { selected: selected[item.key] && selectedRows[row.id] },
              ]"
              :data-day-id="index"
            >
              <div class="day-content">
                {{ item.value }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType, VueConstructor } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import clamp from 'lodash/clamp';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import { CustomDay, Day, Resource, ResourceDay } from './interfaces';
import { add_resize_listener } from './resize-listener';
dayjs.extend(minMax);

const DAY_WIDTH = 40;
const SCROLLABLE_THRESHOLD_DELTA = 400;
const SCROLLABLE_RANGE_EXPAND_WIDTH = 400;
const DRAGGING_TRESHOLD = 5;

interface Row {
  resource: Resource;
  top: number;
}

interface DayData {
  model: ResourceDay;
  classes: string;
}
type RowData = Record<any, Record<string, DayData>>;

interface Month {
  title: string;
  width: number;
}

export default (Vue as VueConstructor<
  Vue & {
    $refs: {
      scrollBody: HTMLElement;
      scrollHeader: HTMLElement;
      rowContainer: HTMLElement;
      scrollSide: HTMLElement;
    };
  }
>).extend({
  name: 'HolidayPlanner',
  props: {
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
      type: Object as PropType<Dayjs>,
      default: () => dayjs().startOf('day'),
    },
    /** Reference date where the scrolling starts from */
    referenceDate: {
      type: Object as PropType<Dayjs>,
      default: () => dayjs().startOf('day'),
    },
    /** if infinite scroll is disabled, this is max scrollable date */
    maxDate: {
      type: Object as PropType<Dayjs>,
      default: () => dayjs().endOf('year'),
    },
    /** if infinite scroll is disabled, this is min scrollable date */
    minDate: {
      type: Object as PropType<Dayjs>,
      default: () => dayjs().startOf('year'),
    },
    /** is infinite scroll enabled */
    infiniteScroll: {
      type: Boolean,
      default: true,
    },
    /** custom day classes to apply every row of the date */
    customDays: {
      type: Array as PropType<CustomDay[]>,
      default: () => ([]),
    },
    /** 
     * Function to generate classes of body days
     */
    getClassFn: {
      type: Function as PropType<(date: Dayjs) => string|string[]>,
      default: ((date: Dayjs) => {
        const d = date.day();
        const klass = [];
        if (d === 6 || d === 0) {
          klass.push('weekend');
        }

        if(date.isSame(dayjs(), 'day')) {
          klass.push('today');
        }

        if(date.date() === 1) {
          klass.push('start-of-month');
        }

        return klass;
      }) as any
    },
    /**
     * Function to generate classes of header days
     */
    getHeaderClassFn: {
      type: Function as PropType<(date: Dayjs) => any>,
      default: ((date: Dayjs) => {
        return {
          'today': date.isSame(dayjs(), 'day'),
          'start-of-month': date.date() === 1,
          'weekend': date.day() === 6 || date.day() === 0,
        };
      }) as any
    },
    /** function for date labels in body */
    getDayValueFn: {
      type: Function as PropType<(date: Dayjs) => any>,
      default: ((date: Dayjs) => {
        return date.date();
      }) as any
    },
    /** function for date labels in header */
    getDayHeaderFn: {
      type: Function as PropType<(date: Dayjs) => any>,
      default: ((date: Dayjs) => {
        return date.format('dd');
      }) as any
    },
    /** enable selection of dates */
    selectionEnabled: {
      type: Boolean,
      default: true,
    },
    /** enable MMM YYYY - MMM YYYY header */
    enableHeader: {
      type: Boolean,
      default: false,
    },
    rowHeight: {
      type: Number,
      default: 50
    }
  },
  created() {
    this.scrollableFrom = this.positionToDate(this.scrollableLeft);
    this.scrollableTo = this.positionToDate(this.scrollableRight);

    this.checkScrollableThresholdHit = debounce(this._checkScrollableThresholdHit.bind(this), 100);
    this.updateRange = throttle(this._updateRange.bind(this), 100);
    
  },
  mounted() {
    this.createDays();
    this.createMonths();

    const { scrollLeft, clientWidth } = this.$refs.scrollBody!;
    this._updateRange(scrollLeft, scrollLeft + clientWidth);
    this.referenceScrollLeft = this.dateToPosition(this.referenceDate!);

    this.$refs.scrollBody!.addEventListener('scroll', this.onBodyScroll.bind(this));

    add_resize_listener(this.$refs.scrollBody!, () => {
      const { clientWidth, clientHeight } = this.$refs.scrollBody!;
      this.visibleWidth = clientWidth;
      this.visibleHeight = clientHeight;
    });

    setTimeout(() => {

      const left = this.dateToPositionRelative(this.startDate!);
      const { scrollLeft, clientWidth } = this.$refs.scrollBody!;
      this._expandScrollableRange(left, left + clientWidth + 1000);

      this.scrollLeftTo(this.startDate, 'auto');
      this.checkScrollableThresholdHit(scrollLeft, clientWidth);
      this.updateRange(scrollLeft, scrollLeft + clientWidth);
    });

    this.computeClasses();
  },
  methods: {

    _getIntervalStyle(day: ResourceDay) {
      const style = Object.assign({}, day.style);

      if(day.startDate && day.endDate) {
        const left = this.dateToPosition(day.startDate!);
        const right = this.dateToPosition(day.endDate!);

        style.left = `${left}px`;
        style.width = `${right - left + DAY_WIDTH}px`;
      }

      return style;
    },

    _getSelectionStyle() {
      const style: any = {};

      if(this.selectionStartDate && this.selectionEndDate) {
        const left = this.dateToPosition(this.selectionStartDate!);
        const right = this.dateToPosition(this.selectionEndDate!);

        style.left = `${left}px`;
        style.width = `${right - left + DAY_WIDTH}px`;
      }

      return style;
    },

    _getIntervalClass(day: ResourceDay) {
      return day.class;
    },  

    // TODO:: move to computed when solution to performance is found
    computeClasses() {
      const value = this.resources;
      const _data: { [rowId: number]: any } = {};
      for (const row of value) {
        _data[row.id] = {};
        if (row.days) {
          for (const day of row.days) {
            if(day.date) {
              const key = this.getKey(day.date);
              _data[row.id][key] = {
                model: day,
                classes: day.class
              };
            } else if(day.startDate && day.endDate) {
              let date = day.startDate;
              if(day.endDate < day.startDate) {
                console.error('endDate is before startDate');
                continue;
              }
              while(date <= day.endDate) {
                const key = this.getKey(date);
                _data[row.id][key] = {
                  model: day,
                  classes: day.class
                }
                date = date.add(1, 'day');
              }
            } else {
              console.warn('Day without date', day); 
            }
          }
        }
      }
      this.rowData = _data;
    },

    onBodyScroll(event: Event): void {
      const { scrollLeft, scrollTop, clientWidth } = this.$refs.scrollBody!;
      requestAnimationFrame(() => {
        this.$refs.scrollHeader!.scrollLeft = scrollLeft; // fix lagging
        this.$refs.scrollSide!.scrollTop = scrollTop;
      });

      this.checkScrollableThresholdHit(scrollLeft, clientWidth);
      this.updateRange(scrollLeft, scrollLeft + clientWidth);
    },

    onHeaderClick(event: MouseEvent): void {
      const target = event.target as HTMLElement;
      if (target.dataset.dayId != null) {
        const day = this.days[+target.dataset.dayId];
        this.$emit('header-click', {
          event,
          date: day && day.date
        });
        this.centerOn(day.date);
      }
    },

    onBodyClick(event: MouseEvent): void {
      const target = event.target as HTMLElement;

      const row = target.closest<HTMLElement>('[data-row-id]');
      if (row) {
        this.$emit('row-click', {
          event,
          row: this.resources[+row.dataset.rowId!]
        });
      }

      const dayElement = target.closest<HTMLElement>('[data-day-id]');
      if (dayElement) {
        const day = dayElement && this.days[+dayElement.dataset.dayId!];
        let model;
        if(row && day) {
          const data = this.rowData[+row.dataset.rowId!][day.key];
          model = data && data.model;
        }
        this.$emit('day-click', {
          event,
          row: row && this.resources[+row.dataset.rowId!],
          date: day.date,
          model: model
        });
      }

      if (!this.selecting) {
        this.clearSelection();
      }
    },

    onMoveLeftClick(event: MouseEvent): void {

      let target: Dayjs;
      if(this.from!.date() === 1) {
        target = this.from!.subtract(1, 'day').startOf('month');
      } else {
        target = this.from!.startOf('month');
      }

      const left = this.dateToPositionRelative(target);
      const { scrollLeft, clientWidth } = this.$refs.scrollBody!;
      this._expandScrollableRange(left, left + clientWidth + 1000);
      this.scrollLeftTo(target);
    },

    onMoveRightClick(event: MouseEvent): void {

      const target = this.from!.add(1, 'month').startOf('month');

      const left = this.dateToPositionRelative(target);
      const { scrollLeft, clientWidth } = this.$refs.scrollBody!;
      this._expandScrollableRange(left - 1000, left + clientWidth + 1000);
      this.scrollLeftTo(target);
    },

    /**
     * start selection
     */
    onBodyMousedown(event: MouseEvent): void {

      if (!this.selectionEnabled) {
        return;
      }
      const rowContainer = this.$refs.rowContainer;
      const getXY = (event: MouseEvent): { x: number, y: number } => {
        const rect = rowContainer.getBoundingClientRect();
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
      }

      const { x: initial_x, y: initial_y } = getXY(event);

      let resizeTriggered = false;


      const onMousemove = (event: MouseEvent) => {
        const { x, y } = getXY(event);

        if (!resizeTriggered) {
          if (Math.abs(x - initial_x) > DRAGGING_TRESHOLD || Math.abs(y - initial_y) > DRAGGING_TRESHOLD) {
            resizeTriggered = true;
          } else {
            return;
          }
        } else {
          this.selecting = true;

          const leftX = Math.min(initial_x, x);
          const rightX = Math.max(initial_x, x);
          const topY = Math.min(initial_y, y);
          const bottomY = Math.max(initial_y, y);

          const selected: any = {};
          const selectedRows: any = {};
          let startDate: Dayjs | null = null;
          let endDate: Dayjs | null = null;
          for (const day of this.days) {
            if (day.left + DAY_WIDTH >= leftX && day.left <= rightX) {
              selected[day.key] = true;

              if(!startDate || day.date <= startDate) {
                startDate = day.date;
              }

              if(!endDate || day.date >= endDate) {
                endDate = day.date;
              }

            }
          }
          for (const row of this.rows) {
            if (row.top + this.rowHeight >= topY && row.top <= bottomY) {
              selectedRows[row.resource.id] = true;
            }
          }
          this.selectionStartDate = startDate;
          this.selectionEndDate = endDate;
          this.selected = selected;
          this.selectedRows = selectedRows;
        }
      }

      const onMouseup = (event: MouseEvent) => {
        setTimeout(() => {
          this.selecting = false;
        });

        const { x, y } = getXY(event);

        const leftX = Math.min(initial_x, x);
        const rightX = Math.max(initial_x, x);
        const topY = Math.min(initial_y, y);
        const bottomY = Math.max(initial_y, y);

        const dates: Dayjs[] = [];
        const resources: Resource[] = [];
        for (const day of this.days) {
          if (day.left + DAY_WIDTH >= leftX && day.left <= rightX) {
            dates.push(day.date);
          }
        }
        for (const row of this.rows) {
          if (row.top + this.rowHeight >= topY && row.top <= bottomY) {
            resources.push(row.resource);
          }
        }

        this.$emit('selection-end', {
          event,
          dates,
          resources
        });

        document.body.removeEventListener('mousemove', onMousemove);
        document.body.removeEventListener('mouseup', onMouseup);
      }

      document.body.addEventListener('mousemove', onMousemove);
      document.body.addEventListener('mouseup', onMouseup);
    },

    centerOn(date: Dayjs, behavior: 'smooth' | 'auto' | undefined = 'smooth'): void {
      const { clientWidth } = this.$refs.scrollBody!;
      const left = this.dateToPosition(date);
      this.$refs.scrollBody!.scrollTo({
        left: left + DAY_WIDTH / 2 - clientWidth / 2.0,
        behavior
      });
    },

    scrollLeftTo(date: Dayjs, behavior: 'smooth' | 'auto' | undefined = 'smooth'): void {
      const left = this.dateToPosition(date);
      this.$refs.scrollBody!.scrollTo({
        left: left,
        behavior
      });
    },

    positionToDate(x: number): Dayjs {
      const numDays = Math.floor(x / DAY_WIDTH);
      return this.referenceDate!.add(numDays, 'day');
    },

    dateToPosition(date: Dayjs): number {
      const diff = date.diff(this.scrollableFrom, 'day');
      const ix = clamp(diff, 0, this.days.length - 1);
      if(!this.days[ix]) {
        return 0;
      }
      return diff * DAY_WIDTH;
      // return this.days[ix].left;
    },

    dateToPositionRelative(date: Dayjs): number {
      const diff = date.diff(this.referenceDate, 'day');
      const ix = clamp(diff, 0, this.days.length - 1);
      if(!this.days[ix]) {
        return 0;
      }
      return diff * DAY_WIDTH;
    },

    _checkScrollableThresholdHit(scrollLeft: number, clientWidth: number): void {
      if (scrollLeft - this.referenceScrollLeft! < this.scrollableLeftThreshold) {
        this._expandScrollableRange(this.scrollableLeft - SCROLLABLE_RANGE_EXPAND_WIDTH, this.scrollableRight);
      }

      if (scrollLeft + clientWidth - this.referenceScrollLeft! > this.scrollableRightThreshold) {
        this._expandScrollableRange(this.scrollableLeft, this.scrollableRight + SCROLLABLE_RANGE_EXPAND_WIDTH);
      }
    },

    _expandScrollableRange(scrollableLeft: number, scrollableRight: number): void {
      const scrollableLeftChange = this.scrollableLeft - scrollableLeft;

      this.scrollableLeft = scrollableLeft;
      this.scrollableRight = scrollableRight;

      this.scrollableFrom = this.minDate && !this.infiniteScroll
        ? dayjs.max(this.positionToDate(this.scrollableLeft), this.minDate)
        : this.positionToDate(this.scrollableLeft);
      this.scrollableTo = this.maxDate && !this.infiniteScroll
        ? dayjs.min(this.positionToDate(this.scrollableRight), this.maxDate)
        : this.positionToDate(this.scrollableRight);
      this.scrollableLeftThreshold = this.scrollableLeft + SCROLLABLE_THRESHOLD_DELTA;
      this.scrollableRightThreshold = this.scrollableRight - SCROLLABLE_THRESHOLD_DELTA;

      this.$refs.scrollBody!.scrollLeft += scrollableLeftChange;
      this.$refs.scrollHeader!.scrollLeft = this.$refs.scrollBody!.scrollLeft;

      this.createDays();
      this.createMonths();

      this.referenceScrollLeft = this.dateToPosition(this.referenceDate!);
    },

    clearSelection() {
      this.selected = {};
      this.selectedRows = {};
    },

    createDays(): void {
      let current = this.scrollableFrom!;
      this.days = [];
      let left = 0;
      while (current < this.scrollableTo!) {
        const key = this.getKey(current);
        const day = {
          title: this.getDayHeaderFn(current),
          value: this.getDayValueFn(current),
          key,
          date: current,
          headerClass: this._getDateHeaderClass(current),
          class: this._getDateClass(current),
          left
        };

        this.days.push(day);
        left += DAY_WIDTH;
        current = current.add(1, 'day');
      }
    },

    createMonths() {
      let current = this.scrollableFrom!;
      this.months = [];
      while (current < this.scrollableTo!) {

        const start = dayjs.max(current.startOf('month'), this.scrollableFrom!);
        const end = dayjs.min(current.endOf('month'), this.scrollableTo!);
        const numDays = end.diff(start, 'day');

        const month = {
          title: start.format('MMMM YYYY'),
          date: current,
          width: (numDays + 1) * DAY_WIDTH
        };

        this.months.push(month);
        current = end.add(1, 'day');
      }
    },

    _getDateHeaderClass(date: Dayjs) {
      const classes = [];
      classes.push(this.getHeaderClassFn(date));
      
      const key = this.getKey(date);
      const customDay = this.customDayRecords[key];
      if(customDay) {
        classes.push(customDay.headerClass);
      }

      return classes;
    },

    _getDateClass(date: Dayjs): string {
      const classes: string[] = [];
      const key = this.getKey(date);
      const customDay = this.customDayRecords[key];
      if (customDay) {
        if(Array.isArray(customDay.class)) {
          classes.push(...customDay.class);
        } else {
          classes.push(customDay.class);
        }
      }

      if (this.getClassFn) {
        const c = this.getClassFn(date);
        if (c) {
          if (Array.isArray(c)) {
            classes.push(...c);
          } else {
            classes.push(c);
          }
        }
      }
      return classes.join(' ');
    },

    _updateRange(left: number, right: number) {
      const startIndex = Math.floor(left / DAY_WIDTH);
      const endIndex = Math.floor(right / DAY_WIDTH) - 1;

      const from = this.days[startIndex].date;
      const to = this.days[endIndex].date;

      this.from = from;
      this.to = to;
    },

    getKey(value: Dayjs): string {
      return value.format('YYYY-MM-DD');
    },

    _getDateClasses(row: Resource, day: Day): any {
      return (day.class ? day.class + ' ' : '') + (this.rowData[row.id] && this.rowData[row.id][day.key] && this.rowData[row.id][day.key].classes || '');
    },

    _getDateStyle(row: Resource, day: Day): any {
      return this.rowData[row.id] && this.rowData[row.id][day.key] && this.rowData[row.id][day.key].model.style;
    },

  },
  watch: {
    resources() {
      this.computeClasses();
    }
  },
  computed: {

    dateFormat() {
      return (date: Dayjs, format: string) => {
        return date.format(format);
      };
    },
    
    rows(): Row[] {
      const resources = this.resources as Resource[];
      const _rows: Row[] = [];
      let top = 0;
      for (const resource of resources) {
        _rows.push({
          resource,
          top
        });
        top += this.rowHeight;
      }
      return _rows;
    },

    rowContainerHeight(): number {
      return this.rows.length * this.rowHeight;
    },

    rightScrollbarVisible(): boolean {
      return this.rowContainerHeight > this.visibleHeight;
    },

    customDayRecords(): Record<string, CustomDay> {
      const customDays: Record<string, CustomDay> = {};
      for (const day of this.customDays) {
        const key = this.getKey(day.date);
        customDays[key] = day;
      }
      return customDays;
    }

  },
  data() {
    return {
      months: [] as Month[],
      days: [] as Day[],
      from: null as any,
      to: null as any,

      rowData: {} as RowData,
      selected: {} as { [key: string]: boolean },
      selectedRows: {} as { [key: string]: boolean },

      today: dayjs(),
      referenceScrollLeft: 0,
      scrollableFrom: null as Dayjs | null,
      scrollableTo: null as Dayjs | null,
      scrollableLeft: -1200,
      scrollableRight: 1200,
      scrollableLeftThreshold: null as unknown as number,
      scrollableRightThreshold: null as unknown as number,
      checkScrollableThresholdHit: (scrollLeft: number, clientWidth: number) => {
        return;
      },
      updateRange: (left: number, right: number) => {
        return;
      },
  
      selecting: false,

      visibleWidth: 0,
      visibleHeight: 0,

      selectionStartDate: null as Dayjs | null,
      selectionEndDate: null as Dayjs | null
    };
  }
});
</script>

<style lang="css" scoped>

* {
  box-sizing: border-box;
}

.hp-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fafbfb;
}

.hp-body {
  display: flex;
  flex-grow: 1;
  overflow: auto;
}

.main-body {
  flex: 1 1 0;
  overflow: auto;
}

.side-body {
  display: flex;
  overflow: hidden;
}

.hp-bottom-scrollbar-visible {
  padding-bottom: 17px;
}

.hp-side-scroller {
  overflow: hidden;
}

.hp-header {
  display: flex;
}

.main-header {
  display: flex;
  flex: 1 1 0;
  overflow: hidden;
  position: relative;
  /* height: 80px; */
}

.hp-header-scroller {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}
.hp-header-row {
  display: flex;
  flex: 1;
}

.hp-right-scrollbar-visible {
  padding-right: 17px;
}

.side {
  margin-right: 35px;
  width: 200px;
}

.header-day {
  flex: 0 0 40px;
  height: 40px;
  cursor: pointer;
  color: #000;
  font-weight: 500;

  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease-out;
}

::v-deep .header-day.today {
  position: relative;
}

/* ::v-deep .header-day.today::after {
  content: "";
  height: 30px;
  width: 30px;
  position: absolute;
  border-radius: 50%;
  border: 2px solid #87b8e9;
} */

/** use v-global in Vue3 */
.day-main.today {
  border: 1px solid rgb(0 0 0 / 10%);
  height: 30px;
  border-radius: 20px;
  background-color: rgb(225 225 225 / 33%);
  color: black;
  font-weight: bold;
}

.day-main {
  flex: 0 0 40px;
  height: 30px;

  cursor: pointer;
  color: #676565;
}

/** use v-global in Vue3 */
::v-deep .day-main {
  /* background-color: #f8f7f9; */
  z-index: 1;
}

/** use v-global in Vue3 */
::v-deep .weekend {
  /* background-color: #e4e3e4; */
}

.hp-row {
  display: flex;
  align-items: center;
}

.range {
  margin-left: 200px;
  padding: 30px;
  font-size: 24px;
  color: #676565;
}

.start-of-month {
  /* border-left: 3px solid #cc6799; */
  position: relative;
}

.header-month {
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
}

.hp-month-label {
  position: sticky;
  left: 39px;
  z-index: 1;
  padding: 30px 30px 30px 10px;
  font-size: 24px;
  color: #000000;
}

.hp-card .avatar {
  height: 56px;
  width: 56px;
  border-radius: 50%;
  margin-right: 20px;
}

.hp-card .title {
  margin-bottom: 4px;
  font-weight: 500;
  color: #333333;
}

.hp-card .subtitle {
  color: #8c8c8c;
}

.hp-card .title,
.hp-card .subtitle {
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.5px;
}

.card-content {
  overflow: auto;
}

.main-body,
.main-header {
  user-select: none;
}

.day-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s ease-in-out;
}

.day-content:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.hp-selection {
  background: #87b8e982;
}

.selected > .day-content {
  color: white;
}

.hp-interval {
  position: absolute;
  height: 30px;
  border-radius: 20px;
  border: 1px solid transparent;
  z-index: 0;
}

.hp-floating-button {
  position: absolute;
  cursor: pointer;
  width: 30px;
  height: 30px;
  z-index: 2;
}

.move-left {
  left: 20px;
  top: 30px; /* TODO:: do better */
}

.move-right {
  right: 20px;
  top: 30px;
}


</style>
