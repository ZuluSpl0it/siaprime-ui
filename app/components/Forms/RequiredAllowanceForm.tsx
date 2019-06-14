import * as React from 'react'
import { FormikProps, yupToFormErrors } from 'formik'
import { TextInput, TextInputGroup } from './Inputs'
import * as Yup from 'yup'
import { Select, Tag, Tooltip, Icon } from 'antd'
import { YupPositiveNumber, YupStorageUnit } from 'utils/schema'
import { Flex, Text, Box } from 'components/atoms'
import { StyledIcon } from 'components/atoms/StyledIcon'

export const RequiredAllowanceFormSchema = {
  allowance: YupPositiveNumber,
  expectedStorage: YupPositiveNumber.required('Please enter a valid storage amount.'),
  storageUnit: YupStorageUnit
}

const { Option } = Select

export const StorageUnitSelector = props => (
  <Select style={{ width: 80 }} {...props}>
    <Option value="gb">GB</Option>
    <Option value="tb">TB</Option>
  </Select>
)

export const RequiredAllowanceForm = (
  props: FormikProps<{ allowance: string; expectedStorage: string; storageUnit: string }>
) => {
  const {
    values,
    touched,
    errors,
    dirty,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    isSubmitting,
    setFieldValue
  } = props
  return (
    <form
      onSubmit={e => {
        e.preventDefault()
      }}
    >
      <Flex>
        <TextInputGroup
          value={values.allowance}
          id="allowance"
          label="Target Price (TB/Month)"
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.allowance && errors.allowance}
          suffix={
            <Flex alignItems="center">
              <Tag>SC</Tag>
              <Tooltip placement="right" title="Info here">
                <StyledIcon type="info-circle" />
              </Tooltip>
            </Flex>
          }
        />
      </Flex>

      <Flex>
        <TextInputGroup
          value={values.expectedStorage}
          id="expectedStorage"
          label="Target Storage"
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.expectedStorage && errors.expectedStorage}
          suffix={
            // <StorageUnitSelector
            //   name="storageUnit"
            //   id="storageUnit"
            //   value={values.storageUnit}
            //   defaultValue={values.storageUnit}
            //   onChange={v => setFieldValue('storageUnit', v)}
            // />
            <Flex alignItems="center">
              <Tag>TB</Tag>
              <Tooltip placement="right" title="Info here">
                <StyledIcon type="info-circle" />
              </Tooltip>
            </Flex>
          }
        />
      </Flex>
    </form>
  )
}
