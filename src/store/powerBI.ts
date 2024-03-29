import mgrs from 'mgrs'
import { atom, computed } from 'nanostores'
import powerbi from 'powerbi-visuals-api'

import { VisualSettings } from '../settings'

function strToLongLat(s: string): [number, number] {
  const match = [...s.matchAll(/^(?<long>\d+\.\d+), ?(?<lat>\d+\.\d+)$/g)]
  if (match.length > 0) {
    const { long, lat } = match[0]!.groups!
    return [parseFloat(long!), parseFloat(lat!)]
  } else {
    // ^\d[a-zA-Z]{3}\d{10}$
    const mgrsStr = s.replace(/\s+/g, '').toUpperCase()
    return mgrs.toPoint(mgrsStr)
  }
}

//https://github.com/nanostores/nanostores?ref=bestofvue.com#atoms
//you can use atoms for objects too if only allow replacing the whole object
//if yknow what the concept of an atom is, you will see why making
//an immutable settings object that comes from external an atom is fine

export const vizConfig = atom<VisualSettings>()
export const vizData = atom<powerbi.DataView>()

export const plotConfig = computed(vizConfig, (d) => d.plot)
export const getPltCfg = plotConfig.get

export const mapBounds = computed(vizConfig, (cfg) => {
  try {
    // Warning: it is [long, lat]
    // Note: treating long as x & lat as y (makes sense when globe is upright)
    const [x1, y1] = strToLongLat(cfg.map.topLeft)
    const [x2, y2] = strToLongLat(cfg.map.btmRight)
    return [
      Math.min(x1, x2), // Xmin
      Math.min(y1, y2), // Ymin
      Math.max(x1, x2), // Xmax
      Math.max(y1, y2), // Ymax
    ] as const
  } catch (e) {
    throw 'Invalid MGRS under Format > Map'
  }
})

export interface plotData {
  name?: string
  location: string
  lat: number
  long: number
  size?: number
  desc?: string
  time?: string
  color?: string
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
  const rows = table.rows
    .map((row, row_i) => {
      let obj = {}
      let isValid = true
      row.forEach((v, i) => {
        // Fuck microsoft. Somehow their dataview utils dont do this either.
        const oriColName = Object.keys(table.columns[i]!.roles!)[0]!
        const mappedColName: string = map[oriColName]
        obj[mappedColName] = v
        if (mappedColName == 'location') {
          try {
            ;[obj['long'], obj['lat']] = strToLongLat(v.toString())
          } catch (e) {
            console.error(`Row ${row_i} discarded due to ${e}`)
            isValid = false
          }
        }
      })
      if (!isValid || obj['location'] == undefined) return false
      return obj
    })
    .filter((o) => o) as plotData[]
  console.debug(rows)
  return rows
})
