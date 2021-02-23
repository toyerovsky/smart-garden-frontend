<template>
  <v-app>
    <v-app-bar
        app
        color="secondary"
        dark
    >
      <span style="width: 100%" class="text-center font-weight-bold ">Inteligentny ogród - Pomiary</span>

      <v-spacer></v-spacer>

    </v-app-bar>

    <v-main>
      <Index/>
    </v-main>
  </v-app>
</template>

<script>
import Index from './components/Index';

export default {
  name: 'App',

  components: {
    Index,
  },

  data: () => ({
    //
  }),
};
</script>
