import './../style/visual.less'
import powerbi from 'powerbi-visuals-api'
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions
import IVisual = powerbi.extensibility.visual.IVisual
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions
import VisualObjectInstance = powerbi.VisualObjectInstance
import DataView = powerbi.DataView
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject

import { VisualSettings } from './settings'
export class Visual implements IVisual {
  private target: HTMLElement
  private updateCount: number
  private settings!: VisualSettings
  private textNode!: Text

  constructor(options: VisualConstructorOptions) {
    console.log('Visual constructor', options)
    this.target = options.element
    this.updateCount = 0
    if (document) {
      const new_p: HTMLElement = document.createElement('p')
      new_p.appendChild(document.createTextNode('Update count:'))
      const new_em: HTMLElement = document.createElement('em')
      this.textNode = document.createTextNode(this.updateCount.toString())
      new_em.appendChild(this.textNode)
      new_p.appendChild(new_em)
      this.target.appendChild(new_p)
    }
  }

  public update(options: VisualUpdateOptions) {
    this.settings = Visual.parseSettings(
      options && options.dataViews! && options.dataViews[0]!,
    )
    console.log('Visual update', options)
    if (this.textNode) {
      this.textNode.textContent = (this.updateCount++).toString()
    }
  }

  private static parseSettings(dataView: DataView): VisualSettings {
    return <VisualSettings>VisualSettings.parse(dataView)
  }

  /**
   * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
   * objects and properties you want to expose to the users in the property pane.
   *
   */
  public enumerateObjectInstances(
    options: EnumerateVisualObjectInstancesOptions,
  ): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
    return VisualSettings.enumerateObjectInstances(
      this.settings || VisualSettings.getDefault(),
      options,
    )
  }
}
