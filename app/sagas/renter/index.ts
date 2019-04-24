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

function* createBackupWatcher() {
  while (true) {
    const params = yield take(RenterActions.createBackup.started)
    const { destination } = params.payload
    yield spawn(createBackupWorker, {
      destination: destination
    })
  }
}

function* restoreBackupWatcher() {
  while (true) {
    const params = yield take(RenterActions.restoreBackup.started)
    const { source } = params.payload
    yield spawn(restoreBackupWorker, {
      source
    })
  }
}

function* setAllowanceWatcher() {
  while (true) {
    const params = yield take(RenterActions.setAllowance.started)
    const { allowance } = params.payload
    yield spawn(setAllowanceWorker, {
      allowance
    })
    yield spawn(getRenterWorker)
  }
}

export const renterSagas = [
  takeLatest(RenterActions.fetchContracts.started, wrapSpawn(getContractsWorker)),
  createBackupWatcher(),
  restoreBackupWatcher(),
  setAllowanceWatcher()
]

export * from './workers'
