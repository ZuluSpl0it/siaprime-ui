import { WalletActions } from 'actions'
import { Button, Steps, Input, Icon } from 'antd'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import { Box, Text, Card, DragContiner, ButtonWithAdornment } from 'components/atoms'
import { SeedForm } from 'components/Forms'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { IndexState } from 'reducers'
import { WalletRootReducer } from 'reducers/wallet'
import { selectSeedState } from 'selectors'
import { Grid } from 'components/atoms/Grid'
import { Flex } from 'components/atoms/Flex'
import { GenerateSeedView } from './GenerateSeedView'
import { VerifySeedView } from './VerifySeedView'

const { Step } = Steps

interface State {
  step: number
  seedCheckValid: boolean
}

interface StateProps {
  seed: WalletRootReducer.SeedState
}

type Props = RouteComponentProps & StateProps & DispatchProp

class Onboarding extends React.Component<Props, State> {
  seedForm: any
  state = {
    step: 0,
    seedCheckValid: false
  }

  nextStep = () => {
    this.setState({
      step: this.state.step += 1
    })
  }
  prevStep = () => {
    this.setState({
      step: this.state.step -= 1
    })
  }
  routeTo = (path: string) => () => {
    this.props.history.push(path)
  }
  done = () => {
    const { seedCheckValid } = this.state
    if (seedCheckValid) {
      this.props.dispatch(WalletActions.clearSeed())
      this.props.history.push('/protected')
    }
  }
  handleSeedCheck = (v: boolean) => {
    this.setState({
      seedCheckValid: v
    })
  }
  render() {
    const { step } = this.state
    const { seed } = this.props
    const { primaryseed } = seed
    console.log('seed state', seed)
    // TODO should show loading and error states
    return (
      <DragContiner>
        <Flex
          justifyContent="center"
          flexDirection="column"
          bg="near-white"
          height="100vh"
          width="100%"
          p={4}
        >
          <Box mx={5}>
            <Steps current={step}>
              <Step title="Generated Seed" />
              <Step title="Verify Seed" />
              {/* <Step title="Set Password" /> */}
            </Steps>
            <Box mt={4} height="450px">
              {step === 0 && <GenerateSeedView seed={primaryseed} />}
              {step === 1 && (
                <VerifySeedView seed={primaryseed} setAllValid={this.handleSeedCheck} />
              )}
              {/* {step === 2 && <Text>Coming soon... still under construction...</Text>} */}
            </Box>
            <Flex justifyContent="space-between">
              <Button.Group>
                {step === 0 ? (
                  <Button type="ghost" size="large" onClick={this.routeTo('/protected')}>
                    Back to Home
                  </Button>
                ) : (
                  <Button type="ghost" size="large" onClick={this.prevStep}>
                    Previous
                  </Button>
                )}
              </Button.Group>
              {step < 1 && (
                <Button.Group>
                  <Button size="large" onClick={this.nextStep} type="primary">
                    Next
                  </Button>
                </Button.Group>
              )}
              {step === 1 && (
                <Button.Group>
                  <Button size="large" onClick={this.done} type="primary">
                    Done
                  </Button>
                </Button.Group>
              )}
            </Flex>
          </Box>
        </Flex>
      </DragContiner>
    )
  }
}

const mapStateToProps = (state: IndexState) => ({
  seed: selectSeedState(state)
})

export default connect(mapStateToProps)(withRouter(Onboarding))
