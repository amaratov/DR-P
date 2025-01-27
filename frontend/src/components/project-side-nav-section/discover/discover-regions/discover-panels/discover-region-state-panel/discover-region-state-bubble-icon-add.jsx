import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import AddIcon from '@mui/icons-material/Add';
import {
  DiscoverRegionStateTabAddValue,
  DiscoverRegionStateBubbleContainer,
  DiscoverRegionStateBubbleContainerIcon,
  DiscoverRegionStateBubbleContainerIconCircle,
  DiscoverRegionStateBubbleAddContainer,
} from '../../discover-region-section-styled';
import { DISCOVER_REGION_FIELDS, DISCOVER_REGION_PARTNERSHIP_SUPPLIERS_ROWS, DISCOVER_REGION_STATE_TABS } from '../../../../../../utils/constants/constants';
import {
  openAddComplianceMode,
  openAddCustomerLocationsMode,
  openAddDataCenterMode,
  openAddRegionApplicationsMode,
  openAddRegionCloudsMode,
  openAddRegionPartnershipAndSuppliersMode,
} from '../../../../../../features/slices/uiSlice';

function DiscoverRegionStateBubbleIconAdd({ activeTab }) {
  // dispatch
  const dispatch = useDispatch();

  // function
  const handleAddNewValue = useCallback(() => {
    if (activeTab === DISCOVER_REGION_STATE_TABS.COMPLIANCE) {
      dispatch(openAddComplianceMode());
    } else if (activeTab === DISCOVER_REGION_STATE_TABS.DATA_CENTRES) {
      dispatch(openAddDataCenterMode());
    } else if (activeTab === DISCOVER_REGION_STATE_TABS.CLOUDS) {
      dispatch(openAddRegionCloudsMode());
    } else if (activeTab === DISCOVER_REGION_STATE_TABS.APPLICATIONS) {
      dispatch(openAddRegionApplicationsMode());
    } else if (String(activeTab).toLowerCase() === DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.NSP) {
      dispatch(openAddRegionPartnershipAndSuppliersMode(DISCOVER_REGION_PARTNERSHIP_SUPPLIERS_ROWS.NSP));
    } else if (String(activeTab).toLowerCase() === DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.VAR) {
      dispatch(openAddRegionPartnershipAndSuppliersMode(DISCOVER_REGION_PARTNERSHIP_SUPPLIERS_ROWS.VAR));
    } else if (String(activeTab).toLowerCase() === DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.SW) {
      dispatch(openAddRegionPartnershipAndSuppliersMode(DISCOVER_REGION_PARTNERSHIP_SUPPLIERS_ROWS.SW));
    } else if (String(activeTab).toLowerCase() === DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.MIGRATION) {
      dispatch(openAddRegionPartnershipAndSuppliersMode(DISCOVER_REGION_PARTNERSHIP_SUPPLIERS_ROWS.MIGRATION));
    } else if (String(activeTab).toLowerCase() === DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.HW) {
      dispatch(openAddRegionPartnershipAndSuppliersMode(DISCOVER_REGION_PARTNERSHIP_SUPPLIERS_ROWS.HW));
    } else if (activeTab === DISCOVER_REGION_STATE_TABS.CUSTOMER_LOCATIONS) {
      dispatch(openAddCustomerLocationsMode());
    }
  }, [activeTab, dispatch]);

  const handleActiveTabAddName = () => {
    if (activeTab === DISCOVER_REGION_STATE_TABS.CLOUDS) {
      return 'Add Cloud';
    }
    if (activeTab === DISCOVER_REGION_STATE_TABS.CUSTOMER_LOCATIONS) {
      return 'Add Location';
    }
    if (activeTab === DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.MIGRATION.toUpperCase()) {
      return 'Add Migration';
    }
    return `Add ${activeTab}`;
  };

  return (
    <DiscoverRegionStateTabAddValue>
      <DiscoverRegionStateBubbleAddContainer onClick={handleAddNewValue} onKeyDown={handleAddNewValue}>
        <DiscoverRegionStateBubbleContainerIcon>
          <DiscoverRegionStateBubbleContainerIconCircle style={{ padding: '0.7rem' }}>
            <DiscoverRegionStateBubbleContainerIconCircle style={{ padding: '0.2rem' }}>
              <AddIcon />
            </DiscoverRegionStateBubbleContainerIconCircle>
          </DiscoverRegionStateBubbleContainerIconCircle>
        </DiscoverRegionStateBubbleContainerIcon>
        <div>{handleActiveTabAddName()}</div>
      </DiscoverRegionStateBubbleAddContainer>
    </DiscoverRegionStateTabAddValue>
  );
}

DiscoverRegionStateBubbleIconAdd.prototype = {
  activeTab: PropTypes.string.isRequired,
};

DiscoverRegionStateBubbleIconAdd.defaultProps = {};

export default DiscoverRegionStateBubbleIconAdd;
