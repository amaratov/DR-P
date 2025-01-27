import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Divider } from '@mui/material';
import Slide from '@mui/material/Slide';
import { getAddProjectBriefcaseEducationalMaterialsMode, getPageNum, getSortOrder, getSortOrderBy } from '../../../../features/selectors/ui';
import {
  MarketingMaterialsPanelWrapper,
  MarketingMaterialsPanelWrapperBackground,
  MarketingMaterialsPanelScreenWrapper,
  MarketingMaterialsPanelWrapperPadding,
  MarketingMaterialsPanelListContainer,
  MarketingMaterialsPanelDocumentSelectedWrapper,
  MarketingMaterialsPanelDocumentSelected,
} from './marketing-materials-panel-style';
import {
  ProjectSideNavContentHeaderText,
  ProjectSideNavContentHeader,
  ProjectSideNavContentHeaderButtonContainer,
} from '../../project-side-nav-section-main-styled';
import { TABS, BUTTON_ICON, BUTTON_STYLE } from '../../../../utils/constants/constants';
import CustomButton from '../../../form-elements/custom-button';
import { resetAddProjectBriefcaseEducationalMaterialsMode, setFilterMode, setRecentlyAdded } from '../../../../features/slices/uiSlice';
import MarketingList from '../../../my-accout/admin-panel/artifact-library/marketing/marketing-list';
import { getAllActiveMarketing, getNumPagesForMarketing } from '../../../../features/selectors/marketing';
import { backendService } from '../../../../services/backend';
import SearchBar from '../../../search/search-bar';
import MarketingDetails from '../../../my-accout/admin-panel/artifact-library/marketing/edit-marketing/marketing-details';
import MarketingFilterPanel from './marketing-filter-panel';
import { getFilterParams, isEmpty } from '../../../../utils/utils';

function MarketingMaterialsPanel({ currentProjectBriefCase, handleAddMarketings }) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const isAddProjectBriefcaseEducationalMaterialsMode = useSelector(getAddProjectBriefcaseEducationalMaterialsMode);
  const allActiveMarketing = useSelector(getAllActiveMarketing);
  const numPagesForMarketing = useSelector(getNumPagesForMarketing);
  const page = useSelector(getPageNum);
  const order = useSelector(getSortOrder);
  const orderBy = useSelector(getSortOrderBy);

  // const
  const slideIn = isAddProjectBriefcaseEducationalMaterialsMode;
  // exclude the already added marketing
  const availableMarketingMaterials = allActiveMarketing?.filter(mk => !currentProjectBriefCase?.associatedMarketing?.some(amk => amk?.id === mk?.id)) || [];

  // state
  const [searchText, setSearchText] = useState('');
  const [openSearch, setOpenSearch] = useState(false);
  const [listOfValues, setListOfValues] = useState([]);
  const [isSaveChanges, setIsSaveChanges] = useState(false);
  const [numberOfDocumentsSelected, setNumberOfDocumentsSelected] = useState(0);
  const [allMarketings, setAllMarketings] = useState([]);

  // function
  const handleClosePanel = useCallback(() => {
    dispatch(resetAddProjectBriefcaseEducationalMaterialsMode());
  }, [dispatch]);

  const resetSearchBar = useCallback(() => {
    setOpenSearch(false);
    setSearchText('');
  }, [setOpenSearch, setSearchText]);

  const openFilter = useCallback(() => {
    dispatch(setFilterMode(TABS.PROJECT_BRIEFCASE));
  }, [dispatch]);

  const handleValueChange = useCallback(
    (value, isInList) => {
      const currentListOfValue = listOfValues;
      if (isInList && currentListOfValue?.length > 0) {
        const index = currentListOfValue.findIndex(i => i?.id === value?.id);
        const removedValue = currentListOfValue.splice(index, 1);
        setListOfValues([...currentListOfValue]);
        setNumberOfDocumentsSelected(currentListOfValue.length);
      } else {
        setListOfValues([...currentListOfValue, value]);
        setNumberOfDocumentsSelected(currentListOfValue.length + 1);
      }
      if (!isSaveChanges) {
        setIsSaveChanges(true);
      }
    },
    [setListOfValues, listOfValues, setNumberOfDocumentsSelected, numberOfDocumentsSelected, setIsSaveChanges, isSaveChanges]
  );

  const clearSelection = useCallback(() => {
    setListOfValues([]);
    setNumberOfDocumentsSelected(0);
    setIsSaveChanges(false);
  }, [setListOfValues, setNumberOfDocumentsSelected, setIsSaveChanges]);

  const handleSubmit = useCallback(() => {
    handleAddMarketings(listOfValues);
    setIsSaveChanges(false);
    dispatch(setRecentlyAdded(listOfValues));
    handleClosePanel();
  }, [handleAddMarketings, setIsSaveChanges, handleClosePanel, listOfValues, dispatch]);

  useEffect(() => {
    if (allActiveMarketing?.length === 0) {
      const params = getFilterParams({}, false, page);
      const orderByInitialValue = orderBy === 'name' ? 'docName' : orderBy;
      params.order = [[orderByInitialValue, order]];
      params.docName = !isEmpty(searchText) ? `%${searchText}%` : '';
      dispatch(backendService.getAllActiveMarketings(params));
    }
  }, []);

  return (
    <MarketingMaterialsPanelWrapper open={isAddProjectBriefcaseEducationalMaterialsMode}>
      <MarketingMaterialsPanelWrapperBackground />
      <Slide direction="up" in={slideIn} mountOnEnter unmountOnExit timeout={500} id="panelWrapperForMarketing">
        <MarketingMaterialsPanelScreenWrapper customHeight={allActiveMarketing?.length > 10 ? 'auto' : '100%'}>
          <MarketingMaterialsPanelWrapperPadding hasMarginBottom={isSaveChanges}>
            <ProjectSideNavContentHeader style={{ display: 'grid', gridAutoFlow: 'column', gridTemplateColumns: '1fr 0.2fr' }}>
              <ProjectSideNavContentHeaderText>Marketing Materials</ProjectSideNavContentHeaderText>
              <ProjectSideNavContentHeaderButtonContainer style={{ gridGap: '2rem' }}>
                <CustomButton
                  buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
                  icon={BUTTON_ICON.FILTER_OUTLINED}
                  buttonText="Filter"
                  type="button"
                  padding="0 24px 0 0"
                  onClickFunc={openFilter}
                />
                <CustomButton
                  buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
                  icon={BUTTON_ICON.SEARCH}
                  buttonText="Search"
                  type="button"
                  padding="2px 0 0 0"
                  onClickFunc={() => setOpenSearch(!openSearch)}
                />
                <CustomButton
                  buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
                  icon={BUTTON_ICON.CANCEL}
                  buttonText="x"
                  type="button"
                  padding="2px 0 0 0"
                  customMinWidth="50px"
                  customMinHeight="50px"
                  onClickFunc={handleClosePanel}
                />
              </ProjectSideNavContentHeaderButtonContainer>
            </ProjectSideNavContentHeader>
            <SearchBar searchBarOpen={openSearch} searchText={searchText} setSearchText={setSearchText} activeTab={TABS.PROJECT_BRIEFCASE} />
            <Divider />
            <MarketingMaterialsPanelListContainer>
              <MarketingList
                availableMarketings={availableMarketingMaterials}
                searchText={searchText}
                resetSearchBar={resetSearchBar}
                panelSelectedValues={listOfValues}
                setPanelSelectedValues={handleValueChange}
                clearSelection={clearSelection}
                numPages={numPagesForMarketing}
                panelView
              />
            </MarketingMaterialsPanelListContainer>
          </MarketingMaterialsPanelWrapperPadding>
          {isSaveChanges && (
            <MarketingMaterialsPanelDocumentSelectedWrapper>
              <MarketingMaterialsPanelDocumentSelected>
                <div>{numberOfDocumentsSelected} Document Selected</div>
                <CustomButton buttonText="Clear selection" buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE} type="button" onClickFunc={clearSelection} />
                <CustomButton
                  buttonText="Add to Educational Materials"
                  buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
                  type="button"
                  bgColor="var(--color-homeworld)"
                  onClickFunc={handleSubmit}
                  customMinHeight="55px"
                  customMinWidth="280px"
                />
              </MarketingMaterialsPanelDocumentSelected>
            </MarketingMaterialsPanelDocumentSelectedWrapper>
          )}
        </MarketingMaterialsPanelScreenWrapper>
      </Slide>
      <MarketingDetails marketings={allMarketings} setAllMarketings={setAllMarketings} />
      <MarketingFilterPanel />
    </MarketingMaterialsPanelWrapper>
  );
}

MarketingMaterialsPanel.prototype = {
  currentProjectBriefCase: PropTypes.shape({}),
  handleAddMarketings: PropTypes.func.isRequired,
};

MarketingMaterialsPanel.defaultProps = {
  currentProjectBriefCase: {},
};

export default MarketingMaterialsPanel;
