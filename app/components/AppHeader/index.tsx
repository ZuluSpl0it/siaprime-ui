import { WalletActions } from 'actions'
import { AppIconButton, Bar, Box, HeaderBox } from 'components/atoms'
import { AboutModal, TerminalModal } from 'components/Modal'
import SynchronizeStatus from 'components/SynchronizeStatus'
import { ConsensusModel } from 'models'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { selectConsensus } from 'selectors'
import { Flex } from 'components/atoms/Flex'

interface StateProps {
  consensus: ConsensusModel.ConsensusGETResponse
}

class AppHeader extends React.Component<StateProps & DispatchProp, {}> {
  state = { visible: false, terminalVisible: false }
  lockWallet = () => {
    this.props.dispatch(WalletActions.lockWallet.started())
  }
  showModal = () => {
    this.setState({
      visible: true
    })
  }

  showTerminalModal = () => {
    this.setState({
      terminalVisible: true
    })
  }

  handleOk = () => {
    this.setState({
      visible: false
    })
  }
  handleTerminalOk = () => {
    this.setState({
      terminalVisible: false
    })
  }
  render() {
    const { consensus } = this.props
    return (
      <React.Fragment>
        <HeaderBox px={3} height={2} justifyContent="space-between" alignItems="center">
          <Flex justifyContent="center" alignItems="center">
            <div onClick={this.lockWallet}>
              <AppIconButton iconType="lock" />
            </div>
            {/* <Bar />
            <AppIconButton iconType="setting" /> */}
            <Bar />
            <div onClick={this.showModal}>
              <AppIconButton iconType="info-circle" />
            </div>
            <Bar />
            <div onClick={this.showTerminalModal}>
              <AppIconButton iconType="right-square" />
            </div>
          </Flex>
          <Flex justifyContent="center" alignItems="center">
            <SynchronizeStatus {...consensus} />
          </Flex>
        </HeaderBox>
        <AboutModal visible={this.state.visible} onOk={this.handleOk} />
        <TerminalModal visible={this.state.terminalVisible} onOk={this.handleTerminalOk} />
      </React.Fragment>
    )
  }
}
const mapStateToProps = createStructuredSelector({
  consensus: selectConsensus
})

export default connect(mapStateToProps)(AppHeader)
