import * as React from 'react'
import { Steps, Button, message } from 'antd'
import styled from 'styled-components'
import {
  Box,
  Text,
  Card,
  ButtonWithAdornment,
  FormItemProps,
  defaultFieldState
} from 'components/atoms'
import { SetupDescText } from 'containers/Wallet/Send'
import { Flex } from 'rebass'
import { Stat } from 'components/Card'

/*
Happy Flow
1) Create a storage folder
2) Set the preferred price, bandwidth and collateral
3) Set accepting contracts to yes
4) Announce host
*/

const StepWrap = ({ children }: any) => {
  return (
    <Box height="100%" p={2}>
      {children}
    </Box>
  )
}

const FirstStep = () => {
  return (
    <StepWrap>
      <Flex alignItems="center">
        <Box p={4}>
          <Box>
            <Text fontSize={5}>Welcome to Hosting</Text>
          </Box>
          <Box pt={2}>
            <Text fontSize={3}>Let's get started by choosing a folder to store your Sia data.</Text>
          </Box>
          <Box pt={3}>
            <Button>Choose a Folder</Button>
          </Box>
        </Box>
      </Flex>
    </StepWrap>
  )
}

const Step = Steps.Step
const steps = [
  {
    title: 'Folder Setup',
    content: <FirstStep />
  },
  {
    title: 'Second',
    content: 'Second-content'
  },
  {
    title: 'Last',
    content: 'Last-content'
  }
]

class HostSetup extends React.Component {
  state = {
    current: 0
  }

  next() {
    const current = this.state.current + 1
    this.setState({ current })
  }

  prev() {
    const current = this.state.current - 1
    this.setState({ current })
  }

  render() {
    const { current } = this.state
    return (
      <Box>
        <Flex>
          <Stat content="Hello" title="siacoin" width={1 / 3} />
        </Flex>
        <Box>
          <Box>
            <Text fontSize={5}>Welcome to Hosting</Text>
          </Box>
          <Flex alignItems="center">
            <Box pt={2}>
              <Text fontSize={3}>
                Let's get started by choosing a folder to store your Sia data.
              </Text>
            </Box>
            <Box pt={3}>
              <Button>Choose a Folder</Button>
            </Box>
          </Flex>
        </Box>
      </Box>
    )
  }
}

export default HostSetup
