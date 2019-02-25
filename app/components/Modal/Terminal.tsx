import { Button, Input, Modal } from 'antd'
import { Box } from 'components/atoms'
import { spawnSiac } from 'components/Modal/util'
import * as React from 'react'
import { Flex } from 'rebass'
import styled from 'styled-components'

interface TerminalModalProps {
  visible: boolean
  onOk?(): void
}

const OuterPreWrap = styled(Box)`
  height: 320px;
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
  overflow: auto;
`
const PreWrap = styled(Box)`
  width: 100%;
  pre {
    font-size: 10px;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
`

export const TerminalModal: React.FunctionComponent<any> = (props: any) => {
  const [stdout, setState] = React.useState([
    'Welcome to the Sia Terminal! Type `help` to see the available commands. Type `clear` to clear the screen.'
  ])
  return (
    <div>
      <Modal
        width="80vw"
        title="Terminal"
        visible={props.visible}
        onOk={props.onOk}
        closable={false}
        centered
        footer={[
          <Button key="submit" type="primary" onClick={props.onOk}>
            Done
          </Button>
        ]}
      >
        <Box display="flex" alignItems="center" height="50vh">
          <OuterPreWrap>
            <PreWrap>
              {stdout.map((s, i) => (
                <pre style={{ paddingTop: '50px' }} key={i}>
                  {s}
                </pre>
              ))}
            </PreWrap>
          </OuterPreWrap>
        </Box>
        <Input
          type="text"
          onPressEnter={async (e: any) => {
            const command = e.target.value
            try {
              switch (command) {
                case 'clear':
                  e.target.value = ''
                  setState([])
                  return
                default:
                  break
              }
              if (command) {
                const command = e.target.value
                e.target.value = ''
                setState([...stdout, e.target.value])
                const result = await spawnSiac(command)
                setState([...stdout, result])
              }
            } catch (e) {
              setState([`Error executing siac. Please contact the developers for help. ${e}`])
            }
          }}
        />
      </Modal>
    </div>
  )
}
