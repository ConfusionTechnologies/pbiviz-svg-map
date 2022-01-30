import powerbi from 'powerbi-visuals-api'
// powerbi's typing is surprisingly malformed
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions
import IVisual = powerbi.extensibility.visual.IVisual
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions
import VisualObjectInstance = powerbi.VisualObjectInstance
import DataView = powerbi.DataView
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject

import { createElement, JSX, render } from 'preact'
import App from './app'

export class Visual implements IVisual {
  private rootCont: HTMLElement
  private rootElem: JSX.Element

  constructor(options: VisualConstructorOptions) {
    this.rootCont = options.element
    this.rootElem = createElement(App, {})

    render(this.rootElem, this.rootCont)
  }

  public update(options: VisualUpdateOptions) {}
}
