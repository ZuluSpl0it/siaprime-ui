import * as React from 'react'
import * as Yup from 'yup'
import { FormikProps } from 'formik'
import { Grid } from 'components/atoms/Grid'
import { TextInput, TextInputGroup } from './Inputs'
import { YupPositiveNumber, YupPostiveInteger, YupStorageUnit } from 'utils/schema'
import { Tag } from 'antd'
import { StorageUnitSelector } from './RequiredAllowanceForm'

export interface AdvancedAllowanceFormItems {
  period: string
  hosts: string
  renewWindow: string
  expectedDownload: string
  expectedDownloadUnit: string
  expectedUpload: string
  expectedUploadUnit: string
}

export const AdvancedAllowanceFormSchema = {
  period: YupPostiveInteger,
  hosts: YupPostiveInteger,
  renewWindow: YupPostiveInteger,
  expectedDownload: YupPositiveNumber,
  expectedDownloadUnit: YupStorageUnit,
  expectedUpload: YupPositiveNumber,
  expectedUploadUnit: YupStorageUnit
}

export const AdvancedAllowanceForm = (props: FormikProps<AdvancedAllowanceFormItems>) => {
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
      <Grid gridTemplateColumns="1fr 1fr" gridGap={2}>
        <TextInputGroup
          value={values.period}
          name="period"
          id="period"
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.period && errors.period}
          label="Period"
          suffix={<Tag>Blocks</Tag>}
        />
        <TextInput
          value={values.hosts}
          id="hosts"
          name="hosts"
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.hosts && errors.hosts}
          label="Hosts"
        />
      </Grid>
      <TextInputGroup
        value={values.renewWindow}
        name="renewWindow"
        id="renewWindow"
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.renewWindow && errors.renewWindow}
        label="Renew Window"
        suffix={<Tag>Blocks</Tag>}
      />
      <Grid gridTemplateColumns="1fr 1fr" gridGap={2}>
        <TextInputGroup
          value={values.expectedDownload}
          name="expectedDownload"
          id="expectedDownload"
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.expectedDownload && errors.expectedDownload}
          label="Expected Download"
          addonAfter={
            <StorageUnitSelector
              name="storageUnit"
              id="storageUnit"
              value={values.expectedDownloadUnit}
              defaultValue={values.expectedDownloadUnit}
              onChange={v => setFieldValue('expectedDownloadUnit', v)}
            />
          }
        />
        <TextInputGroup
          value={values.expectedUpload}
          name="expectedUpload"
          id="expectedUpload"
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.expectedUpload && errors.expectedUpload}
          label="Expected Upload"
          addonAfter={
            <StorageUnitSelector
              name="storageUnit"
              id="storageUnit"
              value={values.expectedUploadUnit}
              defaultValue={values.expectedUploadUnit}
              onChange={v => setFieldValue('expectedUploadUnit', v)}
            />
          }
        />
      </Grid>
    </form>
  )
}
