import { css, tw, apply } from 'twind/css'

const testClass = css`
  ${apply`bg-black`}

  p {
    ${apply`text-white lg:(mx-auto inset-x-auto) `}
    width: 50px
  }
`

function App() {
  return (
    <div class={tw(testClass)}>
      <p>Hello world!</p>
    </div>
  )
}

export default App
