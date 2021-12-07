<template>
  <canvas id="myChart"></canvas>
</template>

<script>
import { Chart, registerables } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
Chart.register(...registerables)

export default {
  name: 'HistoryChart',
  props: {
    historyData: {
      type: Array,
      required: true
    },
    labels: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    historyData: {
      handler(val) {
        val && this.$nextTick(this.makeChart)
      },
      immediate: true
    }
  },
  methods: {
    makeChart() {
      if (this.chart) {
        this.chart.destroy()
      }
      const ctx = document.getElementById('myChart').getContext('2d')
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.labels,
          datasets: [
            {
              data: this.historyData,
              borderWidth: 2,
              borderColor: 'rgb(50, 100, 200)',
              tension: 0.3
            }
          ]
        },
        plugins: [ChartDataLabels],
        options: {
          scales: {
            y: {
              beginAtZero: true,
              min: Math.min(...this.historyData) * 0.9,
              max: Math.max(...this.historyData) * 1.1
            }
          },
          plugins: {
            legend: {
              display: false
            },
            datalabels: {
              rotation: -30,
              align: 'end',
              offset: 3
            }
          }
        }
      })
    }
  }
}
</script>
