import { GlobalActions, RenterActions } from 'actions'
import { siad } from 'api/siad'
import { SagaIterator } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { toHastings } from 'sia-typescript'
import { bindAsyncAction } from 'typescript-fsa-redux-saga'

export const blockMonth = 4320
export const allowanceMonths = 3
export const allowancePeriod = blockMonth * allowanceMonths

export const setAllowanceWorker = bindAsyncAction(RenterActions.setAllowance, {
  skipStartedAction: true
})(function*(params): SagaIterator {
  try {
    const allowance = params.allowance
    const hastings = toHastings(allowance).toString()
    const response = yield call(siad.call, {
      url: '/renter',
      method: 'POST',
      qs: {
        funds: hastings,
        period: allowancePeriod
      }
    })
    yield put(
      GlobalActions.notification({
        title: 'Updated Allowance',
        message: 'Allowance successfully updated',
        type: 'open'
      })
    )
    return response
  } catch (e) {
    yield put(
      GlobalActions.notification({
        title: 'Update Allowance Failed',
        message: e.error ? e.error.message : 'Unknown error occurred',
        type: 'open'
      })
    )
  }
})

export const getFeeWorker = bindAsyncAction(RenterActions.getFeeEstimates, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const response = yield call(siad.call, '/renter/prices')
  return response
})

export const getRenterWorker = bindAsyncAction(RenterActions.getRenterDetails, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const response = yield call(siad.call, '/renter')
  return response
})

export const getContractsWorker = bindAsyncAction(RenterActions.fetchContracts, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const response = yield call(siad.call, '/renter/contracts')
  return response
})

export const createBackupWorker = bindAsyncAction(RenterActions.createBackup, {
  skipStartedAction: true
})(function*(payload): SagaIterator {
  const response = yield call(siad.call, {
    url: '/renter/backup',
    method: 'POST',
    qs: {
      destination: payload.destination
    }
  })
  return response
})

export const restoreBackupWorker = bindAsyncAction(RenterActions.restoreBackup, {
  skipStartedAction: true
})(function*(payload): SagaIterator {
  const response = yield call(siad.call, {
    url: '/renter/recoverbackup',
    method: 'POST',
    qs: {
      source: payload.source
    }
  })
  return response
})
