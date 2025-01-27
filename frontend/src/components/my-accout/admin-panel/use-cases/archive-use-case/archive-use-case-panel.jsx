import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { getArchiveMode, getPageNum, getSelectedUseCaseDetails, getSortOrder, getSortOrderBy } from '../../../../../features/selectors/ui';
import {
  ArchiveUseCasePanelActionWrapper,
  ArchiveUseCasePanelContentContainer,
  ArchiveUseCasePanelContentWrapper,
  ArchiveUseCasePanelForm,
  ArchiveUseCasePanelHeaderText,
  ArchiveUseCasePanelMain,
  ArchiveUseCasePanelSubHeaderText,
} from './archive-use-case-panel-styled';
import { BUTTON_STYLE } from '../../../../../utils/constants/constants';
import CustomButton from '../../../../form-elements/custom-button';
import { resetArchiveMode, setRecentlyArchived } from '../../../../../features/slices/uiSlice';
import { backendService } from '../../../../../services/backend';
import { getTotalUseCases } from '../../../../../features/selectors/useCase';

function ArchiveUseCasePanel() {
  // dispatch
  const dispatch = useDispatch();

  // useForm
  const { register, handleSubmit, reset } = useForm();

  // selectors
  const isArchiveMode = useSelector(getArchiveMode);
  const selectedUseCaseDetails = useSelector(getSelectedUseCaseDetails);
  const page = useSelector(getPageNum);
  const order = useSelector(getSortOrder);
  const orderBy = useSelector(getSortOrderBy);
  const total = useSelector(getTotalUseCases);

  // func
  const submitForm = data => {
    const finalData = {
      ...data,
      id: selectedUseCaseDetails.id,
    };
    dispatch(setRecentlyArchived());
    dispatch(resetArchiveMode());
    setTimeout(() => {
      dispatch(backendService.deleteUseCase(finalData.id));
      setTimeout(() => {
        if (total % 50 === 1 && total > 50) {
          dispatch(backendService.getUseCasesByParams({ archived: false, page: page - 1, order: [[orderBy, order]] }));
        } else {
          dispatch(backendService.getUseCasesByParams({ archived: false, page, order: [[orderBy, order]] }));
        }
      }, 500);
    }, 500);
    reset();
  };

  return (
    <ArchiveUseCasePanelMain open={isArchiveMode}>
      <form onSubmit={handleSubmit(submitForm)}>
        <Box role="presentation">
          <ArchiveUseCasePanelForm>
            <ArchiveUseCasePanelHeaderText>Are you sure you want to archive?</ArchiveUseCasePanelHeaderText>
            <ArchiveUseCasePanelContentWrapper>
              <ArchiveUseCasePanelContentContainer>
                <ArchiveUseCasePanelSubHeaderText>
                  <span style={{ fontWeight: 'bolder' }}>
                    {selectedUseCaseDetails?.documentCount !== '0' ? selectedUseCaseDetails?.documentCount : 'There were no documents in the row details -'}
                  </span>{' '}
                  document{parseInt(selectedUseCaseDetails?.documentCount, 10) > 1 ? 's' : ''} linked to {selectedUseCaseDetails?.name}
                </ArchiveUseCasePanelSubHeaderText>
                <ArchiveUseCasePanelSubHeaderText>
                  You can still access this use case in the archived tab, but will no longer be linked to these documents once you archive.
                </ArchiveUseCasePanelSubHeaderText>
              </ArchiveUseCasePanelContentContainer>
            </ArchiveUseCasePanelContentWrapper>
            <div style={{ display: 'grid', gridRowGap: '1rem' }}>
              <ArchiveUseCasePanelActionWrapper>
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
              </ArchiveUseCasePanelActionWrapper>
            </div>
          </ArchiveUseCasePanelForm>
        </Box>
      </form>
    </ArchiveUseCasePanelMain>
  );
}

export default ArchiveUseCasePanel;
