import { useEffect, useErrorBoundary, useState } from 'preact/hooks'

import Navbar, { NavbarOptions } from './components/Navbar'
import ConfigPage from './pages/Config'
import DebugPage from './pages/Debug'
import InfoPage from './pages/Info'
import MapPage from './pages/Map'

const NavOptions: NavbarOptions = [
  {
    icon: 'Globe',
    route: 'map',
    tip: 'View map',
  },
  {
    icon: 'Settings',
    route: 'config',
    tip: 'Upload map',
  },
  {
    icon: 'Info',
    route: 'info',
    tip: 'Widget info',
  },
  {
    icon: 'Terminal',
    route: 'debug',
    tip: 'Debug info',
  },
]

export default function App() {
  //console.log(opt)

  const [location, setLocation] = useState('config')
  const [error, resetError] = useErrorBoundary((error) => {
    console.error(error)
    setLocation('debug')
  })

  useEffect(() => error && setTimeout(() => resetError(), 1000), [error])

  //translucent overlay or toast instead

  return (
    <div tw='absolute inset-0 h-[100vh] w-[100vw]'>
      <Navbar
        tw='absolute right-1 top-16 opacity-0 hover:opacity-100 transition-opacity'
        options={NavOptions}
        hook={[location, setLocation]}
      ></Navbar>
      {error ? <p>{error}</p> : null}
      {location === 'map' ? <MapPage /> : null}
      {location === 'info' ? <InfoPage /> : null}
      {location === 'debug' ? <DebugPage /> : null}
      {location === 'config' ? <ConfigPage /> : null}
    </div>
  )
}
