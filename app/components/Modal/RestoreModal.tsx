import { RenterActions } from 'actions'
import { InputNumber, Modal, Icon, Button } from 'antd'
import BigNumber from 'bignumber.js'
import { Box, Text, Spinner } from 'components/atoms'
import { RenterModel } from 'models'
import * as React from 'react'
import { Flex } from 'rebass'
import { IndexState } from 'reducers'
import { useDispatch, useMappedState } from 'redux-react-hook'
import { toHastings, toSiacoins } from 'sia-typescript'
import { TextInput } from 'components/Forms/Inputs'
import { siad } from 'api/siad'
import * as moment from 'moment'

interface BackupObject {
  name: string
  creationdate: number
  size: number
}

export const RestoreModal = (props: any) => {
  const { closeModal, fileNav } = props
  console.log('filenav', fileNav)
  const [backups, setBackups] = React.useState({
    response: [] as BackupObject[],
    error: null,
    loading: false
  })
  const queryBackups = React.useCallback(async () => {
    try {
      setBackups({
        response: [],
        error: null,
        loading: true
      })
      const response = await siad.call('/renter/uploadedbackups')
      setBackups({ response, error: null, loading: false })
    } catch (e) {
      setBackups({
        response: [],
        error: e,
        loading: false
      })
    }
  }, [])
  React.useEffect(() => {
    queryBackups()
  }, [])

  const [restore, setRestore] = React.useState({
    response: null,
    error: null,
    loading: false
  })
  const [restoreName, setRestoreName] = React.useState('')
  const restoreBackup = React.useCallback(
    async (source: string) => {
      try {
        setRestoreName(source)
        setRestore({
          loading: true,
          response: null,
          error: null
        })
        const response = await siad.call({
          url: '/renter/recoverbackup',
          method: 'POST',
          // set timeout to 30min... backups can take awhile.
          timeout: 1e3 * 60 * 30,
          qs: {
            source,
            remote: true
          }
        })
        setRestore({
          response,
          error: null,
          loading: false
        })
        fileNav.current.__wrappedComponent.forceRefresh()
        setRestoreName('')
        closeModal()
      } catch (e) {
        setRestore({
          response: null,
          error: e,
          loading: false
        })
        setRestoreName('')
      }
    },
    [fileNav, closeModal]
  )
  const okText = !restore.loading ? 'Begin Restore' : 'Restoring Backup'
  return (
    <Modal
      title="Snapshot Restore"
      {...props}
      okText={okText}
      onCancel={closeModal}
      confirmLoading={restore.loading}
      cancelButtonProps={{
        disabled: restore.loading
      }}
      destroyOnClose
    >
      <Box>
        <Text as="p">
          Restore an available snapshot found on the blockchain. If the contracts are still active,
          and enough hosts are online, your file contracts will be restored.
        </Text>
      </Box>
      <Box>
        <Text>Backups Available</Text>
        <Box>
          {backups.response
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
                      onClick={() => restoreBackup(x.name)}
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
    </Modal>
  )
}
