import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import CustomRow from './custom-row';
import SortableTableHeader from './sortable-table-header';
import MoreMenuButton from '../more-menu-button/more-menu-button';
import { getFullName } from '../../utils/utils';
import { getPageNum, getSortOrder, getSortOrderBy } from '../../features/selectors/ui';
import { backendService } from '../../services/backend';
import { setOrder, setOrderBy } from '../../features/slices/uiSlice';

const createRowData = (companyName, projectsArr, creator, createdAt, updatedAt, companyDetails, myCompanies, isAdminOrSA) => {
  return {
    companyName,
    projects: projectsArr,
    creator,
    createdAt,
    updatedAt,
    moreMenu: <MoreMenuButton visible={isAdminOrSA} rowDetails={companyDetails} isCompanyDetails isMyCompanies={myCompanies} isCompany />,
    details: companyDetails,
    id: companyDetails?.id,
  };
};

const createProjectData = (projects, isAdminOrSA) => {
  return projects.map(project => ({
    id: project?.id,
    projectName: project?.title,
    projectMemberNumber: project?.associatedUsers?.length.toString() || '0',
    creator: getFullName(project?.fullCreatedBy?.firstName, project?.fullCreatedBy?.lastName),
    created: moment(project?.createdAt).tz('America/Vancouver').format('MMM DD, YY'),
    lastUpdated: moment(project?.updatedAt).tz('America/Vancouver').format('MMM DD, YY'),
    moreMenu: <MoreMenuButton visible={isAdminOrSA} rowDetails={project} isProject />,
    new: project?.new,
    edited: project?.edited,
  }));
};

const DEFAULT_ORDER_BY = 'companyName';

function CustomTable({ tableData, searchText, myCompanies, isAdminOrSA, isArchived }) {
  // dispatch
  const dispatch = useDispatch();

  // const
  const rowData = tableData.map(data =>
    createRowData(data.name, [...createProjectData(data.projects, isAdminOrSA)], data.creator, data.createdAt, data.updatedAt, data, myCompanies, isAdminOrSA)
  );

  // selector
  const page = useSelector(getPageNum);
  const order = useSelector(getSortOrder);
  const orderBy = useSelector(getSortOrderBy);

  // func
  const handleRequestSort = (event, property) => {
    const isAsc = order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    if (myCompanies) {
      if (property === DEFAULT_ORDER_BY) {
        if (orderBy !== 'name') {
          dispatch(setOrder('asc'));
          dispatch(setOrderBy('name'));
          dispatch(backendService.getMyCompaniesByParams({ archived: isArchived, page, order: [['name', 'asc']] }));
        } else {
          dispatch(setOrder(newOrder));
          dispatch(backendService.getMyCompaniesByParams({ archived: isArchived, page, order: [[orderBy, newOrder]] }));
        }
      } else if (property === 'projects') {
        if (orderBy !== 'projectCount') {
          dispatch(setOrder('asc'));
          dispatch(setOrderBy('projectCount'));
          dispatch(
            backendService.getMyCompaniesByParams({
              archived: isArchived,
              page,
              order: [
                ['name', 'asc'],
                ['id', 'asc'],
                ['industryVertical', 'asc'],
              ],
            })
          );
        } else {
          dispatch(setOrder(newOrder));
          dispatch(
            backendService.getMyCompaniesByParams({
              archived: isArchived,
              page,
              order: [
                ['name', newOrder],
                ['id', newOrder],
                ['industryVertical', newOrder],
              ],
            })
          );
        }
      } else if (property === 'creator') {
        if (orderBy !== 'createdBy') {
          dispatch(setOrder('asc'));
          dispatch(setOrderBy('createdBy'));
          dispatch(backendService.getMyCompaniesByParams({ archived: isArchived, page, order: [['createdBy', 'asc']] }));
        } else {
          dispatch(setOrder(newOrder));
          dispatch(backendService.getMyCompaniesByParams({ archived: isArchived, page, order: [[orderBy, newOrder]] }));
        }
      } else if (property === 'createdAt') {
        if (orderBy !== 'createdAt') {
          dispatch(setOrder('asc'));
          dispatch(setOrderBy('createdAt'));
          dispatch(backendService.getMyCompaniesByParams({ archived: isArchived, page, order: [['createdAt', 'asc']] }));
        } else {
          dispatch(setOrder(newOrder));
          dispatch(backendService.getMyCompaniesByParams({ archived: isArchived, page, order: [[orderBy, newOrder]] }));
        }
      } else if (property === 'updatedAt') {
        if (orderBy !== 'updatedAt') {
          dispatch(setOrder('asc'));
          dispatch(setOrderBy('updatedAt'));
          dispatch(backendService.getMyCompaniesByParams({ archived: isArchived, page, order: [['updatedAt', 'asc']] }));
        } else {
          dispatch(setOrder(newOrder));
          dispatch(backendService.getMyCompaniesByParams({ archived: isArchived, page, order: [[orderBy, newOrder]] }));
        }
      }
    } else if (!myCompanies) {
      if (property === DEFAULT_ORDER_BY) {
        if (orderBy !== 'name') {
          dispatch(setOrder('asc'));
          dispatch(setOrderBy('name'));
          dispatch(backendService.getCompaniesByParams({ archived: isArchived, page, order: [['name', 'asc']] }));
        } else {
          dispatch(setOrder(newOrder));
          dispatch(backendService.getCompaniesByParams({ archived: isArchived, page, order: [[orderBy, newOrder]] }));
        }
      } else if (property === 'projects') {
        if (orderBy !== 'projectCount') {
          dispatch(setOrder('asc'));
          dispatch(setOrderBy('projectCount'));
          dispatch(
            backendService.getCompaniesByParams({
              archived: isArchived,
              page,
              order: [
                ['name', 'asc'],
                ['id', 'asc'],
                ['industryVertical', 'asc'],
              ],
            })
          );
        } else {
          dispatch(setOrder(newOrder));
          dispatch(
            backendService.getCompaniesByParams({
              archived: isArchived,
              page,
              order: [
                ['name', newOrder],
                ['id', newOrder],
                ['industryVertical', newOrder],
              ],
            })
          );
        }
      } else if (property === 'creator') {
        if (orderBy !== 'createdBy') {
          dispatch(setOrder('asc'));
          dispatch(setOrderBy('createdBy'));
          dispatch(backendService.getCompaniesByParams({ archived: isArchived, page, order: [['createdBy', 'asc']] }));
        } else {
          dispatch(setOrder(newOrder));
          dispatch(backendService.getCompaniesByParams({ archived: isArchived, page, order: [[orderBy, newOrder]] }));
        }
      } else if (property === 'createdAt') {
        if (orderBy !== 'createdAt') {
          dispatch(setOrder('asc'));
          dispatch(setOrderBy('createdAt'));
          dispatch(backendService.getCompaniesByParams({ archived: isArchived, page, order: [['createdAt', 'asc']] }));
        } else {
          dispatch(setOrder(newOrder));
          dispatch(backendService.getCompaniesByParams({ archived: isArchived, page, order: [[orderBy, newOrder]] }));
        }
      } else if (property === 'updatedAt') {
        if (orderBy !== 'updatedAt') {
          dispatch(setOrder('asc'));
          dispatch(setOrderBy('updatedAt'));
          dispatch(backendService.getCompaniesByParams({ archived: isArchived, page, order: [['updatedAt', 'asc']] }));
        } else {
          dispatch(setOrder(newOrder));
          dispatch(backendService.getCompaniesByParams({ archived: isArchived, page, order: [[orderBy, newOrder]] }));
        }
      }
    }
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
          <SortableTableHeader order={order} onRequestSort={handleRequestSort} />
          <TableBody>
            {rowData.map(row => (
              <CustomRow row={row} searchText={searchText} isAdminOrSA={isAdminOrSA} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

CustomTable.propTypes = {
  tableData: PropTypes.shape([]).isRequired,
  searchText: PropTypes.string,
  myCompanies: PropTypes.bool,
  isAdminOrSA: PropTypes.bool,
  isArchived: PropTypes.bool,
};

CustomTable.defaultProps = {
  searchText: '',
  myCompanies: false,
  isAdminOrSA: false,
  isArchived: false,
};

export default CustomTable;
