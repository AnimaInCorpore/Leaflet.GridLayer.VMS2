/* global L */

import { DEFAULT_OPTIONS } from './leaflet-gridlayer-vms2/constants.js'
import setupMethods from './leaflet-gridlayer-vms2/setup.js'
import lifecycleMethods from './leaflet-gridlayer-vms2/lifecycle.js'
import overlayMethods from './leaflet-gridlayer-vms2/overlay.js'
import geometryMethods from './leaflet-gridlayer-vms2/geometry.js'
import geojsonMethods from './leaflet-gridlayer-vms2/geojson.js'
import layerDataMethods from './leaflet-gridlayer-vms2/layer-data.js'
import styleRenderingMethods from './leaflet-gridlayer-vms2/style-rendering.js'
import resourceLoaderMethods from './leaflet-gridlayer-vms2/resource-loader.js'
import renderMethods from './leaflet-gridlayer-vms2/render.js'
import mathMethods from './leaflet-gridlayer-vms2/math.js'

L.GridLayer.VMS2 = L.GridLayer.extend({
  options: { ...DEFAULT_OPTIONS },

  ...setupMethods,
  ...lifecycleMethods,
  ...overlayMethods,
  ...geometryMethods,
  ...geojsonMethods,
  ...layerDataMethods,
  ...styleRenderingMethods,
  ...resourceLoaderMethods,
  ...renderMethods,
  ...mathMethods
})

L.gridLayer.vms2 = function (options) {
  return new L.GridLayer.VMS2(options)
}
