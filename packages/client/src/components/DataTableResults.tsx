import React, { useContext, useEffect, useState } from 'react'
import { AppContext, SelectPolicy, FullPolicy, ShowError, ContextState } from '../contexts/App'
import ky from 'ky'
import { Spinner } from './Spinner'

export const DataTableResults: React.StatelessComponent<{ className?: string }> = ({ className }) => {
  const { state, dispatch } = useContext<ContextState>(AppContext)
  const [isLoaderVisible, setLoaderVisible] = useState(false)
  const [cache, setCache] = useState({} as Record<string, Partial<FullPolicy>>)

  useEffect(() => {
    if (!state.selectedFeaturePolicyCode) {
      return
    }
    if (state.selectedFeaturePolicyCode in cache) {
      return
    }
    setLoaderVisible(true)
    ky.get(`/api/policy/${state.selectedFeaturePolicyCode}`)
      .json()
      .then((policy: Partial<FullPolicy> | PolicyError) => {
        setLoaderVisible(false)
        if ('ok' in policy) {
          return
        }
        setCache({ ...cache, [policy.code]: policy })
      })
      .catch(() => {
        setLoaderVisible(false)
        dispatch(ShowError('failedPolicy'))
      })
  }, [state.selectedFeaturePolicyCode])

  const policieNames = Object.keys(cache).filter(it => it === state.selectedFeaturePolicyCode)
  if (policieNames.length === 0) {
    return isLoaderVisible ? <Spinner className='sk-fading-circle h4 w4 absolute z-3 vhcenter' /> : <div />
  }

  const policy = cache[policieNames[0]]
  const selectedItem = state.selectedItems.find(it => it.PolicyCode === policy.code)
  return (
    <div className={className || ''}>
      <div className='ph3 ma2 overflow-auto h-100 bg-white'>
        <div className='flex pt3'>
          <div className='flex-auto'>
            <a href={`/policy/${policy.code}?s=${btoa(selectedItem.Sector)}`} className='govuk-link' target='_blank'>
              Open in a new tab <ExportIcon className='h1 w1 v-top pl1' />
            </a>
          </div>

          <button
            className='govuk-body govuk-link bn pointer ph0 underline'
            onClick={() => dispatch(SelectPolicy(undefined))}
          >
            Close
          </button>
        </div>

        <h2 className='govuk-heading-l mt2 mb3'>
          {policy.code} {selectedItem.Sector}
        </h2>

        <ul className='list pl0'>
          <li className='flex bb b--light-gray mb3'>
            <p className='w-30 b mv2 gov-azure'>Policy</p>
            <div
              className='w-70 mv2 policy-content'
              dangerouslySetInnerHTML={{ __html: policy.title || 'No policy reason provided' }}
            />
          </li>
          <li className='flex mb3'>
            <p className='w-30 b mv2 gov-azure'>Policy supporting data</p>
            <p className='w-70 mv2'>{policy.copyright || 'None.'}</p>
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

interface PolicyError {
  ok: boolean
  message: string
}
