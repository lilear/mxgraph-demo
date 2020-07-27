import { mxStencilRegistry, mxUtils, mxConstants, mxStencil, mxCellRenderer } from 'mxgraph/javascript/mxClient';
const STENCIL_PATH = '.';
/**
 * Overrides stencil registry for dynamic loading of stencils.
 */
/**
 * Maps from library names to an array of Javascript filenames,
 * which are synchronously loaded. Currently only stencil files
 * (.xml) and JS files (.js) are supported.
 * IMPORTANT: For embedded diagrams to work entries must also
 * be added in EmbedServlet.java.
 */
(function setDefaultShape() {
  mxStencilRegistry.libraries = {};

  /**
   * Global switch to disable dynamic loading.
   */
  mxStencilRegistry.dynamicLoading = true;

  /**
   * Global switch to disable eval for JS (preload all JS instead).
   */
  mxStencilRegistry.allowEval = true;

  /**
   * Stores all package names that have been dynamically loaded.
   * Each package is only loaded once.
   */
  mxStencilRegistry.packages = [];

  // Extends the default stencil registry to add dynamic loading
  mxStencilRegistry.getStencil = function(name) {
    var result = mxStencilRegistry.stencils[name];

    if (result == null && mxCellRenderer.defaultShapes[name] == null && mxStencilRegistry.dynamicLoading) {
      var basename = mxStencilRegistry.getBasenameForStencil(name);

      // Loads stencil files and tries again
      if (basename != null) {
        var libs = mxStencilRegistry.libraries[basename];
        if (libs != null) {
          if (mxStencilRegistry.packages[basename] == null) {
            for (var i = 0; i < libs.length; i++) {
              var fname = libs[i];

              if (fname.toLowerCase().substring(fname.length - 4, fname.length) == '.xml') {
                mxStencilRegistry.loadStencilSet(fname, null);
              } else if (fname.toLowerCase().substring(fname.length - 3, fname.length) == '.js') {
                try {
                  if (mxStencilRegistry.allowEval) {
                    var req = mxUtils.load(fname);

                    if (req != null && req.getStatus() >= 200 && req.getStatus() <= 299) {
                      eval.call(window, req.getText());
                    }
                  }
                } catch (e) {
                  if (window.console != null) {
                    console.log('error in getStencil:', fname, e);
                  }
                }
              } else {
                // FIXME: This does not yet work as the loading is triggered after
                // the shape was used in the graph, at which point the keys have
                // typically been translated in the calling method.
                //mxResources.add(fname);
              }
            }

            mxStencilRegistry.packages[basename] = 1;
          }
        } else {
          // Replaces '_-_' with '_'
          basename = basename.replace('_-_', '_');
          mxStencilRegistry.loadStencilSet(STENCIL_PATH + '/' + basename + '.xml', null);
        }

        console.log(mxStencilRegistry.stencils[name]);
        result = mxStencilRegistry.stencils[name];
      }
    }

    return result;
  };

  // Returns the basename for the given stencil or null if no file must be
  // loaded to render the given stencil.
  mxStencilRegistry.getBasenameForStencil = function(name) {
    var tmp = null;

    if (name != null && typeof name === 'string') {
      var parts = name.split('.');

      if (parts.length > 0 && parts[0] == 'mxgraph') {
        tmp = parts[1];

        for (var i = 2; i < parts.length - 1; i++) {
          tmp += '/' + parts[i];
        }
      }
    }

    return tmp;
  };
  // Loads the given stencil set
  mxStencilRegistry.loadStencilSet = function(stencilFile, postStencilLoad, force, async) {
    force = force != null ? force : false;
    // Uses additional cache for detecting previous load attempts
    var xmlDoc = mxStencilRegistry.packages[stencilFile];

    if (force || xmlDoc == null) {
      var install = false;

      if (xmlDoc == null) {
        try {
          if (async) {
            mxStencilRegistry.loadStencil(
              stencilFile,
              mxUtils.bind(this, function(xmlDoc2) {
                if (xmlDoc2 != null && xmlDoc2.documentElement != null) {
                  mxStencilRegistry.packages[stencilFile] = xmlDoc2;
                  install = true;
                  mxStencilRegistry.parseStencilSet(xmlDoc2.documentElement, postStencilLoad, install);
                }
              })
            );

            return;
          } else {
            xmlDoc = mxStencilRegistry.loadStencil(stencilFile);
            mxStencilRegistry.packages[stencilFile] = xmlDoc;
            install = true;
          }
        } catch (e) {
          if (window.console != null) {
            console.log('error in loadStencilSet:', stencilFile, e);
          }
        }
      }

      if (xmlDoc != null && xmlDoc.documentElement != null) {
        mxStencilRegistry.parseStencilSet(xmlDoc.documentElement, postStencilLoad, install);
      }
    }
  };

  // Loads the given stencil XML file.
  mxStencilRegistry.loadStencil = function(filename, fn) {
    if (fn != null) {
      mxUtils.get(
        filename,
        mxUtils.bind(this, function(req) {
          fn(req.getStatus() >= 200 && req.getStatus() <= 299 ? req.getXml() : null);
        })
      );
    } else {
      console.log(mxUtils.load(filename));
      return mxUtils.load(filename).getXml();
    }
  };
  mxStencilRegistry.parseStencilSets = function(stencils) {
    for (var i = 0; i < stencils.length; i++) {
      mxStencilRegistry.parseStencilSet(mxUtils.parseXml(stencils[i]).documentElement);
    }
  };

  mxStencilRegistry.parseStencilSet = function(root, postStencilLoad, install) {
    if (root.nodeName == 'stencils') {
      var shapes = root.firstChild;

      while (shapes != null) {
        if (shapes.nodeName == 'shapes') {
          mxStencilRegistry.parseStencilSet(shapes, postStencilLoad, install);
        }

        shapes = shapes.nextSibling;
      }
    } else {
      install = install != null ? install : true;
      var shape = root.firstChild;
      var packageName = '';
      var name = root.getAttribute('name');

      if (name != null) {
        packageName = name + '.';
      }

      while (shape != null) {
        if (shape.nodeType == mxConstants.NODETYPE_ELEMENT) {
          name = shape.getAttribute('name');

          if (name != null) {
            packageName = packageName.toLowerCase();
            var stencilName = name.replace(/ /g, '_');

            if (install) {
              mxStencilRegistry.addStencil(packageName + stencilName.toLowerCase(), new mxStencil(shape));
            }

            if (postStencilLoad != null) {
              var w = shape.getAttribute('w');
              var h = shape.getAttribute('h');

              w = w == null ? 80 : parseInt(w, 10);
              h = h == null ? 80 : parseInt(h, 10);

              postStencilLoad(packageName, stencilName, name, w, h);
            }
          }
        }

        shape = shape.nextSibling;
      }
    }
  };
})();
