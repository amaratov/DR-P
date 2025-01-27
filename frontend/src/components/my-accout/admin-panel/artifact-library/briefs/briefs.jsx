import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from '../../../../../utils/utils';
import NoResultsPage from '../../../../../Pages/no-results-page/no-results-page';
import BriefsTable from '../../../../custom-table/briefs-table/briefs-table';
import { backendService } from '../../../../../services/backend';
import CustomTablePagination from '../../../../table-pagination/custom-table-pagination';
import { ROW_PER_PAGE } from '../../../../../utils/constants/constants';
import {
  getAdditionalProjectBriefs,
  getAdditionalProjects,
  getAllPublishedMarketingFromBriefs,
  getAssociatedMarketingRaw,
  getPageNum,
} from '../../../../../features/selectors/ui';
import {
  setAdditionalProjectBriefs,
  setAdditionalProjects,
  setAllPublishedMarketing,
  setAssociatedMarketingRaw,
  setPage,
} from '../../../../../features/slices/uiSlice';

function Briefs({ activeTab, isArchived, ignoreNoResults, searchText, resetSearchBar, resetFilters }) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const page = useSelector(getPageNum);
  const additionalProjects = useSelector(getAdditionalProjects);
  const additionalProjectBriefs = useSelector(getAdditionalProjectBriefs);
  const allPublishedMarketing = useSelector(getAllPublishedMarketingFromBriefs);
  const associatedMarketingRaw = useSelector(getAssociatedMarketingRaw);

  // memo
  const rowData = useMemo(() => {
    return allPublishedMarketing.length > 0
      ? allPublishedMarketing?.map(publishedMarketing => {
          const project = additionalProjects.filter(y => y?.id === publishedMarketing.projectId);
          const marketingRaw = associatedMarketingRaw.filter(x => x?.id === publishedMarketing.id);

          if (marketingRaw.length > 0) {
            return {
              id: marketingRaw[0].id,
              projectId: publishedMarketing.projectId,
              project: project[0]?.title,
              key: `${publishedMarketing.key}${publishedMarketing.projectId}`,
              addedDate: publishedMarketing.addedDate,
              addedBy: publishedMarketing.addedBy,
              archived: marketingRaw[0].archived,
              documentName: marketingRaw[0].docName,
              documentType: marketingRaw[0].docType,
              modifiedBy: `${publishedMarketing.addedBy.firstName} ${publishedMarketing.addedBy.lastName}`,
              lastUpdated: marketingRaw[0].updatedAt,
              customer: project[0]?.company?.name,
            };
          }
          return {
            id: publishedMarketing.id,
            key: `${publishedMarketing.key}${publishedMarketing.projectId}`,
            archived: false,
            documentName: 'undefined',
            documentType: 'undefined',
            lastUpdated: publishedMarketing.addedDate,
            projectId: publishedMarketing.projectId,
            project: project[0]?.title,
            addedDate: publishedMarketing.addedDate,
            addedBy: publishedMarketing.addedBy,
            modifiedBy: '',
            customer: '',
          };
        })
      : [];
  }, [additionalProjects, additionalProjectBriefs, associatedMarketingRaw]);

  // constant
  const maxRowsPerPage = ROW_PER_PAGE;
  const availableBriefs = !isEmpty(searchText) ? rowData.filter(data => data?.documentName.toLowerCase().includes(searchText.toLowerCase())) : rowData;

  // state
  const isLoadingReferenceDocs = false;

  // func
  const handleSetPage = useCallback(
    val => {
      dispatch(setPage(val - 1));
    },
    [dispatch]
  );

  // effect
  // clear search on component init and unmount
  useEffect(() => {
    resetSearchBar();
    resetFilters();
    return () => {
      resetSearchBar();
      resetFilters();
    };
  }, [resetSearchBar, resetFilters]);

  useEffect(async () => {
    // project briefcase set
    const initialProjectBriefLoad = await dispatch(backendService.getAllProjectBriefcase());
    let projectBriefValuesToSet = initialProjectBriefLoad?.payload?.briefcases || [];
    if (initialProjectBriefLoad?.payload?.numPages > 1) {
      /* eslint-disable no-await-in-loop */
      for (let a = 1; a < initialProjectBriefLoad?.payload?.numPages; a += 1) {
        const secondaryProjectBriefLoad = await dispatch(backendService.getProjectBriefcaseByParams({ page: a }));
        const arrayValue = secondaryProjectBriefLoad?.payload?.briefcases || [];
        projectBriefValuesToSet = [...projectBriefValuesToSet, ...arrayValue];
      }
    }
    await dispatch(setAdditionalProjectBriefs([...projectBriefValuesToSet]));

    // published marketing from full briefcases set
    const allPublishedMarketingFromBriefs = projectBriefValuesToSet
      .map((projectBriefcase, i) => {
        if (projectBriefcase?.publishedMarketing?.length > 0) {
          return projectBriefcase?.publishedMarketing.map((publishedMarketing, j) => {
            return {
              ...publishedMarketing,
              projectId: projectBriefcase?.projectId,
              key: `${i}${j}`,
            };
          });
        }
        return [...projectBriefcase.publishedMarketing];
      })
      .flat();
    await dispatch(setAllPublishedMarketing(allPublishedMarketingFromBriefs));

    // associated marketing raw set
    if (allPublishedMarketingFromBriefs?.length > 0) {
      const chunkSize = 10;
      let rawValuesToSet = [];
      for (let i = 0; i < allPublishedMarketingFromBriefs.length; i += chunkSize) {
        const chunk = allPublishedMarketingFromBriefs.slice(i, i + chunkSize);
        const marketingIds = Object.values(chunk)?.map(marketing => marketing.id);
        const initialRaw = await dispatch(backendService.findMarketingsByIds(marketingIds));
        const arrayValue = initialRaw?.payload?.documents || [];
        rawValuesToSet = [...rawValuesToSet, ...arrayValue];
      }
      await dispatch(setAssociatedMarketingRaw(rawValuesToSet));
    }

    // project set
    const initialProjectLoad = await dispatch(backendService.getProjects());
    let projectValuestoSet = initialProjectLoad?.payload?.projects || [];
    if (initialProjectLoad?.payload?.numPages > 1) {
      /* eslint-disable no-await-in-loop */
      for (let pg = 1; pg < initialProjectLoad?.payload?.numPages; pg += 1) {
        const secondaryProjectLoad = await dispatch(backendService.getProjectsByParams({ page: pg }));
        const arrayValue = secondaryProjectLoad?.payload?.projects || [];
        projectValuestoSet = [...projectValuestoSet, ...arrayValue];
      }
    }
    await dispatch(setAdditionalProjects([...projectValuestoSet]));
  }, [dispatch]);

  if (!ignoreNoResults && isEmpty(availableBriefs) && !isLoadingReferenceDocs) {
    return <NoResultsPage activeTab={activeTab} />;
  }
  return (
    <div>
      <BriefsTable tableData={availableBriefs} searchText={searchText} isArchived={isArchived} page={page} maxRowsPerPage={maxRowsPerPage} />
      {availableBriefs.length / maxRowsPerPage > 1 && (
        <CustomTablePagination numPages={Math.ceil(availableBriefs.length / maxRowsPerPage)} setPage={handleSetPage} page={page + 1} />
      )}
    </div>
  );
}

Briefs.proptype = {
  activeTab: PropTypes.string,
  searchText: PropTypes.string,
  isArchived: PropTypes.bool,
  ignoreNoResults: PropTypes.bool,
  resetSearchBar: PropTypes.func,
  resetFilters: PropTypes.func,
};

Briefs.defaultProps = {
  activeTab: '',
  searchText: '',
  isArchived: false,
  ignoreNoResults: false,
  resetSearchBar: () => {},
  resetFilters: () => {},
};

export default Briefs;
