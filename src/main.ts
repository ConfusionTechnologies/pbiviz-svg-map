import powerbi from 'powerbi-visuals-api'

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions
import IVisual = powerbi.extensibility.visual.IVisual

import { createElement, render } from 'preact'
import { setup as setupTwind } from '@twind/preact'

import App from './App'
import { VisualSettings } from './settings'
import { vizData, vizConfig } from './store/powerBI'

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

    // yknow that both React & Preact creates an async shadow dom right?
    render(createElement(App, {}), this.rootElem)
  }

  update(options: VisualUpdateOptions) {
    /*
    from observation, dataViews[0] always exist
    from research, powerBI at some point intended for multiple dataViews
    to be possible, but it never happened. So assuming 1 dataView is fine.
    */
    const dataView = options.dataViews[0]
    if (!dataView) throw 'DataView missing!'

    const settings = VisualSettings.parse<VisualSettings>(dataView)
    this.settings = settings

    // update global state, Preact container will pick up on this
    vizConfig.set(settings)
    vizData.set(dataView)
  }

  enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions) {
    return VisualSettings.enumerateObjectInstances(
      this.settings || VisualSettings.getDefault(),
      options,
    )
  }
}
