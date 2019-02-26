import { Button, Card, List } from 'antd'
import { Box, ButtonWithAdornment, Card as AtomCard, CardHeader, Text } from 'components/atoms'
import { Stat } from 'components/Card'
import { ConsensusModel, GatewayModel } from 'models'
import * as React from 'react'
import { connect } from 'react-redux'
import { Flex } from 'rebass'
import { createStructuredSelector } from 'reselect'
import { selectActiveHostCount, selectConsensus, selectGateway } from 'selectors'

// import { RequirePriceData } from 'components/RequireData'
const { shell } = require('electron')

interface StateProps {
  // price: number
  gateway: GatewayModel.GetwayGET
  consensus: ConsensusModel.ConsensusGETResponse
  activeHostCount: number
}

const BetaNotes = [
  'This UI requires you to run a fully-synced siad',
  'Wallet transaction page will show the last 100 txes. Pagination will be supported in later release.',
  'Fake data will be labelled (Fake) and is just a representation of what I would like there',
  'Sending and receiving SC fully works.',
  `Locking the wallet and unlock fully works with some initial state animations to provide user feedback`,
  'Receive generates valid wallet addresses from siad, but is awaiting a feature update to keep track of address index (https://gitlab.com/NebulousLabs/Sia/issues/3261)',
  'Unconfirmed transactions work but I request a new feature so I can write it in a nicer fashion (https://gitlab.com/NebulousLabs/Sia/issues/3257)',
  `File Manager does not yet work. I need to write a connector plugin and it's proving to be trickier than I thought. I left it in so you can see the visual design and give feedback`,
  `Dashboard is fairly empty. I'd love some ideas on what kind of visualizations or info we can put here.`,
  `Hosting has nothing atm.`
]

const Nov18 = [
  'DragRegion is fixed for locked wallet',
  'Latest siad is now packaged into the UI',
  'On bootup if there is another siad running, it will use that process instead. Otherwise, if you wait a few seconds siad will start up automatically.',
  'We are still missing a loading state for siad, so it automatically will show the "siad not running" screen by default',
  'Font should be not properly imported for components',
  'Handle ESOCKETTIMEOUT by showing a scanning screen',
  'Windows controls for Windows and Linux should be there, I modified the browserwindow config but maybe still have styling issues'
]

const Dec07 = [
  'Creation off new seed',
  'Add gateway endpoint to redux store',
  'Save window position on reboot',
  'Add host count to store',
  'Show siad is not ready state',
  'Fix broadcast only once bug',
  'Add thousands seperator to balance'
]

const DevMessage = () => (
  <Box py={4} mx={2}>
    <Card bodyStyle={{ padding: 0 }}>
      <Box>
        <List
          header={<Box px={2}>Dec. 7 2018</Box>}
          dataSource={Dec07}
          renderItem={(item: any) => (
            <List.Item>
              <Box px={2}>
                <Text>{item}</Text>
              </Box>
            </List.Item>
          )}
        />
        <List
          header={<Box px={2}>Nov. 18 2018</Box>}
          dataSource={Nov18}
          renderItem={(item: any) => (
            <List.Item>
              <Box px={2}>
                <Text>{item}</Text>
              </Box>
            </List.Item>
          )}
        />
        <List
          header={<Box px={2}>Nov. 14 2018</Box>}
          dataSource={BetaNotes}
          renderItem={(item: any) => (
            <List.Item>
              <Box px={2}>
                <Text>{item}</Text>
              </Box>
            </List.Item>
          )}
        />
      </Box>
    </Card>
  </Box>
)

class Dashboard extends React.Component<StateProps, {}> {
  openDocs = () => {
    shell.openExternal('https://sia.tech/docs/')
  }
  render() {
    const { consensus, gateway, activeHostCount } = this.props
    const peers = gateway.peers.length
    // const formattedPrice = (price * 100).toFixed(4)
    return (
      <div>
        {/* <RequirePriceData> */}
        <Box>
          <Flex justifyContent="space-between" alignItems="baseline">
            <CardHeader>Overview</CardHeader>
          </Flex>
          <Flex>
            <Stat
              content={consensus.height.toLocaleString('en-US')}
              title="Block Height"
              width={1 / 3}
            />
            <Stat content={peers} title="Connected Peers" width={1 / 3} />
            <Stat content={activeHostCount} title="Active Hosts" width={1 / 3} />
          </Flex>
        </Box>
        {/* <DevMessage /> */}
        <Box m={2} pt={2}>
          <AtomCard>
            <Flex justifyContent="center" alignItems="center">
              <Flex alignItems="center" justifyContent="center" flexDirection="column" py={4}>
                <Flex alignItems="center" justifyContent="center" flexDirection="column" pb={3}>
                  <Text is="div" fontSize="28px">
                    Build on Sia
                  </Text>
                  <Box width={2 / 3} style={{ textAlign: 'center' }}>
                    <Text is="div" fontSize={2} py={2} fontWeight={400}>
                      Safe and inexpensive secondary backup solution. Video streaming. Private,
                      redundant, and fast.
                    </Text>
                  </Box>
                </Flex>
                <Box>
                  <Button.Group>
                    <ButtonWithAdornment onClick={this.openDocs} before iconType="build">
                      Explore the API
                    </ButtonWithAdornment>
                  </Button.Group>
                </Box>
              </Flex>
            </Flex>
          </AtomCard>
        </Box>
        {/* </RequirePriceData> */}
      </div>
    )
  }
}

// const Chart = ({ chartData }: any) => {
//   return (
//     <Box mt={4} mx={2}>
//       <CardHeader>Latest Statistics</CardHeader>
//       <Flex>
//         <Card width={1}>
//           <Box>
//             <Caps fontSize={0}>Storage Pricing</Caps>
//           </Box>
//           <Flex my={2}>
//             <Box mr={2}>
//               <Text fontSize={4}>0.6</Text> <Text color="mid-gray">USD/SC</Text>
//             </Box>
//             <Box mx={2}>
//               <Text fontSize={4}>0.70 </Text>
//               <Text color="mid-gray">USD/TB</Text>
//             </Box>
//             <Box ml="auto">
//               <Text fontSize={4}>+10%</Text> <Text color="mid-gray">Past Week</Text>
//             </Box>
//           </Flex>
//           <RequireChartData>
//             <DashboardLineChart data={chartData} />
//           </RequireChartData>
//         </Card>
//         {/* <Card width={1 / 3}>hi</Card> */}
//       </Flex>
//     </Box>
//   )
// }

const mapStateToProps = createStructuredSelector({
  // price: selectPrice,
  consensus: selectConsensus,
  gateway: selectGateway,
  activeHostCount: selectActiveHostCount
})

export default connect(mapStateToProps)(Dashboard)
