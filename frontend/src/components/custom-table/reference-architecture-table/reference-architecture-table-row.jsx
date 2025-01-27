import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import Fade from '@mui/material/Fade';
import { mdiCheckCircleOutline, mdiInbox } from '@mdi/js';
import Icon from '@mdi/react';
import { TableRowText, TableCellWithBorderLeft, TableNameRecentlyTouched, RecentlyAddedOrEditedTag } from '../custom-table-styled';
import { EDIT_MODE, REFERENCE_TABLE_COLUMN_CONFIG } from '../../../utils/constants/constants';
import { isEmpty, wrapTextWithTags } from '../../../utils/utils';
import { setEditMode, setRecentlyAdded, setRecentlyEdited, setSelectedReferenceDocDetails } from '../../../features/slices/uiSlice';
import { getRecentlyAdded, getRecentlyEdited } from '../../../features/selectors/ui';
import { MarketingToActiveRowSlide, MarketingToArchiveRowSlide } from '../marketing-table/custom-row-marketing-style';

function ReferenceArchitectureTableRow({ row, searchText, isArchived }) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const recentlyEdited = useSelector(getRecentlyEdited);
  const recentlyAddedRow = useSelector(getRecentlyAdded);

  // constant
  const tableColumnMap = REFERENCE_TABLE_COLUMN_CONFIG;
  const showRecentlyAddedStyled = !isEmpty(recentlyAddedRow) && recentlyAddedRow === row.id;
  const showRecentlyEditedStyled = !isEmpty(recentlyEdited) && recentlyEdited === row.id;

  // state
  const [checked, setChecked] = useState(true);

  // func
  const handleChange = useCallback(() => {
    setChecked(prev => !prev);
  }, [setChecked]);

  const handleEditMode = useCallback(
    columnId => {
      if (columnId === 'documentName') {
        dispatch(setSelectedReferenceDocDetails(row?.moreMenu?.props?.rowDetails));
        dispatch(setEditMode(EDIT_MODE.EDIT_REFERENCE));
      }
    },
    [dispatch, row]
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
            value = { ...row[column.id], props: { ...row[column.id].props, transitionToggle: handleChange } };
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
      <MarketingToActiveRowSlide direction="left" in={!checked && isArchived} mountOnEnter unmountOnExit timeout={500}>
        <div style={{ color: 'var(--color-aluminium)' }}>
          <Icon path={mdiCheckCircleOutline} size={1} horizontal vertical rotate={180} />
        </div>
      </MarketingToActiveRowSlide>
      <MarketingToArchiveRowSlide direction="left" in={!checked && !isArchived} mountOnEnter unmountOnExit timeout={500}>
        <div style={{ color: 'var(--color-aluminium)' }}>
          <Icon path={mdiInbox} size={1} horizontal vertical rotate={180} />
        </div>
      </MarketingToArchiveRowSlide>
    </div>
  );
}

ReferenceArchitectureTableRow.propTypes = {
  row: PropTypes.shape({
    documentName: PropTypes.string.isRequired,
    lastUpdated: PropTypes.string.isRequired,
    modifiedBy: PropTypes.string.isRequired,
    fileType: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  searchText: PropTypes.string,
  isArchived: PropTypes.bool,
};

ReferenceArchitectureTableRow.defaultProps = {
  searchText: '',
  isArchived: false,
};

export default ReferenceArchitectureTableRow;
