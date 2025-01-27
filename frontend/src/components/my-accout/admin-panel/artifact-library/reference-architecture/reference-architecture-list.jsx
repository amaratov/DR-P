import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { CircularProgress } from '@mui/material';
import { getFilterParams, isEmpty } from '../../../../../utils/utils';
import NoResultsPage from '../../../../../Pages/no-results-page/no-results-page';
import ReferenceArchitectureTable from '../../../../custom-table/reference-architecture-table/reference-architecture-table';
import {
  getAllActiveReferenceDocFullInfo,
  getAllArchivedReferenceDoc,
  getIsLoadingReferenceDoc,
  getReferenceDocSearchResultsFullInfo,
} from '../../../../../features/selectors/referenceArchitecture';
import { backendService } from '../../../../../services/backend';
import { resetReferenceDocSearch } from '../../../../../features/slices/referenceArchitectureSlice';
import { CircularProgressContainer } from '../../../../app/app-styled';
import CustomTablePagination from '../../../../table-pagination/custom-table-pagination';
import { getPageNum, getSelectedFilterFacets, getSortOrder, getSortOrderBy } from '../../../../../features/selectors/ui';
import { TABS } from '../../../../../utils/constants/constants';
import { setPage } from '../../../../../features/slices/uiSlice';

function ReferenceArchitectureList({ activeTab, isArchived, ignoreNoResults, showArchived, searchText, resetSearchBar, numPages }) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const availableActiveRefDoc = useSelector(getAllActiveReferenceDocFullInfo);
  const availableArchivedRefDoc = useSelector(getAllArchivedReferenceDoc);
  const referenceDocSearchResults = useSelector(getReferenceDocSearchResultsFullInfo);
  const isLoadingReferenceDocs = useSelector(getIsLoadingReferenceDoc);
  const filterFacets = useSelector(getSelectedFilterFacets);
  const page = useSelector(getPageNum);
  const order = useSelector(getSortOrder);
  const orderBy = useSelector(getSortOrderBy);

  // constant
  const referenceDocResults = showArchived ? availableArchivedRefDoc : availableActiveRefDoc;
  const availableRefDoc = !isEmpty(searchText) ? referenceDocSearchResults : referenceDocResults;

  // func
  const handleSetPage = useCallback(
    val => {
      const pageNum = val - 1 < 0 ? 0 : val - 1;
      const params = getFilterParams(filterFacets, activeTab === TABS.ARCHIVES, pageNum);
      params.order = [[orderBy, order]];
      dispatch(backendService.getReferenceArchitectureByParams(params));
      dispatch(setPage(val - 1));
    },
    [dispatch, filterFacets, orderBy, order]
  );

  // effect
  // clear search on component init and unmount
  useEffect(() => {
    resetSearchBar();
    return () => {
      resetSearchBar();
      dispatch(resetReferenceDocSearch());
    };
  }, [resetSearchBar, dispatch]);

  useEffect(() => {
    const params = getFilterParams(filterFacets, showArchived);
    params.order = [[orderBy, order]];
    dispatch(backendService.getReferenceArchitectureByParams(params));
  }, [dispatch, showArchived, filterFacets]);

  useEffect(() => {
    if (page > 0 && availableRefDoc?.length === 0) {
      dispatch(setPage(page - 1));
    }
  }, [page, availableRefDoc, dispatch]);

  if (isLoadingReferenceDocs || availableRefDoc === null) {
    return (
      <CircularProgressContainer customPaddingTop="250px">
        <CircularProgress />
      </CircularProgressContainer>
    );
  }
  if (!ignoreNoResults && isEmpty(availableRefDoc) && !isLoadingReferenceDocs) {
    return <NoResultsPage activeTab={activeTab} />;
  }

  return (
    <div>
      <ReferenceArchitectureTable tableData={availableRefDoc} searchText="" isArchived={isArchived} />
      {numPages > 1 && <CustomTablePagination numPages={numPages} setPage={handleSetPage} page={page + 1} />}
    </div>
  );
}

ReferenceArchitectureList.propTypes = {
  activeTab: PropTypes.string,
  searchText: PropTypes.string,
  isArchived: PropTypes.bool,
  ignoreNoResults: PropTypes.bool,
  showArchived: PropTypes.bool,
  resetSearchBar: PropTypes.func,
  numPages: PropTypes.number,
};

ReferenceArchitectureList.defaultProps = {
  activeTab: '',
  searchText: '',
  isArchived: false,
  ignoreNoResults: false,
  showArchived: false,
  resetSearchBar: () => {},
  numPages: 1,
};

export default ReferenceArchitectureList;
