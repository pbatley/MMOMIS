import React, { useEffect, useContext, useState, Fragment } from 'react'
import { initializeSketchVM, initialize, view, checkVisibleLayersScale } from '../gis_components/map'
import { AppContext, SelectItems, AppState, RemoveError, ShowError, ContextState } from '../contexts/App'
import { queryPolicyItemsByExtent } from '../gis_components/query'
import { Spinner } from './Spinner'
import watchUtils = require('esri/core/watchUtils')
import Tippy from '@tippy.js/react'
import { clearSketchGraphics } from '../gis_components/map'
import Graphic = require('esri/Graphic')
import { Polygon } from 'esri/geometry'

export const WebMapView: React.StatelessComponent<{ isPolicyView: boolean }> = ({ children, isPolicyView }) => {
  const [sketchViewModel] = useState(initializeSketchVM())
  const [isLoaderVisible, setLoaderVisible] = useState(false)
  const [isButtonVisible, setButtonVisible] = useState(true)
  const [isVisibleLayersScale, setVisibleLayersScale] = useState(false)
  const [hasError, setError] = useState(false)
  const { state, dispatch } = useContext<ContextState>(AppContext)

  const [tooltipText, setTooltip] = useState('')
  const [tooltipEnabled, setTooltipEnabled] = useState(false)
  const [tipClassName, setTipClassName] = useState('showTooltip')

  useEffect(() => {
    initialize(document.querySelector('.webmap'))
      .then(() => {
        let vertexCount: number = 0
        sketchViewModel.on('undo', async (event: SketchEvent) => {
          vertexCount = vertexCount - 1
          let ttText = ''
          if (vertexCount === 1) {
            ttText = 'Click to continue drawing'
          } else {
            ttText = 'Double click to close'
          }
          setTooltip(ttText)
        })

        sketchViewModel.on('create', async (event: SketchEvent) => {
          if (event.toolEventInfo && event.toolEventInfo.type === 'vertex-add') {
            const polygon = event.graphic.geometry as Polygon
            const vertexes = polygon.rings[0]
            vertexCount = vertexes.length - 1
            if (vertexCount === 0) {
              vertexCount = 1
            }
            let ttText = ''
            if (vertexCount === 1) {
              ttText = 'Click to continue drawing'
            } else {
              ttText = 'Click again or double click to complete'
            }
            setTooltip(ttText)
          }

          if (event.state === 'complete') {
            setTooltip('')
            setTooltipEnabled(false)
            setTipClassName('hideTooltip')
            setLoaderVisible(true)
            try {
              const policyItems = await queryPolicyItemsByExtent(event)
              setLoaderVisible(false)
              policyItems.length > 0 ? dispatch(SelectItems(policyItems)) : setButtonVisible(true)
            } catch (error) {
              setLoaderVisible(false)
              dispatch(ShowError('failerPoliciesQuery'))
              setButtonVisible(true)
            }
          }
        })
      })
      .catch(error => {
        setError(true)
      })
  }, [])

  useEffect(() => {
    watchUtils.whenTrue(view, 'stationary', () => {
      setVisibleLayersScale(checkVisibleLayersScale())
    })
  }, [])

  useEffect(() => {
    setVisibleLayersScale(checkVisibleLayersScale())
  }, [
    Object.values(state.mapData).filter(it => it.loaded).length,
    Object.values(state.mapData).filter(it => it.selected).length,
  ])

  useEffect(() => {
    state.selectedItems.length === 0 ? setButtonVisible(true) : setButtonVisible(false)
  }, [state.selectedItems.length])

  const startSketch = () => {
    setButtonVisible(false)
    clearSketchGraphics()
    sketchViewModel.create('polygon', {
      mode: 'click',
    })

    setTooltip('Click to start drawing')
    setTooltipEnabled(true)
    setTipClassName('showTooltip')
    sketchViewModel.view.focus()
  }

  const firstError = (Object.keys(state.globalErrors) as Array<keyof AppState['globalErrors']>).find(
    it => state.globalErrors[it],
  )
  return (
    <div className='relative h-100'>
      {hasError ? (
        <ErrorSummary message="The map couldn't be loaded." className='ma4' />
      ) : (
        <Fragment>
          {firstError ? (
            <GlobalErrors
              errorName={firstError}
              className='absolute top-0 left-0 z-3 w-100'
              onClick={() => dispatch(RemoveError(firstError))}
            />
          ) : null}
          {!isPolicyView && isVisibleLayersScale ? <Warning /> : null}
          {isLoaderVisible ? <Spinner className='sk-fading-circle h4 w4 absolute z-3 vhcenter' /> : <div />}
          {isPolicyView && isButtonVisible ? (
            <div className='absolute vhcenter z-2 bg-white-80 pa5'>
              <button onClick={() => startSketch()} className='govuk-button govuk-button--start mb0'>
                Start drawing
              </button>
            </div>
          ) : null}

          <Tippy
            followCursor={true}
            className={tipClassName}
            enabled={tooltipEnabled}
            hideOnClick={false}
            content={tooltipText}
          >
            <div className='webmap z-1' />
          </Tippy>
        </Fragment>
      )}
    </div>
  )
}

interface SketchEvent {
  state: 'complete' | 'start' | 'active'
  type: 'create'
  toolEventInfo: { type: string }
  graphic: Graphic
}

export const Warning: React.StatelessComponent<{}> = ({}) => {
  return (
    <p className='bg-black white position absolute top-1 z-3 vcenter ph3 pv2' data-test='zoom-to-view'>
      Zoom in to view this data
    </p>
  )
}

export const ErrorSummary: React.StatelessComponent<{ message?: string; className?: string }> = ({
  message,
  className,
}) => {
  return (
    <div
      className={`govuk-error-summary ${className || ''}`}
      aria-labelledby='error-summary-title'
      role='alert'
      tabIndex={-1}
      data-module='error-summary'
    >
      <h2 className='govuk-error-summary__title' id='error-summary-title'>
        There is a problem
      </h2>
      <div className='govuk-error-summary__body'>
        <ul className='govuk-list govuk-error-summary__list'>
          <li>{message}</li>
        </ul>
      </div>
    </div>
  )
}

export const GlobalErrors: React.StatelessComponent<{
  errorName: keyof AppState['globalErrors']
  className?: string
  onClick: () => void
}> = ({ errorName, className, onClick }) => {
  switch (errorName) {
    case 'failedLayer':
      return (
        <div className={className}>
          <ErrorSummaryPopup message='Unable to display this map data' className='bg-white ma4' onClick={onClick}>
            <a className='govuk-link' href='mailto:planning@marinemanagement.org.uk'>
              Contact the MMO
            </a>
          </ErrorSummaryPopup>
        </div>
      )
    case 'failedPolicy':
      return (
        <div className={className}>
          <ErrorSummaryPopup message='The policy cannot be displayed' className='bg-white ma4' onClick={onClick}>
            <a
              className='govuk-link'
              href='https://www.gov.uk/topic/planning-development/marine-planning'
              target='_blank'
            >
              View policy documents related to this region
            </a>
          </ErrorSummaryPopup>
        </div>
      )
    case 'failerPoliciesQuery':
      return (
        <div className={className}>
          <ErrorSummaryPopup message='Unable to retrieve policy information' className='bg-white ma4' onClick={onClick}>
            <a
              className='govuk-link'
              href='https://www.gov.uk/topic/planning-development/marine-planning'
              target='_blank'
            >
              View policy documents related to this region
            </a>
          </ErrorSummaryPopup>
        </div>
      )
    default:
      assertUnreachable(errorName)
      return <Fragment />
  }
}

function assertUnreachable(x: never): void {
  //
}

export const ErrorSummaryPopup: React.StatelessComponent<{
  message?: string
  className?: string
  onClick: () => void
}> = ({ children, message, className, onClick }) => {
  return (
    <div
      className={`govuk-error-summary relative ${className || ''}`}
      aria-labelledby='error-summary-title'
      role='alert'
      tabIndex={-1}
      data-module='error-summary'
    >
      <button className='govuk-link absolute top-1 right-1 z-3 bg-white bn pointer' onClick={onClick}>
        <svg className='h1 w1' viewBox='0 0 557 557' xmlns='http://www.w3.org/2000/svg'>
          <path
            // tslint:disable-next-line: max-line-length
            d='M4 59L59 4c5-5 13-5 18 0l201 201C345 138 413 71 480 4c5-5 13-5 18 0 18 18 36 37 55 55 5 5 5 13 0 18L352 278c67 67 134 135 201 202 5 5 5 13 0 18-19 18-37 36-55 55-5 5-13 5-18 0-67-67-135-134-202-201L77 553c-5 5-13 5-18 0-18-19-37-37-55-55-5-5-5-13 0-18 67-67 134-135 201-202L4 77c-5-5-5-13 0-18z'
            fill='#000'
            fillRule='evenodd'
          />
        </svg>
      </button>
      <h2 className='govuk-error-summary__title' id='error-summary-title'>
        There is a problem
      </h2>
      <div className='govuk-error-summary__body'>
        <ul className='govuk-list govuk-error-summary__list'>
          <li>{message}</li>
        </ul>
        {children}
      </div>
    </div>
  )
}
