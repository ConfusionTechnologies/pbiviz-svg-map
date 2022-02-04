import * as d3 from 'd3'
import mgrs from 'mgrs'

import { ComponentProps } from 'preact'
import { useLayoutEffect, useRef } from 'preact/hooks'
import { useStore } from '@nanostores/preact'

import { vizConfig, vizData } from '../store/powerBI'

export interface MapChartProps extends ComponentProps<'svg'> {
  /** [x1, y1, x2, y2] where x1, y1 is top left, x2, y2 is bottom right */
  zoomRect?: [number, number, number, number]
  imgUrl: string
}

export default function MapChart({
  zoomRect,
  imgUrl,
  ...props
}: MapChartProps) {
  try {
    const dataView = useStore(vizData)
    const settings = useStore(vizConfig)

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
        .attr('href', imgUrl)
        .attr('x', '80')
        .attr('y', '45')
        .attr('width', '1120')
        .attr('height', '630')

      const zoom = d3
        .zoom<SVGGElement, unknown>()
        .scaleExtent([1, 8])
        .on('zoom', zoomed)
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
    }, [graphRef.current, imgUrl])

    return <svg ref={graphRef} viewBox='0 0 1280 720' {...props}></svg>
  } catch (e) {
    console.error(e)
    throw e
  }
}
