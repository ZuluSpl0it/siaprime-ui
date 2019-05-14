import { Button, Modal } from 'antd'
import Wordmark from 'assets/svg/draco.svg'
import { Box, SVGBox, Text } from 'components/atoms'
import { Flex } from 'components/atoms/Flex'
import defaultConfig from 'config'
import { shell } from 'electron'
import * as React from 'react'
import { siad } from 'api/siad'

interface AboutModalProps {
  visible: boolean
  onOk?(): void
}

const AboutButton = props => (
  <Box pt={1} width={200}>
    <Button style={{ width: '100%' }} {...props} />
  </Box>
)

export const AboutModal: React.SFC<AboutModalProps> = ({ visible, onOk }) => {
  const openSiaDir = React.useCallback(() => {
    const path = defaultConfig.siad.datadir
    shell.openItem(path)
  }, [])
  const openConfig = React.useCallback(() => {
    shell.openItem(defaultConfig.userConfigFolder)
  }, [])

  const [updateInfo, setUpdateInfo] = React.useState({
    available: false,
    version: 'unknown',
    error: '',
    loaded: false
  })

  const openSiaLink = React.useCallback(() => {
    shell.openExternal('https://sia.tech/get-started')
  }, [])

  const checkForUpdates = React.useCallback(async () => {
    try {
      const version = await siad.call('/daemon/update')
      setUpdateInfo({ ...version, loaded: true })
    } catch (e) {
      if (e.error && e.error.message) {
        setUpdateInfo({ ...updateInfo, error: e.error.message })
      } else {
        setUpdateInfo({ ...updateInfo, error: 'Unknown error occured' })
      }
    }
  }, [updateInfo])

  return (
    <div>
      <Modal
        title="About Sia-UI"
        visible={visible}
        onOk={onOk}
        onCancel={onOk}
        closable={false}
        footer={[
          <Button key="submit" type="primary" onClick={onOk}>
            Ok
          </Button>
        ]}
      >
        <Flex alignItems="center" height="100%">
          <Box width={1 / 2} my="auto">
            <Flex flexDirection="column" alignItems="center" height="100%">
              <SVGBox height="150px">
                <Wordmark viewBox="0 0 400 400" />
              </SVGBox>
            </Flex>
          </Box>
          <Box width={1 / 2} height="100%" mb="auto">
            <Box>
              <Text fontSize={3} fontWeight={6}>
                Sia UI
              </Text>
              <Text fontSize={3} fontWeight={2}>
                {' '}
                (Draco)
              </Text>
            </Box>
            <Box py={2}>
              <Text fontSize={2} is="div">
                UI: v1.4.0
              </Text>
              <Text fontSize={2} is="div">
                Daemon: v1.4.0
              </Text>
            </Box>
            <Box>
              {updateInfo.loaded ? (
                updateInfo.available ? (
                  <Text is="a" onClick={openSiaLink}>
                    Version {updateInfo.version} Available!
                  </Text>
                ) : (
                  <Text>No Updates Available</Text>
                )
              ) : null}
              {updateInfo.error && <Text>{updateInfo.error}</Text>}
            </Box>
            <AboutButton onClick={checkForUpdates}>Check for Updates</AboutButton>
            <AboutButton onClick={openSiaDir}>Open Data Folder</AboutButton>
            <AboutButton onClick={openSiaDir}>Show Config Folder</AboutButton>
            <Box pt={2}>{updateInfo.error && <Text>{updateInfo.error}</Text>}</Box>
            <Box />
          </Box>
        </Flex>
      </Modal>
    </div>
  )
}
