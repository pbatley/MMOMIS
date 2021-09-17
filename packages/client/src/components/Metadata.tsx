import React, { useContext } from 'react'
import { AppContext, ContextState, SelectMapData } from '../contexts/App'

export const Metadata: React.StatelessComponent<{ className?: string }> = ({ className }) => {
  const { state, dispatch } = useContext<ContextState>(AppContext)

  if (!(state.selectedMapDataId in state.mapData)) {
    return <div />
  }

  const mapData = state.mapData[state.selectedMapDataId]
  return (
    <div className={className || ''}>
      <div className='ph3 pt2 ma2 overflow-auto h-100 bg-white relative'>
        <div className='absolute top-1 right-1'>
          <button
            className='govuk-body govuk-link bn pointer ph0 underline'
            onClick={() => dispatch(SelectMapData(undefined))}
          >
            Close panel
          </button>
        </div>

        <h2 className='govuk-heading-l mt2 mb3'>{mapData.name}</h2>
        <ul className='list pl0'>
          <li className='flex bb b--light-gray mb2 pb1'>
            <p className='w-30 b mv2 gov-azure'>Last updated</p>
            <div className='w-70 mv2'>{convertISODateToGDS(mapData.lastUpdated)}</div>
          </li>
          <li className='flex bb b--light-gray mb2 pb1'>
            <p className='w-30 b mv2 gov-azure'>Data sources</p>
            <div
              className='w-70 mv2'
              dangerouslySetInnerHTML={{ __html: mapData.dataSources || 'Data sources not available.' }}
            />
          </li>
          <li className='flex bb b--light-gray mb3 pb1'>
            <p className='w-30 b mv2 gov-azure'>Copyright</p>
            <div className='w-70 mv2'>{mapData.copyright || 'Copyright not available.'}</div>
          </li>
          <li className='mb3'>
            <p className='b mv2 gov-azure'>Abstract</p>
            <p className='mv2' dangerouslySetInnerHTML={{__html: mapData.abstract || 'Abstract not available.'}}></p>
          </li>
        </ul>
      </div>
    </div>
  )
}

const ExportIcon: React.StatelessComponent<{ className?: string }> = ({ className }) => {
  return (
    <svg viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' className={className || ''}>
      <g fill='#005EA5' fillRule='nonzero'>
        <path d='M17.293 1.293a1 1 0 0 1 1.414 1.414l-9 9a1 1 0 1 1-1.414-1.414l9-9z' />
        <path d='M17 3h-4a1 1 0 0 1 0-2h5a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V3zM15 11.5a1 1 0 0 1 2 0v5.625A2.875 2.875 0 0 1 14.125 20H2.875A2.875 2.875 0 0 1 0 17.125V5.875A2.875 2.875 0 0 1 2.875 3h6.094a1 1 0 0 1 0 2H2.875A.875.875 0 0 0 2 5.875v11.25c0 .483.392.875.875.875h11.25a.875.875 0 0 0 .875-.875V11.5z' />
      </g>
    </svg>
  )
}

function convertISODateToGDS(isoDate: string) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  const d = new Date(isoDate)
  return d.toLocaleDateString('en-GB', options).replace(',', '')
}
