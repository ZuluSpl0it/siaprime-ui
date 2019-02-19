import { WalletActions } from 'actions'
import { AppIconButton, Bar, Box, HeaderBox } from 'components/atoms'
import { AboutModal, TerminalModal } from 'components/Modal'
import SynchronizeStatus from 'components/SynchronizeStatus'
import { ConsensusModel } from 'models'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { selectConsensus } from 'selectors'

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
        <HeaderBox
          px={3}
          height={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box display="flex" justifyContent="center" alignItems="center">
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
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center">
            <SynchronizeStatus {...consensus} />
          </Box>
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
