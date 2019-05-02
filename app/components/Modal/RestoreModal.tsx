import { RenterActions } from 'actions'
import { InputNumber, Modal, Icon } from 'antd'
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

export const RestoreModal = (props: any) => {
  return (
    <Modal
      title="Snapshot Restore"
      {...props}
      // onOk={}
      okText="Begin Resotre"
      // confirmLoading={results.loading}
      // onCancel={closeModal}
      // cancelButtonDisabled={results.loading}
      // cancelButtonProps={{
      //   disabled: results.loading
      // }}
      destroyOnClose
    >
      <Box>
        <Text as="p">
          Restore an available snapshot found on the blockchain. If the contracts are still active,
          and enough hosts are online, your file contracts will be restored.
        </Text>
      </Box>
      <Box>tbd.</Box>
      {/* {results.loading && (
        <Box>
          <Spinner /> <Text pl={2}>Creating Snapshot...</Text>
        </Box>
      )}
      {results.response && (
        <Box>
          <Icon type="check" /> <Text pl={2}>Snapshot Created Successfully!</Text>
        </Box>
      )}
      {results.error && (
        <Box>
          {' '}
          <Text color="red">
            {results.error.error && results.error.error.message
              ? results.error.error.message
              : results.error}
          </Text>
        </Box>
      )} */}
    </Modal>
  )
}
