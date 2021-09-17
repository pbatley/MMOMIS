import React, { useContext, useState } from 'react'
import { AppContext, SelectFeatureOID, SelectPolicy, SelectItems, ContextState } from '../contexts/App'
import { PolicyItem } from '../gis_components/query'
import { gaPageView } from '../components/GoogleAnalytics'
import { clearSketchGraphics } from '../gis_components/map'

export const CountUserSelection: React.StatelessComponent<{ className?: string }> = ({ className }) => {
  const { state, dispatch } = useContext<ContextState>(AppContext)
  const { selectedItems } = state

  const onSelectItem = async (index: number, policyCode: string) => {
    gaPageView(`/policy/${policyCode}`)
    dispatch(SelectFeatureOID(index))
    dispatch(SelectPolicy(policyCode))
  }

  const spatiallySpecificPolicies = selectedItems.filter(it => it.IsSpatial)
  const planAreaPoliecies = selectedItems.filter(it => !it.IsSpatial)

  return (
    <div className={className || ''}>
      <p className='govuk-heading-l'>Policy results</p>
      <ResetButton
        text='Clear drawing'
        onClick={() => {
          clearSketchGraphics()
          dispatch(SelectItems([]))
          dispatch(SelectPolicy(undefined))
        }}
      />
      <Reveal
        className='bb bt b--gov-azure pt3'
        heading={
          <div>
            <span className='gov-azure'>
              <a
                tabIndex={0}
                onKeyDown={e => {
                  return e.keyCode === 13 ? e.currentTarget.click() : false
                }}
              >
                Spatially specific policies ({spatiallySpecificPolicies.length})
              </a>
            </span>
            <p className='pr4'>These policies apply specifically to the area you have selected:</p>
          </div>
        }
      >
        <ul className='list pl0'>
          {spatiallySpecificPolicies.map((it, index) => (
            <Policy key={index} policy={it} onClick={() => onSelectItem(it.OBJECTID, it.PolicyCode)} />
          ))}
        </ul>
      </Reveal>
      <Reveal
        className='bb b--gov-azure pt3'
        heading={
          <div>
            <span className='gov-azure'>
              <a
                tabIndex={0}
                onKeyDown={e => {
                  return e.keyCode === 13 ? e.currentTarget.click() : false
                }}
              >
                Plan area policies ({planAreaPoliecies.length})
              </a>
            </span>
            <p className='pr4'>These policies apply to the whole marine plan area where you have drawn the shape:</p>
          </div>
        }
      >
        <ul className='list pl0'>
          {planAreaPoliecies.map((it, index) => (
            <Policy key={index} policy={it} onClick={() => onSelectItem(it.OBJECTID, it.PolicyCode)} />
          ))}
        </ul>
      </Reveal>
    </div>
  )
}

export const Policy: React.StatelessComponent<{ policy: PolicyItem; onClick?: () => void }> = ({ policy, onClick }) => {
  return (
    <li key={policy.OBJECTID} onClick={() => (!!onClick ? onClick.call(null) : null)} className='mv3 pointer'>
      <div className='flex'>
        <p className='w-30 mv1 gov-text-secondary'>Policy code</p>
        <p className='gov-azure underline mv1'>
          <a
            tabIndex={0}
            onKeyDown={e => {
              return e.keyCode === 13 ? e.currentTarget.click() : false
            }}
          >
            {policy.PolicyCode}
          </a>
        </p>
      </div>
      <div className='flex'>
        <p className='w-30 mv1 gov-text-secondary'>Sector</p>
        <p className='mv1'>{policy.Sector}</p>
      </div>
    </li>
  )
}

export const Reveal: React.StatelessComponent<{ heading: JSX.Element; className?: string }> = ({
  heading,
  className,
  children,
}) => {
  const [visible, setVisibility] = useState(false)
  return (
    <div className={`${className || ''}`}>
      <div
        className={`relative pointer ${visible ? 'govuk-accordion__section--expanded' : ''}`}
        onClick={() => setVisibility(!visible)}
      >
        <div className='govuk-accordion__icon' /> {heading}
      </div>
      <div className={`${visible ? '' : 'dn'}`}>{children}</div>
    </div>
  )
}

export const ResetButton: React.StatelessComponent<{ text: string; className?: string; onClick?: () => void }> = ({
  text,
  className,
  onClick,
}) => {
  return (
    <button
      className={`govuk-body govuk-link bn pointer ph0 underline ${className || ''}`}
      onClick={() => onClick && onClick()}
    >
      {`${text} `}
      <svg className='h1 w1 v-mid ma1' viewBox='0 0 82 82' xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M41 0C18.4 0 0 18.4 0 41s18.4 41 41 41 41-18.4 41-41S63.6 0 41 0zm21.4 59.6c.8.8.8 2 0 2.8-.4.4-.9.6-1.4.6-.5 0-1-.2-1.4-.6L41 43.8 22.4 62.4c-.4.4-.9.6-1.4.6-.5 0-1-.2-1.4-.6-.8-.8-.8-2 0-2.8L38.2 41 19.6 22.4c-.8-.8-.8-2 0-2.8.8-.8 2-.8 2.8 0L41 38.2l18.6-18.6c.8-.8 2-.8 2.8 0 .8.8.8 2 0 2.8L43.8 41l18.6 18.6z'
          fill='#000'
          fillRule='nonzero'
        />
      </svg>
    </button>
  )
}
