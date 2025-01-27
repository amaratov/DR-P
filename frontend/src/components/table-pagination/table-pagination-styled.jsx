import styled from '@emotion/styled';
import { Button } from '@mui/material';

export const ToggleGrid = styled.div`
  display: flex;
  grid-column-gap: 1rem;
`;

export const ToggleButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  color: black;
  border-radius: 10rem;
  min-width: 7rem;
  margin-left: 2rem;
  margin-right: 2rem;
  box-shadow: 2px 5px 5px #00000021;
  width: 100%;
  height: 100%;
  text-align: center;
  &:hover {
    opacity: 0.7;
  }
`;

export const TogglePage = styled(Button)`
  background: white;
  color: black;
  border-radius: 10rem;
  min-width: 2.5rem;
  box-shadow: 2px 5px 5px #00000021;
  &:hover {
    background: white;
  }
`;

export const ToggleEllipsis = styled.div`
  align-self: center;
  display: flex;
  color: var(--color-aluminium);
`;
