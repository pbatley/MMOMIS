import React, { useEffect } from 'react'

export const LegendControl: React.StatelessComponent<{ className?: string }> = ({ className }) => {
  useEffect(() => {
    import('../gis_components/map').then(it => {
      it.initializeLegend(document.querySelector('.divLegend'))
    })
  }, [])

  return <div className={`divLegend ${className || ''}`} id='divLegend' />
}
