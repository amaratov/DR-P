import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { REGIONS_INNER_TABS, SUB_TABS, TABS } from '../../../../utils/constants/constants';
import {
  DiscoverRegionAddRegionTab,
  DiscoverRegionAddRegionTabText,
  DiscoverRegionTab,
  DiscoverRegionTabBgContainer,
  DiscoverRegionTabText,
  DiscoverRegionTabWrapper,
} from './discover-region-section-styled';
import MoreMenuButton from '../../../more-menu-button/more-menu-button';
import { getSelectedDiscoverRegionActiveState } from '../../../../features/selectors/ui';

const regionPlaceHolderObj = {
  named: TABS.REGIONS,
  region: TABS.REGIONS,
  type: 'regions',
  view: SUB_TABS.INITIAL_REGIONS,
};
function DiscoverRegionTabs({ subTabs, subTabList, isAdminOrSA, existingRegions, activeSection, setSubTabs, isLastTabActive, addRegion, updateActiveSection }) {
  // param
  const routeParams = useParams();
  // selector
  const activeRegionAndState = useSelector(getSelectedDiscoverRegionActiveState);

  useEffect(() => {
    if (activeSection === undefined) {
      if (routeParams?.regionId && routeParams?.regionId !== 'undefined') {
        updateActiveSection([], routeParams?.regionId);
      } else {
        updateActiveSection(subTabs?.[0], undefined);
      }
    }
  }, []);

  // for updating tab list after a region is removed
  useEffect(() => {
    if (subTabList?.length > 0 && subTabs?.[0] !== subTabList?.[0]) {
      setSubTabs(subTabList);
      updateActiveSection(subTabList?.[0], routeParams?.regionId);
    }
  }, [subTabs, subTabList, setSubTabs, updateActiveSection, routeParams]);

  return (
    <DiscoverRegionTabWrapper>
      {isAdminOrSA &&
        subTabs?.length > 0 &&
        subTabs?.map(tab => {
          const regionDetail = tab === TABS.REGIONS ? regionPlaceHolderObj : existingRegions?.find(r => r.named === tab);
          return (
            <DiscoverRegionTabBgContainer active={activeSection === tab} key={tab}>
              <DiscoverRegionTab
                active={activeSection === tab}
                onClick={() => {
                  updateActiveSection(tab, undefined);
                }}>
                <DiscoverRegionTabText>{tab}</DiscoverRegionTabText>
              </DiscoverRegionTab>
              {tab !== TABS.REGIONS && (
                <MoreMenuButton isRegionTab rowDetails={regionDetail} subTabs={subTabs} setSubTabs={setSubTabs} updateActiveSection={updateActiveSection} />
              )}
            </DiscoverRegionTabBgContainer>
          );
        })}
      {isAdminOrSA && (
        <DiscoverRegionTabBgContainer active={isLastTabActive} key="Add Region">
          <DiscoverRegionAddRegionTab onClick={() => addRegion()}>
            <DiscoverRegionAddRegionTabText>+ Add Region</DiscoverRegionAddRegionTabText>
          </DiscoverRegionAddRegionTab>
        </DiscoverRegionTabBgContainer>
      )}
    </DiscoverRegionTabWrapper>
  );
}

DiscoverRegionTabs.prototype = {
  subTabs: PropTypes.shape([]),
  subTabList: PropTypes.shape([]),
  isAdminOrSA: PropTypes.bool,
  existingRegions: PropTypes.shape([]),
  activeSection: PropTypes.string,
  updateActiveSection: PropTypes.func,
  setSubTabs: PropTypes.func,
  isLastTabActive: PropTypes.bool,
  addRegion: PropTypes.func,
  detailsFromSelectedProject: PropTypes.shape([]),
  setActiveSection: PropTypes.func,
};

DiscoverRegionTabs.defaultProps = {
  subTabs: [],
  subTabList: [],
  isAdminOrSA: false,
  existingRegions: [],
  activeSection: undefined,
  updateActiveSection: () => {},
  setSubTabs: () => {},
  isLastTabActive: false,
  addRegion: () => {},
  detailsFromSelectedProject: [],
  setActiveSection: () => {},
};

export default DiscoverRegionTabs;
