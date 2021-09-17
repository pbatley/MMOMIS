import { MapData, Sector, Group } from './contexts/App'
import { TreeItem } from './components/LeftTabControl'

export function flattenMapData(treeItems: TreeItem[]): Record<string, MapData> {
  let groupId = -1
  let sectorId = -1
  let mapDataId = -1
  return treeItems
    .reduce((acc, group) => {
      groupId++
      const groups = group.children.reduce((acc, sector) => {
        sectorId++
        const layers = sector.children.map(
          (layer): MapData => {
            mapDataId++
            return {
              url: layer.layerUrl,
              name: layer.text,
              selected: false,
              id: `${mapDataId}`,
              sectorId: `${sectorId}`,
              groupId: `${groupId}`,
              loaded: false,
              abstract: layer.abstract,
              lastUpdated: layer.lastUpdated,
              copyright: layer.copyright,
              dataSources: layer.dataSources,
            }
          },
        )
        return acc.concat(layers)
      }, [])
      return acc.concat(groups)
    }, [])
    .reduce(
      (acc, mapData) => {
        acc[mapData.id] = mapData
        return acc
      },
      {} as Record<string, MapData>,
    )
}

export function flattenSectors(treeItems: TreeItem[]): Record<string, Sector> {
  const sectors = treeItems.reduce(
    (acc, group, groupId) => {
      return acc.concat(group.children.map(it => ({ id: '', name: it.text })))
    },
    [] as { id: string; name: string }[],
  )
  return sectors.reduce(
    (acc, sector, sectorId) => {
      acc[sectorId] = { ...sector, id: `${sectorId}`, collapsed: true }
      return acc
    },
    {} as Record<string, Sector>,
  )
}

export function flattenGroups(treeItems: TreeItem[]): Record<string, Group> {
  return treeItems.reduce(
    (acc, group, groupId) => {
      acc[groupId] = { id: `${groupId}`, name: group.text, collapsed: true }
      return acc
    },
    {} as Record<string, Group>,
  )
}

export function groupByGroup(mapData: MapData[]): Array<MapData[]> {
  const dict = mapData.reduce(
    (acc, mapData) => {
      if (!(mapData.groupId in acc)) {
        acc[mapData.groupId] = []
      }
      acc[mapData.groupId].push(mapData)
      return acc
    },
    {} as Record<string, MapData[]>,
  )
  return Object.values(dict)
}

export function groupBySector(mapData: MapData[]): Array<MapData[]> {
  const dict = mapData.reduce(
    (acc, mapData) => {
      if (!(mapData.sectorId in acc)) {
        acc[mapData.sectorId] = []
      }
      acc[mapData.sectorId].push(mapData)
      return acc
    },
    {} as Record<string, MapData[]>,
  )
  return Object.values(dict)
}
