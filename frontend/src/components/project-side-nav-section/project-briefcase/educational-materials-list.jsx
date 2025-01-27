import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { getMarketingByFilterValue, isEmpty } from '../../../utils/utils';
import NoResultsPage from '../../../Pages/no-results-page/no-results-page';
import { AllRoles, ROW_PER_PAGE, TABS } from '../../../utils/constants/constants';
import CustomTablePagination from '../../table-pagination/custom-table-pagination';
import CustomEducationalMaterialsTable from '../../custom-table/educational-materials-table/custom-table-educational-materials';
import { backendService } from '../../../services/backend';
import {
  getPageNumEducationalMaterials,
  getSelectedFilterFacets,
  getSelectedProjectDetails,
  getSortOrderProjectDocuments,
  getSortOrderProjectDocumentsBy,
} from '../../../features/selectors/ui';
import { getAssociatedMarketingDetail, getCurrentProjectBriefcase } from '../../../features/selectors/projectBriefcase';
import { getWhoAmI } from '../../../features/selectors';
import { ProjectBriefCaseTableTitle } from '../project-side-nav-section-main-styled';
import { setEducationalMaterialsPage, setProjectDocumentsPage } from '../../../features/slices/uiSlice';

function EducationalMaterialsList({ handleRemoveMarketing }) {
  // dispatch
  const dispatch = useDispatch();

  // params
  const routeParams = useParams();

  // selector
  const whoami = useSelector(getWhoAmI);
  const currentProjectInfo = useSelector(getSelectedProjectDetails);
  const currentProjectBriefCase = useSelector(getCurrentProjectBriefcase);
  const associatedMarketingRaw = useSelector(getAssociatedMarketingDetail);
  const page = useSelector(getPageNumEducationalMaterials);
  const order = useSelector(getSortOrderProjectDocuments);
  const orderBy = useSelector(getSortOrderProjectDocumentsBy);
  const filterFacets = useSelector(getSelectedFilterFacets);

  // memo
  const associatedMarketingFiltered = useMemo(() => {
    if (
      filterFacets?.hub?.length === 0 &&
      filterFacets?.industryVertical?.length === 0 &&
      filterFacets?.otherTags?.length === 0 &&
      filterFacets?.partners?.length === 0 &&
      filterFacets?.technologies?.length === 0 &&
      filterFacets?.types?.length === 0 &&
      filterFacets?.useCase?.length === 0
    ) {
      return associatedMarketingRaw;
    }

    let finalMarketingValue = [];
    if (filterFacets?.hub?.length > 0) {
      finalMarketingValue = getMarketingByFilterValue('hub', filterFacets, associatedMarketingRaw, finalMarketingValue, 'name');
    }
    if (filterFacets?.industryVertical?.length > 0) {
      finalMarketingValue = getMarketingByFilterValue('industryVertical', filterFacets, associatedMarketingRaw, finalMarketingValue, 'id');
    }
    if (filterFacets?.otherTags?.length > 0) {
      finalMarketingValue = getMarketingByFilterValue('otherTags', filterFacets, associatedMarketingRaw, finalMarketingValue, 'id');
    }
    if (filterFacets?.partners?.length > 0) {
      finalMarketingValue = getMarketingByFilterValue('partners', filterFacets, associatedMarketingRaw, finalMarketingValue, 'name');
    }
    if (filterFacets?.technologies?.length > 0) {
      finalMarketingValue = getMarketingByFilterValue('technologies', filterFacets, associatedMarketingRaw, finalMarketingValue, 'name');
    }
    if (filterFacets?.types?.length > 0) {
      finalMarketingValue = getMarketingByFilterValue('types', filterFacets, associatedMarketingRaw, finalMarketingValue, 'name');
    }
    if (filterFacets?.useCase?.length > 0) {
      finalMarketingValue = getMarketingByFilterValue('useCase', filterFacets, associatedMarketingRaw, finalMarketingValue, 'id');
    }
    return finalMarketingValue;
  }, [filterFacets, associatedMarketingRaw]);

  // constant
  const maxRowsPerPage = 10;
  const useRole = whoami?.role?.name?.toLowerCase() || '';
  const hasPermission =
    useRole === AllRoles.ADMIN || useRole === AllRoles.SOLUTIONS_ARCHITECT || useRole === AllRoles.CUSTOMER || useRole === AllRoles.MARKETING;
  const canViewAllMarketing = useRole === AllRoles.ADMIN || useRole === AllRoles.SOLUTIONS_ARCHITECT || useRole === AllRoles.MARKETING;
  const canViewPublishedMarketingOnly = useRole === AllRoles.CUSTOMER;
  const associatedMarketingInfo = canViewPublishedMarketingOnly ? currentProjectBriefCase?.publishedMarketing : currentProjectBriefCase?.associatedMarketing;
  const numPages = Math.ceil(associatedMarketingFiltered.length / maxRowsPerPage);

  // func
  const handleDownloadDocForCustomer = useCallback(
    rowDetails => {
      dispatch(backendService.downloadCustomerDocument(rowDetails));
    },
    [dispatch]
  );

  const handleSetPage = useCallback(
    val => {
      dispatch(setEducationalMaterialsPage(val - 1));
    },
    [dispatch]
  );

  // effect
  useEffect(() => {
    dispatch(backendService.whoami());
  }, [dispatch]);

  useEffect(() => {
    if (currentProjectInfo?.id || routeParams?.id) {
      const params = {
        projectId: currentProjectInfo?.id || routeParams?.id || 'unknown',
      };
      dispatch(backendService.getProjectBriefcaseByProjectId(params));
    }
  }, [dispatch]);

  useEffect(() => {
    const params = { order: [[orderBy, order]] };
    if (canViewAllMarketing && currentProjectBriefCase?.associatedMarketing?.length > 0) {
      const marketingIds = Object.values(currentProjectBriefCase.associatedMarketing)?.map(marketing => marketing.id);
      dispatch(backendService.findMarketingsByIdsAndParams(marketingIds, params));
    }
    if (canViewPublishedMarketingOnly && currentProjectBriefCase?.publishedMarketing?.length > 0) {
      const marketingIds = Object.values(currentProjectBriefCase?.publishedMarketing)?.map(marketing => marketing.id);
      dispatch(backendService.findMarketingsByIdsAndParams(marketingIds, params));
    }
  }, [dispatch, currentProjectBriefCase, canViewAllMarketing, canViewPublishedMarketingOnly, orderBy, order]);

  if (!hasPermission) {
    return null;
  }

  if (
    (canViewAllMarketing && isEmpty(currentProjectBriefCase?.associatedMarketing)) ||
    (canViewPublishedMarketingOnly && isEmpty(currentProjectBriefCase?.publishedMarketing))
  ) {
    return <NoResultsPage activeTab={TABS.PROJECT_BRIEFCASE} />;
  }

  return (
    <div>
      {/* {canViewPublishedMarketingOnly && <ProjectBriefCaseTableTitle>Marketing Materials</ProjectBriefCaseTableTitle>} */}
      <CustomEducationalMaterialsTable
        tableData={associatedMarketingFiltered}
        associatedMarketingInfo={associatedMarketingInfo || []}
        canViewPublishedMarketingOnly={canViewPublishedMarketingOnly}
        handleRemoveMarketing={handleRemoveMarketing}
        handleDownloadDocForCustomer={handleDownloadDocForCustomer}
        maxRowsPerPage={maxRowsPerPage}
      />
      {numPages > 1 && <CustomTablePagination numPages={numPages} setPage={handleSetPage} page={page + 1} />}
    </div>
  );
}

EducationalMaterialsList.propTypes = {
  handleRemoveMarketing: PropTypes.func,
};

EducationalMaterialsList.defaultProps = {
  handleRemoveMarketing: () => {},
};

export default EducationalMaterialsList;
