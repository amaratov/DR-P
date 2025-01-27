import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import TableRow from '@mui/material/TableRow';
import Slide from '@mui/material/Slide';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { EDIT_MODE, SOLUTION_BRIEF_TABLE_COLUMN_CONFIG } from '../../../utils/constants/constants';
import { isEmpty } from '../../../utils/utils';
import { setEditMode, setRecentlyAdded, setRecentlyEdited, setSelectedSolutionBriefDetails } from '../../../features/slices/uiSlice';
import { getRecentlyAdded, getRecentlyEdited } from '../../../features/selectors/ui';
import {
  SolutionBriefInnerColumn,
  SolutionBriefInnerHeader,
  SolutionBriefTableCellWithBorderLeft,
  SolutionBriefTableRowText,
  SolutionBriefToDeleteRowSlide,
} from './custom-row-solution-brief-style';

function CustomSolutionBriefRow({ row }) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const recentlyEdited = useSelector(getRecentlyEdited);
  const recentlyAddedRow = useSelector(getRecentlyAdded);

  // constant
  const tableColumnMap = SOLUTION_BRIEF_TABLE_COLUMN_CONFIG;
  const showRecentlyAddedStyled = !isEmpty(recentlyAddedRow) && recentlyAddedRow === row.id;
  const showRecentlyEditedStyled = !isEmpty(recentlyEdited) && recentlyEdited === row.id;

  // func
  const handleEditMode = useCallback(
    columnId => {
      if (columnId === 'documentName') {
        dispatch(setSelectedSolutionBriefDetails(row?.moreMenu?.props?.rowDetails));
        dispatch(setEditMode(EDIT_MODE.EDIT_SOLUTION_BRIEF));
      }
    },
    [dispatch, row]
  );

  const showNewOrEditedStyles = columnId => {
    const isSolutionBriefNameColumn = columnId === 'documentName';
    if (isSolutionBriefNameColumn && showRecentlyAddedStyled) return 'new';
    if (isSolutionBriefNameColumn && showRecentlyEditedStyled) return 'edited';
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
      <TableRow role="checkbox" tabIndex={-1} key={row.id} style={{ display: 'flex' }}>
        {tableColumnMap.map(column => {
          const isSolutionBriefNameColumn = column.id === 'documentName';
          const showNewBorder = showNewOrEditedStyles(column.id) === 'new';
          const showEditedBorder = showNewOrEditedStyles(column.id) === 'edited';
          let value = row[column.id];
          if (value && typeof value === 'object') {
            value = { ...row[column.id], props: { ...row[column.id].props } };
          }
          const wrapText = column.format ? column.format(value) : value;
          const renderNumberCol = () => {
            return wrapText;
          };

          return (
            <SolutionBriefTableCellWithBorderLeft
              key={column.id}
              align={column.align}
              showNewBorder={showNewBorder}
              showEditedBorder={showEditedBorder}
              centerAlign={column.id === 'moreMenu'}>
              <SolutionBriefInnerColumn
                labelId={column.id}
                showBorderRadius={column.id === 'version'}
                showPublished={row.published && column.id === 'version'}>
                {(column.id === 'documentName' || column.id === 'version' || column.id === 'createdBy' || column.id === 'notes') && (
                  <SolutionBriefInnerHeader>{column.label}</SolutionBriefInnerHeader>
                )}
                <SolutionBriefTableRowText
                  labelId={column.id}
                  showPublished={row.published && column.id === 'version'}
                  customFontWeight={column?.fontWeight}
                  pointerCursor={isSolutionBriefNameColumn}
                  onClick={() => handleEditMode(column.id)}>
                  {renderNumberCol()}
                </SolutionBriefTableRowText>
                {row.published && column.id === 'version' && <div style={{ color: 'var(--color-aluminium)' }}>Published</div>}
              </SolutionBriefInnerColumn>
            </SolutionBriefTableCellWithBorderLeft>
          );
        })}
      </TableRow>
    </div>
  );
}

CustomSolutionBriefRow.propTypes = {
  row: PropTypes.shape({
    version: PropTypes.string.isRequired,
    documentName: PropTypes.string.isRequired,
    createdBy: PropTypes.string.isRequired,
    notes: PropTypes.string.isRequired,
    published: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

CustomSolutionBriefRow.defaultProps = {};

export default CustomSolutionBriefRow;
