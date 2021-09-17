export const cmsPolicyApiEndpoint = 'https://marine-policy-summaries.marineservices.org.uk/jsonapi/node/marine_policy'

export const queryCmsLayerTaxonomiesEndpoint = 'https://marine-policy-summaries.marineservices.org.uk/view/layers'

export const cmsAllSectorsApiEndpoint =
  'https://marine-policy-summaries.marineservices.org.uk/jsonapi/taxonomy_term/sectors'
export const cmsTaxonomyApiEndpoint =
  'https://marine-policy-summaries.marineservices.org.uk/jsonapi/paragraph/layer_paragraph'

// Incorrect endpoint URI for unhappy path testing
export const fakeCmsPolicyApiEndpoint = 'http://localhost/jsonapi/node/marine_policy'
export const fakeCmsLayerMetaDataApiEndpoint = 'http://localhost/jsonapi/node/layer_meta_data'

// Error messages
export const cmsErrorMessages = [
  {
    error: 'ECONNREFUSED',
    message: 'Unable to connect to the content management service. Please try again later.',
  },
  {
    error: 'E404',
    message: 'Policy not found. Please check the policy code, and try again.',
  },
]
