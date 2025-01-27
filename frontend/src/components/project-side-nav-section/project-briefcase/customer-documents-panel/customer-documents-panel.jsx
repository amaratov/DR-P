import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Divider } from '@mui/material';
import Slide from '@mui/material/Slide';
import { getAddProjectBriefcaseCustomerDocumentsMode, getPageNum, getSortOrder, getSortOrderBy } from '../../../../features/selectors/ui';
import {
  CustomerDocumentsPanelWrapper,
  CustomerDocumentsPanelWrapperBackground,
  CustomerDocumentsPanelScreenWrapper,
  CustomerDocumentsPanelWrapperPadding,
  CustomerDocumentsPanelListContainer,
  CustomerDocumentsPanelDocumentSelectedWrapper,
  CustomerDocumentsPanelDocumentSelected,
} from './customer-documents-panel-style';
import {
  ProjectSideNavContentHeaderText,
  ProjectSideNavContentHeader,
  ProjectSideNavContentHeaderButtonContainer,
} from '../../project-side-nav-section-main-styled';
import { TABS, BUTTON_ICON, BUTTON_STYLE } from '../../../../utils/constants/constants';
import CustomButton from '../../../form-elements/custom-button';
import { resetAddProjectBriefcaseCustomerDocumentMode, setFilterMode, setRecentlyAdded } from '../../../../features/slices/uiSlice';
import ProjectBriefcaseList from '../project-briefcase-list';
import { getProjectAssociatedDocuments } from '../../../../features/selectors/customerDocument';
import { getCurrentProjectBriefcase } from '../../../../features/selectors/projectBriefcase';

function CustomerDocumentsPanel({ handleAddCustomerDocuments }) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const isAddProjectBriefcaseCustomerDocumentsMode = useSelector(getAddProjectBriefcaseCustomerDocumentsMode);
  const allCustomerDocs = useSelector(getProjectAssociatedDocuments);
  const currentProjectBriefCase = useSelector(getCurrentProjectBriefcase);

  // const
  const slideIn = isAddProjectBriefcaseCustomerDocumentsMode;

  // state
  const [listOfValues, setListOfValues] = useState([]);
  const [isSaveChanges, setIsSaveChanges] = useState(false);
  const [numberOfDocumentsSelected, setNumberOfDocumentsSelected] = useState(0);

  // function
  const handleClosePanel = useCallback(() => {
    dispatch(resetAddProjectBriefcaseCustomerDocumentMode());
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
    handleAddCustomerDocuments(listOfValues);
    setIsSaveChanges(false);
    dispatch(setRecentlyAdded(listOfValues));
    handleClosePanel();
  }, [handleAddCustomerDocuments, setIsSaveChanges, handleClosePanel, listOfValues, dispatch]);

  return (
    <CustomerDocumentsPanelWrapper open={isAddProjectBriefcaseCustomerDocumentsMode}>
      <CustomerDocumentsPanelWrapperBackground />
      <Slide direction="up" in={slideIn} mountOnEnter unmountOnExit timeout={500} id="panelWrapperForMarketing">
        <CustomerDocumentsPanelScreenWrapper customHeight={allCustomerDocs?.length > 10 ? 'auto' : '100%'}>
          <CustomerDocumentsPanelWrapperPadding>
            <ProjectSideNavContentHeader style={{ display: 'grid', gridAutoFlow: 'column', gridTemplateColumns: '1fr 0.2fr' }}>
              <ProjectSideNavContentHeaderText>Project Documents</ProjectSideNavContentHeaderText>
              <ProjectSideNavContentHeaderButtonContainer style={{ gridGap: '2rem' }}>
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
            <Divider />
            <CustomerDocumentsPanelListContainer>
              <ProjectBriefcaseList
                alreadyAddedValues={currentProjectBriefCase?.associatedDocument || currentProjectBriefCase || []}
                panelSelectedValues={listOfValues}
                setPanelSelectedValues={handleValueChange}
                clearSelection={clearSelection}
                panelView
              />
            </CustomerDocumentsPanelListContainer>
          </CustomerDocumentsPanelWrapperPadding>
          {isSaveChanges && (
            <CustomerDocumentsPanelDocumentSelectedWrapper>
              <CustomerDocumentsPanelDocumentSelected>
                <div>{numberOfDocumentsSelected} Document Selected</div>
                <CustomButton buttonText="Clear selection" buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE} type="button" onClickFunc={clearSelection} />
                <CustomButton
                  buttonText="Add to Project Briefcase"
                  buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
                  type="button"
                  bgColor="var(--color-homeworld)"
                  onClickFunc={handleSubmit}
                  customMinHeight="55px"
                  customMinWidth="280px"
                />
              </CustomerDocumentsPanelDocumentSelected>
            </CustomerDocumentsPanelDocumentSelectedWrapper>
          )}
        </CustomerDocumentsPanelScreenWrapper>
      </Slide>
    </CustomerDocumentsPanelWrapper>
  );
}

CustomerDocumentsPanel.prototype = {
  handleAddCustomerDocuments: PropTypes.func.isRequired,
};

CustomerDocumentsPanel.defaultProps = {};

export default CustomerDocumentsPanel;
