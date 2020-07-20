<template>
  <div class="custom-tool-bar-container">
    <div class="custom-toolbar-container">
      <ul>
        <li v-for="item in toolbarItems" :key="item['title']" ref="toolItem">
          <img :src="item['icon']" :alt="item['title']" />
          <span>{{ item['title'] }}</span>
        </li>
      </ul>
    </div>
    <div class="_graph-container" ref="container"></div>
  </div>
</template>

<script>
import { toolbarItems } from './toolbar';
import { mxEvent, mxUtils } from 'mxgraph/javascript/mxClient';
import { Graph } from '@graph';

export default {
  name: 'index2',
  computed: {
    toolbarItems: () => toolbarItems
  },
  methods: {
    createGraph() {
      this._graph = new Graph(this.$refs.container);
    },
    initGraph() {
      if (this.R.isNil(this._graph)) {
        return;
      }
      this._graph.addListener(mxEvent.DOUBLE_CLICK, (_graph, evt) => {
        // 监听双击事件
        const cell = this.R.pathOr([], ['properties', 'cell'], evt);
        console.info(cell); // 在控制台输出双击的cell
      });
      this._graph.addListener(mxEvent.SIZE, (_graph, evt) => {
        console.log(_graph.graphHandler, evt);
      });
    },
    addCell(toolItem, x, y) {
      const { width, height, icon, title } = toolItem;
      const styleObj = toolItem['style'];
      const style = Object.keys(styleObj)
        .map((attr) => `${attr}=${styleObj[attr]}`)
        .join(';');
      const htmlStr = `<div><img src="${icon}" style="width: 100%; height: 100%" /><p style="padding: 0;margin: 0;">${title}</p></div>`;
      const parent = this._graph.getDefaultParent();

      this._graph.getModel().beginUpdate();
      try {
        let vertex = this._graph.insertVertex(parent, null, htmlStr, x, y, width, height, 'node;' + style);

        vertex.title = toolItem['title'];
      } finally {
        this._graph.getModel().endUpdate();
      }
    },
    initButtons() {
      const domArray = this.$refs.toolItem;
      if (!(domArray instanceof Array) || domArray.length <= 0) {
        return;
      }
      domArray.forEach((dom, domIndex) => {
        const toolItem = this.toolbarItems[domIndex];
        const { width, height } = toolItem;
        const dropHandler = (_graph, evt, cell, x, y) => {
          this.addCell(toolItem, x, y);
        };
        const createDragPreview = () => {
          const elt = document.createElement('div');
          elt.style.border = '2px dotted black';
          elt.style.width = `${width}px`;
          elt.style.height = `${height}px`;
          return elt;
        };
        mxUtils.makeDraggable(dom, this._graph, dropHandler, createDragPreview(), 0, 0, false, true);
      });
    }
  },
  mounted() {
    this.createGraph();
    this.initGraph();
    this.initButtons();
  }
};
</script>

<style lang="scss">
.custom-tool-bar-container {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  .custom-toolbar-container {
    flex: 1;
    font-size: 20px;
    background: #efefef;
    text-align: center;
    padding-top: 20px;
    ul {
      padding: 0;
      margin: 0;
      li {
        list-style: none;
        margin-bottom: 10px;
        cursor: pointer;
        img {
          width: 15px;
          height: 15px;
        }
        span {
          margin-left: 15px;
        }
      }
    }
  }
  ._graph-container {
    position: relative;
    flex: 7;
    background: url('../../assets/mxgraph/images/grid.gif');
  }
}
</style>
