import React, { useCallback, useContext, useEffect, useRef } from 'react'
import { CWidgetStatsD, CRow, CCol } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCmake,
  cibCampaignMonitor,
  cibCivicrm,
  cibDelicious,
  cibDblp,
  cibDeepin,
} from '@coreui/icons'
import { AuthContext } from 'src/context/auth.context'
import axios from 'src/components/AxiosConfig'
import { toast } from 'react-hot-toast'

const WidgetsBrand = () => {
  const { state, dispatch } = useContext(AuthContext)
  const dataFetchedRef = useRef(false)

  const getDashboardData = useCallback(async () => {
    try {
      const res = await axios.get('/dashboard')
      let response = res?.data?.data
      if (res?.data?.status === 200) {
        dispatch({
          type: 'DASHBOARD',
          payload: { dashboard: response },
        })
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong',
      )
    }
  }, [dispatch])

  useEffect(() => {
    if (dataFetchedRef.current) return
    dataFetchedRef.current = true
    getDashboardData()
  }, [dispatch, getDashboardData])

  return (
    <CRow>
      <>
        <CCol sm={4} lg={4}>
          <CWidgetStatsD
            className="mb-4"
            icon={<CIcon icon={cibCmake} height={52} className="my-4 text-white" />}
            values={[
              {
                title: "Today's total appointment",
                value: state?.dashboard?.todaysTotalAppointmentCount,
              },
            ]}
            style={{
              '--cui-card-cap-bg': '#3b5998',
            }}
          />
        </CCol>

        <CCol sm={4} lg={4}>
          <CWidgetStatsD
            className="mb-4"
            icon={<CIcon icon={cibCampaignMonitor} height={52} className="my-4 text-white" />}
            values={[
              {
                title: 'Last 7 days total appointment',
                value: state?.dashboard?.last7DaysAppointmentCount,
              },
            ]}
            style={{
              '--cui-card-cap-bg': '#137e7f',
            }}
          />
        </CCol>
        <CCol sm={4} lg={4}>
          <CWidgetStatsD
            className="mb-4"
            icon={<CIcon icon={cibCivicrm} height={52} className="my-4 text-white" />}
            values={[
              {
                title: 'Total appointment till date',
                value: state?.dashboard?.totalAppointmentsCount,
              },
            ]}
            style={{
              '--cui-card-cap-bg': '#0d4e5e',
            }}
          />
        </CCol>
      </>
      {state?.user?.role === 1 && (
        <>
          <CCol sm={6} lg={6}>
            <CWidgetStatsD
              className="mb-4"
              icon={<CIcon icon={cibDelicious} height={52} className="my-4 text-white" />}
              values={[
                {
                  title: 'Total registered clients',
                  value: state?.dashboard?.totalClientsCount,
                },
              ]}
              style={{
                '--cui-card-cap-bg': '#bc5b7c',
              }}
            />
          </CCol>
          <CCol sm={6} lg={6}>
            <CWidgetStatsD
              className="mb-4"
              icon={<CIcon icon={cibDblp} height={52} className="my-4 text-white" />}
              values={[{ title: 'Total Appointee', value: state?.dashboard?.totalAppointeeCount }]}
              style={{
                '--cui-card-cap-bg': '#f86095',
              }}
            />
          </CCol>
        </>
      )}

      {state?.user?.role === 2 && (
        <>
          <CCol sm={6} lg={6}>
            <CWidgetStatsD
              className="mb-4"
              icon={<CIcon icon={cibDelicious} height={52} className="my-4 text-white" />}
              values={[
                {
                  title: 'Total Pending Appointments',
                  value: state?.dashboard?.totalPendingAppointmentsCount,
                },
              ]}
              style={{
                '--cui-card-cap-bg': '#bc5b7c',
              }}
            />
          </CCol>
        </>
      )}
      {state?.user?.role === 3 && (
        <>
          <CCol sm={4} lg={4}>
            <CWidgetStatsD
              className="mb-4"
              icon={<CIcon icon={cibDelicious} height={52} className="my-4 text-white" />}
              values={[
                {
                  title: 'Total Pending Appointments',
                  value: state?.dashboard?.totalPendingAppointmentsCount,
                },
              ]}
              style={{
                '--cui-card-cap-bg': '#bc5b7c',
              }}
            />
          </CCol>
          <CCol sm={4} lg={4}>
            <CWidgetStatsD
              className="mb-4"
              icon={<CIcon icon={cibDblp} height={52} className="my-4 text-white" />}
              values={[
                {
                  title: 'Total Approved Appointments',
                  value: state?.dashboard?.totalApprovedAppointmentsCount,
                },
              ]}
              style={{
                '--cui-card-cap-bg': '#8863ba',
              }}
            />
          </CCol>
          <CCol sm={4} lg={4}>
            <CWidgetStatsD
              className="mb-4"
              icon={<CIcon icon={cibDeepin} height={52} className="my-4 text-white" />}
              values={[
                {
                  title: 'Total Rejected Appointments',
                  value: state?.dashboard?.totalRejectedAppointmentsCount,
                },
              ]}
              style={{
                '--cui-card-cap-bg': '#f86095',
              }}
            />
          </CCol>
        </>
      )}
    </CRow>
  )
}

export default WidgetsBrand
