import { useStore } from '@nanostores/preact'
import { useRef } from 'preact/hooks'
import { MapImgUrl } from '../store/global'

export default function Config() {
  const fileRef = useRef<HTMLInputElement>(null)

  const imgUrl = useStore(MapImgUrl)

  const onChange = async () => {
    const fileElem = fileRef.current
    if (!fileElem || !fileElem.files || !fileElem.files[0]) return

    // dont directly inject the SVG. that is asking for an injection attack
    const file = fileElem.files[0]
    const buffer = Buffer.from(await file.arrayBuffer())
    const encoded = buffer.toString('base64')

    MapImgUrl.set(`data:${file.type};base64,${encoded}`)
  }

  return (
    <div tw='flex flex-col gap-1 h-full w-full'>
      <h2 tw='text-2xl'>Config</h2>
      <label tw='text-lg'>
        SVG Map:{'\t'}
        <input type='file' ref={fileRef} onInput={onChange}></input>
      </label>
      <h3 tw='text-lg'>Preview: </h3>
      <img src={imgUrl}></img>
    </div>
  )
}
