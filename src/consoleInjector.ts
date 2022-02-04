import { ConsoleRecord, ConsoleRecords } from './store/console'

//taken from https://stackoverflow.com/a/67449524/9614726

export function injectConsole() {
  function timestamp() {
    return new Date().toLocaleString('sv')
  }
  function appendRecord(record: ConsoleRecord) {
    ConsoleRecords.get().push(record)
    ConsoleRecords.notify()
  }

  window.onerror = (error, url, line) => {
    appendRecord({
      type: 'unhandledException',
      timestamp: timestamp(),
      msg: `${url}@${line}: ${error}`,
    })
    return false
  }

  window.onunhandledrejection = (e: PromiseRejectionEvent) => {
    appendRecord({
      type: 'promiseRejection',
      timestamp: timestamp(),
      msg: e.reason,
    })
  }

  const caughtLevels = ['log', 'error', 'warn', 'debug'] as const

  caughtLevels.forEach((logType) => {
    const original = console[logType].bind(console)
    console[logType] = (...args) => {
      appendRecord({
        type: logType,
        timestamp: timestamp(),
        msg: Array.from(args)
          .map((v) => (typeof v !== 'string' ? JSON.stringify(v) : v))
          .join(', '),
      })
      original.apply(console, args)
    }
  })
}
