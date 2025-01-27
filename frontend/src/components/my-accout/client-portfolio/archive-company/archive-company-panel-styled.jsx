import styled from '@emotion/styled';

export const ArchiveCompanyPanelMain = styled.div`
  display: ${({ open }) => (open ? 'flex' : 'none')};
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(62, 83, 193, 80%);
  backdrop-filter: blur(20px);
  top: 0;
  left: 0;
  z-index: 9999;
  justify-content: center;
  align-items: center;
`;

export const ArchiveCompanyPanelForm = styled.div`
  display: grid;
  position: relative;
  justify-items: center;
  text-align: center;
  width: 20rem;
  padding: 30px 40px;
  background: #ffffff;
  border: 8px solid rgba(62, 83, 193, 60%);
  box-shadow: 0 0 100px rgba(100, 100, 100, 0.15);
  border-radius: 20px;
`;

export const ArchiveCompanyPanelHeaderText = styled.div`
  font-weight: 500;
  font-size: 32px;
  line-height: 44px;
  letter-spacing: 0.02em;
  padding-bottom: 10px;
`;

export const ArchiveCompanyPanelContentWrapper = styled.div`
  display: block;
  justify-content: space-between;
`;

export const ArchiveCompanyPanelContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  .MuiInput-root {
    min-width: 100%;
    min-height: 50px;
    background-color: #fafafa;
    border: 1px solid #e6e6e6;
    border-radius: 2px;
    border-bottom: none;
  }
`;

export const ArchiveCompanyPanelSubHeaderText = styled.div`
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.01em;
  color: #646464;
  padding-bottom: 15px;
`;

export const ArchiveCompanyPanelDividerWrapper = styled.div`
  margin: 0 20px;
  flex: 10%;
`;

export const ArchiveCompanyPanelActionWrapper = styled.div`
  bottom: 25px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
`;
