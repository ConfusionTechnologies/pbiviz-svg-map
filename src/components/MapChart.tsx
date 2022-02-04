import * as d3 from 'd3'
import mgrs from 'mgrs'

import { ComponentProps } from 'preact'
import { useLayoutEffect, useRef } from 'preact/hooks'
import { useStore } from '@nanostores/preact'

import { vizConfig, vizData } from '../store/powerBI'
import { VisualSettings } from '../settings'

const SVG_H = 720 as const
const SVG_W = 1280 as const
const SVG_R = SVG_H / SVG_W
// ticks shall be constant till i figure out what exactly is going on
const SVG_T = 12

function getMapBounds(
  settings: VisualSettings,
): [number, number, number, number] {
  try {
    // Warning: it is [long, lat]
    // Note: treating long as x & lat as y (makes sense when globe is upright)
    const [x1, y1] = mgrs.toPoint(settings.map.topLeft)
    const [x2, y2] = mgrs.toPoint(settings.map.btmRight)
    return [
      Math.min(x1, x2), // Xmin
      Math.min(y1, y2), // Ymin
      Math.max(x1, x2), // Xmax
      Math.max(y1, y2), // Ymax
    ]
  } catch (e) {
    throw 'Invalid MGRS under Format > Map'
  }
}

function getD3Scales([x1, y1, x2, y2]: [number, number, number, number]) {
  const x = d3.scaleLinear().domain([x1, x2]).range([0, SVG_W])
  const y = d3.scaleLinear().domain([y1, y2]).range([0, SVG_H])
  return [x, y] as const
}

function drawD3Axes(
  g: d3.Selection<SVGGElement, any, any, any>,
  x: d3.ScaleLinear<number, number>,
  y: d3.ScaleLinear<number, number>,
) {
  g.attr('transform', `translate(0,${SVG_H})`)
    .call(d3.axisTop(x).ticks(SVG_T))
    .call((g) => g.select('.domain').attr('display', 'none'))

  g.call(d3.axisRight(y).ticks(SVG_T * SVG_R)).call((g) =>
    g.select('.domain').attr('display', 'none'),
  )
}

function drawD3Grid(
  g: d3.Selection<SVGGElement, any, any, any>,
  x: d3.ScaleLinear<number, number>,
  y: d3.ScaleLinear<number, number>,
) {
  g.attr('stroke', 'currentColor')
    .attr('stroke-opacity', 0.1)
    .call((g) =>
      g
        .selectAll('.x')
        .data(x.ticks(SVG_T))
        .join(
          (enter) => enter.append('line').attr('class', 'x').attr('y2', SVG_H),
          (update) => update,
          (exit) => exit.remove(),
        )
        .attr('x1', (d) => 0.5 + x(d))
        .attr('x2', (d) => 0.5 + x(d)),
    )
    .call((g) =>
      g
        .selectAll('.y')
        .data(y.ticks(SVG_T * SVG_R))
        .join(
          (enter) => enter.append('line').attr('class', 'y').attr('x2', SVG_W),
          (update) => update,
          (exit) => exit.remove(),
        )
        .attr('y1', (d) => 0.5 + y(d))
        .attr('y2', (d) => 0.5 + y(d)),
    )
}

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
  const dataView = useStore(vizData)
  const settings = useStore(vizConfig)

  console.log(dataView)

  const graphRef = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const graphElem = graphRef.current
    if (!graphElem) return
    const svg = d3.select(graphElem)
    // rerendering; clear whatever may be there currently
    svg.selectAll('*').remove()

    const gGrid = svg.append('g')
    const gPlot = svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke-linecap', 'round')
    const gMap = svg.append('g')

    gMap
      .append('rect')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('fill', 'white')

    gMap
      .append('rect')
      .attr('x', SVG_W * 0.1)
      .attr('y', SVG_H * 0.1)
      .attr('width', SVG_W * 0.8)
      .attr('height', SVG_H * 0.8)
      .attr('fill', 'yellow')

    gMap
      .append('image')
      .attr('href', imgUrl)
      .attr('x', SVG_W * 0.1)
      .attr('y', SVG_H * 0.1)
      .attr('width', SVG_W * 0.8)
      .attr('height', SVG_H * 0.8)

    const zoom = d3
      .zoom<SVGGElement, any>()
      .scaleExtent([1, 8])
      .on('zoom', zoomed)
    gMap.call(zoom)
    svg.on('click', reset)

    function reset() {
      gMap.transition().duration(750).call(zoom.transform, d3.zoomIdentity)
    }

    function zoomed({ transform }) {
      gMap.attr('transform', transform).attr('stroke-width', 1 / transform.k)
    }
  }, [graphRef.current, imgUrl])

  return <svg ref={graphRef} viewBox={`0 0 ${SVG_W} ${SVG_H}`} {...props}></svg>
}
