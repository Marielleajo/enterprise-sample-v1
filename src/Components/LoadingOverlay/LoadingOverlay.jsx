import React from 'react';
import { CircularProgress } from '@material-ui/core';

const LoadingOverlay = ({ isLoading }) => {
  return (
    <>
      {isLoading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Loading indicator or button */}
          <CircularProgress style={{ color: '#ed204c' }} />
        </div>
      )}
    </>
  );
};

export default LoadingOverlay;
