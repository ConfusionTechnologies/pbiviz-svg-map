import * as d3 from 'd3'

import { ComponentProps } from 'preact'
import { useLayoutEffect, useRef } from 'preact/hooks'
import { useStore } from '@nanostores/preact'

import { plotData, processedData, getPltCfg, mapBounds } from '../store/powerBI'

const SVG_H = 720 as const
const SVG_W = 1280 as const

const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length

function getScales([x1, y1, x2, y2]: [number, number, number, number]) {
  const x = d3.scaleLinear().domain([x1, x2]).range([0, SVG_W])
  const y = d3.scaleLinear().domain([y2, y1]).range([0, SVG_H])
  return [x, y] as const
}

function drawXAxis(
  g: d3.Selection<SVGGElement, any, any, any>,
  x: d3.ScaleLinear<number, number>,
) {
  return g
    .attr('transform', `translate(0,${SVG_H})`)
    .attr('font-size', getPltCfg().tickSize)
    .call(d3.axisTop(x).ticks(getPltCfg().numXTicks))
    .call((g) => g.select('.domain').attr('display', 'none'))
}

function drawYAxis(
  g: d3.Selection<SVGGElement, any, any, any>,
  y: d3.ScaleLinear<number, number>,
) {
  return g
    .attr('font-size', getPltCfg().tickSize)
    .call(d3.axisRight(y).ticks(getPltCfg().numYTicks))
    .call((g) => g.select('.domain').attr('display', 'none'))
}

function drawGrid(
  g: d3.Selection<SVGGElement, any, any, any>,
  x: d3.ScaleLinear<number, number>,
  y: d3.ScaleLinear<number, number>,
) {
  return g
    .attr('stroke', 'currentColor')
    .attr('stroke-opacity', getPltCfg().gridOpacity)
    .call((g) =>
      g
        .selectAll('.x')
        .data(x.ticks(getPltCfg().numXTicks))
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
        .data(y.ticks(getPltCfg().numYTicks))
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
  const [bx1, by1, bx2, by2] = mapBounds.get()

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
      .attr('font-family', 'sans-serif')
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')

    gPlot
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', (d) => x(d.long))
      .attr('cy', (d) => y(d.lat))
      .attr('r', (d) => (d.size ?? 5) * getPltCfg().sizeFactor)
      .attr('fill', (d) => d.color ?? getPltCfg().fallbackColor)
      .append('svg:title')
      .text((d) => `${d.location}: ${d.desc ?? 'no description'}`)

    gPlot
      .selectAll('text')
      .data(data)
      .join('text')
      .attr('stroke', 'white')
      .attr('x', (d) => x(d.long))
      .attr('y', (d) => y(d.lat))
      .text((d) => d.name ?? '')

    gMap
      .append('image')
      .attr('href', imgUrl)
      .attr('x', x(bx1))
      .attr('y', y(by2))
      .attr('width', Math.abs(x(bx2) - x(bx1)))
      .attr('height', Math.abs(y(by2) - y(by1)))
      .attr('preserveAspectRatio', 'none')

    const zoom = d3
      .zoom<SVGSVGElement, any>()
      .scaleExtent([0, Infinity])
      .on('zoom', zoomed)

    svg.on('click', reset)

    function reset() {
      const longs = data.map((d) => d.long)
      const lats = data.map((d) => d.lat)
      const [cx, cy] = [average(longs), average(lats)]
      svg.call(zoom.translateTo, x(cx), y(cy)).call(zoom.scaleTo, 1)
    }

    function zoomed({ transform }) {
      const zx = transform.rescaleX(x).interpolate(d3.interpolateRound)
      const zy = transform.rescaleY(y).interpolate(d3.interpolateRound)

      gPlot
        .attr('transform', transform)
        .attr('font-size', getPltCfg().labelSize / transform.k)
      gPlot
        .selectAll('circle')
        .attr(
          'r',
          (d: plotData) =>
            ((d.size ?? 5) * getPltCfg().sizeFactor) /
            (getPltCfg().scalePoints ? transform.k : 1),
        )
      gPlot
        .selectAll('text')
        .attr(
          'y',
          (d: plotData) =>
            y(d.lat) -
            ((d.size ?? 5) * getPltCfg().sizeFactor) /
              (getPltCfg().scalePoints ? transform.k : 1),
        )
        .attr('stroke-width', 0.5 / transform.k)

      gMap.attr('transform', transform)
      gx.call(drawXAxis, zx)
      gy.call(drawYAxis, zy)
      gGrid.call(drawGrid, zx, zy)
    }

    svg.call(zoom)
    reset()
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
