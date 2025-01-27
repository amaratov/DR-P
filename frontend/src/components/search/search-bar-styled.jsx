import styled from '@emotion/styled';
import Paper from '@mui/material/Paper';

export const SearchBarWrapper = styled(Paper)`
  display: flex;
  background-color: transparent;
  border: unset;
  border-radius: unset;
  box-shadow: unset;
  visibility: ${({ searchBarOpen }) => (searchBarOpen ? 'visible' : 'hidden')};
  width: 100%;
  height: ${({ searchBarOpen }) => (searchBarOpen ? '56px' : '0')};
  padding: 2px 4px;
  align-items: center;
  transition: height 0.5s ease-in-out;
`;

export const PanelSearchBarWrapper = styled(SearchBarWrapper)`
  background-color: transparent;
  border: unset;
  border-radius: unset;
  box-shadow: unset;
`;

export const SearchResultWrapper = styled.div`
  margin-top: 24px;
  width: 100%;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
`;
