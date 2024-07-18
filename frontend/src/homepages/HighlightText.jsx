import React from 'react'

export const HighlightText = ({text}) => {
  return (
    <span className='bg-gradient-to-b bg-clip-text text-transparent from-[#00C9FF] to-[#92FE9D]'>{text}</span>
  )
}
