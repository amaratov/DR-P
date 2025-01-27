import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import CustomUseCaseRow from './custom-row-use-case';
import SortableUseCaseTableHeader from './sortable-use-case-table-header';
import MoreMenuButton from '../../more-menu-button/more-menu-button';
import { isEmpty } from '../../../utils/utils';
import { getPageNum, getRemoveRow, getSortOrder, getSortOrderBy } from '../../../features/selectors/ui';
import { resetRemoveRow, setOrder, setOrderBy } from '../../../features/slices/uiSlice';
import { getProjects, getDocuments, getHasDocumentsLoaded, getHasProjectsLoaded } from '../../../features/selectors/common';
import { backendService } from '../../../services/backend';

const createUseCaseRowData = (useCaseName, projects, documents, useCaseDetails, id) => {
  return {
    useCaseName,
    projects,
    documents,
    moreMenu: <MoreMenuButton rowDetails={useCaseDetails} isUseCaseDetails hasProject={projects > 0} />,
    id,
  };
};

const createArchivedUseCaseRowData = (useCaseName, documents, useCaseDetails, id) => {
  return {
    useCaseName,
    documents,
    moreMenu: <MoreMenuButton rowDetails={useCaseDetails} isUseCaseDetails />,
    id,
  };
};

const DEFAULT_ORDER_BY = 'useCaseName';

function CustomUseCaseTable({ tableData, searchText, isArchived }) {
  // dispatch
  const dispatch = useDispatch();

  // selectors
  const rowToBeRemoved = useSelector(getRemoveRow);
  const projects = useSelector(getProjects);
  const documents = useSelector(getDocuments);
  const hasDocumentLoaded = useSelector(getHasDocumentsLoaded);
  const hasProjectLoaded = useSelector(getHasProjectsLoaded);
  const page = useSelector(getPageNum);
  const order = useSelector(getSortOrder);
  const orderBy = useSelector(getSortOrderBy);

  // const
  const rowData = isArchived
    ? tableData.map(data => {
        return createArchivedUseCaseRowData(data.name, data?.documentCount || 0, data, data.id);
      })
    : tableData.map(data => {
        return createUseCaseRowData(data.name, data?.projectCount || 0, data?.documentCount || 0, data, data.id);
      });

  // func
  const handleRequestSort = (event, property) => {
    const isAsc = order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    if (property === DEFAULT_ORDER_BY) {
      if (orderBy !== 'name') {
        dispatch(setOrder('asc'));
        dispatch(setOrderBy('name'));
        dispatch(backendService.getUseCasesByParams({ archived: isArchived, page, order: [['name', 'asc']] }));
      } else {
        dispatch(setOrder(newOrder));
        dispatch(backendService.getUseCasesByParams({ archived: isArchived, page, order: [[orderBy, newOrder]] }));
      }
    } else if (property === 'projects') {
      if (orderBy !== 'projectCount') {
        dispatch(setOrder('asc'));
        dispatch(setOrderBy('projectCount'));
        dispatch(backendService.getUseCasesByParams({ archived: isArchived, page, order: [['projectCount', 'asc']] }));
      } else {
        dispatch(setOrder(newOrder));
        dispatch(backendService.getUseCasesByParams({ archived: isArchived, page, order: [[orderBy, newOrder]] }));
      }
    } else if (property === 'documents') {
      if (orderBy !== 'documentCount') {
        dispatch(setOrder('asc'));
        dispatch(setOrderBy('documentCount'));
        dispatch(backendService.getUseCasesByParams({ archived: isArchived, page, order: [['documentCount', 'asc']] }));
      } else {
        dispatch(setOrder(newOrder));
        dispatch(backendService.getUseCasesByParams({ archived: isArchived, page, order: [[orderBy, newOrder]] }));
      }
    }
  };

  useEffect(() => {
    if (!isEmpty(rowData) && !isEmpty(rowToBeRemoved) && !rowData.some(row => row.id === rowToBeRemoved)) {
      dispatch(resetRemoveRow());
    }
    if (!hasProjectLoaded && projects.length === 0) {
      dispatch(backendService.getProjects());
    }
  }, [rowData, rowToBeRemoved, dispatch, projects, documents, hasDocumentLoaded, hasProjectLoaded]);

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
          <SortableUseCaseTableHeader order={order} onRequestSort={handleRequestSort} isArchived={isArchived} />
          <TableBody>
            {rowData.map(row => {
              return <CustomUseCaseRow row={row} searchText={searchText} key={row.id} isArchived={isArchived} />;
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

CustomUseCaseTable.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  searchText: PropTypes.string,
};

CustomUseCaseTable.defaultProps = {
  searchText: '',
};

export default CustomUseCaseTable;
