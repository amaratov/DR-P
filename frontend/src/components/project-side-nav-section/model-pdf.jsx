import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Model from './model/model';
import { getSelectedProjectDetails, getSelectedDetailsFromProject, getActiveDetail } from '../../features/selectors/ui';
import { backendService } from '../../services/backend';
import { setActiveDetail } from '../../features/slices/uiSlice';
import { mergeRegions } from '../../utils/utils';

function ModelPDF() {
  // dispatch
  const dispatch = useDispatch();

  // params
  const routeParams = useParams();

  // selector
  const currentProjectInfo = useSelector(getSelectedProjectDetails);
  const detailsFromSelectedProject = useSelector(getSelectedDetailsFromProject);
  const activeDetail = useSelector(getActiveDetail);

  // effect
  useEffect(() => {
    dispatch(backendService.whoami());
  }, [dispatch]);

  useEffect(() => {
    if (currentProjectInfo?.id || routeParams?.id) {
      const projectId = currentProjectInfo?.id || routeParams?.id || 'unknown';
      dispatch(backendService.getProjectById(projectId));
      dispatch(backendService.getProjectDetails(projectId));
    }
  }, [routeParams]);

  useEffect(() => {
    const detailId = activeDetail?.id || routeParams?.detail_id || 'unknown';
    const newActiveD = mergeRegions(detailsFromSelectedProject).find(d => {
      return d.id === detailId;
    });
    dispatch(setActiveDetail(newActiveD));
  }, [detailsFromSelectedProject]);

  useEffect(() => {}, [activeDetail, activeDetail?.id]);

  return <Model drawerRight preSelect={activeDetail?.id} />;
}

ModelPDF.prototype = {};

ModelPDF.defaultProps = {};

export default ModelPDF;
