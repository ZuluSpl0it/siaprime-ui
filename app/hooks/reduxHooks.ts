import { useDispatch, useMappedState } from 'redux-react-hook'
import { useCallback } from 'react'
import { IndexState } from 'reducers'

// useConsensus returns the redux state of consensus
export const useConsensus = () => {
  // Declare your memoized mapState function
  const mapState = useCallback(
    (state: IndexState) => ({
      consensus: state.consensus
    }),
    []
  )
  const { consensus } = useMappedState(mapState)
  return consensus
}
