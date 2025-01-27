import styled from '@emotion/styled';
import DigitalRealtyLogo from '../../../../../../../images/Digital_Realty_World.png';

export const DiscoverRegionHeadText = styled.div`
  box-sizing: border-box;
  padding: 22px;
  background: rgba(255, 255, 255, 0.98);
  opacity: 0.8;
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.04), 0px 10px 20px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(20px);
  border-radius: 16px 16px 0 0;
`;

export const DiscoverRegionCard = styled.div`
  box-sizing: border-box;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.98);
  opacity: 0.8;
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.04), 0px 10px 20px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(20px);
  &:last-child {
    border-radius: 0 0 12px 12px;
  }
  &:only-child {
    border-radius: 12px;
  }
`;

export const DiscoverCustomerViewHeaderText = styled.h3`
  margin: 0;
`;

export const DiscoverCustomerViewLabel = styled.div`
  color: var(--color-cathedral);
`;

export const DiscoverCustomerViewBoldText = styled.div`
  font-weight: bold;
  display: flex;
  align-items: centre;
`;

export const DiscoverCustomerIcon = styled.img`
  align-self: center;
  width: 32px;
`;

export const DiscoverCustomerViewImg = styled.div`
  width: 32px;
  left: 0px;
  top: 4.75px;
  background: url(${DigitalRealtyLogo}) no-repeat center center;
  background-size: contain;
`;

export const DiscoverCustomerTextPadding = styled.div`
  padding-left: 32px;
`;

export const DiscoverCustomerViewChange = styled.span`
  color: var(--color-homeworld);
  font-weight: bold;
`;

export const InlineItemAndValue = styled.p`
  margin: 0;
`;
