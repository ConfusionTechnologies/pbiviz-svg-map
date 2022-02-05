import { dataViewObjectsParser } from 'powerbi-visuals-utils-dataviewutils'
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser

// See the store folder for more info

export class MapSettings {
  topLeft: string = '50NMK0000099999'
  btmRight: string = '50NMK9999900000'
}

export class PlotSettings {
  scalePoints: boolean = true
  sizeFactor: number = 1
  fallbackColor: string = '#ff0000'
  // d3 only takes numTicks as a hint
  numXTicks: number = 16
  numYTicks: number = 9
  tickSize: number = 12
  labelSize: number = 20
  gridOpacity: number = 0.1
}

export class VisualSettings extends DataViewObjectsParser {
  map = new MapSettings()
  plot = new PlotSettings()
}
