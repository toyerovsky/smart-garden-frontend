<template>
  <v-container>
    <canvas v-show="false" ref="canvas"/>

    <v-row class="text-center">
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Inteligentny ogród - Pomiary
        </h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-menu
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
                clearable
                @click:clear="clear"
                v-model="dateRangeText"
                label="Data pomiaru"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
              ref="picker"
              range
              @input="refreshDate"
              locale="pl-PL"
              v-model="filter.range"
              min="2020-01-01"
          ></v-date-picker>
        </v-menu>
      </v-col>
    </v-row>

    <v-row class="text-center">
      <v-col>
        <v-data-table
            @update:options="refreshOptions"
            locale="pl-PL"
            :headers="headers"
            :items="measurements"
            class="elevation-1"
            :loading="loading"
            loading-text="Ładowanie... Proszę czekać"
            :options.sync="options"
            :server-items-length="total"
            no-data-text="Brak pomiarów do wyświetlenia"
        >
          <template v-slot:item.measurementDate="{ item }">
            {{ item.date }}
          </template>

        </v-data-table>
      </v-col>
    </v-row>

    <v-row class="text-center">
      <v-col>
        <measurement-chart :chart-data="measurementChartData"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MeasurementService from "@/services/MeasurementService";
import MeasurementChart from "@/components/MeasurementChart";
import moment from "moment";

export default {
  name: 'Index',
  components: {MeasurementChart},
  data() {
    return {
      loading: true,
      headers: [
        {text: 'Czas pomiaru', value: 'date',},
        {text: 'Temperatura powietrza (°C)', value: 'airTemperature', align: 'center'},
        {text: 'Wilgoność powietrza (%)', value: 'airHumidity', align: 'center'},
        {text: 'Wilgotność gleby (%)', value: 'soilMoisture', align: 'center'},
      ],
      measurements: [],
      measurementChartData: [],
      options: {
        itemsPerPage: 5,
        page: 1
      },
      filter: {
        range: [],
        from: null,
        to: null
      },
      total: 0
    }
  },

  watch: {
    measurements() {
      this.gradient = this.$refs.canvas
          .getContext("2d")
          .createLinearGradient(0, 0, 0, 450);
      this.gradient2 = this.$refs.canvas
          .getContext("2d")
          .createLinearGradient(0, 0, 0, 450);

      this.gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
      this.gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
      this.gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

      this.gradient2.addColorStop(0, "rgba(0, 231, 255, 0.9)");
      this.gradient2.addColorStop(0.5, "rgba(0, 231, 255, 0.25)");
      this.gradient2.addColorStop(1, "rgba(0, 231, 255, 0)");

      this.measurementChartData = {
        labels: [...this.measurements.map(x => x.date)],

        datasets: [{
          label: 'Temperatura powietrza (°C)',
          borderColor: "#FC2525",
          pointBackgroundColor: "white",
          borderWidth: 1,
          pointBorderColor: "white",
          backgroundColor: this.gradient,
          data: [...this.measurements.map(x => x.airTemperature)]
        },
          {
            label: 'Wilgoność powietrza (%)',
            borderColor: "#FC2525",
            pointBackgroundColor: "white",
            borderWidth: 1,
            pointBorderColor: "white",
            backgroundColor: this.gradient,
            data: [...this.measurements.map(x => x.airHumidity)]
          },

          {
            label: 'Wilgotność gleby (%)',
            borderColor: "#05CBE1",
            pointBackgroundColor: "white",
            borderWidth: 1,
            pointBorderColor: "white",
            backgroundColor: this.gradient2,
            data: [...this.measurements.map(x => x.soilMoisture)]
          }]
      }
    }
  },

  computed: {
    dateRangeText() {
      return this.filter.range.join(' ~ ')
    }
  },

  methods: {
    refreshOptions(newVal) {
      this.loadData(this.filter, newVal);
    },

    refreshDate() {
      if (this.filter.range.length === 0) {
        this.filter.from = null;
        this.filter.to = null;
      } else if (this.filter.range.length === 1) {
        this.filter.from = this.filter.range[0];
        this.filter.to = this.filter.range[0];
      } else if (this.filter.range.length === 2) {
        this.filter.from = this.filter.range[0];
        this.filter.to = this.filter.range[1];
      }

      this.loadData(this.filter, this.options);
    },

    clear() {
      this.filter.range = [];

      this.refreshDate();
    },

    async loadData(filter, options) {
      let response = await MeasurementService.getMeasurements(filter, options);

      if (response && response.status === 200) {
        let data = response.data.data;

        data.forEach(x => {
          x.date = moment(x.date).format('DD MMMM YYYY HH:mm:ss');
        });

        this.measurements = data;
        this.total = response.data.totalCount;
      }

      this.loading = false;
    }
  }
}
</script>
