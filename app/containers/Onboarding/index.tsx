import { WalletActions } from 'actions'
import { Button, Steps, Input } from 'antd'
import { WrappedFormUtils } from 'antd/lib/form/Form'
import { Box, Text, Card, DragContiner } from 'components/atoms'
import { SeedForm } from 'components/Forms'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { IndexState } from 'reducers'
import { WalletRootReducer } from 'reducers/wallet'
import { selectSeedState } from 'selectors'
import { Grid } from 'components/atoms/Grid'
import { Flex } from 'components/atoms/Flex'

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
    // if (step === 0) {
    //   const form: WrappedFormUtils = this.seedForm.props.form
    //   form.validateFieldsAndScroll((errors: any, values: any) => {
    //     if (errors) {
    //       hasError = true
    //       return errors
    //     }
    //     const { password } = values

    //     this.props.dispatch(
    //       WalletActions.changePassword.started({
    //         encryptionpassword: this.props.seed.primaryseed,
    //         newpassword: password
    //       })
    //     )
    //     return null
    //   })
    // }
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
    const mockseed =
      'avoid economics rover nota etoag eeemsk renting mohawk guarded yoga dotted inundate jackets hesitate picked dual eclipse aided tarnished often among dilute pizza calamity suede olive bygones ptrhon abloze'
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
              <Step title="Set Password" />
            </Steps>
            <Box mt={4} height="450px">
              {step === 0 && (
                <Box>
                  <Card mb={4}>
                    <Box width={3 / 4}>
                      <Text fontSize={2}>
                        This is your generated seed. Please safely copy and store this seed
                        somewhere safe. It is used to recover funds in case the wallet is lost.
                      </Text>
                    </Box>
                  </Card>
                  <Grid gridTemplateColumns="repeat(6, 1fr)" gridGap={3}>
                    {mockseed.split(' ').map((v, i) => (
                      <Box>
                        <Input prefix={<Text color="silver">{i}</Text>} value={v} />
                      </Box>
                    ))}
                  </Grid>
                </Box>
              )}
              {step === 1 && <Text>{seed.primaryseed}</Text>}
              {step === 2 && <Text>Coming soon... still under construction...</Text>}
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
              {step < 2 && (
                <Button.Group>
                  <Button size="large" onClick={this.nextStep} type="primary">
                    Next
                  </Button>
                </Button.Group>
              )}
              {step === 2 && (
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
