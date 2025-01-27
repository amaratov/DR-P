import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DiscoverRegionStateTabContentOuterWrapper,
  DiscoverRegionDetailsInnerTab,
  DiscoverRegionDetailsInnerTabButtonWrapper,
} from '../discover-region-section-styled';
import { REGIONS_INNER_TABS, TABS, AllRoles, FEATURE_CONFIG } from '../../../../../utils/constants/constants';
import {
  getSelectedDetailsFromProject,
  getSelectedDiscoverRegionActiveState,
  getSelectedProjectDetails,
  getStartWithFutureState,
} from '../../../../../features/selectors/ui';
import DiscoverRegionStatePanel from '../discover-panels/discover-region-state-panel/discover-region-state-panel';
import { setSelectedDiscoverRegionActiveState, openFutureStateMode, setStartWithFutureState } from '../../../../../features/slices/uiSlice';
import { isEmpty } from '../../../../../utils/utils';
import { getWhoAmI } from '../../../../../features/selectors';
import { backendService } from '../../../../../services/backend';

function DiscoverRegionState() {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const selectedState = useSelector(getSelectedDiscoverRegionActiveState);
  const whoami = useSelector(getWhoAmI);
  const currentProjectInfo = useSelector(getSelectedProjectDetails);
  const detailsFromSelectedProject = useSelector(getSelectedDetailsFromProject);
  const startWithFuture = useSelector(getStartWithFutureState);

  // state
  const [activeSection, setActiveSection] = useState(`${selectedState.state}`);

  //const
  const roleName = whoami?.role?.name?.toLowerCase();
  const isCustomer = roleName === AllRoles.CUSTOMER;
  const isAdminOrSA = FEATURE_CONFIG.ADMIN_AND_SA_ONLY.access_group.includes(roleName);
  const [hasFutureState, setHasFutureState] = useState(false);

  useEffect(() => {
    const newHas = detailsFromSelectedProject.find(d => {
      return d?.isFuture && selectedState?.region === d?.region;
    });
    setHasFutureState(newHas);
  }, [detailsFromSelectedProject, setHasFutureState, selectedState]);

  // func
  const updateActiveSection = useCallback(
    section => {
      setActiveSection(section);
      dispatch(setStartWithFutureState(false));
      dispatch(
        setSelectedDiscoverRegionActiveState({
          regionName: selectedState.regionName,
          region: selectedState.region,
          view: selectedState.view,
          state: section,
          isFuture: section === REGIONS_INNER_TABS.FUTURE_STATE,
        })
      );
      const projectId = currentProjectInfo?.id || window.location.pathname.split('/')[2];
      dispatch(backendService.getProjectDetails(projectId));
    },
    [setActiveSection, dispatch, selectedState, currentProjectInfo]
  );

  const futureState = useCallback(() => {
    if (activeSection === REGIONS_INNER_TABS.CURRENT_STATE) {
      const newHas = detailsFromSelectedProject.find(d => {
        return d?.isFuture && selectedState?.region === d?.region;
      });
      if (!newHas) {
        dispatch(openFutureStateMode());
      } else {
        updateActiveSection(REGIONS_INNER_TABS.FUTURE_STATE);
      }
    }
  }, [activeSection, dispatch, selectedState]);

  // effect
  useEffect(() => {
    if (activeSection === 'undefined') {
      setActiveSection(REGIONS_INNER_TABS.CURRENT_STATE);
    }
    if (!isEmpty(selectedState?.state) && activeSection !== selectedState.state) {
      setActiveSection(selectedState?.state);
    }
  }, [activeSection, setActiveSection, selectedState]);

  return (
    <DiscoverRegionStateTabContentOuterWrapper>
      {isAdminOrSA && (
        <DiscoverRegionDetailsInnerTab>
          <DiscoverRegionDetailsInnerTabButtonWrapper
            active={activeSection === REGIONS_INNER_TABS.CURRENT_STATE && !startWithFuture}
            onClick={() => updateActiveSection(REGIONS_INNER_TABS.CURRENT_STATE)}>
            <div>{TABS.CURRENT_STATE}</div>
          </DiscoverRegionDetailsInnerTabButtonWrapper>
          <DiscoverRegionDetailsInnerTabButtonWrapper
            active={activeSection === REGIONS_INNER_TABS.FUTURE_STATE || startWithFuture}
            onClick={() => futureState()}>
            <div>{hasFutureState || startWithFuture ? 'Future State' : TABS.FUTURE_STATE}</div>
          </DiscoverRegionDetailsInnerTabButtonWrapper>
        </DiscoverRegionDetailsInnerTab>
      )}
      <DiscoverRegionStatePanel />
    </DiscoverRegionStateTabContentOuterWrapper>
  );
}

DiscoverRegionState.prototype = {};

DiscoverRegionState.defaultProps = {};

export default DiscoverRegionState;
