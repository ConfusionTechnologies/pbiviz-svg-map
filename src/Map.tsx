import powerbi from 'powerbi-visuals-api'
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions

import { ComponentProps } from 'preact'
import mgrs from 'mgrs'

import { VisualSettings } from './settings'

function checkOrder(
  rows: [number, string][] | [string, number][],
): rows is [number, string][] {
  return typeof rows[0]![0] === 'number'
}

function mergeSVG(rows: [number, string][] | [string, number][]) {
  const i = +!checkOrder(rows)
  return rows
    .sort((a, b) => a[i] - b[i])
    .map((c) => c[+!i])
    .join('')
}

export interface MapProps extends ComponentProps<'img'> {
  opt: VisualUpdateOptions
  /** [x1, y1, x2, y2] where x1, y1 is top left, x2, y2 is bottom right */
  zoomRect?: [number, number, number, number]
}

function Map({ opt, zoomRect, ...props }: MapProps) {
  const dataView = opt.dataViews[0]
  const settings: VisualSettings = VisualSettings.parse(dataView!)
  const imgURI = mergeSVG(dataView?.table?.rows as [number, string][])

  try {
    // Warning: it is [long, lat]
    // I treat long as x & lat as y (makes sense when globe is upright)
    const [x1, y1] = mgrs.toPoint(settings.map.topLeft)
    const [x2, y2] = mgrs.toPoint(settings.map.btmRight)
  } catch (e) {
    console.error('Invalid MGRS under Format > Map')
    return <p>Invalid MGRS under Format &gt; Map</p>
  }

  if (zoomRect) {
  }

  return <img src={imgURI} {...props}></img>
}

export default Map
