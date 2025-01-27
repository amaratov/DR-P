import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider } from '@mui/material';
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
import { BUTTON_ICON, BUTTON_STYLE } from '../../../utils/constants/constants';
import SearchBar from '../../search/search-bar';
import { TabsWrapper } from '../../tabs/tab-styled';
import TabPanel from '../../tabs/tab-panel';
import { isEmpty } from '../../../utils/utils';
import { backendService } from '../../../services/backend';
import Sticky from '../../sticky/sticky';
import { GeneralContentContainer } from '../../app/app-styled';
import { SearchResultWrapper } from '../../search/search-bar-styled';
import ProjectList from './your-projects-list';
import { getMyProjects } from '../../../features/selectors/project';

function YourProjects() {
  // dispatch
  const dispatch = useDispatch();

  // selectors
  const myProjects = useSelector(getMyProjects);

  // state
  const [activeTab, setActiveTab] = useState('YOUR_PROJECTS');
  const [openSearch, setOpenSearch] = useState(false);
  const [searchText, setSearchText] = useState('');

  const filteredProjects = useMemo(
    () =>
      isEmpty(searchText)
        ? myProjects
        : myProjects?.filter(project => {
            return project.name.toLowerCase().includes(searchText.toLowerCase());
          }),
    [myProjects, searchText]
  );

  // func

  // effect
  useEffect(() => {
    if (myProjects?.length === 0) {
      dispatch(backendService.getMyProjects());
    }
  }, [dispatch, myProjects]);

  return (
    <GeneralContentContainer>
      <Sticky />
      <PanelHeaderWrapper>
        <PanelHeaderFlexContainer>
          <PanelHeaderText>Your Project</PanelHeaderText>
          <PanelHeaderActions>
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
        {!isEmpty(searchText) && openSearch && <SearchResultWrapper>{filteredProjects?.length} Results</SearchResultWrapper>}
      </PanelHeaderWrapper>
      <PanelContentNavSection>
        <TabsWrapper value={activeTab} TabIndicatorProps={{ style: { backgroundColor: 'var(--color-batman)' } }} />
      </PanelContentNavSection>
      <PanelContentWrapper>
        <PanelContentSection>
          <TabPanel value={activeTab} index={0} mapTo="YOUR_PROJECTS">
            <ProjectList availableProjects={filteredProjects} searchText={searchText} />
          </TabPanel>
        </PanelContentSection>
      </PanelContentWrapper>
    </GeneralContentContainer>
  );
}

export default YourProjects;
