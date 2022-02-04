import { useEffect, useErrorBoundary, useRef, useState } from 'preact/hooks'
import { useStore } from '@nanostores/preact'
import * as Icon from 'preact-feather'

import Map from './components/Map'
import Navbar, { NavbarOptions } from './components/Navbar'
import DebugPage from './pages/Debug'
import InfoPage from './pages/Info'
import { vizConfig, vizData } from './store/powerBI'

const NavOptions: NavbarOptions = [
  {
    icon: 'Settings',
    route: 'config',
    tip: 'Upload map',
  },
  {
    icon: 'Info',
    route: 'info',
  },
  {
    icon: 'Terminal',
    route: 'debug',
  },
]

export default function App() {
  //console.log(opt)

  const fileRef = useRef<HTMLInputElement>(null)
  const [location, setLocation] = useState('debug')
  const [imgUrl, setImgUrl] = useState<string>()
  const [error, resetError] = useErrorBoundary((error) => console.error(error))

  useEffect(() => error && setTimeout(() => resetError(), 1000), [error])

  const onChange = async () => {
    const fileElem = fileRef.current
    if (!fileElem || !fileElem.files || !fileElem.files[0]) return

    // dont directly inject the SVG. that is asking for an injection attack
    const file = fileElem.files[0]
    const buffer = Buffer.from(await file.arrayBuffer())
    const encoded = buffer.toString('base64')

    setImgUrl(`data:${file.type};base64,${encoded}`)
  }

  //translucent overlay or toast instead
  if (error) return <p>{error}</p>

  return (
    <div tw='absolute inset-0 h-[100vh] w-[100vw]'>
      <Navbar
        tw='absolute right-0 top-0'
        options={NavOptions}
        hook={[location, setLocation]}
      ></Navbar>
      {location === 'info' ? <InfoPage /> : null}
      {location === 'debug' ? <DebugPage /> : null}
    </div>
  )
}
