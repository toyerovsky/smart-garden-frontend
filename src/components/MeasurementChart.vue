<script>
import {Line, mixins} from 'vue-chartjs'

const {reactiveProp} = mixins

export default {
  extends: Line,
  name: "MeasurementChart",
  mixins: [reactiveProp],
  data() {
    return {
      gradient: null,
      gradient2: null,

      options: {responsive: true, maintainAspectRatio: false}
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.options);
  }
}
</script>
