import React, { createContext, useReducer } from 'react'

const SlotsContext = createContext()
const { Provider } = SlotsContext

const initialState = {
  slotdata: [],
  appointeeSlots: [],
}

const SlotsReducer = (state = initialState, action) => {
  switch (action?.type) {
    case 'INIT':
      return initialState
    case 'GET':
      return {
        ...state,
        slotdata: action?.payload?.slotdata,
      }
    case 'APPOINTEE_SLOTS':
      return {
        ...state,
        appointeeSlots: action?.payload?.appointeeSlots,
      }
    default:
      return state
  }
}

const SlotsProvider = ({ children }) => {
  var [state, dispatch] = useReducer(SlotsReducer, initialState)
  return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export { SlotsProvider, SlotsContext }
