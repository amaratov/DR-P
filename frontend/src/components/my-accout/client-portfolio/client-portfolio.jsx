import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  PanelContentNavSection,
  PanelContentSection,
  PanelContentWrapper,
  PanelHeaderActions,
  PanelHeaderFlexContainer,
  PanelHeaderText,
  PanelHeaderWrapper,
} from '../my-account-styled';
import CustomButton from '../../form-elements/custom-button';
import { AllRoles, BUTTON_ICON, BUTTON_STYLE, FEATURE_CONFIG, PATH_NAME, TABS } from '../../../utils/constants/constants';
import SearchBar from '../../search/search-bar';
import { TabItem, TabsWrapper } from '../../tabs/tab-styled';
import TabPanel from '../../tabs/tab-panel';
import CompanyList from './company-list';
import AddCompanyPanel from '../add-company/add-company-panel';
import { a11yProps, isEmpty, usePrevious } from '../../../utils/utils';
import { backendService } from '../../../services/backend';
import {
  getCompaniesWithCreatorFullName,
  getCurrentPageForCompany,
  getIsLoadingCompanies,
  getNumPagesForCompany,
  getSearchedCompaniesWithCreatorFullName,
} from '../../../features/selectors/company';

import {
  openAddCompanyMode,
  resetRecentlyArchived,
  setOrder,
  setOrderBy,
  setPage,
  setClientPortfolioTab,
  setSelectedProjectDetails,
} from '../../../features/slices/uiSlice';
import { canAccessAddFeature, getHasRolesLoaded, getWhoAmI } from '../../../features/selectors';
import Sticky from '../../sticky/sticky';
import {
  getSelectedCompanyDetails,
  getAddCompanyMode,
  getRecentlyArchived,
  getPageNum,
  getSortOrder,
  getSortOrderBy,
  getClientPortfolioTab,
} from '../../../features/selectors/ui';
import { DRDivider, GeneralContentContainer } from '../../app/app-styled';
import { SearchResultWrapper } from '../../search/search-bar-styled';
import ArchiveCompanyPanel from './archive-company/archive-company-panel';

function ClientPortfolio({ isMyCompanies, isArchives }) {
  // dispatch
  const dispatch = useDispatch();

  // nav
  const navigate = useNavigate();

  // selectors
  const activeTabUpdate = useSelector(getClientPortfolioTab);
  const companies = useSelector(getCompaniesWithCreatorFullName);
  const searchedCompanies = useSelector(getSearchedCompaniesWithCreatorFullName);
  const isLoading = useSelector(getIsLoadingCompanies);
  const hasRoleLoaded = useSelector(getHasRolesLoaded);
  const showAddButton = useSelector(canAccessAddFeature);
  const selectedComp = useSelector(getSelectedCompanyDetails);
  const whoami = useSelector(getWhoAmI);
  const isAddCompanyMode = useSelector(getAddCompanyMode);
  const isRecentlyArchived = useSelector(getRecentlyArchived);
  const numPages = useSelector(getNumPagesForCompany);
  const currentPage = useSelector(getCurrentPageForCompany);
  const page = useSelector(getPageNum);
  const order = useSelector(getSortOrder);
  const orderBy = useSelector(getSortOrderBy);

  // state
  const [openSearch, setOpenSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [activeCompanies, setActiveCompanies] = useState(companies);

  // prev
  const prevSelectedComp = usePrevious(selectedComp);

  //const
  const roleName = whoami?.role?.name?.toLowerCase();
  const isMarketing = roleName === AllRoles.MARKETING;
  const isAdminOrSA = FEATURE_CONFIG.ADMIN_AND_SA_ONLY.access_group.includes(roleName);

  // memo
  const activeTab = useMemo(() => {
    if (window.location.pathname === PATH_NAME.CLIENT_PORTFOLIO) {
      if (roleName === AllRoles.CUSTOMER || roleName === AllRoles.SOLUTIONS_ENGINEER || roleName === AllRoles.SALES) {
        if (window.location.pathname !== `${PATH_NAME.CLIENT_PORTFOLIO}${PATH_NAME.MY_COMPANIES}`) {
          navigate(`${PATH_NAME.CLIENT_PORTFOLIO}${PATH_NAME.MY_COMPANIES}`);
          dispatch(backendService.getMyCompaniesByParams({ archived: false, page, order: [[orderBy, order]] }));
        }
        return TABS.MY_COMPANIES;
      }
      return TABS.ALL_COMPANIES;
    }
    return (isMyCompanies && TABS.MY_COMPANIES) || (isArchives && TABS.ARCHIVED_COMPANIES) || activeTabUpdate || TABS.ALL_COMPANIES;
  }, [activeTabUpdate, isMyCompanies, isArchives, navigate, dispatch, page, order, orderBy, roleName]);

  window.addEventListener('popstate', event => {
    console.log(window.location.pathname);
    console.log(`location: ${window.location.pathname}, state: ${JSON.stringify(event.state)}`);
    if (window.location.pathname === '/login') {
      // const stateObj = { login: 'client-portfolio' };
      // window.history.replaceState(stateObj, '', 'client-portfolio');
      window.location.replace('/');
    }
  });

  // func
  const handleAddCompanyClick = useCallback(() => {
    dispatch(openAddCompanyMode());
  }, [dispatch]);

  const handleChange = (event, newVal) => {
    dispatch(setPage(0));
    dispatch(setOrder('asc'));
    dispatch(setOrderBy('name'));
    dispatch(setClientPortfolioTab(newVal));
    if (newVal === TABS.ALL_COMPANIES) {
      navigate(`${PATH_NAME.CLIENT_PORTFOLIO}`);
      dispatch(backendService.getCompaniesByParams({ archived: false, page, order: [[orderBy, order]] }));
    }
    if (newVal === TABS.ARCHIVED_COMPANIES) {
      navigate(`${PATH_NAME.CLIENT_PORTFOLIO}${PATH_NAME.COMPANY_ARCHIVES}`);
      dispatch(backendService.getCompaniesByParams({ archived: true, page, order: [[orderBy, order]] }));
    }
    if (newVal === TABS.MY_COMPANIES) {
      navigate(`${PATH_NAME.CLIENT_PORTFOLIO}${PATH_NAME.MY_COMPANIES}`);
      dispatch(backendService.getMyCompaniesByParams({ archived: false, page, order: [[orderBy, order]] }));
    }
  };

  useEffect(() => {
    dispatch(backendService.whoami());
    dispatch(setSelectedProjectDetails({}));
  }, [dispatch]);

  useEffect(() => {
    if (isMarketing) {
      navigate('/artifact-library');
    } else if (!isAdminOrSA) {
      dispatch(setClientPortfolioTab(TABS.MY_COMPANIES));
    } else {
      dispatch(setClientPortfolioTab(TABS.ALL_COMPANIES));
    }
  }, [isAdminOrSA, isMarketing]);

  useEffect(() => {
    dispatch(backendService.getAllIndustryVertical());
    dispatch(backendService.getAllUseCases());
    if (!hasRoleLoaded) dispatch(backendService.getRoles());
    if (!isAddCompanyMode) {
      const sortOrderBy =
        orderBy === 'projectCount'
          ? [
              ['name', order],
              ['id', order],
              ['industryVertical', order],
            ]
          : [[orderBy, order]];
      if (activeTab === TABS.ALL_COMPANIES) {
        dispatch(backendService.getCompaniesByParams({ archived: false, page, order: sortOrderBy }));
      } else if (activeTab === TABS.MY_COMPANIES) {
        dispatch(backendService.getMyCompaniesByParams({ archived: false, page, order: sortOrderBy }));
      } else if (activeTab === TABS.ARCHIVED_COMPANIES) {
        dispatch(backendService.getCompaniesByParams({ archived: true, page, order: sortOrderBy }));
      }
    }
  }, [dispatch, hasRoleLoaded, isAddCompanyMode, activeTab, page, order, orderBy]);

  useEffect(() => {
    if (activeTab === TABS.MY_COMPANIES && isEmpty(selectedComp) && !isEmpty(prevSelectedComp)) {
      const refreshMyComp = prevSelectedComp?.associatedUsers?.some(usr => usr.id === whoami?.id);
      if (refreshMyComp) {
        const sortOrderBy =
          orderBy === 'projectCount'
            ? [
                ['name', order],
                ['id', order],
                ['industryVertical', order],
              ]
            : [[orderBy, order]];
        dispatch(backendService.getMyCompaniesByParams({ archived: false, page, order: sortOrderBy }));
      }
    }
  }, [activeTab, selectedComp, prevSelectedComp, whoami, dispatch]);

  useEffect(() => {
    if (activeTab === TABS.MY_COMPANIES && !isEmpty(searchText)) {
      const filterMyCompanies = searchedCompanies?.filter(company => {
        return company.name.toLowerCase().includes(searchText.toLowerCase());
      });
      setActiveCompanies(filterMyCompanies);
    } else if (activeTab === TABS.MY_COMPANIES && isRecentlyArchived) {
      dispatch(resetRecentlyArchived());
    } else if (activeTab === TABS.MY_COMPANIES) {
      setActiveCompanies(companies);
    }
  }, [activeTab, searchText, companies, searchedCompanies, isRecentlyArchived, dispatch]);

  return (
    <GeneralContentContainer>
      <Sticky />
      <PanelHeaderWrapper>
        <PanelHeaderFlexContainer>
          <PanelHeaderText>{isAdminOrSA ? 'Client Portfolio' : 'My Companies'}</PanelHeaderText>
          <PanelHeaderActions>
            {showAddButton && (
              <CustomButton
                buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
                icon={BUTTON_ICON.ADD_BORDERLESS}
                buttonText="Add Company"
                type="button"
                padding="0 24px 0 0"
                onClickFunc={handleAddCompanyClick}
              />
            )}
            <CustomButton
              buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
              icon={BUTTON_ICON.SEARCH}
              buttonText="Search"
              type="button"
              padding="2px 0 0 0"
              onClickFunc={() => setOpenSearch(!openSearch)}
            />
          </PanelHeaderActions>
        </PanelHeaderFlexContainer>
        <SearchBar searchBarOpen={openSearch} searchText={searchText} setSearchText={setSearchText} activeTab={activeTab} />
        <DRDivider />
        {!isEmpty(searchText) && openSearch && (
          <SearchResultWrapper>{!isAdminOrSA ? activeCompanies?.length : searchedCompanies?.length || '0'} Results</SearchResultWrapper>
        )}
      </PanelHeaderWrapper>
      <PanelContentWrapper>
        <PanelContentNavSection>
          <TabsWrapper value={activeTab} onChange={handleChange} TabIndicatorProps={{ style: { backgroundColor: 'var(--color-batman)' } }}>
            <TabItem label={TABS.MY_COMPANIES} {...a11yProps(0)} value={TABS.MY_COMPANIES} noPadding customMargin="0 24px 0 0" />
            {isAdminOrSA && <TabItem label={TABS.ALL_COMPANIES} {...a11yProps(1)} value={TABS.ALL_COMPANIES} noPadding customMargin="0 24px 0 0" />}
            {isAdminOrSA && <TabItem label={TABS.ARCHIVES} {...a11yProps(2)} value={TABS.ARCHIVED_COMPANIES} noPadding />}
          </TabsWrapper>
        </PanelContentNavSection>
        <PanelContentSection>
          <TabPanel value={activeTab} index={0} mapTo={TABS.MY_COMPANIES}>
            <CompanyList
              activeTab={activeTab}
              availableCompanies={activeCompanies}
              searchText={searchText}
              isLoading={isLoading}
              myCompanies
              isAdminOrSA={isAdminOrSA}
              numPages={numPages}
              currentPage={currentPage}
            />
          </TabPanel>
          {isAdminOrSA && (
            <TabPanel value={activeTab} index={1} mapTo={TABS.ALL_COMPANIES}>
              <CompanyList
                activeTab={activeTab}
                availableCompanies={isEmpty(searchText) ? companies : searchedCompanies}
                searchText={searchText}
                isLoading={isLoading}
                isAdminOrSA={isAdminOrSA}
                numPages={numPages}
                currentPage={currentPage}
              />
            </TabPanel>
          )}
          {isAdminOrSA && (
            <TabPanel value={activeTab} index={2} mapTo={TABS.ARCHIVED_COMPANIES}>
              <CompanyList
                activeTab={activeTab}
                availableCompanies={isEmpty(searchText) ? companies : searchedCompanies}
                searchText={searchText}
                isLoading={isLoading}
                isAdminOrSA={isAdminOrSA}
                numPages={numPages}
                currentPage={currentPage}
              />
            </TabPanel>
          )}
        </PanelContentSection>
      </PanelContentWrapper>
      <AddCompanyPanel />
      <ArchiveCompanyPanel activeTab={activeTab} />
    </GeneralContentContainer>
  );
}

ClientPortfolio.propTypes = {
  isMyCompanies: PropTypes.bool,
  isArchives: PropTypes.bool,
};

ClientPortfolio.defaultProps = {
  isMyCompanies: false,
  isArchives: false,
};

export default ClientPortfolio;
