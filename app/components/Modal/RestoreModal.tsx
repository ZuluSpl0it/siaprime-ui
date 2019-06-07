import { Button, Modal, Progress } from 'antd'
import { siad } from 'api/siad'
import { Box, Text, Caps, Flex } from 'components/atoms'
import * as moment from 'moment'
import * as React from 'react'
import { useSiad } from 'hooks'
import { useConsensus } from 'hooks/reduxHooks'
import { StyledModal } from 'components/atoms/StyledModal'
import { StyledProgress } from 'components/atoms/StyledProgress'

interface BackupObject {
  name: string
  creationdate: number
  size: number
  uploadprogress: number
}

// RestoreModal shows the available backups that exists from the contracts.
// There are two main actions in this modal. This first is the ability to
// recover contracts that exists. Once that process is complete, a list of
// available backups will appear for the user to restore.
export const RestoreModal = (props: any) => {
  const { closeModal, fileNav } = props
  const consensus = useConsensus()
  const [backups, backupTrigger] = useSiad('/renter/backups')

  const [restoreName, setRestoreName] = React.useState('')
  const [restore, restoreTrigger] = useSiad(
    {
      url: '/renter/backups/restore',
      method: 'POST',
      // set timeout to 30min just in case recovery takes a long time.
      timeout: 1e3 * 60 * 30,
      qs: {
        name: restoreName
      }
    },
    false
  )

  const [_, recoveryScanTrigger] = useSiad(
    {
      url: '/renter/recoveryscan',
      method: 'POST'
    },
    false
  )

  const [recoveryScanProgress, rspTrigger] = useSiad('/renter/recoveryscan')

  React.useEffect(() => {
    if (restoreName) {
      restoreTrigger()
    }
  }, [restoreName])

  React.useEffect(() => {
    setRestoreName('')
    rspTrigger()
    backupTrigger()
    const pollRSP = setInterval(() => {
      rspTrigger()
    }, 3000)

    const pollBackups = setInterval(() => {
      backupTrigger()
    }, 30000)

    return () => {
      clearInterval(pollRSP)
      clearInterval(pollBackups)
    }
  }, [props.visible])

  // close modal when restore is complete
  React.useEffect(() => {
    if (restoreName && !restore.loading && !restore.error) {
      closeModal()
    }
  }, [restore.loading])

  const scanInProgress =
    (recoveryScanProgress.response && recoveryScanProgress.response.scaninprogress) || false

  let okText = !restore.loading ? 'Start Contract Recovery' : 'Restoring Backup'
  if (scanInProgress) {
    okText = 'Recovering Contracts'
  }

  const isLoading = restore.loading || scanInProgress

  return (
    <StyledModal
      title="Snapshot Restore"
      {...props}
      okText={okText}
      onOk={() => recoveryScanTrigger()}
      onCancel={closeModal}
      confirmLoading={isLoading}
      cancelButtonProps={{
        disabled: isLoading
      }}
      destroyOnClose={false}
    >
      <Box>
        <Text as="p">
          Restore an available snapshot found on the blockchain. If the contracts are still active,
          and enough hosts are online, your file contracts will be restored.
        </Text>
      </Box>
      <Box>
        <Text fontSize={3}>Backups Available</Text>
        <Box pt={3}>
          {scanInProgress && (
            <Box pb={2}>
              <Box mx={2}>
                <Progress
                  showInfo={false}
                  percent={(recoveryScanProgress.response.scannedheight / consensus.height) * 100}
                  strokeColor="#1ED660"
                  status="active"
                />
              </Box>
              <Box style={{ textAlign: 'center' }}>
                <Text color="silver">
                  {recoveryScanProgress.response.scannedheight} Blocks Scanned
                </Text>
              </Box>
            </Box>
          )}
          {!backups.loading && backups.error && <Text>{backups.error}</Text>}
          {!scanInProgress &&
            !backups.loading &&
            !backups.error &&
            backups.response.backups.length === 0 && (
              <Text fontSize={2} fontWeight={3}>
                No backups were found. You may have to perform a recovery scan in order to retrieve
                active contracts found on the blockchain. You can do that by clicking the button
                below. If you have already performed a recovery scan, it may take up to 10 minutes
                to find your snapshots.
              </Text>
            )}
          <Box maxHeight={250} overflow="auto">
            {!scanInProgress &&
              !backups.loading &&
              !backups.error &&
              (backups.response.backups as BackupObject[])
                .sort((a, b) => b.creationdate - a.creationdate)
                .map(x => {
                  return (
                    <Flex
                      key={x.name + x.creationdate}
                      justifyContent="space-between"
                      alignItems="center"
                      py={2}
                    >
                      <Box width={100}>
                        {/* <Box>
                        <Caps fontSize={0} color="text-subdued">
                          {moment.unix(x.creationdate).format('MMM Do YY')}
                        </Caps>
                      </Box> */}
                        <Box>
                          <Text fontSize={2}>{x.name}</Text>
                        </Box>
                      </Box>
                      <Box width={200} ml="auto" mr="auto">
                        <StyledProgress
                          percent={x.uploadprogress}
                          showInfo={false}
                          status={x.uploadprogress < 100 ? 'active' : 'success'}
                        />
                      </Box>
                      <Box width={150} pl={4}>
                        <Button
                          onClick={() => {
                            setRestoreName(x.name)
                          }}
                          loading={restoreName === x.name && restore.loading}
                          disabled={restore.loading || x.uploadprogress < 100}
                        >
                          Restore
                        </Button>
                      </Box>
                    </Flex>
                  )
                })}
          </Box>
        </Box>
      </Box>
    </StyledModal>
  )
}
