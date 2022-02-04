import { useEffect, useErrorBoundary, useRef, useState } from 'preact/hooks'
import { useStore } from '@nanostores/preact'
import { Link, Route } from 'wouter-preact'
import * as Icon from 'preact-feather'

import Map from './Map'
import { vizConfig, vizData } from './store/powerBI'

function App() {
  //console.log(opt)

  const dataView = useStore(vizData)
  const settings = useStore(vizConfig)

  const fileRef = useRef<HTMLInputElement>(null)
  const [imgUrl, setImgUrl] = useState<string>()
  const [fileDidUpload, setFileDidUpload] = useState(false)
  const [error, resetError] = useErrorBoundary((error) => console.error(error))

  useEffect(() => error && setTimeout(() => resetError(), 1000), [error])

  const onChange = async () => {
    const fileElem = fileRef.current
    if (!fileElem || !fileElem.files || !fileElem.files[0]) return

    setFileDidUpload(true)

    // dont directly inject the SVG. that is asking for an injection attack
    const file = fileElem.files[0]
    const buffer = Buffer.from(await file.arrayBuffer())
    const encoded = buffer.toString('base64')

    setImgUrl(`data:${file.type};base64,${encoded}`)
  }

  if (error) return <p>{error}</p>

  return (
    <div tw='absolute inset-0 m-auto'>
      <label>
        Insert SVG Map
        <input ref={fileRef} type='file' onInput={onChange}></input>
      </label>
      <Icon.Settings />
      <p>{fileDidUpload ? 'yay upload' : 'wtf'}</p>
      <p>{imgUrl}</p>
      <div tw='h-full w-full p-0'>
        <Map imgUrl={imgUrl} tw='h-full w-full'></Map>
      </div>
    </div>
  )
}

export default App
