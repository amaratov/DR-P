import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { isEmpty } from '../../../utils/utils';
import NoResultsPage from '../../../Pages/no-results-page/no-results-page';
import { ROW_PER_PAGE, TABS } from '../../../utils/constants/constants';
import { backendService } from '../../../services/backend';
import { getWhoAmI } from '../../../features/selectors';
import { getAdditionalSolutionBriefs, getSelectedProjectDetails } from '../../../features/selectors/ui';
import SolutionBriefListContent from './solution-brief-list-content';
import { setAdditionalSolBriefs } from '../../../features/slices/uiSlice';

function SolutionBriefList() {
  // dispatch
  const dispatch = useDispatch();

  // params
  const routeParams = useParams();

  // selector
  const whoami = useSelector(getWhoAmI);
  const currentProjectInfo = useSelector(getSelectedProjectDetails);
  const solutionBriefs = useSelector(getAdditionalSolutionBriefs);

  // constant
  const maxRowsPerPage = ROW_PER_PAGE;

  // state
  const [page, setPage] = useState(1);

  // func
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

  if (isEmpty(solutionBriefs)) {
    return <NoResultsPage activeTab={TABS.SOLUTION_BRIEF} />;
  }

  return (
    <div style={{ marginTop: '30px' }}>
      <SolutionBriefListContent solutionBriefs={solutionBriefs} />
    </div>
  );
}

SolutionBriefList.propTypes = {};

SolutionBriefList.defaultProps = {};

export default SolutionBriefList;
