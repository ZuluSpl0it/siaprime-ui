import { GlobalActions, RenterActions } from 'actions'
import { siad } from 'api/siad'
import { SagaIterator } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { toHastings } from 'sia-typescript'
import { bindAsyncAction } from 'typescript-fsa-redux-saga'

// TODO: take these values from the renter. At the moment these are set to the
// default settings for the renter, taken from the old Sia-UI.
export const blockMonth = 4320
export const allowanceMonths = 3
export const allowancePeriod = blockMonth * allowanceMonths

// Worker that posts to the /renter endpoint to set the allowance. At completion
// it will spawn a notification.
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

// Calls the /renter/prices endpoint to get contract fees for storage
// estimation.
export const getFeeWorker = bindAsyncAction(RenterActions.getFeeEstimates, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const response = yield call(siad.call, '/renter/prices')
  return response
})

// Calls the /renter endpoint to get the renter summary object.
export const getRenterWorker = bindAsyncAction(RenterActions.getRenterDetails, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const response = yield call(siad.call, '/renter')
  return response
})

// Calls the /renter/contracts endpoint to get contract details.
export const getContractsWorker = bindAsyncAction(RenterActions.fetchContracts, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const response = yield call(siad.call, '/renter/contracts')
  return response
})

// Given the destination param, worker posts to /renter/backup to create a
// backup file.
export const createBackupWorker = bindAsyncAction(RenterActions.createBackup, {
  skipStartedAction: true
})(function*(payload): SagaIterator {
  const response = yield call(siad.call, {
    url: '/renter/backup',
    method: 'POST',
    qs: {
      destination: payload.destination,
      remote: true
    }
  })
  return response
})

// Given a source param, worker posts to the /renter/recoverbackup to attempt
// file recovery.
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

export const listBackupWorker = bindAsyncAction(RenterActions.listBackups, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const response = yield call(siad.call, '/renter/uploadedbackups')
  return response
})
