import test from 'tape'
import { flattenMapData, flattenSectors, flattenGroups, groupByGroup, groupBySector } from './utils'
import { TreeItem } from './components/LeftTabControl'

const empty: TreeItem[] = [
  {
    text: 'Fishing and aquaculture',
    children: [],
  },
]
const oneGroupOneSectorOneChildren: TreeItem[] = [
  {
    text: 'Fishing and aquaculture',
    children: [
      {
        text: 'Fishing',
        children: [
          {
            text: 'Average over 15m vessel effort',
            layerUrl:
              'https://services.arcgis.com/JJzESW51TqeY9uat/arcgis/rest/services/fishing_activity/FeatureServer/0',
            abstract: '',
            lastUpdated: '',
            copyright: '',
            dataSources: '',
          },
        ],
      },
    ],
  },
]
const oneGroupTwoSectors: TreeItem[] = [
  {
    text: 'Fishing and aquaculture',
    children: [
      {
        text: 'Fishing',
        children: [
          {
            text: 'Average over 15m vessel effort',
            layerUrl:
              'https://services.arcgis.com/JJzESW51TqeY9uat/arcgis/rest/services/fishing_activity/FeatureServer/0',
            abstract: '',
            lastUpdated: '',
            copyright: '',
            dataSources: '',
          },
        ],
      },
      {
        text: 'Aquaculture',
        children: [
          {
            text: 'Bivalve classification areas',
            layerUrl:
              'https://services.arcgis.com/JJzESW51TqeY9uat/arcgis/rest/services/MPDS_Economic/FeatureServer/54',
            abstract: '',
            lastUpdated: '',
            copyright: '',
            dataSources: '',
          },
        ],
      },
    ],
  },
]
const twoGroups: TreeItem[] = [
  {
    text: 'Fishing and aquaculture',
    children: [
      {
        text: 'Fish',
        children: [
          {
            text: 'Average over 15m vessel effort',
            layerUrl:
              'https://services.arcgis.com/JJzESW51TqeY9uat/arcgis/rest/services/fishing_activity/FeatureServer/0',
            abstract: '',
            lastUpdated: '',
            copyright: '',
            dataSources: '',
          },
        ],
      },
    ],
  },
  {
    text: 'Natural environment',
    children: [
      {
        text: 'Fish',
        children: [
          {
            text: 'High intensity spawning grounds',
            layerUrl: 'https://services.arcgis.com/JJzESW51TqeY9uat/arcgis/rest/services/Fish_Habitat/FeatureServer/1',
            abstract: '',
            lastUpdated: '',
            copyright: '',
            dataSources: '',
          },
        ],
      },
    ],
  },
]

test('it should flatten map data', assert => {
  assert.deepEqual(flattenMapData([]), {})
  assert.deepEqual(flattenMapData(empty), {})
  assert.deepEqual(flattenMapData(oneGroupOneSectorOneChildren), {
    0: {
      url: 'https://services.arcgis.com/JJzESW51TqeY9uat/arcgis/rest/services/fishing_activity/FeatureServer/0',
      name: 'Average over 15m vessel effort',
      selected: false,
      id: '0',
      sectorId: '0',
      groupId: '0',
      loaded: false,
    },
  })
  assert.deepEqual(flattenMapData(oneGroupTwoSectors), {
    0: {
      url: 'https://services.arcgis.com/JJzESW51TqeY9uat/arcgis/rest/services/fishing_activity/FeatureServer/0',
      name: 'Average over 15m vessel effort',
      selected: false,
      id: '0',
      sectorId: '0',
      groupId: '0',
      loaded: false,
    },
    1: {
      url: 'https://services.arcgis.com/JJzESW51TqeY9uat/arcgis/rest/services/MPDS_Economic/FeatureServer/54',
      name: 'Bivalve classification areas',
      selected: false,
      id: '1',
      sectorId: '1',
      groupId: '0',
      loaded: false,
    },
  })
  assert.deepEqual(flattenMapData(twoGroups), {
    0: {
      url: 'https://services.arcgis.com/JJzESW51TqeY9uat/arcgis/rest/services/fishing_activity/FeatureServer/0',
      name: 'Average over 15m vessel effort',
      selected: false,
      id: '0',
      sectorId: '0',
      groupId: '0',
      loaded: false,
    },
    1: {
      url: 'https://services.arcgis.com/JJzESW51TqeY9uat/arcgis/rest/services/Fish_Habitat/FeatureServer/1',
      name: 'High intensity spawning grounds',
      selected: false,
      id: '1',
      sectorId: '1',
      groupId: '1',
      loaded: false,
    },
  })
  assert.end()
})

test('it should flatten sectors', assert => {
  assert.deepEqual(flattenSectors([]), {})
  assert.deepEqual(flattenSectors(empty), {})
  assert.deepEqual(flattenSectors(oneGroupOneSectorOneChildren), { 0: { id: '0', name: 'Fishing', collapsed: true } })
  assert.deepEqual(flattenSectors(oneGroupTwoSectors), {
    0: { id: '0', name: 'Fishing', collapsed: true },
    1: { id: '1', name: 'Aquaculture', collapsed: true },
  })
  assert.deepEqual(flattenSectors(twoGroups), {
    0: { id: '0', name: 'Fish', collapsed: true },
    1: { id: '1', name: 'Fish', collapsed: true },
  })
  assert.end()
})

test('it should flatten groups', assert => {
  assert.deepEqual(flattenGroups([]), {})
  assert.deepEqual(flattenGroups(empty), { 0: { id: '0', name: 'Fishing and aquaculture', collapsed: true } })
  assert.deepEqual(flattenGroups(oneGroupOneSectorOneChildren), {
    0: { id: '0', name: 'Fishing and aquaculture', collapsed: true },
  })
  assert.deepEqual(flattenGroups(oneGroupTwoSectors), {
    0: { id: '0', name: 'Fishing and aquaculture', collapsed: true },
  })
  assert.deepEqual(flattenGroups(twoGroups), {
    0: { id: '0', name: 'Fishing and aquaculture', collapsed: true },
    1: { id: '1', name: 'Natural environment', collapsed: true },
  })
  assert.end()
})

const zero = {
  url: 'https://services.arcgis.com/JJzESW51TqeY9uat/arcgis/rest/services/fishing_activity/FeatureServer/0',
  name: 'Average over 15m vessel effort',
  selected: false,
  id: '0',
  sectorId: '0',
  groupId: '0',
  loaded: false,
  abstract: '',
  lastUpdated: '',
  copyright: '',
  dataSources: '',
}
const one = {
  url: 'https://services.arcgis.com/JJzESW51TqeY9uat/arcgis/rest/services/MPDS_Economic/FeatureServer/54',
  name: 'Bivalve classification areas',
  selected: false,
  id: '1',
  sectorId: '1',
  groupId: '0',
  loaded: false,
  abstract: '',
  lastUpdated: '',
  copyright: '',
  dataSources: '',
}

test('it should group by groups', assert => {
  assert.deepEqual(groupByGroup([]), [])
  assert.deepEqual(groupByGroup([zero, one]), [[zero, one]])
  assert.deepEqual(groupByGroup([zero, { ...one, groupId: '1' }]), [[zero], [{ ...one, groupId: '1' }]])
  assert.end()
})

test('it should group by sectors', assert => {
  assert.deepEqual(groupBySector([]), [])
  assert.deepEqual(groupBySector([zero, { ...one, sectorId: '0' }]), [[zero, { ...one, sectorId: '0' }]])
  assert.deepEqual(groupBySector([zero, one]), [[zero], [one]])
  assert.end()
})
