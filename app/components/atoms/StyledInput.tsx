import { Input } from 'antd'
import styled, { css } from 'styled-components'
import { themeGet } from 'styled-system'
import { InputProps } from 'antd/lib/input'

// TODO: not typed very well. Can get confusing.
const inputStates = {
  error: themeGet('red'),
  success: themeGet('sia-green')
}

type StyledInputProps = InputProps & { state?: 'error' | 'success' }

const inputStyles = css<StyledInputProps>`
  background: ${themeGet('colors.indigo.4')};
  font-size: ${themeGet('fontSizes.1')}px;
  color: ${themeGet('colors.text')};
  border: 1px solid
    ${props => (props.state ? inputStates[props.state] : themeGet('colors.indigo.2'))};
  &:hover {
    border: 1px solid ${themeGet('colors.indigo.0')};
  }
  &:focus,
  &:active {
    box-shadow: none;
    border: 1px solid ${themeGet('colors.brand')};
  }
  &.ant-input-lg {
    padding: 8px 18px;
  }
`

export const StyledInput = styled(Input)<StyledInputProps>``

export const StyledInputPassword = styled(Input.Password)``

export const StyledInputGroup = styled(Input)``
