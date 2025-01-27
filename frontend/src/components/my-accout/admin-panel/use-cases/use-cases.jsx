import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
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
import { AllRoles, BUTTON_ICON, BUTTON_STYLE, PATH_NAME, TABS } from '../../../../utils/constants/constants';
import SearchBar from '../../../search/search-bar';
import { TabItem, TabsWrapper } from '../../../tabs/tab-styled';
import TabPanel from '../../../tabs/tab-panel';
import { a11yProps, isEmpty } from '../../../../utils/utils';
import { backendService } from '../../../../services/backend';
import { getAllActiveUseCases, getAllArchivedUseCases, getNumPagesForUseCases } from '../../../../features/selectors/useCase';
import { openAddUseCaseMode, resetOrder, resetOrderBy, resetPage } from '../../../../features/slices/uiSlice';
import UseCaseList from './use-case-list';
import AddUseCasePanel from '../../add-use-case/add-use-case-panel';
import EditUseCasePanel from './edit-use-case/edit-use-case-panel';
import ArchiveUseCasePanel from './archive-use-case/archive-use-case-panel';
import Sticky from '../../../sticky/sticky';
import { GeneralContentContainer } from '../../../app/app-styled';
import { SearchResultWrapper } from '../../../search/search-bar-styled';
import { getWhoAmI } from '../../../../features/selectors';
import { getPageNum, getSortOrder, getSortOrderBy } from '../../../../features/selectors/ui';

function UseCases({ isArchives }) {
  // dispatch
  const dispatch = useDispatch();

  // nav
  const navigate = useNavigate();

  // selectors
  const allActiveUseCases = useSelector(getAllActiveUseCases);
  const allArchivedUseCases = useSelector(getAllArchivedUseCases);
  const numPages = useSelector(getNumPagesForUseCases);
  const page = useSelector(getPageNum);
  const order = useSelector(getSortOrder);
  const orderBy = useSelector(getSortOrderBy);

  // state
  const [activeTabUpdate, setActiveTab] = useState(TABS.ACTIVE_USE_CASE);
  const [openSearch, setOpenSearch] = useState(false);
  const [searchText, setSearchText] = useState('');
  const whoami = useSelector(getWhoAmI);

  // const
  const isMarketing = whoami?.role?.name?.toLowerCase() === AllRoles.MARKETING;

  // memo
  const activeTab = useMemo(() => {
    if (window.location.pathname === PATH_NAME.USE_CASES) {
      return TABS.ACTIVE_USE_CASE;
    }
    return (isArchives && TABS.ARCHIVES) || activeTabUpdate || TABS.ACTIVE_USE_CASE;
  }, [activeTabUpdate, isArchives]);

  const filteredActiveUseCases = useMemo(
    () =>
      isEmpty(searchText)
        ? allActiveUseCases
        : allActiveUseCases?.filter(useCase => {
            return useCase.name.toLowerCase().includes(searchText.toLowerCase());
          }),
    [allActiveUseCases, searchText]
  );

  const filteredArchivedUseCases = useMemo(
    () =>
      isEmpty(searchText)
        ? allArchivedUseCases
        : allArchivedUseCases?.filter(useCase => {
            return useCase.name.toLowerCase().includes(searchText.toLowerCase());
          }),
    [allArchivedUseCases, searchText]
  );

  // func
  const handleAddUseCaseClick = useCallback(() => {
    dispatch(openAddUseCaseMode());
  }, [dispatch]);

  const handleChange = (event, newVal) => {
    setActiveTab(newVal);
    dispatch(resetPage());
    dispatch(resetOrder());
    dispatch(resetOrderBy());
    if (newVal === TABS.ACTIVE_USE_CASE) {
      navigate(`${PATH_NAME.USE_CASES}`);
    }
    if (newVal === TABS.ARCHIVES) {
      navigate(`${PATH_NAME.USE_CASES}${PATH_NAME.USE_CASES_ARCHIVES}`);
    }
  };

  // effect
  useEffect(() => {
    dispatch(backendService.getUseCasesByParams({ archived: activeTab === TABS.ARCHIVES, page, order: [[orderBy, order]] }));
  }, [dispatch, activeTab, page, order, orderBy]);

  return (
    <GeneralContentContainer>
      <Sticky />
      <PanelHeaderWrapper>
        <PanelHeaderFlexContainer>
          <PanelHeaderText>Use Cases</PanelHeaderText>
          <PanelHeaderActions>
            <CustomButton
              buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
              icon={BUTTON_ICON.ADD_BORDERLESS}
              buttonText="Add Use Case"
              type="button"
              padding="0 8px"
              onClickFunc={handleAddUseCaseClick}
            />
            <CustomButton
              buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
              icon={BUTTON_ICON.SEARCH}
              buttonText="Search"
              type="button"
              padding="0 8px"
              onClickFunc={() => setOpenSearch(!openSearch)}
            />
          </PanelHeaderActions>
        </PanelHeaderFlexContainer>
        <SearchBar searchBarOpen={openSearch} searchText={searchText} setSearchText={setSearchText} activeTab={activeTab} />
        <Divider />
        {!isEmpty(searchText) && openSearch && (
          <SearchResultWrapper>
            {activeTab === TABS.ACTIVE_USE_CASE ? filteredActiveUseCases?.length : filteredArchivedUseCases?.length} Results
          </SearchResultWrapper>
        )}
      </PanelHeaderWrapper>
      <PanelContentWrapper>
        <PanelContentNavSection>
          <TabsWrapper value={activeTab} onChange={handleChange} TabIndicatorProps={{ style: { backgroundColor: 'var(--color-batman)' } }}>
            <TabItem label={TABS.ACTIVE_USE_CASE} {...a11yProps(0)} value={TABS.ACTIVE_USE_CASE} noPadding customMargin="0 24px 0 0" />
            <TabItem label={TABS.ARCHIVES} {...a11yProps(1)} value={TABS.ARCHIVES} noPadding />
          </TabsWrapper>
        </PanelContentNavSection>
        <PanelContentSection>
          <TabPanel value={activeTab} index={0} mapTo={TABS.ACTIVE_USE_CASE}>
            <UseCaseList availableUseCases={filteredActiveUseCases} searchText={searchText} activeTab={activeTab} numPages={Number(numPages) || 0} />
          </TabPanel>
          <TabPanel value={activeTab} index={1} mapTo={TABS.ARCHIVES}>
            <UseCaseList
              availableUseCases={filteredArchivedUseCases}
              searchText={searchText}
              isArchived
              activeTab={activeTab}
              numPages={Number(numPages) || 0}
            />
          </TabPanel>
        </PanelContentSection>
      </PanelContentWrapper>
      <AddUseCasePanel isArchived={isArchives} />
      <EditUseCasePanel isArchived={isArchives} />
      <ArchiveUseCasePanel />
    </GeneralContentContainer>
  );
}

UseCases.propTypes = {
  isArchives: PropTypes.bool,
};

UseCases.defaultProps = {
  isArchives: false,
};

export default UseCases;
