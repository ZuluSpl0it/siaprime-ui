import { GlobalActions, TpoolActions, WalletActions, RenterActions, HostActions } from 'actions'
import {
  actionChannel,
  all,
  call,
  cancel,
  fork,
  put,
  select,
  spawn,
  take,
  takeLatest,
  delay
} from 'redux-saga/effects'
import {
  activeHostWorker,
  consensusWorker,
  gatewayWorker,
  getContractsWorker,
  getFeeWorker,
  getRenterWorker
} from 'sagas'
import { selectTransactionHeight } from 'selectors'
import { getWalletWorker, getTransactionsWorker, getTpoolFees } from './wallet'

/* Poll Calls
  Calls define the actual workers that are spawned in each poll iteration
  loop. It can also describe sideeffect actions that aren't necessarily api
  calls, but note that those side effects will be called every loop as well.
*/

function* globalPollCalls() {
  yield call(consensusWorker)
  yield spawn(gatewayWorker)
  yield spawn(activeHostWorker)
}

function* walletPollCalls() {
  const sinceHeight = yield select(selectTransactionHeight)
  yield spawn(getWalletWorker)
  yield spawn(getTransactionsWorker, { count: 100, sinceHeight })
  yield spawn(getTpoolFees)
}

function* renterPollCalls() {
  yield spawn(getContractsWorker)
  yield spawn(getFeeWorker)
}

/* Poll Tasks
  Tasks define the side-effects (such as a delays) of the poll, and puts the
  poll into a loop. This is generally forked from the main saga thread.
 */

function* globalPollTask() {
  yield put(WalletActions.requestInitialData())
  while (true) {
    yield globalPollCalls()
    yield delay(5000)
  }
}

function* walletPollTask() {
  while (true) {
    yield call(walletPollCalls)
    yield delay(5000)
  }
}

function* renterPollTask() {
  while (true) {
    yield call(renterPollCalls)
    yield delay(5000)
  }
}

function* hostPollTask() {
  while (true) {
    yield put(HostActions.getHostConfig.started())
    yield delay(5000)
  }
}

/* Poll Watchers
  Watchers watch for an incoming start poll action and will spin off a task
  in another thread. It will then pause and wait for a stop poll action before
  cancelling the poller.
 */

function* startGlobalPolling() {
  while (true) {
    yield take(GlobalActions.startPolling)
    const bgSync = yield fork(globalPollTask)
    yield take(GlobalActions.stopPolling)
    yield cancel(bgSync)
  }
}

function* startWalletPolling() {
  while (true) {
    yield take(WalletActions.startPolling)
    const bgSync = yield fork(walletPollTask)
    yield take(WalletActions.stopPolling)
    yield cancel(bgSync)
  }
}

function* startRenterPolling() {
  while (true) {
    yield take(RenterActions.startPolling)
    const bgSync = yield fork(renterPollTask)
    yield take(RenterActions.stopPolling)
    yield cancel(bgSync)
  }
}

function* startHostPolling() {
  while (true) {
    yield take(HostActions.startPolling)
    const bgSync = yield fork(hostPollTask)
    yield take(HostActions.stopPolling)
    yield cancel(bgSync)
  }
}

export const pollingSagas = [
  startGlobalPolling(),
  startRenterPolling(),
  startWalletPolling(),
  startHostPolling()
]
