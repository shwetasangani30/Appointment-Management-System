import React, { createContext, useReducer } from 'react'
import jwt from 'jwt-decode'

const AuthContext = createContext()
const { Provider } = AuthContext

const initialState = {
  isLoggedin: false,
  user: null,
  dashboard: [],
}

const sidebarReducer = (state = initialState, action) => {
  switch (action?.type) {
    case 'USER':
      return {
        ...state,
        isLoggedin: action?.payload?.isLoggedin
          ? action?.payload?.isLoggedin
          : initialState?.isLoggedin,
        user: action?.payload?.user,
      }
    case 'DASHBOARD':
      return {
        ...state,
        dashboard: action?.payload?.dashboard,
      }
    case 'LOGOUT':
      return {
        ...state,
        ...initialState,
      }
    default:
      return state
  }
}

const AuthProvider = ({ children }) => {
  var [state, dispatch] = useReducer(sidebarReducer, initialState)
  const token = localStorage.getItem('app-manage-token')
  const userData = JSON.parse(localStorage.getItem('app-manage-userData'))

  if (token) {
    let decodetoken = jwt(token)
    let currentDate = new Date()
    if (decodetoken.exp * 1000 > currentDate.getTime()) {
      state = { ...state, isLoggedin: true, user: userData }
    }
  }
  return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export { AuthProvider, AuthContext }
