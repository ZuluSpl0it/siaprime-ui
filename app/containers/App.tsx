import { GlobalActions } from 'actions'
import { launchSiad, siad } from 'api/siad'
import { ChildProcess } from 'child_process'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { createGlobalStyle } from 'styled-components'

import MetropolisBold from '../assets/fonts/Metropolis-Bold.otf'
import MetropolisMedium from '../assets/fonts/Metropolis-Medium.otf'
import MetropolisRegular from '../assets/fonts/Metropolis-Regular.ttf'

export let globalSiadProcess: any = null

export const setGlobalSiadProcess = p => {
  globalSiadProcess = p
}

export const getGlobalSiadProcess = (): ChildProcess => {
  return globalSiadProcess
}

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: "Metropolis";
    src: url('${MetropolisRegular}');
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: "Metropolis";
    src: url('${MetropolisMedium}');
    font-weight: 500;
    font-style: normal;
  }

  @font-face {
    font-family: "Metropolis";
    src: url('${MetropolisBold}');
    font-weight: 800;
    font-style: normal;
  }

    /* total width */
  ::-webkit-scrollbar {
      background-color:#fff;
      width:16px
  }

  /* background of the scrollbar except button or resizer */
  ::-webkit-scrollbar-track {
      background-color:#fff
  }

  /* scrollbar itself */
  ::-webkit-scrollbar-thumb {
      background-color:#babac0;
      border-radius:16px;
      border:4px solid #fff
  }

  /* set button(top and bottom of the scrollbar) */
  ::-webkit-scrollbar-button {display:none}
  ::-webkit-scrollbar {     
        background-color: #fff;
        width: .8em
  }


`

window.addEventListener('beforeunload', async e => {
  if (globalSiadProcess) {
    await siad.daemonStop()
  }
})

class App extends React.Component<DispatchProp> {
  componentDidMount = async () => {
    const { dispatch } = this.props
    const isRunning = await siad.isRunning()
    dispatch(GlobalActions.startPolling())
    // If not running, we'll try to launch siad ourselves
    setTimeout(async () => {
      if (!isRunning) {
        dispatch(GlobalActions.siadLoading())
        const loadedProcess: any = await launchSiad()
        if (loadedProcess) {
          setGlobalSiadProcess(loadedProcess)
          dispatch(GlobalActions.setSiadOrigin({ isInternal: true }))
          dispatch(GlobalActions.siadLoaded())
        } else {
          dispatch(GlobalActions.siadOffline())
        }
      } else {
        dispatch(GlobalActions.setSiadOrigin({ isInternal: false }))
        dispatch(GlobalActions.siadLoaded())
      }
    }, 3000)
  }
  render() {
    return (
      <React.Fragment>
        <div>{this.props.children}</div>
      </React.Fragment>
    )
  }
}

export default connect()(App)
