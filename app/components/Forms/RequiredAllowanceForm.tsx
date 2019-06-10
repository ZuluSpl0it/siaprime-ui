import * as React from 'react'
import { FormikProps, yupToFormErrors } from 'formik'
import { TextInput, TextInputGroup } from './Inputs'
import * as Yup from 'yup'
import { Select, Tag } from 'antd'
import { YupPositiveNumber, YupStorageUnit } from 'utils/schema'

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
      <TextInputGroup
        value={values.allowance}
        id="allowance"
        label="Allowance"
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.allowance && errors.allowance}
        suffix={<Tag>SC</Tag>}
      />

      <TextInputGroup
        value={values.expectedStorage}
        id="expectedStorage"
        label="Expected Storage"
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.expectedStorage && errors.expectedStorage}
        addonAfter={
          <StorageUnitSelector
            name="storageUnit"
            id="storageUnit"
            value={values.storageUnit}
            defaultValue={values.storageUnit}
            onChange={v => setFieldValue('storageUnit', v)}
          />
        }
      />
    </form>
  )
}
