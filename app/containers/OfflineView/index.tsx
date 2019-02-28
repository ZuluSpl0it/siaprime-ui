import { GlobalActions } from 'actions'
import { Spin, Button } from 'antd'
import { Box, DragContiner, SVGBox } from 'components/atoms'
import { OfflineState } from 'components/EmptyStates'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { Redirect } from 'react-router'
import { UIReducer } from 'reducers/ui'
import { createStructuredSelector } from 'reselect'
import { selectSiadState } from 'selectors'
import Wordmark from 'assets/svg/wordmark.svg'
import { Flex } from 'components/atoms/Flex'
import MainView from 'containers/MainView/MainView'
import ReactTransitionGroup from 'react-addons-transition-group' // ES6
import styled from 'styled-components'
import { TransitionSiaSpinner } from 'components/GSAP/TransitionSiaSpinner'

interface StateProps {
  siad: UIReducer.SiadState
}

class OfflineView extends React.Component<StateProps & DispatchProp, {}> {
  state = {
    readyForMainView: false,
    hasEntered: false
  }
  handleEntered = () => {
    this.setState({
      hasEntered: true
    })
  }
  handleExit = () => {
    this.setState({
      readyForMainView: true
    })
  }
  render() {
    const { siad } = this.props
    return (
      <DragContiner>
        <Flex height="100vh" width="100%" justifyContent="center" alignItems="center">
          <TransitionSiaSpinner
            in={siad.loading || !this.state.hasEntered}
            onEntered={this.handleEntered}
            onExited={this.handleExit}
          />
        </Flex>
        {this.state.readyForMainView && <Redirect to="/" />}
      </DragContiner>
    )
  }
}

export default connect(
  createStructuredSelector({
    siad: selectSiadState
  })
)(OfflineView)
