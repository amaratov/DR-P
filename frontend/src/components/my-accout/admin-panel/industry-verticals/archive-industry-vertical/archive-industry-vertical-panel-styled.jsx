import styled from '@emotion/styled';

export const ArchiveIndustryVerticalPanelMain = styled.div`
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

export const ArchiveIndustryVerticalPanelForm = styled.div`
  display: grid;
  position: relative;
  justify-items: center;
  text-align: center;
  min-width: 20rem;
  padding: 30px 40px;
  background: #ffffff;
  border: 8px solid rgba(62, 83, 193, 60%);
  box-shadow: 0 0 100px rgba(100, 100, 100, 0.15);
  border-radius: 20px;
`;

export const ArchiveIndustryVerticalPanelHeaderText = styled.div`
  color: var(--color-batman);
  text-align: center;
  font-family: Manrope, sans-serif;
  font-size: 28px;
  font-style: normal;
  font-weight: 800;
  line-height: 40px;
  letter-spacing: 0.5px;
  padding-bottom: 32px;
`;

export const ArchiveIndustryVerticalPanelContentWrapper = styled.div`
  display: block;
  justify-content: space-between;
`;

export const ArchiveIndustryVerticalPanelContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
  .MuiInput-root {
    min-width: 100%;
    min-height: 50px;
    background-color: #fafafa;
    border: 1px solid #e6e6e6;
    border-radius: 2px;
    border-bottom: none;
  }
`;

export const ArchiveIndustryVerticalPanelSubHeaderText = styled.div`
  color: var(--color-batman);
  text-align: center;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  padding-bottom: 15px;
`;

export const ArchiveIndustryVerticalPanelDividerWrapper = styled.div`
  margin: 0 20px;
  flex: 10%;
`;

export const ArchiveIndustryVerticalPanelActionWrapper = styled.div`
  bottom: 25px;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
`;
