import styled from '@emotion/styled';
import DefaultBG from '../../../../images/default_bg.png';

export const MarketingMaterialsPanelWrapper = styled.div`
  display: ${({ open }) => (open ? 'flex' : 'none')};
`;

export const MarketingMaterialsPanelWrapperBackground = styled.div`
  background: linear-gradient(110.1deg, rgba(65, 94, 199, 0.9) 0%, rgba(77, 57, 202, 0.9) 100%);
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 101;
`;

export const MarketingMaterialsPanelScreenWrapper = styled.div`
  z-index: 102;
  background-image: url(${DefaultBG});
  top: 0;
  position: absolute;
  left: 0;
  width: 100%;
  height: ${({ customHeight }) => customHeight || '100%'};
  padding-bottom: 60px;
`;

export const MarketingMaterialsPanelWrapperPadding = styled.div`
  padding: 60px 40px 0px 30px;
  ${({ hasMarginBottom }) => hasMarginBottom && 'margin-bottom: 7rem'};
`;

export const MarketingMaterialsPanelListContainer = styled.div`
  margin-top: 30px;
`;

export const MarketingMaterialsPanelDocumentSelectedWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const MarketingMaterialsPanelDocumentSelected = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 1fr 0.2fr 0.3fr;
  background: var(--color-la-luna);
  z-index: 104;
  position: fixed;
  width: calc(100vw - 90px);
  padding: 2rem;
  border-radius: 20px;
  bottom: 25px;
  align-items: center;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.09), 0 10px 20px rgba(0, 0, 0, 0.09);
`;
