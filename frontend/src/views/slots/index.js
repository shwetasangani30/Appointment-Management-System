import React, { useCallback, useContext, useEffect, useState } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { Checkbox, FormControl, FormControlLabel, TextField } from '@mui/material'
import { useForm } from 'react-hook-form'
import { cilPlus, cilMinus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import moment from 'moment'
import dayjs from 'dayjs'
import axios from 'src/components/AxiosConfig'
import { SlotsContext } from 'src/context/slots.context'
import { toast } from 'react-hot-toast'

const Slots = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
    unregister,
  } = useForm({ mode: 'onChange' })

  const { dispatch } = useContext(SlotsContext)
  const [timeGap, setTimeGap] = useState(30)
  const currentDate = moment().format('YYYY-MM-DD')

  const [dayWiseTime, setDayWiseTime] = useState([
    {
      day: 'Monday',
      isHoliday: false,
      slots: [
        {
          startTime: null,
          endTime: null,
        },
      ],
      timeGap: 30,
    },
    {
      day: 'Tuesday',
      isHoliday: false,
      slots: [
        {
          startTime: null,
          endTime: null,
        },
      ],
      timeGap: 30,
    },
    {
      day: 'Wednesday',
      isHoliday: false,
      slots: [
        {
          startTime: null,
          endTime: null,
        },
      ],
      timeGap: 30,
    },
    {
      day: 'Thursday',
      isHoliday: false,
      slots: [
        {
          startTime: null,
          endTime: null,
        },
      ],
      timeGap: 30,
    },
    {
      day: 'Friday',
      isHoliday: false,
      slots: [
        {
          startTime: null,
          endTime: null,
        },
      ],
      timeGap: 30,
    },
    {
      day: 'Saturday',
      isHoliday: false,
      slots: [
        {
          startTime: null,
          endTime: null,
        },
      ],
      timeGap: 30,
    },
    {
      day: 'Sunday',
      isHoliday: false,
      slots: [
        {
          startTime: null,
          endTime: null,
        },
      ],
      timeGap: 30,
    },
  ])

  const getSlots = useCallback(async () => {
    clearErrors()
    try {
      const res = await axios.get('getbyUser/slot')
      let response = res?.data?.data
      if (res?.data?.status === 200 && response?.length > 0) {
        const filtered = response?.map((day) => {
          return {
            day: day?.day,
            isHoliday: day?.isHoliday,
            slots: day?.slots,
            timeGap: day?.timeGap,
          }
        })
        dispatch({
          type: 'GET',
          payload: { slotdata: filtered },
        })

        setDayWiseTime(filtered)
        setTimeGap(filtered[0]?.timeGap)
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong',
      )
    }
  }, [clearErrors, dispatch])

  const onSubmit = async (data) => {
    const request = dayWiseTime?.map((day) => {
      return { ...day, timeGap: timeGap }
    })

    try {
      const res = await axios.post('addUpdate/slot', request)
      if (res?.data?.status === 200) {
        toast.success(res?.data?.message)
        getSlots()
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong',
      )
    }
    clearErrors()
  }

  useEffect(() => {
    dayWiseTime?.map((day) => {
      return day?.slots?.map((value, i) => {
        if (day?.isHoliday === false) {
          if (value?.startTime) {
            setValue(`${day?.day}.startTime.${i}`, currentDate + ' ' + value?.startTime, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          if (value?.endTime) {
            setValue(`${day?.day}.endTime.${i}`, currentDate + ' ' + value?.endTime, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
        } else {
          unregister(`${day?.day}.startTime.${i}`)
          unregister(`${day?.day}.endTime.${i}`)
        }
        return true
      })
    })
    clearErrors()
  }, [clearErrors, currentDate, dayWiseTime, setValue, unregister])

  useEffect(() => {
    getSlots()
  }, [getSlots])

  const holidayChange = (checked, index) => {
    clearErrors()
    if (checked) {
      dayWiseTime[index] = {
        ...dayWiseTime[index],
        slots: [
          {
            startTime: null,
            endTime: null,
          },
        ],
        isHoliday: checked,
      }
    } else {
      dayWiseTime[index] = { ...dayWiseTime[index], isHoliday: checked }
    }
    setDayWiseTime([...dayWiseTime])
  }

  const addSlot = (index) => {
    clearErrors()
    dayWiseTime[index] = {
      ...dayWiseTime[index],
      slots: [
        ...dayWiseTime[index]?.slots,
        {
          startTime: null,
          endTime: null,
        },
      ],
    }
    setDayWiseTime([...dayWiseTime])
  }

  const removeSlot = (i, index) => {
    clearErrors()
    let day = dayWiseTime[index]
    let slots = day?.slots
    slots.splice(i, 1)
    dayWiseTime[index] = {
      ...dayWiseTime[index],
      slots: [...slots],
    }
    unregister(`${day?.day}.startTime.${i}`)
    unregister(`${day?.day}.endTime.${i}`)
    setDayWiseTime([...dayWiseTime])
  }

  const handleTimeChange = (newValue, i, index, name) => {
    var hours = parseInt(dayjs(newValue).format('hh'))
    if (dayjs(newValue).format('a') === 'pm') {
      hours = parseInt(hours + 12)
    }
    let saveValue = hours + ':' + dayjs(newValue).format('mm')
    let slotsv = dayWiseTime[index]?.slots
    slotsv[i] = { ...dayWiseTime[index]?.slots[i], [name]: saveValue }
    dayWiseTime[index] = {
      ...dayWiseTime[index],
      slots: slotsv,
    }
    setDayWiseTime([...dayWiseTime])
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Slots</strong>
          </CCardHeader>
          <CCardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <>
                  <div className="mr5 col-sm-6 col-md-6">
                    <TextField
                      autoFocus
                      value={timeGap}
                      name={`timeGap`}
                      type="number"
                      label="Time Gap between slots"
                      variant="filled"
                      helperText="In minutes"
                      {...register(`timeGap`, {
                        required: 'Time Gap is required',
                        min: { value: 1, message: 'Mininum value should be 1' },
                        max: { value: 60, message: 'Maximun value should be 60' },
                      })}
                      onChange={(e) => setTimeGap(e.target.value)}
                    />
                    <p className="error font15">
                      {errors &&
                        errors['timeGap'] &&
                        errors['timeGap'] &&
                        errors['timeGap'].message}
                    </p>
                  </div>
                  {dayWiseTime?.map((day, index) => {
                    return (
                      <>
                        <div className="col-sm-12 col-md-12" key={`main${index}`}>
                          <div className="col-sm-3 col-md-3" style={{ display: 'flex' }}>
                            <label className="flexAlign">{day?.day}</label>
                            <FormControlLabel
                              name="isHoliday"
                              checked={day?.isHoliday}
                              label="Holiday"
                              onChange={(e) => holidayChange(e?.target?.checked, index)}
                              control={<Checkbox />}
                              style={{ paddingLeft: 20 }}
                            />
                          </div>
                          {!day?.isHoliday &&
                            day?.slots?.map((item, i) => {
                              return (
                                <>
                                  <div style={{ display: 'flex' }}>
                                    <div className="mr5 col-sm-5 col-md-5">
                                      <TimePicker
                                        name={`${day?.day}.startTime.${i}`}
                                        ampm={false}
                                        key={i}
                                        autoOk
                                        fullWidth
                                        label="Start Time"
                                        views={['hours', 'minutes']}
                                        value={
                                          item?.startTime && currentDate + ' ' + item?.startTime
                                        }
                                        onChange={(newValue) => {
                                          setValue(`${day?.day}.startTime.${i}`, newValue, {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                          })
                                          handleTimeChange(newValue, i, index, 'startTime')
                                        }}
                                        inputFormat="hh:mm"
                                        mask="__:__"
                                        renderInput={(params) => (
                                          <TextField
                                            autoFocus
                                            {...register(`${day?.day}.startTime.${i}`, {
                                              required: day?.isHoliday ? false : true,
                                            })}
                                            {...params}
                                            variant="filled"
                                          />
                                        )}
                                      />

                                      <p className="error font15">
                                        {errors &&
                                          errors[day?.day] &&
                                          errors[day?.day]['startTime'] &&
                                          errors[day?.day]['startTime'][i] &&
                                          'Start time is required'}
                                      </p>
                                    </div>
                                    <div className="mr5 col-sm-5 col-md-5">
                                      <TimePicker
                                        name={`${day?.day}.endTime.${i}`}
                                        ampm={false}
                                        key={i}
                                        autoOk
                                        fullWidth
                                        label="End Time"
                                        views={['hours', 'minutes']}
                                        value={item?.endTime && currentDate + ' ' + item?.endTime}
                                        onChange={(newValue) => {
                                          setValue(`${day?.day}.endTime.${i}`, newValue, {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                          })
                                          handleTimeChange(newValue, i, index, 'endTime')
                                        }}
                                        inputFormat="hh:mm"
                                        mask="__:__"
                                        renderInput={(params) => (
                                          <TextField
                                            autoFocus
                                            {...register(`${day?.day}.endTime.${i}`, {
                                              required: day?.isHoliday ? false : true,
                                            })}
                                            {...params}
                                            variant="filled"
                                          />
                                        )}
                                      />
                                      <p className="error font15">
                                        {errors &&
                                          errors[day?.day] &&
                                          errors[day?.day]['endTime'] &&
                                          errors[day?.day]['endTime'][i] &&
                                          'End time is required'}
                                      </p>
                                    </div>
                                    <div className="mr5 col-sm-2 col-md-2">
                                      {i === 0 ? (
                                        <CIcon
                                          className="plusIcon"
                                          icon={cilPlus}
                                          size="xl"
                                          onClick={() => addSlot(index)}
                                        />
                                      ) : (
                                        <CIcon
                                          className="minusIcon"
                                          icon={cilMinus}
                                          size="xl"
                                          onClick={() => removeSlot(i, index)}
                                        />
                                      )}
                                    </div>
                                  </div>
                                </>
                              )
                            })}
                        </div>
                        <hr />
                      </>
                    )
                  })}
                </>
              </LocalizationProvider>
              <div style={{ textAlign: 'center' }}>
                <FormControl style={{ marginTop: 20, width: 200 }}>
                  <CButton color="primary" type="submit">
                    Save
                  </CButton>
                </FormControl>
              </div>
            </form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
export default Slots
