import { ConsensusActions, GatewayActions, GlobalActions } from 'actions'
import { notification } from 'antd'
import { siad } from 'api/siad'
import { ConsensusModel, GatewayModel } from 'models'
import { SagaIterator } from 'redux-saga'
import { actionChannel, all, call, delay, take, takeLatest } from 'redux-saga/effects'
import { bindAsyncAction } from 'typescript-fsa-redux-saga'

import { pollingSagas } from './polling'
import { renterSagas } from './renter'
import { wrapSpawn } from './utility'
import { walletSagas } from './wallet'
import { hostSagas } from './host'

// TODO: Do we want to keep this for coin prices?
// const priceWorker = bindAsyncAction(GlobalActions.fetchPriceStats)(function*(): SagaIterator {
//   const { data } = yield call(coinGecko.get, '/coins/siacoin')
//   return data
// })

// Consensus
export const consensusWorker = bindAsyncAction(ConsensusActions.fetchConsensus, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const response: ConsensusModel.ConsensusGETResponse = yield call(siad.call, '/consensus')
  return response
})

// Gateway
export const gatewayWorker = bindAsyncAction(GatewayActions.fetchGateway, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const response: GatewayModel.GetwayGET = yield call(siad.call, '/gateway')
  return response
})

function* notificationQueue() {
  const notifyChan = yield actionChannel(GlobalActions.notification)
  while (true) {
    const { payload } = yield take(notifyChan)
    notification[payload.type]({
      message: payload.title,
      description: payload.message
    })
    yield delay(3000)
  }
}

// Root Saga
export default function* rootSaga() {
  yield all([
    takeLatest(GatewayActions.fetchGateway.started, wrapSpawn(gatewayWorker)),
    takeLatest(ConsensusActions.fetchConsensus.started, wrapSpawn(consensusWorker)),
    notificationQueue(),
    ...walletSagas,
    ...pollingSagas,
    ...renterSagas,
    ...hostSagas
  ])
}
