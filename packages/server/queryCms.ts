import {
  cmsPolicyApiEndpoint,
  cmsAllSectorsApiEndpoint,
  queryCmsLayerTaxonomiesEndpoint,
  cmsErrorMessages,
  cmsTaxonomyApiEndpoint,
} from './config'
import axios from 'axios'
import { TreeItem } from './views'

export interface Policy {
  code: string
  copyright: string
  implementation: string
  type: string
  objective: number
  title: string
  description: string
  reason: string
}

export interface LayerMetaData {
  abstract: string
  name: string
  owner: string
  updated: string
}

export const queryCmsByPolicyCode = async (code: string) => {
  const response = await axios.get<DrupalPolicyResponse>(`${cmsPolicyApiEndpoint}?filter[field_code]=${code}`)
  if (response.data && response.data.data.length === 0) {
    return Promise.reject('E404')
  }
  const data = response.data.data[0].attributes
  const policy: Partial<Policy> = {
    code: data.field_code ? data.field_code : undefined,
    copyright: data.field_copyright ? data.field_copyright : undefined,
    implementation: data.field_implementation ? data.field_implementation.value : undefined,
    type: data.field_type ? data.field_type.value : undefined,
    objective: data.field_objective ? data.field_objective : undefined,
    title: data.field_title ? data.field_title.value : undefined,
    description: data.field_description ? data.field_description.value : undefined,
    reason: data.field_reason ? data.field_reason.value : undefined,
  }
  return policy
}

export const queryCmsLayerTaxonomies = async () => {
  const response = await axios.get<DrupalLayer[]>(`${queryCmsLayerTaxonomiesEndpoint}`)
  if (response.data && response.data.length === 0) {
    return Promise.reject('E404')
  }
  const treeItems = transformCmsLayerTaxonomiesResponse(response.data)
  return { treeItems }
}

function transformCmsLayerTaxonomiesResponse(data: DrupalLayer[]) {
  const config = data.reduce(
    (acc, it) => {
      const layers = parseLayerString(it.layer)
      const group = it.group
      const subGroup = it['sub-group']
      if (!(group in acc)) {
        acc[group] = []
      }
      acc[group].push({ text: subGroup, children: layers })
      return acc
    },
    {} as Record<string, { text: string; children: LayerItem[] }[]>,
  )
  return Object.keys(config).map(groupName => {
    return {
      text: groupName,
      children: config[groupName],
    }
  })
}

function parseLayerString(layerString: string): LayerItem[] {
  const layers = layerString.split(', ')
  return layers.map(it => {
    return {
      text: it.replace(/<a[^>]*>(.*)<\/[^>]*>/gi, '$1'),
      layerUrl: it.replace(/^<a href="(.*)".*$/gi, '$1'),
    }
  })
}

export const lookupCmsErrorMessage = (key: string): string => {
  const error = cmsErrorMessages.find(lookup => lookup.error === key)
  if (error) {
    return error.message
  }
  return 'An unknown error has occured. Please try again later.'
}

export async function getAllSectors() {
  const response = await axios.get<DrupalLayerAllSectorsResponse>(`${cmsAllSectorsApiEndpoint}`)
  if (response.data && response.data.data.length === 0) {
    return Promise.reject('E404')
  }
  return response.data.data.map(it => ({ id: it.id, name: it.attributes.name }))
}

export async function getMapData(): Promise<TreeItem[]> {
  const data = await fetchAllPages<DrupalTaxonomy>(`${cmsTaxonomyApiEndpoint}`)
  const mapData = data.map(it => {
    return {
      sector: it.attributes.field_layer_child_group,
      group: it.attributes.field_layer_parent_group,
      url: it.attributes.field_layer_link.uri,
      name: it.attributes.field_layer_link.title,
      lastUpdated: it.attributes.field_layer_last_updated,
      abstract: !!it.attributes.field_layer_abstract ? it.attributes.field_layer_abstract.value : null,
      copyright: it.attributes.field_layer_copyright,
      dataSources: (it.attributes.field_layer_data_sources || { value: '' }).value,
    }
  })
  return groupBy(mapData, 'group').map(group => {
    const sectors = groupBy(group, 'sector').map(sector => {
      const sectorName = sector[0].sector
      return {
        text: sectorName,
        children: sector.map(it => {
          return {
            text: it.name,
            layerUrl: it.url,
            abstract: it.abstract,
            lastUpdated: it.lastUpdated,
            copyright: it.copyright,
            dataSources: it.dataSources,
          }
        }),
      }
    })
    const groupName = group[0].group
    return {
      text: groupName,
      children: sectors,
    }
  })
}

async function fetchAllPages<T>(url: string) {
  const response = await axios.get<DrupalPaginated<T>>(url)
  let data: T[] = []
  data = data.concat(response.data.data)
  if (response.data && !!response.data.links.next) {
    const res = await fetchAllPages<T>(response.data.links.next.href)
    data = data.concat(res)
  }
  return data
}

interface DrupalPolicyResponse {
  data: {
    attributes: Partial<{
      field_code: string
      field_copyright: string
      field_implementation: { value: string }
      field_type: { value: string }
      field_objective: number
      field_title: { value: string }
      field_sector: {
        data: { id: string }
      }
      field_description: { value: string }
      field_reason: { value: string }
    }>
  }[]
}

interface DrupalLayer {
  layer: string
  group: string
  'sub-group': string
}

interface LayerItem {
  text: string
  layerUrl: string
}

interface DrupalLayerAllSectorsResponse {
  data: {
    id: string
    attributes: {
      name: string
    }
  }[]
}

interface DrupalTaxonomy {
  attributes: {
    field_layer_abstract: { value: string } | null
    field_layer_child_group: string
    field_layer_last_updated: string
    field_layer_link: {
      uri: string
      title: string
    }
    field_layer_parent_group: string
    field_layer_copyright: string | null
    field_layer_data_sources: { value: string } | null
  }
}

export function groupBy<T extends Record<string, any>>(mapData: T[], key: keyof T): Array<T[]> {
  const dict = mapData.reduce(
    (acc, mapData) => {
      if (!(mapData[key] in acc)) {
        acc[mapData[key]] = []
      }
      acc[mapData[key]].push(mapData)
      return acc
    },
    {} as Record<string, T[]>,
  )
  return Object.values(dict)
}

interface DrupalPaginated<T> {
  data: T[]
  links: {
    first?: {
      href: string
    }
    prev?: {
      href: string
    }
    self: {
      href: string
    }
    next?: {
      href: string
    }
  }
}
