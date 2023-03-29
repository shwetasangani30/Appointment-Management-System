import axios from 'axios'
import { API_URL } from './Constants'
import history from './history'

const axiosInstance = () => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    baseURL: API_URL + 'api/',
  }

  // Create instance
  let instance = axios.create(defaultOptions)

  // Set the AUTH token for any request
  instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('app-manage-token')
    config.headers.authorization = token ? `${token}` : ''
    return config
  })

  instance.interceptors.response.use(
    function (response) {
      return response
    },
    function (err) {
      if (
        err &&
        err.response &&
        err.response.status &&
        err.response.status === 401 &&
        err.config &&
        !err.config.__isRetryRequest
      ) {
        history.push('/logout')
      }
      return Promise.reject(err)
    },
  )

  return instance
}

export default axiosInstance()
