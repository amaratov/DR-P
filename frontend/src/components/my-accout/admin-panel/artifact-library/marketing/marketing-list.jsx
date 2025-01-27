import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { CircularProgress } from '@mui/material';
import { getFilterParams, isEmpty } from '../../../../../utils/utils';
import NoResultsPage from '../../../../../Pages/no-results-page/no-results-page';
import CustomMarketingTable from '../../../../custom-table/marketing-table/custom-table-marketing';
import {
  getAllActiveMarketing,
  getAllArchivedMarketings,
  getIsLoadingMarketingDocs,
  getMarketingSearchResultsFullInfo,
} from '../../../../../features/selectors/marketing';
import CustomTablePagination from '../../../../table-pagination/custom-table-pagination';
import { CircularProgressContainer } from '../../../../app/app-styled';
import { getPageNum, getSelectedFilterFacets, getSortOrder, getSortOrderBy } from '../../../../../features/selectors/ui';
import { backendService } from '../../../../../services/backend';
import { resetMarketingSearch } from '../../../../../features/slices/marketingSlice';
import { ROW_PER_PAGE } from '../../../../../utils/constants/constants';
import { setOrderBy, setPage } from '../../../../../features/slices/uiSlice';

function MarketingList({
  activeTab,
  searchText,
  isArchived,
  ignoreNoResults,
  resetSearchBar,
  panelSelectedValues,
  setPanelSelectedValues,
  clearSelection,
  panelView,
  numPages,
  showArchived,
}) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const availableActiveMarketing = useSelector(getAllActiveMarketing);
  const availableArchivedMarketing = useSelector(getAllArchivedMarketings);
  const marketingSearchResults = useSelector(getMarketingSearchResultsFullInfo);
  const isLoadingMarketings = useSelector(getIsLoadingMarketingDocs);
  const filterFacets = useSelector(getSelectedFilterFacets);
  const page = useSelector(getPageNum);
  const order = useSelector(getSortOrder);
  const orderBy = useSelector(getSortOrderBy);

  // constant
  const availableMarketingResults = showArchived ? availableArchivedMarketing : availableActiveMarketing;
  const availableMarketing = !isEmpty(searchText) ? marketingSearchResults : availableMarketingResults;

  // func
  const handleSetPage = useCallback(
    val => {
      const pageNum = val - 1 < 0 ? 0 : val - 1;
      const params = getFilterParams(filterFacets, false, pageNum);
      if (orderBy === 'name') {
        dispatch(setOrderBy('docName'));
        params.order = [['docName', order]];
      } else {
        params.order = [[orderBy, order]];
      }
      params.docName = !isEmpty(searchText) ? `%${searchText}%` : '';
      dispatch(backendService.getAllActiveMarketings(params));
      dispatch(setPage(val - 1));
    },
    [dispatch, filterFacets, order, orderBy]
  );

  // effect
  // clear search on component init and unmount
  useEffect(() => {
    resetSearchBar();
    clearSelection();
    return () => {
      resetSearchBar();
      clearSelection();
      dispatch(resetMarketingSearch());
    };
  }, [resetSearchBar, clearSelection, dispatch]);

  useEffect(() => {
    const params = getFilterParams(filterFacets, showArchived);
    if (orderBy === 'name') {
      dispatch(setOrderBy('docName'));
      params.order = [['docName', order]];
    } else {
      params.order = [[orderBy, order]];
    }
    params.docName = !isEmpty(searchText) ? `%${searchText}%` : '';
    if (showArchived) dispatch(backendService.getAllArchivedMarketings(params));
    else dispatch(backendService.getAllActiveMarketings(params));
  }, [dispatch, showArchived, filterFacets, orderBy, order]);

  useEffect(() => {
    if (page > 0 && availableMarketing?.length === 0) {
      dispatch(setPage(page - 1));
    }
  }, [page, availableMarketing, dispatch]);

  if (isLoadingMarketings || availableMarketing === null) {
    return (
      <CircularProgressContainer customPaddingTop="250px">
        <CircularProgress />
      </CircularProgressContainer>
    );
  }
  if (!ignoreNoResults && isEmpty(availableMarketing) && !isLoadingMarketings) {
    return <NoResultsPage showSearch={!isEmpty(searchText)} activeTab={activeTab} />;
  }

  return (
    <div>
      <CustomMarketingTable
        tableData={availableMarketing}
        searchText={searchText}
        isArchived={isArchived}
        panelSelectedValues={panelSelectedValues}
        setPanelSelectedValues={setPanelSelectedValues}
        panelView={panelView}
      />
      {numPages > 1 && <CustomTablePagination numPages={numPages} setPage={handleSetPage} page={page + 1} />}
    </div>
  );
}

MarketingList.propTypes = {
  activeTab: PropTypes.string,
  searchText: PropTypes.string,
  isArchived: PropTypes.bool,
  ignoreNoResults: PropTypes.bool,
  resetSearchBar: PropTypes.func,
  panelSelectedValues: PropTypes.arrayOf(PropTypes.shape({})),
  setPanelSelectedValues: PropTypes.func,
  clearSelection: PropTypes.func,
  numPages: PropTypes.number,
  panelView: PropTypes.bool,
  showArchived: PropTypes.bool,
};

MarketingList.defaultProps = {
  activeTab: '',
  searchText: '',
  isArchived: false,
  ignoreNoResults: false,
  resetSearchBar: () => {},
  clearSelection: () => {},
  numPages: 1,
  panelSelectedValues: [],
  setPanelSelectedValues: () => {},
  panelView: false,
  showArchived: false,
};

export default MarketingList;
