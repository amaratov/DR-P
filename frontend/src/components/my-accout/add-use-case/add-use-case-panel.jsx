import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { getAddUseCaseMode, getPageNum, getSortOrder, getSortOrderBy } from '../../../features/selectors/ui';
import {
  AddUseCasePanelActionWrapper,
  AddUseCasePanelContentContainer,
  AddUseCasePanelContentWrapper,
  AddUseCasePanelForm,
  AddUseCasePanelHeaderText,
  AddUseCasePanelMain,
  AddUseCasePanelSubHeaderText,
} from './add-use-case-panel-styled';
import TextInput from '../../form-elements/text-input';
import { BUTTON_STYLE } from '../../../utils/constants/constants';
import CustomButton from '../../form-elements/custom-button';
import { resetAddUseCaseMode } from '../../../features/slices/uiSlice';
import { backendService } from '../../../services/backend';

function AddUseCasePanel({ isArchived }) {
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
  const isAddUseCaseMode = useSelector(getAddUseCaseMode);
  const page = useSelector(getPageNum);
  const order = useSelector(getSortOrder);
  const orderBy = useSelector(getSortOrderBy);

  // func
  const submitForm = data => {
    const finalData = { ...data };
    dispatch(backendService.createUseCase(finalData));
    setTimeout(() => {
      dispatch(backendService.getUseCasesByParams({ archived: isArchived, page, order: [[orderBy, order]] }));
    }, 300);
    reset();
  };

  return (
    <AddUseCasePanelMain open={isAddUseCaseMode}>
      <form onSubmit={handleSubmit(submitForm)} noValidate>
        <Box role="presentation">
          <AddUseCasePanelForm>
            <AddUseCasePanelHeaderText>Add a Use Case</AddUseCasePanelHeaderText>
            <AddUseCasePanelContentWrapper>
              <AddUseCasePanelContentContainer>
                <AddUseCasePanelSubHeaderText />
                <TextInput id="name" label="Use case Name" type="text" placeholder="" variant="standard" register={register} error={errors?.name} longScreen />
              </AddUseCasePanelContentContainer>
            </AddUseCasePanelContentWrapper>
            <AddUseCasePanelActionWrapper>
              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
                buttonText="cancel"
                type="button"
                customMinWidth="300px"
                customMinHeight="56px"
                onClickFunc={() => {
                  dispatch(resetAddUseCaseMode());
                  reset();
                }}
              />

              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_STYLE}
                buttonText="Add"
                bgColor="var(--color-homeworld)"
                type="submit"
                customMinWidth="300px"
                customMinHeight="56px"
              />
            </AddUseCasePanelActionWrapper>
          </AddUseCasePanelForm>
        </Box>
      </form>
    </AddUseCasePanelMain>
  );
}

AddUseCasePanel.propTypes = {
  isArchived: PropTypes.bool,
};

AddUseCasePanel.defaultProps = {
  isArchived: false,
};

export default AddUseCasePanel;
