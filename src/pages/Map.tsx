import { useStore } from '@nanostores/preact'
import MapChart from '../components/MapChart'
import { MapImgUrl } from '../store/global'

export default function Map() {
  const imgUrl = useStore(MapImgUrl)

  return (
    <div tw='h-full w-full'>
      <MapChart imgUrl={imgUrl} preserveAspectRatio='XMidYmid meet'></MapChart>
    </div>
  )
}
