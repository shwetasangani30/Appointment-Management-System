import React, { useState } from 'react'
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
import { useForm } from 'react-hook-form'
import axios from 'src/components/AxiosConfig'
import { toast } from 'react-hot-toast'
import OverlayLoading from 'src/components/loadingoverlay'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    let request = {
      email: data.email,
    }
    try {
      const res = await axios.post('forgot-password/', request)
      if (res?.data?.status === 200) {
        setLoading(false)
        toast.success(res?.data?.message)
        navigate('/logout')
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
                    <h1 style={{ textAlign: 'center', marginBottom: 25 }}>Forgot Password</h1>
                    <CInputGroup>
                      <CInputGroupText>@</CInputGroupText>
                      <input
                        className="form-control"
                        type="text"
                        name="email"
                        placeholder="Enter registered email"
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
                    <CRow className="m-0">
                      <CButton type="submit" color="primary" className="px-4">
                        Forgot Password
                      </CButton>
                    </CRow>
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
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default ForgotPassword
