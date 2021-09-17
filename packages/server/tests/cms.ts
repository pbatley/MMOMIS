import { Browser } from 'puppeteer'
import { lookupCmsErrorMessage } from '../queryCms'
import { TestCase } from 'tape'
import { resolve } from 'url'

export function Cms(browser: Browser, baseUrl: string, test: (name: string, cb: TestCase) => void) {
  test('should handle missing policy codes', async assert => {
    try {
      const page = await browser.newPage()
      await page.goto(resolve(baseUrl, '/policy/S-DD-3'))
      const message = await page.$eval('.govuk-list.govuk-error-summary__list > li', el => el.innerHTML)
      if (message !== lookupCmsErrorMessage('E404')) {
        assert.fail(`Error, I found a policy that does not exist:\nmessage: ${message}`)
        return
      }
      assert.end()
    } catch (error) {
      assert.fail(error)
    }
  })
  test('should display an error when the connection is refused', async assert => {
    assert.equal(
      lookupCmsErrorMessage('ECONNREFUSED'),
      'Unable to connect to the content management service. Please try again later.',
    )
    assert.end()
  })
  test('should display an error when the the policy is not found', async assert => {
    assert.equal(lookupCmsErrorMessage('E404'), 'Policy not found. Please check the policy code, and try again.')
    assert.end()
  })
}
