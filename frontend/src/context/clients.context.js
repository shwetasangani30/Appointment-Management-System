import React, { createContext, useReducer } from 'react'

const ClientsContext = createContext()
const { Provider } = ClientsContext

const initialState = {
  clientlist: [],
}

const ClientsReducer = (state = initialState, action) => {
  switch (action?.type) {
    case 'INIT':
      return initialState
    case 'LIST':
      return {
        ...state,
        clientlist: action?.payload?.clientlist,
      }
    default:
      return state
  }
}

const ClientProvider = ({ children }) => {
  var [state, dispatch] = useReducer(ClientsReducer, initialState)
  return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export { ClientProvider, ClientsContext }
