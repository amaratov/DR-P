import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import MoreMenuButton from '../../more-menu-button/more-menu-button';
import { getPageNum, getRemoveRow, getSortOrder, getSortOrderBy } from '../../../features/selectors/ui';
import { isEmpty } from '../../../utils/utils';
import { resetRemoveRow, setOrder, setOrderBy } from '../../../features/slices/uiSlice';
import ReferenceArchitectureTableHeader from './reference-architecture-table-header';
import ReferenceArchitectureTableRow from './reference-architecture-table-row';
import { backendService } from '../../../services/backend';

const createReferenceArchitectureRowData = (documentName, lastUpdated, modifiedBy, referenceArchitectureDetails, fileType, id) => {
  let type = '';
  try {
    type = fileType.join(', ');
  } catch (e) {
    type = '';
  }
  return {
    documentName,
    lastUpdated,
    modifiedBy,
    fileType: type,
    moreMenu: <MoreMenuButton rowDetails={referenceArchitectureDetails} isReferenceArchitectureDetails />,
    id,
  };
};

const DEFAULT_ORDER_BY = 'documentName';

function ReferenceArchitectureTable({ tableData, searchText, isArchived }) {
  // dispatch
  const dispatch = useDispatch();

  // selectors
  const rowToBeRemoved = useSelector(getRemoveRow);
  const page = useSelector(getPageNum);
  const order = useSelector(getSortOrder);
  const orderBy = useSelector(getSortOrderBy);

  // const
  const rowData = tableData.map(data => {
    return createReferenceArchitectureRowData(data.name || data.docName || data.originalFilename, data.updatedAt, data.modifiedBy, data, data?.types, data.id);
  });

  // func
  const handleRequestSort = (event, property) => {
    const isAsc = order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    if (property === DEFAULT_ORDER_BY) {
      if (orderBy !== 'docName') {
        dispatch(setOrder('asc'));
        dispatch(setOrderBy('docName'));
        dispatch(backendService.getReferenceArchitectureByParams({ archived: isArchived, page, order: [['docName', 'asc']] }));
      } else {
        dispatch(setOrder(newOrder));
        dispatch(backendService.getReferenceArchitectureByParams({ archived: isArchived, page, order: [[orderBy, newOrder]] }));
      }
    } else if (property === 'lastUpdated') {
      if (orderBy !== 'updatedAt') {
        dispatch(setOrder('asc'));
        dispatch(setOrderBy('updatedAt'));
        dispatch(backendService.getReferenceArchitectureByParams({ archived: isArchived, page, order: [['updatedAt', 'asc']] }));
      } else {
        dispatch(setOrder(newOrder));
        dispatch(backendService.getReferenceArchitectureByParams({ archived: isArchived, page, order: [[orderBy, newOrder]] }));
      }
    } else if (property === 'modifiedBy') {
      if (orderBy !== 'createdBy') {
        dispatch(setOrder('asc'));
        dispatch(setOrderBy('createdBy'));
        dispatch(backendService.getReferenceArchitectureByParams({ archived: isArchived, page, order: [['createdBy', 'asc']] }));
      } else {
        dispatch(setOrder(newOrder));
        dispatch(backendService.getReferenceArchitectureByParams({ archived: isArchived, page, order: [[orderBy, newOrder]] }));
      }
    } else if (property === 'fileType') {
      if (orderBy !== 'types') {
        dispatch(setOrder('asc'));
        dispatch(setOrderBy('types'));
        dispatch(backendService.getReferenceArchitectureByParams({ archived: isArchived, page, order: [['types', 'asc']] }));
      } else {
        dispatch(setOrder(newOrder));
        dispatch(backendService.getReferenceArchitectureByParams({ archived: isArchived, page, order: [[orderBy, newOrder]] }));
      }
    }
  };

  useEffect(() => {
    if (!isEmpty(rowData) && !isEmpty(rowToBeRemoved) && !rowData.some(row => row.id === rowToBeRemoved)) {
      dispatch(resetRemoveRow());
    }
  }, [rowData, rowToBeRemoved, dispatch]);

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        border: '8px solid #f1f1f8',
        boxShadow: '0 0px 10px rgba(0, 0, 0, 0.04), 0 0px 20px rgba(0, 0, 0, 0.04)',
        zIndex: '1008',
        borderRadius: '30px',
      }}>
      <TableContainer sx={{ boxShadow: '0 0 10px #f1f1f8', zIndex: '1010' }}>
        <Table stickyHeader aria-label="sticky table">
          <ReferenceArchitectureTableHeader order={order} orderBy={orderBy} onRequestSort={handleRequestSort} isArchived={isArchived} />
          <TableBody>
            {rowData.map(row => {
              return <ReferenceArchitectureTableRow row={row} searchText={searchText} key={row.id} isArchived={isArchived} />;
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default ReferenceArchitectureTable;
