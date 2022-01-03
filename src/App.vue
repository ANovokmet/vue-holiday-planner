<template>
  <ResourceView
    :resources="rows"
    @header-click="onHeaderClick"
    @row-click="onRowClick"
    @day-click="onDayClick"
    @selection-end="onSelectionEnd"
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
 
  </ResourceView>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ResourceView from "./components/ResourceView.vue";
import dayjs from "dayjs";

function generateRows() {
  const startOfYear = dayjs().startOf("year");
  function rnd() {
    return startOfYear.add(Math.floor(Math.random() * 365), "day");
  }

  const colors = ["orange", "green", "purple"];
  const rows: any[] = [
    {
      id: 1,
      title: "Krystalle Logie",
      subtitle: "Senior Sales Associate",
      img: "assets/woman1.jpg",
      days: [],
    },
    {
      id: 2,
      title: "Izabel Riveles",
      subtitle: "Senior Financial Analyst",
      img: "assets/woman2.jpg",
      days: [],
    },
    {
      id: 3,
      title: "Rancell Qualtrough",
      subtitle: "Information Systems Manager",
      img: "assets/man2.jpg",
      days: [],
    },
    {
      id: 4,
      title: "Pearle Vowels",
      subtitle: "Recruiter",
      img: "assets/man1.jpg",
      days: [],
    },
    {
      id: 5,
      title: "Marysa Rable",
      subtitle: "VP Product Management",
      img: "assets/woman3.jpg",
      days: [],
    },
  ];

  for (let i = 0; i < 5; i++) {
    const days = [];
    for (let j = 0; j < 24; j++) {
      const duration = Math.floor(Math.random() * 5);
      const classes = colors[j % 3];

      let d = rnd();
      for (let k = 0; k < duration; k++) {
        days.push({
          date: d,
          class: classes,
        });
        d = d.add(1, "day");
      }
    }
    rows[i].days = days;
  }
  return rows;
}

export default defineComponent({
  name: "App",
  components: {
    ResourceView,
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
    };
  },
});
</script>

<style>
</style>
