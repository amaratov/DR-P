import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import { getAddUserMode, getSelectedCompanyDetails, getSelectedProjectDetails } from '../../../features/selectors/ui';
import {
  AddUserPanelActionWrapper,
  AddUserPanelContentContainer,
  AddUserPanelContentWrapper,
  AddUserPanelForm,
  AddUserPanelHeaderText,
  AddUserPanelMain,
} from './add-user-panel-styled';
import TextInput from '../../form-elements/text-input';
import { BUTTON_STYLE } from '../../../utils/constants/constants';
import CustomButton from '../../form-elements/custom-button';
import { resetAddUserMode } from '../../../features/slices/uiSlice';
import { getAllRoles, getAllUsers } from '../../../features/selectors';
import { backendService } from '../../../services/backend';
import { LabelText, LabelTextAltColor, RoleText } from '../account-info/account-info-styled';
import CustomChip from '../../chip/custom-chip';
import { isEmpty } from '../../../utils/utils';
import { PhoneNumberFieldErrorMsg, PhoneNumberFieldLabel, PhoneNumberFieldWrapper } from '../../app/app-styled';
import { resetAllUsers } from '../../../features/slices/userSlice';

function AddUserPanel({ associateToCompany, associateToProject, isAddCustomer }) {
  // dispatch
  const dispatch = useDispatch();

  // useForm
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    control,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm();

  // state
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [phoneNumValue, setPhoneNumValue] = useState();
  const [resErrors, setResErrors] = useState();
  const watchRole = watch('role'); // ridiculous that setValue() doesn't update the form hook

  // selectors
  const allRoles = useSelector(getAllRoles);
  const allUsers = useSelector(getAllUsers);
  const isAddUserMode = useSelector(getAddUserMode);
  const selectedCompanyDetails = useSelector(getSelectedCompanyDetails);
  const selectedProjectDetails = useSelector(getSelectedProjectDetails);

  // memo
  const customerRole = useMemo(() => allRoles.find(role => role?.name === 'customer'), [allRoles]);

  // func
  // debounce handleChange so that editing text fields don't cause a redux change loop for every key stroke.
  let changeTimeout = null;
  const handleFormChange = useCallback(() => {
    clearTimeout(changeTimeout);
    changeTimeout = setTimeout(() => {
      const currentFormValues = getValues();
      const hasMissingFields = isEmpty(currentFormValues?.firstName) || isEmpty(currentFormValues?.lastName) || isEmpty(currentFormValues?.email);
      if (!hasMissingFields && disableSubmit) setDisableSubmit(false);
      if (hasMissingFields && !disableSubmit) setDisableSubmit(true);
    }, 250);
  }, [disableSubmit, getValues, setDisableSubmit]);

  const submitForm = useCallback(
    async data => {
      // random password
      const randomPsw = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
      const finalData = isAddCustomer
        ? {
            ...data,
            role: customerRole?.id,
            password: randomPsw,
          }
        : { ...data, password: randomPsw };

      if (associateToCompany && (selectedProjectDetails?.companyId || selectedCompanyDetails?.id)) {
        finalData.associatedCompanies = [selectedProjectDetails?.companyId || selectedCompanyDetails?.id];
      }

      if (associateToProject && selectedProjectDetails?.id) {
        finalData.associatedProjects = [selectedProjectDetails?.id];
      }
      try {
        const res = await dispatch(backendService.createUser(finalData));

        if (res?.payload?.user?.email) {
          await dispatch(backendService.forgotPassword(res.payload.user.email));
        }

        reset();

        await dispatch(resetAllUsers());
        await dispatch(backendService.getActiveUsers());

        if (!isEmpty(selectedCompanyDetails)) {
          await dispatch(backendService.getCompanyById(selectedCompanyDetails?.id));
          await dispatch(backendService.getActiveUsers({ page: allUsers?.page || 1, roles: [customerRole.id] }));
        }

        if (!isEmpty(selectedProjectDetails)) {
          await dispatch(backendService.getProjectById(selectedProjectDetails?.id));
        }
      } catch (error) {
        console.error(error);
        setResErrors(error);
      }
    },
    [allUsers, associateToCompany, associateToProject, customerRole, isAddCustomer, selectedProjectDetails, setResErrors]
  );

  // Need to inform the form at this point there are response errors
  // because in the `submitForm` function after the dispatch, the catch handler doesn't 'trigger'
  // any re-render when setting errors in the form, so have to keep a middle step of state
  // handling in this component to making sure the input component below will update with
  // errors from the server response.
  useEffect(() => {
    (resErrors || []).forEach(e => {
      setError(e.path, { type: 'custom', message: e.message });
    });
  }, [resErrors]);

  // added noValidate on form tag so the html validation popup doesn't show
  // and we have our own validation
  return (
    <AddUserPanelMain open={isAddUserMode}>
      <form onChange={handleFormChange} onSubmit={handleSubmit(submitForm)} noValidate>
        <Box role="presentation">
          <AddUserPanelForm>
            <AddUserPanelHeaderText>Add a User</AddUserPanelHeaderText>
            <AddUserPanelContentWrapper>
              <AddUserPanelContentContainer>
                <TextInput id="firstName" label="First Name" type="text" placeholder="" variant="standard" register={register} error={errors?.firstName} />
                <TextInput id="lastName" label="Last Name" type="text" placeholder="" variant="standard" register={register} error={errors?.lastName} />
                <PhoneNumberFieldWrapper error={!isEmpty(errors?.phone)}>
                  <PhoneNumberFieldLabel>Phone Number</PhoneNumberFieldLabel>
                  <PhoneInputWithCountry
                    name="phone"
                    control={control}
                    rules={{ required: false, validate: value => isEmpty(value) || isPossiblePhoneNumber(value) || 'Invalid Phone Number' }}
                  />
                  {!isEmpty(errors?.phone) && <PhoneNumberFieldErrorMsg style={{ width: '100%' }}>{errors?.phone?.message}</PhoneNumberFieldErrorMsg>}
                </PhoneNumberFieldWrapper>
              </AddUserPanelContentContainer>
              <AddUserPanelContentContainer>
                <TextInput id="email" label="Email Address" placeholder="" type="email" variant="standard" register={register} error={errors?.email} />
                {!isAddCustomer && (
                  <TextInput
                    id="role"
                    label="Select User Role"
                    select
                    options={allRoles}
                    placeholder=""
                    variant="standard"
                    register={register}
                    error={errors?.role}
                    onChange={event => {
                      setValue('role', event.target.value);
                    }}
                    value={watchRole}
                  />
                )}
                {isAddCustomer && (
                  <>
                    <LabelText>User Role</LabelText>
                    <RoleText>
                      <CustomChip label={customerRole?.name} />
                    </RoleText>
                  </>
                )}
              </AddUserPanelContentContainer>
            </AddUserPanelContentWrapper>
            <AddUserPanelActionWrapper>
              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
                buttonText="cancel"
                marginTop="0"
                type="button"
                customMinWidth="300px"
                customMinHeight="56px"
                onClickFunc={() => {
                  dispatch(resetAddUserMode());
                  reset();
                }}
              />

              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_STYLE}
                buttonText="Add User"
                marginTop="0"
                type="submit"
                customMinWidth="300px"
                customMinHeight="56px"
                disabled={disableSubmit}
              />
            </AddUserPanelActionWrapper>
          </AddUserPanelForm>
        </Box>
      </form>
    </AddUserPanelMain>
  );
}

AddUserPanel.propTypes = {
  associateToCompany: PropTypes.bool,
  associateToProject: PropTypes.bool,
  isAddCustomer: PropTypes.bool,
};

AddUserPanel.defaultProps = {
  associateToCompany: false,
  associateToProject: false,
  isAddCustomer: false,
};

export default AddUserPanel;
