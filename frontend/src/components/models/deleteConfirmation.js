import React from 'react'
import {
  CButton,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'

const DeleteConfirmation = ({ deleteModel, setDeleteModel, setDeleteRow, deleteData }) => {
  return (
    <CCol sm={12}>
      <CModal
        size="sm"
        alignment="center"
        visible={deleteModel}
        onClose={() => {
          setDeleteModel(false)
          setDeleteRow({})
        }}
      >
        <CModalHeader>
          <CModalTitle>Delete Confirmation</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure wants to delete?</CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              setDeleteModel(false)
              setDeleteRow({})
            }}
          >
            Close
          </CButton>
          <CButton color="primary" type="button" onClick={deleteData}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    </CCol>
  )
}

export default DeleteConfirmation
