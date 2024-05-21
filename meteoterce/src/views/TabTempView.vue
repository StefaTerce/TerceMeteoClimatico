<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <v-typography variant="h4" class="my-4">
          Tabella Media Temperature Annue
        </v-typography>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-table v-if="jsonData.length">
          <thead>
            <tr>
              <th v-for="(value, key) in jsonData[0]" :key="key">{{ key }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in jsonData" :key="index">
              <td v-for="(value, key) in row" :key="key">{{ value }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as XLSX from 'xlsx';

export default {
  name: 'tabellatempView',
  data() {
    return {
      jsonData: []
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
        
        this.jsonData = json;
        
        // Visualizza array di elementi nella console
        console.log('Array di elementi:', this.jsonData);
      } catch (error) {
        console.error('Error loading Excel file:', error);
      }
    }
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f2f2f2;
  text-align: left;
  font-weight: bold;
}
</style>
