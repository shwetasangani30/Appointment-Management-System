import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { IconButton, Switch, Tooltip } from '@mui/material'
import moment from 'moment'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'src/components/AxiosConfig'
import AddEditPackage from 'src/components/models/addeditPackage'
import DeleteConfirmation from 'src/components/models/deleteConfirmation'
import MuiTable from 'src/components/muiTable'
import { PackagesContext } from 'src/context/packages.context'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'

const Packages = () => {
  const [visible, setVisible] = useState(false)
  const [displayData, setDisplayData] = useState([])
  const [edit, setEdit] = useState({ flag: false, data: null })
  const [deleteModel, setDeleteModel] = useState(false)
  const [deleteRow, setDeleteRow] = useState({})
  const dataFetchedRef = useRef(false)
  const { state, dispatch } = useContext(PackagesContext)

  const getAllPackage = useCallback(async () => {
    try {
      const res = await axios.get('getAllByUser/package/')
      let response = res?.data?.data
      if (res?.data?.status === 200) {
        dispatch({
          type: 'LIST',
          payload: { packagelist: response },
        })
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong',
      )
    }
  }, [dispatch])

  const editPackage = async (value) => {
    try {
      const res = await axios.get('package/' + value._id)
      let response = res?.data?.data
      setVisible(true)
      setEdit({ flag: true, data: response })
      toast.success(res?.data?.message)
    } catch (error) {
      toast.error(
        error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong',
      )
    }
  }

  const deleteData = async () => {
    try {
      const res = await axios.delete('delete/package/' + deleteRow._id)
      if (res?.data?.status === 200) {
        toast.success(res?.data?.message)
        setDeleteModel(false)
        setDeleteRow({})
        getAllPackage()
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
        const res = await axios.post('/updateStatus/package', {
          id: value?._id,
          status: e.target.checked,
        })
        if (res?.data?.status === 200) {
          toast.success(res?.data?.message)
          getAllPackage()
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong',
        )
      }
    },
    [getAllPackage],
  )

  useEffect(() => {
    setDisplayData([])
    if (dataFetchedRef.current) return
    dataFetchedRef.current = true
    getAllPackage()
    return () => {
      setDisplayData([])
    }
  }, [getAllPackage])

  useEffect(() => {
    setDisplayData([])
    const display = state?.packagelist?.map((value, i) => {
      return {
        user_id: value.user_id,
        id: i + 1,
        name: value.name,
        description: value.description,
        createdAt: moment(value.createdAt).format('DD-MM-YYYY'),
        actions: (
          <div className="actions-flex">
            <Tooltip title="Edit">
              <IconButton aria-label="Edit" color="warning" onClick={() => editPackage(value)}>
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
    return () => {
      setDisplayData([])
    }
  }, [state, updateStatus])

  const columns = [
    { id: 'id', label: '#', minWidth: 20 },
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'description', label: 'Description', minWidth: 100 },
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
            <strong>Packages</strong>
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

      <AddEditPackage
        visible={visible}
        setVisible={setVisible}
        edit={edit}
        setEdit={setEdit}
        getAllPackage={getAllPackage}
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

export default Packages
