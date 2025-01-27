import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import Fade from '@mui/material/Fade';
import { TableRowText, TableCellWithBorderLeft, TableNameRecentlyTouched, RecentlyAddedOrEditedTag } from '../custom-table-styled';
import { MARKETING_TABLE_COLUMN_CONFIG, EDIT_MODE } from '../../../utils/constants/constants';
import { isEmpty, wrapTextWithTags } from '../../../utils/utils';
import { setEditMode, setRecentlyAdded, setRecentlyEdited, setSelectedMarketingDetails } from '../../../features/slices/uiSlice';
import { getRecentlyAdded, getRecentlyEdited } from '../../../features/selectors/ui';

function CustomMarketingPanelRow({ row, searchText, isArchived, panelView }) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const recentlyEdited = useSelector(getRecentlyEdited);
  const recentlyAddedRow = useSelector(getRecentlyAdded);

  // constant
  const tableColumnMap = MARKETING_TABLE_COLUMN_CONFIG;
  const showRecentlyAddedStyled = !isEmpty(recentlyAddedRow) && recentlyAddedRow === row.id;
  const showRecentlyEditedStyled = !isEmpty(recentlyEdited) && recentlyEdited === row.id;

  // func
  const handleEditMode = useCallback(
    columnId => {
      if (columnId === 'documentName' && !panelView) {
        dispatch(setSelectedMarketingDetails(row?.moreMenu?.props?.rowDetails));
        dispatch(setEditMode(EDIT_MODE.EDIT_MARKETING));
      }
    },
    [dispatch, row, panelView]
  );

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
            <TableCellWithBorderLeft
              key={column.id}
              align={column.align}
              showNewBorder={showNewBorder}
              showEditedBorder={showEditedBorder}
              maxWidth={column?.id === 'fileType' && column?.maxWidth ? column?.maxWidth : ''}>
              {showNewBorder || showEditedBorder ? (
                <TableNameRecentlyTouched customFontWeight={column?.fontWeight} pointerCursor={isMarketingNameColumn} onClick={() => handleEditMode(column.id)}>
                  {renderNumberCol()}
                  <Fade in={showNewBorder || showEditedBorder} mountOnEnter unmountOnExit timeout={500}>
                    <RecentlyAddedOrEditedTag showNewBorder={showNewBorder} showEditedBorder={showEditedBorder}>
                      {showNewBorder ? 'NEW' : 'EDITED'}
                    </RecentlyAddedOrEditedTag>
                  </Fade>
                </TableNameRecentlyTouched>
              ) : (
                <TableRowText customFontWeight={column?.fontWeight} pointerCursor={isMarketingNameColumn} onClick={() => handleEditMode(column.id)}>
                  {renderNumberCol()}
                </TableRowText>
              )}
            </TableCellWithBorderLeft>
          );
        })}
      </TableRow>
    </div>
  );
}

CustomMarketingPanelRow.propTypes = {
  row: PropTypes.shape({
    documentName: PropTypes.shape({}),
    lastUpdated: PropTypes.string.isRequired,
    modifiedBy: PropTypes.string.isRequired,
    fileType: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  searchText: PropTypes.string,
  isArchived: PropTypes.bool,
  panelView: PropTypes.bool,
};

CustomMarketingPanelRow.defaultProps = {
  searchText: '',
  isArchived: false,
  panelView: false,
};

export default CustomMarketingPanelRow;
