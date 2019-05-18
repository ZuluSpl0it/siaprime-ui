import { Button, Modal, Switch, Divider } from 'antd'
import Wordmark from 'assets/svg/draco.svg'
import { Box, SVGBox, Text } from 'components/atoms'
import { Flex } from 'components/atoms/Flex'
import defaultConfig from 'config'
import { shell, remote } from 'electron'
import * as React from 'react'
import { TextInput } from 'components/Forms/Inputs'
import { merge } from 'lodash'
import { StyledModal } from 'components/atoms/StyledModal'
const fs = remote.require('fs')
const { getCurrentWindow } = require('electron').remote

interface SettingModalprops {
  visible: boolean
  onOk?(): void
}

const SettingItem = ({ title, render }) => {
  return (
    <Box px={4} height={60}>
      <Flex height="100%" alignItems="center">
        <Box width={1 / 3}>
          <Text fontSize={3}>{title}</Text>
        </Box>
        <Box width={2 / 3} ml="auto">
          {render}
        </Box>
      </Flex>
    </Box>
  )
}

export const SettingsModal = ({ onOk, visible }) => {
  const [config, setConfig] = React.useState(defaultConfig)
  const onReset = React.useCallback(() => {
    setConfig(defaultConfig)
  }, [defaultConfig])
  const onSave = React.useCallback(() => {
    const newConfig = merge(defaultConfig, config)
    try {
      fs.writeFileSync(defaultConfig.userConfigPath, JSON.stringify(newConfig, null, 4))
      getCurrentWindow().reload()
    } catch (err) {}
    onOk()
  }, [defaultConfig, config])

  return (
    <div>
      <StyledModal
        bodyStyle={{
          padding: 0
        }}
        title="Sia-UI Settings"
        visible={visible}
        onOk={onOk}
        onCancel={onOk}
        closable={true}
        footer={[
          <Button key="save" type="primary" onClick={onSave}>
            Save
          </Button>,
          <Button key="reset" type="dashed" onClick={onReset}>
            Reset
          </Button>
        ]}
      >
        <Box overflow="auto" py={2}>
          <SettingItem
            title="Dark Mode"
            render={
              <Switch
                checked={config.darkMode}
                onChange={c => setConfig({ ...config, darkMode: c })}
              />
            }
          />
          <SettingItem
            title="Debug Mode"
            render={
              <Switch
                checked={config.debugMode}
                onChange={c => setConfig({ ...config, debugMode: c })}
              />
            }
          />
          <SettingItem
            title="Data Directory"
            render={
              <TextInput
                id="consensusPath"
                value={config.siad.datadir}
                onChange={e =>
                  setConfig({ ...config, siad: { ...config.siad, datadir: e.target.value } })
                }
              />
            }
          />
          <SettingItem
            title="Daemon Path"
            render={
              <TextInput
                id="daemonPath"
                value={config.siad.path}
                onChange={e =>
                  setConfig({ ...config, siad: { ...config.siad, path: e.target.value } })
                }
              />
            }
          />
          <SettingItem
            title="Client Path"
            render={
              <TextInput
                id="clientPath"
                value={config.siac.path}
                onChange={e =>
                  setConfig({ ...config, siac: { ...config.siac, path: e.target.value } })
                }
              />
            }
          />
          <SettingItem
            title="Log Path"
            render={
              <TextInput
                id="logPath"
                value={config.logPath}
                onChange={e => setConfig({ ...config, logPath: e.target.value })}
              />
            }
          />
        </Box>
      </StyledModal>
    </div>
  )
}
