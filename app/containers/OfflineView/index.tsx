import { GlobalActions } from 'actions'
import { Spin } from 'antd'
import { Box, DragContiner, SVGBox } from 'components/atoms'
import { OfflineState } from 'components/EmptyStates'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { Redirect } from 'react-router'
import { UIReducer } from 'reducers/ui'
import { createStructuredSelector } from 'reselect'
import { selectSiadState } from 'selectors'
import Wordmark from 'assets/svg/wordmark.svg'
import { SiaSpinner } from 'components/GSAP'

interface StateProps {
  siad: UIReducer.SiadState
}

class OfflineView extends React.Component<StateProps & DispatchProp, {}> {
  componentDidMount() {
    this.props.dispatch(GlobalActions.stopPolling())
  }
  render() {
    const { siad } = this.props
    if (siad.isActive) {
      return <Redirect to="/" />
    }
    if (siad.loading) {
      return (
        <DragContiner>
          <Box
            display="flex"
            height="100vh"
            width="100%"
            justifyContent="center"
            alignItems="center"
          >
            <SiaSpinner />
          </Box>
        </DragContiner>
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
