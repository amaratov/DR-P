import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import CustomProjectRow from './custom-row-project';
import SortableProjectTableHeader from './sortable-project-table-header';
import MoreMenuButton from '../../more-menu-button/more-menu-button';
import { getWhoAmI } from '../../../features/selectors';

const createProjectRowData = (projectDetails, user) => {
  const fullCreatedDate = projectDetails?.createdAt ? new Date(`${projectDetails?.createdAt}`).toDateString() : projectDetails?.createdAt;
  const createdDateWithoutWeekDay = fullCreatedDate ? fullCreatedDate.substring(4) : fullCreatedDate;
  const fullUpdatedDate = projectDetails?.updatedAt ? new Date(`${projectDetails?.updatedAt}`).toDateString() : projectDetails?.updatedAt;
  const updatedDateWithoutWeekDay = fullUpdatedDate ? fullUpdatedDate.substring(4) : fullUpdatedDate;
  return {
    projectName: projectDetails?.title,
    members:
      projectDetails?.associatedUsers?.length === 1
        ? `${projectDetails?.associatedUsers?.length} Member`
        : `${projectDetails?.associatedUsers?.length} Members`,
    user,
    createdAt: createdDateWithoutWeekDay,
    updatedAt: updatedDateWithoutWeekDay,
    moreMenu: <MoreMenuButton rowDetails={projectDetails} isYourProjectDetails />,
    id: projectDetails?.id,
  };
};

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
};

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
};

const DEFAULT_ORDER = 'asc';
const DEFAULT_ORDER_BY = 'projectName';

function CustomProjectTable({ tableData, searchText, page, maxRowsPerPage }) {
  // selectors
  const whoami = useSelector(getWhoAmI);

  // state
  const [order, setOrder] = useState(DEFAULT_ORDER);
  const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY);

  // const
  const associatedUsers = [];
  const rowData = tableData.map(data => {
    associatedUsers.push({ id: data?.id, users: data?.associatedUsers });
    return createProjectRowData(data, whoami?.firstName);
  });

  // func
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

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
          <SortableProjectTableHeader order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
          <TableBody>
            {stableSort(rowData, getComparator(order, orderBy))
              .slice(page * maxRowsPerPage, page * maxRowsPerPage + maxRowsPerPage)
              .map(row => {
                const users = associatedUsers.filter(value => value.id === row.id);
                return <CustomProjectRow row={row} searchText={searchText} key={row.id} associatedUsers={users?.length > 0 ? users[0]?.users : []} />;
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

CustomProjectTable.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  searchText: PropTypes.string,
  page: PropTypes.number,
  maxRowsPerPage: PropTypes.number,
};

CustomProjectTable.defaultProps = {
  searchText: '',
  page: 0,
  maxRowsPerPage: 10,
};

export default CustomProjectTable;
