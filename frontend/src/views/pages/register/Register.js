import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'src/components/AxiosConfig'
import { toast } from 'react-hot-toast'
import OverlayLoading from 'src/components/loadingoverlay'

const Register = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' })

  const onSubmit = async (data) => {
    setLoading(true)
    let request = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: 3,
    }
    try {
      const res = await axios.post('register/', request)
      if (res?.data?.status === 200) {
        setLoading(false)
        toast.success('Registration successful. Please login to continue.')
        navigate('/login')
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
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <h1 style={{ textAlign: 'center' }}>Register</h1>
                  <p style={{ textAlign: 'center' }} className="text-medium-emphasis">
                    Create your account
                  </p>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <input
                      className="form-control"
                      placeholder="Name"
                      type="text"
                      name="name"
                      autoComplete="current-password"
                      autoFocus
                      {...register('name', {
                        required: 'Name is required',
                        maxLength: 10,
                      })}
                    />
                  </CInputGroup>
                  <p className="error font15"> {errors.name && errors.name.message}</p>
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
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <input
                      className="form-control"
                      placeholder="Repeat password"
                      type="password"
                      name="repeatpassword"
                      autoComplete="current-password"
                      autoFocus
                      {...register('repeatpassword', {
                        validate: (value) =>
                          watch('password') === value || 'The passwords do not match',
                        required: 'Repeat password is required',
                        maxLength: 10,
                      })}
                    />
                  </CInputGroup>
                  <p className="error font15">
                    {' '}
                    {errors.repeatpassword && errors.repeatpassword.message}
                  </p>
                  <div className="d-grid">
                    <CButton type="submit" color="primary">
                      Create an Account
                    </CButton>
                  </div>
                  <CRow>
                    <CCol xs={6}>
                      <CButton className="font15" color="link" onClick={() => navigate('/login')}>
                        Back to login
                      </CButton>
                    </CCol>
                  </CRow>
                </form>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
