/* eslint no-underscore-dangle: 0 */
import React, { useState, useMemo, useEffect } from 'react';
import { List, ListItem, ListItemText, Divider, SwipeableDrawer } from '@mui/material';
import { AddCircleOutline, FastRewind, RemoveCircleOutlined, Close } from '@mui/icons-material';
import CurrentFutureBubble from './current-future-bubble';

function MvtPanel({ headers, open, lists, selectedItems, handleAdd, handleRemove, handleAddSection, addNonDRC, type, closePanel }) {
  function hasItem(dc) {
    return selectedItems[0].find(d => {
      if (d.extras?._id && dc?._id) {
        return d.extras._id === dc._id;
      }
      if (d.name && dc.name) {
        return d.name === dc.name;
      }
      return false;
    });
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
        '&.MuiDrawer-root': { marginLeft: '364px', width: '400px', background: '#EEEEFB' },
        '&.MuiDrawer-paper': { marginLeft: '364px', width: '400px', background: '#EEEEFB' },
      }}
      PaperProps={{
        style: {
          marginLeft: '364px',
          paddingTop: '30px',
          paddingLeft: '10px',
          borderRadius: '30px',
          boxShadow: 'unset',
          border: 'unset',
          width: '400px',
          background: '#EEEEFB',
        },
      }}>
      {headers.map((h, index) => {
        return (
          <span key={`hmap-${h}`}>
            <h3>
              {h}
              {closePanel && (
                <Close
                  onClick={() => {
                    closePanel();
                  }}
                  style={{ marginRight: '10px', cursor: 'pointer', float: 'right' }}
                />
              )}
            </h3>
            <List>
              {lists.length > 0 &&
                lists[index].length > 0 &&
                lists[index].map(dc => {
                  const mockDetail = {
                    isFuture: [true],
                  };
                  return (
                    <span key={`dr-${h}-${dc?._id || dc?.name}`}>
                      <ListItem
                        disableGutters
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          if (hasItem(dc)) {
                            handleRemove(dc);
                          } else {
                            handleAdd(dc);
                          }
                        }}>
                        <CurrentFutureBubble detail={mockDetail} />
                        {type === 'DRDC' && (
                          <ListItemText primary={`${dc.properties?.metro} - ${dc.properties?.siteCode}`} secondary={dc.properties?.address} />
                        )}
                        {type === 'CR' && <ListItemText primary={dc?.name} />}
                        {type === 'OR' && <ListItemText primary={dc.name} />}
                        {!hasItem(dc) && <AddCircleOutline sx={{ color: 'var(--color-homeworld)' }} />}
                        {hasItem(dc) && <RemoveCircleOutlined sx={{ color: 'var(--color-homeworld)' }} />}
                      </ListItem>
                      <Divider />
                    </span>
                  );
                })}
              {addNonDRC && (
                <ListItem
                  key="region-li-addDRDC"
                  disableGutters
                  style={{ cursor: 'pointer', marginBottom: '10px' }}
                  onClick={() => {
                    handleAddSection({ label: 'nondrdc', section: 'data-centers' });
                  }}>
                  <span style={{ lineHeight: '40px', verticalAlign: 'top', color: 'var(--color-homeworld)' }}>+ Add a Non DR Data Center</span>
                </ListItem>
              )}
            </List>
          </span>
        );
      })}
    </SwipeableDrawer>
  );
}

MvtPanel.defaultProps = {
  type: 'DRDC',
};

export default MvtPanel;
