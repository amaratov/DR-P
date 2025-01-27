import React, { useCallback, useEffect, useState, useMemo } from 'react';
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
} from '../../my-account-styled';
import CustomButton from '../../../form-elements/custom-button';
import { AllRoles, BUTTON_ICON, BUTTON_STYLE, FEATURE_CONFIG, PATH_NAME, TABS } from '../../../../utils/constants/constants';
import SearchBar from '../../../search/search-bar';
import { TabItem, TabsWrapper } from '../../../tabs/tab-styled';
import TabPanel from '../../../tabs/tab-panel';
import { a11yProps, getFilterParams, isEmpty } from '../../../../utils/utils';
import { backendService } from '../../../../services/backend';
import Sticky from '../../../sticky/sticky';
import { GeneralContentContainer } from '../../../app/app-styled';
import MarketingList from './marketing/marketing-list';
import AddMarketingPanel from '../../add-marketing/add-marketing-panel';
import MarketingDetails from './marketing/edit-marketing/marketing-details';
import {
  openAddIconMode,
  openAddMarketingMode,
  openAddReferenceMode,
  resetFilterMode,
  resetSelectedFilterFacets,
  setOrder,
  setOrderBy,
  setPage,
} from '../../../../features/slices/uiSlice';
import { getPageNum, getRecentlyAdded, getRecentlyEdited, getSelectedFilterFacets, getSortOrder, getSortOrderBy } from '../../../../features/selectors/ui';
import ArtifactLibraryIcons from './artifact-library-icons/artifact-library-icons';
import AddArtifactLibraryIconPanel from './artifact-library-icons/add-artifact-library-icon/add-artifact-library-icon-panel';
import ReferenceArchitectureList from './reference-architecture/reference-architecture-list';
import AddReferenceArchitecturePanel from './reference-architecture/add-reference-architecture/add-reference-architecture-panel';
import ReferenceArchitectureDetails from './reference-architecture/edit-reference-architecture/reference-architecture-details';
import EditArtifactLibraryIcon from './artifact-library-icons/edit-artifact-library-icon/edit-artifact-library-icon';
import ArtifactLibraryArchives from '../artifact-library-archives/artifact-library-archives';
import Briefs from './briefs/briefs';
import ArtifactLibFilter from '../../../filters/artifact-lib-filter/artifact-lib-filter';
import { getCurrentPageForReferenceDoc, getNumPagesForReferenceDoc } from '../../../../features/selectors/referenceArchitecture';
import { getNumPagesForMarketing } from '../../../../features/selectors/marketing';
import { getWhoAmI } from '../../../../features/selectors';

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

function ArtifactLibrary() {
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
  const currentPageForRefDoc = useSelector(getCurrentPageForReferenceDoc);
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
    if (window.location.pathname === TABS.ARTIFACT_LIBRARY) {
      return TABS.MARKETING;
    }
    return selectTab(routeParams?.libraryTab) || activeTabUpdate;
  }, [activeTabUpdate, routeParams]);

  // const
  const useRole = whoami?.role?.name?.toLowerCase();
  const isFiltering = Object.values(filterFacets).some(val => !isEmpty(val));

  const isMarketing = useMemo(() => {
    return whoami?.role?.name?.toLowerCase() === AllRoles.MARKETING;
  }, [whoami?.role?.name]);
  const isAdminOrSA = useMemo(() => {
    return FEATURE_CONFIG.ADMIN_AND_SA_ONLY.access_group.includes(useRole);
  }, [useRole]);

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
    if (newVal === TABS.MARKETING) {
      navigate(`${PATH_NAME.ARTIFACT_LIBRARY}${PATH_NAME.LIBRARY_TABS.MARKETING}`);
    } else if (newVal === TABS.REFERENCE_ARCHITECTURE) {
      navigate(`${PATH_NAME.ARTIFACT_LIBRARY}${PATH_NAME.LIBRARY_TABS.REFERENCE_ARCHITECTURE}`);
    } else if (newVal === TABS.BRIEFS) {
      navigate(`${PATH_NAME.ARTIFACT_LIBRARY}${PATH_NAME.LIBRARY_TABS.BRIEFS}`);
    } else if (newVal === TABS.ICONS) {
      navigate(`${PATH_NAME.ARTIFACT_LIBRARY}${PATH_NAME.LIBRARY_TABS.ICONS}`);
    } else if (newVal === TABS.ARCHIVED_ARTIFACT) {
      navigate(`${PATH_NAME.ARTIFACT_LIBRARY}${PATH_NAME.LIBRARY_TABS.ARCHIVES}`);
    }
  };

  useEffect(() => {
    if (!isEmpty(whoami) && !isMarketing && !isAdminOrSA) {
      navigate(`${PATH_NAME.USER_PROFILE}`);
    }
  }, [whoami, isMarketing, isAdminOrSA, navigate]);

  //Get list of all marketing and reference architectures
  useEffect(async () => {
    if (activeTab === TABS.MARKETING) {
      await dispatch(backendService.getAllActiveMarketings({ archived: false, order: [['docName', 'asc']] }));
    }
    if (activeTab === TABS.REFERENCE_ARCHITECTURE) {
      await dispatch(backendService.getAllActiveReferenceArchitecture({ archived: false, order: [['docName', 'asc']] }));
    }
    if (activeTab === TABS.ARCHIVED_ARTIFACT) {
      await dispatch(backendService.getAllArchivedMarketings({ order: [['docName', 'asc']] }));
      await dispatch(backendService.getAllArchivedReferenceArchitecture({ order: [['docName', 'asc']] }));
    }
  }, []);

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
    <GeneralContentContainer>
      <Sticky />
      <PanelHeaderWrapper>
        <PanelHeaderFlexContainer>
          <PanelHeaderText>Artifact Library</PanelHeaderText>
          <PanelHeaderActions>
            <CustomButton
              buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
              icon={BUTTON_ICON.ADD_BORDERLESS}
              buttonText="Add"
              type="button"
              padding="0 8px"
              disableButton={activeTab === TABS.BRIEFS || activeTab === TABS.ARCHIVED_ARTIFACT || !(isAdminOrSA || isMarketing)}
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
      <PanelContentWrapper>
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
    </GeneralContentContainer>
  );
}

export default ArtifactLibrary;
