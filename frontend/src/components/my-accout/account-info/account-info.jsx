import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form';
import { isPossiblePhoneNumber } from 'react-phone-number-input';
import { styled } from '@mui/material/styles';
import { Divider, Grid, Paper } from '@mui/material';
import { AccountFlexContainer, AccountInfoSubHeader, AccountInfoWrapper, LabelTextAltColor, ValueTextAlt } from './account-info-styled';
import { PanelContentWrapper, PanelFooterAction, PanelHeaderFlexContainer, PanelHeaderText, PanelHeaderWrapper } from '../my-account-styled';
import { DRDivider, PhoneNumberFieldErrorMsg, PhoneNumberFieldLabel, PhoneNumberFieldWrapper } from '../../app/app-styled';
import { BUTTON_ICON, BUTTON_STYLE, EDIT_MODE, FEATURE_CONFIG } from '../../../utils/constants/constants';
import CustomButton from '../../form-elements/custom-button';
import CustomChip from '../../chip/custom-chip';
import { getEditMode } from '../../../features/selectors/ui';
import { getWhoAmI } from '../../../features/selectors';
import TextInput from '../../form-elements/text-input';
import { resetEditMode, setEditMode } from '../../../features/slices/uiSlice';
import { backendService } from '../../../services/backend';
import { isEmpty } from '../../../utils/utils';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: 'inherit',
  border: 'unset',
  boxShadow: 'unset',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
}));

function AccountInfo({ userInfo, allRoles }) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const editMode = useSelector(getEditMode);
  const whoami = useSelector(getWhoAmI);

  // useForm
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  // const
  const roleName = whoami?.role?.name?.toLowerCase();
  const isAdminOrSa = FEATURE_CONFIG.ADMIN_AND_SA_ONLY.access_group.includes(roleName);
  const isEditSelfMode = editMode === EDIT_MODE.EDIT_SELF;

  // func
  const handleEditButtonClick = useCallback(() => {
    dispatch(setEditMode(EDIT_MODE.EDIT_SELF));
  }, [dispatch]);

  const handleCancelButtonClick = useCallback(() => {
    dispatch(resetEditMode());
  }, [dispatch]);

  const submitForm = data => {
    const obj = {
      id: whoami?.id,
      firstName: data?.firstName,
      lastName: data?.lastName,
      phone: data?.phone,
      role: data?.role,
      email: data?.email,
    };
    dispatch(backendService.updateUser(obj));
    dispatch(resetEditMode());
  };

  // effect
  useEffect(() => {
    if (isEditSelfMode) {
      reset({
        firstName: whoami?.firstName,
        lastName: whoami?.lastName,
        email: whoami?.email,
        phone: whoami?.phone,
        role: whoami?.role?.id,
        password: '*******',
      });
    }
  }, [isEditSelfMode, reset, whoami]);

  return (
    <div>
      <form onSubmit={handleSubmit(submitForm)} noValidate>
        <PanelHeaderWrapper>
          <PanelHeaderFlexContainer>
            <PanelHeaderText>Your Account</PanelHeaderText>
          </PanelHeaderFlexContainer>
          <DRDivider />
        </PanelHeaderWrapper>
        <PanelContentWrapper>
          <AccountInfoWrapper>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={12}>
                <Item>
                  <AccountFlexContainer>
                    <AccountInfoSubHeader>Account Information</AccountInfoSubHeader>
                    {/*
                    {!isEditSelfMode ? (
                      <CustomButton
                        buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
                        icon={BUTTON_ICON.EDIT}
                        buttonText="Edit"
                        marginTop="60px"
                        type="button"
                        customMinWidth="60px"
                        customMinHeight="50px"
                        disableButton={!isAdminOrSa}
                        onClickFunc={handleEditButtonClick}
                      />
                    ) : (
                      <CustomButton
                        buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
                        icon={BUTTON_ICON.CANCEL}
                        buttonText="Cancel"
                        marginTop="60px"
                        type="button"
                        customMinWidth="60px"
                        customMinHeight="50px"
                        useColor="#DC4B4A"
                        onClickFunc={handleCancelButtonClick}
                      />
                    )}
                    */}
                  </AccountFlexContainer>
                </Item>
              </Grid>
              <Grid item xs={12} sx={{ margin: '24px 5px' }}>
                <Divider />
              </Grid>
              <Grid item xs={4}>
                {!isEditSelfMode ? (
                  <Item>
                    <LabelTextAltColor>First Name</LabelTextAltColor>
                    <ValueTextAlt>{userInfo?.firstName}</ValueTextAlt>
                  </Item>
                ) : (
                  <TextInput
                    id="firstName"
                    label="First Name"
                    placeholder={whoami?.firstName}
                    variant="standard"
                    register={register}
                    error={errors?.firstName}
                  />
                )}
              </Grid>
              <Grid item xs={4}>
                {!isEditSelfMode ? (
                  <Item>
                    <LabelTextAltColor>Last Name</LabelTextAltColor>
                    <ValueTextAlt>{userInfo?.lastName}</ValueTextAlt>
                  </Item>
                ) : (
                  <TextInput id="lastName" label="Last Name" placeholder={whoami?.lastName} variant="standard" register={register} error={errors?.lastName} />
                )}
              </Grid>
              <Grid item xs={4}>
                {!isEditSelfMode ? (
                  <Item>
                    <LabelTextAltColor>User Role</LabelTextAltColor>
                    <ValueTextAlt>
                      <CustomChip label={userInfo?.role} showGreyColor />
                    </ValueTextAlt>
                  </Item>
                ) : (
                  <TextInput
                    id="role"
                    label="Select User Role"
                    select
                    options={allRoles}
                    defaultValue={whoami?.role?.id}
                    variant="standard"
                    register={register}
                    error={errors?.role}
                  />
                )}
              </Grid>
              <Grid item xs={4}>
                {!isEditSelfMode ? (
                  <Item>
                    <LabelTextAltColor>Phone Number</LabelTextAltColor>
                    <ValueTextAlt>{userInfo?.phone}</ValueTextAlt>
                  </Item>
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
              </Grid>
              <Grid item xs={4}>
                {!isEditSelfMode ? (
                  <Item>
                    <LabelTextAltColor>Email Address</LabelTextAltColor>
                    <ValueTextAlt>{userInfo?.email}</ValueTextAlt>
                  </Item>
                ) : (
                  <TextInput
                    id="email"
                    label="Email Address"
                    type="email"
                    placeholder={whoami?.email}
                    variant="standard"
                    register={register}
                    error={errors?.email}
                  />
                )}
              </Grid>
              <Grid item xs={4}>
                {!isEditSelfMode ? (
                  <Item>
                    <LabelTextAltColor>Password</LabelTextAltColor>
                    <ValueTextAlt>*******</ValueTextAlt>
                  </Item>
                ) : (
                  <TextInput
                    id="password"
                    label="Password"
                    type="password"
                    placeholder="*******"
                    variant="standard"
                    register={register}
                    error={errors?.password}
                  />
                )}
              </Grid>
            </Grid>
          </AccountInfoWrapper>
        </PanelContentWrapper>
        {isEditSelfMode && (
          <PanelFooterAction>
            <CustomButton buttonStyle={BUTTON_STYLE.ROUNDED_STYLE} buttonText="Save Information" type="submit" customMinWidth="300px" customMinHeight="56px" />
          </PanelFooterAction>
        )}
      </form>
    </div>
  );
}

AccountInfo.propTypes = {
  userInfo: PropTypes.shape({ firstName: PropTypes.string, lastName: PropTypes.string, email: PropTypes.string, phone: PropTypes.string }),
  allRoles: PropTypes.shape({ roles: PropTypes.shape([]) }),
};

AccountInfo.defaultProps = {
  userInfo: { firstName: '', lastName: '', email: '', phone: '' },
  allRoles: {},
};

export default AccountInfo;
