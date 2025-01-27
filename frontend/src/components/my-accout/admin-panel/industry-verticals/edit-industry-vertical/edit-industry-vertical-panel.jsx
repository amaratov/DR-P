import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { getEditMode, getSelectedIndustryVerticalDetails } from '../../../../../features/selectors/ui';
import {
  EditIndustryVerticalPanelActionWrapper,
  EditIndustryVerticalPanelContentContainer,
  EditIndustryVerticalPanelContentWrapper,
  EditIndustryVerticalPanelForm,
  EditIndustryVerticalPanelHeaderText,
  EditIndustryVerticalPanelMain,
  EditIndustryVerticalPanelSubHeaderText,
} from './edit-industry-vertical-panel-styled';
import TextInput from '../../../../form-elements/text-input';
import { BUTTON_STYLE } from '../../../../../utils/constants/constants';
import CustomButton from '../../../../form-elements/custom-button';
import { resetEditIndustryVerticalMode, setRecentlyEdited } from '../../../../../features/slices/uiSlice';
import { backendService } from '../../../../../services/backend';

function EditIndustryVerticalPanel() {
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
  const isEditIndustryVerticalMode = useSelector(getEditMode);
  const selectedIndustryVerticalDetails = useSelector(getSelectedIndustryVerticalDetails);

  // func
  const submitForm = data => {
    const finalData = {
      ...data,
      id: selectedIndustryVerticalDetails.id,
    };
    dispatch(backendService.updateIndustryVertical(finalData));
    dispatch(setRecentlyEdited(selectedIndustryVerticalDetails.id));
    dispatch(resetEditIndustryVerticalMode());
    reset();
  };

  useEffect(() => {
    if (isEditIndustryVerticalMode) {
      reset({
        name: selectedIndustryVerticalDetails?.name,
      });
    }
  }, [isEditIndustryVerticalMode, reset, selectedIndustryVerticalDetails]);

  return (
    <EditIndustryVerticalPanelMain open={isEditIndustryVerticalMode}>
      <form onSubmit={handleSubmit(submitForm)} noValidate>
        <Box role="presentation">
          <EditIndustryVerticalPanelForm>
            <EditIndustryVerticalPanelHeaderText>Edit Vertical</EditIndustryVerticalPanelHeaderText>
            <EditIndustryVerticalPanelContentWrapper>
              <EditIndustryVerticalPanelContentContainer>
                <EditIndustryVerticalPanelSubHeaderText />
                <TextInput id="name" label="Vertical Name" type="text" placeholder="" variant="standard" register={register} error={errors?.name} longScreen />
              </EditIndustryVerticalPanelContentContainer>
            </EditIndustryVerticalPanelContentWrapper>
            <EditIndustryVerticalPanelActionWrapper>
              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
                buttonText="Cancel"
                type="button"
                customMinWidth="300px"
                customMinHeight="56px"
                onClickFunc={() => {
                  dispatch(resetEditIndustryVerticalMode());
                  reset();
                }}
              />

              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_STYLE}
                buttonText="Save"
                bgColor="var(--color-homeworld)"
                type="submit"
                customMinWidth="300px"
                customMinHeight="56px"
              />
            </EditIndustryVerticalPanelActionWrapper>
          </EditIndustryVerticalPanelForm>
        </Box>
      </form>
    </EditIndustryVerticalPanelMain>
  );
}

export default EditIndustryVerticalPanel;
