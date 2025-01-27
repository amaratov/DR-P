import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { getArchiveMode, getSelectedIndustryVerticalDetails } from '../../../../../features/selectors/ui';
import {
  ArchiveIndustryVerticalPanelActionWrapper,
  ArchiveIndustryVerticalPanelContentContainer,
  ArchiveIndustryVerticalPanelContentWrapper,
  ArchiveIndustryVerticalPanelForm,
  ArchiveIndustryVerticalPanelHeaderText,
  ArchiveIndustryVerticalPanelMain,
  ArchiveIndustryVerticalPanelSubHeaderText,
} from './archive-industry-vertical-panel-styled';
import { BUTTON_STYLE } from '../../../../../utils/constants/constants';
import CustomButton from '../../../../form-elements/custom-button';
import { resetArchiveMode, setRecentlyArchived } from '../../../../../features/slices/uiSlice';
import { backendService } from '../../../../../services/backend';

function ArchiveIndustryVerticalPanel() {
  // dispatch
  const dispatch = useDispatch();

  // useForm
  const { register, handleSubmit, reset } = useForm();

  // selectors
  const isArchiveMode = useSelector(getArchiveMode);
  const selectedIndustryVerticalDetails = useSelector(getSelectedIndustryVerticalDetails);

  // func
  const submitForm = data => {
    const finalData = {
      ...data,
      id: selectedIndustryVerticalDetails.id,
    };
    dispatch(setRecentlyArchived());
    dispatch(resetArchiveMode());
    setTimeout(() => {
      dispatch(backendService.deleteIndustryVertical(finalData.id));
    }, 500);
    reset();
  };

  return (
    <ArchiveIndustryVerticalPanelMain open={isArchiveMode}>
      <form onSubmit={handleSubmit(submitForm)}>
        <Box role="presentation">
          <ArchiveIndustryVerticalPanelForm>
            <ArchiveIndustryVerticalPanelHeaderText>Are you sure you want to archive?</ArchiveIndustryVerticalPanelHeaderText>
            <ArchiveIndustryVerticalPanelContentWrapper>
              <ArchiveIndustryVerticalPanelContentContainer>
                <ArchiveIndustryVerticalPanelSubHeaderText>
                  <span style={{ fontWeight: 'bolder' }}>{selectedIndustryVerticalDetails?.documentCount}</span> document
                  {parseInt(selectedIndustryVerticalDetails?.documentCount, 10) > 1 ? 's' : ''} linked to {selectedIndustryVerticalDetails?.name}
                </ArchiveIndustryVerticalPanelSubHeaderText>
                <ArchiveIndustryVerticalPanelSubHeaderText>
                  You can still access this industry vertical in the archived tab, but will no longer be linked to these documents once you archive.
                </ArchiveIndustryVerticalPanelSubHeaderText>
              </ArchiveIndustryVerticalPanelContentContainer>
            </ArchiveIndustryVerticalPanelContentWrapper>
            <div style={{ display: 'grid', gridRowGap: '1rem' }}>
              <ArchiveIndustryVerticalPanelActionWrapper>
                <CustomButton
                  buttonStyle={BUTTON_STYLE.COMPANY_STYLE}
                  buttonText="Cancel"
                  type="button"
                  customMinWidth="360px"
                  customMinHeight="56px"
                  onClickFunc={() => {
                    dispatch(resetArchiveMode());
                    reset();
                  }}
                />
                <CustomButton
                  buttonStyle={BUTTON_STYLE.COMPANY_STYLE}
                  buttonText="Continue"
                  marginTop="20px"
                  type="submit"
                  customMinWidth="360px"
                  customMinHeight="56px"
                  bgColor="var(--color-homeworld)"
                />
              </ArchiveIndustryVerticalPanelActionWrapper>
            </div>
          </ArchiveIndustryVerticalPanelForm>
        </Box>
      </form>
    </ArchiveIndustryVerticalPanelMain>
  );
}

export default ArchiveIndustryVerticalPanel;
