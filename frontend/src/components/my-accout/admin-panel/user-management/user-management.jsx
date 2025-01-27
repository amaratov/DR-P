import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Divider } from '@mui/material';
import {
  PanelHeaderActions,
  PanelHeaderFlexContainer,
  PanelHeaderText,
  PanelHeaderWrapper,
  PanelContentWrapper,
  PanelContentNavSection,
  PanelContentSection,
} from '../../my-account-styled';
import CustomButton from '../../../form-elements/custom-button';
import { AllRoles, BUTTON_ICON, BUTTON_STYLE, PATH_NAME, TABS } from '../../../../utils/constants/constants';
import { backendService } from '../../../../services/backend';
import { getAllRoles, getAllUsersSorted, getSearchedUsersSorted, getWhoAmI } from '../../../../features/selectors';
import { TabItem, TabsWrapper } from '../../../tabs/tab-styled';
import { a11yProps, isEmpty } from '../../../../utils/utils';
import TabPanel from '../../../tabs/tab-panel';
import UserList from './user-list';
import UserDetails from '../../user-details/user-details';
import AddUserPanel from '../../add-user/add-user-panel';
import { openAddUserMode } from '../../../../features/slices/uiSlice';
import SearchBar from '../../../search/search-bar';
import Sticky from '../../../sticky/sticky';
import { GeneralContentContainer } from '../../../app/app-styled';
import { SearchResultWrapper } from '../../../search/search-bar-styled';
import UserManagementFilter from '../../../filters/user-management-filter/user-management-filter';

function UserManagement({ isArchives }) {
  // dispatch
  const dispatch = useDispatch();

  // nav
  const navigate = useNavigate();

  // states
  const [activeTabUpdate, setActiveTab] = useState(TABS.ACTIVE_USER);
  const [openSearch, setOpenSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [openFilter, setOpenFilter] = useState(false);
  const [filterTerms, setFilterTerms] = useState([]);

  // selectors
  const sortedUsers = useSelector(getAllUsersSorted);
  const filteredUsers = useSelector(state => getSearchedUsersSorted(state, { searchText, filterTerms }));
  const allRoles = useSelector(getAllRoles);
  const whoami = useSelector(getWhoAmI);

  // memo
  const activeTab = useMemo(() => {
    if (window.location.pathname === PATH_NAME.USER_MANAGEMENT) {
      dispatch(backendService.getActiveUsers());
      return TABS.ACTIVE_USER;
    }
    if (window.location.pathname === PATH_NAME.USER_MANAGEMENT + PATH_NAME.USER_MANAGEMENT_ARCHIVES) {
      dispatch(backendService.getArchivedUsers());
      return TABS.ARCHIVED_USER;
    }
    return (isArchives && TABS.ARCHIVED_USER) || activeTabUpdate || TABS.ACTIVE_USER;
  }, [activeTabUpdate, isArchives, dispatch]);

  const filteredResults = useMemo(
    () => (isEmpty(searchText) && isEmpty(filterTerms) ? sortedUsers : filteredUsers),
    [searchText, filterTerms, sortedUsers, filteredUsers]
  );

  const searchResultCount = useMemo(() => {
    return Object.values(filteredUsers || {})?.reduce((acc, val) => {
      if (!isEmpty(val)) acc += val.length;
      return acc;
    }, 0);
  }, [filteredUsers]);

  // const
  const isMarketing = whoami?.role?.name?.toLowerCase() === AllRoles.MARKETING;

  // func
  const handleChange = (event, newVal) => {
    setActiveTab(newVal);
    if (newVal === TABS.ACTIVE_USER) {
      dispatch(backendService.getActiveUsers());
      navigate(`${PATH_NAME.USER_MANAGEMENT}`);
    }
    if (newVal === TABS.ARCHIVED_USER) {
      dispatch(backendService.getArchivedUsers());
      navigate(`${PATH_NAME.USER_MANAGEMENT}${PATH_NAME.USER_MANAGEMENT_ARCHIVES}`);
    }
  };

  const handleAddUserClick = useCallback(() => {
    dispatch(openAddUserMode());
  }, [dispatch]);

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

  // effect
  useEffect(() => {
    if (isMarketing) navigate(PATH_NAME.USER_PROFILE);
  }, [isMarketing, navigate]);

  useEffect(() => {
    dispatch(backendService.getRoles());
    dispatch(backendService.getActiveUsers());
  }, [dispatch]);

  return (
    <GeneralContentContainer>
      <Sticky />
      <PanelHeaderWrapper>
        <PanelHeaderFlexContainer>
          <PanelHeaderText>User Management</PanelHeaderText>
          <PanelHeaderActions>
            <CustomButton
              buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
              icon={BUTTON_ICON.ADD_BORDERLESS}
              buttonText="Add User"
              type="button"
              padding="0 8px"
              onClickFunc={() => handleAddUserClick()}
            />
            <CustomButton
              buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
              icon={BUTTON_ICON.SEARCH}
              buttonText="Search"
              type="button"
              padding="0 8px"
              onClickFunc={() => setOpenSearch(!openSearch)}
            />
            <CustomButton
              buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
              icon={BUTTON_ICON.FILTER_OUTLINED}
              buttonText="Filter"
              type="button"
              padding="0 8px"
              onClickFunc={() => setOpenFilter(!openFilter)}
            />
          </PanelHeaderActions>
        </PanelHeaderFlexContainer>
        <SearchBar searchBarOpen={openSearch} searchText={searchText} setSearchText={setSearchText} activeTab={activeTab} />
        <Divider />
        <UserManagementFilter
          open={openFilter}
          allRoles={allRoles}
          filterTerms={filterTerms}
          handleFilterSelection={handleFilterSelection}
          setFilterTerms={setFilterTerms}
        />
        {!isEmpty(searchText) && openSearch && <SearchResultWrapper>{searchResultCount} Results</SearchResultWrapper>}
      </PanelHeaderWrapper>
      <PanelContentWrapper>
        <PanelContentNavSection>
          <TabsWrapper value={activeTab} onChange={handleChange} TabIndicatorProps={{ style: { backgroundColor: 'var(--color-batman)' } }}>
            <TabItem label={TABS.ACTIVE_USER} {...a11yProps(0)} value={TABS.ACTIVE_USER} noPadding customMargin="0 24px 0 0" />
            <TabItem label={TABS.ARCHIVES} {...a11yProps(1)} value={TABS.ARCHIVED_USER} noPadding />
          </TabsWrapper>
        </PanelContentNavSection>
        <PanelContentSection>
          <TabPanel value={activeTab} index={0} mapTo={TABS.ACTIVE_USER}>
            <UserList usersObj={filteredResults} searchText={searchText} activeTab={activeTab} />
          </TabPanel>
          <TabPanel value={activeTab} index={1} mapTo={TABS.ARCHIVED_USER}>
            <UserList usersObj={filteredResults} searchText={searchText} activeTab={activeTab} />
          </TabPanel>
        </PanelContentSection>
      </PanelContentWrapper>
      <UserDetails />
      <AddUserPanel />
    </GeneralContentContainer>
  );
}

export default UserManagement;
