import { Fragment } from 'react'

/** Store name with any ampersand picked out in the accent colour. */
export default function BrandName({ name }: { name: string }) {
  return (
    <span className="text-xl">
      {name.split('&').map((part, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="text-accent">&amp;</span>}
          {part}
        </Fragment>
      ))}
      </span>
  )
}
