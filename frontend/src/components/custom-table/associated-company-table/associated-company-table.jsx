import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import AssociatedCompanyTableRow from './associated-company-table-row';
import AssociatedCompanyTableHeader from './associated-company-table-header';
import { getComparator, getFullName, stableSort } from '../../../utils/utils';
import { BUTTON_ICON, BUTTON_STYLE } from '../../../utils/constants/constants';
import CustomButton from '../../form-elements/custom-button';

const DEFAULT_ORDER = 'asc';
const DEFAULT_ORDER_BY = 'companyName';

function AssociatedCompanyTable({ selectedUserDetails, tableData, searchText, handleClick, additionalValues, page, maxRowsPerPage }) {
  // state
  const [order, setOrder] = useState(DEFAULT_ORDER);
  const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY);

  // func
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createRowData = (companyName, projectsArr, creator, createdAt, updatedAt, companyDetails) => {
    const isAssociated =
      companyDetails?.associatedUsers?.some(usr => usr?.id === selectedUserDetails?.id) ||
      additionalValues?.companies?.includes(companyDetails?.id) ||
      additionalValues?.associatedCompanies?.includes(companyDetails?.id);
    return {
      companyName,
      projects: projectsArr,
      creator,
      createdAt,
      updatedAt,
      moreMenu: (
        <CustomButton
          buttonStyle={BUTTON_STYLE.ICON_BUTTON}
          icon={isAssociated ? BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON : BUTTON_ICON.ADD_OUTLINED}
          type="button"
          onClickFunc={() => handleClick(companyDetails?.id, 'associatedCompanies')}
        />
      ),
      details: companyDetails,
      id: companyDetails?.id,
    };
  };

  const createProjectData = projects => {
    return projects.map(project => ({
      id: project?.id,
      projectName: project?.title,
      projectMemberNumber: project?.associatedUsers?.length.toString() || '0',
      creator: getFullName(project?.fullCreatedBy?.firstName, project?.fullCreatedBy.lastName),
      created: moment(project?.createdAt).tz('America/Vancouver').format('MMM DD, YY'),
      lastUpdated: moment(project?.updatedAt).tz('America/Vancouver').format('MMM DD, YY'),
      moreMenu: <CustomButton buttonStyle={BUTTON_STYLE.ICON_BUTTON} icon={BUTTON_ICON.ADD_OUTLINED} type="button" onClickFunc={() => {}} />,
    }));
  };

  // const
  const rowData = tableData.map(data => createRowData(data.name, [...createProjectData(data.projects)], data.creator, data.createdAt, data.updatedAt, data));

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', marginLeft: 'unset !important', boxShadow: 'unset', backgroundColor: 'inherit' }}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <AssociatedCompanyTableHeader order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
          <TableBody>
            {stableSort(rowData, getComparator(order, orderBy))
              .slice(page * maxRowsPerPage, page * maxRowsPerPage + maxRowsPerPage)
              .map(row => (
                <AssociatedCompanyTableRow row={row} searchText={searchText} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

AssociatedCompanyTable.propTypes = {
  selectedUserDetails: PropTypes.shape({}).isRequired,
  tableData: PropTypes.arrayOf(PropTypes.shape([])).isRequired,
  additionalValues: PropTypes.shape({}).isRequired,
  searchText: PropTypes.string,
  handleClick: PropTypes.func.isRequired,
  page: PropTypes.number,
  maxRowsPerPage: PropTypes.number,
};

AssociatedCompanyTable.defaultProps = {
  searchText: '',
  page: 0,
  maxRowsPerPage: 10,
};

export default AssociatedCompanyTable;
