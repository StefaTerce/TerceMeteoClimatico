<template>
  <div>
    <apexchart type="line" :options="chartOptions" :series="chartSeries" />
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import VueApexCharts from 'vue3-apexcharts';

export default {
  name: 'tabellatempView',
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      jsonData: [],
      chartOptions: {
        chart: {
          type: 'line',
          height: 350,
          zoom: {
            enabled: false
          }
        },
        title: {
          text: 'Temperature Trends',
          align: 'left'
        },
        xaxis: {
          type: 'category',
          categories: [],
          title: {
            text: 'Year'
          },
          labels: {
            show: true,
            rotate: 0,
            formatter: function(val) {
              return val;
            }
          }
        },
        yaxis: {
          title: {
            text: 'Temperature (°C)'
          }
        }
      },
      chartSeries: []
    };
  },
  mounted() {
    this.loadExcelFile();
  },
  methods: {
    async loadExcelFile() {
      try {
        const response = await fetch(new URL('@/assets/CopiaDati1.xlsx', import.meta.url));
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        let json = XLSX.utils.sheet_to_json(worksheet);
        
        // Rimuovi intestazioni vuote
        json = json.filter(row => Object.values(row).some(cell => cell !== ''));

        // Estrai gli anni e le temperature
        const years = [];
        const temperatures = [];
        Object.keys(json[0]).forEach(key => {
          if (key !== 'COMUNE') {
            years.push(key);
            temperatures.push(parseFloat(json[0][key]));
          }
        });

        // Aggiorna le categorie sull'asse x
        this.chartOptions.xaxis.categories = years;

        // Aggiorna la serie del grafico
        this.chartSeries = [{
          name: 'Temperature',
          data: temperatures
        }];

        // Visualizza array di elementi nella console
        console.log('Array di elementi:', json);
      } catch (error) {
        console.error('Error loading Excel file:', error);
      }
    }
  }
};
</script>

<style scoped>
/* Stili personalizzati se necessario */
</style>
