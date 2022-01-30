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
