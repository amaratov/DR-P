import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Checkbox, FormControlLabel } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { getIsUserLoggedIn, getLoginError } from '../../features/selectors';

import {
  LoginBottomTextWrapper,
  LoginCheckBoxWrapper,
  LoginErrorText,
  LoginFormWrapper,
  LoginHeader,
  ResetPasswordBackIcon,
  ResetPasswordHeader,
  ResetPasswordText,
} from '../form-elements/form-elements-styled';

import TextInput from '../form-elements/text-input';
import CustomButton from '../form-elements/custom-button';

import { backendService } from '../../services/backend';
import { BUTTON_STYLE } from '../../utils/constants/constants';

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isUserLoggedIn = useSelector(getIsUserLoggedIn);
  const loggedInStatus = localStorage.getItem('userLoginStatus');
  const loggedInExpireDateTime = localStorage.getItem('userLoginExpiringAt');
  const loginError = useSelector(getLoginError);

  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const resetPswText = 'Enter your Email Address, we will send you a password recovery email if you are in our system';
  const emailSentText = 'Check your email - if we found your email address, we are sending you instructions to reset your password.';

  const handleBack = useCallback(() => {
    setShowEmailSent(false);
    setShowResetPassword(false);
  }, [setShowEmailSent, setShowResetPassword]);

  const submitForm = data => {
    if (showResetPassword) {
      dispatch(backendService.forgotPassword(data.email));
      setShowEmailSent(true);
    } else {
      // set expire in 2hours
      if (!rememberMe) {
        const currentDateTime = new Date();
        const expireDateTime = () => currentDateTime.setHours(currentDateTime.getHours() + 2);
        localStorage.setItem('userLoginExpiringAt', expireDateTime().toString());
      }
      dispatch(backendService.loginUser(data));
      try {
        const stateObj = { login: 'client-portfolio' };
        window.history.replaceState(stateObj, '', 'client-portfolio');
      } catch (e) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    if (loggedInExpireDateTime && parseInt(loggedInExpireDateTime, 10) < Date.now()) {
      localStorage.clear();
      window.location.reload();
    }
    if (isUserLoggedIn || (loggedInStatus && loggedInStatus === 'Logged in')) {
      const stateObj = { login: 'client-portfolio' };
      window.history.replaceState(stateObj, '', 'client-portfolio');
      navigate('../client-portfolio', { replace: true });
    } else {
      navigate('/login');
    }
  }, [isUserLoggedIn, navigate, loggedInStatus, loggedInExpireDateTime]);

  return (
    <LoginFormWrapper>
      <form onSubmit={handleSubmit(submitForm)}>
        <Box>
          {showResetPassword && (
            <div style={{ paddingBottom: '20px' }}>
              <ResetPasswordBackIcon onClick={handleBack}>
                <ArrowBackIcon sx={{ color: 'var(--color-batman)' }} />
              </ResetPasswordBackIcon>
              <ResetPasswordHeader>{!showEmailSent ? 'Reset Password' : 'Email Sent'}</ResetPasswordHeader>
              <ResetPasswordText>{!showEmailSent ? resetPswText : emailSentText}</ResetPasswordText>
            </div>
          )}
          {!showResetPassword && <LoginHeader>Login</LoginHeader>}
          {!showEmailSent && <TextInput id="email" label="Email Address" variant="standard" required register={register} error={errors?.email} />}
          {!showResetPassword && (
            <TextInput id="password" label="Password" variant="standard" type="password" required register={register} error={errors?.password} />
          )}
          {!showResetPassword && (
            <LoginCheckBoxWrapper>
              <FormControlLabel control={<Checkbox defaultChecked={false} onChange={() => setRememberMe(!rememberMe)} size="small" />} label="Remember Me" />
            </LoginCheckBoxWrapper>
          )}
          {loginError && <LoginErrorText>Invalid email + password combination</LoginErrorText>}
          {!showResetPassword && <LoginBottomTextWrapper onClick={() => setShowResetPassword(true)}>Forgot Password / Reset password</LoginBottomTextWrapper>}
          {!showResetPassword && (
            <CustomButton
              buttonStyle={BUTTON_STYLE.ROUNDED_STYLE}
              buttonText="Sign in"
              marginTop="40px"
              type="submit"
              customMinWidth="320px"
              customMinHeight="56px"
            />
          )}
          {showResetPassword && !showEmailSent && (
            <CustomButton
              buttonStyle={BUTTON_STYLE.ROUNDED_STYLE}
              buttonText="Reset Password"
              marginTop="40px"
              type="submit"
              customMinWidth="320px"
              customMinHeight="56px"
            />
          )}
        </Box>
      </form>
    </LoginFormWrapper>
  );
}

export default LoginForm;
