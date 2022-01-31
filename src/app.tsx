import powerbi from 'powerbi-visuals-api'
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions

import Circle from './Circle'
import Map from './Map'
import { VisualSettings } from './settings'

function checkOrder(
  rows: [number, string][] | [string, number][],
): rows is [number, string][] {
  return typeof rows[0]![0] === 'number'
}

function mergeSVG(rows: [number, string][] | [string, number][]) {
  if (checkOrder(rows))
    return rows
      .sort(([a], [b]) => a - b)
      .map(([, c]) => c)
      .join('')
  else
    return rows
      .sort(([, a], [, b]) => a - b)
      .map(([c]) => c)
      .join('')
}

function App(opt: VisualUpdateOptions) {
  // console.log(opt)
  // their API sucks. dataViews is never be null or empty because
  // the formatting metadata is stored inside the dataView
  // instead of being at opt's root or smth.
  // several doc examples check for whether dataViews exist to do
  // stuff like conditionally show a landing page but that is kinda
  // broken now isn't it.
  // At least the typing seems accurate, so I don't have to console
  // log options several times to figure it out.
  // oh wait no I just found a typing inconsistency
  // I also cant make sense of their naming convention or data structure
  // what exactly is a dataView? its not in the docs for sure
  // its almost as if they forced a crusty C# developer to use typescript
  const dataView = opt.dataViews[0]
  const { width, height } = opt.viewport
  const size = Math.min(width, height)

  const settings: VisualSettings = VisualSettings.parse(dataView!)

  return (
    <>
      <div tw={`absolute h-[${size}px] w-[${size}px] inset-0 m-auto`}>
        <Circle
          tw={`
            h-full
            w-full
            border-[${settings.circle.circleThickness}px]
            bg-[${settings.circle.circleColor}]
          `}
          label={dataView?.metadata.columns[0]?.displayName ?? 'empty'}
          value={dataView?.single?.value.toString() ?? 'lmao'}
        ></Circle>
      </div>
      <Map opt={opt}></Map>
    </>
  )
}

export default App
