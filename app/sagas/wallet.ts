import { GlobalActions, TpoolActions, WalletActions } from 'actions'
import { siad } from 'api/siad'
import { WalletModel } from 'models'
import { delay, SagaIterator } from 'redux-saga'
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
  takeLatest
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
import { toHastings } from 'sia-typescript'
import { bindAsyncAction } from 'typescript-fsa-redux-saga'

const getWalletWorker = bindAsyncAction(WalletActions.getWallet)(function*(): SagaIterator {
  const response = yield call(siad.call, '/wallet')
  return response
})

const getTransactionsWorker = bindAsyncAction(WalletActions.getTransactions)(function*(
  params
): SagaIterator {
  let startHeight = 0
  if (params.sinceHeight) {
    startHeight = params.sinceHeight
  }
  const response = yield call(
    siad.call,
    `/wallet/transactions?startheight=${startHeight}&endheight=-1`
  )
  response.confirmedtransactions = response.confirmedtransactions
    ? // ? response.confirmedtransactions.slice(-params.count)
      response.confirmedtransactions
    : []
  response.unconfirmedtransactions = response.unconfirmedtransactions
    ? // ? response.unconfirmedtransactions.slice(-params.count)
      response.unconfirmedtransactions
    : []
  response.sinceHeight =
    response.confirmedtransactions.length > 0
      ? response.confirmedtransactions[response.confirmedtransactions.length - 1].confirmationheight
      : 0
  return response
})
const broadcastSiacoinWorker = bindAsyncAction(WalletActions.createSiacoinTransaction, {
  skipStartedAction: true
})(function*(params): SagaIterator {
  const response = yield call(siad.call, {
    url: '/wallet/siacoins',
    method: 'POST',
    qs: {
      destination: params.destination,
      amount: toHastings(params.amount).toString()
    }
  })
  return response
})

const broadcastSiafundWorker = bindAsyncAction(WalletActions.createSiafundTransaction, {
  skipStartedAction: true
})(function*(params): SagaIterator {
  const response = yield call(siad.call, {
    url: '/wallet/siafunds',
    method: 'POST',
    qs: {
      destination: params.destination,
      amount: params.amount.toString()
    }
  })
  return response
})

const lockWalletWorker = bindAsyncAction(WalletActions.lockWallet, { skipStartedAction: true })(
  function*(): SagaIterator {
    const response = yield call(siad.call, {
      url: '/wallet/lock',
      method: 'POST'
    })
    yield put(WalletActions.requestInitialData())
    return response
  }
)

const unlockWalletWorker = bindAsyncAction(WalletActions.unlockWallet, { skipStartedAction: true })(
  function*(params): SagaIterator {
    const response = yield call(siad.call, {
      url: '/wallet/unlock',
      method: 'POST',
      qs: {
        encryptionpassword: params.encryptionpassword
      }
    })
    yield put(WalletActions.requestInitialData())
    return response
  }
)

const receiveAddressWorker = bindAsyncAction(WalletActions.getReceiveAddresses, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const response = yield call(siad.call, '/wallet/addresses')
  return response
})

//  The /wallet/transaction/:id does not work for unconfirmed transactions, so
//  instead we will fetch all the wallet transactions and filter the specific ID
//  from there.
const txFromIdWorker = bindAsyncAction(WalletActions.getTxFromId)(function*(params): SagaIterator {
  const response: WalletModel.TransactionsGETResponse = yield call(
    siad.call,
    `/wallet/transactions?startheight=0&endheight=-1`
  )
  const tx = response.unconfirmedtransactions.filter(t => t.transactionid === params)
  return tx.length === 1 ? tx[0] : []
})

const getFees = bindAsyncAction(TpoolActions.getFee)(function*(): SagaIterator {
  const response = yield call(siad.call, '/tpool/fee')
  return response
})

const createWallet = bindAsyncAction(WalletActions.createNewWallet, {
  skipStartedAction: true
})(function*(params): SagaIterator {
  const response: WalletModel.InitPOSTResponse = yield call(siad.call, {
    url: '/wallet/init',
    method: 'POST'
  })
  return response
})

const changePassword = bindAsyncAction(WalletActions.changePassword, {
  skipStartedAction: true
})(function*(params): SagaIterator {
  const { encryptionpassword, newpassword } = params
  try {
    const response = yield call(siad.call, {
      url: '/wallet/changepassword',
      method: 'POST',
      qs: {
        encryptionpassword,
        newpassword
      }
    })
    yield put(
      GlobalActions.notification({
        title: 'Change Password',
        message: 'Successfully changed password',
        type: 'open'
      })
    )
    return response
  } catch (e) {
    yield put(
      GlobalActions.notification({
        title: 'Change Password Failed',
        message: e.error ? e.error.message : 'Unknown error occurred',
        type: 'open'
      })
    )
  }
})

const initFromSeedWorker = bindAsyncAction(WalletActions.initFromSeed, {
  skipStartedAction: true
})(function*(params): SagaIterator {
  const response = yield call(siad.call, {
    url: '/wallet/init/seed',
    method: 'POST',
    qs: {
      seed: params.primaryseed
    },
    timeout: 864e5
  })
  return response
})

const getSeeds = bindAsyncAction(WalletActions.getWalletSeeds, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const response = yield call(siad.call, '/wallet/seeds')
  return response
})

const createReceiveAddress = bindAsyncAction(WalletActions.generateReceiveAddress, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const response = yield call(siad.call, '/wallet/address')
  return response
})

function* initialDataCalls() {
  yield spawn(getWalletWorker)
  yield spawn(consensusWorker)
  const sinceHeight = yield select(selectTransactionHeight)
  yield spawn(getTransactionsWorker, { count: 100, sinceHeight })
  yield spawn(getFees)
  yield spawn(receiveAddressWorker)
  // move to global
  yield spawn(gatewayWorker)
  yield spawn(activeHostWorker)
  yield spawn(getFeeWorker)
  yield spawn(getRenterWorker)
}

function* pollCalls() {
  yield spawn(getWalletWorker)
  yield spawn(consensusWorker)
  yield spawn(getFeeWorker)
  const sinceHeight = yield select(selectTransactionHeight)
  yield spawn(getTransactionsWorker, { count: 100, sinceHeight })
  yield spawn(getFees)
  yield spawn(getContractsWorker)
  yield spawn(gatewayWorker)
  yield spawn(activeHostWorker)
}

function* initializeWalletWatcher() {
  yield takeLatest(WalletActions.requestInitialData.type, initialDataCalls)
}

function* pollTask() {
  yield put(WalletActions.requestInitialData())
  while (true) {
    yield call(pollCalls)
    yield call(delay, 3000)
  }
}

function* startPolling() {
  const bgSync = yield fork(pollTask)
  yield take(GlobalActions.stopPolling)
  yield cancel(bgSync)
}

function* broadcastSiacoinWatcher() {
  while (true) {
    const params = yield take(WalletActions.createSiacoinTransaction.started.type)
    yield spawn(broadcastSiacoinWorker, params.payload)
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
      console.log('error', err)
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
  initializeWalletWatcher(),
  unlockWalletWatcher(),
  createWalletWatcher(),
  getSeedWatcher(),
  initFromSeedWatcher(),
  takeLatest(GlobalActions.startPolling, startPolling),
  takeLatest(WalletActions.lockWallet.started, lockWalletWorker),
  takeLatest(WalletActions.getReceiveAddresses.started, receiveAddressWorker),
  takeLatest(WalletActions.generateReceiveAddress.started, createReceiveAddress)
]
