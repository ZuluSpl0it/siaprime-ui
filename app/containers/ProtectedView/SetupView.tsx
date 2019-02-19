import { WalletActions } from 'actions'
import { Button } from 'antd'
import { Box, ButtonWithAdornment, DragContiner, Text } from 'components/atoms'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { IndexState } from 'reducers'
import { WalletRootReducer } from 'reducers/wallet'
import { selectSeedState } from 'selectors'

interface StateProps {
  seed: WalletRootReducer.SeedState
}

type Props = RouteComponentProps & DispatchProp & StateProps

class SetupView extends React.Component<Props, {}> {
  routeTo = (path: string) => () => {
    this.props.history.push(path)
  }
  generateWallet = () => {
    const { seed } = this.props
    if (!seed.primaryseed) {
      this.props.dispatch(WalletActions.createNewWallet.started({}))
    }
    this.props.history.push('/onboarding')
  }
  render() {
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
          p={4}
        >
          <Box>
            <Text color="mid-gray" fontWeight={400} fontSize={6}>
              Welcome to Sia
            </Text>
          </Box>
          <Box width={1 / 3} my={3} css={{ textAlign: 'center' }}>
            <Text fontSize={3} color="mid-gray">
              It looks like you don't have a wallet setup yet. Would you like to create a new wallet
              or restore your wallet for a seed?
            </Text>
          </Box>
          <Box pt={3}>
            <Button.Group>
              <ButtonWithAdornment
                onClick={this.generateWallet}
                before
                iconType="wallet"
                type="primary"
              >
                Create new wallet
              </ButtonWithAdornment>
              <ButtonWithAdornment after iconType="right">
                Restore from seed
              </ButtonWithAdornment>
            </Button.Group>
          </Box>
        </Box>
      </DragContiner>
    )
  }
}

const mapStateToProps = (state: IndexState) => ({
  seed: selectSeedState(state)
})

export default connect(mapStateToProps)(withRouter(SetupView))
