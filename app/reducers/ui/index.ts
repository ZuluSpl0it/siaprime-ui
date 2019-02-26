import { WalletActions, GlobalActions } from 'actions'
import { combineReducers } from 'redux'
import { reducerWithInitialState } from 'typescript-fsa-reducers'

export namespace UIReducer {
  export interface State {
    unlockForm: UnlockFormState
    siad: SiadState
  }

  export interface SiadState {
    isInternal: boolean
    isActive: boolean
    loading: boolean
  }

  export interface UnlockFormState {
    validateStatus: string
    help?: string
    loading: boolean
  }

  const InitialUnlockState = {
    validateStatus: '',
    help: '',
    loading: false
  }

  const InitialSiadState = {
    isInternal: true,
    isActive: false,
    loading: true
  }

  const UnlockFormReducer = reducerWithInitialState(InitialUnlockState)
    .case(WalletActions.unlockWallet.failed, (_, payload) => {
      // We should really have status messages for this, and not rely on string matching.
      const errorMessage = payload.error.message
      let help = null
      if (errorMessage.includes('provided encryption key is incorrect')) {
        help = 'Provided password is incorrect'
      } else {
        help = errorMessage
      }
      return {
        validateStatus: 'error',
        help,
        loading: false
      }
    })
    .case(WalletActions.unlockWallet.started, (state, _) => ({ ...state, loading: true }))
    .case(WalletActions.unlockWallet.done, () => InitialUnlockState)

  const SiadReducer = reducerWithInitialState(InitialSiadState)
    .case(GlobalActions.siadLoaded, (state, _) => {
      return {
        ...state,
        isActive: true,
        loading: false
      }
    })
    .case(GlobalActions.siadOffline, (state, _) => {
      return {
        ...state,
        isActive: false,
        loading: false
      }
    })
    .case(GlobalActions.siadLoading, (state, _) => {
      return {
        ...state,
        isActive: false,
        loading: true
      }
    })
    .case(GlobalActions.setSiadOrigin, (state, payload) => {
      return {
        ...state,
        isInternal: payload.isInternal
      }
    })

  export const Reducer = combineReducers<State>({
    unlockForm: UnlockFormReducer,
    siad: SiadReducer
  })
}
