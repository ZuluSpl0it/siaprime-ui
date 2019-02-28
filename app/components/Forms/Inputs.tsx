import * as React from 'react'
import { Box, Text } from 'components/atoms'
import { StyledInput, StyledInputPassword } from 'components/atoms/StyledInput'

interface InputFieldProps {
  type?: string
  id: string
  label: string
  error?: string | boolean
  value?: any
}

export const InputFactory: <T>(
  C: React.FunctionComponent<T>
) => React.FunctionComponent<T & InputFieldProps & React.HTMLProps<HTMLInputElement>> = (
  Component: React.FunctionComponent
) => ({ type = 'text', id, label, error, onChange, onBlur, value, ...props }) => {
  return (
    <Box py={2}>
      <Text display="block" fontSize={0} mb={1} as="label" htmlFor={id}>
        {label}
      </Text>
      <Component
        state={error && 'error'}
        id={id}
        size="large"
        type={type}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        {...props}
      />
      <Text pt={2} fontSize={0} color="red">
        {error}
      </Text>
    </Box>
  )
}

export const TextInput = InputFactory(StyledInput)
export const PasswordInput = InputFactory(StyledInputPassword)
