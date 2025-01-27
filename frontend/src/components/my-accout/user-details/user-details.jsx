import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Backdrop, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  SidePanelCompanyHeader,
  SidePanelCompanyWrapper,
  SidePanelContentItem,
  SidePanelContentWrapper,
  SidePanelEdgePatch,
  SidePanelEditAction,
  SidePanelHeaderCloseBtn,
  SidePanelHeaderText,
  SidePanelHeaderWrapper,
  SidePanelMainWrapper,
  SidePanelSaveButtonWrapper,
} from '../../side-panel/side-panel-styled';
import { FilledValueRemoveIcon, FilledValueText, FilledValueWrapper, LabelTextAltColor, ValueText } from '../account-info/account-info-styled';
import CustomButton from '../../form-elements/custom-button';
import TextInput from '../../form-elements/text-input';
import CustomChip from '../../chip/custom-chip';
import { BUTTON_ICON, BUTTON_STYLE, EDIT_MODE } from '../../../utils/constants/constants';
import { getNameFromId, isEmpty } from '../../../utils/utils';
import { backendService } from '../../../services/backend';
import { getEditMode, getOpenAssociatedCompany, getSelectedUserDetails } from '../../../features/selectors/ui';
import { resetEditMode, setEditMode, setOpenAssociatedCompany, setSelectedUserDetails } from '../../../features/slices/uiSlice';
import { getAllRoles } from '../../../features/selectors';
import { getCompaniesWithCreatorFullName, getCurrentPageForCompany, getNumPagesForCompany } from '../../../features/selectors/company';
import AssociatedCompanyPanel from '../associated-company-panel/associated-company-panel';
import { DRDivider, PhoneNumberFieldErrorMsg, PhoneNumberFieldLabel, PhoneNumberFieldWrapper } from '../../app/app-styled';

function UserDetails() {
  // dispatch
  const dispatch = useDispatch();

  // selectors
  const selectedUserDetails = useSelector(getSelectedUserDetails);
  const editMode = useSelector(getEditMode);
  const allRoles = useSelector(getAllRoles);
  const companies = useSelector(getCompaniesWithCreatorFullName);
  const numPages = useSelector(getNumPagesForCompany);
  const currentPage = useSelector(getCurrentPageForCompany);
  const openAssociatedCompany = useSelector(getOpenAssociatedCompany);

  // state
  const [additionalValues, setAdditionalValues] = useState({ associatedCompanies: [] });
  const [resErrors, setResErrors] = useState();

  // useForm
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    setError,
    setValue,
  } = useForm();

  // useMemo
  const userAssociatedCompanies = useMemo(() => {
    return companies?.filter(
      comp =>
        comp?.associatedUsers?.some(usr => usr.id === selectedUserDetails?.id) ||
        comp?.projects?.some(project => project?.associatedUsers?.some(usr => usr.id === selectedUserDetails?.id)) ||
        additionalValues?.associatedCompanies?.includes(comp?.id)
    );
  }, [companies, additionalValues, selectedUserDetails]);

  // const
  const isEditUserMode = editMode === EDIT_MODE.EDIT_USER;

  // func
  const handleUserDetailsClose = useCallback(() => {
    dispatch(setSelectedUserDetails({}));
    dispatch(resetEditMode());
    dispatch(setOpenAssociatedCompany(false));
  }, [dispatch]);

  const handleEditButtonClick = useCallback(() => {
    dispatch(setEditMode(EDIT_MODE.EDIT_USER));
  }, [dispatch]);

  const handleClick = useCallback(
    (val, fieldName) => {
      if (fieldName === 'associatedCompanies') {
        if (additionalValues?.[fieldName]?.includes(val)) {
          const newVal = additionalValues[fieldName].filter(id => id !== val);
          setAdditionalValues({ ...additionalValues, [fieldName]: newVal });
        } else {
          setAdditionalValues({ ...additionalValues, [fieldName]: additionalValues[fieldName].concat([val]) });
        }
      }
    },
    [additionalValues, setAdditionalValues]
  );

  const submitForm = data => {
    const obj = {
      id: selectedUserDetails?.id,
      ...data,
      ...additionalValues,
    };
    return dispatch(backendService.updateUser(obj))
      .unwrap()
      .then(user => {
        dispatch(setOpenAssociatedCompany(false));
        reset();
      })
      .catch(err => {
        setResErrors(err);
      });
  };

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

  // effect
  useEffect(() => {
    if (isEditUserMode) {
      reset({
        firstName: selectedUserDetails?.firstName,
        lastName: selectedUserDetails?.lastName,
        email: selectedUserDetails?.email,
        phone: selectedUserDetails?.phone,
        role: selectedUserDetails?.fullRole?.id,
      });
    }
  }, [isEditUserMode, reset, selectedUserDetails, userAssociatedCompanies]);

  return (
    <div>
      <SidePanelEdgePatch showPatch={openAssociatedCompany} />
      <Backdrop
        sx={{
          backdropFilter: 'blur(10px)',
          mixBlendMode: 'normal',
          background: 'linear-gradient(110.1deg, rgba(65, 94, 199, 0.9) 0%, rgba(77, 57, 202, 0.9) 100%)',
          zIndex: theme => theme.zIndex.drawer - 30,
        }}
        open={!isEmpty(selectedUserDetails)}
      />
      <SwipeableDrawer
        disableEnforceFocus
        hideBackdrop
        anchor="left"
        open={!isEmpty(selectedUserDetails)}
        onClose={handleUserDetailsClose}
        onOpen={() => {}}
        PaperProps={{
          style: {
            marginLeft: '8px',
            borderRadius: '30px',
          },
        }}>
        <form onSubmit={handleSubmit(submitForm)} style={{ position: 'relative' }} noValidate>
          <Box sx={{ minWidth: 350, position: 'relative' }} role="presentation">
            <SidePanelMainWrapper>
              <SidePanelHeaderWrapper>
                <SidePanelHeaderText>{!isEditUserMode ? 'Contact Information' : 'Edit Contact'}</SidePanelHeaderText>
                <SidePanelHeaderCloseBtn>
                  <CloseIcon onClick={handleUserDetailsClose} />
                </SidePanelHeaderCloseBtn>
              </SidePanelHeaderWrapper>
              {!isEditUserMode && (
                <>
                  <SidePanelEditAction onClick={handleEditButtonClick}>
                    <CustomButton
                      buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
                      icon={BUTTON_ICON.EDIT}
                      buttonText="Edit Contact Information"
                      type="button"
                      padding="0"
                    />
                  </SidePanelEditAction>
                  <DRDivider margin="10px 0" />
                </>
              )}
              <SidePanelContentWrapper>
                <SidePanelContentItem>
                  {!isEditUserMode ? (
                    <>
                      <LabelTextAltColor>First Name</LabelTextAltColor>
                      <ValueText>{selectedUserDetails?.firstName}</ValueText>
                      <DRDivider margin="20px 0" />
                    </>
                  ) : (
                    <TextInput
                      id="firstName"
                      label="First Name"
                      placeholder={selectedUserDetails?.firstName}
                      variant="standard"
                      register={register}
                      error={errors?.firstName}
                    />
                  )}
                </SidePanelContentItem>
                <SidePanelContentItem>
                  {!isEditUserMode ? (
                    <>
                      <LabelTextAltColor>Last Name</LabelTextAltColor>
                      <ValueText>{selectedUserDetails?.lastName}</ValueText>
                      <DRDivider margin="20px 0" />
                    </>
                  ) : (
                    <TextInput
                      id="lastName"
                      label="Last Name"
                      placeholder={selectedUserDetails?.lastName}
                      variant="standard"
                      register={register}
                      error={errors?.lastName}
                    />
                  )}
                </SidePanelContentItem>
                <SidePanelContentItem>
                  {!isEditUserMode ? (
                    <>
                      <LabelTextAltColor>User Role</LabelTextAltColor>
                      <CustomChip label={selectedUserDetails?.fullRole?.name} />
                      <DRDivider margin="20px 0" />
                    </>
                  ) : (
                    <TextInput
                      id="role"
                      label="Select User Role"
                      select
                      options={allRoles}
                      variant="standard"
                      register={register}
                      error={errors?.role}
                      onChange={event => {
                        dispatch(setSelectedUserDetails({ ...selectedUserDetails, role: event.target.value }));
                      }}
                      value={selectedUserDetails?.role}
                    />
                  )}
                </SidePanelContentItem>
                <SidePanelContentItem>
                  {!isEditUserMode ? (
                    <>
                      <LabelTextAltColor>Email Address</LabelTextAltColor>
                      <ValueText>{selectedUserDetails?.email}</ValueText>
                      <DRDivider margin="20px 0" />
                    </>
                  ) : (
                    <TextInput
                      id="email"
                      label="Email Address"
                      type="email"
                      placeholder={selectedUserDetails?.email}
                      variant="standard"
                      register={register}
                      error={errors?.email}
                    />
                  )}
                </SidePanelContentItem>
                <SidePanelContentItem>
                  {!isEditUserMode ? (
                    <>
                      <LabelTextAltColor>Phone Number</LabelTextAltColor>
                      <ValueText>{selectedUserDetails?.phone}</ValueText>
                      <DRDivider margin="20px 0" />
                    </>
                  ) : (
                    <PhoneNumberFieldWrapper error={!isEmpty(errors?.phone)}>
                      <PhoneNumberFieldLabel>Phone Number</PhoneNumberFieldLabel>
                      <PhoneInputWithCountry
                        name="phone"
                        control={control}
                        rules={{ required: false, validate: value => isEmpty(value) || isPossiblePhoneNumber(value) || 'Invalid Phone Number' }}
                      />
                      {!isEmpty(errors?.phone) && <PhoneNumberFieldErrorMsg style={{ width: '100%' }}>{errors?.phone?.message}</PhoneNumberFieldErrorMsg>}
                    </PhoneNumberFieldWrapper>
                  )}
                </SidePanelContentItem>
              </SidePanelContentWrapper>
              <SidePanelCompanyWrapper>
                <SidePanelCompanyHeader>Associated Companies</SidePanelCompanyHeader>
                {userAssociatedCompanies?.map(comp => (
                  <FilledValueWrapper key={`key-${comp?.id}`}>
                    <FilledValueText>{getNameFromId(comp?.id, companies)}</FilledValueText>
                    {isEditUserMode && (
                      <FilledValueRemoveIcon>
                        <CustomButton
                          buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                          icon={BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON}
                          buttonText="Remove"
                          type="button"
                          onClickFunc={() => handleClick(comp?.id, 'associatedCompanies')}
                        />
                      </FilledValueRemoveIcon>
                    )}
                  </FilledValueWrapper>
                ))}
                {isEditUserMode && (
                  <CustomButton
                    buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
                    icon={BUTTON_ICON.ADD_BORDERLESS}
                    buttonText="Add Company"
                    type="button"
                    customMinWidth="300px"
                    customMinHeight="50px"
                    onClickFunc={() => dispatch(setOpenAssociatedCompany(true))}
                  />
                )}
              </SidePanelCompanyWrapper>
            </SidePanelMainWrapper>
            {isEditUserMode && (
              <SidePanelSaveButtonWrapper customLeft="30px">
                <CustomButton buttonStyle={BUTTON_STYLE.ROUNDED_STYLE} buttonText="Save Contact" type="submit" customMinWidth="300px" customMinHeight="50px" />
              </SidePanelSaveButtonWrapper>
            )}
          </Box>
        </form>
      </SwipeableDrawer>
      <AssociatedCompanyPanel
        selectedUserDetails={selectedUserDetails}
        companies={companies}
        additionalValues={additionalValues}
        handleClick={handleClick}
        leftPositionDrawerContainer={360}
        numPages={numPages}
        currentPage={currentPage}
      />
    </div>
  );
}

UserDetails.propTypes = {};

export default UserDetails;
