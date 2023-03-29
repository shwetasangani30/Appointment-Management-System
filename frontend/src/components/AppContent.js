import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import { adminroutes, appointeeroutes, clientroutes, commonroutes } from '../routes'
import { AdminRoute } from './AppPrivateRoutes'

const AppContent = () => {
  const allroutes = adminroutes.concat(appointeeroutes, clientroutes, commonroutes)
  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {allroutes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<AdminRoute>{route.element}</AdminRoute>}
                />
              )
            )
          })}
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
