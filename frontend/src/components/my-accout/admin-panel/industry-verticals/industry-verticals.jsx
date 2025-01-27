import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import {
  getAllActiveIndustryVerticals,
  getAllArchivedIndustryVerticals,
  getNumPagesForIndustryVertical,
} from '../../../../features/selectors/industryVertical';
import { openAddIndustryVerticalMode, resetOrder, resetOrderBy, resetPage } from '../../../../features/slices/uiSlice';
import IndustryVerticalList from './industry-verticals-list';
import AddIndustryVerticalPanel from '../../add-industry-vertical/add-industry-vertical-panel';
import EditIndustryVerticalPanel from './edit-industry-vertical/edit-industry-vertical-panel';
import ArchiveIndustryVerticalPanel from './archive-industry-vertical/archive-industry-vertical-panel';
import Sticky from '../../../sticky/sticky';
import { GeneralContentContainer } from '../../../app/app-styled';
import { SearchResultWrapper } from '../../../search/search-bar-styled';
import { getWhoAmI } from '../../../../features/selectors';
import { getPageNum, getSortOrder, getSortOrderBy } from '../../../../features/selectors/ui';

function IndustryVerticals({ isArchives }) {
  // dispatch
  const dispatch = useDispatch();

  // nav
  const navigate = useNavigate();

  // selectors
  const allActiveIndustryVerticals = useSelector(getAllActiveIndustryVerticals);
  const allArchivedIndustryVerticals = useSelector(getAllArchivedIndustryVerticals);
  const numPages = useSelector(getNumPagesForIndustryVertical);
  const page = useSelector(getPageNum);
  const order = useSelector(getSortOrder);
  const orderBy = useSelector(getSortOrderBy);
  const whoami = useSelector(getWhoAmI);

  // state
  const [activeTabUpdate, setActiveTab] = useState(TABS.ACTIVE_INDUSTRY_VERTICAL);
  const [openSearch, setOpenSearch] = useState(false);
  const [searchText, setSearchText] = useState('');

  // memo
  const activeTab = useMemo(() => {
    if (window.location.pathname === PATH_NAME.INDUSTRY_VERTICALS) {
      return TABS.ACTIVE_INDUSTRY_VERTICAL;
    }
    return (isArchives && TABS.ARCHIVES) || activeTabUpdate || TABS.ACTIVE_INDUSTRY_VERTICAL;
  }, [activeTabUpdate, isArchives]);

  // const
  const isMarketing = whoami?.role?.name?.toLowerCase() === AllRoles.MARKETING;

  const filteredActiveIndustryVerticals = useMemo(
    () =>
      isEmpty(searchText)
        ? allActiveIndustryVerticals
        : allActiveIndustryVerticals?.filter(industryVertical => {
            return industryVertical.name.toLowerCase().includes(searchText.toLowerCase());
          }),
    [allActiveIndustryVerticals, searchText]
  );

  const filteredArchivedIndustryVerticals = useMemo(
    () =>
      isEmpty(searchText)
        ? allArchivedIndustryVerticals
        : allArchivedIndustryVerticals?.filter(industryVertical => {
            return industryVertical.name.toLowerCase().includes(searchText.toLowerCase());
          }),
    [allArchivedIndustryVerticals, searchText]
  );

  // func
  const handleAddIndustryVerticalsClick = useCallback(() => {
    dispatch(openAddIndustryVerticalMode());
  }, [dispatch]);

  const handleChange = (event, newVal) => {
    setActiveTab(newVal);
    dispatch(resetPage());
    dispatch(resetOrder());
    dispatch(resetOrderBy());
    if (newVal === TABS.ACTIVE_INDUSTRY_VERTICAL) {
      navigate(`${PATH_NAME.INDUSTRY_VERTICALS}`);
    }
    if (newVal === TABS.ARCHIVES) {
      navigate(`${PATH_NAME.INDUSTRY_VERTICALS}${PATH_NAME.INDUSTRY_VERTICALS_ARCHIVES}`);
    }
  };

  // effect
  useEffect(() => {
    dispatch(backendService.getIndustryVerticalByParams({ archived: activeTab === TABS.ARCHIVES, page, order: [[orderBy, order]] }));
  }, [dispatch, activeTab, page, order, orderBy]);

  return (
    <GeneralContentContainer>
      <Sticky />
      <PanelHeaderWrapper>
        <PanelHeaderFlexContainer>
          <PanelHeaderText>Vertical Management</PanelHeaderText>
          <PanelHeaderActions>
            <CustomButton
              buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
              icon={BUTTON_ICON.ADD_BORDERLESS}
              buttonText="Add Vertical"
              type="button"
              padding="0 8px"
              onClickFunc={handleAddIndustryVerticalsClick}
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
            {activeTab === TABS.ACTIVE_INDUSTRY_VERTICAL ? filteredActiveIndustryVerticals?.length : filteredArchivedIndustryVerticals?.length} Results
          </SearchResultWrapper>
        )}
      </PanelHeaderWrapper>
      <PanelContentWrapper>
        <PanelContentNavSection>
          <TabsWrapper value={activeTab} onChange={handleChange} TabIndicatorProps={{ style: { backgroundColor: 'var(--color-batman)' } }}>
            <TabItem label={TABS.ACTIVE_INDUSTRY_VERTICAL} {...a11yProps(0)} value={TABS.ACTIVE_INDUSTRY_VERTICAL} noPadding customMargin="0 24px 0 0" />
            <TabItem label={TABS.ARCHIVES} {...a11yProps(1)} value={TABS.ARCHIVES} noPadding />
          </TabsWrapper>
        </PanelContentNavSection>
        <PanelContentSection>
          <TabPanel value={activeTab} index={0} mapTo={TABS.ACTIVE_INDUSTRY_VERTICAL}>
            <IndustryVerticalList
              availableIndustryVerticals={filteredActiveIndustryVerticals}
              searchText={searchText}
              activeTab={activeTab}
              numPages={numPages}
            />
          </TabPanel>
          <TabPanel value={activeTab} index={1} mapTo={TABS.ARCHIVES}>
            <IndustryVerticalList
              availableIndustryVerticals={filteredArchivedIndustryVerticals}
              searchText={searchText}
              isArchived
              activeTab={activeTab}
              numPages={numPages}
            />
          </TabPanel>
        </PanelContentSection>
      </PanelContentWrapper>
      <AddIndustryVerticalPanel activeTab={activeTab} />
      <EditIndustryVerticalPanel />
      <ArchiveIndustryVerticalPanel />
    </GeneralContentContainer>
  );
}

IndustryVerticals.propTypes = {
  isArchives: PropTypes.bool,
};

IndustryVerticals.defaultProps = {
  isArchives: false,
};

export default IndustryVerticals;
