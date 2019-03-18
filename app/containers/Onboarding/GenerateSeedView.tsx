import { Input } from 'antd'
import { Box, ButtonWithAdornment, Card, Text } from 'components/atoms'
import { Flex } from 'components/atoms/Flex'
import { Grid } from 'components/atoms/Grid'
import { clipboard } from 'electron'
import * as React from 'react'

export const GenerateSeedView = ({ seed }) => {
  const copySeed = () => {
    clipboard.writeText(seed)
  }
  return (
    <Box>
      <Card mb={4}>
        <Flex alignItems="center">
          <Box mx={4}>
            <svg height={50} width={50} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <title>key</title>
              <g fill="#32d66a" stroke="#32d66a" strokeLinecap="square" strokeWidth="2">
                <path
                  d="M25,1,12.784,13.154a8.572,8.572,0,1,0,6.061,6.061L21,17V13h4V9h3l3-3V1Z"
                  fill="none"
                  stroke="#32d66a"
                />
                <circle cx="10" cy="22" fill="none" r="3" />
              </g>
            </svg>
          </Box>
          <Box>
            <Text fontSize={2}>
              This is your generated seed. It will also be your initial wallet password. Please copy
              and store this seed somewhere safe. It is used to unlock the wallet, as well as to
              recover funds in case the wallet is lost.
            </Text>
            <Box pt={2}>
              <ButtonWithAdornment onClick={copySeed} before iconType="copy">
                Copy Seed to Clipboard
              </ButtonWithAdornment>
            </Box>
          </Box>
        </Flex>
      </Card>
      <Grid gridTemplateColumns="repeat(6, 1fr)" gridGap={3}>
        {seed.split(' ').map((v, i) => (
          <Box>
            <Input prefix={<Text color="silver">{i}</Text>} value={v} />
          </Box>
        ))}
      </Grid>
    </Box>
  )
}
