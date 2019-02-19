import { Icon, Tooltip } from 'antd'
import { Box, Text, TextWithAdornment } from 'components/atoms'
import { ConsensusModel } from 'models'
import * as React from 'react'
import styled from 'styled-components'

const BoldText = ({ children }: any) => (
  <Text fontWeight={600} color="white">
    {children}
  </Text>
)
const StatText = ({ children }: any) => <Text color="white">{children}</Text>

interface StatProps {
  title: string
  stat: string
}

const TextOverflow = styled(Box)`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
`

const Stat = ({ title, stat }: StatProps) => (
  <TextOverflow>
    <BoldText>{title}: </BoldText>
    <StatText>{stat}</StatText>
  </TextOverflow>
)

type SyncStatusProps = Partial<ConsensusModel.ConsensusGETResponse>

export default ({ synced, height, currentblock, difficulty }: SyncStatusProps) => {
  let hash = currentblock
  if (currentblock) {
    hash = currentblock.slice(0, 5) + '...' + currentblock.slice(-5)
  }
  return (
    <Tooltip
      placement="leftBottom"
      title={() => (
        <Box>
          <Stat title="Block Height" stat={`${height.toLocaleString('en-US')}`} />
          <Stat title="Block Hash" stat={`${hash}`} />
          <Stat title="Difficulty" stat={`${difficulty}`} />
        </Box>
      )}
    >
      {synced ? (
        <TextWithAdornment is="div" after={<Icon type="check-circle" />} fontWeight={500}>
          Synced
        </TextWithAdornment>
      ) : (
        <TextWithAdornment after={<Icon type="loading" />} fontWeight={500}>
          Synchronizing
        </TextWithAdornment>
      )}
    </Tooltip>
  )
}
