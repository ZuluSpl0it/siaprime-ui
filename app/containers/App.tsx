import { siad, initSiad, launchSiad } from 'api/siad'
import * as React from 'react'
import { reduxStore } from './Root'
import { connect, DispatchProp } from 'react-redux'
import { GlobalActions } from 'actions'
import {} from 'styled-components/cssprop'

window.addEventListener('beforeunload', async e => {
  const store = reduxStore.getState()
  if (store.ui.siad.isInternal) {
    await siad.daemonStop()
  }
})

class App extends React.Component<DispatchProp> {
  componentDidMount = () => {
    const { dispatch } = this.props
    setTimeout(async () => {
      const isRunning = await siad.isRunning()
      // If not running, we'll try to launch siad ourselves
      if (!isRunning) {
        dispatch(GlobalActions.siadLoading())
        dispatch(GlobalActions.setSiadOrigin({ isInternal: true }))
        const loaded = await launchSiad()
        if (loaded) {
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
    return <div>{this.props.children}</div>
  }
}

export default connect()(App)
