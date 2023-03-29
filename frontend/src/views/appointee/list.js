import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
// import Table from 'src/components/table'
import CIcon from '@coreui/icons-react'
import { cilPlus } from '@coreui/icons'
import AddEditAppointee from 'src/components/models/addeditAppointee'
import axios from 'src/components/AxiosConfig'
import MuiTable from 'src/components/muiTable'
import moment from 'moment'
import { AppointeeContext } from 'src/context/appointee.context'
import DeleteConfirmation from 'src/components/models/deleteConfirmation'
import { toast } from 'react-hot-toast'
import { IconButton, Switch, Tooltip } from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'

const Appointee = () => {
  const [visible, setVisible] = useState(false)
  const [displayData, setDisplayData] = useState([])
  const [edit, setEdit] = useState({ flag: false, data: null })
  const [deleteModel, setDeleteModel] = useState(false)
  const [deleteRow, setDeleteRow] = useState({})
  const dataFetchedRef = useRef(false)
  const { state, dispatch } = useContext(AppointeeContext)

  const getAllAppointee = useCallback(async () => {
    try {
      const res = await axios.get('getAll/appointee/')
      let response = res?.data?.data
      if (res?.data?.status === 200) {
        dispatch({
          type: 'LIST',
          payload: { appointeelist: response },
        })
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong',
      )
    }
  }, [dispatch])

  const editAppointee = async (value) => {
    try {
      const res = await axios.get('getUser/' + value._id)
      let response = res?.data?.data
      setVisible(true)
      setEdit({ flag: true, data: response })
    } catch (error) {
      toast.error(
        error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong',
      )
    }
  }

  const deleteData = async () => {
    try {
      const res = await axios.delete('delete/appointee/' + deleteRow._id)
      if (res?.data?.status === 200) {
        toast.success(res?.data?.message)
        setDeleteModel(false)
        setDeleteRow({})
        getAllAppointee()
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong',
      )
    }
  }

  const updateStatus = useCallback(
    async (e, value) => {
      try {
        const res = await axios.post('/updateStatus/appointee', {
          id: value?._id,
          status: e.target.checked,
        })
        if (res?.data?.status === 200) {
          toast.success(res?.data?.message)
          getAllAppointee()
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong',
        )
      }
    },
    [getAllAppointee],
  )

  useEffect(() => {
    if (dataFetchedRef.current) return
    dataFetchedRef.current = true
    getAllAppointee()
  }, [dispatch, getAllAppointee])

  useEffect(() => {
    const display = state?.appointeelist?.map((value, i) => {
      return {
        user_id: value._id,
        id: i + 1,
        name: value.name,
        email: value.email,
        createdAt: moment(value.createdAt).format('DD-MM-YYYY'),
        actions: (
          <div className="actions-flex">
            <Tooltip title="Edit">
              <IconButton aria-label="Edit" color="warning" onClick={() => editAppointee(value)}>
                <EditIcon fontSize="medium" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                aria-label="Delete"
                color="error"
                onClick={() => {
                  setDeleteModel(true)
                  setDeleteRow(value)
                }}
              >
                <DeleteIcon fontSize="medium" />
              </IconButton>
            </Tooltip>

            <Tooltip title={value?.status ? 'Inactive' : 'Active'}>
              <Switch
                aria-label="formSwitch"
                id="formSwitch"
                onChange={(e) => updateStatus(e, value)}
                checked={value?.status}
                size="medium"
              />
            </Tooltip>
          </div>
        ),
      }
    })
    setDisplayData(display)
  }, [state, getAllAppointee, updateStatus])

  const columns = [
    { id: 'id', label: '#', minWidth: 20 },
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 100 },
    {
      id: 'createdAt',
      label: 'Created At',
      minWidth: 170,
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'actions',
      label: 'Actions',
      align: 'left',
      minWidth: 200,
    },
  ]

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Appointee</strong>
            <CButton
              className="btn-sm"
              color="primary"
              style={{ float: 'right' }}
              onClick={() => setVisible(true)}
            >
              <CIcon icon={cilPlus} className="me-2" />
              Add
            </CButton>
          </CCardHeader>
          <CCardBody>
            <MuiTable columns={columns} displayData={displayData} rowsPrPage={10} />
          </CCardBody>
        </CCard>
      </CCol>
      <AddEditAppointee
        visible={visible}
        setVisible={setVisible}
        edit={edit}
        setEdit={setEdit}
        getAllAppointee={getAllAppointee}
      />
      <DeleteConfirmation
        deleteModel={deleteModel}
        setDeleteModel={setDeleteModel}
        setDeleteRow={setDeleteRow}
        deleteData={deleteData}
      />
    </CRow>
  )
}

export default Appointee
