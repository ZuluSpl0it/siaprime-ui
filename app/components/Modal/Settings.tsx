import { Button, Modal, Switch, Divider, Card } from 'antd'
import Wordmark from 'assets/svg/draco.svg'
import { Box, SVGBox, Text } from 'components/atoms'
import { Flex } from 'components/atoms/Flex'
import defaultConfig from 'config'
import { shell, remote } from 'electron'
import * as React from 'react'
import { TextInput } from 'components/Forms/Inputs'
import { merge } from 'lodash'
import { StyledModal } from 'components/atoms/StyledModal'
import { StyledCard } from 'components/atoms/StyledCard'
import { useSiadUIState } from 'hooks/reduxHooks'
const { app, getCurrentWindow } = remote
const fs = remote.require('fs')

interface SettingModalprops {
  visible: boolean
  onOk?(): void
}

const SettingItem = ({ title, render }) => {
  return (
    <Box px={4} height={60}>
      <Flex height="100%" alignItems="center">
        <Box width={1 / 3}>
          <Text fontSize={2}>{title}</Text>
        </Box>
        <Box width={2 / 3} ml="auto">
          {render}
        </Box>
      </Flex>
    </Box>
  )
}

export const SettingsModal: React.SFC<SettingModalprops> = ({ onOk, visible }) => {
  const [config, setConfig] = React.useState(defaultConfig)
  const onReset = React.useCallback(() => {
    setConfig(defaultConfig)
  }, [defaultConfig])

  const siadState = useSiadUIState()
  const onSave = React.useCallback(() => {
    const newConfig = merge(defaultConfig, config)
    try {
      fs.writeFileSync(defaultConfig.userConfigPath, JSON.stringify(newConfig, null, 4))

      if (process.env.NODE_ENV === 'development') {
        getCurrentWindow().reload()
      } else {
        app.relaunch()
        app.exit(0)
      }
    } catch (err) {}
    if (onOk) {
      onOk()
    }
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
        {!siadState.isInternal && (
          <Box>
            <StyledCard bordered={false}>
              Please note that you are currently using an external instance of Sia and these
              settings do not apply at the moment.
            </StyledCard>
          </Box>
        )}
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
            title="Use Custom Siad"
            render={
              <Switch
                checked={config.siad.useCustomBinary}
                onChange={c =>
                  setConfig({ ...config, siad: { ...config.siad, useCustomBinary: c } })
                }
              />
            }
          />
          {config.siad.useCustomBinary && (
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
          )}
          <SettingItem
            title="Use Custom Siac"
            render={
              <Switch
                checked={config.siac.useCustomBinary}
                onChange={c =>
                  setConfig({ ...config, siac: { ...config.siac, useCustomBinary: c } })
                }
              />
            }
          />
          {config.siac.useCustomBinary && (
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
          )}
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
