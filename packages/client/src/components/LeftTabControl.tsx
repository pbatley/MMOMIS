import React, { ChangeEvent, useState, useContext, useEffect } from 'react'
import { setLayersVisible } from '../gis_components/map'
import { SketchButton } from './SketchButton'
import { CountUserSelection, ResetButton } from './UserSelection'
import {
  AppContext,
  MapData,
  Group,
  UncollapseGroup,
  CollapseGroup,
  Sector,
  CollapseSector,
  UncollapseSector,
  CheckMapData,
  CollapseAll,
  UncollapseAll,
  UncheckAll,
  UncheckMapData,
  ShowError,
  LoadedMapData,
  ContextState,
  SelectMapData,
} from '../contexts/App'
import { gaPageView } from '../components/GoogleAnalytics'
import { groupBySector, groupByGroup } from '../utils'
import { ExportIcon } from '../index'

export const LeftTabControl: React.StatelessComponent<{ onChange?: (index: number) => void }> = ({ onChange }) => {
  const { state } = useContext(AppContext)
  return (
    <Tabs
      className='h-100 ma0'
      onChange={onChange}
      tabs={[
        {
          name: 'Map data',
          element: (
            <div className='h-100 overflow-auto'>
              <p className='govuk-heading-l'>Marine activity data</p>
              <p>To search for activities in a specific area:</p>
              <ol>
                <li>zoom in on the map to your chosen area</li>
                <li>
                  select the data you want to see on the map from the list below or by using the filter map data tool
                </li>
                <li>once added to the map, click on activity layers to see further information</li>
                <li>
                  click on <InfoIcon className='w1 h1 dib' /> next to the activity name on the list below to see the
                  associated metadata
                </li>
              </ol>
              <p>
                Alternatively, you can use the Marine plan policies tab or the&#32;
                <a
                  href='https://www.gov.uk/government/publications/marine-plan-areas-in-england'
                  target='_blank'
                  className='govuk-link'
                >
                  Marine planning documents <ExportIcon className='h1 w1 v-top pl1' />
                </a>
                &#32;themselves to find policies related to your area of interest
              </p>
              <RenderLayerList className='pt3' />
            </div>
          ),
        },
        {
          name: 'Marine plan policies',
          element: (
            <div className='h-100 overflow-auto'>
              {state.selectedItems.length > 0 ? <CountUserSelection /> : <SketchButton />}
            </div>
          ),
        },
      ]}
    />
  )
}

export const Checkbox: React.StatelessComponent<{
  description: string
  value: string
  id: string
  className?: string
  isChecked: boolean
  onChange: (event?: ChangeEvent<HTMLInputElement>) => void
}> = ({ description, value, id, className, onChange, isChecked }) => {
  return (
    <div className={`pv2 mr3 ${className || ''}`}>
      <div className='govuk-checkboxes__item' key={id}>
        <input
          className='govuk-checkboxes__input'
          id={id}
          name={id}
          type='checkbox'
          defaultValue={value}
          onChange={onChange}
          checked={isChecked}
        />
        <label className='govuk-label govuk-checkboxes__label' htmlFor={id}>
          {description}
        </label>
      </div>
    </div>
  )
}

function match(string: string | null, searchTerm: string | null) {
  return (
    isStringNotEmpty(string) &&
    isStringNotEmpty(searchTerm) &&
    `${string}`.toLowerCase().indexOf(`${searchTerm}`.toLowerCase()) > -1
  )
}

function isStringNotEmpty(value: unknown): value is string {
  return {}.toString.call(value) === '[object String]' && (value as string).length > 0
}

export const RenderLayerList: React.StatelessComponent<{
  className?: string
}> = ({ className }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const { state, dispatch } = useContext<ContextState>(AppContext)

  const mapData = Object.values(state.mapData).filter(it =>
    `${searchTerm}`.length > 2 ? match(it.name, searchTerm) : true,
  )
  const hasAtLeastOneUncollapsed =
    Object.values(state.sectors).some(it => !it.collapsed) || Object.values(state.groups).some(it => !it.collapsed)
  const hasAtLestOneChecked = Object.values(state.mapData).some(it => it.selected)

  useEffect(() => {
    if (`${searchTerm}`.length > 2) {
      dispatch(UncollapseAll())
    }
  }, [searchTerm])

  return (
    <div className={className || ''}>
      <div className='mh1 relative'>
        <label htmlFor='mapdata' className='sr-only'>
          Filter map data
        </label>
        <input
          id='mapdata'
          name='mapdata'
          type='text'
          placeholder='Filter map data'
          className='magnifying govuk-input bn bt bb b--light-gray pt4 pl5 pb4'
          onChange={event => setSearchTerm(event.target.value)}
          value={searchTerm}
        />
        <svg className='absolute top-1 left-1 h2 w2' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M40.282 40.28a21.271 21.271 0 0 1-15.138 6.27 21.263 21.263 0 0 1-15.135-6.27c-8.348-8.348-8.348-21.927 0-30.274 4.173-4.174 9.652-6.259 15.135-6.259a21.357 21.357 0 0 1 15.139 6.259c8.347 8.347 8.347 21.926 0 30.274M59.04 56.386L44.194 41.54c8.505-9.874 8.1-24.822-1.26-34.185-9.806-9.807-25.77-9.807-35.576 0-9.81 9.81-9.81 25.77 0 35.576 4.75 4.751 11.066 7.369 17.786 7.369a24.94 24.94 0 0 0 16.398-6.11L56.39 59.038c.367.368.847.548 1.323.548.48 0 .96-.18 1.328-.548a1.876 1.876 0 0 0 0-2.651'
            fill='#000'
            fillRule='nonzero'
          />
        </svg>
      </div>

      <div className='relative pb5 mt4 bb bw1 b--gov-azure'>
        {hasAtLestOneChecked ? (
          <ResetButton
            text='Clear all'
            onClick={() => {
              dispatch(CollapseAll())
              dispatch(UncheckAll())
            }}
            className='absolute top-1 left-0'
          />
        ) : null}
        {mapData.length > 0 ? (
          <button
            className={`govuk-body govuk-link bn gov-azure pointer absolute top-1 right-0 ${
              hasAtLeastOneUncollapsed ? '' : 'o-50'
            }`}
            onClick={() => dispatch(CollapseAll())}
            disabled={!hasAtLeastOneUncollapsed}
            tabIndex={0}
          >
            Collapse all
          </button>
        ) : null}
      </div>
      {mapData.length > 0 ? (
        <div className='pt0'>
          {groupByGroup(mapData).map(it => {
            const group = state.groups[it[0].groupId]
            return <GroupElement mapData={it} group={group} key={group.id} />
          })}
        </div>
      ) : (
        <div>
          <p className='govuk-body pt3' data-test='noresults'>
            There's no map data that matches your search. Try again by:
          </p>
          <ul>
            <li>widening your search</li>
            <li>using a keyword eg: fish</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export const GroupElement: React.StatelessComponent<{
  mapData: MapData[]
  group: Group
  className?: string
}> = ({ className, mapData, group }) => {
  const { dispatch, state } = useContext(AppContext)
  return (
    <div className={`bb bw1 b--gov-azure pv2`}>
      <Reveal
        heading={
          <a
            className='h2 govuk-heading-s relative gov-azure ma0 normal'
            tabIndex={0}
            onKeyDown={e => {
              return e.keyCode === 13 ? e.currentTarget.click() : false
            }}
          >
            {group.name}
          </a>
        }
        className='mv3'
        isCollapsed={group.collapsed}
        onClick={() => (group.collapsed ? dispatch(UncollapseGroup(group.id)) : dispatch(CollapseGroup(group.id)))}
      >
        <ul className='list pl0 mb4'>
          {groupBySector(mapData).map(it => {
            const sector = state.sectors[it[0].sectorId]
            return <SectorElement mapData={it} sector={sector} key={sector.id} />
          })}
        </ul>
      </Reveal>
    </div>
  )
}

export const SectorElement: React.StatelessComponent<{
  mapData: MapData[]
  sector: Sector
  className?: string
}> = ({ className, mapData, sector }) => {
  const { dispatch } = useContext(AppContext)
  return (
    <Reveal
      heading={
        <span className='dib mr4'>
          <a
            tabIndex={0}
            onKeyDown={e => {
              return e.keyCode === 13 ? e.currentTarget.click() : false
            }}
          >
            {sector.name}
          </a>
        </span>
      }
      className='mv3'
      isCollapsed={sector.collapsed}
      onClick={() => (sector.collapsed ? dispatch(UncollapseSector(sector.id)) : dispatch(CollapseSector(sector.id)))}
    >
      <ul className={`list pl3 mt2 govuk-checkboxes--small`}>
        {mapData.map(it => (
          <MapDataElement mapData={it} key={it.id} />
        ))}
      </ul>
    </Reveal>
  )
}

export const MapDataElement: React.StatelessComponent<{
  mapData: MapData
  className?: string
}> = ({ className, mapData }) => {
  const { dispatch } = useContext(AppContext)
  const [isFirstRun, setFirstRun] = useState(true)

  useEffect(() => {
    isFirstRun
      ? setFirstRun(false)
      : setLayersVisible({ layerUrl: mapData.url, text: mapData.name }, mapData.selected)
          .then(() => {
            dispatch(LoadedMapData(mapData.id))
          })
          .catch(() => {
            dispatch(UncheckMapData(mapData.id))
            dispatch(ShowError('failedLayer'))
          })
  }, [mapData.selected])

  return (
    <li className={`mapdata flex ${className || ''}`}>
      <Checkbox
        description={mapData.name}
        value=''
        id={toId(mapData.name)}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          event.target.checked ? dispatch(CheckMapData(mapData.id)) : dispatch(UncheckMapData(mapData.id))
        }}
        isChecked={mapData.selected}
        className='flex-auto'
      />
      <button className='govuk-link bn bg-white mt3 mb2 h2 w2 mr2' onClick={() => dispatch(SelectMapData(mapData.id))}>
        <InfoIcon className='h-100 w-100' />
      </button>
    </li>
  )
}

function toId(raw: string): string {
  return raw.toLowerCase().replace(/[^\w]+/g, '-')
}

interface TabPanel {
  name: string
  element: JSX.Element
}

export const Reveal: React.StatelessComponent<{
  heading: JSX.Element
  className?: string
  isCollapsed: boolean
  onClick: () => void
}> = ({ heading, className, children, isCollapsed, onClick }) => {
  return (
    <div className={`${className || ''}`}>
      <div className={`relative pointer ${isCollapsed ? '' : 'govuk-accordion__section--expanded'}`} onClick={onClick}>
        <div className='govuk-accordion__icon' /> {heading}
      </div>
      <div className={`${isCollapsed ? 'dn' : ''}`}>{children}</div>
    </div>
  )
}

export const Tabs: React.StatelessComponent<{
  tabs: TabPanel[]
  className?: string
  onChange?: (index: number) => void
}> = ({ tabs, className, onChange }) => {
  const [currentTab, setCurrentTab] = useState(0)
  return (
    <div id='main' className={`govuk-tabs flex flex-column ${className || ''}`}>
      <h2 className='govuk-tabs__title'>Contents</h2>
      <ul className='govuk-tabs__list pt2'>
        {tabs.map((it, index) => {
          return (
            <li className='govuk-tabs__list-item' key={index}>
              <a
                className={`govuk-tabs__tab ${index === currentTab ? 'govuk-tabs__tab--selected' : ''}`}
                href={toId(`tab-${it.name}`)}
                onClick={event => onClick.call(null, event, index, it.name)}
              >
                {it.name}
              </a>
            </li>
          )
        })}
      </ul>

      {tabs.map((it, index) => {
        return (
          <section
            className={`govuk-tabs__panel flex-auto h-100 ${index === currentTab ? '' : 'govuk-tabs__panel--hidden'}`}
            id={toId(`tab-${it.name}`)}
            key={index}
          >
            {it.element}
          </section>
        )
      })}
    </div>
  )

  function onClick(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, index: number, name?: string) {
    event.preventDefault()
    gaPageView(window.location.pathname + name)
    setCurrentTab(index)
    onChange(index)
  }
}

export interface TreeItem {
  text: string
  children: {
    text: string
    children: {
      layerUrl: string
      text: string
      abstract: string | null
      lastUpdated: string | null
      dataSources: string | null
      copyright: string | null
    }[]
  }[]
}

export interface LayerItem {
  text: string
  layerUrl: string
}

export const InfoIcon: React.StatelessComponent<{
  className?: string
}> = ({ className }) => {
  return (
    <svg className={className || ''} viewBox='0 0 25 25' xmlns='http://www.w3.org/2000/svg'>
      <g fill='#010101' fillRule='nonzero'>
        <path d='M12.4 0C5.6 0 0 5.6 0 12.4c0 6.8 5.6 12.4 12.4 12.4 6.8 0 12.4-5.6 12.4-12.4C24.8 5.6 19.1 0 12.4 0zm0 23.2c-5.9 0-10.8-4.9-10.8-10.8S6.5 1.6 12.4 1.6s10.8 4.9 10.8 10.8-4.9 10.8-10.8 10.8z' />
        <g transform='translate(11 5)'>
          <path d='M2.5 13.2c0 .5-.4 1-1 1h-.3c-.5 0-1-.4-1-1V4.9c0-.5.4-1 1-1h.3c.5 0 1 .4 1 1v8.3z' />
          <circle cx='1.4' cy='1.7' r='1.1' />
        </g>
      </g>
    </svg>
  )
}
