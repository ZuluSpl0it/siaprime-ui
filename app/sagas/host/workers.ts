import { HostActions } from 'actions'
import { siad } from 'api/siad'
import { HostModel } from 'models'
import { SagaIterator } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { bindAsyncAction } from 'typescript-fsa-redux-saga'

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

export const hostConfigWorker = bindAsyncAction(HostActions.getHostConfig, {
  skipStartedAction: true
})(function*(): SagaIterator {
  const response: HostModel.HostGET = yield call(siad.call, '/host')
  return response
})
