import * as React from 'react'
import { Modal, Button } from 'antd'
import { Box, Text, SVGBox } from 'components/atoms'
import { Flex } from 'rebass'
import Wordmark from 'assets/svg/wordmark.svg'

interface AboutModalProps {
  visible: boolean
  onOk?(): void
}

export class AboutModal extends React.Component<AboutModalProps, {}> {
  render() {
    return (
      <div>
        <Modal
          title="About Sia-UI"
          visible={this.props.visible}
          onOk={this.props.onOk}
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
                <Box pt={2}>
                  <Text>1.4.0 RC2</Text>
                </Box>
              </Flex>
            </Box>
            <Box width={1 / 2}>
              <Text>
                You are using a beta, unfinished version of Sia-UI. Understand the risks of using
                this wallet, and use at your own discretion.
              </Text>
            </Box>
          </Flex>
        </Modal>
      </div>
    )
  }
}
