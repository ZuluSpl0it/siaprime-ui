import LoadingScreenHeader from 'components/AppHeader/LoadingScreenHeader'
import { Box, DragContiner, Text, Spinner } from 'components/atoms'
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
import { GlobalActions } from 'actions'
import styled from 'styled-components'
import { themeGet } from 'styled-system'

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
    const StyledPre = styled.pre`
      color: ${themeGet('colors.near-black')};
    `
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
          {/* Conditional checks to see if we need to display a module loading logs */}
          {siad.isFinishedLoading !== null &&
            !siad.isFinishedLoading &&
            this.state.hasEntered &&
            siad.isActive && (
              <>
                <Box width={600}>
                  <Flex alignItems="center">
                    <Box pr={3}>
                      <Spinner />
                    </Box>
                    <Box>
                      <Text fontSize={3} textAlign="left">
                        Sia daemon detected, but is not done loading the modules. It may take longer
                        than expected to finish the loading all the modules.
                      </Text>
                    </Box>
                  </Flex>
                  <Box py={2}>
                    <Text fontSize={1} textAlign="left">
                      If Sia-UI is managing the daemon, the logs will be printed below:
                    </Text>
                  </Box>
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
                      <StyledPre>{l}</StyledPre>
                    ))}
                    {siad.stderr.map(l => (
                      <StyledPre>{l}</StyledPre>
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
