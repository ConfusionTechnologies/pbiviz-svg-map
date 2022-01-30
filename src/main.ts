import '../style/visual.less'
import powerbi from 'powerbi-visuals-api'
// powerbi's typing is surprisingly malformed
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions
import IVisual = powerbi.extensibility.visual.IVisual
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions
import VisualObjectInstance = powerbi.VisualObjectInstance
import DataView = powerbi.DataView
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject

export class Visual implements IVisual {
  constructor(options: VisualConstructorOptions) {}

  public update(options: VisualUpdateOptions) {}
}
