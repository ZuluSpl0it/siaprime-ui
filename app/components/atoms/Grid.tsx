import * as React from 'react'
import {
  gridGap,
  gridColumnGap,
  gridRowGap,
  gridColumn,
  gridRow,
  gridAutoFlow,
  gridAutoColumns,
  gridAutoRows,
  gridTemplateColumns,
  gridTemplateRows,
  gridTemplateAreas,
  gridArea,
  GridGapProps,
  GridColumnProps,
  GridRowGapProps,
  GridRowProps,
  GridAutoFlowProps,
  GridAutoColumnsProps,
  GridAutoRowsProps,
  GridTemplatesColumnsProps,
  GridTemplatesRowsProps,
  GridTemplatesAreasProps,
  GridAreaProps
} from 'styled-system'
import styled from 'styled-components'
import { Box, BoxProps } from './Box'
import { Flex } from './Flex'

export type GridBoxProps = BoxProps &
  GridGapProps &
  GridColumnProps &
  GridRowGapProps &
  GridColumnProps &
  GridRowProps &
  GridAutoFlowProps &
  GridAutoColumnsProps &
  GridAutoRowsProps &
  GridTemplatesColumnsProps &
  GridTemplatesRowsProps &
  GridTemplatesAreasProps &
  GridAreaProps

export const Grid = styled(Flex)<GridBoxProps>`
  ${gridGap}
  ${gridColumnGap}
  ${gridRowGap}
  ${gridColumn}
  ${gridRow}
  ${gridAutoFlow}
  ${gridAutoColumns}
  ${gridAutoRows}
  ${gridTemplateColumns}
  ${gridTemplateRows}
  ${gridTemplateAreas}
  ${gridArea}
`

Grid.defaultProps = {
  display: 'grid'
}

Grid.displayName = 'Gridbox'
