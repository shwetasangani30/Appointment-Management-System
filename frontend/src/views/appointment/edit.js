import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextareaAutosize,
  TextField,
} from '@mui/material'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import moment from 'moment'
import React, { useCallback, useContext, useLayoutEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'src/components/AxiosConfig'
import { AppointmentContext } from 'src/context/appointment.context'
import { AuthContext } from 'src/context/auth.context'
import { SlotsContext } from 'src/context/slots.context'
import { v4 as uuidv4 } from 'uuid'

const EditAppointment = () => {
  const ITEM_HEIGHT = 48
  const ITEM_PADDING_TOP = 8
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  }

  const navigate = useNavigate()
  const [timeSlotCount, setTimeSlotCount] = useState(4)
  const [currentMaxTimeSlots, setCurrentMaxTimeSlots] = useState(0)
  const [daySlotArr, setDaySlotArr] = useState([])
  const [startSlotDate, setStartSlotDate] = useState(new Date())
  const [formData, setFormData] = useState({
    appointee: '',
    package: '',
    description: '',
    slot: { date: null, time: null },
  })
  const { state: slots, dispatch: slotsDispatch } = useContext(SlotsContext)
  const { state: appoinments, dispatch: appoinmentDispatch } = useContext(AppointmentContext)
  const { state: authState } = useContext(AuthContext)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ mode: 'onChange' })

  const currentDate = new Date()

  const { id: appoinmentEditId } = useParams()

  const makeTimeIntervals = function (startTime, endTime, increment, date) {
    startTime = startTime.toString().split(':')
    endTime = endTime.toString().split(':')
    increment = parseInt(increment, 10)

    var pad = function (n) {
        return n < 10 ? '0' + n.toString() : n
      },
      startHr = parseInt(startTime[0], 10),
      startMin = parseInt(startTime[1], 10),
      endHr = parseInt(endTime[0], 10),
      currentHr = startHr,
      currentMin = startMin,
      previous = currentHr + ':' + pad(currentMin),
      current = '',
      r = []

    do {
      currentMin += increment
      if (currentMin % 60 === 0 || currentMin > 60) {
        currentMin = currentMin === 60 ? 0 : currentMin - 60
        currentHr += 1
      }
      current = currentHr + ':' + pad(currentMin)
      let currenttime = previous + '-' + current
      let checkBooked = appoinments?.pendingApproved?.filter((appoinment) => {
        return (
          moment(appoinment?.appointmentDate)?.format('YYYY-MM-DD') === date &&
          appoinment?.appointmentTime === currenttime
        )
      })
      let fromTime = moment(previous, 'HH:mm')
      let pushable = {
        uuid: uuidv4(),
        from: previous,
        to: current,
        isAvailable: checkBooked?.length > 0 ? 0 : 1,
        isSelected: 0,
        isBooked: checkBooked?.length > 0 ? 1 : 0,
        isDisable:
          moment().isSameOrAfter(fromTime) && moment()?.format('YYYY-MM-DD') === date ? 1 : 0,
      }
      r.push(pushable)
      previous = current
    } while (currentHr !== endHr)

    return r
  }

  const handleShowMore = () => {
    setTimeSlotCount((prevState) => prevState + 5)
  }

  const AppointeeChange = useCallback(
    async (id, slotDate) => {
      setFormData({ ...formData, appointee: id })
      try {
        var res = await axios.post('/getSlotByAppointee/slot', { user_id: id })
        let response = res?.data?.data
        if (res?.data?.status === 200) {
          slotsDispatch({
            type: 'APPOINTEE_SLOTS',
            payload: { appointeeSlots: response },
          })
        }

        var bookedSlotsRes = await axios.post('/getPendingApprovedByDate/appointment', {
          appointeeId: id,
          status: [0, 1],
          appointmentDate: moment(slotDate).format('YYYY-MM-DD HH:mm'),
        })
        let bookedSlotsResponse = bookedSlotsRes?.data?.data
        if (bookedSlotsRes?.data?.status === 200) {
          appoinmentDispatch({
            type: 'PENDING_APPROVED',
            payload: { pendingApproved: bookedSlotsResponse },
          })
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong',
        )
      }
    },
    [appoinmentDispatch, formData, slotsDispatch],
  )

  const getAppointment = useCallback(
    async (appoinmentEditId) => {
      try {
        const res = await axios.get('/appointment/' + appoinmentEditId)
        let response = res?.data?.data
        if (res?.data?.status === 200) {
          var mainDate = new Date(response?.appointmentDate)
          var currentDate = new Date()
          var diffDay = Math.ceil(
            (mainDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24),
          )

          if (
            ((response?.status !== 0 && authState?.user?.role === 2) ||
              (response?.status === 0 && authState?.user?.role === 3)) &&
            (diffDay < 0 ||
              (diffDay === -0 &&
                moment().isSameOrAfter(moment(response?.appointmentTime?.split('-')[0], 'HH:mm'))))
          ) {
            toast.error('You can not edit this appointment.')
            navigate('/appointments')
          }

          appoinmentDispatch({
            type: 'APPOINTMENT',
            payload: { appointment: response },
          })
          AppointeeChange(response?.appointeeId?._id, response?.appointmentDate)
          setStartSlotDate(new Date(response?.appointmentDate))
          setValue('description', response?.description)
          setFormData({
            ...formData,
            appointee: response?.appointeeId?._id,
            package: response?.packageId?._id,
            description: response?.description,
            slot: {
              date: moment(response?.appointmentDate)?.format('YYYY-MM-DD'),
              time: response?.appointmentTime,
            },
          })
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong',
        )
      }
    },
    [appoinmentDispatch],
  )

  const handleSlotSelection = (uuid, day, isBooked, isSelected, isDisable) => {
    const selected = daySlotArr?.find((value) =>
      value?.timeslot?.find((val) => val?.isSelected === 1),
    )
    let checkDeselect = selected?.timeslot?.find(
      (val) => val?.uuid === uuid && val?.isSelected === 1,
    )

    if (isBooked && !isSelected) {
      return false
    }
    if (selected === undefined || checkDeselect) {
      const findIndex = daySlotArr?.findIndex((value) => value?.day === day)
      const findSlotIndex = daySlotArr[findIndex]?.timeslot?.findIndex(
        (value) => value?.uuid === uuid,
      )
      let timeslot = daySlotArr[findIndex]?.timeslot
      timeslot[findSlotIndex] = {
        ...timeslot[findSlotIndex],
        isSelected: timeslot[findSlotIndex]?.isSelected === 1 ? 0 : 1,
        isAvailable: timeslot[findSlotIndex]?.isSelected === 1 ? 1 : 0,
        isBooked: timeslot[findSlotIndex]?.isSelected === 1 ? 0 : 1,
        isDisable: timeslot[findSlotIndex]?.isSelected === 1 ? 0 : isDisable,
      }
      daySlotArr[findIndex] = { ...daySlotArr[findIndex], timeslot: [...timeslot] }
      setDaySlotArr([...daySlotArr])
      if (checkDeselect === undefined) {
        setFormData({
          ...formData,
          slot: {
            date: timeslot[findSlotIndex]?.isSelected === 1 ? daySlotArr[findIndex]?.date : null,
            time:
              timeslot[findSlotIndex]?.isSelected === 1
                ? timeslot[findSlotIndex]?.from + '-' + timeslot[findSlotIndex]?.to
                : null,
          },
        })
      } else {
        setFormData({
          ...formData,
          slot: {
            date: null,
            time: null,
          },
        })
      }
    } else {
      toast.error(
        'You can not select another slot. You have to remove selected slot then you can select another slot.',
      )
    }
  }

  const onSubmit = async (data) => {
    if (formData?.slot?.date && formData?.slot?.time) {
      let request = {
        ...formData,
        slot: {
          date: new Date(formData?.slot?.date),
          time: formData?.slot?.time,
        },
        id: appoinmentEditId,
      }
      try {
        var res = await axios.post('/update/appointment', request)
        if (res?.data?.status === 200) {
          navigate('/appointments')
          toast.success(res?.data?.message)
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong',
        )
      }
    } else {
      toast.error('Please select any one slot to book this appointment.')
    }
  }

  useLayoutEffect(() => {
    getAppointment(appoinmentEditId)
  }, [appoinmentEditId, getAppointment])

  useLayoutEffect(() => {
    let arr = []
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    if (slots?.appointeeSlots?.length > 0 && startSlotDate) {
      for (var i = 0; i < 7; i++) {
        let pushableDate = moment(startSlotDate, 'DD-MM-YYYY').add(i, 'days')
        let date = pushableDate?.format('YYYY-MM-DD')
        let day = weekday[pushableDate?.day()]

        let findSlot = slots?.appointeeSlots?.find((slotDay) => slotDay?.day === day)
        let chunkArr = []
        if (findSlot && findSlot?.isHoliday === false) {
          findSlot?.slots?.map((obj, o) => {
            let chunks = makeTimeIntervals(obj?.startTime, obj?.endTime, findSlot?.timeGap, date)
            chunkArr = chunkArr.concat(chunks)
            return chunkArr
          })
        }
        if (currentMaxTimeSlots < chunkArr?.length) {
          setCurrentMaxTimeSlots(chunkArr?.length)
        }
        arr.push({ date: date, day: day, timeslot: chunkArr })
      }
      let date = formData?.slot?.date
      let time = formData?.slot?.time
      const findIndex = arr?.findIndex((value) => value?.date === date)
      const findSlotIndex = arr[findIndex]?.timeslot?.findIndex(
        (value) => value?.from + '-' + value?.to === time,
      )
      if (findSlotIndex >= 0 && findIndex >= 0) {
        let timeslot = arr[findIndex]?.timeslot
        timeslot[findSlotIndex] = {
          ...timeslot[findSlotIndex],
          isSelected: timeslot[findSlotIndex]?.isSelected === 1 ? 0 : 1,
          isAvailable: timeslot[findSlotIndex]?.isSelected === 1 ? 1 : 0,
          isBooked: timeslot[findSlotIndex]?.isSelected === 1 ? 0 : 1,
          isDisable: timeslot[findSlotIndex]?.isSelected === 1 ? 0 : 1,
        }
        arr[findIndex] = { ...arr[findIndex], timeslot: [...timeslot] }
      }
      setDaySlotArr(arr)
    }
  }, [slots?.appointeeSlots, startSlotDate, appoinments?.pendingApproved])

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Edit Appointment</strong>
          </CCardHeader>
          <CCardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth>
                <InputLabel id="demo-multiple-name-label" shrink={true}>
                  Appointee
                </InputLabel>
                <Select
                  disabled
                  name="appointee"
                  variant="standard"
                  fullWidth
                  input={<OutlinedInput label="Appointee" />}
                  MenuProps={MenuProps}
                  value={1}
                >
                  <MenuItem key={1} value={1}>
                    {appoinments?.appointment?.appointeeId?.name}
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginTop: 20 }}>
                <InputLabel id="demo-multiple-name-label" shrink={true}>
                  Package
                </InputLabel>
                <Select
                  disabled
                  name="package"
                  variant="standard"
                  fullWidth
                  input={<OutlinedInput label="Package" />}
                  MenuProps={MenuProps}
                  value={1}
                >
                  <MenuItem key={1} value={1}>
                    {appoinments?.appointment?.packageId?.name}
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginTop: 20 }}>
                <TextareaAutosize
                  minRows={3}
                  placeholder="Description"
                  name="description"
                  onChange={(e) => {
                    setValue(`description`, e?.target?.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                    setFormData({ ...formData, description: e.target.value })
                  }}
                  value={formData?.description ? formData?.description : ''}
                  inputref={register(`description`, {
                    required: 'Please select description',
                  })}
                />
              </FormControl>
              <p className="error font15">
                {errors && errors['description'] && errors['description']?.message}
              </p>

              {formData?.appointee && daySlotArr?.length > 0 && (
                <>
                  <div style={{ textAlign: 'center' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <FormControl style={{ marginTop: 20, width: '50%' }}>
                        <DesktopDatePicker
                          minDate={
                            appoinments?.appointment?.appointmentDate
                              ? new Date(appoinments?.appointment?.appointmentDate)
                              : startSlotDate
                          }
                          maxDate={currentDate.setDate(currentDate.getDate() + 30)}
                          label="Select Date for next week"
                          inputFormat="DD/MM/YYYY"
                          renderInput={(params) => <TextField {...params} />}
                          onChange={(newValue) => setStartSlotDate(new Date(newValue))}
                          value={startSlotDate}
                        />
                      </FormControl>
                    </LocalizationProvider>
                  </div>
                  <div className="slotPart">
                    {daySlotArr?.map(({ date, day, timeslot }, daySlotIndex) => {
                      return (
                        <div className="slot-inner-part" key={daySlotIndex}>
                          <div className="slotDaysPart">
                            <span className="slotDays">{day}</span>
                            <span className="slotDays">{new Date(date).getDate()}</span>
                          </div>
                          {timeslot.length === 0 && (
                            <div className="slotTimeBoard isDisabledColor">
                              <span className="timeSlot">Holiday</span>
                            </div>
                          )}

                          {timeslot
                            ?.slice(0, timeSlotCount)
                            ?.map(
                              ({
                                from,
                                to,
                                uuid,
                                isAvailable,
                                isSelected,
                                isBooked,
                                isDisable,
                              }) => {
                                var oldTime = false
                                var mainDate = new Date(date)
                                var currentDate = new Date()
                                var diffDay = Math.ceil(
                                  (currentDate.getTime() - mainDate.getTime()) /
                                    (1000 * 60 * 60 * 24),
                                )
                                if (diffDay > 0) {
                                  let fromTime = moment(from, 'HH:mm')
                                  oldTime = moment().isSameOrAfter(fromTime)
                                }
                                let disableReplace = isDisable
                                if (disableReplace) {
                                  disableReplace = isSelected === 1 ? 0 : 1
                                }
                                return (
                                  <div
                                    className={`slotTimeBoard ${
                                      oldTime || disableReplace
                                        ? `isDisabledColor`
                                        : isAvailable === 1
                                        ? ` isUserSlot `
                                        : isSelected === 1
                                        ? 'isSelected'
                                        : isBooked === 1
                                        ? 'isBookedColor'
                                        : 'isDisabledColor '
                                    }`}
                                    key={uuid}
                                    onClick={() =>
                                      handleSlotSelection(
                                        uuid,
                                        day,
                                        isBooked,
                                        isSelected,
                                        isDisable,
                                      )
                                    }
                                  >
                                    <span className="timeSlot">{from}</span> -
                                    <span className="timeSlot">{to}</span>
                                  </div>
                                )
                              },
                            )}
                        </div>
                      )
                    })}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    {currentMaxTimeSlots >= timeSlotCount && (
                      <div className="ShowMore" onClick={handleShowMore}>
                        Show more
                      </div>
                    )}
                  </div>
                </>
              )}
              <CRow>
                <div style={{ textAlign: 'right' }} className="col-sm-6">
                  <FormControl style={{ marginTop: 20, width: 200 }}>
                    <CButton color="danger" type="button" onClick={() => navigate('/appointments')}>
                      Cancel
                    </CButton>
                  </FormControl>
                </div>
                <div style={{ textAlign: 'left' }} className="col-sm-6">
                  <FormControl style={{ marginTop: 20, width: 200 }}>
                    <CButton color="primary" type="submit">
                      Submit
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

export default EditAppointment
