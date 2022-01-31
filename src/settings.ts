import { dataViewObjectsParser } from 'powerbi-visuals-utils-dataviewutils'
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser

export class CircleSettings {
  public circleColor: string = 'white'
  public circleThickness: number = 2
}

export class VisualSettings extends DataViewObjectsParser {
  public circle: CircleSettings = new CircleSettings()
}
