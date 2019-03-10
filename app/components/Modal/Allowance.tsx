import * as React from 'react'
import { Modal, Slider, InputNumber } from 'antd'
import { Box, Text } from 'components/atoms'
import { Flex } from 'rebass'
import { IndexState } from 'reducers'
import { useMappedState, useDispatch } from 'redux-react-hook'
import { toSiacoins, toHastings } from 'sia-typescript'
import { RenterActions } from 'actions'
import { RenterModel } from 'models'
import BigNumber from 'bignumber.js'
const bytes = require('bytes')

export const AllowanceModal = (props: any) => {
  const { closeModal } = props
  const pricing: RenterModel.PricesGETResponse = props.pricing
  const summary: RenterModel.RenterGETResponse = props.renterSummary

  const defaultAllowance = new BigNumber(summary.settings.allowance.funds).toNumber()
  const setAllowance = defaultAllowance > 0 ? toSiacoins(defaultAllowance).toNumber() : 500

  const [allowanceAmount, setAllowanceAmount] = React.useState(setAllowance)
  const [maxBalance, setMaxBalance] = React.useState(0)

  // TODO should use a better estimation method given new api data is passed back.
  const storageEstimates = React.useMemo(() => {
    const storagePerTbMonth = new BigNumber(pricing.storageterabytemonth)
    const monthsPerContract = 3
    const uploadPerTb = new BigNumber(pricing.uploadterabyte)
    const allowance = toHastings(allowanceAmount)
    const contractFees = new BigNumber(pricing.formcontracts)

    const allowanceMinusFees = allowance.minus(contractFees)
    const storageOverTime = storagePerTbMonth.times(monthsPerContract).plus(uploadPerTb)
    const estimate = allowanceMinusFees.dividedBy(storageOverTime).times(1e12)

    const result = {
      contractfees: toSiacoins(contractFees).toFixed(2),
      storage: bytes(estimate.toNumber(), {
        unitSeparator: ' '
      })
    }
    return result
  }, [allowanceAmount, pricing])

  const mapState = React.useCallback(
    (state: IndexState) => ({
      balance: state.wallet.summary.confirmedsiacoinbalance
    }),
    []
  )
  const { balance } = useMappedState(mapState)

  const [errorMessage, setError] = React.useState('')

  // Effects sets the max siacoin balance for the slider
  React.useEffect(() => {
    const siacoinBalance = toSiacoins(balance).toNumber()
    setMaxBalance(siacoinBalance)
  }, [balance])

  const dispatch = useDispatch()
  const createAllowance = React.useCallback(() => {
    if (allowanceAmount === 0) {
      setError('Your allowance amount cannot be zero.')
    } else if (allowanceAmount < maxBalance) {
      dispatch(
        RenterActions.setAllowance.started({
          allowance: allowanceAmount
        })
      )
      closeModal()
    } else {
      setError('Your wallet has insufficient funds for allowance amount.')
    }
  }, [maxBalance, allowanceAmount])

  return (
    <Modal {...props} onOk={createAllowance} onCancel={closeModal} destroyOnClose>
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
        <Box width={12 / 18}>
          <Box>
            <Text>{storageEstimates.contractfees} SC</Text>{' '}
            <Text fontWeight={2}>Contract Fees</Text>
          </Box>
          <Box>
            <Text>{storageEstimates.storage}</Text> <Text fontWeight={2}>Est. Storage</Text>
          </Box>
        </Box>
      </Flex>
      <Box>{errorMessage && <Text color="red">{errorMessage} </Text>}</Box>
    </Modal>
  )
}
