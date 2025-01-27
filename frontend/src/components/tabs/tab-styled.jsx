import styled from '@emotion/styled';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Divider } from '@mui/material';
import Link from '@mui/material/Link';
import Popover from '@mui/material/Popover';

export const TabsWrapper = styled(Tabs)`
  display: flex;
  padding-right: 10px;
  align-items: center;
  ${({ gap }) => gap && `gap: ${gap}`};
`;

export const LinkWrapper = styled.div`
  display: flex;
  padding-right: 10px;
  align-items: center;
  ${({ gap }) => gap && `gap: ${gap}`};
`;

export const PopoverContainer = styled(Popover)`
  margin-top: 20px;
  .MuiPaper-root {
    border-radius: 12px;
    background-color: var(--color-homeworld);
  }
`;

export const PopoverLinkWrapper = styled(LinkWrapper)`
  flex-direction: column;
  background-color: var(--color-homeworld);
  border-radius: 12px;
`;

export const LinkItem = styled(Link)`
  color: ${({ isActive }) => (isActive ? 'rgb(25, 118, 210)' : 'var(--color-la-luna)')};
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.005em;
  padding: ${({ noPadding }) => (noPadding ? '0' : '0 20px')};
  margin: ${({ customMargin }) => customMargin || '0'};
  text-transform: none;
`;

export const PopoverLinkItem = styled(LinkItem)`
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  ${({ hasBorderBottom }) =>
    hasBorderBottom &&
    `
  border-bottom: 1px solid rgba(255, 255, 255, 0.2)
  `};
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: ${({ isActive }) => (isActive ? 'rgb(25, 118, 210)' : 'var(--color-la-luna)')};
`;

export const TabItem = styled(Tab)`
  color: var(--color-homeworld);
  text-align: center;
  font-family: 'Manrope', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  padding: ${({ noPadding }) => (noPadding ? '0' : '0 24px 0 0')};
  margin: ${({ customMargin }) => customMargin || '0'};
  text-transform: none;
`;

export const TabDivider = styled(Divider)`
  border-color: #646464;
  height: 12px;
  margin: auto 0;
`;
