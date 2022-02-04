import { atom } from 'nanostores'

export interface ConsoleRecord {
  type:
    | 'unhandledException'
    | 'promiseRejection'
    | 'log'
    | 'error'
    | 'warn'
    | 'debug'
  timestamp: string
  msg: string
}

export const ConsoleRecords = atom<ConsoleRecord[]>([])
