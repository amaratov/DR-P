import React from 'react';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LoginForm from './login-form';
import { LoginContent, LoginHeader, LoginIcons, LoginLogoWrapper, LoginPageContainer, LoginPageLeft, LoginPageRight, LoginText } from '../app/app-styled';
import DigitalRealtyLogo from '../../images/Digital_Realty_TM_Brandmark.svg';

function Login() {
  return (
    <LoginPageContainer>
      <LoginContent>
        <LoginPageLeft>
          <LoginLogoWrapper>
            <img src={DigitalRealtyLogo} alt="logo" />
          </LoginLogoWrapper>
          <LoginHeader>Welcome to Digital Realty</LoginHeader>
          <LoginText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna. Lorem ipsum dolor sit amet,
            consectetur adipiscin.
          </LoginText>
          <LoginIcons>
            <TwitterIcon />
            <FacebookRoundedIcon />
            <YouTubeIcon />
          </LoginIcons>
        </LoginPageLeft>
        <LoginPageRight>
          <LoginForm />
        </LoginPageRight>
      </LoginContent>
    </LoginPageContainer>
  );
}

export default Login;
