import actionCreatorFactory from 'typescript-fsa'
import { DashboardModel, WalletModel, APIModel, GatewayModel, HostModel, RenterModel } from 'models'
import { TpoolModel, ConsensusModel } from 'models'
const globalActionCreator = actionCreatorFactory('global')

export namespace GlobalActions {
  export const requestPriceStats = globalActionCreator<void>('PRICE_FETCH')
  export const fetchPriceStats = globalActionCreator.async<void, APIModel.CoinGeckoPrice, string>(
    'FETCH_PRICE_STATS'
  )
  export const startPolling = globalActionCreator<void>('START_POLL')
  export const stopPolling = globalActionCreator<void>('STOP_POLL')

  export const startSiadPolling = globalActionCreator<void>('START_SIAD_POLL')
  export const stopSiadPolling = globalActionCreator<void>('STOP_SIAD_POLL')

  export const siadLoading = globalActionCreator<void>('SIAD_LOADING')
  export const siadLoaded = globalActionCreator<void>('SIAD_LOADED')
  export const siadOffline = globalActionCreator<void>('SIAD_OFFLINE')
  export const setSiadOrigin = globalActionCreator<{ isInternal: boolean }>('SET_SIAD_ORIGIN')
}

const tpoolActionCreator = actionCreatorFactory('tpool')

export namespace TpoolActions {
  export const getFee = tpoolActionCreator.async<void, TpoolModel.FeeGETResponse, APIModel.Error>(
    'GET_FEE'
  )
}

const gatewayActionCreator = actionCreatorFactory('gateway')

export namespace GatewayActions {
  export const fetchGateway = gatewayActionCreator.async<
    void,
    GatewayModel.GetwayGET,
    APIModel.Error
  >('GET_GATEWAY')
}

const hostActionCreator = actionCreatorFactory('host')

export namespace HostActions {
  export const getActiveHosts = hostActionCreator.async<
    void,
    HostModel.hostdbActiveGET,
    APIModel.Error
  >('FETCH_ACTIVE_HOSTS')

  export const getHostConfig = hostActionCreator.async<void, HostModel.HostGET, APIModel.Error>(
    'FETCH_HOST_SETTINGS'
  )

  export const updateHostConfig = hostActionCreator.async<HostModel.HostPOST, void, APIModel.Error>(
    'CHANGE_HOST_SETTINGS'
  )

  export const announceHost = hostActionCreator.async<void, void, APIModel.Error>('ANNOUNCE_HOST')

  export const getHostContracts = hostActionCreator.async<
    void,
    HostModel.ContractsGETResponse,
    APIModel.Error
  >('GET_HOST_CONTRACTS')

  export const getHostStorage = hostActionCreator.async<
    void,
    HostModel.StorageGETResponse,
    APIModel.Error
  >('HOST_STORAGE_RESP')

  export const addFolder = hostActionCreator.async<HostModel.StorageAddPOST, void, APIModel.Error>(
    'HOST_ADD_FOLDER'
  )

  export const deleteFolder = hostActionCreator.async<
    HostModel.StorageRemovePOST,
    void,
    APIModel.Error
  >('HOST_REMOVE_FOLDER')

  export const resizeFolder = hostActionCreator.async<
    HostModel.StorageResizePOST,
    void,
    APIModel.Error
  >('RESIZE_FOLDER')

  export const getScore = hostActionCreator.async<void, HostModel.ScoreResponse, APIModel.Error>(
    'GET_SCORE'
  )
}

const consensusActionCreator = actionCreatorFactory('consensus')

export namespace ConsensusActions {
  export const fetchConsensus = consensusActionCreator.async<
    void,
    ConsensusModel.ConsensusGETResponse,
    APIModel.Error
  >('GET_CONSENSUS')
}

const renterActionCreator = actionCreatorFactory('renter')

export namespace RenterActions {
  export const fetchContracts = renterActionCreator.async<
    void,
    RenterModel.ContractsGETResponse,
    APIModel.Error
  >('FETCH_CONTRACTS')

  export const setAllowance = renterActionCreator.async<
    { allowance: number },
    void,
    APIModel.Error
  >('SET_ALLOWANCE')

  export const createBackup = renterActionCreator.async<
    { destination: string },
    void,
    APIModel.Error
  >('CREATE_BACKUP')
  export const restoreBackup = renterActionCreator.async<{ source: string }, void, APIModel.Error>(
    'RESTORE_BACKUP'
  )
}

export * from './wallet'
