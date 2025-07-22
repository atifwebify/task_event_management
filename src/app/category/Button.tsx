'use client'
import React, { useState } from 'react'

const Button = () => {

    const [counter, setCounter] = useState(1)

  return (
    <div>
        {counter}
        <button onClick={() => setCounter(counter + 1)}>Increment</button>
    </div>
  )
}

export default Button
