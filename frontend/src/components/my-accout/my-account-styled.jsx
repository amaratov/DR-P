import styled from '@emotion/styled';
import DefaultBg from '../../images/default_bg.png';

export const MyAccountWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  background-image: url(${DefaultBg});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #e7eafb;
`;

export const PanelHeaderWrapper = styled.div`
  padding: ${({ customPadding }) => customPadding || '30px 92px 0 92px'};
`;

export const PanelHeaderFlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PanelHeaderText = styled.div`
  padding-bottom: 20px;
  font-family: 'Manrope', sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 32px;
  line-height: 44px;
  letter-spacing: 0.5px;
  color: var(--color-batman);
`;

export const PanelHeaderActions = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`;

export const PanelContentWrapper = styled.div`
  //background-color: inherit;
  padding: ${({ customPadding }) => customPadding || '20px 92px'};
`;

export const PanelContentNavSection = styled.div`
  display: flex;
  padding-bottom: 24px;
`;

export const PanelContentSection = styled.div``;

export const PanelFooterAction = styled.div`
  background-color: inherit;
  padding: 20px 92px;
`;

export const AssociatedUserPanelFilterContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  max-width: 450px;
  overflow-x: auto;
  margin-top: 10px;
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
  &::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
`;
