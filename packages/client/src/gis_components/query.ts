// esri
import QueryTask = require('esri/tasks/QueryTask')
import Query = require('esri/tasks/support/Query')
import { PolicyUrl } from '../config'
import Geometry = require('esri/geometry/Geometry')

export interface PolicyItem {
  OBJECTID: number
  PolicyCode: string
  Sector: string
  Geometry?: Geometry
  IsSpatial: number
}

// query policy items and return our custom interface for policy
export async function queryPolicyItemsByExtent(event: any): Promise<PolicyItem[]> {
  // send of query to get results
  const queryTask = new QueryTask({
    url: PolicyUrl,
  })
  const query = new Query()
  query.returnGeometry = false
  query.outFields = ['OBJECTID', 'PolicyCode', 'Sector', 'isSpatial']
  query.geometry = event.graphic.geometry

  const featureSet = await queryTask.execute(query)
  return featureSet.features.map(feat => {
    return {
      OBJECTID: feat.attributes.OBJECTID,
      PolicyCode: feat.attributes.PolicyCode,
      Sector: feat.attributes.Sector,
      IsSpatial: feat.attributes.isSpatial,
    }
  })
}

// query policies items (by oids) and return our custom interface for policies
export const queryPolicyItemsByOids = async (oids: number[]): Promise<PolicyItem[]> => {
  // zoom to that feature
  const queryTask = new QueryTask({
    url: PolicyUrl,
  })
  const query = new Query()
  query.where = `OBJECTID IN (${oids.join(',')})`
  query.returnGeometry = true
  query.outFields = ['OBJECTID']

  const featureSet = await queryTask.execute(query)
  return featureSet.features.map(feat => {
    return {
      OBJECTID: feat.attributes.OBJECTID,
      PolicyCode: feat.attributes.PolicyCode,
      Geometry: feat.geometry,
      Sector: feat.attributes.Sector,
      IsSpatial: feat.attributes.isSpatial,
    }
  })
}
