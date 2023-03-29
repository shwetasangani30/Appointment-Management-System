import React from 'react'
import LoadingOverlay from 'react-loading-overlay'

const OverlayLoading = ({ loading }) => {
  return (
    <div className="loader">
      <div className="darkBackground" style={{ display: loading ? 'block' : 'none' }}>
        <LoadingOverlay active={true} spinner={true} text="Loading..."></LoadingOverlay>
      </div>
    </div>
  )
}

export default OverlayLoading
