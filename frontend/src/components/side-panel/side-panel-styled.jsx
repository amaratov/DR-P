import styled from '@emotion/styled';
import { Button, Drawer } from '@mui/material';

export const SidePanelWrapper = styled.div`
  position: absolute;
  top: 110px;
  left: 10px;
  background-color: white;
  border: 1px solid black;
  border-radius: 6px;
`;

export const SidePanelToggleButton = styled(Button)`
  color: black;
  &:hover {
    background-color: #61dafb;
    opacity: 0.5;
  }
`;

export const SidePanelMainWrapper = styled.div`
  height: ${({ height }) => height};
  padding: 20px 25px;
  margin-bottom: 3rem;
`;

export const SidePanelHeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: end;
  justify-content: space-between;
  padding-bottom: ${({ paddingBottom }) => paddingBottom || '10px'};
`;

export const SidePanelHeaderActionContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  padding: 10px 0 15px 0;
`;

export const SidePanelHeaderText = styled.div`
  font-family: 'Manrope', sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 24px;
  line-height: 34px;
  color: var(--color-batman);
`;

export const SidePanelDetailsText = styled.div`
  font-family: 'Manrope', sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 18px;
  line-height: 26px;
  color: var(--color-batman);
`;

export const SidePanelSubText = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--color-cathedral);
`;

export const SidePanelHeaderCloseBtn = styled.div`
  cursor: pointer;
`;

export const SidePanelEditAction = styled.div`
  padding-bottom: 10px;
`;

export const SidePanelContentWrapper = styled.div``;

export const SidePanelAddOrRemoveIcon = styled.div`
  button {
    color: var(--color-homeworld);
  }
`;

export const SidePanelContentItem = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  opacity: ${({ greyOut }) => (greyOut ? '50%' : '100%')};
  color: ${({ greyOut }) => greyOut && 'grey'};
`;

export const SidePanelCompanyWrapper = styled.div`
  padding-top: 20px;
  padding-bottom: 10px;
`;

export const SidePanelCompanyHeader = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: #646464;
`;

export const SidePanelSaveButtonWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  left: ${({ customLeft }) => customLeft || '20px'};
  background-color: ${({ greyOut }) => greyOut && 'grey'};
`;

export const SidePanelDrawerWrapper = styled(Drawer)`
  left: ${({ leftPositionDrawerContainer }) => leftPositionDrawerContainer || 0}px;
`;

export const SidePanelEdgePatch = styled.div`
  display: ${({ showPatch }) => (showPatch ? 'block' : 'none')};
  position: absolute;
  top: ${({ useTop }) => useTop || '0'};
  left: ${({ useLeft }) => useLeft || '340px'};
  z-index: 1200;
  min-width: 50px;
  min-height: ${({ useMinHeight }) => useMinHeight || '100%'};
  background-color: ${({ useColor }) => useColor || '#f0ecfc'};
`;

export const ModelSidePanelEdgePatch = styled(SidePanelEdgePatch)`
  top: 8px;
  left: 140px;
  min-height: calc(100vh - 24px);
  background-color: #fff;
`;

export const SidePanelFileInactiveText = styled.div`
  font-family: 'Manrope', sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 24px;
  line-height: 34px;
  color: grey;
  display: grid;
  grid-auto-flow: column;
  padding: 1rem;
  grid-template-columns: 0.15fr 1fr;
  background: lightgrey;
`;

export const SidePanelLine = styled.div`
  height: 1px;
  background: #202020;
  opacity: 0.06;
  border-radius: 20px;
  margin: 20px 0;
`;

export const FileText = styled.span`
  max-width: 260px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UploadFilePreviewContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  margin-bottom: 16px;
  background-color: #f2f3fe;
  img {
    max-width: 300px;
    max-height: 130px;
  }
`;

export const SidePanelSmallColumnLargeColumn = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 0.09fr 1fr;
`;

export const SidePanelPlainTextBlurb = styled.div`
  display: flex;
  flex-wrap: nowrap;
  color: var(--color-cathedral);
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

export const SidePanelPlainTextBtn = styled.div`
  text-decoration: underline;
  color: var(--color-homeworld);
  margin-left: 4px;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;
export const SidePanelOptionItem = styled(Button)`
  display: block;
  color: ${({ isSelected }) => (isSelected ? 'var(--color-homeworld)' : 'var(--color-batman)')};
  border-radius: ${({ borderradius }) => borderradius || 8}px;
  background-color: ${({ isSelected }) => (isSelected ? '#3e53c114' : 'inherit')};
  box-shadow: ${({ isSelected }) => (isSelected ? 'unset' : '0 0 10px rgba(0, 0, 0, 0.04), 0 0 20px rgba(0, 0, 0, 0.04)')};
  padding: 0.5rem 1rem;
  text-transform: ${({ texttransform }) => texttransform || 'uppercase'};
`;

export const SidePanelButtonActive = styled(Button)`
  display: block;
  color: var(--color-homeworld);
  border-radius: ${({ borderradius }) => borderradius || 8}px;
  background-color: #3e53c114;
  padding: 0.5rem 1rem;
  text-transform: ${({ texttransform }) => texttransform || 'uppercase'};
`;

export const SidePanelButtonInactive = styled(Button)`
  display: block;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.04), 0 0 20px rgba(0, 0, 0, 0.04);
  border-radius: ${({ borderradius }) => borderradius || 8}px;
  color: var(--color-batman);
  padding: 0.5rem 1rem;
  text-transform: ${({ texttransform }) => texttransform || 'uppercase'};
`;

export const SidePanelSubAreaLShape = styled.div`
  border-left: 1px var(--color-aluminium) solid;
  border-bottom: 1px var(--color-aluminium) solid;
  width: 15px;
  height: 15px;
  top: -5px;
  position: relative;
`;

export const SidePanelSubHeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
  margin-bottom: 12px;
`;

export const SidePanelSubHeaderText = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: var(--color-cathedral);
`;

export const SidePanelSubHeaderActions = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
`;

export const SidePanelSubHeaderActionBtn = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: ${({ isCancelBtn }) => (isCancelBtn ? '#FF0000' : 'var(--color-homeworld)')};
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;
