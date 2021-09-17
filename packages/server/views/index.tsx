import * as React from 'react'
import { Policy } from '../queryCms'
const naText = 'N/A'

export const ReactRoot: React.StatelessComponent<{ treeItems: TreeItem[] }> = ({ treeItems }) => {
  return (
    <html lang='en' className='react govuk-template '>
      <head>
        <meta charSet='utf-8' />
        <title>Explore marine plans</title>
        <meta name='viewport' content='width=device-width, initial-scale=1, viewport-fit=cover' />
        <meta name='theme-color' content='#0b0c0c' />
        <meta
          name='description'
          content='Find marine planning information for England including data on marine licenses and marine environmental designations on a map of the UK. Search for policy information from regional marine plans by outlining specific areas. This service is provided by the Marine Management Organisation (MMO).'
        />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />

        <link rel='shortcut icon' sizes='16x16 32x32 48x48' href='/assets/images/favicon.ico' type='image/x-icon' />
        <link rel='mask-icon' href='/assets/images/govuk-mask-icon.svg' color='#0b0c0c' />
        <link rel='apple-touch-icon' sizes='180x180' href='/assets/images/govuk-apple-touch-icon-180x180.png' />
        <link rel='apple-touch-icon' sizes='167x167' href='/assets/images/govuk-apple-touch-icon-167x167.png' />
        <link rel='apple-touch-icon' sizes='152x152' href='/assets/images/govuk-apple-touch-icon-152x152.png' />
        <link rel='apple-touch-icon' href='/assets/images/govuk-apple-touch-icon.png' />

        <meta property='og:image' content='/assets/images/govuk-opengraph-image.png' />
        <link rel='stylesheet' href='/style.css' />
      </head>

      <body className='govuk-template__body govuk-body mb0'>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.body.className = ((document.body.className) ? document.body.className + ' js-enabled' : 'js-enabled');`,
          }}
        />
        <a href='#main' className='govuk-skip-link'>
          Skip to main content
        </a>
        <div id='root' className='flex flex-column h-100' />
        <script src='/static/bundle.js' />
        <script
          dangerouslySetInnerHTML={{
            __html: `require(['src/index'], function(index) { index.run(${JSON.stringify(treeItems)}) })`,
          }}
        />
      </body>
    </html>
  )
}

export const Layout: React.StatelessComponent<{}> = ({ children }) => {
  return (
    <html lang='en' className='govuk-template '>
      <head>
        <meta charSet='utf-8' />
        <title>Explore marine plans</title>
        <meta name='viewport' content='width=device-width, initial-scale=1, viewport-fit=cover' />
        <meta name='theme-color' content='#0b0c0c' />
        <meta
          name='description'
          content='Find marine planning information for England including data on marine licenses and marine environmental designations on a map of the UK. Search for policy information from regional marine plans by outlining specific areas. This service is provided by the Marine Management Organisation (MMO).'
        />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />

        <link rel='shortcut icon' sizes='16x16 32x32 48x48' href='/assets/images/favicon.ico' type='image/x-icon' />
        <link rel='mask-icon' href='/assets/images/govuk-mask-icon.svg' color='#0b0c0c' />
        <link rel='apple-touch-icon' sizes='180x180' href='/assets/images/govuk-apple-touch-icon-180x180.png' />
        <link rel='apple-touch-icon' sizes='167x167' href='/assets/images/govuk-apple-touch-icon-167x167.png' />
        <link rel='apple-touch-icon' sizes='152x152' href='/assets/images/govuk-apple-touch-icon-152x152.png' />
        <link rel='apple-touch-icon' href='/assets/images/govuk-apple-touch-icon.png' />

        <meta property='og:image' content='/assets/images/govuk-opengraph-image.png' />
        <link rel='stylesheet' href='/style.css' />
      </head>

      <body className='govuk-template__body govuk-body mb0'>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.body.className = ((document.body.className) ? document.body.className + ' js-enabled' : 'js-enabled');`,
          }}
        />
        <a href='#main' className='govuk-skip-link'>
          Skip to main content
        </a>
        {!!children ? (
          children
        ) : (
          <React.Fragment>
            <div id='root' className='flex flex-column h-100' />
            <script src='/static/bundle.js' />
            <script dangerouslySetInnerHTML={{ __html: `require(['src/index'], function(index) { index.run() })` }} />
          </React.Fragment>
        )}
      </body>
    </html>
  )
}

export const PolicyPage: React.StatelessComponent<{ policy: Partial<Policy>; sector?: string }> = ({
  policy,
  sector,
}) => {
  return (
    <Layout>
      <Header />
      <div id='root' className='govuk-width-container'>
        <main className='govuk-main-wrapper ' id='main-content' role='main'>
          <h1 className='govuk-heading-xl'>
            {policy.code} {sector}
          </h1>
          <p className='govuk-heading-l'>Policy information</p>
          <dl className='govuk-summary-list'>
            <div className='govuk-summary-list__row'>
              <dt className='govuk-summary-list__key'>Policy</dt>
              <dd className='govuk-summary-list__value'>
                <div dangerouslySetInnerHTML={{ __html: policy.title || naText }} />
              </dd>
            </div>
          </dl>
          <p className='govuk-heading-l'>What is it?</p>
          <div dangerouslySetInnerHTML={{ __html: policy.description || naText }} />
          <p className='govuk-heading-l'>Why is it important?</p>
          <div dangerouslySetInnerHTML={{ __html: policy.reason || naText }} />
          <p className='govuk-heading-l'>How will this be implemented?</p>
          <div dangerouslySetInnerHTML={{ __html: policy.implementation || naText }} />
        </main>
      </div>
    </Layout>
  )
}

export const Header: React.StatelessComponent<{}> = () => {
  return (
    <header className='govuk-header' role='banner' data-module='header'>
      <div className='govuk-header__container govuk-width-container'>
        <div className='govuk-header__logo'>
          <a href='#' className='govuk-header__link govuk-header__link--homepage'>
            <span className='govuk-header__logotype'>
              <GovIcon />
              <span className='govuk-header__logotype-text'>GOV.UK</span>
            </span>
          </a>
        </div>
      </div>
    </header>
  )
}

export const ErrorSummary: React.StatelessComponent<{ message?: string }> = ({ message }: { message?: string }) => {
  return (
    <div
      className='govuk-error-summary'
      aria-labelledby='error-summary-title'
      role='alert'
      tabIndex={-1}
      data-module='error-summary'
    >
      <h1 className='govuk-error-summary__title' id='error-summary-title'>
        There is a problem
      </h1>
      <div className='govuk-error-summary__body'>
        <ul className='govuk-list govuk-error-summary__list'>
          <li>{message}</li>
        </ul>
      </div>
    </div>
  )
}

export const GovIcon: React.StatelessComponent<{}> = () => {
  return (
    <svg
      role='presentation'
      focusable='false'
      className='govuk-header__logotype-crown'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 132 97'
      height='32'
      width='36'
    >
      <path
        fill='currentColor'
        fillRule='evenodd'
        d='M25 30.2c3.5 1.5 7.7-.2 9.1-3.7 1.5-3.6-.2-7.8-3.9-9.2-3.6-1.4-7.6.3-9.1 3.9-1.4 3.5.3 7.5 3.9 9zM9 39.5c3.6 1.5 7.8-.2 9.2-3.7 1.5-3.6-.2-7.8-3.9-9.1-3.6-1.5-7.6.2-9.1 3.8-1.4 3.5.3 7.5 3.8 9zM4.4 57.2c3.5 1.5 7.7-.2 9.1-3.8 1.5-3.6-.2-7.7-3.9-9.1-3.5-1.5-7.6.3-9.1 3.8-1.4 3.5.3 7.6 3.9 9.1zm38.3-21.4c3.5 1.5 7.7-.2 9.1-3.8 1.5-3.6-.2-7.7-3.9-9.1-3.6-1.5-7.6.3-9.1 3.8-1.3 3.6.4 7.7 3.9 9.1zm64.4-5.6c-3.6 1.5-7.8-.2-9.1-3.7-1.5-3.6.2-7.8 3.8-9.2 3.6-1.4 7.7.3 9.2 3.9 1.3 3.5-.4 7.5-3.9 9zm15.9 9.3c-3.6 1.5-7.7-.2-9.1-3.7-1.5-3.6.2-7.8 3.7-9.1 3.6-1.5 7.7.2 9.2 3.8 1.5 3.5-.3 7.5-3.8 9zm4.7 17.7c-3.6 1.5-7.8-.2-9.2-3.8-1.5-3.6.2-7.7 3.9-9.1 3.6-1.5 7.7.3 9.2 3.8 1.3 3.5-.4 7.6-3.9 9.1zM89.3 35.8c-3.6 1.5-7.8-.2-9.2-3.8-1.4-3.6.2-7.7 3.9-9.1 3.6-1.5 7.7.3 9.2 3.8 1.4 3.6-.3 7.7-3.9 9.1zM69.7 17.7l8.9 4.7V9.3l-8.9 2.8c-.2-.3-.5-.6-.9-.9L72.4 0H59.6l3.5 11.2c-.3.3-.6.5-.9.9l-8.8-2.8v13.1l8.8-4.7c.3.3.6.7.9.9l-5 15.4v.1c-.2.8-.4 1.6-.4 2.4 0 4.1 3.1 7.5 7 8.1h.2c.3 0 .7.1 1 .1.4 0 .7 0 1-.1h.2c4-.6 7.1-4.1 7.1-8.1 0-.8-.1-1.7-.4-2.4V34l-5.1-15.4c.4-.2.7-.6 1-.9zM66 92.8c16.9 0 32.8 1.1 47.1 3.2 4-16.9 8.9-26.7 14-33.5l-9.6-3.4c1 4.9 1.1 7.2 0 10.2-1.5-1.4-3-4.3-4.2-8.7L108.6 76c2.8-2 5-3.2 7.5-3.3-4.4 9.4-10 11.9-13.6 11.2-4.3-.8-6.3-4.6-5.6-7.9 1-4.7 5.7-5.9 8-.5 4.3-8.7-3-11.4-7.6-8.8 7.1-7.2 7.9-13.5 2.1-21.1-8 6.1-8.1 12.3-4.5 20.8-4.7-5.4-12.1-2.5-9.5 6.2 3.4-5.2 7.9-2 7.2 3.1-.6 4.3-6.4 7.8-13.5 7.2-10.3-.9-10.9-8-11.2-13.8 2.5-.5 7.1 1.8 11 7.3L80.2 60c-4.1 4.4-8 5.3-12.3 5.4 1.4-4.4 8-11.6 8-11.6H55.5s6.4 7.2 7.9 11.6c-4.2-.1-8-1-12.3-5.4l1.4 16.4c3.9-5.5 8.5-7.7 10.9-7.3-.3 5.8-.9 12.8-11.1 13.8-7.2.6-12.9-2.9-13.5-7.2-.7-5 3.8-8.3 7.1-3.1 2.7-8.7-4.6-11.6-9.4-6.2 3.7-8.5 3.6-14.7-4.6-20.8-5.8 7.6-5 13.9 2.2 21.1-4.7-2.6-11.9.1-7.7 8.8 2.3-5.5 7.1-4.2 8.1.5.7 3.3-1.3 7.1-5.7 7.9-3.5.7-9-1.8-13.5-11.2 2.5.1 4.7 1.3 7.5 3.3l-4.7-15.4c-1.2 4.4-2.7 7.2-4.3 8.7-1.1-3-.9-5.3 0-10.2l-9.5 3.4c5 6.9 9.9 16.7 14 33.5 14.8-2.1 30.8-3.2 47.7-3.2z'
      />
    </svg>
  )
}

export const PolicyErrorPage: React.StatelessComponent<{ message: string }> = ({ message }: { message: string }) => {
  return (
    <Layout>
      <Header />
      <div className='govuk-width-container'>
        <main className='govuk-main-wrapper ' id='main-content' role='main'>
          <ErrorSummary message={message} />
        </main>
      </div>
    </Layout>
  )
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
