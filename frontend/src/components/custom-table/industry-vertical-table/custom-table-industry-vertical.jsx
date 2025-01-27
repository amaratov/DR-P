import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import CustomIndustryVerticalRow from './custom-row-industry-vertical';
import SortableIndustryVerticalTableHeader from './sortable-industry-vertical-table-header';
import MoreMenuButton from '../../more-menu-button/more-menu-button';
import { isEmpty } from '../../../utils/utils';
import { getPageNum, getRemoveRow, getSortOrder, getSortOrderBy } from '../../../features/selectors/ui';
import { resetRemoveRow, setOrder, setOrderBy } from '../../../features/slices/uiSlice';
import { getCompanies, getDocuments } from '../../../features/selectors/common';
import { backendService } from '../../../services/backend';

const createIndustryVerticalRowData = (industryVerticalName, companiesArr, documents, industryVerticalDetails, id) => {
  return {
    industryVerticalName,
    companies: companiesArr,
    documents,
    moreMenu: <MoreMenuButton rowDetails={industryVerticalDetails} isIndustryVerticalDetails hasCompany={companiesArr > 0} />,
    id,
  };
};

const createArchivedIndustryVerticalRowData = (industryVerticalName, documents, industryVerticalDetails, id) => {
  return {
    industryVerticalName,
    documents,
    moreMenu: <MoreMenuButton rowDetails={industryVerticalDetails} isIndustryVerticalDetails />,
    id,
  };
};

const DEFAULT_ORDER_BY = 'industryVerticalName';

function CustomIndustryVerticalTable({ tableData, searchText, isArchived }) {
  // dispatch
  const dispatch = useDispatch();

  // selectors
  const rowToBeRemoved = useSelector(getRemoveRow);
  const companies = useSelector(getCompanies);
  const documents = useSelector(getDocuments);
  const page = useSelector(getPageNum);
  const order = useSelector(getSortOrder);
  const orderBy = useSelector(getSortOrderBy);

  // state
  const [checkedDocuments, setCheckedDocuments] = useState(false);

  // const
  const rowData = isArchived
    ? tableData.map(data => {
        return createArchivedIndustryVerticalRowData(data.name, data?.documentCount || 0, data, data.id);
      })
    : tableData.map(data => {
        return createIndustryVerticalRowData(data.name, data?.companyCount || 0, data?.documentCount || 0, data, data.id);
      });

  // func
  const handleRequestSort = (event, property) => {
    const isAsc = order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    if (property === DEFAULT_ORDER_BY) {
      if (orderBy !== 'name') {
        dispatch(setOrder('asc'));
        dispatch(setOrderBy('name'));
        dispatch(backendService.getIndustryVerticalByParams({ archived: isArchived, page, order: [['name', 'asc']] }));
      } else {
        dispatch(setOrder(newOrder));
        dispatch(backendService.getIndustryVerticalByParams({ archived: isArchived, page, order: [[orderBy, newOrder]] }));
      }
    } else if (property === 'companies') {
      if (orderBy !== 'companyCount') {
        dispatch(setOrder('asc'));
        dispatch(setOrderBy('companyCount'));
        dispatch(backendService.getIndustryVerticalByParams({ archived: isArchived, page, order: [['companyCount', 'asc']] }));
      } else {
        dispatch(setOrder(newOrder));
        dispatch(backendService.getIndustryVerticalByParams({ archived: isArchived, page, order: [[orderBy, newOrder]] }));
      }
    } else if (property === 'documents') {
      if (orderBy !== 'documentCount') {
        dispatch(setOrder('asc'));
        dispatch(setOrderBy('documentCount'));
        dispatch(backendService.getIndustryVerticalByParams({ archived: isArchived, page, order: [['documentCount', 'asc']] }));
      } else {
        dispatch(setOrder(newOrder));
        dispatch(backendService.getIndustryVerticalByParams({ archived: isArchived, page, order: [[orderBy, newOrder]] }));
      }
    }
  };

  useEffect(() => {
    if (!isEmpty(rowData) && !isEmpty(rowToBeRemoved) && !rowData.some(row => row.id === rowToBeRemoved)) {
      dispatch(resetRemoveRow());
    }
    if (companies.length === 0) {
      dispatch(backendService.getAllCompanies());
    }
  }, [rowData, rowToBeRemoved, dispatch, companies, documents, checkedDocuments, setCheckedDocuments]);

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
          <SortableIndustryVerticalTableHeader order={order} onRequestSort={handleRequestSort} isArchived={isArchived} />
          <TableBody>
            {rowData.map(row => {
              return <CustomIndustryVerticalRow row={row} searchText={searchText} key={row.id} isArchived={isArchived} />;
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

CustomIndustryVerticalTable.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  searchText: PropTypes.string,
};

CustomIndustryVerticalTable.defaultProps = {
  searchText: '',
};

export default CustomIndustryVerticalTable;
