import { Button, Input, Modal } from 'antd'
import { Box } from 'components/atoms'
import { spawnSiac } from 'components/Modal/util'
import * as React from 'react'
import styled from 'styled-components'
import { Flex } from 'components/atoms/Flex'

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
  const [input, setInput] = React.useState('')
  return (
    <div>
      <Modal
        width="80vw"
        title="Terminal"
        visible={props.visible}
        onOk={props.onOk}
        onCancel={props.onOk}
        closable={false}
        centered
        footer={[
          <Button key="submit" type="primary" onClick={props.onOk}>
            Done
          </Button>
        ]}
      >
        <Flex alignItems="center" height="50vh">
          <OuterPreWrap>
            <PreWrap>
              {stdout.map((s, i) => (
                <pre style={{ paddingTop: '50px', fontWeight: 600 }} key={i}>
                  {s}
                </pre>
              ))}
            </PreWrap>
          </OuterPreWrap>
        </Flex>
        <Input
          type="text"
          onChange={e => setInput(e.target.value)}
          value={input}
          onPressEnter={async (e: any) => {
            const command = input
            try {
              switch (command) {
                case 'clear':
                  setState([])
                  return
                default:
                  break
              }
              if (command) {
                const command = e.target.value
                setInput('')
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
