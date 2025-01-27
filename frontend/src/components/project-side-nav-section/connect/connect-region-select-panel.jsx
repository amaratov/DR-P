import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Box, ClickAwayListener, Divider } from '@mui/material';
import List from '@mui/material/List';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {
  SidePanelContentWrapper,
  SidePanelDrawerWrapper,
  SidePanelEdgePatch,
  SidePanelHeaderText,
  SidePanelHeaderWrapper,
  SidePanelMainWrapper,
} from '../../side-panel/side-panel-styled';
import { REGION_TYPE } from '../../../utils/constants/constants';
import { DRDivider } from '../../app/app-styled';
import {
  SubPanelArrowRight,
  SubPanelHeaderCloseBtn,
  SubPanelListItem,
  SubPanelListItemStateIcon,
  SubPanelListItemText,
  SubPanelListSubHeader,
} from './connect-styled';
import CurrentFutureBubble from '../model/current-future-bubble';
import { getSelectedDetailsFromProject } from '../../../features/selectors/ui';
import { mergeRegions, returnRegionWithIsFuture } from '../../../utils/utils';

function ConnectRegionSelectPanel({
  open,
  setOpenConnectRegion,
  onSubDrawerClosed,
  currentLevel,
  setCurrentLevel,
  subDrawerOpen,
  setSubDrawerOpen,
  selectedRegion,
  setSelectedRegion,
}) {
  const detailsFromSelectedProject = useSelector(getSelectedDetailsFromProject);

  const handleSelection = useCallback(
    detail => {
      setSelectedRegion(detail);
      setSubDrawerOpen(true);
      onSubDrawerClosed(false);
      setOpenConnectRegion(false);
    },
    [setSelectedRegion, setSubDrawerOpen, onSubDrawerClosed, setOpenConnectRegion]
  );

  return (
    <>
      <SidePanelEdgePatch showPatch={open} useTop="8px" useLeft="441px" useMinHeight="calc(98% - 3px)" useColor="rgb(240, 236, 252)" />
      <SidePanelDrawerWrapper
        disableEnforceFocus
        hideBackdrop
        anchor="left"
        leftPositionDrawerContainer={575}
        open={open}
        openWidth="500px"
        onClose={() => {}}
        PaperProps={{
          style: {
            marginTop: '8px',
            marginLeft: '490px',
            backgroundColor: '#f0ecfc',
            borderTopRightRadius: '30px',
            borderBottomRightRadius: '30px',
            boxShadow: 'unset',
            height: 'calc(98% - 3px)',
          },
        }}>
        <ClickAwayListener onClickAway={() => {}}>
          <Box sx={{ minWidth: '500px' }}>
            <SidePanelMainWrapper>
              <SidePanelHeaderWrapper>
                <SidePanelHeaderText />
                <SubPanelHeaderCloseBtn>
                  <CloseIcon onClick={() => setOpenConnectRegion(false)} />
                </SubPanelHeaderCloseBtn>
              </SidePanelHeaderWrapper>
              <SidePanelContentWrapper>
                <List sx={{ padding: '8px 10px' }}>
                  <SubPanelListSubHeader>Choose Region</SubPanelListSubHeader>
                  <DRDivider margin="16px 0 14px 0" />
                  {mergeRegions(detailsFromSelectedProject)
                    .filter(detail => {
                      return detail.type === REGION_TYPE;
                    })
                    ?.map(d => (
                      <>
                        <SubPanelListItem key={`${d?.id}${d?.named}`} disableGutters onClick={() => handleSelection(d)} onKeyDown={() => handleSelection(d)}>
                          <SubPanelListItemStateIcon>
                            <CurrentFutureBubble detail={returnRegionWithIsFuture(d, detailsFromSelectedProject)} />
                          </SubPanelListItemStateIcon>
                          <SubPanelListItemText primary={d?.named || ''} />
                          <SubPanelArrowRight>
                            <KeyboardArrowRightIcon />
                          </SubPanelArrowRight>
                        </SubPanelListItem>
                        <DRDivider component="li" margin="14px 0 16px 0" />
                      </>
                    ))}
                </List>
              </SidePanelContentWrapper>
            </SidePanelMainWrapper>
          </Box>
        </ClickAwayListener>
      </SidePanelDrawerWrapper>
    </>
  );
}

export default ConnectRegionSelectPanel;
