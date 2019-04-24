import { GlobalActions, TpoolActions, WalletActions } from 'actions'
import { siad } from 'api/siad'
import { WalletModel } from 'models'
import { SagaIterator } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import { toHastings } from 'sia-typescript'
import { bindAsyncAction } from 'typescript-fsa-redux-saga'
import { selectConsensus } from 'selectors'

export const getWalletWorker = bindAsyncAction(WalletActions.getWallet)(function*(): SagaIterator {
  const response = yield call(siad.call, '/wallet')
  return response
})

export const getTransactionsWorker = bindAsyncAction(WalletActions.getTransactions)(function*(
  params
): SagaIterator {
  let startHeight = 0
  if (params.sinceHeight) {
    startHeight = params.sinceHeight
  }
  const consensus = yield select(selectConsensus)
  // if consensus hasn't synced to the since height, return an empty transaction
  // object.
  if (consensus.height < startHeight) {
    return {
      confirmedtransactions: [],
      unconfirmedtransactions: []
    }
  }
  const response = yield call(
    siad.call,
    `/wallet/transactions?startheight=${startHeight}&endheight=-1`
  )
  response.confirmedtransactions = response.confirmedtransactions
    ? response.confirmedtransactions
    : []
  response.unconfirmedtransactions = response.unconfirmedtransactions
    ? response.unconfirmedtransactions
    : []
  response.sinceHeight =
    response.confirmedtransactions.length > 0
      ? response.confirmedtransactions[response.confirmedtransactions.length - 1].confirmationheight
      : 0
  return response
})

export const broadcastSiacoinWorker = bindAsyncAction(WalletActions.createSiacoinTransaction, {
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

export const broadcastSiafundWorker = bindAsyncAction(WalletActions.createSiafundTransaction, {
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

export const lockWalletWorker = bindAsyncAction(WalletActions.lockWallet, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const response = yield call(siad.call, {
    url: '/wallet/lock',
    method: 'POST'
  })
  yield put(WalletActions.requestInitialData())
  return response
})

export const unlockWalletWorker = bindAsyncAction(WalletActions.unlockWallet, {
  skipStartedAction: true
})(function*(params): SagaIterator {
  const response = yield call(siad.call, {
    url: '/wallet/unlock',
    method: 'POST',
    qs: {
      encryptionpassword: params.encryptionpassword
    }
  })
  yield put(WalletActions.requestInitialData())
  return response
})

export const receiveAddressWorker = bindAsyncAction(WalletActions.getReceiveAddresses, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const response = yield call(siad.call, '/wallet/addresses')
  return response
})

//  The /wallet/transaction/:id does not work for unconfirmed transactions, so
//  instead we will fetch all the wallet transactions and filter the specific ID
//  from there.
export const txFromIdWorker = bindAsyncAction(WalletActions.getTxFromId)(function*(
  params
): SagaIterator {
  const response: WalletModel.TransactionsGETResponse = yield call(
    siad.call,
    `/wallet/transactions?startheight=0&endheight=-1`
  )
  const tx = response.unconfirmedtransactions.filter(t => t.transactionid === params)
  return tx.length === 1 ? tx[0] : []
})

export const getTpoolFees = bindAsyncAction(TpoolActions.getFee)(function*(): SagaIterator {
  const response = yield call(siad.call, '/tpool/fee')
  return response
})

export const createWallet = bindAsyncAction(WalletActions.createNewWallet, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const response: WalletModel.InitPOSTResponse = yield call(siad.call, {
    url: '/wallet/init',
    method: 'POST'
  })
  return response
})

export const changePassword = bindAsyncAction(WalletActions.changePassword, {
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

export const initFromSeedWorker = bindAsyncAction(WalletActions.initFromSeed, {
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

export const getSeeds = bindAsyncAction(WalletActions.getWalletSeeds, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const response = yield call(siad.call, '/wallet/seeds')
  return response
})

export const createReceiveAddress = bindAsyncAction(WalletActions.generateReceiveAddress, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const response = yield call(siad.call, '/wallet/address')
  return response
})
