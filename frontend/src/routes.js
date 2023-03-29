import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Profile = React.lazy(() => import('./views/profile'))
const Settings = React.lazy(() => import('./views/settings'))

/* Admin */
const Appointee = React.lazy(() => import('./views/appointee/list'))
const Clients = React.lazy(() => import('./views/clients/list'))

/* Appointee */
const Packages = React.lazy(() => import('./views/packages/list'))
const Slots = React.lazy(() => import('./views/slots'))

/* Client */
const ClientPackages = React.lazy(() => import('./views/packages/clientList'))
const AddAppointment = React.lazy(() => import('./views/appointment/add'))
const EditAppointment = React.lazy(() => import('./views/appointment/edit'))
const AppointmentList = React.lazy(() => import('./views/appointment/list'))

const Support = React.lazy(() => import('./views/support'))

const adminroutes = [
  {
    path: '/appointee',
    name: 'Appointee',
    element: <Appointee />,
  },
  {
    path: '/clients',
    name: 'Clients',
    element: <Clients />,
  },
]

const appointeeroutes = [
  {
    path: '/packages',
    name: 'Packages',
    element: <Packages />,
  },
  {
    path: '/slots',
    name: 'Slots',
    element: <Slots />,
  },
]

const clientroutes = [
  {
    path: '/client-packages',
    name: 'Packages',
    element: <ClientPackages />,
  },
  {
    path: '/appointments',
    name: 'Appointments',
    element: <AppointmentList />,
  },
  {
    path: '/appointments/add',
    name: 'Add Appointments',
    element: <AddAppointment />,
  },
  {
    path: '/appointments/edit/:id',
    name: 'Edit Appointments',
    element: <EditAppointment />,
  },
]

const commonroutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    element: <Dashboard />,
  },
  { path: '/profile', name: 'Profile', element: <Profile /> },
  { path: '/settings', name: 'Settings', element: <Settings /> },
  { path: '/support', name: 'Support', element: <Support /> },
]

export { adminroutes, appointeeroutes, clientroutes, commonroutes }
