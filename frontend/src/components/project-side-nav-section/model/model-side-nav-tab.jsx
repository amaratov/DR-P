import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Chip, List, ListItem, Divider, SwipeableDrawer } from '@mui/material';
import { ChevronRight } from '@mui/icons-material';
import { REGION_TYPE, MODEL_SUB_PANELS, FEATURE_CONFIG, PATH_NAME } from '../../../utils/constants/constants';
import { getSelectedDetailsFromProject, getSelectedProjectDetails } from '../../../features/selectors/ui';
import { setActiveDetail } from '../../../features/slices/uiSlice';
import { backendService } from '../../../services/backend';
import CurrentFutureBubble from './current-future-bubble';
import ModelPanelRegion from './model-panel-region';
import ModelPanelDatacenter from './model-panel-datacenter';
import ModelPanelCustomerLocation from './model-panel-customerLocation';
import ModelPanelCloud from './model-panel-cloud';
import { mergeRegions, returnRegionWithIsFuture } from '../../../utils/utils';
import { getWhoAmI } from '../../../features/selectors';

function ModelSideNavTab({
  onSubDrawerClosed,
  currentLevel,
  setCurrentLevel,
  subDrawerOpen,
  setSubDrawerOpen,
  selectedRegion,
  setSelectedRegion,
  findAndSetSelectedMarkerForPopup,
  drawerRight,
  dcListOpen,
  setDcListOpen,
  setMarkerOpen,
  handleMapRecenter,
  geoPoints,
}) {
  // dispatch
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // params
  const routeParams = useParams();

  // selector
  const whoami = useSelector(getWhoAmI);
  const detailsFromSelectedProject = useSelector(getSelectedDetailsFromProject);
  const currentProjectInfo = useSelector(getSelectedProjectDetails);

  // const
  const projectId = currentProjectInfo?.id || routeParams?.id || window.location.pathname.split('/')[2];
  const useRole = whoami?.role?.name?.toLowerCase() || '';
  const isAdminOrSA = FEATURE_CONFIG.ADMIN_AND_SA_ONLY.access_group.includes(useRole);

  // func
  function handleListClick(detail) {
    return function (_) {
      setSelectedRegion(detail);
      setSubDrawerOpen(true);
      onSubDrawerClosed(false);
      navigate(`${PATH_NAME.PROJECT_MODELER_BASE}/${projectId}${PATH_NAME.MODEL}/${detail.id}`);
    };
  }

  function handleAddRegion() {
    return function (_) {
      // dispatch(setActiveProjectTab(TABS.DISCOVER));
      navigate(`/project-modeler/${projectId}/region`);
    };
  }

  function handleSubListClick(section, detail) {
    return function (_) {
      dispatch(setActiveDetail(detail));
    };
  }

  function closeSubDrawer() {
    setSubDrawerOpen(false);
    onSubDrawerClosed(true);
  }

  //handle on mount/unmount
  useEffect(() => {
    dispatch(backendService.getProjectDetails(projectId));
  }, []);

  return (
    <div style={{ height: '100%' }}>
      <h3>Regions</h3>
      <div>
        <Chip label="Current" style={{ color: 'white', backgroundColor: 'var(--color-imperial)' }} />
        <Chip label="Future" style={{ color: 'white', backgroundColor: 'var(--color-future)' }} />
      </div>
      <List>
        {mergeRegions(detailsFromSelectedProject)
          .filter(detail => {
            return detail.type === REGION_TYPE;
          })
          .map(detail => {
            return (
              <span key={`region-item-${detail.id}`}>
                <ListItem disableGutters style={{ cursor: 'pointer' }} onClick={handleListClick(detail)} secondaryAction={<ChevronRight />}>
                  <CurrentFutureBubble detail={returnRegionWithIsFuture(detail, detailsFromSelectedProject)} />
                  <span style={{ lineHeight: '40px', verticalAlign: 'top' }}>{detail.named}</span>
                </ListItem>
                <Divider />
              </span>
            );
          })}
        <ListItem disableGutters style={{ cursor: 'pointer' }} onClick={handleAddRegion()}>
          <span style={{ lineHeight: '40px', verticalAlign: 'top', color: 'var(--color-imperial)' }}>+ Add Region</span>
        </ListItem>
      </List>
      <SwipeableDrawer
        disableEnforceFocus
        hideBackdrop
        anchor={drawerRight ? 'right' : 'left'}
        open={subDrawerOpen}
        onClose={() => {}}
        onOpen={() => {}}
        sx={{
          '&.MuiDrawer-root': { marginLeft: '8px', marginTop: '8px', height: 'calc(100% - 16px)', boxSizing: 'border-box', width: '364px' },
          '&.MuiDrawer-paper': { marginLeft: '8px', marginTop: '8px', height: 'calc(100% - 16px)', boxSizing: 'border-box', width: '364px' },
        }}
        PaperProps={{
          style: {
            marginLeft: '8px',
            marginTop: '8px',
            marginBottom: '8px',
            paddingTop: '30px',
            paddingLeft: '32px',
            paddingRight: '32px',
            borderRadius: '30px',
            boxShadow: 'unset',
            border: 'unset',
            width: '364px',
            height: 'calc(100% - 16px)',
            boxSizing: 'border-box',
          },
        }}>
        <span>
          {currentLevel === MODEL_SUB_PANELS.REGION && (
            <ModelPanelRegion
              selectedRegion={selectedRegion}
              onSubDrawerClosed={e => {
                onSubDrawerClosed(e);
                setSubDrawerOpen(!e);
                setSelectedRegion(false);
                navigate(`${PATH_NAME.PROJECT_MODELER_BASE}/${projectId}${PATH_NAME.MODEL}`);
              }}
              onSelectedDetail={e => {
                setCurrentLevel(e);
              }}
              findAndSetSelectedMarkerForPopup={findAndSetSelectedMarkerForPopup}
              dcListOpen={dcListOpen}
              setDcListOpen={setDcListOpen}
              setMarkerOpen={setMarkerOpen}
              handleMapRecenter={handleMapRecenter}
            />
          )}
          {(currentLevel === MODEL_SUB_PANELS.DATACENTER || currentLevel === 'model') && (
            <ModelPanelDatacenter
              drawerRight={drawerRight}
              onClose={e => {
                setCurrentLevel(MODEL_SUB_PANELS.REGION);
                navigate(`${PATH_NAME.PROJECT_MODELER_BASE}/${projectId}${PATH_NAME.MODEL}/${routeParams?.regionId || 'unknown'}`);
              }}
              geoPoints={geoPoints}
              setMarkerOpen={setMarkerOpen}
            />
          )}
          {currentLevel === MODEL_SUB_PANELS.CUSTOMER && (
            <ModelPanelCustomerLocation
              drawerRight={drawerRight}
              onClose={e => {
                setCurrentLevel(MODEL_SUB_PANELS.REGION);
                navigate(`${PATH_NAME.PROJECT_MODELER_BASE}/${projectId}${PATH_NAME.MODEL}/${routeParams?.regionId || 'unknown'}`);
              }}
              geoPoints={geoPoints}
              setMarkerOpen={setMarkerOpen}
            />
          )}
          {currentLevel === MODEL_SUB_PANELS.CLOUDS && (
            <ModelPanelCloud
              drawerRight={drawerRight}
              onClose={e => {
                setCurrentLevel(MODEL_SUB_PANELS.REGION);
                navigate(`${PATH_NAME.PROJECT_MODELER_BASE}/${projectId}${PATH_NAME.MODEL}/${routeParams?.regionId || 'unknown'}`);
              }}
              geoPoints={geoPoints}
              setMarkerOpen={setMarkerOpen}
            />
          )}
        </span>
      </SwipeableDrawer>
    </div>
  );
}

ModelSideNavTab.defaultProps = {
  drawerRight: false,
};

export default ModelSideNavTab;
