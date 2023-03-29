import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import {
  Chip,
  FormControl,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextareaAutosize,
  Tooltip,
} from '@mui/material'
import moment from 'moment'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import {
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  RemoveRedEye,
} from '@mui/icons-material'
import axios from 'src/components/AxiosConfig'
import MuiTable from 'src/components/muiTable'
import { AppointmentContext } from 'src/context/appointment.context'
import { AuthContext } from 'src/context/auth.context'
import { useForm } from 'react-hook-form'
import OverlayLoading from '../../components/loadingoverlay'
import { Edit as EditIcon } from '@mui/icons-material'

const AppointmentList = () => {
  const navigate = useNavigate()
  const dataFetchedRef = useRef(false)
  const [displayData, setDisplayData] = useState([])
  const [cancelModel, setCancelModel] = useState(false)
  const [cancelRow, setCancelRow] = useState({})
  const [rejectModel, setRejectModel] = useState(false)
  const [rejectRow, setRejectRow] = useState({})
  const [viewModel, setViewModel] = useState(false)
  const [viewRow, setViewRow] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterValue, setFilterValue] = useState(-1)
  const { state, dispatch } = useContext(AppointmentContext)
  const { state: authState } = useContext(AuthContext)

  const {
    register: cancelRegister,
    handleSubmit: cancelHandleSubmit,
    formState: { errors: cancelerror },
  } = useForm({ mode: 'onChange' })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' })

  const columns = [
    { id: 'id', label: '#', minWidth: 20 },
    {
      id: 'appointeeId',
      label: 'Appointee',
      minWidth: 130,
      hidden: authState?.user?.role === 2 ? true : false,
    },
    {
      id: 'clientId',
      label: 'Client',
      minWidth: 130,
      hidden: authState?.user?.role === 3 ? true : false,
    },
    { id: 'packageId', label: 'Package', minWidth: 100 },
    { id: 'appointmentDateTime', label: 'Schedule date and time', minWidth: 200 },
    {
      id: 'createdAt',
      label: 'Created At',
      minWidth: 130,
      format: (value) => value.toLocaleString('en-US'),
    },
    { id: 'status', label: 'Status', minWidth: 70 },
    {
      id: 'actions',
      label: 'Actions',
      align: 'left',
      minWidth: 100,
    },
  ]

  const getAllAppointments = useCallback(async () => {
    try {
      if (authState?.user?.role === 1) {
        const res = await axios.post('/getByStatus/appointment', { status: [0, 1, 2, 3, 4] })
        let response = res?.data?.data
        if (res?.data?.status === 200) {
          dispatch({
            type: 'LIST',
            payload: { appointmentlist: response },
          })
        }
      } else {
        const res = await axios.get(
          authState?.user?.role === 3
            ? '/getAllByUser/appointment'
            : '/getAllByAppointee/appointment',
        )
        let response = res?.data?.data
        if (res?.data?.status === 200) {
          dispatch({
            type: 'LIST',
            payload: { appointmentlist: response },
          })
        }
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong',
      )
    }
    setLoading(false)
  }, [authState?.user?.role, dispatch])

  const ApproveAppointment = useCallback(
    async (value) => {
      setLoading(true)
      try {
        const res = await axios.post('/updateStatus/appointment', { id: value._id, status: 1 })
        if (res?.data?.status === 200) {
          toast.success(res?.data?.message)
          getAllAppointments()
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong',
        )
      }
    },
    [getAllAppointments],
  )

  const onReject = async (data) => {
    setLoading(true)
    try {
      const res = await axios.post('/updateStatus/appointment', {
        id: rejectRow._id,
        status: 2,
        rejectReason: data?.rejectreason,
      })
      if (res?.data?.status === 200) {
        toast.success(res?.data?.message)
        setRejectModel(false)
        setRejectRow({})
        getAllAppointments()
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong',
      )
    }
  }

  const onCancel = async (data) => {
    setLoading(true)
    try {
      const res = await axios.post('/updateStatus/appointment', {
        id: cancelRow._id,
        status: 3,
        cancelReason: data?.cancelreason,
      })
      if (res?.data?.status === 200) {
        toast.success(res?.data?.message)
        setCancelModel(false)
        setCancelRow({})
        getAllAppointments()
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong',
      )
    }
  }

  useEffect(() => {
    setLoading(true)
    setDisplayData([])
    if (dataFetchedRef.current) return
    dataFetchedRef.current = true
    getAllAppointments()
    return () => {
      setDisplayData([])
    }
  }, [getAllAppointments])

  useEffect(() => {
    setDisplayData([])
    var mainArr = state?.appointmentlist
    if (parseInt(filterValue) !== -1 && filterValue) {
      mainArr = state?.appointmentlist?.filter((filter) => filter?.status === parseInt(filterValue))
    }
    const display = mainArr?.map((value, i) => {
      var mainDate = new Date(value?.appointmentDate)
      var currentDate = new Date()
      var diffDay = Math.ceil((mainDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
      let checkDate =
        diffDay > 0 ||
        (diffDay === -0 &&
          moment().isSameOrBefore(moment(value?.appointmentTime?.split('-')[0], 'HH:mm')))
      return {
        id: i + 1,
        appointeeId: value?.appointeeId?.name,
        clientId: value?.clientId?.name,
        packageId: value?.packageId?.name,
        description: value.description,
        appointmentDateTime:
          moment(value.appointmentDate).format('DD-MM-YYYY') + ' ' + value?.appointmentTime,
        createdAt: moment(value.createdAt).format('DD-MM-YYYY'),
        statusValue: value?.status,
        status: (
          <>
            {value?.status === 0 && <Chip label="Pending" color="primary" />}
            {value?.status === 1 && <Chip label="Approved" color="success" />}
            {value?.status === 2 && <Chip label="Rejected" color="warning" />}
            {value?.status === 3 && <Chip label="Cancelled" color="error" />}
            {value?.status === 4 && <Chip label="Auto Cancelled" color="secondary" />}
          </>
        ),
        actions: (
          <div className="actions-flex">
            {authState?.user?.role === 3 && value?.status === 0 && checkDate && (
              <Tooltip title="Cancel">
                <IconButton
                  aria-label="cancel"
                  color="error"
                  onClick={() => {
                    setCancelRow(value)
                    setCancelModel(true)
                  }}
                >
                  <CancelIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
            )}
            {authState?.user?.role === 2 && (
              <>
                {(value?.status === 0 || value?.status === 2) && checkDate && (
                  <Tooltip title="Approve">
                    <IconButton
                      aria-label="approve"
                      color="success"
                      onClick={() => {
                        ApproveAppointment(value)
                      }}
                    >
                      <CheckCircleIcon fontSize="medium" />
                    </IconButton>
                  </Tooltip>
                )}
                {(value?.status === 0 || value?.status === 1) && checkDate && (
                  <Tooltip title="Reject">
                    <IconButton
                      aria-label="approve"
                      color="error"
                      onClick={() => {
                        setRejectRow(value)
                        setRejectModel(true)
                      }}
                    >
                      <CancelIcon fontSize="medium" />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            )}
            {checkDate &&
              ((value?.status !== 0 && authState?.user?.role === 2) ||
                (value?.status === 0 && authState?.user?.role === 3)) && (
                <Tooltip title="Edit">
                  <IconButton
                    aria-label="Edit"
                    color="warning"
                    onClick={() => {
                      navigate('/appointments/edit/' + value?._id)
                    }}
                  >
                    <EditIcon fontSize="medium" />
                  </IconButton>
                </Tooltip>
              )}
            <Tooltip title="View">
              <IconButton
                aria-label="view"
                color="secondary"
                onClick={() => {
                  setViewModel(true)
                  setViewRow(value)
                }}
              >
                <RemoveRedEye fontSize="medium" />
              </IconButton>
            </Tooltip>
          </div>
        ),
      }
    })
    setDisplayData(display)
    return () => {
      setDisplayData([])
    }
  }, [filterValue, ApproveAppointment, authState?.user?.role, state, navigate])

  return (
    <>
      <OverlayLoading loading={loading} />
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Appointments</strong>
              {authState?.user?.role === 3 && (
                <CButton
                  className="btn-sm"
                  color="primary"
                  style={{ float: 'right' }}
                  onClick={() => navigate(`/appointments/add`)}
                >
                  <CIcon icon={cilPlus} className="me-2" />
                  Add
                </CButton>
              )}
              <div style={{ marginTop: '-25px' }}>
                <select
                  className="form-control"
                  style={{ float: 'right', marginRight: 5, width: '20%' }}
                  name="filter"
                  onChange={(e) => {
                    setFilterValue(e?.target?.value)
                  }}
                  value={filterValue}
                >
                  <option key={'All'} value={-1}>
                    All
                  </option>
                  <option key={'Pending'} value={0}>
                    Pending
                  </option>
                  <option key={'Approved'} value={1}>
                    Approved
                  </option>
                  <option key={'Rejected'} value={2}>
                    Rejected
                  </option>
                  <option key={'Cancelled'} value={3}>
                    Cancelled
                  </option>
                  <option key={'AutoCancelled'} value={4}>
                    Auto Cancelled
                  </option>
                </select>
              </div>
            </CCardHeader>
            <CCardBody>
              <MuiTable columns={columns} displayData={displayData} rowsPrPage={10} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <>
        {/* Cancel Confirmation */}
        <CCol sm={12}>
          <CModal
            size="lg"
            alignment="center"
            visible={cancelModel}
            onClose={() => {
              setCancelModel(false)
              setCancelRow({})
            }}
          >
            <CModalHeader>
              <CModalTitle>Cancel Confirmation</CModalTitle>
            </CModalHeader>
            <form onSubmit={cancelHandleSubmit(onCancel)}>
              <CModalBody>
                <p>Are you sure wants to cancel?</p>
                <FormControl fullWidth style={{ marginTop: 20 }}>
                  <TextareaAutosize
                    minRows={3}
                    placeholder="Cancel Reason"
                    fullWidth
                    name="cancelreason"
                    {...cancelRegister(`cancelreason`, {
                      required: 'Reason is required',
                    })}
                  />
                </FormControl>
                <p className="error font15">
                  {cancelerror &&
                    cancelerror['cancelreason'] &&
                    cancelerror['cancelreason']?.message}
                </p>
              </CModalBody>
              <CModalFooter>
                {!loading && (
                  <CButton
                    color="secondary"
                    onClick={() => {
                      setCancelModel(false)
                      setCancelRow({})
                    }}
                  >
                    Close
                  </CButton>
                )}
                <CButton color="primary" type="submit" disabled={loading}>
                  {loading ? 'Processing..' : 'Cancel'}
                </CButton>
              </CModalFooter>
            </form>
          </CModal>
        </CCol>

        {/* Reject Confirmation */}
        <CCol sm={12}>
          <CModal
            size="lg"
            alignment="center"
            visible={rejectModel}
            onClose={() => {
              setRejectModel(false)
              setRejectRow({})
            }}
          >
            <CModalHeader>
              <CModalTitle>Reject Confirmation</CModalTitle>
            </CModalHeader>
            <form onSubmit={handleSubmit(onReject)}>
              <CModalBody>
                <p>Are you sure wants to Reject?</p>
                <FormControl fullWidth style={{ marginTop: 20 }}>
                  <TextareaAutosize
                    minRows={3}
                    placeholder="Reject Reason"
                    fullWidth
                    name="rejectreason"
                    {...register(`rejectreason`, {
                      required: 'Reason is required',
                    })}
                  />
                </FormControl>
                <p className="error font15">
                  {errors && errors['rejectreason'] && errors['rejectreason']?.message}
                </p>
              </CModalBody>
              <CModalFooter>
                {!loading && (
                  <CButton
                    color="secondary"
                    onClick={() => {
                      setRejectModel(false)
                      setRejectRow({})
                    }}
                  >
                    Close
                  </CButton>
                )}
                <CButton color="primary" type="submit" disabled={loading}>
                  {loading ? 'Processing..' : 'Reject'}
                </CButton>
              </CModalFooter>
            </form>
          </CModal>
        </CCol>

        {/* View Appointment Details */}
        <CCol sm={12}>
          <CModal
            size="lg"
            alignment="center"
            visible={viewModel}
            onClose={() => {
              setViewModel(false)
              setViewRow({})
            }}
          >
            <CModalHeader>
              <CModalTitle>View Details</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <Table>
                <TableBody>
                  {(authState?.user?.role === 1 || authState?.user?.role === 2) && (
                    <TableRow>
                      <TableCell align="left">
                        <b>Client: </b>
                      </TableCell>
                      <TableCell align="left">{viewRow?.clientId?.name}</TableCell>
                    </TableRow>
                  )}
                  {(authState?.user?.role === 1 || authState?.user?.role === 3) && (
                    <TableRow>
                      <TableCell align="left">
                        <b>Appointee: </b>
                      </TableCell>
                      <TableCell align="left">{viewRow?.appointeeId?.name}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell align="left">
                      <b>Package: </b>
                    </TableCell>
                    <TableCell align="left">{viewRow?.packageId?.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">
                      <b>Description: </b>
                    </TableCell>
                    <TableCell align="left">{viewRow?.description}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">
                      <b>Schedule Date: </b>
                    </TableCell>
                    <TableCell align="left">
                      {moment(viewRow?.appointmentDate).format('DD-MM-YYYY')}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">
                      <b>Schedule Time: </b>
                    </TableCell>
                    <TableCell align="left">{viewRow?.appointmentTime}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">
                      <b>Status </b>
                    </TableCell>
                    <TableCell align="left">
                      {viewRow?.status === 1 ? (
                        <Chip label="Approved" color="success" />
                      ) : viewRow?.status === 2 ? (
                        <Chip label="Rejected" color="warning" />
                      ) : viewRow?.status === 3 ? (
                        <Chip label="Cancelled" color="error" />
                      ) : viewRow?.status === 4 ? (
                        <Chip label="Auto Cancelled" color="secondary" />
                      ) : (
                        <Chip label="Pending" color="primary" />
                      )}
                    </TableCell>
                  </TableRow>
                  {viewRow?.approvedBy?.name && (
                    <TableRow>
                      <TableCell align="left">
                        <b>Approved By : </b>
                      </TableCell>
                      <TableCell align="left">{viewRow?.approvedBy?.name}</TableCell>
                    </TableRow>
                  )}
                  {viewRow?.rejectedBy?.name && (
                    <TableRow>
                      <TableCell align="left">
                        <b>Rejected By : </b>
                      </TableCell>
                      <TableCell align="left">{viewRow?.rejectedBy?.name}</TableCell>
                    </TableRow>
                  )}
                  {viewRow?.rejectReason && (
                    <TableRow>
                      <TableCell align="left">
                        <b>Reject Reason: </b>
                      </TableCell>
                      <TableCell align="left">{viewRow?.rejectReason}</TableCell>
                    </TableRow>
                  )}
                  {viewRow?.cancelledBy?.name && (
                    <TableRow>
                      <TableCell align="left">
                        <b>Cancelled By : </b>
                      </TableCell>
                      <TableCell align="left">{viewRow?.cancelledBy?.name}</TableCell>
                    </TableRow>
                  )}
                  {viewRow?.cancelReason && (
                    <TableRow>
                      <TableCell align="left">
                        <b>Cancelled Reason: </b>
                      </TableCell>
                      <TableCell align="left">{viewRow?.cancelReason}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell align="left">
                      <b>Created At: </b>
                    </TableCell>
                    <TableCell align="left">
                      {moment(viewRow?.createdAt).format('DD-MM-YYYY HH:mm a')}
                    </TableCell>
                  </TableRow>
                  {viewRow?.updatedAt && (
                    <TableRow>
                      <TableCell align="left">
                        <b>Updated At: </b>
                      </TableCell>
                      <TableCell align="left">
                        {moment(viewRow?.updatedAt).format('DD-MM-YYYY HH:mm a')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CModalBody>
            <CModalFooter>
              <CButton
                color="secondary"
                onClick={() => {
                  setViewModel(false)
                  setViewRow({})
                }}
              >
                Close
              </CButton>
            </CModalFooter>
          </CModal>
        </CCol>
      </>
    </>
  )
}

export default AppointmentList
