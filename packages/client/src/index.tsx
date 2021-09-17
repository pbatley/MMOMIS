import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import { DataTableResults } from './components/DataTableResults'
import { Header } from './components/Header'
import { AppProvider } from './contexts/App'

import { LeftTabControl, TreeItem } from './components/LeftTabControl'
import { WebMapView } from './components/WebMapView'
import { LegendControl } from './components/LegendControl'

import { gaPageView } from './components/GoogleAnalytics'
import { Metadata } from './components/Metadata'
gaPageView(window.location.pathname + window.location.search)

const Banner: React.StatelessComponent<{ className?: string }> = ({ className }) => {
  return (
    <div className={`govuk-phase-banner ${className || ''}`}>
      <p className='govuk-phase-banner__content'>
        <strong className='govuk-tag govuk-phase-banner__content__tag '>beta</strong>
        <span className='govuk-phase-banner__text'>
          This is a new service – your{' '}
          <a className='govuk-link' href='#'>
            feedback
          </a>{' '}
          will help us to improve it.
        </span>
      </p>
    </div>
  )
}

export const ExportIcon: React.StatelessComponent<{ className?: string }> = ({ className }) => {
  return (
    <svg viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' className={className || ''}>
      <g fill='#005EA5' fillRule='nonzero'>
        <path d='M17.293 1.293a1 1 0 0 1 1.414 1.414l-9 9a1 1 0 1 1-1.414-1.414l9-9z' />
        <path d='M17 3h-4a1 1 0 0 1 0-2h5a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0V3zM15 11.5a1 1 0 0 1 2 0v5.625A2.875 2.875 0 0 1 14.125 20H2.875A2.875 2.875 0 0 1 0 17.125V5.875A2.875 2.875 0 0 1 2.875 3h6.094a1 1 0 0 1 0 2H2.875A.875.875 0 0 0 2 5.875v11.25c0 .483.392.875.875.875h11.25a.875.875 0 0 0 .875-.875V11.5z' />
      </g>
    </svg>
  )
}

const App: React.StatelessComponent<{ treeItems: TreeItem[] }> = ({ treeItems }) => {
  const [isPolicyView, setPolicyView] = useState(false)
  return (
    <AppProvider treeItems={treeItems}>
      <div className='flex flex-column header-wrapper'>
        <Header />
        <div className='bg-gov-azure h10p mh4' />
        <Banner className='mh4 pv' />
      </div>
      <div className='flex flex-auto'>
        <div className='flex flex-auto ph4 pb4 pt2'>
          <div className='w-30 h-100'>
            <LeftTabControl
              onChange={index => {
                index === 1 ? setPolicyView(true) : setPolicyView(false)
              }}
            />
          </div>
          <div className='flex-auto map-wrapper relative'>
            <div className='absolute top-1 right-0'>
              <a href='mailto:planning@marinemanagement.org.uk' className='govuk-link'>
                Contact <ExportIcon className='h1 w1 v-top pl1' />
              </a>
              <a href='https://www.gov.uk/topic/planning-development/marine-planning' className='govuk-link mh3'>
                Marine planning documents <ExportIcon className='h1 w1 v-top pl1' />
              </a>
            </div>
            <div className='w-100 h-100 relative'>
              <WebMapView isPolicyView={isPolicyView} />
              {isPolicyView ? null : <LegendControl className='top-1 right-1 absolute w-20' />}
              <DataTableResults className='w-100 h-40 absolute bottom-1 left-0' />
              <Metadata className='w-100 h-40 absolute bottom-1 left-0' />
            </div>
          </div>
        </div>
      </div>
    </AppProvider>
  )
}

export function run(treeItems: TreeItem[]) {
  ReactDOM.render(<App treeItems={treeItems} />, document.getElementById('root'))
}
