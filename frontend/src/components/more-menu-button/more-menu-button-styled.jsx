import styled from '@emotion/styled';
import MenuItem from '@mui/material/MenuItem';

export const MoreMenuWrapper = styled.div`
  ${({ visible }) => !visible && 'visibility: hidden;'}
  ${({ hideHoverEffect }) =>
    hideHoverEffect &&
    `
  &:hover {
  .MuiButtonBase-root {
  background-color: transparent;
  }
  `}
  ${({ isRegionTab }) =>
    isRegionTab &&
    `
  &:hover {
  .MuiButtonBase-root {
  border-top-right-radius: 24px;
  }
  `}
`;

export const DefaultMenuItem = styled(MenuItem)`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  ${({ borderBottom }) =>
    borderBottom &&
    `
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  `};
  ${({ borderTop }) => borderTop && 'border-top: 1px solid rgba(255, 255, 255, 0.2)'};
`;

export const UseCaseWithProjectsMenuItem = styled(MenuItem)`
  display: block;
  white-space: pre-wrap;
  opacity: 50%;
`;

export const IndustryVerticalWithCompanyMenuItem = styled(MenuItem)`
  display: block;
  white-space: pre-wrap;
  opacity: 50%;
`;
