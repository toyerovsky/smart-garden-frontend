<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Inteligentny ogród - Pomiary
        </h1>
      </v-col>
    </v-row>

    <v-row class="text-center">
      <v-col class="mb-4">
      <v-data-table
          :headers="headers"
          :items="measurements"
          :items-per-page="5"
          class="elevation-1"
          :loading="loading"
          loading-text="Ładowanie... Proszę czekać"
      >
        <template v-slot:item.measurementDate="{ item }">
            {{ item.measurementDate | dateTime }}
        </template>

      </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MeasurementService from "@/services/MeasurementService";

export default {
  name: 'Index',

  data() {
    return {
      loading: true,
      headers: [
        { text: 'Czas pomiaru', value: 'measurementDate',  },
        { text: 'Temperatura powietrza (°C)', value: 'airTemperature', align: 'center' },
        { text: 'Wilgoność powietrza (%)', value: 'airHumidity', align: 'center' },
        { text: 'Wilgotność powietrza (%)', value: 'soilMoisture', align: 'center' },
      ],
      measurements: []
    }
  },

  async mounted() {
    let response = await MeasurementService.getMeasurements();

    if (response && response.status === 200) {
      this.measurements = response.data.data;
    }

    this.loading = false;
  }
}
</script>
