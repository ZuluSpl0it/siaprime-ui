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
import { Flex } from 'components/atoms/Flex'

interface StateProps {
  siad: UIReducer.SiadState
}

class OfflineView extends React.Component<StateProps & DispatchProp, {}> {
  componentDidMount() {
    this.props.dispatch(GlobalActions.stopPolling())
  }
  render() {
    const { siad } = this.props
    console.log('siad', siad)
    if (siad.loading) {
      return (
        <DragContiner>
          <Flex height="100vh" width="100%" justifyContent="center" alignItems="center">
            <SiaSpinner />
          </Flex>
        </DragContiner>
      )
    }
    if (siad.isActive) {
      return <Redirect to="/" />
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
