import { useState } from 'preact/hooks'

export const useHashLocation = () => {
  const [loc, setLoc] = useState('/')

  return [loc, setLoc] as [typeof loc, typeof setLoc]
}
