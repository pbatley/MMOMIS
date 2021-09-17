import express from 'express'
const helmet = require('helmet');
import path from 'path'
import { PolicyPage, PolicyErrorPage, ReactRoot } from './views'
import { renderToStaticMarkup } from 'react-dom/server'
import * as React from 'react'
import { Redirect } from './views/oauth-callback'
import { queryCmsByPolicyCode, lookupCmsErrorMessage, queryCmsLayerTaxonomies, getMapData } from './queryCms'

const port = process.env.PORT || 3000
const app = express()

app.use(helmet())

app.use('/static', express.static(path.join(__dirname, 'node_modules/@mis/client/dist')))
app.use('/assets', express.static(path.join(__dirname, 'node_modules/govuk-frontend/assets')))
app.use('/style.css', express.static(path.join(__dirname, 'dist/main.css')))
app.use('/base', express.static(path.join(__dirname, 'node_modules/arcgis-js-api/themes/base')))

app.get('/', async (req, res) => {
  const mapData = await getMapData()
  res.send(`<!DOCTYPE html>${renderToStaticMarkup(<ReactRoot treeItems={mapData} />)}`)
})

app.get('/oauth-callback', (req, res) => {
  res.send(`<!DOCTYPE html>${renderToStaticMarkup(<Redirect />)}`)
})

app.get('/policy/:code', async (req, res) => {
  try {
    const policy = await queryCmsByPolicyCode(req.params.code)
    res.send(
      `<!DOCTYPE html>${renderToStaticMarkup(
        <PolicyPage policy={policy} sector={req.query.s ? fromBase64(req.query.s) : undefined} />,
      )}`,
    )
  } catch (error) {
    const message = lookupCmsErrorMessage(error.errno || error)
    res.send(`<!DOCTYPE html>${renderToStaticMarkup(<PolicyErrorPage message={message} />)}`)
  }
})

app.get('/api/policy/:code', async (req, res) => {
  try {
    const policy = await queryCmsByPolicyCode(req.params.code)
    res.json(policy)
  } catch (error) {
    res.json({ ok: false, message: `ERROR: ${error}` })
  }
})

app.get('/api/taxonomies', async (req, res) => {
  try {
    const config = await queryCmsLayerTaxonomies()
    res.json(config)
  } catch (error) {
    res.json({ ok: false, message: `ERROR: ${error}` })
  }
})

app.listen(port, () => {
  console.log('Listening on port', port)
})

function fromBase64(value: string): string {
  return Buffer.from(value, 'base64').toString('ascii')
}
