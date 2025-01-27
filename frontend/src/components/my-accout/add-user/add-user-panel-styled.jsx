import styled from '@emotion/styled';

export const AddUserPanelMain = styled.div`
  display: ${({ open }) => (open ? 'flex' : 'none')};
  position: fixed;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(10px);
  mix-blend-mode: normal;
  background: linear-gradient(110.1deg, rgba(65, 94, 199, 0.9) 0%, rgba(77, 57, 202, 0.9) 100%);
  top: 0;
  left: 0;
  z-index: 9999;
  justify-content: center;
  align-items: center;
`;

export const AddUserPanelForm = styled.div`
  position: relative;
  width: 712px;
  height: 450px;
  padding: 25px 36px;
  background: #ffffff;
  border: 8px solid #f1f1f8;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.04), 0 0 20px rgba(0, 0, 0, 0.04);
  border-radius: 30px;
`;

export const AddUserPanelHeaderText = styled.div`
  font-family: 'Manrope', sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 24px;
  line-height: 34px;
  color: var(--color-batman);
  padding-bottom: 30px;
`;

export const AddUserPanelContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
`;

export const AddUserPanelContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AddUserPanelSubHeaderText = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: -0.005em;
  color: #646464;
  padding-bottom: 15px;
`;

export const AddUserPanelDividerWrapper = styled.div`
  margin: 0 20px;
  flex: 10%;
`;

export const AddUserPanelActionWrapper = styled.div`
  position: absolute;
  bottom: 25px;
  display: flex;
  width: 712px;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
`;
