import styled from '@emotion/styled';
import Slide from '@mui/material/Slide';
import TableCell from '@mui/material/TableCell';

export const SolutionBriefToDeleteRowSlide = styled(Slide)`
  background: linear-gradient(to right, #e66465, #ff0000bd);
  min-width: 5rem;
  min-height: 1rem;
  height: 73px;
  width: 90vw;
  margin-top: -73px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SolutionBriefInnerColumn = styled.div`
  background-color: ${({ labelId }) => (labelId === 'version' ? '#f1f1f8' : 'var(--color-la-luna)')};
  background-color: ${({ labelId, showPublished }) => showPublished && labelId === 'version' && '#3c55c2'};
  text-align: ${({ labelId }) => labelId === 'version' && 'center'};
  padding: ${({ labelId }) => (labelId === 'version' ? '1rem' : '5px 0px')};
  min-height: ${({ labelId }) => labelId === 'version' && '4.5rem'};
  min-width: ${({ labelId }) => labelId === 'version' && '4.5rem'};
  ${({ showBorderRadius }) => showBorderRadius && 'border-radius: 16px'};
`;

export const SolutionBriefInnerHeader = styled.div`
  color: var(--color-aluminium);
  font-size: 12px;
`;

export const SolutionBriefTableCellWithBorderLeft = styled(TableCell)`
  ${({ showNewBorder }) => showNewBorder && 'border-left: 5px solid #2f5af7'};
  ${({ showEditedBorder }) => showEditedBorder && 'border-left: 5px solid #03bb03'};
  transition: all 0.5s ease-out;
  padding: 8px;
  vertical-align: baseline;
  ${({ centerAlign }) => centerAlign && 'vertical-align: middle'};
`;

export const SolutionBriefTableRowText = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: ${({ customFontWeight }) => (customFontWeight ? `${customFontWeight}` : 400)};
  font-size: 16px;
  line-height: ${({ isProjectColumn }) => (isProjectColumn ? 'unset' : '24px')};
  color: ${({ labelId, showPublished }) => showPublished && labelId === 'version' && 'var(--color-la-luna)'};
  cursor: ${({ pointerCursor }) => (pointerCursor ? 'pointer' : 'default')};
  padding-top: ${({ labelId, showPublished }) => showPublished && labelId === 'version' && '4px'};
  padding-bottom: ${({ labelId, showPublished }) => showPublished && labelId === 'version' && '4px'};
`;
