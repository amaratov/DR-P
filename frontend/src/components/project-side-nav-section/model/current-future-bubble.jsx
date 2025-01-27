import React from 'react';
import { CircularProgress } from '@mui/material';

function CurrentFutureBubble({ detail }) {
  return (
    <>
      {detail.isFuture.length === 2 && (
        <span>
          <CircularProgress variant="determinate" value={50} style={{ color: 'var(--color-imperial)' }} sx={{ scale: '-1 1' }} />
          <CircularProgress variant="determinate" value={50} style={{ color: 'var(--color-future)', marginLeft: '-40px' }} />
        </span>
      )}
      {detail.isFuture.length < 2 && (
        <span>
          <CircularProgress variant="determinate" value={100} style={{ color: detail.isFuture[0] ? 'var(--color-future)' : 'var(--color-homeworld)' }} />
        </span>
      )}
    </>
  );
}

CurrentFutureBubble.prototype = {};

CurrentFutureBubble.defaultProps = {
  detail: {
    isFuture: [],
  },
};

export default CurrentFutureBubble;
