import * as React from 'react'
import styled from 'styled-components'
import {
  space,
  width,
  fontSize,
  color,
  background,
  SpaceProps,
  WidthProps,
  ColorProps,
  BackgroundProps,
  FontSizeProps,
  DisplayProps,
  height,
  HeightProps,
  display,
  maxWidth,
  MaxWidthProps,
  textAlign,
  TextAlignProps,
  boxShadow,
  minHeight,
  MinHeightProps,
  position,
  PositionProps,
  overflow,
  OverflowProps,
  gridColumn,
  GridColumnProps
} from 'styled-system'

export type BoxProps = SpaceProps &
  DisplayProps &
  PositionProps &
  WidthProps &
  HeightProps &
  ColorProps &
  BackgroundProps &
  FontSizeProps &
  MaxWidthProps &
  MinHeightProps &
  TextAlignProps &
  OverflowProps &
  GridColumnProps

export const Box = styled.div<BoxProps>`
  ${display}
  ${position}
  ${space}
  ${width}
  ${maxWidth}
  ${minHeight}
  ${height}
  ${color}
  ${background}
  ${fontSize}
  ${textAlign}
  ${boxShadow}
  ${overflow}
  ${gridColumn}
`
Box.displayName = 'Box'

Box.defaultProps = {
  position: 'relative'
}
