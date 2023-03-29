import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CInputGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import SendIcon from '@mui/icons-material/Send'
import { Chip, IconButton, Tooltip } from '@mui/material'
import socket from 'src/components/socket'
import { AuthContext } from 'src/context/auth.context'
import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import axios from 'src/components/AxiosConfig'
import { AppointeeContext } from 'src/context/appointee.context'
import { ClientsContext } from 'src/context/clients.context'
import { toast } from 'react-hot-toast'

const Support = () => {
  const [visible, setVisible] = useState(false)
  const [chatList, setChatList] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [badge, setBadge] = useState([])
  const [messagesAll, setMessagesAll] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [openUserNewMsg, setOpenUserNewMsg] = useState(null)
  const { state: authUser } = useContext(AuthContext)
  const { state: appointee, dispatch: appointeeDispatch } = useContext(AppointeeContext)
  const { state: client, dispatch: clientDispatch } = useContext(ClientsContext)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: 'onChange' })

  const getAllAppointee = useCallback(async () => {
    try {
      const res = await axios.get('getAll/appointee/')
      let response = res?.data?.data
      if (res?.data?.status === 200) {
        appointeeDispatch({
          type: 'LIST',
          payload: { appointeelist: response },
        })
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong',
      )
    }
  }, [appointeeDispatch])

  const getMessages = useCallback(
    async (receiver_id, selectedUserChat) => {
      try {
        let request = {
          sender_id: authUser?.user?._id,
          receiver_id: receiver_id,
        }
        const res = await axios.post('/getMessages', request)
        const response = res?.data?.data
        if (res?.data?.status === 200) {
          let finalArr = []
          response?.map((resp) => {
            let obj = {
              toUser: resp?.receiver_id,
              userData: resp?.sender_id,
              message: resp?.message,
              createdAt: resp?.createdAt,
            }
            finalArr.push(obj)
            return finalArr
          })
          setMessagesAll({
            ...messagesAll,
            [selectedUserChat]: finalArr,
          })
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong',
        )
      }
    },
    [authUser?.user?._id],
  )

  const getChats = useCallback(async () => {
    try {
      const res = await axios.get('/getChats')
      const response = res?.data?.data
      if (res?.data?.status === 200) {
        let finalArr = []
        response?.map((mess) => {
          finalArr.push(mess?.sender_id, mess?.receiver_id)
          return finalArr
        })
        const arrayUniqueByKey = [...new Map(finalArr.map((item) => [item['_id'], item])).values()]
        const filtered = arrayUniqueByKey?.filter((arr) => arr._id !== authUser?.user?._id)
        if (filtered?.length > 0) {
          setChatList(filtered)
        }
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong',
      )
    }
  }, [])

  const getAllClients = useCallback(async () => {
    try {
      const res = await axios.get('getAll/client/')
      let response = res?.data?.data
      if (res?.data?.status === 200) {
        clientDispatch({
          type: 'LIST',
          payload: { clientlist: response },
        })
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong',
      )
    }
  }, [clientDispatch])

  useEffect(() => {
    getChats()
    let userData = authUser?.user
    delete userData?.token
    let room = 'chatroom'
    socket.emit('join', { userData, room })

    socket.on('message', ({ AllMessages, messageData }) => {
      if (messageData?.toUser?._id === userData?._id) {
        setMessagesAll((messagesAll) => {
          return { ...messagesAll, ...AllMessages }
        })
      }
    })

    socket.on('receiveBadge', ({ AllBadge, messageData }) => {
      if (messageData?.toUser?._id === userData?._id) {
        setBadge((badge) => {
          return { ...badge, ...AllBadge }
        })
        setOpenUserNewMsg(messageData)
      }
    })

    socket.on('receiveBadgeClient', ({ AllBadge, user_id }) => {
      if (user_id === userData?._id) {
        setBadge((badge) => {
          return { ...badge, ...AllBadge }
        })
      }
    })
  }, [])

  useEffect(() => {
    var supportMain = document.getElementById('support_main')
    supportMain && (supportMain.scrollTop = supportMain?.scrollHeight)
  }, [messagesAll])

  useEffect(() => {
    if (selectedUser?._id) {
      let userData = authUser?.user
      let selectedUserChat = ''
      if (userData?.role === 3) {
        selectedUserChat = `${userData?._id}-${selectedUser?._id}`
      } else {
        selectedUserChat = `${selectedUser?._id}-${userData?._id}`
      }
      setSelectedChat(selectedUserChat)
      getMessages(selectedUser?._id, selectedUserChat)
    }
  }, [getMessages, selectedUser])

  useEffect(() => {
    if (selectedUser?._id && openUserNewMsg) {
      let selectedUserChat = `${authUser?.user?._id}-${selectedUser?._id}`
      let findUser = Object.keys(badge).find((key) => key === selectedUserChat)

      if (findUser) {
        setTimeout(() => {
          setBadge((badge) => {
            return {
              ...badge,
              [findUser]: 0,
            }
          })
          socket.emit('resetBadgeServer', {
            AllBadge: {
              ...badge,
              [findUser]: 0,
            },
            user_id: selectedUser?._id,
          })
        }, 100)
      }
    }
    return () => {
      setOpenUserNewMsg(null)
    }
  }, [openUserNewMsg])

  const onSubmit = async ({ message }) => {
    let userData = authUser?.user
    delete userData?.token
    let currentDate = new Date()
    let messageData = {
      toUser: selectedUser,
      userData,
      message,
      createdAt: currentDate,
    }

    try {
      let request = {
        receiver_id: selectedUser?._id,
        message: messageData?.message,
        createdAt: currentDate,
      }
      const res = await axios.post('add/message', request)
      if (res?.data?.status === 200) {
        let selectedUserChat = ''
        if (userData?.role === 3) {
          selectedUserChat = `${userData?._id}-${selectedUser?._id}`
        } else {
          selectedUserChat = `${selectedUser?._id}-${userData?._id}`
        }

        let sendMsgtoSelected = `${selectedUser?._id}-${userData?._id}`
        socket.emit('sendMessage', {
          AllMessages: {
            ...messagesAll,
            [selectedUserChat]: [...messagesAll[selectedUserChat], messageData],
          },
          messageData,
        })
        socket.emit('sendBadge', {
          AllBadge: {
            ...badge,
            [sendMsgtoSelected]: parseInt(
              (badge[sendMsgtoSelected] ? badge[sendMsgtoSelected] : 0) + 1,
            ),
          },
          messageData,
        })
        setMessagesAll((messagesAll) => {
          return {
            ...messagesAll,
            [selectedUserChat]: [...messagesAll[selectedUserChat], messageData],
          }
        })
        setBadge((badge) => {
          return {
            ...badge,
            [sendMsgtoSelected]: parseInt(
              (badge[sendMsgtoSelected] ? badge[sendMsgtoSelected] : 0) + 1,
            ),
          }
        })
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong',
      )
    }
    setValue('message', '')
  }

  const handleClick = (appointee) => {
    if (selectedUser?._id !== appointee?._id) {
      let checkExist = chatList?.find((value) => value?._id === appointee?._id)
      if (!checkExist) {
        setChatList([...chatList, appointee])
      }
      setSelectedUser(appointee)
    }
    setVisible(false)
  }

  const handleUserClick = (user) => {
    setSelectedUser(user)
    let selectedUserChat = `${authUser?.user?._id}-${user?._id}`
    let findUser = Object.keys(badge).find((key) => key === selectedUserChat)
    if (findUser) {
      setBadge((badge) => {
        return {
          ...badge,
          [findUser]: 0,
        }
      })
      socket.emit('resetBadgeServer', {
        AllBadge: {
          ...badge,
          [findUser]: 0,
        },
      })
    }
  }

  const formatDate = (dateTime) => {
    var months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    var dt = new Date(dateTime),
      date = dt.getDate(),
      month = months[dt.getMonth()],
      diffDays = new Date().getDate() - date,
      diffMonths = new Date().getMonth() - dt.getMonth(),
      diffYears = new Date().getFullYear() - dt.getFullYear()

    let time =
      String(dt.getHours()).padStart(2, '0') + ':' + String(dt.getMinutes()).padStart(2, '0')
    if (diffYears === 0 && diffDays === 0 && diffMonths === 0) {
      return `${time}`
    } else if (diffYears === 0 && diffDays === 1) {
      return `Yesterday ${time}`
    } else if (diffYears >= 1) {
      return `${month} ${date}, ${new Date(dateTime).getFullYear()}`
    } else {
      return `${month} ${date} ${time}`
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Support</strong>
          </CCardHeader>
          <CCardBody>
            <div className="flex">
              <div className="supportSidebar">
                <ul>
                  {chatList?.map((chatL, i) => {
                    let labelId = `${authUser?.user?._id}-${chatL?._id}`

                    return (
                      <>
                        <li
                          style={{ background: selectedUser?._id === chatL?._id && '#ffffff0d' }}
                          className="liSupport"
                          key={`chat${i}`}
                          onClick={() => handleUserClick(chatL)}
                        >
                          {chatL?.name}
                          {parseInt(badge?.[labelId]) > 0 && (
                            <Chip
                              style={{ marginLeft: 5, float: 'right' }}
                              label={badge?.[labelId]}
                              size="small"
                              color="success"
                            />
                          )}
                        </li>
                        <hr style={{ margin: '-18px 0px 0px -40px' }} />
                      </>
                    )
                  })}
                </ul>
                <CButton
                  className="btn-sm"
                  color="warning"
                  onClick={() => {
                    if (authUser?.user?.role === 3) {
                      getAllAppointee()
                    } else {
                      getAllClients()
                    }
                    setVisible(true)
                  }}
                >
                  <CIcon icon={cilPlus} className="me-2" />
                  New {authUser?.user?.role === 3 ? 'Appointee' : 'Client'}
                </CButton>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="supportForm">
                {selectedUser?.name && (
                  <div>
                    <div className="support_header">{selectedUser?.name}</div>
                    <div className="support_main" id="support_main">
                      {messagesAll?.[selectedChat]?.map((mess, i) => {
                        return (
                          <div style={{ marginTop: i === 0 ? 10 : 0 }} key={`mes${i}`}>
                            <div
                              className={
                                mess?.userData?._id === authUser?.user?._id
                                  ? 'messageRight'
                                  : 'messageLeft'
                              }
                            >
                              <p className="mb-1">
                                <span className="message_name">{mess?.userData?.name}</span>
                                <span className="message_meta">
                                  {/* {mess?.createdAt && moment(mess?.createdAt)?.format('HH:mm')} */}
                                  {mess?.createdAt && formatDate(mess?.createdAt)}
                                </span>
                              </p>
                              <p className="mb-1">{mess?.message}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="compose">
                      <CInputGroup>
                        <input
                          className="form-control col-sm-10"
                          placeholder="Type your message"
                          type="message"
                          name="message"
                          autoComplete="Message"
                          autoFocus
                          {...register('message', {
                            required: 'Message is required.',
                          })}
                        />
                      </CInputGroup>
                      <Tooltip title="Send">
                        <IconButton aria-label="Send" color="default" type="submit">
                          <SendIcon fontSize="large" />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <p className="error font15 mt-2"> {errors.message && errors.message.message}</p>
                  </div>
                )}
              </form>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol sm={12}>
        <CModal
          size="sm"
          alignment="center"
          visible={visible}
          onClose={() => {
            setVisible(false)
          }}
        >
          <CModalHeader>
            <CModalTitle>New {authUser?.user?.role === 3 ? 'Appointee' : 'Client'}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {authUser?.user?.role === 3 && appointee?.appointeelist?.length > 0 && (
              <CInputGroup>
                <ul className="ulUser">
                  {appointee?.appointeelist?.map((app, i) => (
                    <li className="liUser" key={`app${i}`} onClick={(e) => handleClick(app)}>
                      {app?.name}
                    </li>
                  ))}
                </ul>
              </CInputGroup>
            )}
            {authUser?.user?.role === 2 && client?.clientlist?.length > 0 && (
              <CInputGroup>
                <ul className="ulUser">
                  {client?.clientlist?.map((app, i) => (
                    <li className="liUser" key={`app${i}`} onClick={(e) => handleClick(app)}>
                      {app?.name}
                    </li>
                  ))}
                </ul>
              </CInputGroup>
            )}
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => {
                setVisible(false)
              }}
            >
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      </CCol>
    </CRow>
  )
}

export default Support
