import styled from '@emotion/styled';

export const AddIndustryVerticalPanelMain = styled.div`
  display: ${({ open }) => (open ? 'flex' : 'none')};
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 9999;
  justify-content: center;
  align-items: center;

  backdrop-filter: blur(10px);
  mix-blend-mode: normal;
  background: linear-gradient(110.1deg, rgba(65, 94, 199, 0.9) 0%, rgba(77, 57, 202, 0.9) 100%);
`;

export const AddIndustryVerticalPanelForm = styled.div`
  position: relative;
  width: 712px;
  height: 250px;
  background: #ffffff;
  border: 8px solid #f1f1f8;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.04), 0 0 20px rgba(0, 0, 0, 0.04);
  border-radius: 30px;
  padding: 24px;
`;

export const AddIndustryVerticalPanelHeaderText = styled.div`
  font-weight: 500;
  font-size: 25px;
  line-height: 44px;
  letter-spacing: -0.04em;
  color: #646464;
  padding-bottom: 15px;
`;

export const AddIndustryVerticalPanelContentWrapper = styled.div`
  display: block;
  justify-content: space-between;
`;

export const AddIndustryVerticalPanelContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  '.MuiInput-root': {
    min-width: 100%;
    min-height: 50px;
    background-color: #fafafa;
    border: 1px solid #e6e6e6;
    border-radius: 2px;
    border-bottom: none;
  },
`;

export const AddIndustryVerticalPanelSubHeaderText = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: -0.005em;
  color: #646464;
  padding-bottom: 15px;
`;

export const AddIndustryVerticalPanelDividerWrapper = styled.div`
  margin: 0 20px;
  flex: 10%;
`;

export const AddIndustryVerticalPanelActionWrapper = styled.div`
  position: absolute;
  bottom: 25px;
  display: flex;
  width: 712px;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
`;
