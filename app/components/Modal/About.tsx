import { Button, Modal } from 'antd'
import Wordmark from 'assets/svg/draco.svg'
import { Box, SVGBox, Text } from 'components/atoms'
import { Flex } from 'components/atoms/Flex'
import { defaultConfig } from 'config'
import { shell } from 'electron'
import * as React from 'react'

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
    // @ts-ignore
    // @ts-ignore
    return (
      <div>
        <Modal
          title="About SiaPrime-UI"
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
                  {/*<SVGBox height="100px"> TODO: Insert Prime Logo later
                    <Wordmark viewBox="0 0 400 400" />
                  </SVGBox>*/}
                </Flex>
              </Flex>
            </Box>
            <Box width={1 / 2} alignSelf="stretch">
              <Box>
                <Text fontWeight={6}>SiaPrime UI</Text>
              </Box>
              <Box>
                <Text is="div">UI: v1.4.0</Text>
                <Text is="div">Daemon: v1.4.0</Text>
              </Box>
              <Box pt={3}>
                <Button onClick={this.openSiaDir}>Show SiaPrime Data</Button>
              </Box>
              <Box />
            </Box>
          </Flex>
        </Modal>
      </div>
    )
  }
}
