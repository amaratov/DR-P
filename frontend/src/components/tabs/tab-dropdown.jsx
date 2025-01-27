import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch } from 'react-redux';

const ITEM_HEIGHT = 50;

function TabDropdown({ rowDetails, isUserDetails, isCompanyDetails, isProject }) {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const isArchived = rowDetails?.archived;

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{ borderRadius: 'unset' }}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 2,
            width: '120px',
          },
        }}>
        <MenuItem key={0} onClick={handleEdit} divider>
        <TabItem label={TABS.USE_CASES} {...a11yProps(3)} value={TABS.USE_CASES} />

        </MenuItem>
        {isArchived ? (
          <MenuItem key={1} onClick={handleActivate}>
            <TabItem label={TABS.USE_CASES} {...a11yProps(3)} value={TABS.USE_CASES} />

          </MenuItem>
        ) : (
          <MenuItem key={1} onClick={handleArchive}>
            <TabItem label={TABS.USE_CASES} {...a11yProps(3)} value={TABS.USE_CASES} />

          </MenuItem>
        )}
      </Menu>
    </div>
  );
}

TabDropdown.propTypes = {
  rowDetails: PropTypes.shape({}),
  isUserDetails: PropTypes.bool,
  isCompanyDetails: PropTypes.bool,
  isProject: PropTypes.bool,
};

TabDropdown.defaultProps = {
  rowDetails: {},
  isUserDetails: false,
  isCompanyDetails: false,
  isProject: false,
};

export default TabDropdown;
