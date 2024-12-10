<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>
  
  <script>
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
  name: "LineChart",
  props: {
    chartType: {
      type: Object, // Isso deve ser uma String, não um Object.
      required: true,
    },
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      chartInstance: null,
    };
  },
  mounted() {
    this.createLineChart();
  },
  beforeUnmount() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  },
  methods: {
    createLineChart() {
      const ctx = this.$refs.chartCanvas.getContext("2d");
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      this.chartInstance = new Chart(ctx, {
        type: this.chartType,
        data: this.chartData,
        options: this.chartOptions,
      });
    },
  },
};
</script>
  