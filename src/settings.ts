import { dataViewObjectsParser } from 'powerbi-visuals-utils-dataviewutils'
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser

// See the store folder for more info

export class MapSettings {
  topLeft: string = '50NMK0000099999'
  btmRight: string = '50NMK9999900000'
}

export class VisualSettings extends DataViewObjectsParser {
  map = new MapSettings()
}
