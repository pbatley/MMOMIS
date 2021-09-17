import { launch, Browser } from 'puppeteer'
import { ok } from 'assert'
import commander from 'commander'
import test, { TestCase } from 'tape'
import { Cms } from './cms'

commander
  .version('1.0.0')
  .option('--url <url>', 'The url to test')
  .parse(process.argv)

ok(commander.url && `${commander.url}`.trim().length > 0, 'Please provide a valid URL')

run({ baseUrl: commander.url })

async function run({ baseUrl }: { baseUrl: string }) {
  const browser = await launch({ headless: false })

  test.onFinish(async () => await browser.close())
  ;(test as any).onFailure(async () => await browser.close())

  isUp(browser, baseUrl, (test as any).test)
  Cms(browser, baseUrl, (test as any).test)
  Search(browser, baseUrl, (test as any).test)
  ZoomToView(browser, baseUrl, (test as any).test)
}

function isUp(browser: Browser, baseUrl: string, test: (name: string, cb: TestCase) => void) {
  test('is up', async assert => {
    try {
      const page = await browser.newPage()
      await page.goto(baseUrl, { timeout: 1 * 60 * 1000 })
      assert.end()
    } catch (error) {
      assert.fail(error)
    }
  })
}

function Search(browser: Browser, baseUrl: string, test: (name: string, cb: TestCase) => void) {
  test('I can search for layers', async assert => {
    try {
      const page = await browser.newPage()
      await page.goto(baseUrl)
      await page.type('[name="mapdata"]', 'fish')
      const visibleCheckboxesForFish = await page.evaluate(
        () => document.querySelectorAll('.govuk-checkboxes--small > :not(.dn)').length,
      )
      assert.equal(visibleCheckboxesForFish, 10)
      await page.type('[name="mapdata"]', 'er')
      const visibleCheckboxesForFisher = await page.evaluate(
        () => document.querySelectorAll('.govuk-checkboxes--small > :not(.dn)').length,
      )
      assert.equal(visibleCheckboxesForFisher, 1)
      await page.type('[name="mapdata"]', '111')
      const visibleCheckboxesForDaniele = await page.evaluate(
        () => document.querySelectorAll('.govuk-checkboxes--small > :not(.dn)').length,
      )
      assert.equal(visibleCheckboxesForDaniele, 0)
      const noResults = await page.evaluate(element => element.textContent, await page.$('[data-test="noresults"]'))
      assert.equal(noResults, "There's no map data that matches your search. Try again by:")
      assert.end()
    } catch (error) {
      assert.fail(error)
    }
  })
}

function ZoomToView(browser: Browser, baseUrl: string, test: (name: string, cb: TestCase) => void) {
  test('I should zoom in more', async assert => {
    try {
      const page = await browser.newPage()
      await page.goto(baseUrl)
      await page.waitForSelector('.esri-view-surface canvas')
      await page.type('[name="mapdata"]', 'low')
      await page.click('#low-intensity-spawning-grounds')
      await page.waitForSelector('[data-test="zoom-to-view"]')
      await page.click('[title="Zoom In"]')
      await page.waitFor(500)
      await page.click('[title="Zoom In"]')
      await page.waitFor(500)
      try {
        await page.waitForSelector('[data-test="zoom-to-view"]', { timeout: 1000 })
        assert.fail('Zoom to view is still visible')
      } catch (error) {
        assert.pass('Zoom to view is hidden')
      }
      assert.end()
    } catch (error) {
      assert.fail(error)
    }
  })
}
