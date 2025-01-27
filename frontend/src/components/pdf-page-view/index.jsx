import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { backendService } from '../../services/backend';
import PdfDiscoverProjectCustomerView from '../project-side-nav-section/discover/discover-regions/discover-panels/discover-region-state-panel/customer-views/pdf';

/**
 * Creating a PDF View Component
 *
 * With using the frontend as a view for PDFs, components can be used/re-used for displaying data.
 *
 * If certain data needs to be passed to the view, using the URL query params is an option, eg. need a resource id like project or user.
 *
 * Here is an example for an initial view:
 *
 * ```jsx
 * function MyPdfView() {
 *   const dispatch = useDispatch();
 *   const [searchParams, _] = useSearchParams();
 *
 *   useEffect(() => {
 *     const projectId = searchParams.get('projectId');
 *     dispatch(backendService.getProjectDetails(projectId));
 *   }, [dispatch, searchParams]);
 *
 *   return <DiscoverCustomerView activeTab="Customer Locations" />;
 * }
 * ```
 */
const mappedViewComponents = {
  'discover-customer-view': PdfDiscoverProjectCustomerView,
};

function PdfPageView() {
  const dispatch = useDispatch();
  const { view } = useParams();

  useEffect(() => {
    dispatch(backendService.whoami());
  }, [dispatch]);

  const PdfViewComponent = useMemo(() => {
    return mappedViewComponents[view];
  }, [view]);

  return PdfViewComponent ? <PdfViewComponent /> : null;
}

PdfPageView.prototype = {};

PdfPageView.defaultProps = {};

export default PdfPageView;
