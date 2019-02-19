import { Button, Icon, Modal } from 'antd'
import { Box, Text } from 'components/atoms'
import { RequireSeedData } from 'components/RequireData'
import { clipboard } from 'electron'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { Flex } from 'rebass'
import { IndexState } from 'reducers'
import { WalletRootReducer } from 'reducers/wallet'
import { selectSeedState } from 'selectors'

interface AboutModalProps {
  visible: boolean
  onOk?(): void
}

interface StateProps {
  seed: WalletRootReducer.SeedState
}

class BM extends React.Component<AboutModalProps & StateProps & DispatchProp, {}> {
  handleCopy = () => {
    clipboard.writeText(this.props.seed.primaryseed)
    if (this.props.onOk) {
      this.props.onOk()
    }
  }
  render() {
    return (
      <div>
        <RequireSeedData>
          <Modal
            title="Seed Backup"
            visible={this.props.visible}
            onOk={this.props.onOk}
            closable={false}
            footer={[
              <Button key="copy" type="dashed" onClick={this.handleCopy}>
                <Icon type="copy" />
              </Button>,
              <Button key="submit" type="ghost" onClick={this.props.onOk}>
                Finish
              </Button>
            ]}
          >
            <Flex>
              <Box>
                <Text>{this.props.seed.primaryseed}</Text>
              </Box>
            </Flex>
          </Modal>
        </RequireSeedData>
      </div>
    )
  }
}

const mapStateToProps = (state: IndexState) => ({
  seed: selectSeedState(state)
})

export const BackupModel = connect(mapStateToProps)(BM)
