import MapView from 'esri/views/MapView'
import WebMap from 'esri/WebMap'
import LayerList from 'esri/widgets/LayerList'
import Sketch from 'esri/widgets/Sketch'

import GraphicsLayer from 'esri/layers/GraphicsLayer'

import Geometry = require('esri/geometry/Geometry')
import { LayerItem } from '../components/LeftTabControl'
import { WebMapId } from '../config'

import FeatureLayer = require('esri/layers/FeatureLayer')
import PopupTemplate = require('esri/PopupTemplate')
import Legend = require('esri/widgets/Legend')
import SketchViewModel = require('esri/widgets/Sketch/SketchViewModel')

export const webmap = new WebMap({
  portalItem: {
    id: WebMapId,
  },
})

export const view = new MapView({
  container: 'viewDiv',
  map: webmap,
})

export const graphicsLayerSketch = new GraphicsLayer()

// wait fot the componenet to initialise this
export let layerList: LayerList = null

export const zoomToGeometries = (geoms: Geometry[]) => {
  const mergedExtent = geoms[0].extent
  geoms.forEach(element => {
    mergedExtent.union(element.extent)
  })
  view.extent = mergedExtent
}

export async function setLayersVisible(layerItem: LayerItem, visible: boolean) {
  return new Promise<void>((resolve, reject) => {
    const filteredLayers = webmap.layers.filter((lyrItem: any) => {
      const url = lyrItem.url
      if (url) {
        const containsMapServer = url.toLowerCase().includes('/mapserver')
        if (containsMapServer === true) {
          if (lyrItem.url + '/' + lyrItem.layerId === layerItem.layerUrl) {
            return true
          } else {
            return false
          }
        }
      }

      return lyrItem.url + '/' + lyrItem.layerId === layerItem.layerUrl
    })
    if (filteredLayers.length > 0) {
      filteredLayers.getItemAt(0).visible = visible
    } else {
      let detach = () => {
        //
      }
      const layerToAddFL = new FeatureLayer({
        url: layerItem.layerUrl,
        title: layerItem.text,
        popupEnabled: true,
      })

      const handle = layerToAddFL.watch('loadStatus', (status: 'not-loaded' | 'loading' | 'loaded' | 'failed') => {
        switch (status) {
          case 'loaded':
            detach()
            resolve()
            break
          case 'failed':
            detach()
            reject()
            break
          case 'not-loaded':
          case 'loading':
          default:
            break
        }
      })
      detach = () => handle.remove()

      layerToAddFL.on('layerview-create', () => {
        const displayField = layerToAddFL.displayField
        const template = new PopupTemplate()
        template.title = layerItem.text + ': {' + displayField + '}'
        template.content = '{*}'
        layerToAddFL.popupTemplate = template
      })
      webmap.add(layerToAddFL, 0)
    }
  })
}

/**
 * Assigns the container element to the View
 * @param container
 */
export async function initialize(container: HTMLDivElement) {
  view.container = container
  return new Promise<void>((resolve, reject) => {
    view.when(resolve, reject)

    webmap.add(graphicsLayerSketch)
  })
}

/**
 * Checks if we a visible layer in the map is not visible in the current map scale
 */
export const checkVisibleLayersScale = (): boolean => {
  if (view.extent) {
    // loop through visible layers to see if a layer is not visible in the extent - if so, display message
    return webmap.layers.some((lyrItem: any) => {
      if (lyrItem.visible) {
        if (lyrItem.minScale === 0 && lyrItem.maxScale === 0) {
          return false
        } else if (view.scale >= lyrItem.maxScale && view.scale <= lyrItem.minScale) {
          return false
        } else {
          return true
        }
      } else {
        return false
      }
    })
  }
}

export const initializeLayerList = (container: HTMLDivElement) => {
  layerList = new LayerList({
    container,
    view,
    listItemCreatedFunction: event => {
      const item = event.item
      if (item.layer.type !== 'group') {
        // don't show legend twice
        item.panel = {
          content: 'legend',
          open: true,
        }
      }
    },
  })
}

export const initializeLegend = (container: HTMLDivElement) => {
  return new Legend({
    container,
    view,
  })
}

export const initializeSketchVM = () => {
  const sketch = new SketchViewModel({
    layer: graphicsLayerSketch,
    view,
    updateOnGraphicClick: false,
  })
  return sketch
}

export const clearSketchGraphics = () => {
  graphicsLayerSketch.removeAll()
}
