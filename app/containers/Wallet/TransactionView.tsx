import { Icon, Table, Tooltip } from 'antd'
import { TableProps } from 'antd/lib/table'
import { Box, StyledTag, Text } from 'components/atoms'
import { transactionFormatTool } from 'components/Transaction'
import { clipboard } from 'electron'
import { isEqual } from 'lodash'
import * as React from 'react'
import { connect } from 'react-redux'
import { IndexState } from 'reducers'
import { ConsensusRootReducer } from 'reducers/consensus'
import { OrganizedTx, selectConsensus, selectOrganizedTx } from 'selectors'
import styled from 'styled-components'
import { themeGet } from 'styled-system'
import { Flex } from 'components/atoms/Flex'
import { WalletModel } from 'models'

interface StateProps {
  transactions: OrganizedTx
  // groupedTransactions: GroupedTx
  consensus: ConsensusRootReducer.State
}

const StyledTable = ({ ...props }: TableProps<any>) => {
  const Div = styled.div`
    .ant-table-body {
      margin: 0 !important;
    }
    .ant-table-tbody > tr > td {
      border-bottom: 1px solid #efefef;
      background-color: ${themeGet('colors.almostwhite')};
    }
    /* .ant-pagination-prev .ant-pagination-item-link,
    .ant-pagination-next .ant-pagination-item-link,
    .ant-pagination-item {
      background-color: ${(props: any) => props.theme.colors['near-white']};
    } */
    .ant-table-thead > tr > th {
      background-color: ${themeGet('colors.white')};
      color: ${themeGet('colors.near-black')};
      border-bottom: 1px solid #efefef;
    }
    .ant-table-thead > tr:first-child > th:last-child {
      border-top-right-radius: 0;
    }
    .ant-table-thead > tr:first-child > th:first-child {
      border-top-left-radius: 0;
    }
  `
  return (
    <Div>
      <Table {...props} />
    </Div>
  )
}

type Props = StateProps
class TransactionView extends React.Component<Props, {}> {
  shouldComponentUpdate = (nextProps: Props, _: any) => {
    if (
      isEqual(this.props.transactions, nextProps.transactions) &&
      nextProps.consensus.height === this.props.consensus.height
    ) {
      return false
    }
    return true
  }

  render() {
    const TableTitle = ({ children }: any) => (
      <Text color="silver" css={{ textTransform: 'uppercase' }}>
        {children}
      </Text>
    )
    const { transactions, consensus } = this.props
    const currHeight = consensus.height
    return (
      <>
        <StyledTable
          rowKey="txid"
          pagination={{ pageSize: 50 }}
          scroll={{
            y: 350
          }}
          columns={[
            {
              title: () => <TableTitle>Amount</TableTitle>,
              width: 180,
              align: 'right',
              dataIndex: 'sc',
              key: 'sum',
              render: (value: any) => {
                const isRed = parseFloat(value) < 0 ? true : false
                return (
                  <Flex>
                    <Box pr="2px">
                      <Icon
                        style={{
                          color: isRed ? '#999' : '#1ED660',
                          fontWeight: 800,
                          opacity: 1
                        }}
                        type={isRed ? 'down-circle' : 'up-circle'}
                      />
                    </Box>
                    <Text fontSize="14px" fontWeight={500} color="mid-gray" ml="auto">
                      {parseFloat(value).toLocaleString('en-US')} <Text color="gray">SC</Text>
                    </Text>
                  </Flex>
                )
              },
              sorter: (a, b) => a.sc - b.sc,
              sortDirections: ['descend', 'ascend']
            },
            {
              title: () => <TableTitle>Transaction ID</TableTitle>,
              width: 250,
              dataIndex: 'txid',
              key: 'txid',
              render: (value: any) => {
                const copy = () => {
                  clipboard.writeText(value)
                }
                const len = 8
                const transformId = value.slice(0, len) + '...' + value.slice(value.length - len)
                return (
                  <Tooltip placement="bottom" title={<Text color="white">{value}</Text>}>
                    <Text
                      css={{ cursor: 'pointer' }}
                      onClick={copy}
                      fontSize="14px"
                      fontWeight={3}
                      color="gray"
                    >
                      {transformId}
                    </Text>
                  </Tooltip>
                )
              }
            },
            {
              title: () => <TableTitle>Time</TableTitle>,
              width: 200,
              dataIndex: 'time',
              key: 'time',
              render: (value: any) => (
                <Text fontSize="14px" fontWeight={3} color="gray">
                  {value}
                </Text>
              )
            },
            {
              title: () => <TableTitle>Type</TableTitle>,
              width: 150,
              dataIndex: 'tags',
              key: 'tags',
              render: (tags: string[]) => {
                let filteredTags = tags
                if (filteredTags.length > 1) {
                  filteredTags = tags.filter(t => t !== 'SIACOIN')
                }
                return (
                  <span>
                    {filteredTags.map((t: string) => (
                      <StyledTag key={t}>{t}</StyledTag>
                    ))}
                  </span>
                )
              },
              filters: WalletModel.TransactionTypesList.map(v => ({
                value: v,
                text: v
              })),
              filterMultiple: true,
              onFilter: (value, record) => record.tags.includes(value)
            },
            {
              title: () => <TableTitle>Status</TableTitle>,
              align: 'center',
              dataIndex: 'confirmationheight',
              key: 'confirmationheight',
              render: (x: number) => {
                const confs = currHeight - x
                return confs < 6 ? (
                  <Flex alignItems="center" color="mid-gray" justifyContent="center">
                    <Text fontSize="14px" fontWeight={400}>
                      {currHeight - x}/6
                    </Text>
                  </Flex>
                ) : (
                  <Flex alignItems="center" justifyContent="center">
                    <Tooltip title={`${confs} Confirmations`}>
                      <Icon style={{ color: '#1ED660' }} type="check-circle" />
                    </Tooltip>
                  </Flex>
                )
              }
            }
          ]}
          dataSource={transactions.confirmed.map((x: any) => transactionFormatTool(x))}
        />
      </>
    )
  }
}

const mapStateToProps = (state: IndexState): StateProps => ({
  consensus: selectConsensus(state),
  transactions: selectOrganizedTx(state)
})

export default connect(mapStateToProps)(TransactionView)
