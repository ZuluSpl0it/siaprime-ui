import { RenterActions } from 'actions'
import { isEqual } from 'lodash'
import { RenterModel } from 'models'
import { combineReducers } from 'redux'
import { reducerWithInitialState } from 'typescript-fsa-reducers'

export namespace RenterReducer {
  export interface State {
    contracts: RenterModel.ContractsGETResponse
  }

  const InitialContractsState: RenterModel.ContractsGETResponse = {
    activecontracts: [],
    expiredcontracts: [],
    inactivecontracts: []
  }

  const ContractReducer = reducerWithInitialState(InitialContractsState).case(
    RenterActions.fetchContracts.done,
    (state, payload) => {
      const response = payload.result
      const activeContractsEqual = isEqual(response.activecontracts, state.activecontracts)
      const iacEqual = isEqual(response.inactivecontracts, state.inactivecontracts)
      const eEqual = isEqual(response.expiredcontracts, state.expiredcontracts)
      const allEqual = activeContractsEqual && iacEqual && eEqual
      if (allEqual) {
        return state
      }
      return {
        activecontracts: response.activecontracts,
        inactivecontracts: response.inactivecontracts,
        expiredcontracts: response.expiredcontracts
      }
    }
  )

  export const Reducer = combineReducers<State>({
    contracts: ContractReducer
  })
}
