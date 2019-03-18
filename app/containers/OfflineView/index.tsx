import { DragContiner, Text } from 'components/atoms'
import { Flex } from 'components/atoms/Flex'
import { OfflineState } from 'components/EmptyStates'
import { TransitionSiaSpinner } from 'components/GSAP/TransitionSiaSpinner'
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
  timer: any = null
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
        <Flex
          height="100vh"
          width="100%"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <TransitionSiaSpinner
            in={
              siad.loading || (siad.isActive && !siad.isFinishedLoading) || !this.state.hasEntered
            }
            onEntered={this.handleEntered}
            onExited={this.handleExit}
          />
          {siad.isFinishedLoading !== null &&
            !siad.isFinishedLoading &&
            this.state.hasEntered &&
            siad.isActive && (
              <Text pt={3} width={200} textAlign="center">
                Sia is not done loading the modules. It may take longer than expected.
              </Text>
            )}
          {!siad.isActive && !siad.loading && this.state.readyForMainView && <OfflineState />}
        </Flex>
        {this.state.readyForMainView && siad.isFinishedLoading && siad.isActive && (
          <Redirect to="/" />
        )}
      </DragContiner>
    )
  }
}

export default connect(
  createStructuredSelector({
    siad: selectSiadState
  })
)(OfflineView)
