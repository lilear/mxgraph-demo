<template>
  <v-container>
    <v-row>
      <div ref="pannel" class="pannel-area"></div>
      <v-col align="center" justify="center">
        <v-card class="mx-auto" width="400" min-height="200" shaped>
          {{ this.xml }}
        </v-card>
        <v-btn class="ma-2" color="secondary" @click="getXml">
          get Xml
        </v-btn>
      </v-col>
      <v-snackbar v-model="browserError" absolute centered color="orange" text timeout="-1" transition="scale-transition">
        <v-icon color="orange">warning</v-icon>
        error,Browser is not supported!
        <template v-slot:action="{ attrs }">
          <v-btn color="orange" text v-bind="attrs" @click="browserError = false">
            <v-icon>close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </v-row>
  </v-container>
</template>

<script>
import mxgraph from '@graph';
const { mxClient, mxGraphModel, mxGraph, mxUtils, mxCodec } = mxgraph;
export default {
  name: 'GraphToXml',
  data: () => ({
    browserError: false,
    xml: ''
  }),
  mounted() {
    this.init();
  },
  methods: {
    init() {
      var container = this.$refs.pannel;
      // mxClient 查询相应的系统信息
      if (!mxClient.isBrowserSupported()) {
        // mxUtils.error('Browser is not supported!', 200, false);
        this.browserError = true;
        return;
      }

      var model = new mxGraphModel();
      this._graph = new mxGraph(container, model);

      var parent = this._graph.getDefaultParent();
      model.beginUpdate();
      try {
        var v1 = this._graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30, 'node');
        var v2 = this._graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
        this._graph.insertEdge(parent, null, '80%', v1, v2);
      } finally {
        model.endUpdate();
      }
    },
    getXml() {
      // mxUtils封装了一些常用的方法，可以返回一些已生成的图的信息
      this.xml = mxUtils.getXml(new mxCodec().encode(this._graph.getModel()));
    }
  }
};
</script>
