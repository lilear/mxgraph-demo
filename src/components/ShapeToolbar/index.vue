<template>
  <div ref="container" class="shape-Container"></div>
</template>

<script>
import { Graph } from '@graph';
import {
  mxToolbar as MxToolbar,
  mxEvent as MxEvent,
  mxGraphModel as MxGraphModel,
  mxUndoManager as MxUndoManager,
  mxCell as MxCell,
  mxGeometry as MxGeometry,
  mxKeyHandler as MxKeyHandler,
  mxUtils as MxUtils
} from 'mxgraph/javascript/mxClient';

export default {
  name: 'HelloWorld',
  data() {
    return {
      model: null,
      graph: null,
      undoMng: null,
      keyHandler: null
    };
  },
  methods: {
    initGraph() {
      // 创建一个div作为graph的容器
      let container = document.createElement('div');
      container.className = 'container';
      this.$refs.container.appendChild(container);
      this.model = new MxGraphModel();
      this.graph = new Graph(container, this.model);
      this.initContentMenu();
    },
    undo() {
      if (!this.undoMng) {
        throw new Error('mxUndoManager 没有初始化');
      }
      console.info('后退的Cells', this.getUndoRedoCell());
      this.undoMng.undo();
    },
    redo() {
      if (!this.undoMng) {
        throw new Error('mxUndoManager 没有初始化');
      }
      this.undoMng.redo();
      console.info('前进的Cells', this.getUndoRedoCell());
    },
    initContentMenu() {
      this.graph.popupMenuHandler.factoryMethod = (menu /*, cell*/) => {
        menu.addItem('删除', null, () => {
          this.deleteCells({ cells: this.graph.getSelectionCells(), includeEdges: true });
        });
        menu.addSeparator();
        menu.addItem('redo', null, () => {
          this.redo();
        });
        menu.addItem('undo', null, () => {
          this.undo();
        });
      };
    },
    getUndoRedoCell() {
      let cells = [];

      if (this.undoMng) {
        let undoIndex = this.undoMng.indexOfNextAdd - 1;

        if (this.undoMng.history[undoIndex]) {
          cells = this.undoMng.history[undoIndex].changes.map((change) => {
            if (change.child) {
              return change.child;
            } else {
              return change.cell;
            }
          });
        }
      }
      return cells;
    },
    initUndoManager() {
      this.undoMng = new MxUndoManager();

      let listen = (sender, evt) => {
        this.undoMng.undoableEditHappened(evt.getProperty('edit'));
      };

      this.graph.getModel().addListener(MxEvent.UNDO, listen);
      this.graph.getView().addListener(MxEvent.UNDO, listen);
    },
    initKeyHandler() {
      if (!this.graph) {
        throw new Error('graph 没有初始化');
      }
      // 键盘事件
      this.keyHandler = new MxKeyHandler(this.graph);

      this.keyHandler.bindControlKey(46, () => {
        console.log(11);
        this.undo();
      });
      this.keyHandler.bindControlKey(89, () => {
        this.redo();
      });
    },
    findDeleteCell(cell, deleteSet) {
      deleteSet.add(cell);
      if (cell.edges) {
        cell.edges.forEach((tmpEdge) => {
          if (tmpEdge.target !== cell) {
            deleteSet.add(tmpEdge.target);
            this.findDeleteCell(tmpEdge.target, deleteSet);
          }
        })
      }
    },
    deleteCells({ cells = [], includeEdges = false, multilevel = true }) {
      if (!cells || !(cells instanceof Array)) {
        throw new Error('cells 必须是一个数组');
      }
      let tmpSet = new Set(cells);

      if (multilevel) {
        cells.forEach((cell) => {
          this.findDeleteCell(cell, tmpSet);
        });
      }
      this.graph.removeCells(Array.from(tmpSet), includeEdges);
    },
    createToolbar() {
      // 创建一个div作为toolbar的容器
      let tbContainer = document.createElement('div');
      tbContainer.className = 'tbContainer';
      this.$refs.container.appendChild(tbContainer);
      // 创建一个MxToolbar
      let toolbar = new MxToolbar(tbContainer);

      toolbar.enabled = false;

      let addVertex = (icon, w, h, style) => {
        let vertex = new MxCell(null, new MxGeometry(0, 0, w, h), style);

        vertex.setVertex(true);
        let img = this.addToolbarItem(this.graph, toolbar, vertex, icon);

        // 左侧toolbar是否可选
        img.enabled = true;
        this.graph.getSelectionModel().addListener(MxEvent.CHANGE, () => {
          let tmp = this.graph.isSelectionEmpty();
          MxUtils.setOpacity(img, tmp ? 100 : 20);
          img.enabled = tmp;
        });
      };

      addVertex(require('@assets/mxgraph/images/squre.png'), 40, 40, 'node');
      addVertex(require('@assets/mxgraph/images/round.png'), 40, 40, 'node;shape=ellipse');
      addVertex(require('@assets/mxgraph/images/oval.png'), 100, 40, 'node;shape=ellipse');
      addVertex(require('@assets/mxgraph/images/triangle.png'), 40, 40, 'node;shape=triangle;direction=north');
      addVertex(require('@assets/mxgraph/images/rhombus.png'), 40, 40, 'shape=rhombus');
      addVertex(require('@assets/mxgraph/images/cylinder.png'), 40, 40, 'shape=cylinder');
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
          let pt = this.graph.getPointForEvent(evt);

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
      MxUtils.makeDraggable(img, graph, funct);
      return img;
    }
  },
  mounted() {
    this.initGraph();
    this.createToolbar();
    this.initUndoManager(); // 初始化undo/redo
    this.initKeyHandler(); // 初始化键盘事件
  }
};
</script>

<style lang="scss">
.shape-Container {
  .toolbar-icon {
    width: 40px;
    height: 40px;
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
  .container {
    position: absolute;
    overflow: hidden;
    left: 60px;
    top: 0px;
    right: 0px;
    bottom: 0px;
    background: url('../../assets/mxgraph/images/grid.gif');
  }
}
</style>
