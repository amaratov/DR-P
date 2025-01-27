import styled from '@emotion/styled';
import { Button } from '@mui/material';

export const DiscoverRegionsSetRequirementsPanelMain = styled.div`
  display: flex;
  position: fixed;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(10px);
  mix-blend-mode: normal;
  background: linear-gradient(110.1deg, rgba(65, 94, 199, 0.9) 0%, rgba(77, 57, 202, 0.9) 100%);
  top: 0;
  left: 0;
  z-index: 1200;
  justify-content: center;
  align-items: center;
`;

export const DiscoverRegionsSetRequirementsPanelForm = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: ${({ customWidth }) => customWidth || 520}px;
  height: ${({ customHeight }) => customHeight}px;
  background: #ffffff;
  border: 8px solid #f1f1f8;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.04), 0 0 20px rgba(0, 0, 0, 0.04);
  border-radius: 30px;
  max-height: 85vh;
  max-width: 85vw;
  padding: ${({ customPadding }) => customPadding || 24}px;
`;

export const DiscoverRegionsSetRequirementsFlexPanelForm = styled(DiscoverRegionsSetRequirementsPanelForm)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const DiscoverRegionsSetRequirementsPanelHeaderText = styled.div`
  font-family: 'Manrope', sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 24px;
  line-height: 34px;
  color: var(--color-batman);
  padding-bottom: 15px;
`;

export const DiscoverRegionsSetRequirementsPanelContentWrapper = styled.div`
  display: block;
  justify-content: space-between;
  overflow-y: ${({ overflow }) => overflow};
  overflow-x: ${({ overflowX }) => overflowX};
  max-height: ${({ maxHeight }) => maxHeight};
`;

export const DiscoverRegionsSetRequirementsPanelContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DiscoverRegionsSetRequirementsPanelContentHeaderText = styled.div`
  font-family: 'Manrope', sans-serif;
  font-style: normal;
  font-weight: 800;
  font-size: 18px;
  line-height: 26px;
  color: var(--color-batman);
  padding-bottom: 15px;
  grid-column: ${({ gridColumn }) => gridColumn};
`;

export const DiscoverRegionsSetRequirementsPanelSubHeaderText = styled.div`
  align-items: center;
  letter-spacing: -0.007em;
  color: var(--color-cathedral);
  min-width: 85px;
  min-height: 20px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  transform-origin: top left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 133%;
  padding-top: 1rem;
`;

export const DiscoverRegionsSetRequirementsPanelSubHeaderSimpleText = styled.div`
  align-items: center;
  letter-spacing: -0.007em;
  color: var(--color-cathedral);
  font-weight: 400;
  font-size: 16px;
  transform-origin: top left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const DiscoverRegionsSetRequirementsPanelActionWrapper = styled.div`
  background: ${({ background }) => background};
  bottom: ${({ customBottom }) => customBottom || '25px'};
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding: ${({ padding }) => padding};
  position: ${({ position }) => position || 'absolute'};
  width: inherit;
  z-index: 1101;
`;

export const DiscoverRegionsSetRequirementsListWrapper = styled.div`
  flex-flow: wrap;
  display: flex;
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
  margin-top: 1rem;
`;

export const DiscoverRegionsSetRequirementsListValue = styled(Button)`
  display: block;
  color: ${({ isActive }) => (isActive ? 'var(--color-homeworld)' : 'var(--color-batman)')};
  border-radius: ${({ borderradius }) => borderradius || 8}px;
  background-color: ${({ isActive }) => (isActive ? '#3e53c114' : 'var(--color-la-luna)')};
  padding: 0.5rem 1rem;
  text-transform: ${({ texttransform }) => texttransform || 'uppercase'};
  ${({ isActive }) =>
    !isActive &&
    `
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.04), 0 0 20px rgba(0, 0, 0, 0.04);
  `}
`;

// don't need two components for active/inactive
export const DiscoverRegionsSetRequirementsListValueActive = styled(Button)`
  display: block;
  color: var(--color-homeworld);
  border-radius: ${({ borderradius }) => borderradius || 8}px;
  background-color: #3e53c114;
  padding: 0.5rem 1rem;
  text-transform: ${({ texttransform }) => texttransform || 'uppercase'};
`;

export const DiscoverRegionsSetRequirementsListValueInactive = styled(Button)`
  display: block;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.04), 0 0 20px rgba(0, 0, 0, 0.04);
  border-radius: ${({ borderradius }) => borderradius || 8}px;
  color: var(--color-batman);
  padding: 0.5rem 1rem;
  text-transform: ${({ texttransform }) => texttransform || 'uppercase'};
`;

export const DiscoverRegionsSetRequirementsListAddButton = styled(Button)`
  display: block;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.04), 0 0 20px rgba(0, 0, 0, 0.04);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  text-transform: capitalize;
`;

export const DiscoverRegionsSetRequirementsStartRow = styled.div`
  display: grid;
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
  margin-top: 1rem;
  grid-auto-flow: column;
`;

export const DiscoverRegionDataCenterInformationLayoutGridInnerWrapper = styled.div`
  padding-top: 1rem;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 2rem;
  ${({ gridTemplateColumn }) => `grid-template-columns: ${gridTemplateColumn}`};
  label {
    font-size: 20px;
  }
`;

export const DiscoverRegionsCloudsListWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
  margin-top: 1rem;
  text-align: center;
  text-align: -webkit-center;
  justify-items: center;
  padding: ${({ customPadding }) => customPadding};
`;

export const DiscoverRegionsCloudsListValue = styled.div``;

export const DiscoverRegionsCloudsListValueActive = styled(Button)`
  display: block;
  color: var(--color-homeworld);
  border-radius: ${({ borderradius }) => borderradius || 8}px;
  background-color: #3e53c114;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  text-transform: ${({ texttransform }) => texttransform || 'uppercase'};
`;

export const DiscoverRegionsCloudsListValueInactive = styled(Button)`
  display: block;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.04), 0 0 20px rgba(0, 0, 0, 0.04);
  border-radius: ${({ borderradius }) => borderradius || 8}px;
  color: var(--color-batman);
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  text-transform: ${({ texttransform }) => texttransform || 'uppercase'};
`;

export const DiscoverRegionAddCloudsContainerImage = styled.div`
  padding: 0.5rem;
  img {
    max-width: 5rem;
    max-height: 5rem;
  }
`;

export const DiscoverRegionsApplicationsListWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
  text-align: center;
  justify-items: center;
  margin-bottom: 8rem;
  margin-top: 1rem;
`;

export const DiscoverRegionsApplicationsListValueActive = styled(Button)`
  display: block;
  color: var(--color-homeworld);
  border-radius: ${({ borderradius }) => borderradius || 8}px;
  background-color: #3e53c114;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  text-transform: ${({ texttransform }) => texttransform || 'uppercase'};
`;

export const DiscoverRegionsApplicationsListValueInactive = styled(Button)`
  display: block;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.04), 0 0 20px rgba(0, 0, 0, 0.04);
  border-radius: ${({ borderradius }) => borderradius || 8}px;
  color: var(--color-batman);
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  text-transform: ${({ texttransform }) => texttransform || 'uppercase'};
`;

export const DiscoverSelectionValueContainer = styled.div`
  position: relative;
`;
export const DiscoverSelectionValue = styled(Button)`
  display: block;
  color: ${({ isSelected }) => (isSelected ? 'var(--color-homeworld)' : 'var(--color-batman)')};
  box-shadow: ${({ isSelected }) => (isSelected ? 'unset' : '0 0 10px rgba(0, 0, 0, 0.04), 0 0 20px rgba(0, 0, 0, 0.04)')};
  border-radius: ${({ borderradius }) => borderradius || 8}px;
  background-color: ${({ isSelected }) => (isSelected ? '#3e53c114' : 'inherit')};
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  text-transform: ${({ texttransform }) => texttransform || 'uppercase'};
  min-width: ${({ customMinWidth }) => customMinWidth || '64px'};
  min-height: ${({ customMinHeight }) => customMinHeight || '0px'};
  max-width: ${({ customMaxWidth }) => customMaxWidth};
  max-height: ${({ customMaxHeight }) => customMaxHeight};
  width: ${({ customWidth }) => customWidth};
  height: ${({ customHeight }) => customHeight};
`;

export const DiscoverApplicationsSelectionValueContainer = styled(DiscoverSelectionValueContainer)``;

export const DiscoverApplicationsSelectionValue = styled(DiscoverSelectionValue)``;

export const DiscoverRegionAddApplicationsContainerImage = styled.div`
  padding: 0.5rem;
  img {
    max-width: 5rem;
    max-height: 44px;
  }
  svg {
    max-width: 5rem;
    max-height: 44px;
  }
`;

export const DiscoverRegionsPartnershipAndSuppliersListWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  text-align: center;
  justify-items: center;
`;

export const DiscoverRegionsPartnershipAndSuppliersListValue = styled.div``;

export const DiscoverRegionsPartnershipAndSuppliersValueActive = styled(Button)`
  display: block;
  color: var(--color-homeworld);
  border-radius: ${({ borderradius }) => borderradius || 8}px;
  background-color: #3e53c114;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  text-transform: ${({ texttransform }) => texttransform || 'uppercase'};
`;

export const DiscoverRegionsPartnershipAndSuppliersValueInactive = styled(Button)`
  display: block;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.04), 0 0 20px rgba(0, 0, 0, 0.04);
  border-radius: ${({ borderradius }) => borderradius || 8}px;
  color: var(--color-batman);
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  text-transform: ${({ texttransform }) => texttransform || 'uppercase'};
`;

export const DiscoverRegionAddPartnershipAndSuppliersContainerImage = styled.div`
  padding: 0.5rem;
  img {
    max-width: 5rem;
    max-height: 5rem;
  }
`;

export const DiscoverRegionsFlatButtonFormElement = styled.div`
  color: ${({ disabled }) => (disabled ? 'var(--color-cathedral)' : 'var(--color-homeworld)')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  align-items: center;
  justify-content: center;
  display: flex;
  background-color: ${({ disabled }) => (disabled ? 'var(--color-aluminium)' : '#3e53c10a')};
  border-radius: 12px;
  margin-right: 2px;
  padding: 0px 28px 0px 24px;
`;

export const DiscoverRegionsFlatButtonFormContainer = styled.div`
  display: flex;
`;
