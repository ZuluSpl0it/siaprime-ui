import { Button, Input, Modal } from 'antd'
import { Box } from 'components/atoms'
import { spawnSiac, createShell } from 'components/Modal/util'
import * as React from 'react'
import styled from 'styled-components'
import { Flex } from 'components/atoms/Flex'
import { StyledModal } from 'components/atoms/StyledModal'
import { themeGet } from 'styled-system'

interface TerminalModalProps {
  visible: boolean
  onOk?(): void
}

const OuterPreWrap = styled(Box)`
  height: 100%;
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
    color: ${themeGet('colors.near-black')};
  }
`

export const TerminalModal: React.FunctionComponent<any> = (props: any) => {
  const [stdout, setState] = React.useState([
    'Welcome to the Sia Terminal! Type `help` to see the available commands. Type `clear` to clear the screen.'
  ])
  const [shell, setShell] = React.useState(null)
  const [input, setInput] = React.useState('')
  React.useEffect(() => {
    if (!shell) {
      let localState = [...stdout]
      const s = createShell()
      s.on('data', data => {
        localState = [...localState, data]
        setState([...localState])
      })
      s.on('exit', () => {
        setShell(null)
      })
      setShell(s)
    }
  }, [])
  React.useEffect(() => {
    let localState = [...stdout]
    if (shell) {
      shell.on('data', data => {
        localState = [...localState, data]
        setState([...localState])
      })
      shell.on('exit', () => {
        setShell(null)
      })
    }
  }, [shell])
  return (
    <div>
      <StyledModal
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
                <pre style={{ fontWeight: 600 }} key={i}>
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
                if (shell) {
                  shell.write(command + '\n')
                } else {
                  const s = createShell(command)
                  setShell(s)
                }
              }
            } catch (e) {
              setState([`Error executing siac. Please contact the developers for help. ${e}`])
            }
          }}
        />
      </StyledModal>
    </div>
  )
}
