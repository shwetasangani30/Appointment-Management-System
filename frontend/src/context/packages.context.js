import React, { createContext, useReducer } from 'react'

const PackagesContext = createContext()
const { Provider } = PackagesContext

const initialState = {
  packagelist: [],
}

const PackagesReducer = (state = initialState, action) => {
  switch (action?.type) {
    case 'INIT':
      return initialState
    case 'LIST':
      return {
        ...state,
        packagelist: action?.payload?.packagelist,
      }
    default:
      return state
  }
}

const PackagesProvider = ({ children }) => {
  var [state, dispatch] = useReducer(PackagesReducer, initialState)
  return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export { PackagesProvider, PackagesContext }
