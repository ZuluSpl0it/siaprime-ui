import {
  ConsensusActions,
  GatewayActions,
  GlobalActions,
  HostActions,
  RenterActions
} from 'actions'
import { siad } from 'api/siad'
import BigNumber from 'bignumber.js'
import { ConsensusModel, GatewayModel, HostModel } from 'models'
import { HostReducer } from 'reducers/hosts'
import { SagaIterator, delay } from 'redux-saga'
import {
  all,
  actionChannel,
  call,
  fork,
  race,
  cancel,
  put,
  select,
  spawn,
  take,
  takeLatest
} from 'redux-saga/effects'
import { notification } from 'antd'
import { selectHost } from 'selectors'
import { bindAsyncAction } from 'typescript-fsa-redux-saga'

import { walletSagas } from './wallet'
import { toHastings } from 'sia-typescript'

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

// Host
export const activeHostWorker = bindAsyncAction(HostActions.getActiveHosts, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const response: HostModel.hostdbActiveGET = yield call(siad.call, '/hostdb/active')
  return response
})

export const getStorageWorker = bindAsyncAction(HostActions.getHostStorage, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const response: HostModel.StorageGETResponse = yield call(siad.call, '/host/storage')
  return response
})

export const announceHostWorker = bindAsyncAction(HostActions.announceHost, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const response = yield call(siad.call, {
    url: '/host/announce',
    method: 'POST'
  })
  yield put(HostActions.getHostConfig.started())
  return response
})

export const updateHostConfigWorker = bindAsyncAction(HostActions.updateHostConfig, {
  skipStartedAction: true
})(function*(params): SagaIterator {
  const response = yield call(siad.call, {
    url: '/host',
    method: 'POST',
    qs: { ...params }
  })
  yield put(HostActions.getHostConfig.started())
  return response
})

export const addFolderWorker = bindAsyncAction(HostActions.addFolder, {
  skipStartedAction: true
})(function*(params): SagaIterator {
  const response = yield call(siad.call, {
    url: '/host/storage/folders/add',
    method: 'POST',
    qs: {
      path: params.path,
      size: params.size
    }
  })
  yield put(HostActions.getHostStorage.started())
  return response
})

export const resizeFolderWorker = bindAsyncAction(HostActions.resizeFolder, {
  skipStartedAction: true
})(function*(params): SagaIterator {
  const response = yield call(siad.call, {
    url: '/host/storage/folders/resize',
    method: 'POST',
    qs: {
      path: params.path,
      size: params.newsize
    }
  })
  yield put(HostActions.getHostStorage.started())
  return response
})

export const deleteFolderWorker = bindAsyncAction(HostActions.deleteFolder, {
  skipStartedAction: true
})(function*(params): SagaIterator {
  const response = yield call(siad.call, {
    url: '/host/storage/folders/remove',
    method: 'POST',
    qs: {
      path: params.path
    }
  })
  yield put(HostActions.getHostStorage.started())
  return response
})

function* hostConfigWatcher() {
  while (true) {
    const params = yield take(HostActions.updateHostConfig.started)
    yield spawn(updateHostConfigWorker, params.payload)
  }
}

function* addFolderWatcher() {
  while (true) {
    const params = yield take(HostActions.addFolder.started)
    const host: HostReducer.State = yield select(selectHost)
    if (host.host) {
      const { size, path } = params.payload
      const sectorSize = host.host.externalsettings.sectorsize
      const b = new BigNumber(size)
      let roundedBytes: any = b.minus(b.modulo(64 * sectorSize))
      if (roundedBytes.isNegative()) {
        roundedBytes = '0'
      }
      roundedBytes = roundedBytes.toString()

      yield spawn(addFolderWorker, {
        path,
        size: roundedBytes
      })
    }
  }
}

function* resizeFolderWatcher() {
  while (true) {
    const params = yield take(HostActions.resizeFolder.started)
    const host: HostReducer.State = yield select(selectHost)
    if (host.host) {
      const { newsize, path } = params.payload
      const sectorSize = host.host.externalsettings.sectorsize
      const b = new BigNumber(newsize)
      let roundedBytes: any = b.minus(b.modulo(64 * sectorSize))
      if (roundedBytes.isNegative()) {
        roundedBytes = '0'
      }
      roundedBytes = roundedBytes.toString()

      yield spawn(resizeFolderWorker, {
        path,
        newsize: roundedBytes
      })
    }
  }
}

function* removeFolderWatcher() {
  while (true) {
    const params = yield take(HostActions.deleteFolder.started)
    const { path } = params.payload
    yield spawn(deleteFolderWorker, {
      path
    })
  }
}

export const hostConfigWorker = bindAsyncAction(HostActions.getHostConfig, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const response: HostModel.HostGET = yield call(siad.call, '/host')
  return response
})

// Renter

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

const createBackupWorker = bindAsyncAction(RenterActions.createBackup, {
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

const restoreBackupWorker = bindAsyncAction(RenterActions.restoreBackup, {
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

function* pollSiad() {
  while (true) {
    const running = yield call(siad.isRunning)
    if (running) {
      yield put(GlobalActions.siadLoaded())
    } else {
      yield put(GlobalActions.siadOffline())
      yield put(GlobalActions.stopPolling())
    }
    yield call(delay, 3000)
  }
}

function* siadPoller() {
  while (yield take(GlobalActions.startSiadPolling)) {
    yield put(
      GlobalActions.notification({
        title: 'Started Polling',
        message: 'Sia-UI established a connection with Sia',
        type: 'open'
      })
    )
    const bgPoll = yield fork(pollSiad)
    yield take(GlobalActions.stopSiadPolling)
    yield cancel(bgPoll)
  }
}

// function createWatcher(action, fn) {
//   return function* watcher() {
//     while (true) {
//       yield take(action)
//       yield spawn()
//     }

//   }
// }

const wrapSpawn = fn => {
  return function* g() {
    yield spawn(fn)
  }
}

function* notificationQueue() {
  const notifyChan = yield actionChannel(GlobalActions.notification)
  while (true) {
    const { payload } = yield take(notifyChan)
    notification[payload.type]({
      message: payload.title,
      description: payload.message
    })
    yield call(delay, 3000)
  }
}

const spawnAnnounceHostWorker = wrapSpawn(announceHostWorker)

// Root Saga
export default function* rootSaga() {
  yield all([
    takeLatest(GatewayActions.fetchGateway.started, wrapSpawn(gatewayWorker)),
    takeLatest(ConsensusActions.fetchConsensus.started, wrapSpawn(consensusWorker)),
    takeLatest(RenterActions.fetchContracts.started, wrapSpawn(getContractsWorker)),
    takeLatest(HostActions.getHostStorage.started, wrapSpawn(getStorageWorker)),
    takeLatest(HostActions.getHostConfig.started, wrapSpawn(hostConfigWorker)),
    takeLatest(HostActions.announceHost.started, wrapSpawn(announceHostWorker)),
    siadPoller(),
    hostConfigWatcher(),
    addFolderWatcher(),
    resizeFolderWatcher(),
    removeFolderWatcher(),
    createBackupWatcher(),
    restoreBackupWatcher(),
    setAllowanceWatcher(),
    notificationQueue(),
    ...walletSagas
  ])
}
