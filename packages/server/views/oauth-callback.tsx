import * as React from 'react'

export const Redirect: React.StatelessComponent<{}> = ({ children }) => {
  return (
    <html>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `function loadHandler() {
  if (opener) {
    if (location.hash) {
      opener.require("esri/kernel").id.setOAuthResponseHash(location.hash);
      close();
    }
  }
  else {
    close();
  }
}`,
          }}
        />
      </head>
      <body data-onLoad='loadHandler();' />
    </html>
  )
}
