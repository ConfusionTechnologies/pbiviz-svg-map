import { atom, computed } from 'nanostores'
import powerbi from 'powerbi-visuals-api'
import mgrs from 'mgrs'

import { VisualSettings } from '../settings'

//https://github.com/nanostores/nanostores?ref=bestofvue.com#atoms
//you can use atoms for objects too if only allow replacing the whole object
//if yknow what the concept of an atom is, you will see why making
//an immutable settings object that comes from external an atom is fine

export const vizConfig = atom<VisualSettings>()
export const vizData = atom<powerbi.DataView>()

export interface plotData {
  name: string
  location: string
  lat: number
  long: number
  size: number
  desc: string
  time: string
  color: string
}

const map = {
  x_name: 'name',
  x_loc: 'location',
  x_size: 'size',
  x_desc: 'desc',
  x_time: 'time',
  x_color: 'color',
} as const

export const processedData = computed(vizData, (data): plotData[] => {
  const table = data.table
  if (!table || !table.rows) {
    console.warn('Table is empty')
    return []
  }
  return table.rows.map((row, row_i) => {
    let obj = {}
    row.forEach((v, i) => {
      // Fuck microsoft. Somehow their dataview utils dont do this either.
      const oriColName = Object.keys(table.columns[i]!.roles!)[0]!
      const mappedColName: string = map[oriColName]
      obj[mappedColName] = v
      if (mappedColName == 'location') {
        try {
          ;[obj['long'], obj['lat']] = mgrs.toPoint(v)
        } catch (e) {
          console.error(`Table ${row_i} MGRS coordinate invalid`)
        }
      }
    })
    return obj as plotData
  })
})
