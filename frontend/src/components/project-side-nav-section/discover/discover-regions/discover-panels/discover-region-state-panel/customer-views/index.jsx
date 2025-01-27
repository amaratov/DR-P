import React, { useEffect, useMemo } from 'react';
import invert from 'lodash/invert';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import CustomerViewDatacenter from './datacenter';
import CustomerViewCompliance from './compliance';
import CustomerViewClouds from './clouds';
import CustomerViewApplications from './applications';
import CustomerViewPartnershipSuppliers from './partnership-suppliers';
import CustomerViewCustomerLocations from './customer-locations';
import { findDifferences, isEmpty, pairEquivalentObjects } from '../../../../../../../utils/utils';
import { DiscoverCustomerViewRegionHeader, DiscoverRegionEmpty, DiscoverRegionEmptyHeader } from '../discover-region-state-panel-styled';
import { getAllActiveIcons } from '../../../../../../../features/selectors/artifactIcon';
import { DISCOVER_REGION_FIELDS, DISCOVER_REGION_STATE_TABS, DISCOVER_REGION_TABS_LINKED_TO_DETAIL_TYPE } from '../../../../../../../utils/constants/constants';
import { backendService } from '../../../../../../../services/backend';
import { getSelectedDetailsFromProject } from '../../../../../../../features/selectors/ui';
import logo from '../../../../../../../images/Digital_Realty_TM_Brandmark_RGB_White 1.png';

const ICON_TYPES_WITH_PREVIEW = [
  DISCOVER_REGION_FIELDS.COMPLIANCE,
  DISCOVER_REGION_FIELDS.CLOUDS,
  DISCOVER_REGION_FIELDS.APPLICATIONS,
  DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.PARTNERSHIP_AND_SUPPLIERS,
  DISCOVER_REGION_FIELDS.DATA_CENTRES,
  DISCOVER_REGION_FIELDS.CUSTOMER_LOCATIONS,
];

const invertedTabTypes = invert(DISCOVER_REGION_TABS_LINKED_TO_DETAIL_TYPE);

const mappedCustomerViewComponents = {
  compliances: CustomerViewCompliance,
  datacenters: CustomerViewDatacenter,
  clouds: CustomerViewClouds,
  applications: CustomerViewApplications,
  partnersuppliers: CustomerViewPartnershipSuppliers,
  customerlocations: CustomerViewCustomerLocations,
};

function renderCustomerViewComponent(props) {
  const detailType = props?.type === 'notes' && props?.named.startsWith('partner') ? 'partnersuppliers' : props?.type;
  const CustomerDetailView = mappedCustomerViewComponents[detailType];
  return CustomerDetailView ? <CustomerDetailView {...props} /> : null;
}

function compareRegion(a, b) {
  if (a.region > b.region) {
    return 1;
  }
  if (a.region < b.region) {
    return -1;
  }
  return 0;
}

function checkForPartnerNotesFromPartnerDetail(newDetail) {
  return function ({ isFuture, named, region, type }) {
    return isFuture === newDetail.isFuture && named === newDetail.named && region === newDetail.region && type === newDetail.type;
  };
}

function getPartnerIconsFromProject(acc, detail) {
  return ICON_TYPES_WITH_PREVIEW.includes(detail?.type) ? acc.concat(detail.named) : acc;
}

function DiscoverCustomerView({ activeTab }) {
  const dispatch = useDispatch();

  const icons = useSelector(getAllActiveIcons);
  const detailsFromSelectedProject = useSelector(getSelectedDetailsFromProject);

  const activeTabProjectDetails = useMemo(() => {
    const detailTypes = activeTab ? [DISCOVER_REGION_TABS_LINKED_TO_DETAIL_TYPE[activeTab]] : Object.values(DISCOVER_REGION_TABS_LINKED_TO_DETAIL_TYPE);
    // With the reduce, the resulting data will have key/value, key is the region, value will have lists filtered for
    // details that are current and future for the active tab
    const tabs = (detailsFromSelectedProject || []).reduce((acc, crr, _, projectDetails) => {
      const tabKey = activeTab || invertedTabTypes[crr.type];
      if (detailTypes.includes(crr.type)) {
        const tab = acc[tabKey] || {};
        const region = tab[crr.region] || { currents: [], futures: [] };
        const stateInfoKey = crr.isFuture ? 'futures' : 'currents';
        region[stateInfoKey].push(crr);
        tab[crr.region] = region;
        acc[tabKey] = tab;
      }
      // This is an anomaly for when there are added partner and suppliers but there are no included notes, so need to check
      // all the project detail items if there is no notes details and add an empty notes for the partnersuppliers customer view to
      // display in the same manner as all the other types of details.
      // There should only be 1 item per kind of note (1 card for each NSP, SW, Mig, etc)
      if (crr.type === 'partnersuppliers' && (!activeTab || activeTab === DISCOVER_REGION_STATE_TABS.PARTNERSHIP_AND_SUPPLIERS)) {
        const { partnerType } = crr.extras;
        const newDetail = {
          isFuture: crr.isFuture,
          named: `partner_${partnerType}_note`,
          projectNotes: null,
          region: crr.region,
          type: 'notes',
        };
        if (isEmpty(projectDetails.filter(checkForPartnerNotesFromPartnerDetail(newDetail)))) {
          const tab = acc[DISCOVER_REGION_STATE_TABS.PARTNERSHIP_AND_SUPPLIERS] || {};
          const region = tab[newDetail.region] || { currents: [], futures: [] };
          const stateInfoKey = newDetail.isFuture ? 'futures' : 'currents';
          region[stateInfoKey].push(newDetail);
          tab[newDetail.region] = region;
          acc[DISCOVER_REGION_STATE_TABS.PARTNERSHIP_AND_SUPPLIERS] = tab;
        }
      }
      return acc;
    }, {});

    // The customer view needs to display the differences between the current requirements and future requirements
    // if current or future is undefined for a pair, it should still display in the UI but with the missing styled elements
    return Object.entries(tabs).map(([tab, regions]) => {
      return {
        [tab]: Object.entries(regions)
          .map(([region, states]) => {
            const paired = pairEquivalentObjects(states.currents, states.futures, (a, b) => a?.named === b?.named);
            const requirements = paired.map(([current, future]) => [current, future, findDifferences(current, future)]);
            return { region, requirements };
          })
          .sort(compareRegion),
      };
    });
  }, [activeTab, detailsFromSelectedProject]);

  useEffect(() => {
    const iconNames = detailsFromSelectedProject.reduce(getPartnerIconsFromProject, []);
    if (!isEmpty(iconNames)) {
      dispatch(backendService.searchPreviewIcons({ iconNames }));
    }
  }, [dispatch, detailsFromSelectedProject]);

  return (
    <Box alignContent="stretch" display="grid" gridTemplateColumns="repeat(16, 1fr)" gap={2}>
      {activeTabProjectDetails.map(tab =>
        Object.entries(tab).map(([title, regions]) => {
          return (
            <>
              {!activeTab ? (
                // paddingTop is intended for the page margin when rendering for a PDF
                <Box item gridColumn="-1/1" sx={{ breakBefore: 'page' }} paddingTop="0.75in">
                  <h2 style={{ margin: 0 }}>{title}</h2>
                </Box>
              ) : null}
              <Box gridColumn="span 8">
                <p style={{ color: 'var(--color-aluminium)' }}>Current Requirements</p>
              </Box>
              <Box gridColumn="span 8">
                <p style={{ color: 'var(--color-aluminium)' }}>Future Requirements</p>
              </Box>
              {regions.map(({ region, requirements }) => (
                <>
                  <Box item display="flex" gridColumn="span 8">
                    <DiscoverCustomerViewRegionHeader>{region}</DiscoverCustomerViewRegionHeader>
                  </Box>
                  <Box item display="flex" gridColumn="span 8">
                    <DiscoverCustomerViewRegionHeader>{region}</DiscoverCustomerViewRegionHeader>
                  </Box>
                  {requirements.map(([current, future, differences]) => (
                    <>
                      <Box item display="flex" gridColumn="span 8" sx={{ breakInside: 'avoid' }}>
                        {current ? (
                          renderCustomerViewComponent({ ...current, differences, hasPair: future !== undefined, icons })
                        ) : (
                          <DiscoverRegionEmpty>
                            <DiscoverRegionEmptyHeader>{future?.named}</DiscoverRegionEmptyHeader>
                          </DiscoverRegionEmpty>
                        )}
                      </Box>
                      <Box item display="flex" gridColumn="span 8" sx={{ breakInside: 'avoid' }}>
                        {future ? (
                          renderCustomerViewComponent({ ...future, differences, hasPair: current !== undefined, icons })
                        ) : (
                          <DiscoverRegionEmpty>
                            <DiscoverRegionEmptyHeader>{current?.named}</DiscoverRegionEmptyHeader>
                          </DiscoverRegionEmpty>
                        )}
                      </Box>
                    </>
                  ))}
                </>
              ))}
            </>
          );
        })
      )}
    </Box>
  );
}

DiscoverCustomerView.prototype = {
  activeTab: PropTypes.string,
};

DiscoverCustomerView.defaultProps = {
  activeTab: null,
};

export default DiscoverCustomerView;
