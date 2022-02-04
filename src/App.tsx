import powerbi from 'powerbi-visuals-api'
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions

import { useEffect, useErrorBoundary } from 'preact/hooks'

import Map from './Map'
import { VisualSettings } from './settings'

function App(opt: VisualUpdateOptions) {
  //console.log(opt)
  /*
  several doc examples check for whether dataViews exist to do
  stuff like conditionally show a landing page but looking at
  the data structure... they seem broken
  the typing is mostly accurate at least, but there are some
  inconsistency (usually just missing props which is fine)
  the greatest hinder is that their naming convention is weird
  what exactly is a dataView? its not in the docs for sure
  why are settings called dataViewObjects? am I suppose to mix them up?
  its almost as if they forced a crusty C# developer to use typescript
  their documentation is too example-driven, handholds you like a baby
  but doesn't actually explain anything... no API reference either
  internal code isn't exposed by the interface pkg so I've to guess a lot
  */

  const dataView = opt.dataViews[0]!
  const settings = VisualSettings.parse<VisualSettings>(dataView)

  const [error, resetError] = useErrorBoundary((error) => console.error(error))

  useEffect(() => error && setTimeout(() => resetError(), 1000), [error])

  if (error) return <p>{error}</p>

  return (
    <div tw={`absolute inset-0 m-auto bg-black`}>
      <div tw='h-full w-full p-0'>
        <Map opt={opt} tw='h-full w-full'></Map>
      </div>
    </div>
  )
}

export default App
