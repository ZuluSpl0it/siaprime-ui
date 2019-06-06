import { RenterActions, AllowanceSettings } from 'actions'
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
import {
  RequiredAllowanceForm,
  RequiredAllowanceFormSchema
} from 'components/Forms/RequiredAllowanceForm'
import { Formik } from 'formik'
import {
  AdvancedAllowanceFormSchema,
  AdvancedAllowanceForm
} from 'components/Forms/AdvancedAllowanceForm'
import * as Yup from 'yup'
import { bytesToGBString } from 'utils/conversion'

const bytes = require('bytes')

const CombinedFormSchema = Yup.object().shape({
  ...AdvancedAllowanceFormSchema,
  ...RequiredAllowanceFormSchema
})

export const AllowanceModal = (props: any) => {
  const { closeModal, rentStorage } = props
  const summary: RenterModel.RenterGETResponse = props.renterSummary

  const mapState = React.useCallback(
    (state: IndexState) => ({
      balance: state.wallet.summary.confirmedsiacoinbalance,
      renterSettings: state.renter.summary.settings
    }),
    []
  )
  const { balance, renterSettings } = useMappedState(mapState)

  const dispatch = useDispatch()
  const createAllowance = React.useCallback(allowanceBody => {
    dispatch(RenterActions.setAllowance.started(allowanceBody))
    closeModal()
  }, [])

  // set the initial required allowance form values from redux state.
  const initialFormValues = React.useMemo(
    () => ({
      allowance: toSiacoins(new BigNumber(renterSettings.allowance.funds)).toFixed(0),
      expectedStorage: bytesToGBString(renterSettings.allowance.expectedstorage),
      storageUnit: 'gb',
      period: renterSettings.allowance.period.toString(),
      hosts: renterSettings.allowance.hosts.toString(),
      renewWindow: renterSettings.allowance.renewwindow.toString(),
      expectedDownload: bytesToGBString(renterSettings.allowance.expecteddownload),
      expectedDownloadUnit: 'gb',
      expectedUpload: bytesToGBString(renterSettings.allowance.expectedupload),
      expectedUploadUnit: 'gb'
    }),
    [renterSettings.allowance]
  )

  return (
    <Formik
      validationSchema={CombinedFormSchema}
      initialValues={initialFormValues}
      onSubmit={(payload, formikBag) => {
        // we can safely parse here since Yup already prevalidates the schema.
        const funds = toHastings(new BigNumber(payload.allowance)).toString()
        const hosts = parseInt(payload.hosts)
        const period = parseInt(payload.period)
        const renewwindow = parseInt(payload.renewWindow)
        const expectedstorage = bytes.parse(`${payload.expectedStorage} ${payload.storageUnit}`)
        const expecteddownload = bytes.parse(
          `${payload.expectedDownload} ${payload.expectedDownloadUnit}`
        )
        const expectedupload = bytes.parse(
          `${payload.expectedUpload} ${payload.expectedUploadUnit}`
        )

        const allowanceBody: AllowanceSettings = {
          funds,
          hosts,
          period,
          renewwindow,
          expectedstorage,
          expecteddownload,
          expectedupload
        }
        createAllowance(allowanceBody)
      }}
      render={formikProps => {
        return (
          <StyledModal
            {...props}
            onOk={formikProps.handleSubmit}
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
                    <RequiredAllowanceForm {...formikProps} />
                  </Box>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Advanced" key="2">
                  <Box pb={3}>
                    <Text color="near-black">
                      By setting accurate advanced settings, Sia can better manage your contracts
                      and provide you with an optimized storage experience.
                    </Text>
                  </Box>
                  <Box>
                    <AdvancedAllowanceForm {...formikProps} />
                  </Box>
                </Tabs.TabPane>
              </StyledTabs>
            </Box>
          </StyledModal>
        )
      }}
    />
  )
}
