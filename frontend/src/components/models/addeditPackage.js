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

const AddEditPackage = ({ visible, setVisible, edit, setEdit, getAllPackage }) => {
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
    setValue('description', edit?.data?.description)
  }, [edit, setValue])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      var res
      if (edit.flag) {
        res = await axios.put('update/package', {
          id: edit?.data?._id,
          name: data.name,
          description: data.description,
        })
      } else {
        res = await axios.post('add/package', {
          name: data.name,
          description: data.description,
        })
      }

      if (res?.data?.status === 200) {
        toast.success(res?.data?.message)
        getAllPackage()
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
          <CModalTitle>{edit?.flag ? 'Edit Package' : 'Add Package'}</CModalTitle>
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
                Description:
              </CFormLabel>
              <textarea
                className="form-control col-sm-10"
                placeholder="Description"
                name="description"
                autoComplete="Description"
                autoFocus
                {...register('description', {
                  required: 'Description is required',
                })}
              />
            </CInputGroup>
            <p className="error font15"> {errors.description && errors.description.message}</p>
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

export default AddEditPackage
