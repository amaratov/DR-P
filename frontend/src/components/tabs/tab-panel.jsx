import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { TABS } from '../../utils/constants/constants';

function TabPanel({ children, value, index, mapTo }) {
  const bgColor = 'inherit';
  const divStyles = { backgroundColor: bgColor, height: '100%', width: '100%' };
  const boxStyles = { p: 3, padding: '0', height: '100%', width: '100%', backgroundColor: bgColor };
  return (
    <div role="tabpanel" hidden={value !== mapTo} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} style={divStyles}>
      {value === mapTo && (
        <Box sx={boxStyles}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
  mapTo: PropTypes.string.isRequired,
};

TabPanel.defaultProps = {
  children: {},
};

export default TabPanel;
