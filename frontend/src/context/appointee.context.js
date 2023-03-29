import React, { createContext, useReducer } from 'react'

const AppointeeContext = createContext()
const { Provider } = AppointeeContext

const initialState = {
  appointeelist: [],
  packagelist: [],
}

const AppointeeReducer = (state = initialState, action) => {
  switch (action?.type) {
    case 'INIT':
      return initialState
    case 'LIST':
      return {
        ...state,
        appointeelist: action?.payload?.appointeelist,
      }
    case 'PACKAGE':
      return {
        ...state,
        packagelist: action?.payload?.packagelist,
      }
    default:
      return state
  }
}

const AppointeeProvider = ({ children }) => {
  var [state, dispatch] = useReducer(AppointeeReducer, initialState)
  return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export { AppointeeProvider, AppointeeContext }
