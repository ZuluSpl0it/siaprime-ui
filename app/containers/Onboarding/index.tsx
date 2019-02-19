import { WalletActions } from 'actions'
import { Button, Steps } from 'antd'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import { Box, Text } from 'components/atoms'
import { SeedForm } from 'components/Forms'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { IndexState } from 'reducers'
import { WalletRootReducer } from 'reducers/wallet'
import { selectSeedState } from 'selectors'

const { Step } = Steps

interface State {
  step: number
}

interface StateProps {
  seed: WalletRootReducer.SeedState
}

type Props = RouteComponentProps & StateProps & DispatchProp

class Onboarding extends React.Component<Props, State> {
  seedForm: any
  state = {
    step: 0
  }

  nextStep = () => {
    const { step } = this.state
    let hasError = false
    if (step === 0) {
      const form: WrappedFormUtils = this.seedForm.props.form
      form.validateFieldsAndScroll((errors: any, values: any) => {
        if (errors) {
          hasError = true
          return errors
        }
        const { password } = values

        this.props.dispatch(
          WalletActions.changePassword.started({
            encryptionpassword: this.props.seed.primaryseed,
            newpassword: password
          })
        )
        return null
      })
    }
    if (hasError) {
      return
    }
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
    this.props.dispatch(WalletActions.clearSeed())
    this.props.history.push('/protected')
  }
  render() {
    const { step } = this.state
    const { seed } = this.props
    return (
      <Box
        display="flex"
        justifyContent="center"
        flexDirection="column"
        bg="near-white"
        height="100vh"
        width="100%"
        p={4}
      >
        <Box mx={5}>
          <Steps current={step}>
            <Step title="Generate Seed" />
            <Step title="Verify Seed" />
            <Step title="Wallet Scan" />
          </Steps>
          <Box display="flex" justifyContent="center" flexDirection="column" mt={4} height="400px">
            {step === 0 && (
              <SeedForm seed={seed} wrappedComponentRef={(form: any) => (this.seedForm = form)} />
            )}
            {step === 1 && <Text>{seed.primaryseed}</Text>}
            {step === 2 && <Text>Coming soon... still under construction...</Text>}
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Button.Group>
              {step === 0 ? (
                <Button type="ghost" onClick={this.routeTo('/protected')}>
                  Back to Home
                </Button>
              ) : (
                <Button type="ghost" onClick={this.prevStep}>
                  Previous
                </Button>
              )}
            </Button.Group>
            {step < 2 && (
              <Button.Group>
                <Button onClick={this.nextStep} type="primary">
                  Next
                </Button>
              </Button.Group>
            )}
            {step === 2 && (
              <Button.Group>
                <Button onClick={this.done} type="primary">
                  Done
                </Button>
              </Button.Group>
            )}
          </Box>
        </Box>
      </Box>
    )
  }
}

const mapStateToProps = (state: IndexState) => ({
  seed: selectSeedState(state)
})

export default connect(mapStateToProps)(withRouter(Onboarding))
