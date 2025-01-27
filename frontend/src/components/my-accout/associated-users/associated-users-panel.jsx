import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, Pagination, selectClasses } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  SidePanelContentWrapper,
  SidePanelDrawerWrapper,
  SidePanelHeaderActionContainer,
  SidePanelHeaderCloseBtn,
  SidePanelHeaderWrapper,
  SidePanelMainWrapper,
} from '../../side-panel/side-panel-styled';
import { TabItem, TabsWrapper } from '../../tabs/tab-styled';
import { BUTTON_ICON, BUTTON_STYLE, TABS } from '../../../utils/constants/constants';
import { a11yProps, isEmpty } from '../../../utils/utils';
import CustomButton from '../../form-elements/custom-button';
import SearchBar from '../../search/search-bar';
import TabPanel from '../../tabs/tab-panel';
import UserList from '../admin-panel/user-management/user-list';
import { getAllRoles, getAllUsers, getAssociatedUsers, getSearchedAssociatedUsers } from '../../../features/selectors';
import { backendService } from '../../../services/backend';
import { openAddUserMode } from '../../../features/slices/uiSlice';
import AssociatedUserPanelFilter from './associated-user-panel-filter';
import { DRDivider } from '../../app/app-styled';
import { getCompanies } from '../../../features/selectors/company';
import {
  getAddUserMode,
  getClientPortfolioTab,
  getSelectedCompany,
  getSelectedCompanyDetails,
  getSelectedProjectDetails,
} from '../../../features/selectors/ui';

function AssociatedUsersPanel({ openAssociatedUsers, setOpenAssociatedUsers, additionalValues, handleClick, leftPositionDrawerContainer }) {
  // dispatch
  const dispatch = useDispatch();

  // state
  const [activeTab, setActiveTab] = useState(TABS.DR_TEAM);
  const [searchText, setSearchText] = useState('');
  const [openFilter, setOpenFilter] = useState(false);
  const [filterTerms, setFilterTerms] = useState([]);
  const [pageCustomers, setPageCustomers] = useState(1);
  const [pageDrTeam, setPageDrTeam] = useState(1);

  // selectors
  const allUsers = useSelector(getAllUsers);
  const isAddUserMode = useSelector(getAddUserMode);
  const associatedUsers = useSelector(getAssociatedUsers);
  const filteredUsers = useSelector(state => getSearchedAssociatedUsers(state, { searchText, filterTerms }));
  const allRoles = useSelector(getAllRoles);
  const selectedProjectDetails = useSelector(getSelectedProjectDetails);
  const portfolioActiveTab = useSelector(getClientPortfolioTab);

  // memo
  const customerRole = useMemo(() => allRoles?.find(role => role?.name?.toLowerCase() === 'customer'), [allRoles]);
  const drTeamRoles = useMemo(() => allRoles?.filter(role => role?.name?.toLowerCase() !== 'customer'), [allRoles]);

  const filteredResults = useMemo(
    () => (isEmpty(searchText) && isEmpty(filterTerms) ? associatedUsers : filteredUsers),
    [searchText, associatedUsers, filteredUsers, filterTerms]
  );

  const customers = useMemo(() => {
    const { company } = selectedProjectDetails;
    const { associatedUsers: projectCompanyAssociatedUsers } = company || { associatedUsers: [] };

    // console.log('cust memo', projectCompanyAssociatedUsers);

    if (!isEmpty(projectCompanyAssociatedUsers)) {
      return projectCompanyAssociatedUsers.reduce((acc, user) => {
        if (user?.role === customerRole?.id) {
          const key = user.lastName.charAt(0).toUpperCase();
          acc[key] = (acc[key] || []).concat({ ...user, role: 'customer' });
        }
        return acc;
      }, {});
    }

    return !isEmpty(filteredResults.customers) ? filteredResults.customers : null;
  }, [customerRole, filteredResults.customers, selectedProjectDetails]);

  const customerNumOfPages = useMemo(() => {
    if (activeTab === TABS.CUSTOMER_CONTACT && !isEmpty(selectedProjectDetails)) {
      return 1;
    }
    return allUsers.numPages;
  }, [activeTab, allUsers.numPages, selectClasses]);

  // func
  const resetSearchBar = useCallback(() => {
    setSearchText('');
  }, [setSearchText]);

  const handleChange = useCallback(
    (event, newVal) => {
      setActiveTab(newVal);
      resetSearchBar();
    },
    [resetSearchBar, setActiveTab]
  );

  const handleFilterSelection = useCallback(
    val => {
      if (filterTerms?.includes(val)) {
        const newVal = filterTerms.filter(term => term !== val);
        setFilterTerms(newVal);
      } else {
        setFilterTerms(filterTerms.concat(val));
      }
    },
    [filterTerms, setFilterTerms]
  );

  const handleAddUserClick = useCallback(() => {
    dispatch(openAddUserMode());
  }, [dispatch, openAddUserMode]);

  // effect
  useEffect(() => {
    if (openAssociatedUsers) {
      dispatch(backendService.getRoles());
    }
  }, [dispatch, openAssociatedUsers]);

  useEffect(() => {
    if (openAssociatedUsers) {
      const isCustomerTab = activeTab === TABS.CUSTOMER_CONTACT;
      const roles = isCustomerTab ? [customerRole] : drTeamRoles;
      const activeTabPage = isCustomerTab ? pageCustomers : pageDrTeam;
      if (!isEmpty(roles) && (!isCustomerTab || isEmpty(selectedProjectDetails))) {
        dispatch(backendService.getActiveUsers({ page: activeTabPage, roles: roles.map(({ id }) => id) }));
      }
    }
  }, [activeTab, customerRole, dispatch, drTeamRoles, openAssociatedUsers, pageCustomers, pageDrTeam, selectedProjectDetails]);

  useEffect(() => {
    if (!isEmpty(filterTerms) && activeTab === TABS.CUSTOMER_CONTACT) {
      setFilterTerms([]);
      setOpenFilter(false);
    }
  }, [activeTab, filterTerms, setFilterTerms, setOpenFilter]);

  // const
  const openWidth = openAssociatedUsers ? '500px' : '0';

  return (
    <SidePanelDrawerWrapper
      disableEnforceFocus
      hideBackdrop
      anchor="left"
      leftPositionDrawerContainer={leftPositionDrawerContainer}
      open={openAssociatedUsers}
      openWidth={openWidth}
      onClose={() => {
        if (portfolioActiveTab === TABS.ALL_COMPANIES) dispatch(backendService.getCompaniesByArchived(false));
        if (portfolioActiveTab === TABS.ARCHIVED_COMPANIES) dispatch(backendService.getCompaniesByArchived(true));
        if (portfolioActiveTab === TABS.MY_COMPANIES) dispatch(backendService.getMyCompanies());
        setOpenAssociatedUsers(false);
      }}
      PaperProps={{
        style: {
          marginLeft: `${leftPositionDrawerContainer}px`,
          backgroundColor: '#f0ecfc',
          borderTopRightRadius: '30px',
          borderBottomRightRadius: '30px',
          boxShadow: 'unset',
        },
      }}>
      <Box sx={{ minWidth: openWidth, overflowY: 'scroll' }}>
        <SidePanelMainWrapper>
          <SidePanelHeaderWrapper>
            <TabsWrapper value={activeTab} onChange={handleChange} TabIndicatorProps={{ style: { backgroundColor: 'var(--color-batman)' } }}>
              <TabItem label={TABS.DR_TEAM} {...a11yProps(0)} value={TABS.DR_TEAM} noPadding customMargin="0 24px 0 0" />
              <TabItem label={TABS.CUSTOMER_CONTACT} {...a11yProps(1)} value={TABS.CUSTOMER_CONTACT} noPadding />
            </TabsWrapper>
            <SidePanelHeaderCloseBtn>
              <CloseIcon onClick={() => setOpenAssociatedUsers(false)} />
            </SidePanelHeaderCloseBtn>
          </SidePanelHeaderWrapper>
          <SidePanelHeaderActionContainer>
            {activeTab === TABS.CUSTOMER_CONTACT && (
              <CustomButton
                buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
                icon={BUTTON_ICON.ADD_BORDERLESS}
                buttonText="Add Customer"
                type="button"
                padding="0 8px"
                onClickFunc={() => handleAddUserClick()}
              />
            )}
          </SidePanelHeaderActionContainer>
          {activeTab === TABS.DR_TEAM && (
            <SearchBar
              searchBarOpen
              searchText={searchText}
              setSearchText={setSearchText}
              activeTab={activeTab}
              isOnUsersPanel
              handleFilterFunc={() => setOpenFilter(!openFilter)}
            />
          )}
          <DRDivider />
          {openFilter && activeTab === TABS.DR_TEAM && (
            <AssociatedUserPanelFilter
              allRoles={allRoles?.filter(role => role?.name?.toLowerCase() !== 'customer')}
              filterTerms={filterTerms}
              handleFilterSelection={handleFilterSelection}
              setFilterTerms={setFilterTerms}
            />
          )}
          <TabPanel value={activeTab} index={0} mapTo={TABS.DR_TEAM}>
            <UserList
              activeTab={activeTab}
              usersObj={filteredResults?.drTeam || null}
              searchText={searchText}
              additionalValues={additionalValues}
              handleClick={handleClick}
              isAssociatedUserPanel
              page={pageDrTeam}
              pageOnChange={(event, page) => {
                setPageDrTeam(page);
              }}
              numOfPages={allUsers.numPages}
            />
          </TabPanel>
          <TabPanel value={activeTab} index={1} mapTo={TABS.CUSTOMER_CONTACT}>
            <UserList
              activeTab={activeTab}
              usersObj={customers || null}
              searchText={searchText}
              additionalValues={additionalValues}
              handleClick={handleClick}
              isAssociatedUserPanel
              page={pageCustomers}
              pageOnChange={(event, page) => {
                setPageCustomers(page);
              }}
              numOfPages={customerNumOfPages}
            />
          </TabPanel>
        </SidePanelMainWrapper>
      </Box>
    </SidePanelDrawerWrapper>
  );
}

AssociatedUsersPanel.propTypes = {
  openAssociatedUsers: PropTypes.bool.isRequired,
  setOpenAssociatedUsers: PropTypes.func.isRequired,
  additionalValues: PropTypes.shape({ associatedUsers: PropTypes.shape([]) }).isRequired,
  handleClick: PropTypes.func.isRequired,
  leftPositionDrawerContainer: PropTypes.number,
};

AssociatedUsersPanel.defaultProps = {
  leftPositionDrawerContainer: undefined,
};

export default AssociatedUsersPanel;
