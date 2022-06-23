# Power BI SVG Map

Microsoft's [Power BI](https://powerbi.microsoft.com/) is a dashboarding & data visualization tool for business intelligence. This repository contains a [custom visual](https://powerbi.microsoft.com/en-us/developers/custom-visualization/) for Power BI to plot data on an interactive map. This is accomplished by uploading an [SVG](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics) map within the visual and configuring it with the required data.

See <https://docs.microsoft.com/en-us/power-bi/developer/visuals/environment-setup> on how to install the environment to build this custom visual.

## Current Stack

Click links below to find respective documentation. In order of decreasing significance:

1. [Preact](https://preactjs.com/): Small & fast React alternative
2. [d3](https://github.com/d3/d3): Data visualization & plotting library
3. [Twind](https://github.com/tw-in-js/twind): Tailwind-inspired CSS-in-JS library
4. [Nanostores](https://github.com/nanostores/nanostores): Global app state management
5. [Wouter](https://github.com/molefrog/wouter): Minimalist page routing system
6. [Preact-Feather](https://github.com/ForsakenHarmony/preact-feather): Icon library

## Current Maintainers

- [@Interpause](https://github.com/Interpause)

## Credits

Initially developed by [@Interpause](https://github.com/Interpause).

## Move into Issues for Tracking

- Create custom webpack toolchain
  - `pbiviz` has no interface for modifying build process
  - Necessary to support Babel, with is needed for:
    - `preact/compat`: Preact's compatibility layer for React's ecosystem
    - `twin.macro`: More featureful, better maintained equivalent of Twind
- User guide including documentation of data fields
- Documentation & Developer guide
