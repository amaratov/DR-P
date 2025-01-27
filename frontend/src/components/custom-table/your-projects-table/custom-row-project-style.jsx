import styled from '@emotion/styled';
import Slide from '@mui/material/Slide';

export const ProjectToActiveRowSlide = styled(Slide)`
  background-color: #e7eafb;
  min-width: 5rem;
  min-height: 1rem;
  height: 73px;
  width: 90vw;
  margin-top: -73px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ProjectToArchiveRowSlide = styled(Slide)`
  background-color: #646464;
  min-width: 5rem;
  min-height: 1rem;
  height: 73px;
  width: 90vw;
  margin-top: -73px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MemberTableRowText = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: ${({ customFontWeight }) => (customFontWeight ? `${customFontWeight}` : 400)};
  font-size: 16px;
  line-height: ${({ isProjectColumn }) => (isProjectColumn ? 'unset' : '24px')};
  color: var(--color-homeworld);
  cursor: ${({ pointerCursor }) => (pointerCursor ? 'pointer' : 'default')};
`;
