import styled from '@emotion/styled';

export const DependencyTextWrapper = styled.div`
  display: flex;
  grid-column: ${({ gridColumn }) => gridColumn};
`;

export const DiscoverRegionsCustomerLocationsLayout = styled.div`
  display: grid;
  grid-auto-flow: dense;
  grid-gap: 24px 32px;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  grid-template-rows: auto;
  padding-bottom: 24px;
`;

export const TreeLeftAngle = styled.div`
  border-bottom: 1px solid var(--color-homeworld);
  border-left: 1px solid var(--color-homeworld);
  border-radius: 0 3px;
  flex-grow: 0;
  height: 13px;
  margin-left: 5px;
  margin-right: 10px;
  margin-top: -12px;
  opacity: 0.12;
  width: 13px;
`;
