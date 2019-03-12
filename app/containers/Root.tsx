import { ConnectedRouter } from 'connected-react-router'
import * as React from 'react'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import { StoreContext } from 'redux-react-hook'
import { Router } from 'react-router-dom'

import Routes from '../routes'
import cs from '../store/configureStore'
import { theme } from '../theme'
import {} from 'styled-components/cssprop'
import { GlobalStyle } from './App'

const { configureStore, history } = cs
export const reduxStore = configureStore()

// injectGlobal`
// @font-face {
//   font-family: Metropolis;
//   src: url('../assets/fonts/Metropolis-Regular.ttf') format('ttf');
//   font-weight: 400;
//   font-style: normal;
// }

// @font-face {
//   font-family: Metropolis;
//   src: url('../assets/fonts/Metropolis-Medium.otf') format('otf');
//   font-weight: 600;
//   font-style: normal;
// }

// @font-face {
//   font-family: Metropolis;
//   src: url('../assets/fonts/Metropolis-Bold.otf') format('otf');
//   font-weight: 800;
//   font-style: normal;
// }
// `

const Root = () => (
  <Provider store={reduxStore}>
    <StoreContext.Provider value={reduxStore}>
      <ThemeProvider theme={theme}>
        <>
          <GlobalStyle />
          <Router history={history}>
            <Routes />
          </Router>
        </>
      </ThemeProvider>
    </StoreContext.Provider>
  </Provider>
)

export default Root
