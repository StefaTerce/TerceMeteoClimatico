<template>
  <div class="container">
    <label for="city-select" class="label">Seleziona una città:</label>
    <select id="city-select" v-model="selectedCity" @change="updateChart" class="select">
      <option value=""></option>
      <option v-for="city in availableCities" :key="city" :value="city">{{ city }}</option>
    </select>
    <apexchart type="line" :options="chartOptions" :series="series" />
  </div>
</template>


<script>
import * as XLSX from 'xlsx';
import VueApexCharts from 'vue3-apexcharts';

export default {
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      chartOptions: {
        chart: {
          id: 'vuechart-example'
        },
        xaxis: {
          categories: []
        },
        title: {
          text: 'Temperature'
        },
        yaxis: {
          title: {
            text: 'Temperature'
          }
        },
        stroke: {
          curve: 'smooth',
          colors: ['#ff69b4'] // Imposta il colore della linea a rosa
        }
      },
      series: [],
      allData: [], // Dati completi dal file Excel
      availableCities: [], // Città disponibili
      selectedCity: null // Città selezionata dall'utente
    };
  },
  mounted() {
    this.loadExcelFile();
  },
  methods: {
    async loadExcelFile() {
      try {
        const response = await fetch(new URL('@/assets/CopiaDati2.xlsx', import.meta.url));
        const arrayBuffer = await response.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        // Ottieni il nome del primo foglio
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Converte il foglio in un array di oggetti, saltando la prima riga
        let json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        json = json.slice(1); // Salta la prima riga

        // Trasforma l'array in un formato strutturato, ignorando le celle vuote
        const structuredData = json.map(row => ({
          citta: row[0],
          dati: row.slice(1).map((valore, index) => ({
            data: 2000 + index, // Assumi che i dati partano dall'anno 2000
            valore
          })).filter(entry => entry.valore !== null && entry.valore !== undefined && entry.valore !== '')
        })).filter(entry => entry.citta && entry.dati.length > 0); // Ignora le città vuote e i dati vuoti

        // Salva i dati in allData
        this.allData = structuredData;

        // Estrai i nomi delle città disponibili
        this.availableCities = this.allData.map(entry => entry.citta);

        // Carica i dati per la prima città disponibile se esiste
        if (this.availableCities.length > 0) {
          this.selectedCity = this.availableCities[0];
          this.updateChart();
        }
      } catch (error) {
        console.error('Errore nel caricamento del file Excel:', error);
      }
    },
    updateChart() {
      if (!this.selectedCity) return;

      // Filtra i dati in base alla città selezionata
      const selectedData = this.allData.find(entry => entry.citta === this.selectedCity);

      if (selectedData) {
        // Trova le temperature sotto 50 gradi
        const temperatures = selectedData.dati.map(data => data.valore).filter(temp => temp < 50);

        // Estrai gli anni dalle date disponibili
        const years = selectedData.dati.map(data => data.data);

        // Aggiorna il grafico con gli anni come categorie sull'asse x e i dati delle temperature
        this.chartOptions.xaxis.categories = years;
        this.series = [{
          name: 'Temperature',
          data: temperatures
        }];
      }
    }
  }
};

</script>

<style scoped>
.container {
  text-align: center;
}

.label {
  font-size: 20px;
}

.select {
  width: 300px;
  height: 40px;
  font-size: 16px;
  margin-top: 10px;
}
</style>

