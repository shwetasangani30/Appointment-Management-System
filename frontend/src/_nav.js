import React from 'react'
import CIcon from '@coreui/icons-react'
import { cibHipchat, cilList, cilListRich, cilSpeedometer } from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    role: [1, 2, 3],
    badge: {
      color: 'info',
      // text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Appointee',
    to: '/appointee',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    role: [1],
  },
  {
    component: CNavItem,
    name: 'Clients',
    to: '/clients',
    icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
    role: [1],
  },
  {
    component: CNavItem,
    name: 'Packages',
    to: '/packages',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    role: [2],
  },
  {
    component: CNavItem,
    name: 'Slots',
    to: '/slots',
    icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
    role: [2],
  },
  {
    component: CNavItem,
    name: 'Packages',
    to: '/client-packages',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    role: [3],
  },
  {
    component: CNavItem,
    name: 'Appointments',
    to: '/appointments',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    role: [1, 2, 3],
  },
  {
    component: CNavItem,
    name: 'Support',
    to: '/support',
    icon: <CIcon icon={cibHipchat} customClassName="nav-icon" />,
    role: [2, 3],
  },
  /* {
    component: CNavGroup,
    name: 'Users',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    role: [1],
    items: [
      {
        component: CNavItem,
        name: 'clients',
        to: '/base/accordion',
      },
    ],
  }, */
]

export default _nav
