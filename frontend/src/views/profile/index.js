import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { Table, TableBody, TableCell, TableRow } from '@mui/material'
import React, { useContext } from 'react'
import { AuthContext } from 'src/context/auth.context'

const Profile = () => {
  const { state: authState } = useContext(AuthContext)
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Profile</strong>
          </CCardHeader>
          <CCardBody>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell align="left">
                    <b>Name: </b>
                  </TableCell>
                  <TableCell align="left">{authState?.user?.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left">
                    <b>Email:</b>
                  </TableCell>
                  <TableCell align="left">{authState?.user?.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left">
                    <b>Role: </b>
                  </TableCell>
                  <TableCell align="left">
                    {authState?.user?.role === 2
                      ? 'Appointee'
                      : authState?.user?.role === 3
                      ? 'Client'
                      : 'Admin'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Profile
