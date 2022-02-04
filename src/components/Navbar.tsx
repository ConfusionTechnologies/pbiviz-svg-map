import { ComponentProps } from 'preact'
import * as Icon from 'preact-feather'
import { apply, tw } from 'twind'

export type NavbarOptions = {
  icon: string
  route: string
  tip?: string
}[]

export interface NavbarProps extends ComponentProps<'div'> {
  options: NavbarOptions
  hook: [string, (newLocation: string) => any]
}

export default function Navbar({
  options,
  hook,
  class: className,
  ...props
}: NavbarProps) {
  const [, setLocation] = hook
  return (
    <div {...props} class={tw(apply`flex flex-col gap-2`, className)}>
      {options.map(({ icon, route, tip }) => {
        const RouteIcon = Icon[icon]
        return (
          <div tw='relative group'>
            <button
              tw='rounded border-black border p-0.5'
              onClick={() => setLocation(route)}
            >
              <RouteIcon />
            </button>
            {tip ? (
              <span tw='absolute right-8 top-1 text-sm whitespace-nowrap invisible group-hover:visible'>
                {tip}
              </span>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
