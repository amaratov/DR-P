import styled from '@emotion/styled';
import { Divider } from '@mui/material';
import LoginBg from '../../images/Login_bg.png';
import DefaultBg from '../../images/default_bg.png';

export const GeneralContentContainer = styled.div`
  background-image: url(${DefaultBg});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #e7eafb;
  min-height: 100%;
`;

export const DRDivider = styled(Divider)`
  margin: ${({ margin }) => margin || '0'};
  color: var(--color-batman);
  ${({ isBorderColor }) => isBorderColor && 'border-color: var(--color-aluminium)'};
  ${({ isFaded }) => isFaded && 'opacity: 50%'};
`;

export const LoginPageContainer = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${LoginBg});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: var(--color-homeworld);
  color: var(--color-la-luna);
`;

export const LoginContent = styled.div`
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 100px;
  height: 100%;
`;

export const LoginPageLeft = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: start;
  justify-content: center;
  text-align: left;
  padding-left: 35%;
`;

export const LoginPageRight = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
`;

export const LoginLogoWrapper = styled.div`
  margin-bottom: 36px;
`;

export const LoginHeader = styled.div`
  max-width: 450px;
  font-family: 'Manrope', sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 32px;
  line-height: 44px;
  margin-bottom: 36px;
`;

export const LoginText = styled.div`
  max-width: 450px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 36px;
  opacity: 0.6;
`;

export const LoginIcons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
`;

export const PhoneNumberFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 320px;
  min-height: 50px;
  .PhoneInput {
    padding-bottom: 10px;
    .PhoneInputCountry {
      border-bottom: 1px solid #e6e6e6;
      padding-bottom: 10px;
    }
    input {
      background-color: inherit;
      border-top: unset;
      border-left: unset;
      border-right: unset;
      border-bottom: ${({ error }) => (error ? '1px solid #d32f2f' : '1px solid #e6e6e6')};
      padding-bottom: 10px;
      &:focus {
        outline: none;
      }
    }
  }
`;

export const PhoneNumberFieldLabel = styled.div`
  min-width: 85px;
  min-height: 20px;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 11px;
  line-height: 20px;
  display: flex;
  align-items: center;
  color: var(--color-cathedral);
  margin-bottom: 10px;
`;

export const PhoneNumberFieldErrorMsg = styled.div`
  flex: 1;
  width: 100%;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1.66;
  letter-spacing: 0.03333em;
  text-align: left;
  margin-top: 3px;
  color: #d32f2f;
`;

export const CircularProgressContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding-top: ${({ customPaddingTop }) => customPaddingTop || '0'};
`;

export const GeneralTextFieldErrorMsg = styled.div`
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1.66;
  letter-spacing: 0.03333em;
  text-align: left;
  margin: 3px 0 0 0;
  color: #d32f2f;
`;
