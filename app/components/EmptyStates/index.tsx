import { Button, Icon } from 'antd'
import { initSiad, siad, launchSiad } from 'api/siad'
import { Box, Image, Text } from 'components/atoms'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { WalletActions, GlobalActions } from 'actions'
import { Flex } from 'components/atoms/Flex'
import { globalSiadProcess, getGlobalSiadProcess, setGlobalSiadProcess } from 'containers/App'
import { ChildProcess } from 'child_process'

const EmptyState = ({ children }: any) => (
  <Flex height="100vh" width="100vw" justifyContent="center" alignItems="center">
    <Flex justifyContent="center" alignItems="center">
      {children}
    </Flex>
  </Flex>
)

export const ScanningState = () => (
  <EmptyState>
    <Box mx={2} pr={4} width={1 / 2}>
      <Text is="p" fontSize={5}>
        The SiaPrime Daemon is currently scanning the blockchain.
      </Text>
      <Text is="p" fontSize={3} fontWeight={400}>
        Please wait as we index your wallet and update the balance.
      </Text>
    </Box>
  </EmptyState>
)

// I don't think scanning state belongs to the wallet plugin - should be global.
class OffState extends React.Component<DispatchProp> {
  state = {
    status: 'exclamation-circle'
  }
  componentDidMount = async () => {
    this.props.dispatch(GlobalActions.stopPolling())
  }
  launchDaemon = async () => {
    this.setState({
      status: 'loading'
    })
    const { dispatch } = this.props
    const isRunning = await siad.isRunning()
    // If not running, we'll try to launch siad ourselves
    if (!isRunning) {
      dispatch(GlobalActions.setSiadOrigin({ isInternal: true }))
      const gsp: ChildProcess = getGlobalSiadProcess()
      if (gsp) {
        gsp.kill('SIGKILL')
      }
      const loaded = await launchSiad()
      if (loaded) {
        setGlobalSiadProcess(loaded)
        dispatch(GlobalActions.siadLoaded())
        dispatch(GlobalActions.startSiadPolling())
      } else {
        dispatch(GlobalActions.siadOffline())
        this.setState({
          status: 'close-circle'
        })
      }
    } else {
      dispatch(GlobalActions.setSiadOrigin({ isInternal: false }))
    }
  }
  render() {
    return (
      <Flex height="100vh" width="100%" justifyContent="center" alignItems="center">
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
        >
          <Box width={1 / 3} style={{ textAlign: 'center' }} pb={2}>
            <Icon
              type={this.state.status}
              spin={this.state.status === 'loading'}
              style={{ fontSize: 18 }}
            />
          </Box>
          <Box mx={2} width={1 / 3} style={{ textAlign: 'center' }}>
            <Text is="p" color="mid-gray" fontSize={3}>
              {this.state.status === 'loading' ? 'Connecting' : 'SiaPrime Daemon Unreachable'}
            </Text>
            {this.state.status !== 'loading' && (
              <Text is="p" color="silver" fontSize={2} maxWidth="300em">
                It's likely the spd process crashed or was never started. Please start siad from
                your terminal or using the built-in daemon by clicking on the button below.
              </Text>
            )}
          </Box>
          {this.state.status !== 'loading' && (
            <Box>
              <Button onClick={this.launchDaemon}>Launch SiaPrime Daemon</Button>
            </Box>
          )}
        </Flex>
      </Flex>
    )
  }
}

export const OfflineState = connect()(OffState)
