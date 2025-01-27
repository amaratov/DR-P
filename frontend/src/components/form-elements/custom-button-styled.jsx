import styled from '@emotion/styled';

export const DivButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  min-width: ${({ customMinWidth }) => customMinWidth || '300px'};
  min-height: ${({ customMinHeight }) => customMinHeight || '50px'};
  color: #ffffff;
  background-color: #646464;
  box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
  border-radius: 4px;
  align-items: center;
  justify-content: space-between;
  padding: 6px 16px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.75;
  letter-spacing: 0.02857em;
  text-transform: uppercase;
  outline: 0;
  border: 0;
  margin: 0;
  user-select: none;
  vertical-align: middle;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    border-color: #646464;
    background-color: #646464;
    color: #ffffff;
    opacity: 0.8;
  }
`;

export const DivButtonIcon = styled.span`
  display: inherit;
  margin-right: -4px;
  margin-left: 8px;
`;

export const OutlinedDivButtonWrapper = styled(DivButtonWrapper)`
  padding: 0;
  box-shadow: unset;
  border-radius: ${({ borderRadius }) => borderRadius || 'unset'};
  background-color: ${({ bgColor }) => bgColor || 'unset'};
  color: ${({ useColor }) => useColor || 'var(--color-homeworld)'};
  justify-content: flex-start;
  &:hover {
    background-color: unset;
    color: var(--color-homeworld);
    opacity: 0.8;
  }
`;

export const OutlinedDivButtonIcon = styled(DivButtonIcon)`
  margin-right: 8px;
  margin-left: unset;
`;

export const OutlinedDivButtonText = styled.div`
  text-transform: capitalize;
  padding-top: 3px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: ${({ useColor }) => useColor || 'var(--color-homeworld)'};
`;

export const MiniOutlinedDivButtonWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin-top: 5px;
  min-width: ${({ customMinWidth }) => customMinWidth || '150px'};
  min-height: ${({ customMinHeight }) => customMinHeight || '20px'};
  &:hover {
    cursor: pointer;
  }
`;

export const MiniOutlinedDivButtonIcon = styled(OutlinedDivButtonIcon)`
  margin-right: 2px;
  color: ${({ useColor }) => useColor || 'var(--color-homeworld)'};
`;

export const MiniOutlinedDivButtonText = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: ${({ useColor }) => useColor || 'var(--color-homeworld)'};
`;

export const RoundedLightDivButton = styled(DivButtonWrapper)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 40px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 18px -10px rgba(0, 0, 0, 0.3), 0 10px 40px -20px rgba(0, 0, 0, 0.4);
  color: ${({ bgColor }) => (bgColor ? 'var(--color-la-luna)' : 'var(--color-homeworld)')};
  background-color: ${({ bgColor }) => bgColor || 'var(--color-la-luna)'};
  min-width: ${({ customMinWidth }) => customMinWidth || '300px'};
  min-height: ${({ customMinHeight }) => customMinHeight || '56px'};
  &:hover {
    border-color: var(--color-cathedral);
    background-color: var(--color-cathedral);
    color: #ffffff;
    opacity: 0.6;
  }
  ${({ disabled }) =>
    disabled &&
    `
    pointer-events: none;
    background-color: #f5f5f6;
    cursor: not-allowed;
    color: var(--color-aluminium);
  `}
`;

export const RoundedLightDivButtonText = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  text-transform: capitalize;
`;

export const DiscoverRegionAddCloudsRemoveButtonWrapper = styled(DivButtonWrapper)`
  padding: 0;
  box-shadow: unset;
  border-radius: ${({ borderRadius }) => borderRadius || 'unset'};
  background-color: ${({ bgColor }) => bgColor || 'unset'};
  color: ${({ useColor }) => useColor || 'var(--color-homeworld)'};
  justify-content: center;
  position: absolute;
  margin-top: ${({ customMarginTop }) => customMarginTop || '10px'};
  margin-left: ${({ customMarginLeft }) => customMarginLeft || '110px'};
  z-index: 1100;
`;

export const DiscoverRegionAddCloudsRemoveButtonIcon = styled(DivButtonIcon)`
  margin-right: unset;
  margin-left: unset;
  svg {
    width: 15px;
    height: 15px;
  }
`;

export const DiscoverRegionAddCloudsRemoveButtonText = styled.div`
  text-transform: capitalize;
  padding-top: 3px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: ${({ useColor }) => useColor || 'var(--color-homeworld)'};
`;

export const DivStyleTextButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  min-width: ${({ customMinWidth }) => customMinWidth || '300px'};
  min-height: ${({ customMinHeight }) => customMinHeight || '50px'};
  background-color: ${({ bgColor }) => bgColor || 'unset'};
  color: ${({ useColor }) => useColor || 'var(--color-batman)'};
  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;

export const DivStyleTextButtonText = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
`;

export const DivStyleTextButtonTextAlt = styled(DivStyleTextButtonText)`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 12.8px;
  line-height: 19px;
  letter-spacing: -0.007em;
`;
