import { dataViewObjectsParser } from 'powerbi-visuals-utils-dataviewutils'
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser

export class CircleSettings {
  circleColor: string = 'white'
  circleThickness: number = 2
}

export class MapSettings {
  topLeft: string = '50NMK0000099999'
  btmRight: string = '50NMK9999900000'
}

export class VisualSettings extends DataViewObjectsParser {
  circle = new CircleSettings()
  map = new MapSettings()
}
