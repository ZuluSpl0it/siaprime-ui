import { GlobalActions, WalletActions } from 'actions'
import { WalletModel } from 'models'
import { actionChannel, all, call, put, select, spawn, take, takeLatest } from 'redux-saga/effects'
import { consensusWorker, gatewayWorker } from 'sagas'
import { activeHostWorker } from 'sagas/host'
import { selectTransactionHeight } from 'selectors'

import { getFeeWorker, getRenterWorker } from '../renter'
import { wrapSpawn } from '../utility'
import {
  broadcastSiacoinWorker,
  broadcastSiafundWorker,
  changePassword,
  createReceiveAddress,
  createWallet,
  getSeeds,
  getTpoolFees,
  getTransactionsWorker,
  getWalletWorker,
  initFromSeedWorker,
  lockWalletWorker,
  receiveAddressWorker,
  txFromIdWorker,
  unlockWalletWorker
} from './workers'

function* initialDataCalls() {
  yield spawn(getWalletWorker)
  yield spawn(consensusWorker)
  const sinceHeight = yield select(selectTransactionHeight)
  yield spawn(getTransactionsWorker, { count: 100, sinceHeight })
  yield spawn(getTpoolFees)
  yield spawn(receiveAddressWorker)
  // move to global
  yield spawn(gatewayWorker)
  yield spawn(activeHostWorker)
  yield spawn(getFeeWorker)
  yield spawn(getRenterWorker)
}

function* initializeWalletWatcher() {
  yield takeLatest(WalletActions.requestInitialData, initialDataCalls)
}

function* broadcastSiacoinWatcher() {
  while (true) {
    const params = yield take(WalletActions.createSiacoinTransaction.started.type)
    yield spawn(broadcastSiacoinWorker, params.payload)
  }
}

function* broadcastSiafundWatcher() {
  while (true) {
    const params = yield take(WalletActions.createSiafundTransaction.started.type)
    yield spawn(broadcastSiafundWorker, params.payload)
  }
}

function* fetchUnconfirmedTxOnBroadcastCompletion() {
  while (true) {
    const response = yield take(WalletActions.createSiacoinTransaction.done.type)
    try {
      const processed: WalletModel.ProcessedTransaction[] = yield all(
        response.payload.result.transactionids.map((txid: string) => call(txFromIdWorker, txid))
      )
      yield put(WalletActions.broadcastedTransactionDetails(processed))
    } catch (err) {
      // TODO error handling
      yield put(
        GlobalActions.notification({
          title: 'Broadcasting Transaction Failed',
          message: err.error ? err.error.message : err,
          type: 'open'
        })
      )
    }
  }
}

function* changePasswordWatcher() {
  while (true) {
    const params = yield take(WalletActions.changePassword.started)
    yield spawn(changePassword, params.payload)
  }
}

function* unlockWalletWatcher() {
  const chan = yield actionChannel(WalletActions.unlockWallet.started)
  while (true) {
    const params = yield take(chan)
    yield spawn(unlockWalletWorker, params.payload)
  }
}

function* createWalletWatcher() {
  while (true) {
    const params = yield take(WalletActions.createNewWallet.started)
    yield spawn(createWallet, params.payload)
  }
}

function* getSeedWatcher() {
  while (true) {
    yield take(WalletActions.getWalletSeeds.started)
    yield spawn(getSeeds)
  }
}

function* initFromSeedWatcher() {
  while (true) {
    const params = yield take(WalletActions.initFromSeed.started)
    yield spawn(initFromSeedWorker, params.payload)
  }
}

export const walletSagas = [
  fetchUnconfirmedTxOnBroadcastCompletion(),
  changePasswordWatcher(),
  broadcastSiacoinWatcher(),
  broadcastSiafundWatcher(),
  initializeWalletWatcher(),
  unlockWalletWatcher(),
  createWalletWatcher(),
  getSeedWatcher(),
  initFromSeedWatcher(),
  takeLatest(WalletActions.lockWallet.started, wrapSpawn(lockWalletWorker)),
  takeLatest(WalletActions.getReceiveAddresses.started, wrapSpawn(receiveAddressWorker)),
  takeLatest(WalletActions.generateReceiveAddress.started, wrapSpawn(createReceiveAddress))
]

export * from './workers'
