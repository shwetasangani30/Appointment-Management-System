import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import moment from 'moment'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'src/components/AxiosConfig'
import MuiTable from 'src/components/muiTable'
import { PackagesContext } from 'src/context/packages.context'

const ClientPackages = () => {
  const [displayData, setDisplayData] = useState([])
  const dataFetchedRef = useRef(false)
  const { state, dispatch } = useContext(PackagesContext)

  const getAllPackage = useCallback(async () => {
    try {
      var res = await axios.get('getAll/package/')
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

  useEffect(() => {
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
      }
    })
    setDisplayData(display)
    return () => {
      setDisplayData([])
    }
  }, [state])

  const columns = [
    { id: 'id', label: '#', minWidth: 20 },
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'description', label: 'Description', minWidth: 100 },
    {
      id: 'user_id',
      label: 'Appointee',
      align: 'left',
      value: 'name',
      isObj: true,
    },
    {
      id: 'createdAt',
      label: 'Created At',
      minWidth: 170,
      format: (value) => value.toLocaleString('en-US'),
    },
  ]

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Packages</strong>
          </CCardHeader>
          <CCardBody>
            <MuiTable columns={columns} displayData={displayData} rowsPrPage={10} />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ClientPackages
