<template>
  <div class="container">
    <div class="header">
      <slot name="title" :from="from" :to="to">
        <div class="range" v-if="from != null && to != null">
          {{ dateFormat(from, "MMM YYYY") }} ― {{ dateFormat(to, "MMM YYYY") }}
        </div>
      </slot>
    </div>
    <div class="header">
      <div class="side-header side"></div>
      <div class="main-header" @click="onHeaderClick" :class="{'hp-right-scrollbar-visible': rightScrollbarVisible}">
        <div class="hp-header-scroller" ref="scrollHeader">
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
    <div class="body">
      <div class="side-body side hp-bottom-scrollbar-visible">
        <div class="hp-side-scroller" ref="scrollSide">
          <div v-for="row in resources" :key="row.id" class="row row-side card">
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
        <div ref="rowContainer">
          <div
            v-for="row in resources"
            :key="row.id"
            class="row row-main"
            :data-row-id="row.id"
          >
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
import { defineComponent, PropType, ref } from 'vue';
import dayjs, { Dayjs } from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import { clamp, debounce, throttle } from 'lodash';
import { Day, Resource } from './interfaces';
import { add_resize_listener } from './resize-listener';
dayjs.extend(minMax);

const DAY_WIDTH = 40;
const ROW_HEIGHT = 70;
const SCROLLABLE_THRESHOLD_DELTA = 200;
const SCROLLABLE_RANGE_EXPAND_WIDTH = 400;
const DRAGGING_TRESHOLD = 5;

interface Row {
  resource: Resource;
  top: number;
}

export default defineComponent({
  setup() {
    const scrollBody = ref<HTMLElement>();
    const scrollHeader = ref<HTMLElement>();
    const rowContainer = ref<HTMLElement>();
    const scrollSide = ref<HTMLElement>();

    return {
      scrollBody,
      scrollHeader,
      rowContainer,
      scrollSide
    }
  },
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
    /** map of custom day classes to apply to dates, eg. {'DDMMYYYY': { class: 'class name' }} */
    customDays: {
      type: Object as PropType<{ [key: string]: { class: string } }>,
      default: () => ({}),
    },
    /** 
     * Function to generate classes of body days
     */
    getClassFn: {
      type: Function as PropType<(date: Dayjs) => string|string[]>,
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
      type: Function as PropType<(date: Dayjs) => any>,
      default: (date: Dayjs) => {
        return {
          'today': date.isSame(dayjs(), 'day'),
          'start-of-month': date.date() === 1
        };
      },
    },
    /** function for date labels in body */
    getDayValueFn: {
      type: Function as PropType<(date: Dayjs) => any>,
      default: (date: Dayjs) => {
        return date.date();
      },
    },
    /** function for date labels in header */
    getDayHeaderFn: {
      type: Function as PropType<(date: Dayjs) => any>,
      default: (date: Dayjs) => {
        return date.format('dd')[0];
      },
    },
    /** enable selection of dates */
    selectionEnabled: {
      type: Boolean,
      default: true,
    }
  },
  created() {
    this.referenceDate = this.startDate;
    this.scrollableFrom = this.positionToDate(this.scrollableLeft);
    this.scrollableTo = this.positionToDate(this.scrollableRight);
  },
  mounted() {
    this.createDays();

    const { scrollLeft, clientWidth } = this.scrollBody!;
    this._updateRange(scrollLeft, scrollLeft + clientWidth);
    this.referenceScrollLeft = this.dateToPosition(this.referenceDate!);

    this.scrollBody!.addEventListener('scroll', this.onBodyScroll.bind(this));

    add_resize_listener(this.scrollBody!, () => {
      const { clientWidth, clientHeight } = this.scrollBody!;
      this.visibleWidth = clientWidth;
      this.visibleHeight = clientHeight;
    });

    setTimeout(() => {
      this.centerOn(this.startDate, 'auto');
    });

  },
  methods: {

    onBodyScroll(event: Event): void {
      const { scrollLeft, scrollTop, clientWidth } = this.scrollBody!;
      requestAnimationFrame(() => {
        this.scrollHeader!.scrollLeft = scrollLeft; // fix lagging
        this.scrollSide!.scrollTop = scrollTop;
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

      const day = target.closest<HTMLElement>('[data-day-id]');
      if (day) {
        this.$emit('day-click', {
          event,
          row: row && this.resources[+row.dataset.rowId!],
          date: day && this.days[+day.dataset.dayId!].date
        });
      }

      if (!this.selecting) {
        this.clearSelection();
      }
    },

    /**
     * start selection
     */
    onBodyMousedown(event: MouseEvent): void {

      if (!this.selectionEnabled) {
        return;
      }

      const getXY = (event: MouseEvent): { x: number, y: number } => {
        const rect = this.rowContainer!.getBoundingClientRect();
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
          for (const day of this.days) {
            if (day.left + DAY_WIDTH >= leftX && day.left <= rightX) {
              selected[day.key] = true;
            }
          }
          for (const row of this.rows) {
            if (row.top + ROW_HEIGHT >= topY && row.top <= bottomY) {
              selectedRows[row.resource.id] = true;
            }
          }

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
          if (row.top + ROW_HEIGHT >= topY && row.top <= bottomY) {
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
      const { clientWidth } = this.scrollBody!;
      const left = this.dateToPosition(date);
      this.scrollBody!.scrollTo({
        left: left + DAY_WIDTH / 2 - clientWidth / 2.0,
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
      return this.days[ix].left;
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

      this.scrollBody!.scrollLeft += scrollableLeftChange;
      this.scrollHeader!.scrollLeft = this.scrollBody!.scrollLeft;

      this.createDays();

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
          headerClass: this.getHeaderClassFn(current),
          class: this._getDateClass(current),
          left
        };

        this.days.push(day);
        left += DAY_WIDTH;
        current = current.add(1, 'day');
      }
    },

    _getDateClass(date: Dayjs): string {
      const classes: string[] = [];
      const key = this.getKey(date);
      const customDay = this.customDays[key];
      if (customDay) {
        classes.push(customDay.class);
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
      return value.format('DDMMYYYY');
    },

    _getDateClasses(row: Resource, day: Day): any {
      return (this.classes[row.id][day.key] || '') + (day.class ? ' ' + day.class : '');
    }

  },
  computed: {
    dateFormat() {
      return (date: Dayjs, format: string) => {
        return date.format(format);
      };
    },
    classes() {
      const value = this.resources as Resource[];
      const _classes: { [rowId: number]: any } = {};
      for (const row of value) {
        _classes[row.id] = {};
        if (row.days) {
          for (const day of row.days) {
            const key = this.getKey(day.date);
            _classes[row.id][key] = day.class;
          }
        }
      }
      return _classes;
    },
    rows() {
      const resources = this.resources as Resource[];
      const _rows: Row[] = [];
      let top = 0;
      for (const resource of resources) {
        _rows.push({
          resource,
          top
        });
        top += ROW_HEIGHT;
      }
      return _rows;
    },
    rowContainerHeight() {
      return this.rows.length * ROW_HEIGHT;
    },
    rightScrollbarVisible() {
      return this.rowContainerHeight > this.visibleHeight;
    }
  },
  data() {
    return {
      days: [] as Day[],
      from: null as any,
      to: null as any,

      selected: {} as { [key: string]: boolean },
      selectedRows: {} as { [key: string]: boolean },

      today: dayjs(),
      referenceDate: null as Dayjs | null,
      referenceScrollLeft: 0,
      scrollableFrom: null as Dayjs | null,
      scrollableTo: null as Dayjs | null,
      scrollableLeft: -1200,
      scrollableRight: 1200,
      scrollableLeftThreshold: null as unknown as number,
      scrollableRightThreshold: null as unknown as number,

      checkScrollableThresholdHit: debounce(this._checkScrollableThresholdHit.bind(this), 250),
      updateRange: throttle(this._updateRange.bind(this), 250),
      selecting: false,

      visibleWidth: 0,
      visibleHeight: 0
    };
  }
});
</script>

<style scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.body {
  display: flex;
  flex-grow: 1;
  overflow: auto;
}

.main-body {
  flex: 1 1 0;
  overflow: auto;
  background-color: #fafbfb;
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

.header {
  display: flex;
}

.main-header {
  display: flex;
  flex: 1 1 0;
  overflow: hidden;
  height: 40px;
}

.hp-header-scroller {
  display: flex;
  overflow: hidden;
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

  cursor: pointer;
  color: #cc6799;
  font-weight: 500;

  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease-out;
}

.day-main {
  flex: 0 0 40px;
  height: 40px;

  cursor: pointer;
  color: #676565;
}

.row {
  height: 70px;
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
}

.card .avatar {
  height: 56px;
  width: 56px;
  border-radius: 50%;
  margin-right: 20px;
}

.card .title {
  margin-bottom: 4px;
  font-weight: 500;
  color: #333333;
}

.card .subtitle {
  color: #8c8c8c;
}

.card .title,
.card .subtitle {
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

.selected > .day-content {
  background: #87b8e982;
  color: white;
}

.selected > .day-content:hover {
  background: #5b99d682;
  color: white;
}
</style>
