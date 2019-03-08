import * as React from 'react'
import { Modal, Button } from 'antd'
import { Box, Text, SVGBox } from 'components/atoms'
import Wordmark from 'assets/svg/wordmark.svg'
import { defaultConfig } from 'config'
import { shell } from 'electron'
import { Flex } from 'components/atoms/Flex'

interface AboutModalProps {
  visible: boolean
  onOk?(): void
}

export class AboutModal extends React.Component<AboutModalProps, {}> {
  openSiaDir = () => {
    const path = defaultConfig.siad.datadir
    shell.openItem(path)
  }
  render() {
    return (
      <div>
        <Modal
          title="About Sia-UI"
          visible={this.props.visible}
          onOk={this.props.onOk}
          onCancel={this.props.onOk}
          closable={false}
          footer={[
            <Button key="submit" type="primary" onClick={this.props.onOk}>
              Ok
            </Button>
          ]}
        >
          <Flex alignItems="center">
            <Box width={1 / 2}>
              <Flex flexDirection="column" alignItems="center">
                <Flex alignItems="center" justifyContent="center">
                  <SVGBox height="40px">
                    <Wordmark viewBox="0 0 97 58" />
                  </SVGBox>
                </Flex>
              </Flex>
            </Box>
            <Box width={1 / 2} alignSelf="stretch">
              <Box>
                <Text fontWeight={6}>Sia UI</Text>
              </Box>
              <Box>
                <Text is="div">UI: v1.4.0 RC3</Text>
                <Text is="div">Daemon: v1.4.0 RC3</Text>
              </Box>
              <Box pt={3}>
                <Button onClick={this.openSiaDir}>Show Sia Data</Button>
              </Box>
              <Box />
            </Box>
          </Flex>
        </Modal>
      </div>
    )
  }
}
