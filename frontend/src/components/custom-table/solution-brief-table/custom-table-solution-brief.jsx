import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import CustomSolutionBriefRow from './custom-row-solution-brief';
import MoreMenuButton from '../../more-menu-button/more-menu-button';
import { getComparator, getFullName, formatSolutionBriefVersion, isEmpty, stableSort } from '../../../utils/utils';
import { getRemoveRow } from '../../../features/selectors/ui';
import { resetRemoveRow } from '../../../features/slices/uiSlice';

const createSolutionBriefRowData = (documentName, version, createdBy, published, solutionBriefDetails, notes, id) => {
  return {
    version,
    createdBy,
    documentName,
    notes,
    moreMenu: <MoreMenuButton rowDetails={solutionBriefDetails} isSolutionBriefDetails />,
    published,
    id,
  };
};

const DEFAULT_ORDER = 'asc';
const DEFAULT_ORDER_BY = 'documentName';

function CustomSolutionBriefTable({ tableData, page, maxRowsPerPage }) {
  // dispatch
  const dispatch = useDispatch();

  // selectors
  const rowToBeRemoved = useSelector(getRemoveRow);

  // state
  const [order, setOrder] = useState(DEFAULT_ORDER);
  const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY);

  // const
  const rowData = tableData.map(data => {
    const briefVersion = formatSolutionBriefVersion(data?.briefcaseVersionCode, data?.briefcaseMajorVersion, data?.briefcaseMinorVersion);
    const createdByFullName = getFullName(data?.fullCreatedBy?.firstName, data?.fullCreatedBy?.lastName);
    const note = data?.notes || '';
    return createSolutionBriefRowData(data.originalFilename || '', briefVersion, createdByFullName, data?.createdAt, data, note, data.id);
  });

  useEffect(() => {
    if (!isEmpty(rowData) && !isEmpty(rowToBeRemoved) && !rowData.some(row => row.id === rowToBeRemoved)) {
      dispatch(resetRemoveRow());
    }
  }, [rowData, rowToBeRemoved, dispatch]);

  return (
    <div style={{ display: 'grid', gridGap: '1rem' }}>
      {stableSort(rowData, getComparator(order, orderBy))
        .slice(page * maxRowsPerPage, page * maxRowsPerPage + maxRowsPerPage)
        .map(row => {
          return (
            <div key={row?.id} style={{ display: 'grid', gridAutoFlow: 'column', gridGap: '0.5rem', gridTemplateColumns: '1fr 30fr', zIndex: '500' }}>
              <div style={{ background: 'blue', height: '1rem', width: '1rem' }} />
              <Paper
                sx={{
                  width: '100%',
                  overflow: 'hidden',
                  border: row?.published && '2px solid #3c55c2',
                  boxShadow: '0 0px 10px rgba(0, 0, 0, 0.04), 0 0px 20px rgba(0, 0, 0, 0.04)',
                  zIndex: '1008',
                  borderRadius: '20px',
                }}>
                <TableContainer sx={{ boxShadow: '0 0 10px #f1f1f8', zIndex: '1010' }}>
                  <Table key={`${row?.id}-table`} stickyHeader aria-label="sticky table">
                    <TableBody>
                      <CustomSolutionBriefRow row={row} key={row.id} />
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </div>
          );
        })}
    </div>
  );
}

CustomSolutionBriefTable.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  page: PropTypes.number,
  maxRowsPerPage: PropTypes.number,
};

CustomSolutionBriefTable.defaultProps = {
  page: 0,
  maxRowsPerPage: 10,
};

export default CustomSolutionBriefTable;
