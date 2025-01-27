import styled from '@emotion/styled';

export const StickyWrapper = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  min-height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #3c55c2 0%, #4d3cc6 100%);
  border: 1px solid rgba(255, 255, 255, 0.04);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04), 0 10px 20px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(20px);
  z-index: 101;
`;

export const SiteLogoWrapper = styled.div`
  display: flex;
  padding-left: 97px;
`;
