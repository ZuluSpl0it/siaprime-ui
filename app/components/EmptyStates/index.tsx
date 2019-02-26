import { Button, Icon } from 'antd'
import { initSiad, siad, launchSiad } from 'api/siad'
import Temp from 'assets/img/Bitmap.png'
import { Box, Image, Text } from 'components/atoms'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { WalletActions, GlobalActions } from 'actions'

const EmptyState = ({ children }: any) => (
  <Box height="100vh" width="100vw" display="flex" justifyContent="center" alignItems="center">
    <Box display="flex" justifyContent="center" alignItems="center">
      {children}
    </Box>
  </Box>
)

export const ScanningState = () => (
  <EmptyState>
    <Box mx={2} pr={4} width={1 / 2}>
      <Text is="p" fontSize={5}>
        The Sia Daemon is currently scanning the blockchain.
      </Text>
      <Text is="p" fontSize={3} fontWeight={400}>
        Please wait as we index your wallet and update the balance.
      </Text>
    </Box>
    <Box mx={2} width={1 / 2}>
      <Image src={Temp} />
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
      dispatch(GlobalActions.siadLoading())
      dispatch(GlobalActions.setSiadOrigin({ isInternal: true }))
      const loaded = await launchSiad()
      if (loaded) {
        dispatch(GlobalActions.siadLoaded())
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
      <Box height="100vh" width="100%" justifyContent="center" alignItems="center">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
        >
          <Box width={1 / 3} css={{ textAlign: 'center' }} pb={2}>
            <Icon
              type={this.state.status}
              spin={this.state.status === 'loading'}
              style={{ fontSize: 18 }}
            />
          </Box>
          <Box mx={2} width={1 / 3} css={{ textAlign: 'center' }}>
            <Text is="p" color="mid-gray" fontSize={3}>
              {this.state.status === 'loading' ? 'Connecting' : 'Sia Daemon Unreachable'}
            </Text>
            {this.state.status !== 'loading' && (
              <Text is="p" color="silver" fontSize={2} maxWidth="300em">
                It's likely the siad process crashed or was never started. Please start siad from
                your terminal or using the built-in daemon by clicking on the button below.
              </Text>
            )}
          </Box>
          {this.state.status !== 'loading' && (
            <Box>
              <Button onClick={this.launchDaemon}>Launch Sia Daemon (siad)</Button>
            </Box>
          )}
        </Box>
      </Box>
    )
  }
}

export const OfflineState = connect()(OffState)
