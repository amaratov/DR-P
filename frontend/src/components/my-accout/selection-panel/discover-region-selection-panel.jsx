import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, Divider, IconButton } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  SidePanelAddOrRemoveIcon,
  SidePanelContentWrapper,
  SidePanelDrawerWrapper,
  SidePanelHeaderCloseBtn,
  SidePanelHeaderText,
  SidePanelHeaderWrapper,
  SidePanelMainWrapper,
  SidePanelSmallColumnLargeColumn,
  SidePanelPlainTextBlurb,
  SidePanelPlainTextBtn,
} from '../../side-panel/side-panel-styled';
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  DISCOVER_REGION_SELECTION_PANEL_APPLICATION_FIELD_VALUES,
  DISCOVER_REGION_SIDE_PANEL_APPLICATION,
  DISCOVER_REGION_STATE_TABS,
} from '../../../utils/constants/constants';
import CustomButton from '../../form-elements/custom-button';
import { DRDivider } from '../../app/app-styled';
import { setDiscoverRegionTabNavTo } from '../../../features/slices/uiSlice';

function DiscoverRegionSelectionPanel({
  optionsCloud,
  optionsDataCenter,
  openField,
  setOpenField,
  additionalValues,
  handleClick,
  handleMainPanelClose,
  handleCloseAddMainPanel,
}) {
  // dispatch
  const dispatch = useDispatch();

  // const
  const openWidth = openField ? '500px' : '0';
  const header = 'Choosing hosting location';
  const optionsCloudFinalIndex = optionsCloud.length - 1;
  const optionsDataIndexFinalIndex = optionsDataCenter.length - 1;

  // state
  const [cloudAllSelected, setCloudAllSelected] = useState(false);
  const [dataCenterAllSelected, setDataCenterAllSelected] = useState(false);
  const [cloudRowOpen, setCloudRowOpen] = useState(false);
  const [dataCenterRowOpen, setDataCenterRowOpen] = useState(false);

  // function
  const handleCloudAllClick = useCallback(() => {
    setCloudAllSelected(prev => !prev);
    if (!cloudAllSelected) {
      handleClick(optionsCloud, DISCOVER_REGION_SELECTION_PANEL_APPLICATION_FIELD_VALUES.CLOUD, DISCOVER_REGION_SIDE_PANEL_APPLICATION.SET_ALL);
    } else if (cloudAllSelected) {
      handleClick(optionsCloud, DISCOVER_REGION_SELECTION_PANEL_APPLICATION_FIELD_VALUES.CLOUD, DISCOVER_REGION_SIDE_PANEL_APPLICATION.REMOVE_ALL);
    }
  }, [setCloudAllSelected, cloudAllSelected, handleClick]);

  const handleDataCenterAllClick = useCallback(() => {
    setDataCenterAllSelected(prev => !prev);
    if (!dataCenterAllSelected) {
      handleClick(optionsDataCenter, DISCOVER_REGION_SELECTION_PANEL_APPLICATION_FIELD_VALUES.DATA_CENTER, DISCOVER_REGION_SIDE_PANEL_APPLICATION.SET_ALL);
    } else if (dataCenterAllSelected) {
      handleClick(optionsDataCenter, DISCOVER_REGION_SELECTION_PANEL_APPLICATION_FIELD_VALUES.DATA_CENTER, DISCOVER_REGION_SIDE_PANEL_APPLICATION.REMOVE_ALL);
    }
  }, [setCloudAllSelected, cloudAllSelected, setDataCenterAllSelected, dataCenterAllSelected, handleClick]);

  const handleAddCloudOrDataCenter = val => {
    handleMainPanelClose();
    handleCloseAddMainPanel();
    dispatch(setDiscoverRegionTabNavTo(val));
  };

  return (
    <SidePanelDrawerWrapper
      disableEnforceFocus
      hideBackdrop
      anchor="left"
      open={openField}
      openWidth={openWidth}
      onClick={() => setOpenField(false)}
      onClose={() => setOpenField(false)}
      PaperProps={{
        style: {
          marginLeft: 377,
          backgroundColor: '#f0ecfc',
          borderTopRightRadius: '30px',
          borderBottomRightRadius: '30px',
          boxShadow: 'unset',
        },
      }}>
      <Box sx={{ minWidth: openWidth }} onClick={event => event.stopPropagation()}>
        <SidePanelMainWrapper>
          <SidePanelHeaderWrapper paddingBottom="2rem">
            <SidePanelHeaderText>{header}</SidePanelHeaderText>
            <SidePanelHeaderCloseBtn>
              <CloseIcon onClick={() => setOpenField(false)} />
            </SidePanelHeaderCloseBtn>
          </SidePanelHeaderWrapper>
          <Divider />
          <SidePanelContentWrapper>
            <SidePanelSmallColumnLargeColumn>
              <div style={{ marginTop: '0.75rem' }}>
                <IconButton aria-label="expand row" size="small" onClick={() => setCloudRowOpen(!cloudRowOpen)} sx={{ color: 'var(--color-aluminium)' }}>
                  {cloudRowOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                </IconButton>
              </div>
              <div>
                <List sx={{ padding: '0' }}>
                  <>
                    <ListItem key="cloud-all" sx={{ paddingLeft: '2px' }}>
                      <ListItemText primary="Cloud" />
                      <SidePanelAddOrRemoveIcon>
                        <CustomButton
                          buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                          icon={cloudAllSelected ? BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON : BUTTON_ICON.ADD_OUTLINED}
                          type="button"
                          onClickFunc={() => handleCloudAllClick()}
                        />
                      </SidePanelAddOrRemoveIcon>
                    </ListItem>
                    {!cloudRowOpen && <DRDivider component="li" />}
                  </>
                </List>
                {!cloudRowOpen && (
                  <List sx={{ padding: '0' }}>
                    {optionsCloud?.map((iv, index) => (
                      <>
                        <ListItem key={`${DISCOVER_REGION_SELECTION_PANEL_APPLICATION_FIELD_VALUES.CLOUD}${iv?.id}`} sx={{ paddingLeft: '2px' }}>
                          <ListItemText primary={iv?.named || ''} />
                          <SidePanelAddOrRemoveIcon>
                            <CustomButton
                              buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                              icon={
                                additionalValues?.[DISCOVER_REGION_SELECTION_PANEL_APPLICATION_FIELD_VALUES.CLOUD]?.includes(iv?.named)
                                  ? BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON
                                  : BUTTON_ICON.ADD_OUTLINED
                              }
                              type="button"
                              onClickFunc={() =>
                                handleClick(
                                  iv?.named,
                                  DISCOVER_REGION_SELECTION_PANEL_APPLICATION_FIELD_VALUES.CLOUD,
                                  DISCOVER_REGION_SIDE_PANEL_APPLICATION.TOGGLE_SELECTED
                                )
                              }
                            />
                          </SidePanelAddOrRemoveIcon>
                        </ListItem>
                        {index !== optionsCloudFinalIndex && <DRDivider component="li" />}
                      </>
                    ))}
                  </List>
                )}
              </div>
            </SidePanelSmallColumnLargeColumn>
            <DRDivider />
            <SidePanelPlainTextBlurb>
              If you do not see a cloud in this list,{' '}
              <SidePanelPlainTextBtn onClick={() => handleAddCloudOrDataCenter(DISCOVER_REGION_STATE_TABS.CLOUDS)}>add a cloud</SidePanelPlainTextBtn>
            </SidePanelPlainTextBlurb>
            <Divider />
            <SidePanelSmallColumnLargeColumn>
              <div style={{ marginTop: '0.75rem' }}>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setDataCenterRowOpen(!dataCenterRowOpen)}
                  sx={{ color: 'var(--color-aluminium)' }}>
                  {dataCenterRowOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                </IconButton>
              </div>
              <div>
                <List sx={{ padding: '8px 0' }}>
                  <>
                    <ListItem key="data-center-all" sx={{ paddingLeft: '2px' }}>
                      <ListItemText primary="Data Center" />
                      <SidePanelAddOrRemoveIcon>
                        <CustomButton
                          buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                          icon={dataCenterAllSelected ? BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON : BUTTON_ICON.ADD_OUTLINED}
                          type="button"
                          onClickFunc={() => handleDataCenterAllClick()}
                        />
                      </SidePanelAddOrRemoveIcon>
                    </ListItem>
                    {!dataCenterRowOpen && <DRDivider component="li" />}
                  </>
                </List>
                {!dataCenterRowOpen && (
                  <List sx={{ padding: '8px 0' }}>
                    {optionsDataCenter?.map((iv, index) => (
                      <>
                        <ListItem
                          key={`${DISCOVER_REGION_SELECTION_PANEL_APPLICATION_FIELD_VALUES.DATA_CENTER}${iv?.id}${iv?.name}`}
                          sx={{ paddingLeft: '2px' }}>
                          <ListItemText primary={iv?.named || ''} />
                          <SidePanelAddOrRemoveIcon>
                            <CustomButton
                              buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                              icon={
                                additionalValues?.[DISCOVER_REGION_SELECTION_PANEL_APPLICATION_FIELD_VALUES.DATA_CENTER]?.includes(iv?.id)
                                  ? BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON
                                  : BUTTON_ICON.ADD_OUTLINED
                              }
                              type="button"
                              onClickFunc={() =>
                                handleClick(
                                  iv.id,
                                  DISCOVER_REGION_SELECTION_PANEL_APPLICATION_FIELD_VALUES.DATA_CENTER,
                                  DISCOVER_REGION_SIDE_PANEL_APPLICATION.TOGGLE_SELECTED
                                )
                              }
                            />
                          </SidePanelAddOrRemoveIcon>
                        </ListItem>
                        {index !== optionsDataIndexFinalIndex && <DRDivider component="li" />}
                      </>
                    ))}
                  </List>
                )}
              </div>
            </SidePanelSmallColumnLargeColumn>
            <DRDivider />
            <SidePanelPlainTextBlurb>
              If you do not see a datacenter in this list,{' '}
              <SidePanelPlainTextBtn onClick={() => handleAddCloudOrDataCenter(DISCOVER_REGION_STATE_TABS.DATA_CENTRES)}>
                add a datacenter
              </SidePanelPlainTextBtn>
            </SidePanelPlainTextBlurb>
          </SidePanelContentWrapper>
        </SidePanelMainWrapper>
      </Box>
    </SidePanelDrawerWrapper>
  );
}

DiscoverRegionSelectionPanel.propTypes = {
  optionsCloud: PropTypes.shape([]).isRequired,
  optionsDataCenter: PropTypes.shape([]).isRequired,
  openField: PropTypes.bool.isRequired,
  setOpenField: PropTypes.func.isRequired,
  additionalValues: PropTypes.shape({}).isRequired,
  handleClick: PropTypes.func.isRequired,
  handleMainPanelClose: PropTypes.func,
  handleCloseAddMainPanel: PropTypes.func,
};

DiscoverRegionSelectionPanel.defaultProps = {
  handleMainPanelClose: () => {},
  handleCloseAddMainPanel: () => {},
};

export default DiscoverRegionSelectionPanel;
