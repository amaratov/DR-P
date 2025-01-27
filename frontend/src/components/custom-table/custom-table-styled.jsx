import styled from '@emotion/styled';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Slide from '@mui/material/Slide';

export const TableRowCollapsibleIconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const TableRowText = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: ${({ customFontWeight }) => (customFontWeight ? `${customFontWeight}` : 400)};
  font-size: 16px;
  line-height: ${({ isProjectColumn }) => (isProjectColumn ? 'unset' : '24px')};
  color: var(--color-batman);
  cursor: ${({ pointerCursor }) => (pointerCursor ? 'pointer' : 'default')};
`;

export const TableRowWithLBorder = styled(TableRow)`
  position: relative;

  &::before {
    border-left: 1px solid #646464;
    border-radius: 10px;
    bottom: 25px;
    content: '';
    height: 22px;
    left: 0;
    position: absolute;
    width: 2px;
  }

  &::after {
    border-left: 1px solid #646464;
    border-bottom: 1px solid #646464;
    border-radius: 10px;
    bottom: 25px;
    content: '';
    left: 0;
    position: absolute;
    width: 6px;
    height: 2px;
  }
`;

export const TableTextRoundBorder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 30px;
  margin-left: 5px;
  background: #e6e6e6;
  border-radius: 30px;
`;

export const TableNumberText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 30px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: var(--color-homeworld);
  text-align: center;
`;

export const TableCellRecentlyEditedBorder = styled(TableCell)`
  border-left: 5px solid #03bb03;
`;

export const TableCellWithBorderLeft = styled(TableCell)`
  ${({ showNewBorder }) => showNewBorder && 'border-left: 5px solid #2f5af7'};
  ${({ showEditedBorder }) => showEditedBorder && 'border-left: 5px solid #03bb03'};
  ${({ maxWidth }) => maxWidth && `max-width: ${maxWidth}px`};
  transition: all 0.5s ease-out;
`;

export const TableNameRecentlyTouched = styled(TableRowText)`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: ${({ customFontWeight }) => (customFontWeight ? `${customFontWeight}` : 400)};
  font-size: 16px;
  line-height: ${({ isProjectColumn }) => (isProjectColumn ? 'unset' : '19px')};
  color: #646464;
  display: flex;
  cursor: ${({ pointerCursor }) => (pointerCursor ? 'pointer' : 'default')};
`;

export const RecentlyAddedOrEditedTag = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  ${({ showNewBorder }) => showNewBorder && 'background-color: #2f5af7'};
  ${({ showEditedBorder }) => showEditedBorder && 'background-color: #03bb03'};
  color: var(--color-la-luna);
  padding: 2px 10px;
  border-radius: 15px;
  margin-left: 6px;
`;

export const CompanyToActiveRowSlide = styled(Slide)`
  background-color: #e7eafb;
  min-width: 5rem;
  min-height: 1rem;
  height: 73px;
  width: calc(100vw - 186px);
  margin-top: -73px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
`;

export const CompanyToArchiveRowSlide = styled(Slide)`
  background-color: #e7eafb;
  min-width: 5rem;
  min-height: 1rem;
  height: 73px;
  width: calc(100vw - 186px);
  margin-top: -73px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
`;

export const ArchivedTag = styled.div`
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  background-color: #c8c8c880;
  color: var(--color-cathedral);
  opacity: 90%;
  padding: 2px 10px;
  border-radius: 15px;
  margin-left: 6px;
`;
