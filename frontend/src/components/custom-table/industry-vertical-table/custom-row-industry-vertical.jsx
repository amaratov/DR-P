import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import Fade from '@mui/material/Fade';
import { mdiCheckCircleOutline, mdiInbox } from '@mdi/js';
import Icon from '@mdi/react';
import { TableRowText, TableTextRoundBorder, TableCellWithBorderLeft, TableNameRecentlyTouched, RecentlyAddedOrEditedTag } from '../custom-table-styled';
import { ACTIVE_INDUSTRY_VERTICAL_TABLE_COLUMN_CONFIG, ARCHIVED_INDUSTRY_VERTICAL_TABLE_COLUMN_CONFIG, EDIT_MODE } from '../../../utils/constants/constants';
import { isEmpty, wrapTextWithTags } from '../../../utils/utils';
import { setEditMode, setRecentlyAdded, setRecentlyEdited, setSelectedIndustryVerticalDetails } from '../../../features/slices/uiSlice';
import { getRecentlyAdded, getRecentlyEdited } from '../../../features/selectors/ui';
import { IndustryVerticalToActiveRowSlide, IndustryVerticalToArchiveRowSlide } from './custom-row-industry-vertical-style';

function CustomIndustryVerticalRow({ row, searchText, isArchived }) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const recentlyEdited = useSelector(getRecentlyEdited);
  const recentlyAddedRow = useSelector(getRecentlyAdded);

  // constant
  const tableColumnMap = isArchived ? ARCHIVED_INDUSTRY_VERTICAL_TABLE_COLUMN_CONFIG : ACTIVE_INDUSTRY_VERTICAL_TABLE_COLUMN_CONFIG;
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
      if (columnId === 'industryVerticalName') {
        dispatch(setSelectedIndustryVerticalDetails(row?.moreMenu?.props?.rowDetails));
        dispatch(setEditMode(EDIT_MODE.EDIT_INDUSTRY_VERTICAL));
      }
    },
    [dispatch, row]
  );

  const showNewOrEditedStyles = columnId => {
    const isIndustryVerticalNameColumn = columnId === 'industryVerticalName';
    if (isIndustryVerticalNameColumn && showRecentlyAddedStyled) return 'new';
    if (isIndustryVerticalNameColumn && showRecentlyEditedStyled) return 'edited';
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
          const isIndustryVerticalNameColumn = column.id === 'industryVerticalName';
          const isCompanyColumn = column.id === 'companies';
          const isDocumentColumn = column.id === 'documents';
          const showNewBorder = showNewOrEditedStyles(column.id) === 'new';
          const showEditedBorder = showNewOrEditedStyles(column.id) === 'edited';
          let value = row[column.id];
          if (typeof value === 'object') {
            value = { ...row[column.id], props: { ...row[column.id].props, transitionToggle: handleChange } };
          }
          const formattedValue = column.format ? column.format(value) : value;
          const wrapText = isIndustryVerticalNameColumn ? wrapTextWithTags(formattedValue, searchText) : formattedValue;
          const renderRoundBorder = () => {
            if (isCompanyColumn || isDocumentColumn) {
              return <TableTextRoundBorder>{wrapText}</TableTextRoundBorder>;
            }
            return wrapText;
          };

          return (
            <TableCellWithBorderLeft key={column.id} align={column.align} showNewBorder={showNewBorder} showEditedBorder={showEditedBorder}>
              {showNewBorder || showEditedBorder ? (
                <TableNameRecentlyTouched
                  customFontWeight={column?.fontWeight}
                  isCompanyColumn={isCompanyColumn}
                  pointerCursor={isIndustryVerticalNameColumn}
                  onClick={() => handleEditMode(column.id)}>
                  {renderRoundBorder()}
                  <Fade in={showNewBorder || showEditedBorder} mountOnEnter unmountOnExit timeout={500} style={{ marginLeft: '10px' }}>
                    <RecentlyAddedOrEditedTag showNewBorder={showNewBorder} showEditedBorder={showEditedBorder}>
                      {showNewBorder ? 'NEW' : 'EDITED'}
                    </RecentlyAddedOrEditedTag>
                  </Fade>
                </TableNameRecentlyTouched>
              ) : (
                <TableRowText
                  customFontWeight={column?.fontWeight}
                  isCompanyColumn={isCompanyColumn}
                  pointerCursor={isIndustryVerticalNameColumn}
                  onClick={() => handleEditMode(column.id)}>
                  {renderRoundBorder()}
                </TableRowText>
              )}
            </TableCellWithBorderLeft>
          );
        })}
      </TableRow>
      <IndustryVerticalToActiveRowSlide direction="left" in={!checked && isArchived} mountOnEnter unmountOnExit timeout={500}>
        <div style={{ color: 'var(--color-aluminium)' }}>
          <Icon path={mdiCheckCircleOutline} size={1} horizontal vertical rotate={180} />
        </div>
      </IndustryVerticalToActiveRowSlide>
      <IndustryVerticalToArchiveRowSlide direction="left" in={!checked && !isArchived} mountOnEnter unmountOnExit timeout={500}>
        <div style={{ color: 'var(--color-aluminium)' }}>
          <Icon path={mdiInbox} size={1} horizontal vertical rotate={180} />
        </div>
      </IndustryVerticalToArchiveRowSlide>
    </div>
  );
}

CustomIndustryVerticalRow.propTypes = {
  row: PropTypes.shape({
    industryVerticalName: PropTypes.string.isRequired,
    documents: PropTypes.number.isRequired,
    projects: PropTypes.number,
    id: PropTypes.string.isRequired,
  }).isRequired,
  searchText: PropTypes.string,
  isArchived: PropTypes.bool,
};

CustomIndustryVerticalRow.defaultProps = {
  searchText: '',
  isArchived: false,
};

export default CustomIndustryVerticalRow;
