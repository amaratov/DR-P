import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { getEditMode, getPageNum, getSelectedUseCaseDetails, getSortOrder, getSortOrderBy } from '../../../../../features/selectors/ui';
import {
  EditUseCasePanelActionWrapper,
  EditUseCasePanelContentContainer,
  EditUseCasePanelContentWrapper,
  EditUseCasePanelForm,
  EditUseCasePanelHeaderText,
  EditUseCasePanelMain,
  EditUseCasePanelSubHeaderText,
} from './edit-use-case-panel-styled';
import TextInput from '../../../../form-elements/text-input';
import { BUTTON_ICON, BUTTON_STYLE } from '../../../../../utils/constants/constants';
import CustomButton from '../../../../form-elements/custom-button';
import { resetEditUseCaseMode } from '../../../../../features/slices/uiSlice';
import { backendService } from '../../../../../services/backend';

function EditUseCasePanel({ isArchived }) {
  // dispatch
  const dispatch = useDispatch();

  // useForm
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // selectors
  const isEditUseCaseMode = useSelector(getEditMode);
  const selectedUseCaseDetails = useSelector(getSelectedUseCaseDetails);
  const page = useSelector(getPageNum);
  const order = useSelector(getSortOrder);
  const orderBy = useSelector(getSortOrderBy);

  // func
  const submitForm = data => {
    const finalData = {
      ...data,
      id: selectedUseCaseDetails.id,
    };
    dispatch(backendService.updateUseCase(finalData));
    setTimeout(() => {
      dispatch(backendService.getUseCasesByParams({ archived: isArchived, page, order: [[orderBy, order]] }));
    }, 300);
    reset();
  };

  useEffect(() => {
    if (isEditUseCaseMode) {
      reset({
        name: selectedUseCaseDetails?.name,
      });
    }
  }, [isEditUseCaseMode, reset, selectedUseCaseDetails]);

  return (
    <EditUseCasePanelMain open={isEditUseCaseMode}>
      <form onSubmit={handleSubmit(submitForm)} noValidate>
        <Box role="presentation">
          <EditUseCasePanelForm>
            <EditUseCasePanelHeaderText>Edit a Use Case</EditUseCasePanelHeaderText>
            <EditUseCasePanelContentWrapper>
              <EditUseCasePanelContentContainer>
                <EditUseCasePanelSubHeaderText />
                <TextInput id="name" label="Use case Name" type="text" placeholder="" variant="standard" register={register} error={errors?.name} longScreen />
              </EditUseCasePanelContentContainer>
            </EditUseCasePanelContentWrapper>
            <EditUseCasePanelActionWrapper>
              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
                buttonText="cancel"
                type="button"
                customMinWidth="300px"
                customMinHeight="56px"
                onClickFunc={() => {
                  dispatch(resetEditUseCaseMode());
                  reset();
                }}
              />

              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_STYLE}
                bgColor="var(--color-homeworld)"
                buttonText="Save"
                type="submit"
                customMinWidth="300px"
                customMinHeight="56px"
              />
            </EditUseCasePanelActionWrapper>
          </EditUseCasePanelForm>
        </Box>
      </form>
    </EditUseCasePanelMain>
  );
}

EditUseCasePanel.propTypes = {
  isArchived: PropTypes.bool,
};

EditUseCasePanel.defaultProps = {
  isArchived: false,
};

export default EditUseCasePanel;
