import { useStore } from '@nanostores/preact'

import { ConsoleRecords } from '../store/console'

export default function Debug() {
  const logs = useStore(ConsoleRecords)

  return (
    <div tw='flex flex-col h-full'>
      <h2 tw='text-2xl'>Debug</h2>
      <div tw='overflow(y-auto x-hidden) text-sm'>
        {logs.map(({ timestamp, type, msg }, i) => (
          <p
            tw='even:bg-gray-100 whitespace-pre-wrap'
            key={i}
          >{`[${timestamp}] ${type}: ${msg}`}</p>
        ))}
        {logs.length === 0 ? <p>Nothing yet...</p> : null}
      </div>
    </div>
  )
}
