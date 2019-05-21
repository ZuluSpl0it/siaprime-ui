import { siad } from 'api/siad'
import { useReducer, useEffect } from 'react'

// this file maps out common hooks that will be used by Sia-UI. At the moment we
// use a mix of react-hooks and redux-sagas (legacy). overtime, as
// best-practices for data management with react-hooks are formed, my goal is to
// move Sia-UI to a full-hooks model, as it's quite easier to work with
// react-hooks when prototyping than with react-redux + sagas.

// define the actions used by the reducer for siad requests
const actions = {
  REQUEST_START: 'REQUEST_START',
  REQUEST_END: 'REQUEST_END'
}

const client = siad

function reducer(state, action) {
  switch (action.type) {
    case actions.REQUEST_START:
      return {
        ...state,
        loading: true
      }
    case actions.REQUEST_END:
      return {
        ...state,
        loading: false,
        [action.error ? 'error' : 'response']: action.payload
      }
    default:
      return state
  }
}

// request dispatches to set loading and resolves the response value or error
// value
async function request(config, dispatch) {
  try {
    dispatch({ type: actions.REQUEST_START })
    const response = await client.call(config)
    dispatch({ type: actions.REQUEST_END, payload: response })
  } catch (err) {
    dispatch({ type: actions.REQUEST_END, payload: err, error: true })
  }
}

// todo: set strict typing through type inference
// useSiad returns a react hook with the shape: `[{loading, response, error}, refetch()]`
export function useSiad(config, autoTrigger = true) {
  const [state, dispatch] = useReducer(reducer, { loading: autoTrigger ? true : false })
  useEffect(() => {
    if (autoTrigger) {
      request(config, dispatch)
    }
  }, [JSON.stringify(config), autoTrigger])

  return [
    state,
    function refetch() {
      return request(config, dispatch)
    }
  ]
}
