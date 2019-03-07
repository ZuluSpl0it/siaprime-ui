import * as React from 'react'
import { Modal, Slider, InputNumber } from 'antd'
import { Box, Text } from 'components/atoms'
import { Flex } from 'rebass'
import { IndexState } from 'reducers'
import { useMappedState, useDispatch } from 'redux-react-hook'
import { toSiacoins } from 'sia-typescript'
import { RenterActions } from 'actions'

export const AllowanceModal = (props: any) => {
  const { closeModal } = props
  const [allowanceAmount, setAllowanceAmount] = React.useState(200)
  const [maxBalance, setMaxBalance] = React.useState(0)

  const mapState = React.useCallback(
    (state: IndexState) => ({
      balance: state.wallet.summary.confirmedsiacoinbalance
    }),
    []
  )
  const { balance } = useMappedState(mapState)

  // Effects sets the max siacoin balance for the slider
  React.useEffect(() => {
    const siacoinBalance = toSiacoins(balance).toNumber()
    setMaxBalance(siacoinBalance)
  }, [balance])

  const dispatch = useDispatch()
  const createAllowance = React.useCallback(() => {
    if (allowanceAmount < maxBalance) {
      dispatch(
        RenterActions.setAllowance.started({
          allowance: allowanceAmount
        })
      )
      closeModal()
    }
  }, [maxBalance, allowanceAmount])

  return (
    <Modal {...props} onOk={createAllowance} onCancel={closeModal}>
      <Box py={3}>
        <Text fontSize={3}>Rent storage on the Sia Network</Text>
      </Box>
      <Box>
        <Text as="p">
          To upload and download files on Sia, you must allocate funds in advance. Your allowance
          will remain locked for 3 months, after which unspent funds are refunded to your wallet.
          You can increase your allowance at any time.
        </Text>
      </Box>
      <Flex>
        {/* <Box width={12 / 18}>
          <Slider
            min={1}
            max={maxBalance}
            onChange={amt => setAllowanceAmount(amt as any)}
            value={allowanceAmount}
          />
        </Box> */}
        <Box width={6 / 18}>
          <InputNumber
            min={1}
            max={maxBalance}
            style={{ marginRight: 16 }}
            value={allowanceAmount}
            onChange={e => typeof e === 'number' && setAllowanceAmount(e)}
          />
          <Text>SC</Text>
        </Box>
      </Flex>
    </Modal>
  )
}
