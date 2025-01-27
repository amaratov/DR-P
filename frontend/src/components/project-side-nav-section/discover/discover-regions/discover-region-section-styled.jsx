import styled from '@emotion/styled';
import { Button } from '@mui/material';

export const DiscoverRegionMain = styled.div`
  margin-top: 20px;
`;

export const DiscoverRegionTabWrapper = styled.div`
  display: flex;
`;

export const DiscoverRegionTabBgContainer = styled.div`
  z-index: 99;
  background-color: ${({ active }) => (active ? '#edefff' : '#dee2fd')};
  border-radius: 24px 24px 0 0;
  opacity: 0.9;
  display: flex;
`;

export const DiscoverRegionTab = styled.div`
  z-index: 100;
  max-width: 300px;
  padding: 10px 20px 10px 20px;
  text-align: center;
  background-color: ${({ active }) => (active ? '#edefff' : '#dee2fd')};
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-bottom: 0;
  border-right: 0;
  border-radius: 24px 24px 0 0;
  opacity: 0.9;
  &:hover {
    cursor: pointer;
  }
`;

export const DiscoverRegionAddRegionTab = styled(DiscoverRegionTab)`
  z-index: 100;
  background-color: #dee2fd;
  border-radius: 24px 24px 0 24px;
`;

export const DiscoverRegionTabText = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-batman);
`;

export const DiscoverRegionAddRegionTabText = styled(DiscoverRegionTabText)`
  color: var(--color-homeworld);
`;

export const DiscoverRegionTabContentOuterWrapper = styled.div`
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-top: 0;
  border-radius: 0 24px 24px 24px;
  background-color: #edefff;
  width: 100%;
  min-height: 500px;
`;

export const DiscoverRegionStateTabContentOuterWrapper = styled.div`
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-top: 0;
  border-radius: 0 24px 24px 24px;
  background-color: #edefff;
  width: 100%;
`;

export const DiscoverRegionTabContentInnerWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04), 0 10px 20px rgba(0, 0, 0, 0.04);
  border-radius: 24px;
  background-color: var(--color-la-luna);
  height: 100%;
`;

export const DiscoverRegionSelectWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  padding: 20px 20px 20px 40px;
  height: 100%;
`;

export const DiscoverRegionSelectHeader = styled.div`
  margin: 12px 0 12px 0;
  font-family: 'Manrope', sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 18px;
  line-height: 26px;
  color: var(--color-batman);
`;

export const DiscoverRegionSelections = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

export const DiscoverRegionSelectionsLeft = styled.div``;

export const DiscoverRegionSelectionsRight = styled.div``;

export const DiscoverRegionSelectionMainRegion = styled.div`
  margin-bottom: 10px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-batman);
`;

export const DiscoverRegionSelectionSubRegion = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

export const DiscoverRegionSelectionSubRegionBox = styled.div`
  margin: 5px 0;
  background: ${({ isSelected }) => (isSelected ? '#eff0fa' : 'rgba(255, 255, 255, 0.98)')};
  border: ${({ isSelected }) => (isSelected ? '1px solid #eff0fa' : '1px solid rgba(255, 255, 255, 0.7)')};
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04), 0 10px 20px rgba(0, 0, 0, 0.04);
  border-radius: 24px;
  padding: 5px 10px;
  min-width: 25px;
  color: ${({ isSelected }) => (isSelected ? 'var(--color-homeworld)' : 'var(--color-batman)')};
  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
  ${({ disableOption }) =>
    disableOption &&
    `
    pointer-events: none;
    color: #fff;
    background-color: var(--color-cathedral);
  `}
`;

export const DiscoverRegionSelectionSubRegionValue = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
`;

export const DiscoverRegionSelectionsSubmitWrapper = styled.div`
  display: flex;
  align-items: start;
  width: 100%;
  margin-bottom: 50px;
`;

export const DiscoverRegionSelectGlobeWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  margin-top: 5%;
  img {
    display: block;
    margin: auto;
    width: 90%;
  }
`;

export const DiscoverRegionDetailsInnerTab = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: 1fr 1fr;
  grid-auto-flow: column;
  padding: 0.25rem 0.5rem 0.75rem 0.5rem;
`;

export const DiscoverRegionDetailsInnerTabButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 40px;
  backdrop-filter: blur(20px);
  box-shadow: ${({ active }) => (!active ? '0 8px 18px -10px rgba(0, 0, 0, 0.3), 0 10px 40px -20px rgba(0, 0, 0, 0.4)' : 'none')};
  color: ${({ active }) => (active ? 'var(--color-batman)' : 'var(--color-homeworld)')};
  background-color: ${({ active }) => (active ? '#3e53c121' : 'var(--color-la-luna)')};
  min-width: 300px;
  min-height: 56px;
  &:hover {
    cursor: ${({ active }) => (active ? 'cursor' : 'pointer')};
  }
`;

export const DiscoverRegionDetailsDivider = styled.div`
  background: #c8c8c873;
  height: 2px;
  margin-bottom: 1rem;
`;

export const DiscoverRegionDetailsLocationInformationWrapper = styled.div``;

export const DiscoverRegionsDetailsAddOfficeButton = styled(Button)`
  display: block;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  text-transform: capitalize;
  justify-self: left;
`;

export const DiscoverRegionDetailsLocationInformationLayoutGridWrapper = styled.div`
  display: grid;
`;

export const DiscoverRegionDetailsLocationInformationLayoutGridInnerWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 2rem;
  label {
    font-size: 20px;
  }
`;

export const DiscoverRegionDetailsLocationInformationAdditionalText = styled.span`
  color: var(--color-aluminium);
`;

export const DiscoverRegionStateTabs = styled.div`
  display: flex;
  grid-gap: 1.5rem;
`;

export const DiscoverRegionStateTabActive = styled.div`
  color: var(--color-batman);
  border-bottom: solid 1px var(--color-batman);
  padding-bottom: 3px;
`;

export const DiscoverRegionStateTabInactive = styled.div`
  color: var(--color-homeworld);
`;

export const DiscoverRegionStateTabValues = styled.div`
  display: ${({ isPartnershipAndSuppliers }) => isPartnershipAndSuppliers || 'flex'};
  grid-gap: 1.5rem;
  flex-flow: wrap;
`;

export const DiscoverRegionStateTabAddValue = styled.div``;

export const DiscoverRegionStateTabListValue = styled.div``;

export const DiscoverRegionStateBubbleContainer = styled.div`
  color: ${({ isAdd }) => (!isAdd ? 'var(--color-batman)' : 'var(--color-homeworld)')};
  justify-items: center;
  padding-top: 1rem;
  padding-bottom: 0.5rem;
  display: grid;
  grid-gap: 1rem;
`;

export const DiscoverRegionStateBubbleAddContainer = styled.div`
  color: var(--color-homeworld);
  justify-items: center;
  padding-top: 1rem;
  padding-bottom: 0.5rem;
  display: grid;
  grid-gap: 1rem;
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

export const DiscoverRegionStateBubbleContainerIcon = styled.div`
  box-shadow: 0 0px 15px rgba(0, 0, 0, 0.08), 0 0px 20px rgba(0, 0, 0, 0.06);
  width: 92px;
  height: 70px;
  border-radius: 12px;
  display: grid;
  align-content: center;
  justify-items: center;
`;

export const DiscoverRegionStateBubbleContainerIconCircle = styled.div`
  box-shadow: 0 0px 5px rgba(0, 0, 0, 0.02), 0 0px 10px rgba(0, 0, 0, 0.04);
  padding: 0.5rem;
  border-radius: 30px;
  img {
    max-width: 5rem;
    max-height: 5rem;
  }
`;

export const DiscoverRegionStateBubbleContainerImage = styled.div`
  padding: 0.5rem;
  img {
    max-width: 5rem;
    max-height: 5rem;
  }
`;

export const DiscoverRegionStateBubblePartnershipAndSuppliersList = styled.div`
  display: grid;
  grid-gap: 1rem;
  margin-top: 1.5rem;
`;

export const DiscoverRegionStateBubblePartnershipAndSuppliersListSection = styled.div`
  display: grid;
  grid-gap: 1rem;
`;

export const DiscoverRegionStateBubblePartnershipAndSuppliersIconRow = styled.div`
  display: grid;
  grid-gap: 1rem;
`;

export const DiscoverRegionStateBubblePartnershipAndSuppliersSectionTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

export const DiscoverRegionStateBubblePartnershipAndSuppliersIconList = styled.div`
  display: flex;
  grid-gap: 1.5rem;
  flex-flow: wrap;
`;

export const DiscoverRegionStateBubbleNoteFieldContainer = styled.div`
  width: ${({ customWidth }) => customWidth || '100%'};
  margin-top: ${({ customMarginTop }) => customMarginTop || '0'};
  display: flex;
  flex-direction: column;
`;
export const DiscoverRegionStateBubbleNoteFieldLabel = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--color-cathedral);
`;

export const DiscoverRegionNotesErrorField = styled.div`
  margin-top: -1.5rem;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: red;
`;
