import React, { useState } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Box, List, Divider, ListItemIcon, ListItemText, ListItemButton, ListItem } from '@mui/material';
import PropTypes from 'prop-types';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import { SidePanelToggleButton, SidePanelWrapper } from './side-panel-styled';
import { SIDE_PANEL_OPTIONS, SIDE_PANEL_POSITION } from '../../utils/constants/constants';

function SidePanel({ locationData, setViewState }) {
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = anchor => (
    <Box sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }} role="presentation">
      <List>
        {SIDE_PANEL_OPTIONS.map(text => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <LocationOnRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <SidePanelWrapper>
      {SIDE_PANEL_POSITION.map(anchor => (
        <React.Fragment key={anchor}>
          <SidePanelToggleButton onClick={toggleDrawer(anchor, true)}>{anchor}</SidePanelToggleButton>
          <SwipeableDrawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)} onOpen={toggleDrawer(anchor, true)}>
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </SidePanelWrapper>
  );
}

SidePanel.propTypes = {
  locationData: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.array, PropTypes.object, PropTypes.string])),
  setViewState: PropTypes.func,
};

SidePanel.defaultProps = {
  locationData: [],
  setViewState: () => {},
};

export default SidePanel;
