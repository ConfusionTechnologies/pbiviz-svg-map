import { ComponentProps } from 'preact'
import { tw } from 'twind/css'

export interface CircleProps extends ComponentProps<'div'> {
  label?: string
  value?: string
}

function Circle({ label = '', value = '', tw: tw1, ...props }: CircleProps) {
  const style = [tw`relative border(1 black) rounded-1/2 w-full h-full`, tw1]
  return (
    <div tw={style} {...props}>
      <p tw='relative text(center lg) font-bold -top-7 m-0 mt-[50%]'>
        {label}
        <br />
        <em>{value}</em>
      </p>
    </div>
  )
}

export default Circle
