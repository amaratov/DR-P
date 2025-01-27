import styled from '@emotion/styled';

export const TextInputWrapper = styled.div`
  margin-bottom: 20px;
  grid-column: ${({ gridColumn }) => gridColumn};
`;

export const CustomButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  ${({ marginTop }) => marginTop && `margin-top: ${marginTop};`}
  ${({ marginBottom }) => marginBottom && `margin-bottom: ${marginBottom};`}
  ${({ padding }) => padding && `padding: ${padding};`}
`;

export const LoginFormWrapper = styled.div`
  border: 10px solid #6363c3;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04), 0 10px 20px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  background-color: #ffffff;
  width: 372px;
  height: 458px;
  display: flex;
  justify-content: center;
  padding: 50px 36px;
`;

export const LoginHeader = styled.div`
  font-family: 'Manrope', sans-serif;
  height: 44px;
  font-weight: 800;
  font-size: 28px;
  line-height: 40px;
  letter-spacing: 0.5px;
  color: #202020;
  margin-bottom: 32px;
`;

export const LoginErrorText = styled.div`
  min-width: 300px;
  min-height: 20px;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  letter-spacing: -0.007em;
  color: #ff0000;
  margin-top: 10px;
`;

export const LoginBottomTextWrapper = styled.div`
  width: 208px;
  height: 20px;
  margin-top: 40px;
  font-size: 13px;
  line-height: 19px;
  font-weight: 400;
  color: #646464;
  letter-spacing: -0.007em;
  cursor: pointer;
  &:hover {
    color: blue;
  }
`;

export const ResetPasswordHeader = styled(LoginHeader)`
  margin-bottom: 24px;
`;

export const ResetPasswordText = styled.div`
  max-width: 320px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--color-cathedral);
  margin-bottom: 40px;
`;

export const ResetPasswordBackIcon = styled.div`
  margin-bottom: 36px;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

export const CheckBoxWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin-top: -15px;
  padding-left: 8px;
  max-width: 320px;
  color: var(--color-cathedral);
  margin-bottom: 10px;
  .MuiButtonBase-root {
    padding: 0 2px 2px 2px;
  }
  span {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 18px;
  }
`;

export const LoginCheckBoxWrapper = styled(CheckBoxWrapper)``;

export const ErrorMessageText = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  color: red;
  padding-bottom: 5px;
`;
