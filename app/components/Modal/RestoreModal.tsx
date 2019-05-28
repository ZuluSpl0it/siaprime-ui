import { Button, Modal, Progress } from 'antd'
import { siad } from 'api/siad'
import { Box, Text } from 'components/atoms'
import * as moment from 'moment'
import * as React from 'react'
import { Flex } from 'rebass'
import { useSiad } from 'hooks'
import { useConsensus } from 'hooks/reduxHooks'
import { StyledModal } from 'components/atoms/StyledModal'

interface BackupObject {
  name: string
  creationdate: number
  size: number
}

// RestoreModal shows the available backups that exists from the contracts.
// There are two main actions in this modal. This first is the ability to
// recover contracts that exists. Once that process is complete, a list of
// available backups will appear for the user to restore.
export const RestoreModal = (props: any) => {
  const { closeModal, fileNav } = props
  // confirmClose displays a modal imperatively that confirms that the user
  // intends on closing the recovery modal. Currently, Sia does not support file
  // recovery once allowance is set and contracts are available. Thus, the user
  // needs to recover their files all in one go once they restore from seed.
  const consensus = useConsensus()
  const [backups, _] = useSiad('/renter/uploadedbackups')
  const [restoreName, setRestoreName] = React.useState('')
  const [restore, restoreTrigger] = useSiad(
    {
      url: '/renter/recoverbackup',
      method: 'POST',
      // set timeout to 30min... backups can take awhile.
      timeout: 1e3 * 60 * 30,
      qs: {
        source: restoreName,
        remote: true
      }
    },
    false
  )

  const [recoveryScan, recoveryScanTrigger] = useSiad(
    {
      url: '/renter/recoveryscan',
      method: 'POST',
      timeout: 1e3 * 60 * 30
    },
    false
  )

  const [recoveryScanProgress, rspTrigger] = useSiad('/renter/recoveryscan')

  React.useEffect(() => {
    const pollRSP = setInterval(() => {
      rspTrigger()
    }, 3000)

    return () => clearInterval(pollRSP)
  }, [])

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
          {!scanInProgress && !backups.loading && !backups.error && backups.response.length === 0 && (
            <Text fontSize={2} fontWeight={3}>
              No backups were found. You may have to perform a recovery scan in order to retrieve
              active contracts found on the blockchain. You can do that by clicking the button
              below.
            </Text>
          )}
          {!scanInProgress &&
            !backups.loading &&
            !backups.error &&
            (backups.response as BackupObject[])
              .sort((a, b) => b.creationdate - a.creationdate)
              .map(x => {
                return (
                  <Flex
                    key={x.name + x.creationdate}
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                  >
                    <Box>
                      <Box>
                        <Text color="mid-gray">
                          {moment.unix(x.creationdate).format('MMM Do YY')}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize={2}>{x.name}</Text>
                      </Box>
                    </Box>
                    <Box>
                      <Button
                        onClick={() => {
                          setRestoreName(x.name)
                          restoreTrigger()
                        }}
                        loading={restoreName === x.name}
                        disabled={restore.loading}
                      >
                        Restore
                      </Button>
                    </Box>
                  </Flex>
                )
              })}
        </Box>
      </Box>
    </StyledModal>
  )
}
