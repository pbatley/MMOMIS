import ReactGA from 'react-ga'

export const gaPageView = (pageView?: string) => {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.initialize('UA-59388182-1')
    ReactGA.pageview(pageView)
    return
  }
  return
}
