import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { getAddIndustryVerticalMode, getPageNum, getSortOrder, getSortOrderBy } from '../../../features/selectors/ui';
import {
  AddIndustryVerticalPanelActionWrapper,
  AddIndustryVerticalPanelContentContainer,
  AddIndustryVerticalPanelContentWrapper,
  AddIndustryVerticalPanelForm,
  AddIndustryVerticalPanelHeaderText,
  AddIndustryVerticalPanelMain,
  AddIndustryVerticalPanelSubHeaderText,
} from './add-industry-vertical-panel-styled';
import TextInput from '../../form-elements/text-input';
import { BUTTON_STYLE, TABS } from '../../../utils/constants/constants';
import CustomButton from '../../form-elements/custom-button';
import { resetAddIndustryVerticalMode, setRecentlyAdded } from '../../../features/slices/uiSlice';
import { backendService } from '../../../services/backend';
import { isEmpty } from '../../../utils/utils';
import { ErrorMessageText } from '../../form-elements/form-elements-styled';

function AddIndustryVerticalPanel({ activeTab }) {
  // dispatch
  const dispatch = useDispatch();

  // useForm
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  // state
  const [ivErrors, setIvErrors] = useState('');

  // selectors
  const isAddIndustryVerticalMode = useSelector(getAddIndustryVerticalMode);
  const page = useSelector(getPageNum);
  const order = useSelector(getSortOrder);
  const orderBy = useSelector(getSortOrderBy);

  // watch form value
  const watchVerticalName = watch('name', '');

  //const
  const disableAddBtn = !(watchVerticalName?.trim()?.length > 0);

  // func
  const submitForm = async data => {
    const finalData = { ...data };
    const response = await dispatch(backendService.createIndustryVertical(finalData));
    if (isEmpty())
      if (response?.payload?.industryvertical) {
        dispatch(setRecentlyAdded(response?.payload?.industryvertical?.id));
        dispatch(resetAddIndustryVerticalMode());
        reset();
      }
    if (response?.error) {
      setIvErrors('Duplicated Industry Vertical Name');
    } else {
      setIvErrors('');
    }
    await dispatch(backendService.getIndustryVerticalByParams({ archived: activeTab === TABS.ARCHIVES, page, order: [[orderBy, order]] }));
  };

  return (
    <AddIndustryVerticalPanelMain open={isAddIndustryVerticalMode}>
      <form onSubmit={handleSubmit(submitForm)} noValidate>
        <Box role="presentation">
          <AddIndustryVerticalPanelForm>
            <AddIndustryVerticalPanelHeaderText>Add Industry Vertical</AddIndustryVerticalPanelHeaderText>
            <AddIndustryVerticalPanelContentWrapper>
              <AddIndustryVerticalPanelContentContainer>
                <AddIndustryVerticalPanelSubHeaderText />
                <TextInput id="name" label="Vertical Name" type="text" placeholder="" variant="standard" register={register} error={errors?.name} longScreen />
                {!isEmpty(ivErrors) && <ErrorMessageText>{ivErrors}</ErrorMessageText>}
              </AddIndustryVerticalPanelContentContainer>
            </AddIndustryVerticalPanelContentWrapper>
            <AddIndustryVerticalPanelActionWrapper>
              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
                buttonText="cancel"
                type="button"
                customMinWidth="300px"
                customMinHeight="56px"
                onClickFunc={() => {
                  dispatch(resetAddIndustryVerticalMode());
                  setIvErrors('');
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
                disableButton={disableAddBtn}
              />
            </AddIndustryVerticalPanelActionWrapper>
          </AddIndustryVerticalPanelForm>
        </Box>
      </form>
    </AddIndustryVerticalPanelMain>
  );
}

AddIndustryVerticalPanel.propTypes = {
  activeTab: PropTypes.string,
};

AddIndustryVerticalPanel.defaultProps = {
  activeTab: TABS.ACTIVE_INDUSTRY_VERTICAL,
};

export default AddIndustryVerticalPanel;
