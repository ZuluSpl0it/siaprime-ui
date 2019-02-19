import { WalletActions } from 'actions'
import { Button, Dropdown, Icon, Menu, Tabs, Tag } from 'antd'
import { Box, Card, CardHeader, StyledTag, Text } from 'components/atoms'
import { Stat } from 'components/Card'
import { BackupModel } from 'components/Modal'
import { RequireWalletData } from 'components/RequireData'
import { clipboard } from 'electron'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { Flex } from 'rebass'
import { createStructuredSelector } from 'reselect'
import {
  selectCurrAddress,
  selectFeeEstimate,
  selectGroupedTx,
  selectReceiveAddresses,
  selectWalletBalanceDetails,
  StructuredTransaction
} from 'selectors'

import Send from './Send'
import TransactionView from './TransactionView'

const TabPane = Tabs.TabPane
const TabPanelWrap = ({ children }: any) => <Box height="460px">{children}</Box>

const ReceiveAddressCard = ({ address }: any) => {
  const copy = (value: string) => () => {
    clipboard.writeText(value)
  }
  return (
    <Card my={2}>
      <Flex>
        <Text color="mid-gray">{address}</Text>
        <Box ml="auto">
          <Tag>
            <Icon onClick={copy(address)} type="copy" />
          </Tag>
        </Box>
      </Flex>
    </Card>
  )
}

interface WalletDetails {
  confirmedBalance: string
  unconfirmedBalance: string
  siafundBalance: string
}

export interface TransactionGroup {
  confirmed: StructuredTransaction[]
  unconfirmed: StructuredTransaction[]
}

interface StateProps {
  balances: WalletDetails
  transactions: any
  feeEstimate: string
  receiveAddresses: string[]
  currAddress: string
  // usdPrice: number
}

type WalletProps = StateProps & DispatchProp

class Wallet extends React.Component<WalletProps, {}> {
  state = {
    backupModal: false
  }
  handleBackupModal = () => {
    this.props.dispatch(WalletActions.clearSeed())
    this.setState({
      backupModal: false
    })
  }
  openBackupModal = () => {
    this.setState({
      backupModal: true
    })
  }
  generateAddress = () => {
    this.props.dispatch(WalletActions.generateReceiveAddress.started())
  }
  copy = (value: string) => () => {
    clipboard.writeText(value)
  }
  render() {
    const { confirmedBalance, unconfirmedBalance, siafundBalance } = this.props.balances
    const { transactions, feeEstimate, receiveAddresses, currAddress } = this.props
    // const usdBalance = new BigNumber(confirmedBalance)
    //   .multipliedBy(usdPrice)
    //   .toFixed(2)
    //   .toString()
    const balanceWithSeperator = parseFloat(confirmedBalance).toLocaleString('en-US')
    return (
      <div>
        <BackupModel visible={this.state.backupModal} onOk={this.handleBackupModal} />
        <RequireWalletData>
          <Box>
            <Flex justifyContent="space-between" alignItems="baseline">
              <CardHeader>Balance</CardHeader>
              <Box ml="auto">
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item key="0">
                        <a onClick={this.openBackupModal}>View Seed</a>
                      </Menu.Item>
                      {/* <Menu.Divider />
                      <Menu.Item key="1">
                        <a href="#">Sweep Seed</a>
                      </Menu.Item> */}
                    </Menu>
                  }
                  trigger={['click']}
                >
                  <Text color="silver" css={{ cursor: 'pointer', textTransform: 'uppercase' }}>
                    More <Icon type="down" />
                  </Text>
                </Dropdown>
              </Box>
            </Flex>
            {/* <Box mx={2}>
              <Text color="dark-gray" fontSize={4} fontWeight={4}>
                {balanceWithSeperator}
              </Text>
              <Text color="mid-gray" fontSize={2} fontWeight={4}>
                {' '}
                siacoins
              </Text>
            </Box> */}
            <Flex>
              <Stat content={balanceWithSeperator} title="siacoin" width={1 / 3} />
            </Flex>
            <Box height="25px">
              <Flex mx={2} pt={2} pb={3}>
                {/* <Tag>${usdBalance} USD</Tag> */}
                {!!parseFloat(siafundBalance) && <Tag>{siafundBalance} SC</Tag>}
                {!!parseFloat(unconfirmedBalance) && (
                  <StyledTag>{unconfirmedBalance} SC (Unconfirmed)</StyledTag>
                )}
              </Flex>
            </Box>
          </Box>
          <Box mt={2} mx={2}>
            <Tabs tabBarStyle={{ margin: 0 }} defaultActiveKey="1">
              <TabPane
                tab={
                  <Text color="mid-gray" fontSize={2}>
                    Transactions
                  </Text>
                }
                key="1"
              >
                <TabPanelWrap>
                  <TransactionView />
                </TabPanelWrap>
              </TabPane>
              <TabPane
                tab={
                  <Text color="mid-gray" fontSize={2}>
                    Send
                  </Text>
                }
                key="2"
              >
                <TabPanelWrap>
                  <Send fee={feeEstimate} />
                </TabPanelWrap>
              </TabPane>
              <TabPane
                tab={
                  <Text color="mid-gray" fontSize={2}>
                    Receive
                  </Text>
                }
                key="3"
              >
                <TabPanelWrap>
                  <Box py={3} display="flex" justifyContent="space-between" alignItems="center">
                    <Text color="silver" fontSize={1} css={{ textTransform: 'uppercase' }}>
                      Latest Generated Address
                    </Text>
                    <Button type="default" onClick={this.generateAddress}>
                      Generate new address
                    </Button>
                  </Box>
                  <Box my={2}>
                    <Card>
                      <Flex>
                        {currAddress ? (
                          <>
                            <Text>{currAddress}</Text>
                            <Box ml="auto">
                              <Tag onClick={this.copy(currAddress)}>
                                <Icon type="copy" />
                              </Tag>
                            </Box>
                          </>
                        ) : (
                          <Text color="silver">
                            Use any address below, or generate a new one here.
                          </Text>
                        )}
                      </Flex>
                    </Card>
                  </Box>
                  <Box py={3}>
                    <Text color="silver" fontSize={1} css={{ textTransform: 'uppercase' }}>
                      Previously Used Addresses
                    </Text>
                  </Box>
                  <Box>
                    {receiveAddresses.map(a => {
                      return <ReceiveAddressCard key={a} address={a} />
                    })}
                  </Box>
                </TabPanelWrap>
              </TabPane>
            </Tabs>
          </Box>
        </RequireWalletData>
      </div>
    )
  }
}

export default connect(
  createStructuredSelector({
    balances: selectWalletBalanceDetails,
    transactions: selectGroupedTx,
    feeEstimate: selectFeeEstimate,
    receiveAddresses: selectReceiveAddresses,
    currAddress: selectCurrAddress
    // usdPrice: selectPrice
  })
)(Wallet)
