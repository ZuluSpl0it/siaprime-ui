import { WalletActions, GlobalActions } from 'actions'
import { Button } from 'antd'
import { Box, ButtonWithAdornment, DragContiner, Text } from 'components/atoms'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { IndexState } from 'reducers'
import { WalletRootReducer } from 'reducers/wallet'
import { selectSeedState } from 'selectors'
import { Flex } from 'components/atoms/Flex'

interface StateProps {
  seed: WalletRootReducer.SeedState
}

type Props = RouteComponentProps & DispatchProp & StateProps

class SetupView extends React.Component<Props, {}> {
  componentDidMount() {
    this.props.dispatch(GlobalActions.stopPolling())
  }
  routeTo = (path: string) => () => {
    this.props.history.push(path)
  }
  generateWallet = () => {
    const { seed } = this.props
    // if (!seed.primaryseed) {
    //   this.props.dispatch(WalletActions.createNewWallet.started({}))
    // }
    this.props.history.push('/onboarding')
  }
  render() {
    return (
      <DragContiner>
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          bg="near-white"
          height="100vh"
          width="100%"
          p={4}
        >
          <Box>
            <Text color="mid-gray" fontWeight={400} fontSize={6}>
              Welcome to Sia
            </Text>
          </Box>
          <Flex width="300px" my={3} style={{ textAlign: 'center' }}>
            <Text fontSize={3} color="mid-gray">
              Would you like to create a new wallet or restore your wallet from a seed?
            </Text>
          </Flex>
          <Box pt={3}>
            <Button.Group>
              <ButtonWithAdornment
                onClick={this.generateWallet}
                before
                size="large"
                iconType="wallet"
                type="primary"
              >
                Create new wallet
              </ButtonWithAdornment>
              <ButtonWithAdornment size="large" after iconType="right">
                Restore from seed
              </ButtonWithAdornment>
            </Button.Group>
          </Box>
        </Flex>
      </DragContiner>
    )
  }
}

const mapStateToProps = (state: IndexState) => ({
  seed: selectSeedState(state)
})

export default connect(mapStateToProps)(withRouter(SetupView))
