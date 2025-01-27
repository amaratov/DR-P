import styled from '@emotion/styled';
import { Popup } from 'react-map-gl';

export const ModelPanelMainWrapper = styled.div`
  margin-bottom: 50px;
  padding: 10px 20px 50px 20px;
  min-width: 300px;
`;

export const ModelPanelConnectionMainWrapper = styled.div`
  margin-top: 16px;
  margin-bottom: 10px;
`;

export const ModelPanelMainHeader = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  // ${({ isEditName }) => isEditName && 'justify-content: space-between'};
`;

export const ModelPanelMainHeaderLeft = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  ${({ isEditName }) => isEditName && 'justify-content: space-between'};
`;

export const ModelPanelMainHeaderRight = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  // ${({ isEditName }) => isEditName && 'justify-content: space-between'};
`;

export const ModelPanelSubHeaderText = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--color-cathedral);
`;

export const ModelPanelMainHeaderText = styled.div`
  font-family: 'Manrope', sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 18px;
  line-height: 26px;
  color: var(--color-batman);
  margin-top: ${({ topMargin }) => topMargin || '0'};
  ${({ isEditName }) => isEditName && 'width: 100%'};
`;

export const ModelPanelVerticalDivider = styled.div`
  width: 1px;
  height: 14px;
  background-color: #d9d9d9;
  margin-right: 10px;
  margin-left: 10px;
`;

export const ModelPanelMainHeaderEditNotesAction = styled.div`
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
  svg {
    color: var(--color-homeworld);
    max-width: 16px;
    max-height: 16px;
  }
`;

export const ModelPanelMainHeaderAction = styled.div`
  svg {
    max-width: 20px;
    max-height: 20px;
    color: var(--color-batman);
  }
`;

export const ConnectionCancelAction = styled.div`
  border-radius: 50%;
  &:hover {
    cursor: pointer;
  }
  svg {
    max-width: 20px;
    max-height: 20px;
    color: var(--color-batman);
  }
`;

export const ConnectionSubActionsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
`;

export const ConnectionSubAction = styled.div`
  padding: 5px 0 5px 0;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: ${({ useColor }) => useColor || 'var(--color-homeworld)'};
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

export const MapClusterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 4px;
  border-radius: 50px;
  background: ${({ noBg }) => (noBg ? 'unset' : 'linear-gradient(180deg, rgba(62, 83, 193, 0.15) 0%, rgba(62, 83, 193, 0.06) 100%)')};
  backdrop-filter: blur(5px);
  width: 96px;
  height: 96px;
`;

export const MapClusterInnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  background-color: var(--color-la-luna);
  border-radius: 50px;
  text-align: center;
`;

export const MapClusterText = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #3c51ba;
`;

export const MapMarkerPopup = styled(Popup)`
  min-width: 300px;
  margin-left: 3.5rem;
  border-radius: 30px;
  .mapboxgl-popup-content {
    padding: 24px;
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(20px);
    border-radius: 30px;
  }
  .mapboxgl-popup-close-button {
    display: none;
  }
  .mapboxgl-popup-tip {
    border-right-color: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(20px);
  }
`;

export const MarkerPopupContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  padding: 0;
`;

export const MarkerPopupCategoryContainer = styled.div`
  //display: flex;
  //flex-direction: column;
`;

export const MarkerPopupCategoryHeaderWrapper = styled.div``;

export const MarkerPopupCategoryHeaderText = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  color: var(--color-batman);
`;

export const MarkerPopupOnRampSubText = styled.div`
  margin-top: 4px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: var(--color-cathedral);
`;

export const MarkerPopupCategoryItemContainer = styled.div`
  display: grid;
  grid-auto-rows: 1fr;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 12px;
`;

export const IconBubbleMainWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 4px;
  border-radius: 50px;
  background: ${({ highlightThis }) =>
    highlightThis
      ? 'linear-gradient(180deg, rgba(62, 83, 193, 0.5) 0%, rgba(62, 83, 193, 0.6) 100%)'
      : 'linear-gradient(180deg, rgba(62, 83, 193, 0.15) 0%, rgba(62, 83, 193, 0.06) 100%)'};
  backdrop-filter: blur(5px);
  width: 96px;
  height: 96px;
`;

export const IconBubbleImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  background-color: var(--color-la-luna);
  border-radius: 50px;
  text-align: center;
  border: 3px solid;
  border-left-color: ${({ borderLeftColor }) => borderLeftColor || 'var(--color-imperial)'};
  border-top-color: ${({ borderTopColor }) => borderTopColor || 'var(--color-imperial)'};
  border-right-color: ${({ borderRightColor }) => borderRightColor || 'var(--color-imperial)'};
  border-bottom-color: ${({ borderBottomColor }) => borderBottomColor || 'var(--color-imperial)'};
`;

export const IconBubbleText = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: ${({ textColor }) => textColor || 'var(--color-imperial)'};
`;

export const MapClusterLeafPopup = styled(Popup)`
  .mapboxgl-popup-content {
    background-color: transparent;
  }
  .mapboxgl-popup-tip {
    display: none;
  }
  .mapboxgl-popup-close-button {
    display: flex;
    padding: 0 5px 2px 5px;
    justify-content: center;
    align-items: center;
    width: 34px;
    height: 34px;
    border-radius: 100px;
    left: -15px;
    right: unset;
    background-color: #000;
    color: #fff;
    font-size: 28px;
    font-weight: lighter;
    text-align: center;
  }
`;

export const MapClusterLeafGrid = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const MapClusterLeafGridItemSet = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding: 5px 7px 3px 7px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 64px;
`;

export const MapClusterLeafGridItem = styled.div`
  position: relative;
  margin-bottom: 4px;
`;

export const MapClusterLeafIconWrapper = styled.div`
  width: 76px;
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-homeworld);
  border-radius: 50%;
  background-color: #fff;
  margin: auto;
  svg {
    color: var(--color-homeworld);
    cursor: pointer;
  }
`;

export const MapClusterConnectionIndicator = styled.div`
  position: absolute;
  top: 10px;
  ${({ onRight }) => onRight && 'right: 12px'};
  ${({ onLeft }) => onLeft && 'left: 12px'};
  z-index: 1300;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-homeworld);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  text-align: center;
  svg {
    width: 16px;
    height: 16px;
    color: #fff;
  }
`;
export const MapClusterConnectionIndicatorText = styled.div`
  color: white;
`;

export const MapMarkerContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  border-radius: 30px;
  padding: 15px;
  background-color: #fff;
`;

export const MapMarkerContentHeader = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-batman);
`;

export const MapMarkerContentBody = styled.div``;

export const MapMarkerCloudSection = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  margin-bottom: 6px;
  border-bottom: 1px solid var(--color-batman);
`;
export const MapMarkerApplicationsSection = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  margin-bottom: 6px;
  border-bottom: 1px solid var(--color-batman);
`;
export const MapMarkerOfficesSection = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
`;
export const MapMarkerSectionHeader = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
`;

export const MapMarkerSectionHeaderText = styled.div`
  margin-top: 10px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-batman);
`;
export const MapMarkerSectionHeaderAction = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: var(--color-homeworld);
  &:hover {
    cursor: pointer;
  }
`;

export const MapMarkerSectionListContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;
export const MapMarkerSectionListItem = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
`;
export const MapMarkerSectionListItemIcon = styled.div`
  margin-right: 5px;
  svg {
    color: var(--color-homeworld);
  }
`;

export const MapMarkerSectionListItemText = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--color-batman);
`;

export const MapMarkerSectionListSubItem = styled.div`
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin-left: 25px;
  &::before {
    position: absolute;
    top: 2px;
    left: -13px;
    min-width: 10px;
    min-height: 10px;
    content: '';
    border-left: 1px solid #3e53c1;
    border-bottom: 1px solid #3e53c1;
    border-bottom-left-radius: 5px;
  }
`;

export const SpecialClusterIconBubbleMainWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 4px;
  border-radius: 64px;
  background: ${({ highlightThis }) => (highlightThis ? 'linear-gradient(180deg, rgba(62, 83, 193, 0.5) 0%, rgba(62, 83, 193, 0.6) 100%)' : '#fff')};
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04), 0 2px 4px 0 rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(20px);
  width: 64px;
  height: 64px;
`;

export const SpecialMarkerPopup = styled.div`
  position: absolute;
  top: 0;
  left: 100px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(20px);
  border-radius: 30px;
`;
