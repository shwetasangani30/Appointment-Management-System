import React, { createContext, useReducer } from 'react'

const AppointmentContext = createContext()
const { Provider } = AppointmentContext

const initialState = {
  appointmentlist: [],
  pendingApproved: [],
  appointment: [],
}

const AppointmentReducer = (state = initialState, action) => {
  switch (action?.type) {
    case 'INIT':
      return initialState
    case 'LIST':
      return {
        ...state,
        appointmentlist: action?.payload?.appointmentlist,
      }
    case 'APPOINTMENT':
      return {
        ...state,
        appointment: action?.payload?.appointment,
      }
    case 'PENDING_APPROVED':
      return {
        ...state,
        pendingApproved: action?.payload?.pendingApproved,
      }
    default:
      return state
  }
}

const AppointmentProvider = ({ children }) => {
  var [state, dispatch] = useReducer(AppointmentReducer, initialState)
  return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export { AppointmentProvider, AppointmentContext }
