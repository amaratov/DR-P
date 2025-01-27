/* eslint no-underscore-dangle: 0 */
import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { SwipeableDrawer } from '@mui/material';
import { getSelectedDetailsFromProject } from '../../../features/selectors/ui';

function CloudNotesPanel({ cloud, open }) {
  const currentColor = 'var(--color-imperial)';
  const futureColor = 'var(--color-future)';

  const detailsFromSelectedProject = useSelector(getSelectedDetailsFromProject);
  const detail1 = detailsFromSelectedProject.find(d => {
    return (d?.id === cloud?.id || d?.id === cloud?.companionId) && !d?.isFuture;
  });
  const detail2 = detailsFromSelectedProject.find(d => {
    return (d?.id === cloud?.id || d?.id === cloud?.companionId) && d?.isFuture;
  });

  const labelFields = useMemo(() => {
    return [
      { label: 'Cloud region & onramp notes', field: 'cloudRegionAndOnrampNotes' },
      { label: 'General Notes', field: 'generalNotes' },
      { label: 'Compute Notes', field: 'computeUseCase' },
      { label: 'Network Notes', field: 'networkUseCase' },
      { label: 'Storage Notes', field: 'storageUseCase' },
    ];
  }, []);
  if (!cloud) {
    return <span />;
  }
  return (
    <SwipeableDrawer
      disableEnforceFocus
      hideBackdrop
      anchor="left"
      open={open}
      onClose={() => {}}
      onOpen={() => {}}
      sx={{
        '&.MuiDrawer-root': { marginLeft: '364px', width: '250px' },
        '&.MuiDrawer-paper': { marginLeft: '364px', width: '250px' },
      }}
      PaperProps={{
        style: {
          marginLeft: '364px',
          paddingTop: '30px',
          paddingLeft: '10px',
          borderRadius: '30px',
          boxShadow: 'unset',
          border: 'unset',
          width: '250px',
          background: '#EEEEFB',
        },
      }}>
      {labelFields.map(lf => {
        const equal = detail1?.extras?.[lf.field] === detail2?.extras?.[lf.field];
        const has1 = detail1?.extras?.[lf.field] || detail2?.extras?.[lf.field];
        if (!has1) {
          return <span key={`empty-notes-${cloud?.id}-${Math.random().toString(16).slice(2)}`} />;
        }
        return (
          <span key={`notes-field-${lf.label}-${cloud?.id}`}>
            <h4 style={{ color: 'var(--color-aluminium)' }}>{lf.label}</h4>
            {equal && (
              <p
                style={{
                  paddingLeft: '12px',
                  borderImage: `linear-gradient(to bottom, ${currentColor}, ${futureColor}) 1 100% / 2px`,
                }}>
                {detail1.extras[lf.field]}
              </p>
            )}
            {!equal && detail1 && detail1.extras && detail1.extras[lf.field] && (
              <p style={{ paddingLeft: '12px', borderLeft: `2px solid ${currentColor}` }}>{detail1.extras[lf.field]}</p>
            )}
            {!equal && detail2 && detail2.extras && detail2.extras[lf.field] && (
              <p style={{ paddingLeft: '12px', borderLeft: `2px solid ${futureColor}` }}>{detail2.extras[lf.field]}</p>
            )}
          </span>
        );
      })}
    </SwipeableDrawer>
  );
}

export default CloudNotesPanel;
