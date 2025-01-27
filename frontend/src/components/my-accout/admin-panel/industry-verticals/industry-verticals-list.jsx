import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { CircularProgress } from '@mui/material';
import { isEmpty } from '../../../../utils/utils';
import NoResultsPage from '../../../../Pages/no-results-page/no-results-page';
import CustomIndustryVerticalTable from '../../../custom-table/industry-vertical-table/custom-table-industry-vertical';
import { ROW_PER_PAGE, TABS } from '../../../../utils/constants/constants';
import CustomTablePagination from '../../../table-pagination/custom-table-pagination';
import { backendService } from '../../../../services/backend';
import { getIsLoadingIndustryVertical } from '../../../../features/selectors/industryVertical';
import { CircularProgressContainer } from '../../../app/app-styled';
import { getPageNum, getSortOrder, getSortOrderBy } from '../../../../features/selectors/ui';
import { setPage } from '../../../../features/slices/uiSlice';

function IndustryVerticalList({ availableIndustryVerticals, searchText, isArchived, activeTab, numPages }) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const isLoadingIndustryVertical = useSelector(getIsLoadingIndustryVertical);
  const page = useSelector(getPageNum);
  const order = useSelector(getSortOrder);
  const orderBy = useSelector(getSortOrderBy);

  // func
  const handleSetPage = useCallback(
    val => {
      const pageNum = val - 1 < 0 ? 0 : val - 1;
      dispatch(backendService.getIndustryVerticalByParams({ archived: activeTab === TABS.ARCHIVES, page: pageNum, order: [[orderBy, order]] }));
      dispatch(setPage(val - 1));
    },
    [dispatch, activeTab, order, orderBy]
  );

  useEffect(() => {
    if (page > 0 && availableIndustryVerticals?.length === 0) {
      dispatch(setPage(page - 1));
    }
  }, [page, availableIndustryVerticals, dispatch]);

  if (isLoadingIndustryVertical || availableIndustryVerticals === null) {
    return (
      <CircularProgressContainer customPaddingTop="250px">
        <CircularProgress />
      </CircularProgressContainer>
    );
  }

  if (!isLoadingIndustryVertical && availableIndustryVerticals !== null && isEmpty(availableIndustryVerticals)) {
    return (
      <NoResultsPage
        showSearch={!isEmpty(searchText)}
        activeTab={!isArchived ? `${TABS.ACTIVE_INDUSTRY_VERTICAL} Industry Vertical` : `${TABS.ARCHIVES} Industry Vertical`}
      />
    );
  }
  return (
    <div>
      <CustomIndustryVerticalTable tableData={availableIndustryVerticals} searchText={searchText} isArchived={isArchived} maxRowsPerPage={ROW_PER_PAGE} />
      {numPages > 1 && <CustomTablePagination numPages={numPages} setPage={handleSetPage} page={page + 1} />}
    </div>
  );
}

IndustryVerticalList.propTypes = {
  availableIndustryVerticals: PropTypes.shape([]),
  searchText: PropTypes.string,
  isArchived: PropTypes.bool,
  activeTab: PropTypes.string,
  numPages: PropTypes.number,
};

IndustryVerticalList.defaultProps = {
  availableIndustryVerticals: null,
  searchText: '',
  isArchived: false,
  activeTab: '',
  numPages: 1,
};

export default IndustryVerticalList;
