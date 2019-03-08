import { RenterActions } from 'actions'
import { Card, Collapse, Dropdown, Menu, Icon, Button } from 'antd'
import { Box, CardHeader, ElectronLink, Text } from 'components/atoms'
import { Stat } from 'components/Card'
import FileManager from 'components/FileManager'
import * as React from 'react'
import { connect, DispatchProp } from 'react-redux'
import { RouteComponentProps, Switch, withRouter } from 'react-router'
import { Link, Route } from 'react-router-dom'
import { IndexState } from 'reducers'
import {
  ContractSums,
  selectContractDetails,
  selectSpending,
  SpendingTotals,
  selectPricing,
  selectRenterSummary
} from 'selectors'
import { AllowanceModal } from 'components/Modal'
import { Flex } from 'components/atoms/Flex'
import { RenterModel } from 'models'

const { Panel } = Collapse

const Metrics = () => (
  <Collapse bordered={false} style={{ backgroundColor: '#fdfdfd' }} defaultActiveKey={['1']}>
    <Panel header="Developer Guides" key="1" style={{ borderBottom: 0 }}>
      <Flex>
        <Flex width={1 / 2} mx={2}>
          <Card
            title="Building on the Sia Platform"
            style={{ alignSelf: 'stretch' }}
            extra={
              <ElectronLink
                href="https://gitlab.com/NebulousLabs/Sia/blob/master/doc/API.md"
                target="_blank"
              >
                Docs
              </ElectronLink>
            }
          >
            <Text fontWeight={300} lineHeight="title">
              Learn about how decentralized storage works on Sia. Leverage your understanding of
              smart-contracts and blockchains to upload your first file through Sia.
            </Text>
          </Card>
        </Flex>
        <Flex width={1 / 2} mx={2}>
          <Card
            title="Decentralized Youtube on Sia"
            style={{ alignSelf: 'stretch' }}
            extra={<a href="#">Learn</a>}
          >
            <Text fontWeight={300} lineHeight="title">
              Already a seasoned developer? Get your hands dirty and build a decentralized YouTube
              clone using the Sia platform to serve video content!
            </Text>
          </Card>
        </Flex>
      </Flex>
    </Panel>
    <Panel header="File Metrics (Fake Data)" key="2" style={{ borderBottom: 0 }}>
      <Flex>
        <Flex width={1 / 2} mx={2}>
          <Card
            title="Building on the Sia Platform"
            style={{ alignSelf: 'stretch' }}
            extra={<a href="#">Docs</a>}
          >
            <Text fontWeight={300} lineHeight="title">
              Learn about how decentralized storage works on Sia. Leverage your understanding of
              smart-contracts and blockchains to build a cloud Plex-drive.
            </Text>
          </Card>
        </Flex>
        <Box width={1 / 2}>
          <Flex flexDirection="column">
            <Flex mb={2}>
              <Stat content="82GB" title="Storage Used" width={1 / 2} />
              <Stat content="~2 week" title="Contract Renewal" width={1 / 2} />
            </Flex>
            <Flex>
              <Stat content="50" title="Active Contracts" width={1 / 2} />
              <Stat content="150 SC" title="Locked in Contracts" width={1 / 2} />
            </Flex>
            {/* <Box mx={2}>
                        <Text>hi</Text>
                      </Box> */}
          </Flex>
        </Box>
      </Flex>
    </Panel>
    <Panel header="UL/DL Metrics (Fake Data)" key="3" style={{ borderBottom: 0 }}>
      <Flex>
        <Flex width={1 / 2} mx={2}>
          <Card
            title="Building on the Sia Platform"
            style={{ alignSelf: 'stretch' }}
            extra={<a href="#">Docs</a>}
          >
            <Text fontWeight={300} lineHeight="title">
              Learn about how decentralized storage works on Sia. Leverage your understanding of
              smart-contracts and blockchains to build a cloud Plex-drive.
            </Text>
          </Card>
        </Flex>
        <Box width={1 / 2}>
          <Flex flexDirection="column">
            <Flex mb={2}>
              <Stat content="82GB" title="Storage Used" width={1 / 2} />
              <Stat content="~2 week" title="Contract Renewal" width={1 / 2} />
            </Flex>
            <Flex>
              <Stat content="50" title="Active Contracts" width={1 / 2} />
              <Stat content="150 SC" title="Locked in Contracts" width={1 / 2} />
            </Flex>
            {/* <Box mx={2}>
                        <Text>hi</Text>
                      </Box> */}
          </Flex>
        </Box>
      </Flex>
    </Panel>
  </Collapse>
)

const FM = () => (
  <div>
    <FileManager />
  </div>
)

const PaddedMenuItemLink = ({ children, ...props }: any) => (
  <Box maxWidth={3} mx={1} pb={4}>
    <Link {...props}>{children}</Link>
  </Box>
)

interface StateProps {
  contracts: ContractSums
  spending: SpendingTotals
  pricing: RenterModel.PricesGETResponse
  renterSummary: RenterModel.RenterGETResponse
}

interface State {
  allowanceModalVisible: boolean
}

type RenterProps = RouteComponentProps & DispatchProp & StateProps
class Renter extends React.Component<RenterProps, State> {
  state = {
    allowanceModalVisible: false
  }
  componentDidMount() {
    this.props.dispatch(RenterActions.fetchContracts.started())
  }
  openModal = () => {
    this.setState({
      allowanceModalVisible: true
    })
  }

  closeModal = () => {
    this.setState({
      allowanceModalVisible: false
    })
  }
  render() {
    const { match }: { match: any } = this.props
    const { contracts, spending, pricing, renterSummary } = this.props
    return (
      <Box>
        <AllowanceModal
          pricing={pricing}
          visible={this.state.allowanceModalVisible}
          openModal={this.openModal}
          closeModal={this.closeModal}
          renterSummary={renterSummary}
        />
        <Flex justifyContent="space-between" alignItems="baseline">
          <CardHeader>File Manager</CardHeader>
          {contracts.active > 0 && (
            <Box ml="auto">
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item onClick={this.openModal} key="1">
                      <a>Modify Allowance</a>
                    </Menu.Item>
                    {/* <Menu.Item key="0">
                      <a>Backup Files</a>
                    </Menu.Item>
                    <Menu.Item key="1">
                      <a>Restore Files</a>
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
          )}
        </Flex>
        <Flex>
          <Stat content={`${contracts.active}`} title="Contracts Active" width={1 / 4} />
          <Stat content={`${spending.storagespending} SC`} title="Storage Spending" width={1 / 4} />
          <Stat
            content={`${spending.downloadspending} SC`}
            title="Download Spending"
            width={1 / 4}
          />
          <Stat content={`${spending.uploadspending} SC`} title="Upload Spending" width={1 / 4} />
        </Flex>
        {contracts.active > 0 ? (
          <Box mx={2} pt={3}>
            <Switch>
              <Route exact path={`${match.path}/metrics`} component={Metrics} />
              <Route
                exact
                path={`${match.path}/settings`}
                component={() => <Text>Coming soon</Text>}
              />
              <Route exact path={`${match.path}`} component={FM} />
            </Switch>
          </Box>
        ) : (
          <Flex justifyContent="center" alignItems="center">
            <Flex
              p={4}
              height="400px"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <Box my={3}>
                <Text color="mid-gray" fontSize={3}>
                  It looks like you don't have any contracts yet.
                </Text>
              </Box>
              <Button onClick={this.openModal} type="ghost" size="large">
                Setup Allowance
              </Button>
            </Flex>
          </Flex>
        )}
      </Box>
    )
  }
}

export const mapStateToProps = (state: IndexState) => ({
  contracts: selectContractDetails(state),
  spending: selectSpending(state),
  pricing: selectPricing(state),
  renterSummary: selectRenterSummary(state)
})

export default connect(mapStateToProps)(withRouter(Renter))

{
  /* <Flex>
            <PaddedMenuItemLink to={`${match.path}`}>
              <MenuIconButton iconType="file" title="Sia Explorer" pathname="/renter" />
            </PaddedMenuItemLink>
            <PaddedMenuItemLink to={`${match.path}/metrics`}>
              <MenuIconButton iconType="project" title="Usage Metrics" pathname="/renter/metrics" />
            </PaddedMenuItemLink>
            <PaddedMenuItemLink to={`${match.path}/settings`}>
              <MenuIconButton iconType="tool" title="Renter Settings" pathname="/renter/settings" />
            </PaddedMenuItemLink>
          </Flex> */
}
