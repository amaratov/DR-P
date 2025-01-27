import styled from '@emotion/styled';
import { Select, Button, MenuItem } from '@mui/material';

export const RegionHubContainer = styled.div`
  display: flex;
  background: var(--color-la-luna);
  z-index: 101;
  position: relative;
  flex-flow: column;
  max-width: 20rem;
  float: right;
  margin-right: 2rem;
  margin-top: 2rem;
  border-radius: 40px;
  padding: 0.25rem 1.5rem;
`;

export const RegionSelectContainer = styled(Select)`
  font-size: 16px;
  fieldset {
    border: none;
  }
`;

export const RegionSelectMenuItemContainer = styled(MenuItem)`
  font-size: 16px;
`;

export const RegionLaidOutHubContainer = styled.div`
  display: flex;
  z-index: 101;
  position: relative;
  flex-flow: row;
  float: right;
  margin-right: 2rem;
  margin-top: 2rem;
  border-radius: 40px;
  grid-gap: 1rem;
`;

export const RegionValueContainer = styled(Button)`
  display: flex;
  position: relative;
  max-width: 20rem;
  width: 18rem;
  border-radius: 40px;
  text-transform: none;
  padding: 0.5rem 0rem;
`;
