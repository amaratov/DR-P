import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { BUTTON_ICON, BUTTON_STYLE } from '../../../utils/constants/constants';
import { getRemoveRow } from '../../../features/selectors/ui';
import { getComparator, isEmpty, stableSort } from '../../../utils/utils';
import { resetRemoveRow } from '../../../features/slices/uiSlice';
import BriefsTableHeader from './briefs-table-header';
import BriefsTableRow from './briefs-table-row';
import CustomButton from '../../form-elements/custom-button';
import { backendService } from '../../../services/backend';

const createBriefsRowData = (documentName, lastUpdated, customer, modifiedBy, project, id, key, handleDownloadMode) => {
  return {
    documentName,
    lastUpdated,
    customer,
    modifiedBy,
    project,
    download: (
      <CustomButton
        buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
        icon={BUTTON_ICON.FILE_DOWNLOAD}
        buttonText=""
        type="button"
        useColor="var(--color-aluminium)"
        onClickFunc={() => handleDownloadMode('documentName', id, documentName)}
      />
    ),
    id: key,
    marketingId: id,
  };
};

const DEFAULT_ORDER = 'asc';
const DEFAULT_ORDER_BY = 'documentName';

function BriefsTable({ tableData, searchText, isArchived, page, maxRowsPerPage }) {
  // dispatch
  const dispatch = useDispatch();

  // selectors
  const rowToBeRemoved = useSelector(getRemoveRow);

  // state
  const [order, setOrder] = useState(DEFAULT_ORDER);
  const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY);

  // func
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleDownloadMode = useCallback(
    (columnId, id, documentName) => {
      if (columnId === 'documentName') {
        const requestValues = {
          id,
          originalFilename: documentName,
        };
        dispatch(backendService.downloadMarketing(requestValues));
      }
    },
    [dispatch]
  );

  // const
  const rowData = tableData.map(data => {
    return createBriefsRowData(
      data.documentName,
      data.addedDate,
      data.customer || 'customer',
      data.modifiedBy,
      data.project || 'project',
      data.id,
      data.key,
      handleDownloadMode
    );
  });

  // effect
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
          <BriefsTableHeader order={order} orderBy={orderBy} onRequestSort={handleRequestSort} isArchived={isArchived} />
          <TableBody>
            {stableSort(rowData, getComparator(order, orderBy))
              .slice(page * maxRowsPerPage, page * maxRowsPerPage + maxRowsPerPage)
              .map(row => {
                return <BriefsTableRow row={row} searchText={searchText} key={row.key || row.id} isArchived={isArchived} />;
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

BriefsTable.propTypes = {
  tableData: PropTypes.arrayOf(
    PropTypes.shape({
      documentName: PropTypes.string.isRequired,
      lastUpdated: PropTypes.string.isRequired,
      modifiedBy: PropTypes.string.isRequired,
      customer: PropTypes.string,
      project: PropTypes.string,
      projectId: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      key: PropTypes.string,
      addedDate: PropTypes.string,
      addedBy: PropTypes.shape({}),
      archived: PropTypes.bool,
      documentType: PropTypes.string,
    })
  ).isRequired,
  searchText: PropTypes.string,
  isArchived: PropTypes.bool,
  page: PropTypes.number,
  maxRowsPerPage: PropTypes.number,
};

BriefsTable.defaultProps = {
  searchText: '',
  isArchived: false,
  page: 0,
  maxRowsPerPage: 50,
};

export default BriefsTable;
