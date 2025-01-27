import styled from '@emotion/styled';

export const EditIndustryVerticalPanelMain = styled.div`
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

export const EditIndustryVerticalPanelForm = styled.div`
  position: relative;
  width: 712px;
  height: 250px;
  background: #ffffff;
  border: 8px solid #f1f1f8;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.04), 0 0 20px rgba(0, 0, 0, 0.04);
  border-radius: 30px;
  padding: 24px;
`;

export const EditIndustryVerticalPanelHeaderText = styled.div`
  font-weight: 500;
  font-size: 25px;
  line-height: 44px;
  letter-spacing: -0.04em;
  color: #646464;
  padding-bottom: 15px;
`;

export const EditIndustryVerticalPanelContentWrapper = styled.div`
  display: block;
  justify-content: space-between;
`;

export const EditIndustryVerticalPanelContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  '.MuiInput-root': {
    minWidth: '100%',
    minHeight: '50px',
    backgroundColor: '#fafafa',
    border: '1px solid #e6e6e6',
    borderRadius: '2px',
    borderBottom: 'none',
  },
`;

export const EditIndustryVerticalPanelSubHeaderText = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: -0.005em;
  color: #646464;
  padding-bottom: 15px;
`;

export const EditIndustryVerticalPanelDividerWrapper = styled.div`
  margin: 0 20px;
  flex: 10%;
`;

export const EditIndustryVerticalPanelActionWrapper = styled.div`
  position: absolute;
  bottom: 25px;
  display: flex;
  width: 712px;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
`;
