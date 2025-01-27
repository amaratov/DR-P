import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { isEmpty } from '../../../utils/utils';
import NoResultsPage from '../../../Pages/no-results-page/no-results-page';
import { AllRoles, TABS } from '../../../utils/constants/constants';
import CustomTablePagination from '../../table-pagination/custom-table-pagination';
import CustomSolutionBriefsProjectBriefcaseTable from '../../custom-table/solution-briefs-project-briefcase-table/custom-table-solution-briefs-project-briefcase';
import { backendService } from '../../../services/backend';
import { getAdditionalSolutionBriefs, getPageNumSolutionBriefs, getSelectedProjectDetails } from '../../../features/selectors/ui';
import { getCurrentProjectBriefcase } from '../../../features/selectors/projectBriefcase';
import { getWhoAmI } from '../../../features/selectors';
import { setAdditionalSolBriefs, setSolutionBriefsPage } from '../../../features/slices/uiSlice';

function SolutionBriefsProjectBriefcaseList() {
  // dispatch
  const dispatch = useDispatch();

  // params
  const routeParams = useParams();

  // selector
  const whoami = useSelector(getWhoAmI);
  const currentSolutionBrief = useSelector(getAdditionalSolutionBriefs);
  const currentProjectInfo = useSelector(getSelectedProjectDetails);
  const currentProjectBriefCase = useSelector(getCurrentProjectBriefcase);
  const page = useSelector(getPageNumSolutionBriefs);

  // constant
  const maxRowsPerPage = 10;
  const useRole = whoami?.role?.name?.toLowerCase() || '';
  const hasPermission = useRole === AllRoles.ADMIN || useRole === AllRoles.SOLUTIONS_ARCHITECT || useRole === AllRoles.CUSTOMER;
  const canViewAllMarketing = useRole === AllRoles.ADMIN || useRole === AllRoles.SOLUTIONS_ARCHITECT;
  const isCustomer = useRole === AllRoles.CUSTOMER;
  const publishedSolutionBriefs = currentSolutionBrief.filter(x => x?.publishedBy !== null);
  const allowedSolutionBriefs = isCustomer ? publishedSolutionBriefs.filter(x => x?.publishedDate !== null) : publishedSolutionBriefs;
  const numPages = Math.ceil(allowedSolutionBriefs.length / maxRowsPerPage);

  // func
  const handleDownloadDocForCustomer = useCallback(
    rowDetails => {
      dispatch(backendService.downloadSolutionBriefcase(rowDetails));
    },
    [dispatch]
  );

  const handleSetPage = useCallback(
    val => {
      dispatch(setSolutionBriefsPage(val - 1));
    },
    [dispatch]
  );

  const handleAllSolutionBriefRetrieval = useCallback(
    async params => {
      try {
        const initialValues = await dispatch(backendService.getSolutionBriefcaseByProjectId(params));
        let solutionBriefValuesToRetrieve = initialValues?.payload?.solutionBriefcases || [];
        if (initialValues?.payload?.numPages > 1) {
          /* eslint-disable no-await-in-loop */
          for (let x = 1; x < initialValues?.payload?.numPages; x += 1) {
            params.page = x;
            const additionalValues = await dispatch(backendService.getSolutionBriefcaseByProjectId(params));
            const arrayValue = additionalValues?.payload?.solutionBriefcases || [];
            solutionBriefValuesToRetrieve = [...solutionBriefValuesToRetrieve, ...arrayValue];
          }
        }
        await dispatch(setAdditionalSolBriefs([...solutionBriefValuesToRetrieve]));
      } catch (e) {
        console.error(e);
      }
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
      handleAllSolutionBriefRetrieval(params);
    }
  }, [dispatch, handleAllSolutionBriefRetrieval, currentProjectInfo, routeParams]);

  if (!hasPermission) {
    return null;
  }

  if ((canViewAllMarketing && isEmpty(currentProjectBriefCase?.associatedMarketing)) || (isCustomer && isEmpty(currentProjectBriefCase?.publishedMarketing))) {
    return <NoResultsPage activeTab={TABS.PROJECT_BRIEFCASE} />;
  }

  return (
    <div>
      {/* {isCustomer && <ProjectBriefCaseTableTitle>Marketing Materials</ProjectBriefCaseTableTitle>} */}
      <CustomSolutionBriefsProjectBriefcaseTable
        tableData={allowedSolutionBriefs}
        canViewPublishedSolutionBriefOnly={isCustomer}
        handleDownloadDocForCustomer={handleDownloadDocForCustomer}
        maxRowsPerPage={maxRowsPerPage}
      />
      {numPages > 1 && <CustomTablePagination numPages={numPages} setPage={handleSetPage} page={page + 1} />}
    </div>
  );
}

SolutionBriefsProjectBriefcaseList.propTypes = {};

SolutionBriefsProjectBriefcaseList.defaultProps = {};

export default SolutionBriefsProjectBriefcaseList;
