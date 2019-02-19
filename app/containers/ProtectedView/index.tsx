import { GlobalActions, WalletActions } from 'actions'
import { Button, Form, Input, Spin } from 'antd'
import Wordmark from 'assets/svg/wordmark.svg'
import {
  Box,
  ButtonWithAdornment,
  defaultFieldState,
  DragContiner,
  FormItemProps,
  SVGBox
} from 'components/atoms'
import { WalletModel } from 'models'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { Redirect } from 'react-router'
import { Flex } from 'rebass'
import { IndexState } from 'reducers'
import { ConsensusRootReducer } from 'reducers/consensus'
import { UIReducer } from 'reducers/ui'
import { WalletRootReducer } from 'reducers/wallet'
import { selectConsensus, selectSeedState, selectSiadState, selectWalletSummary } from 'selectors'

import SetupView from './SetupView'

interface State {
  password: FormItemProps
}

interface StateProps {
  wallet: WalletModel.WalletGET
  unlockFormHelp: UIReducer.UnlockFormState
  siad: UIReducer.SiadState
  seed: WalletRootReducer.SeedState
  consensus: ConsensusRootReducer.State
}

type Props = StateProps & DispatchProp

class ProtectedView extends React.Component<Props, State> {
  state = {
    password: defaultFieldState
  }
  handleLogin = () => {
    const { password } = this.state
    // if (password.value) {
    this.props.dispatch(
      WalletActions.unlockWallet.started({
        encryptionpassword: password.value as any
      })
    )
    // }
  }
  componentDidMount() {
    this.props.dispatch(GlobalActions.startPolling())
  }
  componentWillUnmount() {
    this.props.dispatch(GlobalActions.stopPolling())
  }
  handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    this.setState({
      ...this.state.password,
      ...{
        password: {
          value
        }
      }
    } as any)
  }
  handleEnter = (e: any) => {
    if (e.keyCode === 13) {
      this.handleLogin()
    }
  }
  render() {
    const { wallet, unlockFormHelp, siad, seed, consensus } = this.props
    if (!siad.isActive) {
      return <Redirect to="/offline" />
    }
    if (wallet.unlocked && !consensus.synced) {
      return <Redirect to="/syncing" />
    }
    if (wallet.rescanning) {
      return <Redirect to="/scanning" />
    }
    if (wallet.unlocked) {
      return <Redirect to="/" />
    }
    if (!wallet.encrypted || seed.primaryseed) {
      return <SetupView />
    }
    return (
      <DragContiner>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          bg="near-white"
          height="100vh"
          width="100%"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            pb={4}
          >
            <Flex alignItems="center" justifyContent="center">
              <SVGBox height="40px">
                <Wordmark viewBox="0 0 97 58" />
              </SVGBox>
            </Flex>
          </Box>
          <Box width="300px" height="100px" py={2}>
            {unlockFormHelp.loading || wallet.unlocked ? (
              <Flex justifyContent="center">
                <Spin tip="Logging you in..." />
              </Flex>
            ) : (
              <Form.Item
                hasFeedback
                help={unlockFormHelp.help}
                validateStatus={unlockFormHelp.validateStatus as any}
              >
                <Input
                  onKeyDown={this.handleEnter}
                  onChange={this.handleInput}
                  placeholder="Enter Your Password"
                  type="password"
                  name="password"
                  value={this.state.password.value}
                  size="large"
                />
              </Form.Item>
            )}
          </Box>
          {!unlockFormHelp.loading && !wallet.unlocked && (
            <Button.Group>
              <ButtonWithAdornment
                onClick={this.handleLogin}
                type="primary"
                size="large"
                iconType="login"
                after
              >
                Login
              </ButtonWithAdornment>
            </Button.Group>
          )}
        </Box>
      </DragContiner>
    )
  }
}

const mapStateToProps = (state: IndexState) => ({
  wallet: selectWalletSummary(state),
  unlockFormHelp: state.ui.unlockForm,
  siad: selectSiadState(state),
  seed: selectSeedState(state),
  consensus: selectConsensus(state)
})

export default connect(mapStateToProps)(ProtectedView)
