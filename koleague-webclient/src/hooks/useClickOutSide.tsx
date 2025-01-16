import * as React from 'react'
export interface IuseClickOutsideProps {}

export default function useOnClickOutside(
  ref: React.RefObject<any>,
  handler: (event: React.MouseEventHandler<any>) => void
) {
  React.useEffect(
    () => {
      const listener = (event: any) => {
        if (!ref.current || ref.current.contains(event?.target)) {
          return
        }
        handler(event)
      }

      document.addEventListener('mousedown', listener)
      document.addEventListener('touchstart', listener)

      return () => {
        document.removeEventListener('mousedown', listener)
        document.removeEventListener('touchstart', listener)
      }
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  )
}