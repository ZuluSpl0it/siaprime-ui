import { RenterActions } from 'actions'
import { InputNumber, Modal } from 'antd'
import BigNumber from 'bignumber.js'
import { Box, StyledTag, Text } from 'components/atoms'
import { StyledModal } from 'components/atoms/StyledModal'
import { RenterModel } from 'models'
import * as React from 'react'
import { Flex } from 'rebass'
import { IndexState } from 'reducers'
import { useDispatch, useMappedState } from 'redux-react-hook'
import { toHastings, toSiacoins } from 'sia-typescript'

const bytes = require('bytes')

const confirmAllowance = (balance, allowance, cb) => {
  Modal.confirm({
    title: 'Confirm Allowance',
    content: `You currently have a balance of ${balance} which is below the allowance amount of ${allowance}. By setting an allowance, your Siacoin will be immediately spent on contracts once they are confirmed in your wallet. Continue?`,
    onOk() {
      cb()
    }
  })
}

export const AllowanceModal = (props: any) => {
  const { closeModal, rentStorage } = props
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
    // we will check if the estimated bytes is greated than 0. the ternary check
    // prevents the estimate from ever being less than 0 bytes (edge case that
    // occurs if allowance is less than contract fees)
    const estimatedBytes = estimate.toNumber() > 0 ? estimate.toNumber() : 0
    const result = {
      contractfees: toSiacoins(contractFees).toFixed(2),
      storage: bytes(estimatedBytes, {
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
      confirmAllowance(maxBalance, allowanceAmount, () => {
        dispatch(
          RenterActions.setAllowance.started({
            allowance: allowanceAmount
          })
        )
      })
    }
  }, [maxBalance, allowanceAmount])

  return (
    <StyledModal
      {...props}
      title="Rent Storage on Sia"
      onOk={createAllowance}
      okButtonDisabled={rentStorage.error}
      onCancel={closeModal}
      destroyOnClose
    >
      <Box py={3}>
        <Text fontSize={3}>Rent storage on the Sia Network</Text>
      </Box>
      <Box pb={3}>
        <Text color="near-black">
          To upload and download files on Sia, you must allocate funds in advance. Your allowance
          will remain locked for 3 months, after which unspent funds are refunded to your wallet.
          You can increase your allowance at any time.
        </Text>
      </Box>
      <Flex>
        <Box width={6 / 18}>
          <InputNumber
            min={1}
            style={{ marginRight: 16 }}
            value={allowanceAmount}
            onChange={e => typeof e === 'number' && setAllowanceAmount(e)}
          />
          <Text>SC</Text>
        </Box>
        <Box width={12 / 18}>
          {rentStorage.error ? (
            <Box>
              <Text>{rentStorage.error}</Text>
            </Box>
          ) : (
            <>
              <Box>
                <StyledTag>
                  <Text>{storageEstimates.contractfees} SC</Text>
                </StyledTag>
                <Text fontWeight={2}>Contract Fees</Text>
              </Box>
              <Box pt={1}>
                <StyledTag>
                  <Text>{storageEstimates.storage}</Text>
                </StyledTag>
                <Text fontWeight={2}>Estimated Storage</Text>
              </Box>
            </>
          )}
        </Box>
      </Flex>
      <Box>{errorMessage && <Text color="red">{errorMessage} </Text>}</Box>
    </StyledModal>
  )
}
