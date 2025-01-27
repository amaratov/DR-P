import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { isEmpty } from '../../../utils/utils';
import NoResultsPage from '../../../Pages/no-results-page/no-results-page';
import { AllRoles, TABS } from '../../../utils/constants/constants';
import CustomTablePagination from '../../table-pagination/custom-table-pagination';
import CustomProjectBriefcaseTable from '../../custom-table/project-briefcase-table/custom-table-project-briefcase';
import { backendService } from '../../../services/backend';
import {
  getPageNumCustomerDocPanel,
  getPageNumProjectDocuments,
  getSelectedProjectDetails,
  getSortOrderCustomerDocPanel,
  getSortOrderCustomerDocPanelBy,
  getSortOrderProjectDocuments,
  getSortOrderProjectDocumentsBy,
} from '../../../features/selectors/ui';
import { getCurrentProjectBriefcase } from '../../../features/selectors/projectBriefcase';
import { getWhoAmI } from '../../../features/selectors';
import { setCustomerDocPanelPage, setProjectDocumentsPage } from '../../../features/slices/uiSlice';
import { getNumPagesForCustomerDocuments, getProjectAssociatedDocuments } from '../../../features/selectors/customerDocument';

function ProjectBriefcaseList({ alreadyAddedValues, panelSelectedValues, setPanelSelectedValues, clearSelection, panelView, handleRemoveCustomerDocument }) {
  // dispatch
  const dispatch = useDispatch();

  // params
  const routeParams = useParams();

  // selector
  const whoami = useSelector(getWhoAmI);
  const currentProjectInfo = useSelector(getSelectedProjectDetails);
  const currentProjectBriefCase = useSelector(getCurrentProjectBriefcase);
  const allCustomerDocs = useSelector(getProjectAssociatedDocuments);
  const panelViewPage = useSelector(getPageNumCustomerDocPanel);
  const panelViewNumberOfPages = useSelector(getNumPagesForCustomerDocuments);
  const projectDocumentPage = useSelector(getPageNumProjectDocuments);
  const order = useSelector(getSortOrderProjectDocuments);
  const orderBy = useSelector(getSortOrderProjectDocumentsBy);
  const orderPanel = useSelector(getSortOrderCustomerDocPanel);
  const orderPanelBy = useSelector(getSortOrderCustomerDocPanelBy);

  // constant
  const maxRowsPerPage = 10;
  const page = panelView ? panelViewPage : projectDocumentPage;
  const useRole = whoami?.role?.name?.toLowerCase() || '';
  const hasPermission = useRole === AllRoles.ADMIN || useRole === AllRoles.SOLUTIONS_ARCHITECT || useRole === AllRoles.CUSTOMER;
  const canViewAllMarketing = useRole === AllRoles.ADMIN || useRole === AllRoles.SOLUTIONS_ARCHITECT;
  const canViewPublishedMarketingOnly = useRole === AllRoles.CUSTOMER;
  // exclude the already added marketing
  let associatedCustomDocInfo = canViewPublishedMarketingOnly ? currentProjectBriefCase?.publishedDocument : currentProjectBriefCase?.associatedDocument;
  let numPages = canViewPublishedMarketingOnly
    ? Math.ceil((associatedCustomDocInfo?.length || 0) / maxRowsPerPage)
    : Math.ceil((currentProjectBriefCase?.associatedDocument?.length || 0) / maxRowsPerPage);
  if (panelView) {
    associatedCustomDocInfo = allCustomerDocs || [];
    numPages = panelViewNumberOfPages;
  }

  // func
  const handleSetPage = useCallback(
    val => {
      if (panelView) {
        dispatch(setCustomerDocPanelPage(val - 1));
      } else {
        dispatch(setProjectDocumentsPage(val - 1));
      }
    },
    [dispatch, panelView]
  );

  const handleDownloadDocForCustomer = useCallback(
    rowDetails => {
      dispatch(backendService.downloadCustomerDocument(rowDetails));
    },
    [dispatch]
  );

  // effect
  useEffect(() => {
    clearSelection();
    return () => {
      clearSelection();
    };
  }, []);

  useEffect(() => {
    dispatch(backendService.whoami());
  }, [dispatch]);

  useEffect(() => {
    if (numPages - 1 < page && page !== 0) {
      if (panelView) {
        dispatch(setCustomerDocPanelPage(0));
      } else {
        dispatch(setProjectDocumentsPage(0));
      }
    }
  }, [numPages, page, dispatch, panelView]);

  useEffect(() => {
    if (currentProjectInfo?.id || routeParams?.id) {
      const params = {
        projectId: currentProjectInfo?.id || routeParams?.id || 'unknown',
      };
      dispatch(backendService.getProjectBriefcaseByProjectId(params));
    }
  }, [dispatch]);

  useEffect(() => {
    const projectId = currentProjectInfo?.id || routeParams?.id || 'unknown';
    if (panelView) {
      const params = { order: [[orderPanelBy, orderPanel]], projectId, limit: maxRowsPerPage, page: panelView ? panelViewPage : projectDocumentPage };
      dispatch(backendService.getCustomerDocumentByProjectIdAndParams(params));
    } else {
      const params = { order: [[orderBy, order]], projectId, limit: maxRowsPerPage, page: panelView ? panelViewPage : projectDocumentPage };
      dispatch(backendService.getCustomerDocumentByProjectIdAndParams(params));
    }
  }, [
    dispatch,
    currentProjectBriefCase,
    canViewAllMarketing,
    canViewPublishedMarketingOnly,
    orderBy,
    order,
    orderPanelBy,
    orderPanel,
    currentProjectInfo,
    panelView,
    panelViewPage,
    projectDocumentPage,
    routeParams,
  ]);

  if (!hasPermission) {
    return null;
  }

  if (
    !panelView &&
    ((canViewAllMarketing && isEmpty(currentProjectBriefCase?.associatedDocument)) ||
      (canViewPublishedMarketingOnly && isEmpty(currentProjectBriefCase?.publishedDocument)))
  ) {
    return <NoResultsPage activeTab={TABS.PROJECT_BRIEFCASE} />;
  }

  return (
    <div style={{ marginTop: '25px' }}>
      <CustomProjectBriefcaseTable
        tableData={associatedCustomDocInfo}
        canViewPublishedMarketingOnly={canViewPublishedMarketingOnly}
        maxRowsPerPage={maxRowsPerPage}
        panelSelectedValues={panelSelectedValues}
        setPanelSelectedValues={setPanelSelectedValues}
        alreadyAddedValues={alreadyAddedValues}
        handleDownloadDocForCustomer={handleDownloadDocForCustomer}
        handleRemoveCustomerDocument={handleRemoveCustomerDocument}
        panelView={panelView}
      />
      {numPages > 1 && <CustomTablePagination numPages={numPages} setPage={handleSetPage} page={(panelView ? panelViewPage : projectDocumentPage) + 1} />}
    </div>
  );
}

ProjectBriefcaseList.propTypes = {
  alreadyAddedValues: PropTypes.arrayOf(PropTypes.shape({})),
  panelSelectedValues: PropTypes.arrayOf(PropTypes.shape({})),
  setPanelSelectedValues: PropTypes.func,
  clearSelection: PropTypes.func,
  handleRemoveCustomerDocument: PropTypes.func,
  panelView: PropTypes.bool,
};

ProjectBriefcaseList.defaultProps = {
  alreadyAddedValues: [],
  clearSelection: () => {},
  panelSelectedValues: [],
  setPanelSelectedValues: () => {},
  handleRemoveCustomerDocument: () => {},
  panelView: false,
};

export default ProjectBriefcaseList;
