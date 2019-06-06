import { RenterActions } from 'actions'
import { spawn, take, takeLatest } from 'redux-saga/effects'

import { wrapSpawn } from '../utility'
import {
  createBackupWorker,
  getContractsWorker,
  getRenterWorker,
  restoreBackupWorker,
  setAllowanceWorker
} from './workers'

/**
 * Watchers generally take actions with params and pass them down to a worker.
 * Occasionally, the data needs to be moedified or transformed before it's
 * passed down. It is an infinite loop process.
 */

// takes a destination string and spawns a backup worker to create a backup (1.4.0 only)
function* createBackupWatcher() {
  while (true) {
    const params = yield take(RenterActions.createBackup.started)
    const { destination } = params.payload
    yield spawn(createBackupWorker, {
      destination: destination
    })
  }
}

// takes a source string and attempts to restore from a backup file (1.4.0 only)
function* restoreBackupWatcher() {
  while (true) {
    const params = yield take(RenterActions.restoreBackup.started)
    const { source } = params.payload
    yield spawn(restoreBackupWorker, {
      source
    })
  }
}

// takes an allowance amount and calls the setAllowance worker.
function* setAllowanceWatcher() {
  while (true) {
    const params = yield take(RenterActions.setAllowance.started)
    yield spawn(setAllowanceWorker, {
      ...params.payload
    })
  }
}

export const renterSagas = [
  takeLatest(RenterActions.fetchContracts.started, wrapSpawn(getContractsWorker)),
  createBackupWatcher(),
  restoreBackupWatcher(),
  setAllowanceWatcher()
]

export * from './workers'
