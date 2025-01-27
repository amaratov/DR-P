import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DiscoverRegionMain } from './discover-region-section-styled';
import { EDIT_MODE, SUB_TABS, TABS, REGION_TYPE, AllRoles, FEATURE_CONFIG, REGIONS_INNER_TABS, PATH_NAME } from '../../../../utils/constants/constants';
import { backendService } from '../../../../services/backend';
import DiscoverRegionsSetRequirements from './discover-panels/discover-regions-set-requirements/discover-regions-set-region-requirements';
import { setSelectedDiscoverRegionActiveState } from '../../../../features/slices/uiSlice';
import {
  getAddComplianceMode,
  getAddDataCenterMode,
  getAddRegionCloudsMode,
  getAddRegionApplicationsMode,
  getAddCustomerLocationsMode,
  getDiscoverRegionsSetRequirementsMode,
  getEditMode,
  getSelectedDiscoverRegionActiveState,
  getAddRegionPartnershipAndSuppliersMode,
  getFutureStateMode,
  getSelectedDetailsFromProject,
  getDiscoverRegionEditNameMode,
  getSelectedProjectDetails,
} from '../../../../features/selectors/ui';
import { getWhoAmI } from '../../../../features/selectors';
import DiscoverRegionState from './discover-region-state/discover-region-state';
import DiscoverRegionFutureState from './discover-panels/discover-region-future-state/discover-region-future-state';
import DiscoverRegionInitialSelect from './discover-region-initial-select/discover-region-initial-select';
import DiscoverRegionsEditDataCenter from './discover-panels/edit-data-center-panel/edit-data-center-panel';
import DiscoverRegionsAddClouds from './discover-panels/add-clouds-panel/add-clouds-panel';
import DiscoverRegionsAddApplications from './discover-panels/add-applications-panel/add-applications-panel';
import DiscoverRegionsEditApplication from './discover-panels/edit-application-panel/edit-applications-side-panel';
import DiscoverRegionsAddCustomerLocations from './discover-panels/add-customer-locations-panel/add-customer-locations-panel';
import DiscoverRegionsAddPartnershipAndSuppliers from './discover-panels/add-partnership-and-supplier-panel/add-partnership-and-suppliers-panel';
import DiscoverRegionsAddCompliance from './discover-panels/add-compliance-panel/add-compliance-panel';
import { isEmpty } from '../../../../utils/utils';
import AddCloudsSidePanel from './discover-panels/add-clouds-panel/add-clouds-side-panel';
import EditArtifactLibraryIcon from '../../../my-accout/admin-panel/artifact-library/artifact-library-icons/edit-artifact-library-icon/edit-artifact-library-icon';
import DiscoverRegionTabs from './discover-region-tabs';

const regionPlaceHolderObj = {
  named: TABS.REGIONS,
  region: TABS.REGIONS,
  type: 'regions',
  view: SUB_TABS.INITIAL_REGIONS,
};

function DiscoverRegionSection() {
  // dispatch
  const dispatch = useDispatch();

  // params
  const routeParams = useParams();

  // navigate
  const navigate = useNavigate();

  // selector
  const activeSetRequirements = useSelector(getDiscoverRegionsSetRequirementsMode);
  const activeRegionAndState = useSelector(getSelectedDiscoverRegionActiveState);
  const addCompliance = useSelector(getAddComplianceMode);
  const addDataCenter = useSelector(getAddDataCenterMode);
  const addClouds = useSelector(getAddRegionCloudsMode);
  const addApplications = useSelector(getAddRegionApplicationsMode);
  const addCustomerLocations = useSelector(getAddCustomerLocationsMode);
  const addPartnershipAndSuppliers = useSelector(getAddRegionPartnershipAndSuppliersMode);
  const editMode = useSelector(getEditMode);
  const futureStateMode = useSelector(getFutureStateMode);
  const detailsFromSelectedProject = useSelector(getSelectedDetailsFromProject);
  const whoami = useSelector(getWhoAmI);
  const editRegionNameModeInfo = useSelector(getDiscoverRegionEditNameMode);
  const currentProjectInfo = useSelector(getSelectedProjectDetails);

  //const
  const roleName = whoami?.role?.name?.toLowerCase();
  const isCustomer = roleName === AllRoles.CUSTOMER;
  const isAdminOrSA = FEATURE_CONFIG.ADMIN_AND_SA_ONLY.access_group.includes(roleName);
  const editRegionNameMode = !isEmpty(editRegionNameModeInfo);
  const projectId = currentProjectInfo?.id || routeParams?.id || window.location.pathname.split('/')[2];

  // memo
  const subTabList = useMemo(() => {
    const regions = detailsFromSelectedProject?.filter(x => x?.type === REGION_TYPE);
    return regions?.length === 0
      ? [TABS.REGIONS]
      : regions?.map(x => {
          return x.named;
        });
  }, [detailsFromSelectedProject]);

  const existingRegions = useMemo(() => {
    const regionDetails = detailsFromSelectedProject?.filter(d => d?.type === REGION_TYPE);
    return regionDetails?.length === 0 ? [regionPlaceHolderObj] : regionDetails;
  }, [detailsFromSelectedProject]);

  // state
  const [activeSection, setActiveSection] = useState();
  const [subTabs, setSubTabs] = useState(subTabList);

  // const activeSection = useMemo(() => {
  //   const detailedValue = detailsFromSelectedProject?.filter(x => x?.id === routeParams?.regionId);
  //   const routeValue = routeParams?.regionId ? detailedValue?.[0]?.named : subTabList?.[0];
  //   if (detailedValue?.length > 0) {
  //     dispatch(
  //       setSelectedDiscoverRegionActiveState({
  //         regionName: detailedValue?.[0]?.named || TABS.REGIONS,
  //         region: detailedValue?.[0]?.region || '',
  //         view: SUB_TABS.STATE_VIEW,
  //         state: detailedValue?.[0]?.stateInfo,
  //         isFuture: detailedValue?.[0]?.isFuture,
  //       })
  //     );
  //   }
  //   if (activeSectionUpload === TABS.REGIONS) {
  //     return activeSectionUpload;
  //   }
  //   return routeValue || activeSectionUpload;
  // }, [routeParams, detailsFromSelectedProject, subTabList, activeSectionUpload, dispatch]);

  const selectedProject = useMemo(() => {
    return detailsFromSelectedProject.length === 0 ? [] : detailsFromSelectedProject?.filter(x => x?.named === activeSection);
  }, [detailsFromSelectedProject, activeSection]);

  const isLastTabActive = useMemo(() => {
    return existingRegions?.length > 0 && activeSection === existingRegions[existingRegions.length - 1]?.named;
  }, [existingRegions, activeSection]);

  // func
  const updateActiveSection = useCallback(
    async (section, forceUpdate) => {
      let foundDetail = {};
      // Should only happen in situation of removing all regions
      let forceUpdateCheckFail = false;
      const details = await dispatch(backendService.getProjectDetails(projectId));
      if (forceUpdate === undefined) {
        foundDetail = await detailsFromSelectedProject.find(detail => detail?.named === section);
      } else {
        foundDetail = await details?.payload?.details.find(detail => detail?.id === forceUpdate);
        if (isEmpty(foundDetail)) {
          forceUpdateCheckFail = true;
          foundDetail = await details?.payload?.details.find(detail => detail?.named === section);
        }
      }
      if (section !== TABS.REGIONS && foundDetail !== undefined) {
        await dispatch(
          setSelectedDiscoverRegionActiveState({
            regionName: foundDetail?.named,
            region: foundDetail?.region,
            view: SUB_TABS.STATE_VIEW,
            state: foundDetail?.stateInfo,
            isFuture: foundDetail?.isFuture,
          })
        );
        const firstHalf = await `${PATH_NAME.PROJECT_MODELER_BASE}/${projectId}${PATH_NAME.PROJECT_MODELER_REGION}/${foundDetail?.id || routeParams?.regionId}`;
        const secondHalf = await (routeParams?.regionStateTab ? `/${routeParams?.regionStateTab}` : PATH_NAME.REGION_STATE_TABS.COMPLIANCE);
        if (window.location.pathname !== firstHalf + secondHalf) {
          await navigate(firstHalf + secondHalf);
        }
      } else {
        const regionName = !isEmpty(section) ? section : TABS.REGIONS;
        await dispatch(
          setSelectedDiscoverRegionActiveState({
            regionName,
            region: '',
            view: SUB_TABS.INITIAL_REGIONS,
            state: REGIONS_INNER_TABS.CURRENT_STATE,
            isFuture: false,
          })
        );
        await navigate(`${PATH_NAME.PROJECT_MODELER_BASE}/${projectId}${PATH_NAME.PROJECT_MODELER_REGION}`);
      }

      await setActiveSection(forceUpdate === undefined || forceUpdateCheckFail ? section || TABS.REGIONS : foundDetail?.named);
    },
    [dispatch, setActiveSection, detailsFromSelectedProject, navigate, projectId, routeParams]
  );

  const addRegion = () => {
    if (!subTabs.includes(TABS.REGIONS)) {
      setSubTabs([...subTabs, TABS.REGIONS]);
    } else {
      console.log(`Set the value in ${TABS.REGIONS} first!`);
    }
  };

  // effect
  //handle on mount/unmount
  useEffect(() => {
    dispatch(backendService.getProjectDetails(projectId));
    dispatch(backendService.getAllActiveIcon());
  }, [dispatch]);

  return (
    <DiscoverRegionMain>
      <DiscoverRegionTabs
        subTabs={subTabs}
        subTabList={subTabList}
        isAdminOrSA={isAdminOrSA}
        existingRegions={existingRegions}
        activeSection={activeSection}
        updateActiveSection={updateActiveSection}
        setSubTabs={setSubTabs}
        isLastTabActive={isLastTabActive}
        addRegion={addRegion}
      />
      {activeSection === TABS.REGIONS && <DiscoverRegionInitialSelect regionName={activeSection} existingRegions={existingRegions} />}
      {(activeSetRequirements || editRegionNameMode) && (
        <DiscoverRegionsSetRequirements
          activeId={editRegionNameModeInfo?.id}
          subTabs={subTabs}
          setSubTabs={setSubTabs}
          setActiveSection={setActiveSection}
          editRegionNameModeInfo={editRegionNameModeInfo}
          setShowAddRegionTab={() => {}}
        />
      )}
      {activeSection !== TABS.REGIONS && <DiscoverRegionState />}
      {addCompliance && <DiscoverRegionsAddCompliance />}
      {futureStateMode && <DiscoverRegionFutureState />}
      {/* For Customer Locations, need to be first in the order so the panels defined later can appear above in the browser */}
      {(addCustomerLocations || editMode === EDIT_MODE.EDIT_REGION_CUSTOMER_LOCATIONS) && <DiscoverRegionsAddCustomerLocations />}
      {/* ^ Customer Locations */}
      {addClouds && <DiscoverRegionsAddClouds selectedProject={selectedProject} />}
      {addApplications && <DiscoverRegionsAddApplications />}
      {addPartnershipAndSuppliers !== '' && <DiscoverRegionsAddPartnershipAndSuppliers />}
      {(addDataCenter || editMode === EDIT_MODE.EDIT_REGION_DATA_CENTRE) && <DiscoverRegionsEditDataCenter />}
      {editMode === EDIT_MODE.EDIT_REGION_DATA_CENTRE && <DiscoverRegionsEditDataCenter />}
      {editMode === EDIT_MODE.EDIT_REGION_CLOUDS && <AddCloudsSidePanel isEdit />}
      {editMode === EDIT_MODE.EDIT_REGION_APPLICATIONS && <DiscoverRegionsEditApplication />}
      <EditArtifactLibraryIcon />
    </DiscoverRegionMain>
  );
}

DiscoverRegionSection.prototype = {};

DiscoverRegionSection.defaultProps = {};

export default DiscoverRegionSection;
