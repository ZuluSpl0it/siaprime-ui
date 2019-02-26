import * as React from 'react'
import {
  alignItems,
  alignContent,
  alignSelf,
  justifyContent,
  flexWrap,
  flex,
  flexBasis,
  flexDirection,
  FlexBasisProps,
  FlexProps,
  AlignItemsProps,
  AlignContentProps,
  AlignSelfProps,
  JustifyContentProps,
  FlexWrapProps,
  FlexDirectionProps
} from 'styled-system'
import styled from 'styled-components'
import { Box, BoxProps } from './Box'

export type FlexBoxProps = BoxProps &
  FlexProps &
  AlignItemsProps &
  AlignContentProps &
  AlignSelfProps &
  JustifyContentProps &
  FlexWrapProps &
  FlexBasisProps &
  FlexDirectionProps

export const Flex = styled(Box)<FlexBoxProps>`
  ${flex}
  ${alignItems}
  ${alignContent}
  ${alignSelf}
  ${justifyContent}
  ${flexWrap}
  ${flexBasis}
  ${flexDirection}
`

Flex.defaultProps = {
  display: 'flex'
}

Flex.displayName = 'Flexbox'
