import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import { TableRowText, TableCellWithBorderLeft } from '../custom-table-styled';
import { BRIEF_TABLE_COLUMN_CONFIG } from '../../../utils/constants/constants';
import { isEmpty, wrapTextWithTags } from '../../../utils/utils';
import { setRecentlyAdded, setRecentlyEdited } from '../../../features/slices/uiSlice';
import { getRecentlyAdded, getRecentlyEdited } from '../../../features/selectors/ui';

function BriefsTableRow({ row, searchText, isArchived, handleDownloadMode }) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const recentlyEdited = useSelector(getRecentlyEdited);
  const recentlyAddedRow = useSelector(getRecentlyAdded);

  // constant
  const tableColumnMap = BRIEF_TABLE_COLUMN_CONFIG;
  const showRecentlyAddedStyled = !isEmpty(recentlyAddedRow) && recentlyAddedRow === row.id;
  const showRecentlyEditedStyled = !isEmpty(recentlyEdited) && recentlyEdited === row.id;

  // func
  const showNewOrEditedStyles = columnId => {
    const isMarketingNameColumn = columnId === 'documentName';
    if (isMarketingNameColumn && showRecentlyAddedStyled) return 'new';
    if (isMarketingNameColumn && showRecentlyEditedStyled) return 'edited';
    return '';
  };

  // effect
  useEffect(() => {
    if (showRecentlyEditedStyled) {
      setTimeout(() => {
        dispatch(setRecentlyEdited(''));
      }, 30000);
    }
    if (showRecentlyAddedStyled) {
      setTimeout(() => {
        dispatch(setRecentlyAdded(''));
      }, 30000);
    }
  }, [showRecentlyEditedStyled, showRecentlyAddedStyled, dispatch]);

  return (
    <div style={{ display: 'contents' }}>
      <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
        {tableColumnMap.map(column => {
          const isMarketingNameColumn = column.id === 'documentName';
          const showNewBorder = showNewOrEditedStyles(column.id) === 'new';
          const showEditedBorder = showNewOrEditedStyles(column.id) === 'edited';
          let value = row[column.id];
          if (typeof value === 'object') {
            value = { ...row[column.id], props: { ...row[column.id].props } };
          }
          const formattedValue = column.format ? column.format(value) : value;
          const wrapText = isMarketingNameColumn ? wrapTextWithTags(formattedValue, searchText) : formattedValue;
          const renderNumberCol = () => {
            return wrapText;
          };

          return (
            <TableCellWithBorderLeft key={column.id} align={column.align} showNewBorder={showNewBorder} showEditedBorder={showEditedBorder}>
              <TableRowText
                customFontWeight={column?.fontWeight}
                pointerCursor={isMarketingNameColumn}
                onClick={() => handleDownloadMode(column.id, row?.marketingId, row?.documentName)}>
                {renderNumberCol()}
              </TableRowText>
            </TableCellWithBorderLeft>
          );
        })}
      </TableRow>
    </div>
  );
}

BriefsTableRow.propTypes = {
  row: PropTypes.shape({
    documentName: PropTypes.string.isRequired,
    lastUpdated: PropTypes.string.isRequired,
    modifiedBy: PropTypes.string.isRequired,
    customer: PropTypes.string.isRequired,
    project: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    marketingId: PropTypes.string.isRequired,
  }).isRequired,
  searchText: PropTypes.string,
  isArchived: PropTypes.bool,
  handleDownloadMode: PropTypes.func,
};

BriefsTableRow.defaultProps = {
  searchText: '',
  isArchived: false,
  handleDownloadMode: () => {},
};

export default BriefsTableRow;
