import powerbi from 'powerbi-visuals-api'
/*
powerbi's typing is surprisingly malformed given that
microsoft is the main backer of typescript.
like seriously what is with the nested namespaces
*/
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions
import IVisual = powerbi.extensibility.visual.IVisual

import { createElement, render } from 'preact'
import { setup as setupTwind } from '@twind/preact'

import App from './App'
import Usage from './Usage'
import { VisualSettings } from './settings'

export class Visual implements IVisual {
  private rootElem: HTMLElement
  private settings?: VisualSettings

  constructor(options: VisualConstructorOptions) {
    this.rootElem = options.element
    setupTwind({
      props: {
        css: false,
      },
    })

    render(createElement(Usage, {}), this.rootElem)
  }

  update(options: VisualUpdateOptions) {
    console.log('Updating')
    this.settings = VisualSettings.parse(options.dataViews[0]!)
    render(createElement(App, options), this.rootElem)
    console.log('Updated')
  }

  enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions) {
    return VisualSettings.enumerateObjectInstances(
      this.settings || VisualSettings.getDefault(),
      options,
    )
  }
}
