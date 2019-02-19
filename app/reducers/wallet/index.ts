import { WalletActions } from 'actions'
import { isEqual } from 'lodash'
import { WalletModel } from 'models'
import { combineReducers } from 'redux'
import { reducerWithInitialState } from 'typescript-fsa-reducers'

export namespace WalletRootReducer {
  export interface ReceiveState {
    address: string
    addresses: string[]
  }

  export interface SeedState {
    primaryseed: string
    error: string
  }

  export interface State {
    summary: WalletModel.WalletGET
    transactions: WalletModel.TransactionsGETResponse
    siacoinBroadcastResponse: WalletModel.ProcessedTransaction[]
    receive: ReceiveState
    seed: SeedState
  }

  // Summary State
  const InitialSummaryState: WalletModel.WalletGET = {
    encrypted: true,
    height: 0,
    rescanning: false,
    unlocked: false,
    confirmedsiacoinbalance: 0,
    unconfirmedoutgoingsiacoins: 0,
    unconfirmedincomingsiacoins: 0,
    siacoinclaimbalance: 0,
    siafundbalance: '0',
    dustthreshold: 0
  }

  const InitialTransactionsState: WalletModel.TransactionsGETResponse & any = {
    confirmedtransactions: [],
    unconfirmedtransactions: [],
    sinceHeight: 0,
    toJSON: () => ({
      confirmedtransactions: '[TRANSACTIONS]',
      unconfirmedtransactions: '[TRANSACTIONS]'
    })
  }

  const InitialReceiveState: ReceiveState = {
    address: '',
    addresses: []
  }

  const ReceiveReducer = reducerWithInitialState(InitialReceiveState)
    .case(WalletActions.getReceiveAddresses.done, (state, payload) => {
      const addresses = [state.address, ...state.addresses]
      if (isEqual(addresses, state.addresses)) {
        return state
      }
      return {
        address: '',
        addresses: payload.result.addresses
      }
    })
    .case(WalletActions.generateReceiveAddress.done, (state, payload) => {
      let newAddresses = state.addresses
      if (state.address) {
        newAddresses = [state.address, ...state.addresses]
      }
      return {
        address: payload.result.address,
        addresses: newAddresses
      }
    })

  const SummaryReducer = reducerWithInitialState(InitialSummaryState)
    .case(WalletActions.getWallet.done, (_, payload) => {
      return payload.result
    })
    .case(WalletActions.unlockWallet.done, (state, _) => {
      return { ...state, ...{ unlocked: true } }
    })

  const TransactionReducer = reducerWithInitialState(InitialTransactionsState).case(
    WalletActions.getTransactions.done,
    (state, payload) => {
      let ctx = payload.result.confirmedtransactions
      let utx = payload.result.unconfirmedtransactions
      if (!ctx) {
        ctx = []
      }
      if (!utx) {
        utx = []
      }
      const newState = {
        confirmedtransactions: ctx,
        unconfirmedtransactions: utx,
        sinceHeight: payload.params.sinceHeight
      }
      return newState
    }
  )

  const SCBroadcastReducer = reducerWithInitialState([] as WalletModel.ProcessedTransaction[])
    .case(WalletActions.broadcastedTransactionDetails, (_, payload) => {
      return payload
    })
    .case(WalletActions.resetTransactionDetails, _ => [])

  const SeedReducer = reducerWithInitialState({
    primaryseed: '',
    error: ''
  })
    .case(WalletActions.createNewWallet.done, (_, payload) => ({
      error: '',
      primaryseed: payload.result.primaryseed
    }))
    .case(WalletActions.createNewWallet.failed, (_, payload) => ({
      error: payload.error.message,
      primaryseed: ''
    }))
    .cases([WalletActions.clearSeed, WalletActions.lockWallet.started], () => ({
      error: '',
      primaryseed: ''
    }))
    .case(WalletActions.getWalletSeeds.done, (_, payload) => ({
      primaryseed: payload.result.primaryseed,
      error: ''
    }))

  // End Summary State
  export const Reducer = combineReducers<State>({
    summary: SummaryReducer,
    transactions: TransactionReducer,
    siacoinBroadcastResponse: SCBroadcastReducer,
    receive: ReceiveReducer,
    seed: SeedReducer
  })
}
