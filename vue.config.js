const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  transpileDependencies: ['vuetify'],
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@assets', resolve('src/assets'))
      .set('@commons', resolve('src/commons'))
      .set('@plugins', resolve('src/plugins'))
      .set('@graph', resolve('src/graph'))
      .set('@components', resolve('src/components'))
      .set('@theme', resolve('theme'));

    config.module
      .rule('')
      .test(/mxClient\.js$/)
      .use('exports-loader')
      .loader(
        'exports-loader?mxClient,mxToolbar,mxEdgeStyle,mxConnectionHandler,mxEllipse,mxConnectionConstraint,mxWindow,' +
          'mxObjectCodec,mxGraphModel,mxActor,mxPopupMenu,mxShape,mxEventObject,mxGraph,mxPopupMenuHandler,mxPrintPreview,' +
          'mxEventSource,mxRectangle,mxVertexHandler,mxMouseEvent,mxGraphView,mxCodecRegistry,mxImage,mxGeometry,mxCellState,' +
          'mxRubberband,mxConstraintHandler,mxKeyHandler,mxDragSource,mxGraphModel,mxEvent,mxUtils,mxEvent,mxCodec,mxCell,' +
          'mxConstants,mxPoint,mxGraphHandler,mxCylinder,mxCellRenderer,mxEvent,mxUndoManager,mxStencilRegistry,mxStencil,' +
          'mxPerimeter,mxCellEditor,mxEdgeHandler,mxImageExport,mxXmlCanvas2D'
      )
      .end();

    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .tap((options) => Object.assign(options, { limit: 3 }));
  }
};
