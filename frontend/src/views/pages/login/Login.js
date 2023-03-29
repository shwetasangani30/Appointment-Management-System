import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import { useForm } from 'react-hook-form'
import { AuthContext } from 'src/context/auth.context'
import axios from 'src/components/AxiosConfig'
import jwt from 'jwt-decode'
import { toast } from 'react-hot-toast'
import OverlayLoading from 'src/components/loadingoverlay'

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' })

  const { dispatch } = useContext(AuthContext)
  const token = localStorage.getItem('app-manage-token')

  useEffect(() => {
    if (token) {
      let decodetoken = jwt(token)
      let currentDate = new Date()
      if (decodetoken.exp * 1000 < currentDate.getTime()) {
        navigate(`/logout`)
      } else {
        navigate('/dashboard')
      }
    }
  }, [navigate, token])

  const onSubmit = async (data) => {
    setLoading(true)
    let request = {
      email: data.email,
      password: data.password,
    }
    try {
      const res = await axios.post('login/', request)
      let response = res?.data?.data
      if (res?.data?.status === 200) {
        setLoading(false)
        localStorage.setItem('app-manage-userData', JSON.stringify(response))
        localStorage.setItem('app-manage-token', response?.token)
        dispatch({
          type: 'USER',
          payload: { user: response, isLoggedin: true },
        })
        toast.success(res?.data?.message)
        navigate('/dashboard')
      }
    } catch (error) {
      setLoading(false)
      toast.error(error?.response?.data ? error?.response?.data?.message : 'Something went wrong!!')
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <OverlayLoading loading={loading} />
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <h1 style={{ textAlign: 'center' }}>Login</h1>
                    <p style={{ textAlign: 'center' }} className="text-medium-emphasis">
                      Sign In to your account
                    </p>
                    <CInputGroup>
                      <CInputGroupText>@</CInputGroupText>
                      <input
                        className="form-control"
                        type="text"
                        name="email"
                        placeholder="Email"
                        autoComplete="email"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value:
                              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: 'Invalid email',
                          },
                          maxLength: 50,
                        })}
                      />
                    </CInputGroup>
                    <p className="error font15"> {errors.email && errors.email.message}</p>
                    <CInputGroup>
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <input
                        className="form-control"
                        placeholder="Password"
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        autoFocus
                        {...register('password', {
                          required: 'Password is required',
                          maxLength: 10,
                        })}
                      />
                    </CInputGroup>
                    <p className="error font15"> {errors.password && errors.password.message}</p>
                    <CRow className="m-0">
                      <CButton type="submit" color="primary" className="px-4">
                        Login
                      </CButton>
                    </CRow>
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          className="font15"
                          color="link"
                          onClick={() => navigate('/forgot-password')}
                        >
                          Forgot password?
                        </CButton>
                      </CCol>
                      <CCol xs={6}>
                        <CButton
                          className="font15"
                          color="link"
                          onClick={() => navigate('/register')}
                        >
                          Do not have an account? Sign Up
                        </CButton>
                      </CCol>
                    </CRow>
                  </form>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
