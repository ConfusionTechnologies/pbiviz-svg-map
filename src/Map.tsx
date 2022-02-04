import powerbi from 'powerbi-visuals-api'
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions

import { ComponentProps } from 'preact'
import { useLayoutEffect, useRef } from 'preact/hooks'
import * as d3 from 'd3'
import mgrs from 'mgrs'

import { VisualSettings } from './settings'

function checkOrder(
  rows: [number, string][] | [string, number][],
): rows is [number, string][] {
  return typeof rows[0]![0] === 'number'
}

function mergeImgChunks(rows: [number, string][] | [string, number][]) {
  const i = +!checkOrder(rows)
  return rows
    .sort((a, b) => a[i] - b[i])
    .map((c) => c[+!i])
    .join('')
}

export interface MapProps extends ComponentProps<'svg'> {
  opt: VisualUpdateOptions
  /** [x1, y1, x2, y2] where x1, y1 is top left, x2, y2 is bottom right */
  zoomRect?: [number, number, number, number]
  imgUrl?: string
}

function Map({ opt, zoomRect, imgUrl, ...props }: MapProps) {
  try {
    const dataView = opt.dataViews[0]!
    const settings = VisualSettings.parse<VisualSettings>(dataView)

    // use placeholder if no img given
    const imgSrc =
      imgUrl ??
      'https://upload.wikimedia.org/wikipedia/commons/6/6f/World_Map.svg'

    const graphRef = useRef<SVGSVGElement>(null)

    try {
      // Warning: it is [long, lat]
      // I treat long as x & lat as y (makes sense when globe is upright)
      const [x1, y1] = mgrs.toPoint(settings.map.topLeft)
      const [x2, y2] = mgrs.toPoint(settings.map.btmRight)
    } catch (e) {
      throw 'Invalid MGRS under Format > Map'
    }

    useLayoutEffect(() => {
      const graphElem = graphRef.current
      if (!graphElem) return
      const svg = d3.select(graphElem)
      svg.selectAll('*').remove()
      const g = svg.append('g')

      g.append('rect')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('fill', 'white')

      g.append('rect')
        .attr('x', '80')
        .attr('y', '45')
        .attr('width', '1120')
        .attr('height', '630')
        .attr('fill', 'yellow')

      g.append('image')
        .attr('href', imgSrc)
        .attr('x', '80')
        .attr('y', '45')
        .attr('width', '1120')
        .attr('height', '630')

      const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', zoomed)
      g.call(zoom)
      svg.on('click', reset)

      function reset() {
        g.transition()
          .duration(750)
          .call(
            zoom.transform,
            d3.zoomIdentity,
            d3.zoomTransform(g.node()!).invert([640, 360]),
          )
      }

      function zoomed({ transform }) {
        g.attr('transform', transform).attr('stroke-width', 1 / transform.k)
      }
    }, [graphRef.current])

    return <svg ref={graphRef} viewBox='0 0 1280 720' {...props}></svg>
  } catch (e) {
    console.error(e)
    throw e
  }
}

export default Map
