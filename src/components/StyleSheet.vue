<template>
  <v-main class="pannel-area">
    <div ref="pannel" class="pannel"></div>
  </v-main>
</template>

<script>
import { Graph } from '@graph';
import { mxClient, mxGraphModel, mxRubberband, mxUtils } from 'mxgraph/javascript/mxClient';
export default {
  name: 'HelloWorld',
  data: () => ({
    browserError: false
  }),
  mounted() {
    this.initPannel();
  },
  methods: {
    initPannel() {
      var container = this.$refs.pannel;
      // 检查浏览器是否支持
      if (!mxClient.isBrowserSupported()) {
        // 如果不支持显示错误信息
        mxUtils.error('Browser is not supported!', 200, false);
      }

      // 容器初始化，构造一个图标模型
      var model = new mxGraphModel();
      // 创建一个图标的dom
      this._graph = new Graph(container, model);
      // 渲染的时候使用html标签
      this._graph.setHtmlLabels(true);
      // 可改变连接两个图
      this._graph.setConnectable(true);

      new mxRubberband(this._graph);
      // 获取当前图的父节点
      var parent = this._graph.getDefaultParent();
      // 在beginUpdate和endUpdate之间做的改变，在视图上是异步改变的，一般在有多次绘图过程前后使用
      model.beginUpdate();
      try {
        var v1 = this._graph.insertVertex(parent, null, 'Hello,Hello,Hello,Hello,Hello,Hello,Hello,Hello,Hello,Hello,Hello,', 20, 20, 80, 30, 'node'); //创建第一个节点
        var v2 = this._graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30, 'node'); //创建第二个节点

        var v3 = this._graph.insertVertex(parent, null, 'new', 280, 60, 80, 30, 'node');

        this._graph.insertEdge(parent, null, '', v1, v2); //创建连线

        let e1 = this._graph.insertEdge(parent, null, '30%', v2, v3);
        // 通过(x, y)来相对定位边的label, x=0表示label位于线段的中间，而x=-1表示label位于线段的左端，x=1表示label位于右端。y表示垂直于直线的方向的位置
        e1.geometry.x = 0;
        e1.geometry.y = 20;
      } finally {
        // Updates the display
        model.endUpdate();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.pannel-area {
  // background-color: pink;
  overflow: hidden;
  // width: 100%;
  height: 100%;
  background: url('../assets/mxgraph/images/grid.gif');
  padding: 0 !important;

  .pannel {
    width: 100%;
    height: 100%;
  }
}
</style>
