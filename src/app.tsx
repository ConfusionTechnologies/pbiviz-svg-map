import powerbi from 'powerbi-visuals-api'
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions

import Circle from './Circle'
import { VisualSettings } from './settings'

function App(opt: VisualUpdateOptions) {
  const dataView = opt.dataViews[0]
  const { width, height } = opt.viewport
  const size = Math.min(width, height)

  const settings: VisualSettings = VisualSettings.parse(dataView!)

  return (
    <div tw={`absolute h-[${size}px] w-[${size}px] inset-0 m-auto`}>
      <Circle
        tw={`border-[${settings.circle.circleThickness}px] bg-[${settings.circle.circleColor}]`}
        label={dataView?.metadata.columns[0]?.displayName}
        value={dataView?.single?.value.toString()}
      ></Circle>
    </div>
  )
}

export default App
