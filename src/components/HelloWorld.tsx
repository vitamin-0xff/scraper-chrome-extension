import { useState } from 'react'

export default function HelloWorld(props: { msg: string }) {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>{props.msg}</h1>
      <div className="card">
        <button type="button" onClick={() => setCount(count + 1)}>
          count is
          {' '}
          {count}
        </button>
      </div>
    </>
  )
}
