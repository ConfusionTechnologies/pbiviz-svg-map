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

export const plotConfig = computed(vizConfig, (d) => d.plot)
export const getPltCfg = plotConfig.get

export const mapBounds = computed(vizConfig, (cfg) => {
  try {
    // Warning: it is [long, lat]
    // Note: treating long as x & lat as y (makes sense when globe is upright)
    const [x1, y1] = mgrs.toPoint(cfg.map.topLeft)
    const [x2, y2] = mgrs.toPoint(cfg.map.btmRight)
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
