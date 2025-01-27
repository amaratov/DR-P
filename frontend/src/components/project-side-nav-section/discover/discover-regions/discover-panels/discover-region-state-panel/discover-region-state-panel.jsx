import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DiscoverRegionSelectWrapper,
  DiscoverRegionTabContentInnerWrapper,
  DiscoverRegionStateTabs,
  DiscoverRegionStateTabActive,
  DiscoverRegionStateTabInactive,
  DiscoverRegionStateTabValues,
} from '../../discover-region-section-styled';
import { getDiscoverRegionTabNavTo, getSelectedDetailsFromProject, getSelectedDiscoverRegionActiveState } from '../../../../../../features/selectors/ui';
import DiscoverRegionStateBubbleIconList from './discover-region-state-bubble-icon-list';
import DiscoverRegionStateBubbleIconAdd from './discover-region-state-bubble-icon-add';
import { backendService } from '../../../../../../services/backend';
import { resetDiscoverRegionTabNavTo } from '../../../../../../features/slices/uiSlice';
import {
  DISCOVER_REGION_STATE_TABS,
  DISCOVER_REGION_FIELDS,
  FEATURE_CONFIG,
  PROJECT_DETAILS_NOTE_TYPE,
  PATH_NAME,
} from '../../../../../../utils/constants/constants';
import { getWhoAmI } from '../../../../../../features/selectors';
import DiscoverCustomerView from './customer-views';
import DiscoverRegionNotes from './discover-region-notes';
import { isEmpty } from '../../../../../../utils/utils';

const ICON_TYPES_WITH_PREVIEW = [
  DISCOVER_REGION_FIELDS.COMPLIANCE,
  DISCOVER_REGION_FIELDS.CLOUDS,
  DISCOVER_REGION_FIELDS.APPLICATIONS,
  DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.PARTNERSHIP_AND_SUPPLIERS,
  DISCOVER_REGION_FIELDS.DATA_CENTRES,
  DISCOVER_REGION_FIELDS.CUSTOMER_LOCATIONS,
];

function DiscoverRegionStatePanel() {
  // dispatch
  const dispatch = useDispatch();

  // navigate
  const navigate = useNavigate();

  // param
  const routeParams = useParams();

  // state
  const [activeTabToUpdate, setActiveTab] = useState();

  // memo
  const activeTabUpdate = useMemo(() => {
    return activeTabToUpdate || routeParams?.regionStateTab ? routeParams?.regionStateTab : DISCOVER_REGION_STATE_TABS.COMPLIANCE;
  }, [activeTabToUpdate, routeParams]);

  const activeTab = useMemo(() => {
    if (routeParams?.regionStateTab) {
      if (routeParams?.regionStateTab === 'compliance') {
        return DISCOVER_REGION_STATE_TABS.COMPLIANCE;
      }
      if (routeParams?.regionStateTab === 'data-centers') {
        return DISCOVER_REGION_STATE_TABS.DATA_CENTRES;
      }
      if (routeParams?.regionStateTab === 'clouds') {
        return DISCOVER_REGION_STATE_TABS.CLOUDS;
      }
      if (routeParams?.regionStateTab === 'applications') {
        return DISCOVER_REGION_STATE_TABS.APPLICATIONS;
      }
      if (routeParams?.regionStateTab === 'partnership-and-suppliers') {
        return DISCOVER_REGION_STATE_TABS.PARTNERSHIP_AND_SUPPLIERS;
      }
      if (routeParams?.regionStateTab === 'customer-locations') {
        return DISCOVER_REGION_STATE_TABS.CUSTOMER_LOCATIONS;
      }
    }
    return activeTabUpdate;
  }, [activeTabUpdate, routeParams]);

  // selector
  const activeRegionAndState = useSelector(getSelectedDiscoverRegionActiveState);
  const detailsFromSelectedProject = useSelector(getSelectedDetailsFromProject);
  const discoverRegionTabNavTo = useSelector(getDiscoverRegionTabNavTo);
  const whoami = useSelector(getWhoAmI);

  const isAddBubble = useMemo(() => activeTab !== DISCOVER_REGION_STATE_TABS.PARTNERSHIP_AND_SUPPLIERS, [activeTab]);
  const isPartnershipAndSuppliers = useMemo(() => activeTab === DISCOVER_REGION_STATE_TABS.PARTNERSHIP_AND_SUPPLIERS, [activeTab]);

  const iconNames = useMemo(() => {
    return detailsFromSelectedProject?.reduce((acc, detail) => {
      if (ICON_TYPES_WITH_PREVIEW.includes(detail?.type) && detail?.region === activeRegionAndState?.region) {
        if (detail?.type === DISCOVER_REGION_FIELDS.DATA_CENTRES) {
          acc.push(detail?.extras?.hosting);
        } else if (detail?.type === DISCOVER_REGION_FIELDS.CUSTOMER_LOCATIONS) {
          acc.push(detail?.extras?.officeType);
        } else if (
          (detail?.type === DISCOVER_REGION_FIELDS.CLOUDS ||
            detail?.type === DISCOVER_REGION_FIELDS.COMPLIANCE ||
            detail?.type === DISCOVER_REGION_FIELDS.APPLICATIONS ||
            detail?.type === DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.PARTNERSHIP_AND_SUPPLIERS) &&
          detail?.extras?.iconId
        ) {
          return acc;
        } else {
          acc.push(detail.named);
        }
      }
      return acc;
    }, []);
  }, [activeRegionAndState, detailsFromSelectedProject]);

  const iconIds = useMemo(() => {
    return detailsFromSelectedProject?.reduce((acc, detail) => {
      if (ICON_TYPES_WITH_PREVIEW.includes(detail?.type) && detail?.region === activeRegionAndState?.region && !isEmpty(detail?.extras?.iconId)) {
        if (
          detail?.type === DISCOVER_REGION_FIELDS.CLOUDS ||
          detail?.type === DISCOVER_REGION_FIELDS.COMPLIANCE ||
          detail?.type === DISCOVER_REGION_FIELDS.APPLICATIONS ||
          detail?.type === DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.PARTNERSHIP_AND_SUPPLIERS
        ) {
          acc.push(detail?.extras?.iconId);
        }
      }
      return acc;
    }, []);
  }, [activeRegionAndState, detailsFromSelectedProject]);
  const isAdminOrSA = useMemo(() => {
    const roleName = whoami?.role?.name?.toLowerCase();
    return FEATURE_CONFIG.ADMIN_AND_SA_ONLY.access_group.includes(roleName);
  }, [whoami]);

  // mount/unmount
  useEffect(() => {
    dispatch(backendService.getActiveCompliance());
  }, [dispatch]);

  useEffect(() => {
    if (discoverRegionTabNavTo) {
      setActiveTab(discoverRegionTabNavTo);
      dispatch(resetDiscoverRegionTabNavTo());
    }
  }, [discoverRegionTabNavTo, dispatch]);

  return (
    <DiscoverRegionTabContentInnerWrapper style={{ display: 'flex' }}>
      <DiscoverRegionSelectWrapper style={{ flexFlow: 'column', paddingLeft: '25px', gridGap: '0.5rem', width: '100%' }}>
        <DiscoverRegionStateTabs>
          {Object.values(DISCOVER_REGION_STATE_TABS).map(tab => {
            if (activeTab === tab) {
              return <DiscoverRegionStateTabActive key={`DiscoverRegionStateTabActive-${tab}`}>{tab}</DiscoverRegionStateTabActive>;
            }
            return (
              <DiscoverRegionStateTabInactive
                key={`DiscoverRegionStateTabInactive-${tab}`}
                onClick={() => {
                  setActiveTab(tab);
                  if (tab === DISCOVER_REGION_STATE_TABS.COMPLIANCE) {
                    navigate(
                      `${PATH_NAME.PROJECT_MODELER_BASE}/${routeParams?.id}${PATH_NAME.PROJECT_MODELER_REGION}/${routeParams?.regionId}${PATH_NAME.REGION_STATE_TABS.COMPLIANCE}`
                    );
                  } else if (tab === DISCOVER_REGION_STATE_TABS.DATA_CENTRES) {
                    navigate(
                      `${PATH_NAME.PROJECT_MODELER_BASE}/${routeParams?.id}${PATH_NAME.PROJECT_MODELER_REGION}/${routeParams?.regionId}${PATH_NAME.REGION_STATE_TABS.DATA_CENTERS}`
                    );
                  } else if (tab === DISCOVER_REGION_STATE_TABS.CLOUDS) {
                    navigate(
                      `${PATH_NAME.PROJECT_MODELER_BASE}/${routeParams?.id}${PATH_NAME.PROJECT_MODELER_REGION}/${routeParams?.regionId}${PATH_NAME.REGION_STATE_TABS.CLOUDS}`
                    );
                  } else if (tab === DISCOVER_REGION_STATE_TABS.APPLICATIONS) {
                    navigate(
                      `${PATH_NAME.PROJECT_MODELER_BASE}/${routeParams?.id}${PATH_NAME.PROJECT_MODELER_REGION}/${routeParams?.regionId}${PATH_NAME.REGION_STATE_TABS.APPLICATIONS}`
                    );
                  } else if (tab === DISCOVER_REGION_STATE_TABS.PARTNERSHIP_AND_SUPPLIERS) {
                    navigate(
                      `${PATH_NAME.PROJECT_MODELER_BASE}/${routeParams?.id}${PATH_NAME.PROJECT_MODELER_REGION}/${routeParams?.regionId}${PATH_NAME.REGION_STATE_TABS.PARTNERSHIP_SUPPLIERS}`
                    );
                  } else if (tab === DISCOVER_REGION_STATE_TABS.CUSTOMER_LOCATIONS) {
                    navigate(
                      `${PATH_NAME.PROJECT_MODELER_BASE}/${routeParams?.id}${PATH_NAME.PROJECT_MODELER_REGION}/${routeParams?.regionId}${PATH_NAME.REGION_STATE_TABS.CUSTOMER_LOCATIONS}`
                    );
                  }
                }}>
                {tab}
              </DiscoverRegionStateTabInactive>
            );
          })}
        </DiscoverRegionStateTabs>
        {isAdminOrSA ? (
          <DiscoverRegionStateTabValues isPartnershipAndSuppliers={isPartnershipAndSuppliers}>
            <DiscoverRegionStateBubbleIconList
              region={activeRegionAndState.region}
              future={activeRegionAndState.isFuture}
              activeTab={activeTab}
              iconNames={iconNames}
              iconIds={iconIds}
            />
            {isAddBubble && <DiscoverRegionStateBubbleIconAdd activeTab={activeTab} />}
            {activeTab === DISCOVER_REGION_STATE_TABS.COMPLIANCE && <DiscoverRegionNotes fieldId={PROJECT_DETAILS_NOTE_TYPE.COMPLIANCE_NOTE} />}
          </DiscoverRegionStateTabValues>
        ) : (
          <DiscoverCustomerView activeTab={activeTab} />
        )}
      </DiscoverRegionSelectWrapper>
    </DiscoverRegionTabContentInnerWrapper>
  );
}

DiscoverRegionStatePanel.prototype = {};

DiscoverRegionStatePanel.defaultProps = {};

export default DiscoverRegionStatePanel;
