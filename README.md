# What is this?

I don't know what I am doing.

## Limitations found so far

- Unless I setup the entire webpack build chain myself (which I have done before, but don't have time to do or debug right now), `pbiviz` doesn't provide any way to modify webpack's build process.
  - Which means no support for aliasing of `preact` to `react` (which will bite for anything more complex than "handwritten" later)
    - Which means `@emotion/react` wouldn't work for example
  - Which also means no support for Babel
    - Which means no `twin.macro`
  - For now, have to fallback on framework-agnostic version of `emotion`
    - It is good enough, & still superior to having to write CSS externally

## Experiments

The Code world changes very fast. Before you know it, you are obsolete. I will be trying out `twind` instead of `twin.macro` + `emotion`. It purports to be framework-agnostic, & doesn't need a compile step. Which is useful here since I cannot modify the webpack config. If it turns out to be better than what I was using before... welp `interpause-components` gonna need a major version revision...

hey holy crap twind works
