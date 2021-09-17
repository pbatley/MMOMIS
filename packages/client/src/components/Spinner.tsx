import React, { useState, useEffect } from 'react'

export const Spinner: React.StatelessComponent<{ className?: string }> = ({ className }) => {
  const [visible, setVisibility] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisibility(true), 600)
  })

  return (
    <div className={`sk-fading-circle ${className || ''} ${visible ? '' : 'dn'}`}>
      <div className='sk-circle1 sk-circle' />
      <div className='sk-circle2 sk-circle' />
      <div className='sk-circle3 sk-circle' />
      <div className='sk-circle4 sk-circle' />
      <div className='sk-circle5 sk-circle' />
      <div className='sk-circle6 sk-circle' />
      <div className='sk-circle7 sk-circle' />
      <div className='sk-circle8 sk-circle' />
      <div className='sk-circle9 sk-circle' />
      <div className='sk-circle10 sk-circle' />
      <div className='sk-circle11 sk-circle' />
      <div className='sk-circle12 sk-circle' />
    </div>
  )
}
