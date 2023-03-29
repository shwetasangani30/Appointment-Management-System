import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCol,
  CFormLabel,
  CInputGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import OverlayLoading from '../loadingoverlay'
import { toast } from 'react-hot-toast'
import axios from '../AxiosConfig'

const AddEditClients = ({ visible, setVisible, edit, setEdit, getAllClient }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    setValue,
  } = useForm({ mode: 'onChange' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setValue('name', edit?.data?.name)
    setValue('email', edit?.data?.email)
  }, [edit, setValue])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      var res
      if (edit.flag) {
        if (!(edit?.data?.name === data?.name)) {
          res = await axios.put('update/client', {
            id: edit?.data?._id,
            name: data.name,
          })
        }
      } else {
        res = await axios.post('add/client', {
          name: data.name,
          email: data.email,
        })
      }

      if (res?.data?.status === 200) {
        toast.success(res?.data?.message)
        getAllClient()
      }
      setLoading(false)
      setVisible(false)
      setEdit({ flag: false, data: null })
    } catch (error) {
      setLoading(false)
      toast.error(error?.response?.data ? error?.response?.data?.message : 'Something went wrong!!')
    }
    reset()
  }

  return (
    <CCol sm={12}>
      <OverlayLoading loading={loading} />
      <CModal
        size="lg"
        alignment="center"
        visible={visible}
        onClose={() => {
          setEdit({ flag: false, data: null })
          setVisible(false)
          reset()
          clearErrors()
        }}
      >
        <CModalHeader>
          <CModalTitle>{edit?.flag ? 'Edit Client' : 'Add Client'}</CModalTitle>
        </CModalHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CModalBody>
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
              />
            </CInputGroup>
            <p className="error font15"> {errors.name && errors.name.message}</p>
            <CInputGroup>
              <CFormLabel htmlFor="Name" className="col-sm-2">
                Email:
              </CFormLabel>
              <input
                disabled={edit.flag}
                className="form-control col-sm-10"
                type="text"
                name="email"
                placeholder="Email"
                autoComplete="email"
                {...register('email', {
                  required: edit.flag ? false : 'Email is required',
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
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              disabled={loading}
              onClick={() => {
                setEdit({ flag: false, data: null })
                setVisible(false)
                reset()
                clearErrors()
              }}
            >
              Close
            </CButton>
            <CButton color="primary" type="submit" disabled={loading}>
              {loading ? 'Saving..' : 'Save'}
            </CButton>
          </CModalFooter>
        </form>
      </CModal>
    </CCol>
  )
}

export default AddEditClients
