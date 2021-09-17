import React, { createContext, useReducer } from 'react'
import { PolicyItem } from '../gis_components/query'
import { flattenMapData, flattenSectors, flattenGroups } from '../utils'
import { TreeItem } from '../components/LeftTabControl'

export interface AppState {
  // array of selected user items
  selectedItems?: PolicyItem[]
  // when the user selects a feature
  selectedFeatureOID?: number
  selectedFeaturePolicyCode?: string
  currentFeatureOID?: number
  battingData?: Batting[]
  currentTab: number
  mapData: Record<string, MapData>
  sectors: Record<string, Sector>
  groups: Record<string, Group>
  globalErrors: {
    failedLayer: boolean
    failedPolicy: boolean
    failerPoliciesQuery: boolean
  }
  selectedMapDataId?: string
}

export type ContextState = { state: AppState; dispatch: (action: Actions) => void }

export interface MapData {
  id: string
  sectorId: string
  groupId: string
  url: string
  name: string
  selected: boolean
  loaded: boolean
  abstract: string | null
  lastUpdated: string | null
  dataSources: string | null
  copyright: string | null
}

export interface Sector {
  id: string
  name: string
  collapsed: boolean
}

export interface Group {
  id: string
  name: string
  collapsed: boolean
}

export interface FullPolicy {
  code: string
  copyright: string
  implementation: string
  type: string
  objective: number
  title: string
  description: string
  reason: string
}

// main application context
export const AppContext = createContext(undefined)

export function SelectItems(items: PolicyItem[]) {
  return {
    type: 'selectedItems' as const,
    selectedItems: items,
  }
}

export function CheckMapData(mapDataId: string) {
  return {
    type: 'checkMapData' as const,
    mapDataId,
  }
}

export function UncheckMapData(mapDataId: string) {
  return {
    type: 'uncheckMapData' as const,
    mapDataId,
  }
}

export function UncheckAll() {
  return {
    type: 'uncheckAll' as const,
  }
}

export function CollapseSector(sectorId: string) {
  return {
    type: 'collapseSector' as const,
    sectorId,
  }
}

export function UncollapseSector(sectorId: string) {
  return {
    type: 'uncollapseSector' as const,
    sectorId,
  }
}

export function CollapseGroup(groupId: string) {
  return {
    type: 'collapseGroup' as const,
    groupId,
  }
}

export function UncollapseGroup(groupId: string) {
  return {
    type: 'uncollapseGroup' as const,
    groupId,
  }
}

export function CollapseAll() {
  return {
    type: 'collapseAll' as const,
  }
}

export function UncollapseAll() {
  return {
    type: 'uncollapseAll' as const,
  }
}

export function SelectFeatureOID(featureOID: number) {
  return {
    type: 'selectedFeatureOID' as const,
    selectedFeatureOID: featureOID,
  }
}

export function SelectPolicy(policyCode: string) {
  return {
    type: 'selectedPolicyCode' as const,
    selectedFeaturePolicyCode: policyCode,
  }
}

export function SelectBattingData(battingData: Batting[]) {
  return {
    type: 'selectedBattingData' as const,
    battingData,
  }
}

export function SelectTab(tabIndex: number) {
  return {
    type: 'selectedTabIndex' as const,
    tabIndex,
  }
}

export function ShowError(errorName: keyof AppState['globalErrors']) {
  return {
    type: 'showError' as const,
    errorName,
  }
}

export function RemoveError(errorName: keyof AppState['globalErrors']) {
  return {
    type: 'removeError' as const,
    errorName,
  }
}

export function LoadedMapData(mapDataId: string) {
  return {
    type: 'loadedMapData' as const,
    mapDataId,
  }
}

export function SelectMapData(mapDataId: string) {
  return {
    type: 'selectedMapDataId' as const,
    mapDataId,
  }
}

function assertUnreachable(x: never): void {}

export type Actions =
  | ReturnType<typeof SelectItems>
  | ReturnType<typeof SelectFeatureOID>
  | ReturnType<typeof SelectPolicy>
  | ReturnType<typeof SelectBattingData>
  | ReturnType<typeof SelectTab>
  | ReturnType<typeof CheckMapData>
  | ReturnType<typeof UncheckMapData>
  | ReturnType<typeof CollapseSector>
  | ReturnType<typeof UncollapseSector>
  | ReturnType<typeof CollapseGroup>
  | ReturnType<typeof UncollapseGroup>
  | ReturnType<typeof CollapseAll>
  | ReturnType<typeof UncollapseAll>
  | ReturnType<typeof UncheckAll>
  | ReturnType<typeof ShowError>
  | ReturnType<typeof RemoveError>
  | ReturnType<typeof LoadedMapData>
  | ReturnType<typeof SelectMapData>

function reducer(state: AppState, action: Actions): AppState {
  switch (action.type) {
    case 'selectedItems':
      return { ...state, selectedItems: action.selectedItems }
    case 'selectedFeatureOID':
      return { ...state, selectedFeatureOID: action.selectedFeatureOID }
    case 'selectedPolicyCode':
      return { ...state, selectedFeaturePolicyCode: action.selectedFeaturePolicyCode }
    case 'selectedBattingData':
      return { ...state, battingData: action.battingData }
    case 'selectedTabIndex':
      return { ...state, currentTab: action.tabIndex }
    case 'checkMapData': {
      return {
        ...state,
        mapData: { ...state.mapData, [action.mapDataId]: { ...state.mapData[action.mapDataId], selected: true } },
      }
    }
    case 'uncheckMapData': {
      return {
        ...state,
        mapData: { ...state.mapData, [action.mapDataId]: { ...state.mapData[action.mapDataId], selected: false } },
      }
    }
    case 'collapseSector': {
      return {
        ...state,
        sectors: { ...state.sectors, [action.sectorId]: { ...state.sectors[action.sectorId], collapsed: true } },
      }
    }
    case 'uncollapseSector': {
      return {
        ...state,
        sectors: { ...state.sectors, [action.sectorId]: { ...state.sectors[action.sectorId], collapsed: false } },
      }
    }
    case 'collapseGroup': {
      return {
        ...state,
        groups: { ...state.groups, [action.groupId]: { ...state.groups[action.groupId], collapsed: true } },
      }
    }
    case 'uncollapseGroup': {
      return {
        ...state,
        groups: { ...state.groups, [action.groupId]: { ...state.groups[action.groupId], collapsed: false } },
      }
    }
    case 'collapseAll': {
      return {
        ...state,
        groups: Object.keys(state.groups).reduce((acc, it) => {
          return { ...acc, [it]: { ...state.groups[it], collapsed: true } }
        }, state.groups),
        sectors: Object.keys(state.sectors).reduce((acc, it) => {
          return { ...acc, [it]: { ...state.sectors[it], collapsed: true } }
        }, state.sectors),
      }
    }
    case 'uncollapseAll': {
      return {
        ...state,
        groups: Object.keys(state.groups).reduce((acc, it) => {
          return { ...acc, [it]: { ...state.groups[it], collapsed: false } }
        }, state.groups),
        sectors: Object.keys(state.sectors).reduce((acc, it) => {
          return { ...acc, [it]: { ...state.sectors[it], collapsed: false } }
        }, state.sectors),
      }
    }
    case 'uncheckAll': {
      return {
        ...state,
        mapData: Object.keys(state.mapData).reduce((acc, it) => {
          return { ...acc, [it]: { ...state.mapData[it], selected: false } }
        }, state.mapData),
      }
    }
    case 'showError': {
      return {
        ...state,
        globalErrors: { ...state.globalErrors, [action.errorName]: true },
      }
    }
    case 'removeError': {
      return {
        ...state,
        globalErrors: { ...state.globalErrors, [action.errorName]: false },
      }
    }
    case 'loadedMapData': {
      return {
        ...state,
        mapData: { ...state.mapData, [action.mapDataId]: { ...state.mapData[action.mapDataId], loaded: true } },
      }
    }
    case 'selectedMapDataId': {
      return {
        ...state,
        selectedMapDataId: action.mapDataId,
      }
    }
    default:
      assertUnreachable(action)
  }
  return { ...state }
}

export const AppProvider: React.StatelessComponent<{ treeItems: TreeItem[] }> = ({ children, treeItems }) => {
  const [state, dispatch] = useReducer(reducer, {
    selectedItems: [],
    selectedFeatureOID: -1,
    currentFeatureOID: -1,
    selectedFeaturePolicyCode: '',
    battingData: [],
    currentTab: 0,
    mapData: flattenMapData(treeItems),
    sectors: flattenSectors(treeItems),
    groups: flattenGroups(treeItems),
    globalErrors: {
      failedLayer: false,
      failedPolicy: false,
      failerPoliciesQuery: false,
    },
  })

  const value = {
    state,
    dispatch,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export interface Batting {
  objective: number
  code: string
  sector: string
  title: string
  description: string
  reason: string
  implementation: string
  type: string
}
