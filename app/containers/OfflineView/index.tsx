import LoadingScreenHeader from 'components/AppHeader/LoadingScreenHeader'
import { Box, DragContiner, Text } from 'components/atoms'
import { Flex } from 'components/atoms/Flex'
import { OfflineState } from 'components/EmptyStates'
import { TransitionSiaSpinner } from 'components/GSAP/TransitionSiaSpinner'
import defaultConfig from 'config'
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
        <LoadingScreenHeader />
        <Flex
          height="100vh"
          width="100%"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          bg="white"
        >
          <TransitionSiaSpinner
            in={
              siad.loading ||
              (siad.isActive && siad.isFinishedLoading === null) ||
              !this.state.hasEntered
            }
            onEntered={this.handleEntered}
            onExited={this.handleExit}
          />
          {siad.isFinishedLoading !== null &&
            !siad.isFinishedLoading &&
            this.state.hasEntered &&
            siad.isActive && (
              <>
                <Box width={600}>
                  <Text fontSize={3} textAlign="left">
                    Sia is not done loading the modules. It may take longer than expected...
                  </Text>
                  <Box
                    py={3}
                    height={300}
                    css={`
                      overflow: auto;
                      pre {
                        font-size: 12px;
                      }
                    `}
                  >
                    {siad.stdout.map(l => (
                      <pre>{l}</pre>
                    ))}
                    {siad.stderr.map(l => (
                      <pre>{l}</pre>
                    ))}
                  </Box>
                </Box>
              </>
            )}
          {!siad.isActive && !siad.loading && this.state.readyForMainView && <OfflineState />}
        </Flex>
        {(this.state.readyForMainView || defaultConfig.developmentMode) &&
          siad.isFinishedLoading &&
          siad.isActive && <Redirect to="/" />}
      </DragContiner>
    )
  }
}

export default connect(
  createStructuredSelector({
    siad: selectSiadState
  })
)(OfflineView)
