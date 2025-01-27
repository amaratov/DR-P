import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { CircularProgress } from '@mui/material';
import { isEmpty } from '../../../../utils/utils';
import NoResultsPage from '../../../../Pages/no-results-page/no-results-page';
import CustomUseCaseTable from '../../../custom-table/use-case-table/custom-table-use-case';
import { ROW_PER_PAGE, TABS } from '../../../../utils/constants/constants';
import CustomTablePagination from '../../../table-pagination/custom-table-pagination';
import { backendService } from '../../../../services/backend';
import { getIsLoadingUseCases } from '../../../../features/selectors/useCase';
import { CircularProgressContainer } from '../../../app/app-styled';
import { getPageNum, getSortOrder, getSortOrderBy } from '../../../../features/selectors/ui';
import { setPage } from '../../../../features/slices/uiSlice';

function UseCaseList({ availableUseCases, searchText, isArchived, activeTab, numPages }) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const isLoadingUseCases = useSelector(getIsLoadingUseCases);
  const page = useSelector(getPageNum);
  const order = useSelector(getSortOrder);
  const orderBy = useSelector(getSortOrderBy);

  // func
  const handleSetPage = useCallback(
    val => {
      const pageNum = val - 1 < 0 ? 0 : val - 1;
      dispatch(backendService.getUseCasesByParams({ archived: activeTab === TABS.ARCHIVES, page: pageNum, order: [[orderBy, order]] }));
      dispatch(setPage(val - 1));
    },
    [dispatch, activeTab, order, orderBy]
  );

  useEffect(() => {
    if (page > 0 && availableUseCases?.length === 0) {
      dispatch(setPage(page - 1));
    }
  }, [page, availableUseCases, dispatch]);

  if (isLoadingUseCases || availableUseCases === null) {
    return (
      <CircularProgressContainer customPaddingTop="250px">
        <CircularProgress />
      </CircularProgressContainer>
    );
  }

  if (!isLoadingUseCases && isEmpty(availableUseCases)) {
    return <NoResultsPage showSearch={!isEmpty(searchText)} activeTab={!isArchived ? `${TABS.ACTIVE_USE_CASE} Use Case` : `${TABS.ARCHIVES} Use Case`} />;
  }
  return (
    <div>
      <CustomUseCaseTable tableData={availableUseCases} searchText={searchText} isArchived={isArchived} maxRowsPerPage={ROW_PER_PAGE} />
      {numPages > 1 && <CustomTablePagination numPages={numPages} setPage={handleSetPage} page={page + 1} />}
    </div>
  );
}

UseCaseList.propTypes = {
  availableUseCases: PropTypes.shape([]),
  searchText: PropTypes.string,
  isArchived: PropTypes.bool,
  activeTab: PropTypes.string,
  numPages: PropTypes.number,
};

UseCaseList.defaultProps = {
  availableUseCases: [],
  searchText: '',
  isArchived: false,
  activeTab: '',
  numPages: 1,
};

export default UseCaseList;
