import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppointeeContext } from 'src/context/appointee.context'
import { AuthContext } from 'src/context/auth.context'
import { ClientsContext } from 'src/context/clients.context'
import { PackagesContext } from 'src/context/packages.context'
import { SlotsContext } from 'src/context/slots.context'

const Logout = () => {
  const { dispatch: dispatchAuth } = useContext(AuthContext)
  const { dispatch: dispatchPackage } = useContext(PackagesContext)
  const { dispatch: dispatchAppointee } = useContext(AppointeeContext)
  const { dispatch: dispatchSlots } = useContext(SlotsContext)
  const { dispatch: dispatchClient } = useContext(ClientsContext)

  const navigate = useNavigate()
  useEffect(() => {
    localStorage.removeItem('app-manage-userData')
    localStorage.removeItem('app-manage-token')
    dispatchAuth({
      type: 'LOGOUT',
    })
    dispatchPackage({ type: 'INIT' })
    dispatchAppointee({ type: 'INIT' })
    dispatchSlots({ type: 'INIT' })
    dispatchClient({ type: 'INIT' })
    navigate(`/login`)
  }, [dispatchAppointee, dispatchAuth, dispatchClient, dispatchPackage, dispatchSlots, navigate])

  return <>Logging Out...</>
}
export default Logout
