import { Button, Icon } from 'antd'
import { initSiad, siad, launchSiad } from 'api/siad'
import Temp from 'assets/img/Bitmap.png'
import { Box, Image, Text } from 'components/atoms'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { WalletActions, GlobalActions } from 'actions'
import { Flex } from 'components/atoms/Flex'
import { globalSiadProcess, getGlobalSiadProcess, setGlobalSiadProcess } from 'containers/App'
import { ChildProcess } from 'child_process'
import { createStructuredSelector } from 'reselect'
import { selectInitFromSeedState } from 'selectors'
import { UIReducer } from 'reducers/ui'

interface StateProps {
  initState: UIReducer.InitFromSeedState
}

// I don't think scanning state belongs to the wallet plugin - should be global.
class ScanView extends React.Component<DispatchProp & StateProps> {
  state = {
    status: 'exclamation-circle'
  }
  render() {
    const { initState } = this.props
    return (
      <Flex height="100%" width="100%" justifyContent="center" alignItems="center">
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
        >
          <Box width={1 / 3} style={{ textAlign: 'center' }} pb={2}>
            <Icon
              type={
                initState.error ? 'exclamation-circle' : initState.done ? 'check-circle' : 'loading'
              }
              spin={initState.loading}
              style={{ fontSize: 18 }}
            />
          </Box>
          <Box mx={2} width={1 / 3} style={{ textAlign: 'center' }}>
            <Text is="p" color="mid-gray" fontSize={3}>
              {initState.loading ? 'Scanning' : initState.done ? 'Scan Complete' : 'Error Occured'}
            </Text>
            <Text is="p" color="silver" fontSize={2} maxWidth="300em">
              {initState.error ? initState.error : initState.done ? '' : 'This may take some time'}
            </Text>
          </Box>
        </Flex>
      </Flex>
    )
  }
}

export const ScanningView = connect(
  createStructuredSelector({
    initState: selectInitFromSeedState
  })
)(ScanView)
