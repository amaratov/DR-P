import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Divider } from '@mui/material';
import {
  PanelContentNavSection,
  PanelContentSection,
  PanelContentWrapper,
  PanelHeaderActions,
  PanelHeaderFlexContainer,
  PanelHeaderText,
  PanelHeaderWrapper,
} from '../../my-accout/my-account-styled';
import CustomButton from '../../form-elements/custom-button';
import { AllRoles, BUTTON_ICON, BUTTON_STYLE, FEATURE_CONFIG, PATH_NAME, TABS } from '../../../utils/constants/constants';
import SearchBar from '../../search/search-bar';
import { TabItem, TabsWrapper } from '../../tabs/tab-styled';
import TabPanel from '../../tabs/tab-panel';
import { a11yProps, getFilterParams, isEmpty } from '../../../utils/utils';
import { backendService } from '../../../services/backend';
import MarketingList from '../../my-accout/admin-panel/artifact-library/marketing/marketing-list';
import AddMarketingPanel from '../../my-accout/add-marketing/add-marketing-panel';
import MarketingDetails from '../../my-accout/admin-panel/artifact-library/marketing/edit-marketing/marketing-details';
import {
  openAddIconMode,
  openAddMarketingMode,
  openAddReferenceMode,
  resetFilterMode,
  resetSelectedFilterFacets,
  setOrder,
  setOrderBy,
  setPage,
} from '../../../features/slices/uiSlice';
import { getPageNum, getRecentlyAdded, getRecentlyEdited, getSelectedFilterFacets, getSortOrder, getSortOrderBy } from '../../../features/selectors/ui';
import ArtifactLibraryIcons from '../../my-accout/admin-panel/artifact-library/artifact-library-icons/artifact-library-icons';
import AddArtifactLibraryIconPanel from '../../my-accout/admin-panel/artifact-library/artifact-library-icons/add-artifact-library-icon/add-artifact-library-icon-panel';
import ReferenceArchitectureList from '../../my-accout/admin-panel/artifact-library/reference-architecture/reference-architecture-list';
import AddReferenceArchitecturePanel from '../../my-accout/admin-panel/artifact-library/reference-architecture/add-reference-architecture/add-reference-architecture-panel';
import ReferenceArchitectureDetails from '../../my-accout/admin-panel/artifact-library/reference-architecture/edit-reference-architecture/reference-architecture-details';
import EditArtifactLibraryIcon from '../../my-accout/admin-panel/artifact-library/artifact-library-icons/edit-artifact-library-icon/edit-artifact-library-icon';
import ArtifactLibraryArchives from '../../my-accout/admin-panel/artifact-library-archives/artifact-library-archives';
import Briefs from '../../my-accout/admin-panel/artifact-library/briefs/briefs';
import ArtifactLibFilter from '../../filters/artifact-lib-filter/artifact-lib-filter';
import { getCurrentPageForReferenceDoc, getNumPagesForReferenceDoc } from '../../../features/selectors/referenceArchitecture';
import { getNumPagesForMarketing } from '../../../features/selectors/marketing';
import { getWhoAmI } from '../../../features/selectors';
import { ProjectSideNavContentHeader } from '../project-side-nav-section-main-styled';

function selectTab(value) {
  if (value === 'marketing') {
    return TABS.MARKETING;
  }
  if (value === 'reference-architecture') {
    return TABS.REFERENCE_ARCHITECTURE;
  }
  if (value === 'briefs') {
    return TABS.BRIEFS;
  }
  if (value === 'icons') {
    return TABS.ICONS;
  }
  if (value === 'archives') {
    return TABS.ARCHIVED_ARTIFACT;
  }
  return '';
}

function SideNavLibrary() {
  // dispatch
  const dispatch = useDispatch();

  // nav
  const navigate = useNavigate();

  // params
  const routeParams = useParams();

  // selectors
  const recentlyAddedRow = useSelector(getRecentlyAdded);
  const recentlyEditedRow = useSelector(getRecentlyEdited);
  const filterFacets = useSelector(getSelectedFilterFacets);
  const numPagesForRefDoc = useSelector(getNumPagesForReferenceDoc);
  const numPagesForMarketing = useSelector(getNumPagesForMarketing);
  const whoami = useSelector(getWhoAmI);
  const page = useSelector(getPageNum);
  const order = useSelector(getSortOrder);
  const orderBy = useSelector(getSortOrderBy);

  // state
  const [activeTabUpdate, setActiveTab] = useState(TABS.MARKETING);
  const [openSearch, setOpenSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [openFilter, setOpenFilter] = useState(false);
  const [allMarketings, setAllMarketings] = useState([]);
  const [allReferenceArchitecture, setAllReferenceArchitecture] = useState([]);

  // memo
  const activeTab = useMemo(() => {
    return selectTab(routeParams?.libraryTab) || activeTabUpdate;
  }, [activeTabUpdate, routeParams]);

  // const
  const useRole = whoami?.role?.name?.toLowerCase();
  const isMarketing = whoami?.role?.name?.toLowerCase() === AllRoles.MARKETING;
  const isAdminOrSA = FEATURE_CONFIG.ADMIN_AND_SA_ONLY.access_group.includes(useRole);
  const isFiltering = Object.values(filterFacets).some(val => !isEmpty(val));

  // func
  const handleAddButtonClicked = useCallback(() => {
    if (activeTab === TABS.ICONS) {
      dispatch(openAddIconMode());
      dispatch(backendService.searchDefaultIcons());
    }
    if (activeTab === TABS.MARKETING) {
      dispatch(setOrderBy('docName'));
      dispatch(openAddMarketingMode());
    }
    if (activeTab === TABS.REFERENCE_ARCHITECTURE) {
      dispatch(setOrderBy('docName'));
      dispatch(openAddReferenceMode());
    }
  }, [dispatch, activeTab, setOrderBy]);

  const resetSearchBar = useCallback(() => {
    setOpenSearch(false);
    setSearchText('');
  }, [setOpenSearch, setSearchText]);

  const resetFilters = useCallback(() => {
    dispatch(resetSelectedFilterFacets());
    dispatch(resetFilterMode());
  }, [dispatch]);

  const handleChange = (event, newVal) => {
    setActiveTab(newVal);
    dispatch(setOrder('asc'));
    dispatch(setPage(0));
    resetSearchBar();
    console.log(newVal);
    const projectId = routeParams?.id || 'unknown';
    if (newVal === TABS.MARKETING) {
      navigate(`${PATH_NAME.PROJECT_MODELER_BASE}/${projectId}${PATH_NAME.LIBRARY}${PATH_NAME.LIBRARY_TABS.MARKETING}`);
    } else if (newVal === TABS.REFERENCE_ARCHITECTURE) {
      navigate(`${PATH_NAME.PROJECT_MODELER_BASE}/${projectId}${PATH_NAME.LIBRARY}${PATH_NAME.LIBRARY_TABS.REFERENCE_ARCHITECTURE}`);
    } else if (newVal === TABS.BRIEFS) {
      navigate(`${PATH_NAME.PROJECT_MODELER_BASE}/${projectId}${PATH_NAME.LIBRARY}${PATH_NAME.LIBRARY_TABS.BRIEFS}`);
    } else if (newVal === TABS.ICONS) {
      navigate(`${PATH_NAME.PROJECT_MODELER_BASE}/${projectId}${PATH_NAME.LIBRARY}${PATH_NAME.LIBRARY_TABS.ICONS}`);
    } else if (newVal === TABS.ARCHIVED_ARTIFACT) {
      navigate(`${PATH_NAME.PROJECT_MODELER_BASE}/${projectId}${PATH_NAME.LIBRARY}${PATH_NAME.LIBRARY_TABS.ARCHIVES}`);
    }
  };

  // effect
  useEffect(() => {
    if (!isEmpty(whoami) && !isAdminOrSA) navigate(PATH_NAME.USER_PROFILE);
  }, [whoami, isAdminOrSA]);

  // init filter options
  useEffect(() => {
    dispatch(backendService.getAllIndustryVertical());
    dispatch(backendService.getAllUseCases());
  }, [dispatch]);

  useEffect(() => {
    const isArchived = activeTab === TABS.ARCHIVED_ARTIFACT;
    const params = getFilterParams(filterFacets, isArchived, page);
    const orderByInitialValue = orderBy === 'name' ? 'docName' : orderBy;
    params.order = [[orderByInitialValue, order]];
    params.docName = !isEmpty(searchText) ? `%${searchText}%` : '';
    if (isArchived) {
      dispatch(backendService.getAllMarketing());
      if ((!isEmpty(recentlyAddedRow) && recentlyAddedRow !== '') || (!isEmpty(recentlyEditedRow) && recentlyEditedRow !== '')) {
        dispatch(backendService.getAllMarketing());
      }
    } else {
      dispatch(backendService.getAllActiveMarketings(params));
      if ((!isEmpty(recentlyAddedRow) && recentlyAddedRow !== '') || (!isEmpty(recentlyEditedRow) && recentlyEditedRow !== '')) {
        dispatch(backendService.getAllActiveMarketings(params));
      }
    }
  }, [dispatch, recentlyAddedRow, recentlyEditedRow, order, orderBy]);

  return (
    <ProjectSideNavContentHeader>
      <PanelHeaderWrapper customPadding="30px 20px 0 20px">
        <PanelHeaderFlexContainer>
          <PanelHeaderText>Library</PanelHeaderText>
          <PanelHeaderActions>
            <CustomButton
              buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
              icon={BUTTON_ICON.ADD_BORDERLESS}
              buttonText="Add"
              type="button"
              padding="0 8px"
              disableButton={activeTab === TABS.BRIEFS || activeTab === TABS.ARCHIVED_ARTIFACT || !isAdminOrSA}
              onClickFunc={handleAddButtonClicked}
            />
            <CustomButton
              buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
              icon={BUTTON_ICON.FILTER_OUTLINED}
              buttonText="Filter"
              type="button"
              padding="0 8px"
              indicatorTop="4px"
              indicatorLeft="8px"
              showIndicator={isFiltering}
              disableButton={activeTab === TABS.ARCHIVED_ARTIFACT || activeTab === TABS.BRIEFS}
              onClickFunc={() => setOpenFilter(true)}
            />
            <CustomButton
              buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
              icon={BUTTON_ICON.SEARCH}
              buttonText="Search"
              type="button"
              padding="0 8px"
              disableButton={activeTab === TABS.ARCHIVED_ARTIFACT}
              onClickFunc={() => setOpenSearch(!openSearch)}
            />
          </PanelHeaderActions>
        </PanelHeaderFlexContainer>
        <SearchBar searchBarOpen={openSearch} searchText={searchText} setSearchText={setSearchText} activeTab={activeTab} />
        <Divider />
      </PanelHeaderWrapper>
      <PanelContentWrapper customPadding="30px 20px 0 20px">
        <PanelContentNavSection>
          <TabsWrapper value={activeTab} onChange={handleChange} TabIndicatorProps={{ style: { backgroundColor: 'var(--color-batman)' } }}>
            <TabItem label={TABS.MARKETING} {...a11yProps(0)} value={TABS.MARKETING} noPadding customMargin="0px 24px 0px 0px" />
            <TabItem label={TABS.REFERENCE_ARCHITECTURE} {...a11yProps(1)} value={TABS.REFERENCE_ARCHITECTURE} noPadding customMargin="0 24px 0 0" />
            <TabItem label={TABS.BRIEFS} {...a11yProps(2)} value={TABS.BRIEFS} noPadding customMargin="0 24px 0 0" />
            <TabItem label={TABS.ICONS} {...a11yProps(3)} value={TABS.ICONS} noPadding customMargin="0 24px 0 0" />
            <TabItem label={TABS.ARCHIVES} {...a11yProps(4)} value={TABS.ARCHIVED_ARTIFACT} noPadding customMargin="0 24px 0 0" />
          </TabsWrapper>
        </PanelContentNavSection>
        <PanelContentSection>
          <TabPanel value={activeTab} index={0} mapTo={TABS.MARKETING}>
            <MarketingList
              activeTab={activeTab}
              searchText={searchText}
              resetSearchBar={resetSearchBar}
              resetFilters={resetFilters}
              numPages={numPagesForMarketing}
            />
          </TabPanel>
          <TabPanel value={activeTab} index={1} mapTo={TABS.REFERENCE_ARCHITECTURE}>
            <ReferenceArchitectureList
              activeTab={activeTab}
              searchText={searchText}
              resetSearchBar={resetSearchBar}
              resetFilters={resetFilters}
              numPages={numPagesForRefDoc}
            />
          </TabPanel>
          <TabPanel value={activeTab} index={2} mapTo={TABS.BRIEFS}>
            <Briefs activeTab={activeTab} searchText={searchText} resetSearchBar={resetSearchBar} resetFilters={resetFilters} />
          </TabPanel>
          <TabPanel value={activeTab} index={3} mapTo={TABS.ICONS}>
            <ArtifactLibraryIcons activeTab={activeTab} searchText={searchText} resetSearchBar={resetSearchBar} resetFilters={resetFilters} />
          </TabPanel>
          <TabPanel value={activeTab} index={4} mapTo={TABS.ARCHIVED_ARTIFACT}>
            <ArtifactLibraryArchives activeTab={activeTab} resetSearchBar={resetSearchBar} resetFilters={resetFilters} />
          </TabPanel>
        </PanelContentSection>
      </PanelContentWrapper>
      <AddMarketingPanel marketings={allMarketings} setAllMarketings={setAllMarketings} />
      <AddArtifactLibraryIconPanel />
      <AddReferenceArchitecturePanel referenceArchitectures={allReferenceArchitecture} setAllReferenceArchitecture={setAllReferenceArchitecture} />
      <MarketingDetails marketings={allMarketings} setAllMarketings={setAllMarketings} />
      <ReferenceArchitectureDetails referenceArchitectures={allReferenceArchitecture} setAllReferenceArchitecture={setAllReferenceArchitecture} />
      <EditArtifactLibraryIcon />
      {openFilter && <ArtifactLibFilter activeTab={activeTab} open={openFilter} setOpenFilter={setOpenFilter} />}
    </ProjectSideNavContentHeader>
  );
}

export default SideNavLibrary;
