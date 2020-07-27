<template>
  <div ref="graphContainer" class="graphContainer"></div>
</template>

<script>
import { toolbarItems } from './toolbar';
import { Graph } from '@graph';
import {
  mxCell as MxCell,
  mxGeometry as MxGeometry,
  mxToolbar as MxToolbar,
  mxEvent as MxEvent,
  mxUtils as MxUtils
} from 'mxgraph/javascript/mxClient';
export default {
  name: 'EditNode',
  mounted() {
    this.initGraph();
    this.inintToolBar();
  },
  methods: {
    initGraph() {
      const container = document.createElement('div');
      this.$refs.graphContainer.appendChild(container);
      container.className = 'container';

      this._graph = new Graph(container);
    },
    inintToolBar() {
      const tbContainer = document.createElement('div');
      this.$refs.graphContainer.appendChild(tbContainer);
      tbContainer.className = 'tbContainer';

      let toolbar = new MxToolbar(tbContainer);
      toolbar.enabled = false;

      let addVertex = (icon, w, h, style) => {
        let vertex = new MxCell(null, new MxGeometry(0, 0, w, h), style);

        vertex.setVertex(true);
        let img = this.addToolbarItem(this._graph, toolbar, vertex, icon);
        // 左侧toolbar是否可选
        img.enabled = true;
        this._graph.getSelectionModel().addListener(MxEvent.CHANGE, () => {
          let tmp = this._graph.isSelectionEmpty();
          MxUtils.setOpacity(img, tmp ? 100 : 20);
          img.enabled = tmp;
        });
      };
      toolbarItems.map((item) => {
        addVertex(item.icon, item.width, item.height, item.style);
      });
    },
    addToolbarItem(graph, toolbar, prototype, image) {
      let funct = function(graph, evt, cell, x, y) {
        graph.stopEditing(false);
        let vertex = graph.getModel().cloneCell(prototype);

        vertex.geometry.x = x;
        vertex.geometry.y = y;

        graph.addCell(vertex);
        graph.setSelectionCell(vertex);
      };

      let img = toolbar.addMode(
        null,
        image,
        function(evt, cell) {
          let pt = this._graph.getPointForEvent(evt);

          funct(graph, evt, cell, pt.x, pt.y);
        },
        image,
        'toolbar-icon'
      );

      MxEvent.addListener(img, 'mousedown', function(evt) {
        if (img.enabled === false) {
          MxEvent.consume(evt);
        }
      });

      let createDragPreview = () => {
        const elt = document.createElement('div');
        elt.style.border = '2px dotted black';
        elt.style.width = `${prototype.geometry.width}px`;
        elt.style.height = `${prototype.geometry.height}px`;
        return elt;
      };
      MxUtils.makeDraggable(img, graph, funct, createDragPreview());
      return img;
    }
  }
};
</script>

<style lang="scss">
.graphContainer {
  width: 100%;
  height: 100%;

  .container {
    position: absolute;
    overflow: hidden;
    left: 60px;
    top: 0px;
    right: 0px;
    bottom: 0px;
    background: url('../../assets/mxgraph/images/grid.gif');
  }

  .tbContainer {
    width: 60px;
    padding: 2px;
    text-align: center;
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
  }

  .toolbar-icon {
    width: 40px;
    height: 40px;
  }
}
</style>
