<template>
  <v-app id="inspire">
    <v-app-bar app clipped-left color="orange">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <span class="title ml-3 mr-5">mxGraph&nbsp;<span class="font-weight-light">demo</span></span>
      <v-text-field solo-inverted flat hide-details label="Search" prepend-inner-icon="search"></v-text-field>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app clipped color="grey lighten-4">
      <v-list dense class="grey lighten-4">
        <template v-for="(item, i) in items">
          <v-row v-if="item.heading" :key="i" align="center">
            <v-col cols="6">
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-col>
            <v-col cols="6" class="text-right">
              <v-btn small text>edit</v-btn>
            </v-col>
          </v-row>
          <v-divider v-else-if="item.divider" :key="i" dark class="my-4"></v-divider>
          <v-list-item v-else :key="i" link :to="{ name: item.link }">
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="grey--text">
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'Home',

  components: {},

  data: () => ({
    drawer: null,
    items: [
      { icon: 'account_balance', text: 'Hello world', link: 'HelloWorld' },
      { icon: 'import_export', text: 'Graph to xml', link: 'GraphToXml' },
      { icon: 'style', text: 'Style sheet', link: 'StyleSheet' },
      { icon: 'view_quilt', text: 'Html Toolbar', link: 'HtmlToolbar' },
      { icon: 'view_quilt', text: 'Shape Toolbar', link: 'ShapeToolbar' },
      { icon: 'edit', text: 'Edit Node', link: 'EditNode' }
    ]
  })
};
</script>

<style>
#keep .v-navigation-drawer__border {
  display: none;
}
</style>
