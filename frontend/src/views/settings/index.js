import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormLabel,
  CInputGroup,
  CRow,
} from '@coreui/react'
import { FormControl } from '@mui/material'
import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import axios from 'src/components/AxiosConfig'
import { AuthContext } from 'src/context/auth.context'

const Settings = () => {
  const navigate = useNavigate()
  const { state: authState, dispatch } = useContext(AuthContext)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' })

  const onSubmit = async (data) => {
    try {
      const res = await axios.post('/updateUser', {
        name: data?.name,
      })
      if (res?.data?.status === 200) {
        let response = res?.data?.data
        localStorage.setItem('app-manage-userData', JSON.stringify(response))
        dispatch({
          type: 'USER',
          payload: { user: response, isLoggedin: true },
        })
        toast.success(res?.data?.message)
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong',
      )
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Settings</strong>
          </CCardHeader>
          <CCardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CInputGroup>
                <CFormLabel htmlFor="Name" className="col-sm-2">
                  Name:
                </CFormLabel>
                <input
                  className="form-control col-sm-10"
                  placeholder="Name"
                  type="text"
                  name="name"
                  autoComplete="Name"
                  autoFocus
                  {...register('name', {
                    required: 'Name is required',
                  })}
                  defaultValue={authState?.user?.name}
                />
              </CInputGroup>
              <p className="error font15"> {errors.name && errors.name.message}</p>
              <CInputGroup>
                <CFormLabel htmlFor="Name" className="col-sm-2">
                  Email:
                </CFormLabel>
                <input
                  disabled={true}
                  className="form-control col-sm-10"
                  type="text"
                  name="email"
                  placeholder="Email"
                  autoComplete="email"
                  defaultValue={authState?.user?.email}
                />
              </CInputGroup>
              <p className="error font15"> {errors.email && errors.email.message}</p>

              <CRow>
                <div style={{ textAlign: 'right' }} className="col-sm-6">
                  <FormControl style={{ marginTop: 20, width: 200 }}>
                    <CButton color="danger" type="button" onClick={() => navigate(-1)}>
                      Cancel
                    </CButton>
                  </FormControl>
                </div>
                <div style={{ textAlign: 'left' }} className="col-sm-6">
                  <FormControl style={{ marginTop: 20, width: 200 }}>
                    <CButton color="primary" type="submit">
                      Update
                    </CButton>
                  </FormControl>
                </div>
              </CRow>
            </form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Settings
