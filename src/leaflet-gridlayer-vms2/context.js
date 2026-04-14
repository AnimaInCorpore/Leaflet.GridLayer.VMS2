/* global Worker */

import { DEFAULT_MIN_NUMBER_OF_WORKERS } from './constants.js'

function createVms2Context () {
  return {
    decodeWorkers: [],
    decodeWorkersRunning: 0,
    decodeQueue: [],

    styleRequestQueues: {},

    fontCharacterCanvas: null,
    fontCharacterContext: null,
    fontCharacterWidths: {},
    fontFaceCache: {},

    imageCache: {},
    patternCache: {},

    tileLayerRequestInfos: {},
    tileCache: [],
    tileCacheIndex: 0,
    tileCacheSize: 600,
    tileCacheLayerMaps: {}
  }
}

function handleDecodeWorkerMessage (event) {
  const context = globalThis.vms2Context

  for (const tileData of event.data.tDs) {
    let layerMap = context.tileCacheLayerMaps[event.data.lId]

    if (!layerMap) {
      layerMap = new Map()
      context.tileCacheLayerMaps[event.data.lId] = layerMap
    }

    const tileKey = tileData.x + '|' + tileData.y + '|' + tileData.z + '|' + tileData.dZ

    layerMap.set(tileKey, {
      objects: tileData.tOs,
      x: tileData.x,
      y: tileData.y,
      z: tileData.z,
      detailZoom: tileData.dZ
    })

    const newEntry = { layerMap, tileKey }
    const oldEntry = context.tileCache[context.tileCacheIndex]

    if (oldEntry) {
      oldEntry.layerMap.delete(oldEntry.tileKey)
    }

    context.tileCache[context.tileCacheIndex] = newEntry
    context.tileCacheIndex = (context.tileCacheIndex + 1) % context.tileCacheSize
  }

  const resolveFunction = event.target.resolveFunction

  event.target.resolveFunction = null

  if (resolveFunction) {
    resolveFunction()
  }
}

export function ensureVms2Context (workerUrl) {
  if (globalThis.vms2Context) {
    return globalThis.vms2Context
  }

  const context = createVms2Context()

  context.fontCharacterCanvas = document.createElement('canvas')
  context.fontCharacterContext = context.fontCharacterCanvas.getContext('2d')

  const availableCores = navigator.hardwareConcurrency ?? (DEFAULT_MIN_NUMBER_OF_WORKERS + 1)
  const maxNumberOfWorkers = Math.max(availableCores - 1, DEFAULT_MIN_NUMBER_OF_WORKERS)

  for (let count = 0; count < maxNumberOfWorkers; count++) {
    const decodeWorker = new Worker(workerUrl)

    decodeWorker.onmessage = handleDecodeWorkerMessage

    context.decodeWorkers.push(decodeWorker)
  }

  globalThis.vms2Context = context

  return context
}
