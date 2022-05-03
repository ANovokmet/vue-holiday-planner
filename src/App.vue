<template>
  <HolidayPlanner
    :resources="rows"
    :infiniteScroll="true"
    :customDays="customDays"
    :startDate="startDate"
    @header-click="onHeaderClick"
    @row-click="onRowClick"
    @day-click="onDayClick"
    @selection-end="onSelectionEnd"
    class="holiday-planner"
  >    
  <!-- Custom row template -->
  <!--   
  <template v-slot:row-header="{ row }">
      <div >Row:{{row.title}}</div>
  </template>
  -->
 
  <!-- Custom title template -->
  <!--   
  <template  v-slot:title="{ from, to }">
      <div >From:{{from && from.format('MMM D. YYYY')}}, To:{{to && to.format('MMM D. YYYY')}}</div>
  </template>  
  -->
  </HolidayPlanner>
</template>

<script lang="ts">
import Vue from 'vue';
import HolidayPlanner from "./components/HolidayPlanner.vue";
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

function generateRows() {
  const startOfYear = dayjs().startOf("year");
  function randomDate() {
    return startOfYear.add(Math.floor(Math.random() * 365), "day");
  }

  const colors = ['toovoimetus', 'kodukontor', 'puhkus', 'lahetus', 'koolitused', 'kontor'];
  const templateRows: any[] = [
    {
      title: "Krystalle Logie",
      subtitle: "Senior Sales Associate",
      img: "assets/woman1.jpg",
    },
    {
      title: "Izabel Riveles",
      subtitle: "Senior Financial Analyst",
      img: "assets/woman2.jpg",
    },
    {
      title: "Rancell Qualtrough",
      subtitle: "Information Systems Manager",
      img: "assets/man2.jpg",
    },
    {
      title: "Pearle Vowels",
      subtitle: "Recruiter",
      img: "assets/man1.jpg",
    },
    {
      title: "Marysa Rable",
      subtitle: "VP Product Management",
      img: "assets/woman3.jpg",
    },
  ];

  const rows: any[] = [];
  for (let i = 0; i < 10; i++) {
    const row = {
      ...templateRows[i % templateRows.length],
      id: i,
      days: [],
    };
    const days = [];
    for (let j = 0; j < 24; j++) {
      const duration = Math.floor(Math.random() * 5);
      const classes = colors[j % colors.length];

      let date = randomDate();
      days.push({
        startDate: date,
        endDate: date.add(duration, 'day'),
        class: classes,
        // style: {
        //   backgroundColor: "#3f51b5",
        //   color: "white",
        // },
      });
    }
    row.days = days;
    rows.push(row);
  }
  return rows;
}

export default Vue.extend({
  name: "App",
  components: {
    HolidayPlanner,
  },
  methods: {
    onHeaderClick(e: any) {
      console.log("header click", e);
    },
    onRowClick(e: any) {
      console.log("row click", e);
    },
    onDayClick(e: any) {
      console.log("day click", e);
    },
    onSelectionEnd(e: any) {
      console.log("selection end", e);
    },
  },
  data() {
    return {
      rows: generateRows(),
      customDays: [
        {
          date: dayjs('2022-02-01'),
          // headerClass: 'circle circle-orange', // 
          class: 'public-holiday'
        }
      ],
      startDate: dayjs('2022-02-01')//dayjs().startOf('isoWeek'),
    };
  },
});
</script>

<style>
.holiday-planner {
  height: 600px;
}
</style>
