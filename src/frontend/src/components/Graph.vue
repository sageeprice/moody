<script>
import { Line, mixins } from 'vue-chartjs'

export default {
  extends: Line,
  name: 'line-graph',
  mixins: [ mixins.reactiveProp ],
  props: {
    chartData: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null,
      responsive: true
    },
  },
  mounted() {
    this.renderChart(this.chartData, {
    scales: {
      yAxes: [{
        ticks: {
          min: 1,
          max: 9,
        }
      }]
    }
  })
  }
}
</script>

<style scoped>
</style>