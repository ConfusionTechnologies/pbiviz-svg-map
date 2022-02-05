import * as d3 from 'd3'
import mgrs from 'mgrs'

import { ComponentProps } from 'preact'
import { useLayoutEffect, useRef } from 'preact/hooks'
import { useStore } from '@nanostores/preact'

import { plotData, processedData, vizConfig, vizData } from '../store/powerBI'
import { VisualSettings } from '../settings'

const SVG_H = 720 as const
const SVG_W = 1280 as const
const SVG_R = SVG_H / SVG_W
// ticks shall be constant till i figure out what exactly is going on
const SVG_T = 12
const DEFAULT_SIZE = 10

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

function getScales([x1, y1, x2, y2]: [number, number, number, number]) {
  const x = d3.scaleLinear().domain([x1, x2]).range([0, SVG_W])
  const y = d3.scaleLinear().domain([y1, y2]).range([0, SVG_H])
  return [x, y] as const
}

function drawXAxis(
  g: d3.Selection<SVGGElement, any, any, any>,
  x: d3.ScaleLinear<number, number>,
) {
  return g
    .attr('transform', `translate(0,${SVG_H})`)
    .call(d3.axisTop(x).ticks(SVG_T))
    .call((g) => g.select('.domain').attr('display', 'none'))
}

function drawYAxis(
  g: d3.Selection<SVGGElement, any, any, any>,
  y: d3.ScaleLinear<number, number>,
) {
  return g
    .call(d3.axisRight(y).ticks(SVG_T * SVG_R))
    .call((g) => g.select('.domain').attr('display', 'none'))
}

function drawGrid(
  g: d3.Selection<SVGGElement, any, any, any>,
  x: d3.ScaleLinear<number, number>,
  y: d3.ScaleLinear<number, number>,
) {
  return g
    .attr('stroke', 'currentColor')
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
  const data = useStore(processedData)
  const settings = useStore(vizConfig)
  const [bx1, by1, bx2, by2] = getMapBounds(settings)

  const graphRef = useRef<SVGSVGElement>(null)

  useLayoutEffect(() => {
    const graphElem = graphRef.current
    if (!graphElem) return
    const svg = d3.select(graphElem)
    // rerendering; clear whatever may be there currently
    svg.selectAll('*').remove()

    const [x, y] = getScales([bx1, by1, bx2, by2])
    // holds map
    const gMap = svg.append('g')
    // holds plotted points
    const gPlot = svg.append('g')
    // holds x-axis
    const gx = svg.append('g')
    // holds y-axis
    const gy = svg.append('g')
    // holds grid
    const gGrid = svg.append('g')

    gPlot
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', (d) => x(d.long))
      .attr('cy', (d) => y(d.lat))
      .attr('r', (d) => 20)
      .attr('fill', (d) => d.color ?? 'red')

    gMap
      .append('image')
      .attr('href', imgUrl)
      .attr('x', x(bx1))
      .attr('y', y(by1))
      .attr('width', x(bx2 - bx1))
      .attr('height', y(by2 - by1))
      .attr('preserveAspectRatio', 'none')

    const zoom = d3
      .zoom<SVGSVGElement, any>()
      .scaleExtent([1, 8])
      .on('zoom', zoomed)

    svg.on('click', reset)

    function reset() {
      svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity)
    }

    function zoomed({ transform }) {
      const zx = transform.rescaleX(x).interpolate(d3.interpolateRound)
      const zy = transform.rescaleY(y).interpolate(d3.interpolateRound)
      gPlot.attr('transform', transform)
      gPlot.selectAll('circle').attr('r', (d: plotData) => 20 / transform.k)
      gMap.attr('transform', transform)
      gx.call(drawXAxis, zx)
      gy.call(drawYAxis, zy)
      gGrid.call(drawGrid, zx, zy)
    }

    svg.call(zoom).call(zoom.transform, d3.zoomIdentity)
  }, [
    graphRef.current,
    imgUrl,
    data
      .map((d) => d.name)
      .sort()
      .join(''),
  ])

  return <svg ref={graphRef} viewBox={`0 0 ${SVG_W} ${SVG_H}`} {...props}></svg>
}
