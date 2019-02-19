import { Icon } from 'antd'
import { Box, Card, Text } from 'components/atoms'
import { WalletModel } from 'models'
import * as moment from 'moment/moment'
import * as React from 'react'
import { Flex } from 'rebass'
import { StructuredTransaction } from 'selectors'
import { ThemeProps, withTheme } from 'styled-components'

const Checkmark = ({ color }: any) => (
  <Icon style={{ fontSize: 16, color: color || 'green' }} type="check-circle" />
)

const SendIcon = ({ color }: any) => (
  <Icon style={{ fontSize: 16, color: color || 'red' }} type="to-top" />
)

const ReceiveIcon = ({ color }: any) => (
  <Icon style={{ fontSize: 16, color: color || 'green' }} type="download" />
)

export interface TransactionItemProps {
  sc: string
  txid: string
  time: string
  tags: WalletModel.TransactionTypes[]
  confirmationheight: number
}

export const transactionFormatTool = (tx: StructuredTransaction): TransactionItemProps => ({
  sc: tx.details.totalSiacoin,
  time: moment
    .unix(tx.date)
    .format('MMM Do YY h:mm a')
    .toString(),
  txid: tx.id,
  tags: tx.details.labels,
  confirmationheight: tx.height
})

export const TransactionItem = withTheme(
  ({ sc, txid, time, theme }: TransactionItemProps & ThemeProps<any>) => {
    return (
      <Box my={2}>
        <Card>
          <Flex alignItems="center" py={2}>
            <Box display="flex" justifyContent="center" alignItems="center" pr={3}>
              {parseFloat(sc) > 0 ? (
                <ReceiveIcon color={theme.colors['sia-green']} />
              ) : (
                <SendIcon />
              )}
            </Box>
            <Box mr={4} width="120px" css={{ flexShrink: 0 }}>
              <Text is="div">{sc} SC</Text>
            </Box>
            <Box>
              <Text is="div" color="mid-gray">
                {txid}
              </Text>
            </Box>
            <Box ml="auto">
              <Text color="mid-gray" is="div">
                {time === 'Invalid date' ? 'Unconfirmed' : time}
              </Text>
            </Box>
          </Flex>
        </Card>
      </Box>
    )
  }
)
