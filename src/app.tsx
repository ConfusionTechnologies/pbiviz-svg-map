import powerbi from 'powerbi-visuals-api'
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions

import Map from './Map'
import { VisualSettings } from './settings'

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

  const settings: VisualSettings = VisualSettings.parse(dataView!)

  return (
    <div tw={`absolute inset-0 m-auto bg-black`}>
      <div tw='h-full w-full p-0'>
        <Map opt={opt} tw='h-full w-full'></Map>
      </div>
    </div>
  )
}

export default App
