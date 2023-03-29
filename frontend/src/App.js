import React, { Suspense } from 'react'
import { Toaster } from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppointeeProvider } from './context/appointee.context'
import { AppointmentProvider } from './context/appointment.context'
import { AuthProvider } from './context/auth.context'
import { ClientProvider } from './context/clients.context'
import { PackagesProvider } from './context/packages.context'
import { SlotsProvider } from './context/slots.context'
import DefaultLayout from './layout/DefaultLayout'
import './scss/style.scss'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Logout = React.lazy(() => import('./views/pages/Logout'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const ForgotPassword = React.lazy(() => import('./views/pages/forgotpassword/ForgotPassword'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  return (
    <Suspense fallback={loading}>
      <Toaster position="top-right" />
      <AuthProvider>
        <AppointeeProvider>
          <ClientProvider>
            <PackagesProvider>
              <SlotsProvider>
                <AppointmentProvider>
                  <Routes>
                    <Route exact path="/" element={<Navigate to="/login" />} />
                    <Route exact path="/login" name="Login" element={<Login />} />
                    <Route exact path="/logout" name="Logout" element={<Logout />} />
                    <Route exact path="/register" name="Register" element={<Register />} />
                    <Route
                      exact
                      path="/forgot-password"
                      name="ForgotPassword"
                      element={<ForgotPassword />}
                    />
                    <Route exact path="/404" name="Page 404" element={<Page404 />} />
                    <Route exact path="/500" name="Page 500" element={<Page500 />} />
                    <Route exact path="*" element={<DefaultLayout />} />
                  </Routes>
                </AppointmentProvider>
              </SlotsProvider>
            </PackagesProvider>
          </ClientProvider>
        </AppointeeProvider>
      </AuthProvider>
    </Suspense>
  )
}

export default App
