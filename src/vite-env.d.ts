/// <reference types="vite/client" />

declare module '*.png' {
  const value: string
  export default value
}

declare module '*.jpg' {
  const value: string
  export default value
}

declare module '*.jpeg' {
  const value: string
  export default value
}

declare module '*.gif' {
  const value: string
  export default value
}

declare module '*.svg' {
  import { FunctionComponent } from 'react'
  export const ReactComponent: FunctionComponent<React.SVGAttributes<SVGElement>>
  const src: string
  export default src
}
