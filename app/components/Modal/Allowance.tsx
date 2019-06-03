import { RenterActions } from 'actions'
import { InputNumber, Modal, Tabs } from 'antd'
import BigNumber from 'bignumber.js'
import { Box, Text } from 'components/atoms'
import { RenterModel } from 'models'
import * as React from 'react'
import { Flex } from 'rebass'
import { IndexState } from 'reducers'
import { useDispatch, useMappedState } from 'redux-react-hook'
import { toHastings, toSiacoins } from 'sia-typescript'
import { StyledModal } from 'components/atoms/StyledModal'
import { TextInput } from 'components/Forms/Inputs'
import { StyledTabs } from 'components/atoms/StyledTabs'
import { Grid } from 'components/atoms/Grid'

const bytes = require('bytes')

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
    <StyledModal
      {...props}
      onOk={createAllowance}
      title="Rent Storage on the Sia Network"
      okButtonDisabled={rentStorage.error}
      onCancel={closeModal}
      destroyOnClose
    >
      <Box>
        <StyledTabs defaultActiveKey="1" tabPosition="left">
          <Tabs.TabPane tab="Required" key="1">
            <Box pb={3}>
              <Text color="near-black">
                To upload and download files on Sia, you must allocate funds in advance.
              </Text>
            </Box>
            <Box>
              <TextInput label="Allowance" />
              <TextInput label="Expected Storage" />
            </Box>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Advanced" key="2">
            <Box pb={3}>
              <Text color="near-black">
                By setting accurate advanced settings, Sia can better manage your contracts and
                provide you with an optimized storage experience.
              </Text>
            </Box>
            <Box>
              <Grid gridTemplateColumns="1fr 1fr" gridGap={2}>
                <TextInput label="Period" />
                <TextInput label="Hosts" />
              </Grid>
              <TextInput label="Renew Window" />
              <Grid gridTemplateColumns="1fr 1fr" gridGap={2}>
                <TextInput label="Expected Download" />
                <TextInput label="Expected Upload" />
              </Grid>
            </Box>
          </Tabs.TabPane>
        </StyledTabs>
      </Box>
      {/* <Flex>
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
          {rentStorage.error ? (
            <Box>
              <Text>{rentStorage.error}</Text>
            </Box>
          ) : (
            <>
              <Box>
                <Text>{storageEstimates.contractfees} SC</Text>{' '}
                <Text fontWeight={2}>Contract Fees</Text>
              </Box>
              <Box>
                <Text>{storageEstimates.storage}</Text> <Text fontWeight={2}>Est. Storage</Text>
              </Box>
            </>
          )}
        </Box>
      </Flex> */}
      {/* <Box>{errorMessage && <Text color="red">{errorMessage} </Text>}</Box> */}
    </StyledModal>
  )
}
