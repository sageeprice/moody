<template>
  <div class="moody">
    <div id="input-fields">
      <input type="date" v-model="start"/>
      <input type="date" v-model="end" />
      <button v-on:click="loadDates(start, end)">Request date range</button>
    </div>
    <div class="graph-wrapper">
      <line-graph class="inner-graph" v-bind:chartData="{
          labels: dates,
          datasets: [
            {
              label: 'Daily Rating',
              data: ratings,
              borderColor: 'rgba(50, 115, 220, 0.5)',
              backgroundColor: 'rgba(50, 115, 220, 0.1)',
            },
            {
              label: 'Trailing Seven Day Average',
              data: trailingDARatings,
              borderColor: 'rgba(255, 56, 96, 0.5)',
              backgroundColor: 'rgba(255, 56, 96, 0.1)',
            }
          ]
        }"
        :height=500
        :width=1000
      />
    </div>
    <div class="bar-graph-wrapper">
      <bar-graph class="inner-graph" v-bind:chartData="{
          labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          datasets: [
            {
              label: 'Average Rating by Day',
              data: weekdayAverages,
              borderWidth: 2,
              borderColor: 'rgba(255, 56, 96, 0.5)',
              backgroundColor: 'rgba(255, 56, 96, 0.1)',
            },
          ]
        }"
        :height=500
        :width=1000
      />
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import LineGraph from './Graph.vue'
  import BarGraph from './BarGraph.vue'

  export default {
    name: 'MoodDisplay',
    components: {
      LineGraph,
      BarGraph,
    },
    // Internally accessible values
    data() {
      return {
        reports: [],
        dates: [],
        ratings: [],
        trailingDARatings: [],
        weekdayAverages: [],
        // Reactive values must be initialized
        start: this.getDateOneMonthAgo(),
        end: this.getTomorrow()
      }
    },
    methods: {
      /**
       * @desc Loads mood reports via AJAX call.
       */
       loadDates(startDate, endDate) {
        axios.get(`https://v6svfx4869.execute-api.us-east-1.amazonaws.com/prod?startDate=${startDate}&endDate=${endDate}`)
          .then(r => {
            this.reports = r.data
            this.dates = r.data.map(d => d['Day'])
            this.ratings = r.data.map(d => d['MoodRating'])
            this.trailingDARatings = this.generateTrailingAvgs(this.ratings)
            this.weekdayAverages = this.getByDayRatings(r.data)
          })
      },
      generateTrailingAvgs(ratings) {
        const avgs = []
        const last7 = []
        ratings.forEach(r => {
          last7.push(r)
          if (last7.length > 7) {
            last7.shift()
          }
          const a = last7.reduce((a, s) => a + s, 0) / last7.length
          avgs.push(a)
        })
        return avgs
      },
      getByDayRatings(reports) {
        const dayBuckets = [[], [], [], [], [], [], []]
        reports.forEach(r => {
          dayBuckets[r['WeekdayNumber']].push(r['MoodRating'])
        })
        return dayBuckets.map(l => l.reduce((r, s) => r + s) / l.length)
      },
      getDateOneMonthAgo() {
        const date = new Date()
        // Not good but imprecision is fine here.
        date.setMonth(date.getMonth() - 1)
        // s/o to stackoverflow
        return date.toISOString().split('T')[0]
      },
      getTomorrow() {
        const date = new Date()
        date.setDate(date.getDate() + 1)
        // s/o to stackoverflow
        return date.toISOString().split('T')[0]
      }
    },
    mounted() {
      this.loadDates(this.getDateOneMonthAgo(), this.getTomorrow())
    },
  }
</script>

<style scoped>
  /* Hide the clear button for date inputs. */
  input[type="date"]::-webkit-clear-button {
    display: none;
  }
  /* Match the fonts of the rest of the page. */
  input[type="date"] {
    font-family: 'Avenir', 'Helvetica', Arial, sans-serif;
    font-size: 16px;
  }
  .graph-wrapper {
    width: 50%;
    margin: auto;
  }
  .bar-graph-wrapper {
    width: 50%;
    margin: auto;
  }
</style>