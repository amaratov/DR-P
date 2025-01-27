import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoginErrorText, LoginFormWrapper, LoginHeader } from '../form-elements/form-elements-styled';

import TextInput from '../form-elements/text-input';
import CustomButton from '../form-elements/custom-button';

import { backendService } from '../../services/backend';
import { BUTTON_ICON, BUTTON_STYLE } from '../../utils/constants/constants';
import { LoginContent, LoginIcons, LoginLogoWrapper, LoginPageContainer, LoginPageLeft, LoginPageRight, LoginText } from '../app/app-styled';
import DigitalRealtyLogo from '../../images/Digital_Realty_TM_Brandmark.svg';
import { isEmpty } from '../../utils/utils';
import { getResetPasswordSuccess } from '../../features/selectors';

function ResetForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const success = useSelector(getResetPasswordSuccess);

  const [resetPasswordError, setResetPasswordError] = useState('');

  const [searchParams, setSearchParams] = useSearchParams();

  const token = searchParams.get('resetCode');

  const submitForm = async data => {
    if (!isEmpty(resetPasswordError)) setResetPasswordError('');
    data.token = token;
    if (isEmpty(data.email)) setResetPasswordError('Email address is missing.');
    if (data.newpassword !== data.confirmpassword) setResetPasswordError('Passwords are not matched, please double check.');
    if (isEmpty(errors) && data.newpassword === data.confirmpassword) {
      data.password = data.newpassword;
      try {
        await dispatch(backendService.resetPassword(data));
      } catch (e) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  }, [success]);

  return (
    <LoginPageContainer>
      <LoginContent>
        <LoginPageLeft>
          <LoginLogoWrapper>
            <img src={DigitalRealtyLogo} alt="logo" />
          </LoginLogoWrapper>
          <LoginHeader style={{ color: '#fff' }}>Welcome to Digital Realty</LoginHeader>
          <LoginText>Please enter your new password and submit.</LoginText>
          <LoginIcons>
            <TwitterIcon />
            <FacebookRoundedIcon />
            <YouTubeIcon />
          </LoginIcons>
        </LoginPageLeft>
        <LoginPageRight>
          <LoginFormWrapper>
            <form onSubmit={handleSubmit(submitForm)}>
              <Box>
                <LoginHeader>Reset Password</LoginHeader>
                {success && (
                  <div style={{ fontSize: '16px', lineHeight: '19px', letterSpacing: '-0.007em', color: '#969696', width: '300px', height: '58px' }}>
                    Your password successfully reset. Redirecting you to the <a href="/login">login</a> page
                  </div>
                )}
                {!success && <TextInput id="email" label="Email" variant="standard" required register={register} error={errors?.email} />}
                {!success && (
                  <TextInput
                    id="newpassword"
                    label="New Password"
                    variant="standard"
                    type="password"
                    required
                    register={register}
                    error={errors?.newpassword}
                  />
                )}
                {!success && (
                  <TextInput
                    id="confirmpassword"
                    label="Confirm Password"
                    variant="standard"
                    type="password"
                    required
                    register={register}
                    error={errors?.confirmpassword}
                  />
                )}
                {!isEmpty(resetPasswordError) && <LoginErrorText style={{ marginBottom: '10px' }}>{resetPasswordError}</LoginErrorText>}
                {!success && (
                  <CustomButton
                    buttonStyle={BUTTON_STYLE.CONTAINED_STYLE}
                    icon={BUTTON_ICON.ARROW}
                    buttonText="submit"
                    marginTop="60px"
                    type="submit"
                    customMinWidth="300px"
                    customMinHeight="50px"
                  />
                )}
              </Box>
            </form>
          </LoginFormWrapper>
        </LoginPageRight>
      </LoginContent>
    </LoginPageContainer>
  );
}

export default ResetForm;
