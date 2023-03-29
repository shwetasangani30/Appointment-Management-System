import { React, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { AuthContext } from 'src/context/auth.context'
import jwt from 'jwt-decode'

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('app-manage-token')
  const { state } = useContext(AuthContext)

  if (token) {
    let decodetoken = jwt(token)
    let currentDate = new Date()
    if (decodetoken.exp * 1000 < currentDate.getTime() || state?.isLoggedin === false) {
      return <Navigate to="/login" />
    }
    return children
  }
  return <Navigate to="/login" />
}

AdminRoute.propTypes = {
  children: PropTypes.any,
}
export { AdminRoute }
