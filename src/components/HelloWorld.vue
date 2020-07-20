<template>
  <v-container>
    <v-row class="text-center">
      <div ref="pannel" class="pannel-area"></div>
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
import { mxGraphModel as MxGraphModel, mxGraph as MxGraph, mxClient as MxClient } from 'mxgraph/javascript/mxClient';
export default {
  name: 'HelloWorld',
  data: () => ({
    browserError: false
  }),
  mounted() {
    this.init();
  },
  methods: {
    init() {
      var container = this.$refs.pannel;

      if (!MxClient.isBrowserSupported()) {
        this.browserError = true;
        return;
      }

      // 容器初始化，构造一个图标模型
      var model = new MxGraphModel();
      // 创建一个图标的dom
      this._graph = new MxGraph(container, model);
      // 获取当前图的父节点
      var parent = this._graph.getDefaultParent();
      // 在beginUpdate和endUpdate之间做的改变，在视图上是异步改变的，一般在有多次绘图过程前后使用
      model.beginUpdate();
      try {
        var v1 = this._graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30); //创建第一个节点
        var v2 = this._graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30); //创建第二个节点

        this._graph.insertEdge(parent, null, '', v1, v2); //创建连线
      } finally {
        // Updates the display
        model.endUpdate();
      }
    }
  }
};
</script>
