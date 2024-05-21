<template>
  <v-app>
    <v-navigation-drawer app v-model="drawer" color="blue">
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" link :to="item.route" @click="closeDrawer">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="blue" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Terce Meteo Dati</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      items: [
        { text: 'Grafico', icon: 'mdi-chart-line', route: '/grafico' },
        { text: 'Tabella', icon: 'mdi-table', route: '/tabella' },
      ]
    }
  },
  methods: {
    closeDrawer() {
      this.drawer = false;
    }
  }
}
</script>

<style>
/* Add your custom styles here */
</style>
