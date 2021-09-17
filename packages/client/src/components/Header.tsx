import React from 'react'

import { GovIcon } from './GovIcon'

export const Header: React.StatelessComponent<{}> = () => {
  return (
    <header className='govuk-header' role='banner' data-module='header'>
      <div className='govuk-header__container govuk-header__container--full-width ph4'>
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
