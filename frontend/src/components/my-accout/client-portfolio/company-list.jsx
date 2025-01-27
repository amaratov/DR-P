import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { isEmpty } from '../../../utils/utils';
import NoResultsPage from '../../../Pages/no-results-page/no-results-page';
import CustomTable from '../../custom-table/custom-table';
import CompanyDetails from '../company-details/company-details';
import AddProjectPanel from '../add-project/add-project-panel';
import ProjectDetails from '../project-details/project-details';
import { TABS } from '../../../utils/constants/constants';
import CustomTablePagination from '../../table-pagination/custom-table-pagination';
import { backendService } from '../../../services/backend';
import { getPageNum, getSortOrder, getSortOrderBy } from '../../../features/selectors/ui';
import { setPage } from '../../../features/slices/uiSlice';

function CompanyList({ availableCompanies, searchText, isLoading, activeTab, myCompanies, isAdminOrSA, numPages, currentPage }) {
  //dispatch
  const dispatch = useDispatch();

  const page = useSelector(getPageNum);
  const order = useSelector(getSortOrder);
  const orderBy = useSelector(getSortOrderBy);

  // func
  const handleSetPage = useCallback(
    val => {
      const pageNum = val - 1 < 0 ? 0 : val - 1;
      const sortOrderBy =
        orderBy === 'projectCount'
          ? [
              ['name', order],
              ['id', order],
              ['industryVertical', order],
            ]
          : [[orderBy, order]];
      if (activeTab === TABS.ALL_COMPANIES) {
        dispatch(backendService.getCompaniesByParams({ archived: false, page: pageNum, order: sortOrderBy }));
      }
      if (activeTab === TABS.ARCHIVED_COMPANIES) {
        dispatch(backendService.getCompaniesByParams({ archived: true, page: pageNum, order: sortOrderBy }));
      }
      if (activeTab === TABS.MY_COMPANIES) {
        dispatch(backendService.getMyCompaniesByParams({ archived: false, page: pageNum, order: sortOrderBy }));
      }
      dispatch(setPage(val - 1));
    },
    [dispatch, activeTab, order, orderBy]
  );

  useEffect(() => {
    if (page > 0 && availableCompanies?.length === 0) {
      dispatch(setPage(page - 1));
      setTimeout(() => {
        const sortOrderBy =
          orderBy === 'projectCount'
            ? [
                ['name', order],
                ['id', order],
                ['industryVertical', order],
              ]
            : [[orderBy, order]];
        if (activeTab === TABS.ALL_COMPANIES) {
          dispatch(backendService.getCompaniesByParams({ archived: false, page: page - 1, order: sortOrderBy }));
        }
        if (activeTab === TABS.ARCHIVED_COMPANIES) {
          dispatch(backendService.getCompaniesByParams({ archived: true, page: page - 1, order: sortOrderBy }));
        }
        if (activeTab === TABS.MY_COMPANIES) {
          dispatch(backendService.getMyCompaniesByParams({ archived: false, page: page - 1, order: sortOrderBy }));
        }
      }, 300);
    }
  }, [page, availableCompanies, dispatch]);

  if (isEmpty(availableCompanies) && !isLoading) {
    return <NoResultsPage showSearch={!isEmpty(searchText)} activeTab={activeTab} />;
  }
  if (isLoading || availableCompanies === null) {
    return <CircularProgress />;
  }

  return (
    <>
      <CustomTable
        tableData={availableCompanies}
        searchText={searchText}
        myCompanies={myCompanies}
        isAdminOrSA={isAdminOrSA}
        isArchived={activeTab === TABS.ARCHIVED_COMPANIES}
      />
      {numPages > 1 && <CustomTablePagination setPage={handleSetPage} numPages={numPages} page={page + 1} />}
      <CompanyDetails isAdminOrSA={isAdminOrSA} />
      <AddProjectPanel />
      <ProjectDetails isAdminOrSA={isAdminOrSA} />
    </>
  );
}

CompanyList.propTypes = {
  availableCompanies: PropTypes.shape({}),
  activeTab: PropTypes.string,
  searchText: PropTypes.string,
  isLoading: PropTypes.bool,
  myCompanies: PropTypes.bool,
  isAdminOrSA: PropTypes.bool,
  numPages: PropTypes.number,
  currentPage: PropTypes.number,
};

CompanyList.defaultProps = {
  availableCompanies: {},
  activeTab: '',
  searchText: '',
  isLoading: false,
  myCompanies: false,
  isAdminOrSA: false,
  numPages: 0,
  currentPage: 0,
};

export default CompanyList;
