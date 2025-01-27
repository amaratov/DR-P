import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box, Alert } from '@mui/material';
import { Close } from '@mui/icons-material';
import {
  DiscoverRegionsSetRequirementsPanelMain,
  DiscoverRegionsSetRequirementsPanelForm,
  DiscoverRegionsSetRequirementsPanelHeaderText,
  DiscoverRegionsSetRequirementsPanelSubHeaderSimpleText,
  DiscoverRegionsSetRequirementsPanelActionWrapper,
} from '../discover-regions-set-requirements-styled';
import { BUTTON_STYLE, REGIONS_INNER_TABS, TABS, REGION_TYPE } from '../../../../../../utils/constants/constants';
import CustomButton from '../../../../../form-elements/custom-button';
import { setSelectedDiscoverRegionActiveState, resetFutureStateMode, clearProjectDetailError } from '../../../../../../features/slices/uiSlice';
import { getSelectedDiscoverRegionActiveState, getSelectedDetailsFromProject, getProjectDetailError } from '../../../../../../features/selectors/ui';
import { backendService } from '../../../../../../services/backend';

function DiscoverRegionFutureState() {
  // dispatch
  const dispatch = useDispatch();

  // params
  const routeParams = useParams();

  // selector
  const selectedState = useSelector(getSelectedDiscoverRegionActiveState);
  const selectedProjectDetails = useSelector(getSelectedDetailsFromProject);
  const projectDetailError = useSelector(getProjectDetailError);

  const [showAlert, setShowAlert] = useState(false);

  const closeErrorMessage = () => {
    setShowAlert(false);
    dispatch(clearProjectDetailError());
  };

  useEffect(() => {
    closeErrorMessage();
  }, []);

  useEffect(() => {
    setShowAlert(projectDetailError !== '');
  }, [projectDetailError]);

  useEffect(() => {
    const hasFuture = selectedProjectDetails.find(d => {
      return d?.isFuture && selectedState?.region === d?.region;
    });
    if (hasFuture) {
      const projectId = routeParams?.id || window.location.pathname.split('/')[2];
      dispatch(backendService.getProjectDetails(projectId));

      dispatch(
        setSelectedDiscoverRegionActiveState({
          regionName: selectedState.regionName,
          region: selectedState.region,
          view: selectedState.view,
          state: REGIONS_INNER_TABS.FUTURE_STATE,
          isFuture: true,
        })
      );
      dispatch(resetFutureStateMode());
    }
  }, [selectedProjectDetails]);

  const clickClone = function () {
    const hasFuture = selectedProjectDetails.find(d => {
      return d?.isFuture && selectedState?.region === d?.region;
    });

    if (!hasFuture) {
      for (let i = 0; i < selectedProjectDetails.length; i += 1) {
        if (
          selectedProjectDetails[i]?.type !== REGION_TYPE &&
          !selectedProjectDetails[i]?.isFuture &&
          selectedProjectDetails[i]?.region === selectedState?.region
        ) {
          const newDetail = JSON.parse(JSON.stringify(selectedProjectDetails[i]));
          newDetail.isFuture = true;
          dispatch(backendService.newProjectDetail(newDetail));
        }
      }
    } else {
      const projectId = routeParams?.id || window.location.pathname.split('/')[2];
      dispatch(backendService.getProjectDetails(projectId));

      dispatch(
        setSelectedDiscoverRegionActiveState({
          regionName: selectedState.regionName,
          region: selectedState.region,
          view: selectedState.view,
          state: REGIONS_INNER_TABS.FUTURE_STATE,
          isFuture: true,
        })
      );
      dispatch(resetFutureStateMode());
    }
  };

  return (
    <DiscoverRegionsSetRequirementsPanelMain>
      <Box role="presentation">
        <DiscoverRegionsSetRequirementsPanelForm customWidth="596" customHeight={showAlert ? '200' : '186'} customPadding="40">
          {showAlert && (
            <Alert
              icon={
                <Close
                  onClick={() => {
                    closeErrorMessage();
                  }}
                  fontSize="inherit"
                />
              }
              severity="error">
              {projectDetailError}
            </Alert>
          )}
          <DiscoverRegionsSetRequirementsPanelHeaderText>How would you like to start?</DiscoverRegionsSetRequirementsPanelHeaderText>
          <DiscoverRegionsSetRequirementsPanelSubHeaderSimpleText>
            You can clone the current state as a basis for the future state or start from scratch.
          </DiscoverRegionsSetRequirementsPanelSubHeaderSimpleText>
          <DiscoverRegionsSetRequirementsPanelActionWrapper customBottom="40px">
            <CustomButton
              buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
              buttonText="cancel"
              type="button"
              customMinWidth="140px"
              customMinHeight="56px"
              onClickFunc={() => {
                dispatch(resetFutureStateMode());
              }}
            />

            <CustomButton
              buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
              buttonText="Clone current state"
              bgColor="var(--color-homeworld)"
              type="button"
              customMinWidth="204px"
              customMinHeight="56px"
              onClickFunc={() => {
                clickClone();
              }}
            />

            <CustomButton
              buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
              buttonText="Start from scratch"
              bgColor="var(--color-homeworld)"
              type="button"
              customMinWidth="204px"
              customMinHeight="56px"
              onClickFunc={() => {
                dispatch(
                  setSelectedDiscoverRegionActiveState({
                    regionName: selectedState.regionName,
                    region: selectedState.region,
                    view: selectedState.view,
                    state: REGIONS_INNER_TABS.FUTURE_STATE,
                    isFuture: true,
                  })
                );
                dispatch(resetFutureStateMode());
              }}
            />
          </DiscoverRegionsSetRequirementsPanelActionWrapper>
        </DiscoverRegionsSetRequirementsPanelForm>
      </Box>
    </DiscoverRegionsSetRequirementsPanelMain>
  );
}

DiscoverRegionFutureState.prototype = {};

DiscoverRegionFutureState.defaultProps = {};

export default DiscoverRegionFutureState;
