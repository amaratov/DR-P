import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import Fade from '@mui/material/Fade';
import { TableRowText, TableCellWithBorderLeft, TableNameRecentlyTouched, RecentlyAddedOrEditedTag } from '../custom-table-styled';
import { PROJECT_BRIEFCASE_TABLE_COLUMN_CONFIG } from '../../../utils/constants/constants';
import { isEmpty } from '../../../utils/utils';
import { setRecentlyAdded, setRecentlyEdited } from '../../../features/slices/uiSlice';
import { getRecentlyAdded, getRecentlyEdited } from '../../../features/selectors/ui';
import { backendService } from '../../../services/backend';

function CustomProjectBriefcasePanelRow({ row, panelView }) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const recentlyEdited = useSelector(getRecentlyEdited);
  const recentlyAddedRow = useSelector(getRecentlyAdded);

  // constant
  const tableColumnMap = PROJECT_BRIEFCASE_TABLE_COLUMN_CONFIG;
  const showRecentlyAddedStyled = !isEmpty(recentlyAddedRow) && recentlyAddedRow === row.id;
  const showRecentlyEditedStyled = !isEmpty(recentlyEdited) && recentlyEdited === row.id;

  // func
  const showNewOrEditedStyles = columnId => {
    const isProjectBriefcaseNameColumn = columnId === 'documentName';
    if (isProjectBriefcaseNameColumn && showRecentlyAddedStyled) return 'new';
    if (isProjectBriefcaseNameColumn && showRecentlyEditedStyled) return 'edited';
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
          const isProjectBriefcaseNameColumn = column.id === 'documentName';
          const showNewBorder = showNewOrEditedStyles(column.id) === 'new';
          const showEditedBorder = showNewOrEditedStyles(column.id) === 'edited';
          let value = row[column.id];
          if (typeof value === 'object') {
            value = { ...row[column.id], props: { ...row[column.id].props } };
          }
          const formattedValue = column.format ? column.format(value) : value;
          const wrapText = formattedValue;
          const renderNumberCol = () => {
            return wrapText;
          };

          return (
            <TableCellWithBorderLeft key={column.id} align={column.align} showNewBorder={showNewBorder} showEditedBorder={showEditedBorder}>
              {showNewBorder || showEditedBorder ? (
                <TableNameRecentlyTouched customFontWeight={column?.fontWeight} pointerCursor={isProjectBriefcaseNameColumn}>
                  {renderNumberCol()}
                  <Fade in={showNewBorder || showEditedBorder} mountOnEnter unmountOnExit timeout={500}>
                    <RecentlyAddedOrEditedTag showNewBorder={showNewBorder} showEditedBorder={showEditedBorder}>
                      {showNewBorder ? 'NEW' : 'EDITED'}
                    </RecentlyAddedOrEditedTag>
                  </Fade>
                </TableNameRecentlyTouched>
              ) : (
                <TableRowText customFontWeight={column?.fontWeight} pointerCursor={isProjectBriefcaseNameColumn}>
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

CustomProjectBriefcasePanelRow.propTypes = {
  row: PropTypes.shape({
    documentName: PropTypes.string.isRequired,
    dateAdded: PropTypes.string.isRequired,
    createdBy: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  panelView: PropTypes.bool,
};

CustomProjectBriefcasePanelRow.defaultProps = {
  panelView: false,
};

export default CustomProjectBriefcasePanelRow;
