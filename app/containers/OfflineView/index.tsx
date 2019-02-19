import { GlobalActions } from 'actions'
import { Spin } from 'antd'
import { Box, DragContiner } from 'components/atoms'
import { OfflineState } from 'components/EmptyStates'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { Redirect } from 'react-router'
import { UIReducer } from 'reducers/ui'
import { createStructuredSelector } from 'reselect'
import { selectSiadState } from 'selectors'

interface StateProps {
  siad: UIReducer.SiadState
}

class OfflineView extends React.Component<StateProps & DispatchProp, {}> {
  componentDidMount() {
    this.props.dispatch(GlobalActions.startPolling())
  }
  componentWillUnmount() {
    this.props.dispatch(GlobalActions.stopPolling())
  }
  render() {
    const { siad } = this.props
    if (siad.isActive) {
      return <Redirect to="/" />
    }
    if (siad.loading) {
      return (
        <Box display="flex" height="100vh" width="100%" justifyContent="center" alignItems="center">
          <Spin tip="Loading Sia-UI..." />{' '}
        </Box>
      )
    }
    return (
      <DragContiner>
        <OfflineState />
      </DragContiner>
    )
  }
}

export default connect(
  createStructuredSelector({
    siad: selectSiadState
  })
)(OfflineView)
