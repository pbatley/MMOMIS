import React from 'react'

export const SketchButton: React.StatelessComponent<{ className?: string }> = ({ className }) => {
  return (
    <div className={className || ''}>
      <p className='govuk-heading-l'>Search for policies</p>
      <p>To search for a marine policy from a marine plan:</p>
      <ol>
        <li>
          use the drawing tool to create a shape on the map
          <details className='govuk-details mb0'>
            <summary className='govuk-details__summary'>
              <span className='govuk-details__summary-text'>How to draw a shape</span>
            </summary>
            <div className='govuk-details__text'>
              <ul>
                <li>zoom or drag the map to your area of interest</li>
                <li>click start drawing</li>
                <li>start to draw a shape by clicking anywhere within the blue marine plan boundaries to create your first point</li>
                <li>continue to draw the shape by clicking as many anchor points as needed</li>
                <li>double click to complete the shape</li>
              </ul>
            </div>
          </details>
        </li>
        <li>the policies that apply within your shape will be displayed on the left-hand side</li>
        <li>select ‘Clear drawing’ to start again</li>
      </ol>
    </div>
  )
}
