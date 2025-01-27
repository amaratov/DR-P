import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { SwipeableDrawer, CircularProgress } from '@mui/material';
import { QuestionMark } from '@mui/icons-material';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import useSupercluster from 'use-supercluster';
import GeocodingClient from '@mapbox/mapbox-sdk/services/geocoding';
import ReactMapGl, { GeolocateControl, NavigationControl, Marker, Layer, Source } from '!react-map-gl';
import {
  DEFAULT_MAP_STYLES,
  TABS,
  DISCOVER_REGION_FIELDS,
  GENERIC_TYPE,
  MODEL_SUB_PANELS,
  REGION_TYPE,
  PATH_NAME,
  SERVICES_TYPE,
  TECHNOLOGY_ICON_TAG,
  FEATURE_CONFIG,
  REGIONAL_ONRAMP_TYPE,
} from '../../../utils/constants/constants';
import { getMapToken } from '../../../features/selectors/config';
import { backendService } from '../../../services/backend';
import { CircularProgressContainer, DRDivider } from '../../app/app-styled';
import { TabItem, TabsWrapper } from '../../tabs/tab-styled';
import TabPanel from '../../tabs/tab-panel';
import { a11yProps, getCloseMarkerNumbers, isEmpty, mergeRegions } from '../../../utils/utils';
import ModelSideTab from './model-side-nav-tab';
import { getActiveDetail, getActiveHoveredDetail, getSelectedDetailsFromProject, getSelectedProjectDetails } from '../../../features/selectors/ui';
import { getTrueAllActiveIcons } from '../../../features/selectors/artifactIcon';
import IconBubble from './icon-bubble';
import {
  MapClusterConnectionIndicator,
  MapClusterConnectionIndicatorText,
  MapClusterInnerWrapper,
  MapClusterLeafGridItem,
  MapClusterLeafGridItemSet,
  MapClusterLeafIconWrapper,
  MapClusterLeafPopup,
  MapClusterText,
  MapClusterWrapper,
  MapMarkerPopup,
  MarkerPopupCategoryContainer,
  MarkerPopupCategoryHeaderText,
  MarkerPopupCategoryHeaderWrapper,
  MarkerPopupCategoryItemContainer,
  MarkerPopupContainer,
  MarkerPopupOnRampSubText,
  SpecialMarkerPopup,
} from './model-styled';
import ConnectPanel from '../connect/connect-panel';
import ConnectRegionSelectPanel from '../connect/connect-region-select-panel';
import { setHoveredConnectionId, setRecentlyDeactivated, setViewState } from '../../../features/slices/mapSlice';
import { getHighlightConnectionInfo, getMapViewState, getRecentlyDeactivated } from '../../../features/selectors/map';
import { setActiveDetail, setActiveHoveredDetail, setActiveOnRamp } from '../../../features/slices/uiSlice';
import { getAllConnections } from '../../../features/selectors/connection';
import { getWhoAmI } from '../../../features/selectors';

function Model({ drawerRight, preSelect, isConnect }) {
  // dispatch
  const dispatch = useDispatch();

  // navigate
  const navigate = useNavigate();

  // params
  const routeParams = useParams();

  // selector
  const whoami = useSelector(getWhoAmI);
  const detailsFromSelectedProject = useSelector(getSelectedDetailsFromProject);
  const activeIcons = useSelector(getTrueAllActiveIcons);
  const viewState = useSelector(getMapViewState);
  const currentProjectInfo = useSelector(getSelectedProjectDetails);
  const token = useSelector(getMapToken);
  const activeDetail = useSelector(getActiveDetail);
  const allConnections = useSelector(getAllConnections);
  const recentlyDeactivated = useSelector(getRecentlyDeactivated);
  const highlightConnectInfo = useSelector(getHighlightConnectionInfo);
  const activeHoveredDetail = useSelector(getActiveHoveredDetail);

  // ref
  const mapRef = useRef();

  const defaultLevel = {
    [DISCOVER_REGION_FIELDS.DATA_CENTRES]: MODEL_SUB_PANELS.DATACENTER,
    [DISCOVER_REGION_FIELDS.CUSTOMER_LOCATIONS]: MODEL_SUB_PANELS.CUSTOMER,
    [DISCOVER_REGION_FIELDS.CLOUDS]: MODEL_SUB_PANELS.CLOUDS,
  };

  // state
  const [activeSectionValue, setActiveSection] = useState(isConnect ? `${TABS.MODEL_CONNECT}` : `${TABS.MODEL_MODEL}`);
  const [subDrawerClosed, setSubDrawerClosed] = useState(true);
  const [geoPoints, setGeoPoints] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(preSelect ? defaultLevel[activeDetail?.type] : MODEL_SUB_PANELS.REGION);
  //eslint-disable-next-line
  const [subDrawerOpen, setSubDrawerOpen] = useState(preSelect ? true : false);
  const [selectedRegion, setSelectedRegion] = useState(preSelect ? activeDetail.region : false);
  const [openConnectRegion, setOpenConnectRegion] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [selectedClusterLeaf, setSelectedClusterLeaf] = useState([]);
  const [dcListOpen, setDcListOpen] = useState(false);
  const [markerOpen, setMarkerOpen] = useState(false);
  const [points, setPoints] = useState([]);
  const [allowConnect, setAllowConnect] = useState(false);
  const [specialMarker, setSpecialMarker] = useState(null);
  const [specialMarkerPopup, setSpecialMarkerPopup] = useState(false);
  const [isOnRampHover, setIsOnRampHover] = useState(false);
  const [clickPopup, setClickPopup] = useState(null);

  // memo
  const activeSection = useMemo(() => {
    return (isConnect && TABS.MODEL_CONNECT) || (!isConnect && TABS.MODEL_MODEL) || activeSectionValue || TABS.MODEL_MODEL;
  }, [isConnect, activeSectionValue]);

  const projectId = useMemo(() => {
    return currentProjectInfo?.id || routeParams?.id || window.location.pathname.split('/')[2] || 'unknown';
  }, [currentProjectInfo, routeParams]);

  // const
  const contentAvailable = detailsFromSelectedProject?.length > 0;
  const useRole = whoami?.role?.name?.toLowerCase() || '';
  const isAdminOrSA = FEATURE_CONFIG.ADMIN_AND_SA_ONLY.access_group.includes(useRole);
  const noConnections = isEmpty(allConnections);
  const mergedDetails = useMemo(() => mergeRegions(detailsFromSelectedProject), [detailsFromSelectedProject]);
  const activeDetails = useMemo(() => mergedDetails.filter(d => d?.extras?.active), [mergedDetails]);
  const panelCategories = {
    [DISCOVER_REGION_FIELDS.CLOUDS]: 'Clouds',
    [DISCOVER_REGION_FIELDS.DATA_CENTRES]: 'Data Centers',
    [DISCOVER_REGION_FIELDS.APPLICATIONS]: 'Applications',
    [DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.PARTNERSHIP_AND_SUPPLIERS]: 'Partners / Suppliers',
    [GENERIC_TYPE]: 'Other',
    [SERVICES_TYPE]: 'Cloud Services (Storage, Network, Compute)',
    [TECHNOLOGY_ICON_TAG]: 'Technology',
  };

  // get map bounds
  const bounds = mapRef.current ? mapRef.current.getMap().getBounds().toArray().flat() : null;

  // get clusters
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom: viewState.zoom,
    options: {
      radius: 100,
      maxZoom: 20,
    },
  });

  const connections = useMemo(() => {
    const connectionFeatures = allConnections?.reduce((acc, connect) => {
      // const clusters = supercluster?.points;
      const originIds = connect?.origins;
      const onRampOrigins = connect?.onRampOrigins;
      const isEndOnRamp = connect?.endpointType === REGIONAL_ONRAMP_TYPE;
      const endId = isEndOnRamp ? connect?.onRampEndpoint : connect?.endpoint;
      const endGeo = isEndOnRamp
        ? endId?.geometry
        : geoPoints?.find(e => {
            return e?.id === endId;
          });

      const endCenter = isEndOnRamp ? endGeo?.coordinates : endGeo?.center;

      const endNotClustered = clusters?.find(c => {
        if (isEndOnRamp) {
          return !c.properties.clusterd && c.properties?.pointDetails?.name === endId?.name && c.properties?.pointDetails?.parent?.id === endId?.parent?.id;
        }
        return !c.properties.clusterd && c.properties.id === endId;
      });

      if (originIds?.length > 0) {
        originIds.forEach(originId => {
          const originNotClustered = clusters?.find(c => c.properties.id === originId && !c.properties.clusterd);
          const originGeo = geoPoints.find(e => {
            return e?.id === originId;
          });
          const originCenter = originGeo?.center;
          if (originCenter && originCenter?.[0] && originCenter?.[1]) {
            if (endNotClustered && originNotClustered) {
              acc.push({
                type: 'Feature',
                properties: { cluster: false, id: connect?.id, category: connect?.type, from: connect?.id, originId, endpoint: endId, pointDetails: connect },
                geometry: {
                  type: 'LineString',
                  coordinates: [originCenter, endCenter],
                },
              });
            } else if (!endNotClustered && originNotClustered) {
              const endClusteredNewCenter = clusters?.find(c => {
                if (c?.properties?.cluster) {
                  const allLeaves = supercluster?.getLeaves(c.id, c?.properties?.point_count);
                  const hasVal =
                    allLeaves?.length > 0 &&
                    allLeaves?.find(l => {
                      if (isEndOnRamp) {
                        return l?.properties?.pointDetails?.name === endId?.name && l?.properties?.pointDetails?.parent?.id === endId?.parent?.id;
                      }
                      return l?.properties?.id === endId;
                    });
                  if (hasVal) return c;
                }
                return null;
              });
              if (endClusteredNewCenter && endClusteredNewCenter?.geometry?.coordinates) {
                acc.push({
                  type: 'Feature',
                  properties: { cluster: false, id: connect?.id, category: connect?.type, from: connect?.id, originId, endpoint: endId, pointDetails: connect },
                  geometry: {
                    type: 'LineString',
                    coordinates: [originCenter, endClusteredNewCenter?.geometry?.coordinates],
                  },
                });
              }
            } else if (endNotClustered && !originNotClustered) {
              const originClusteredNewCenter = clusters?.find(c => {
                if (c?.properties?.cluster) {
                  const allLeaves = supercluster?.getLeaves(c?.id, c?.properties?.point_count);
                  const hasVal = allLeaves?.length > 0 && allLeaves?.find(l => l?.properties?.id === originId);
                  if (hasVal) return c;
                }
                return null;
              });
              if (originClusteredNewCenter && originClusteredNewCenter?.geometry?.coordinates) {
                acc.push({
                  type: 'Feature',
                  properties: { cluster: false, id: connect?.id, category: connect?.type, from: connect?.id, originId, endpoint: endId, pointDetails: connect },
                  geometry: {
                    type: 'LineString',
                    coordinates: [originClusteredNewCenter.geometry.coordinates, endCenter],
                  },
                });
              }
            } else {
              const clusteredNewCenterObj = clusters?.reduce((acc, c) => {
                if (c?.properties?.cluster) {
                  const allLeaves = supercluster?.getLeaves(c?.id, c?.properties?.point_count);
                  const hasOriginVal = allLeaves?.length > 0 && allLeaves?.find(l => l?.properties?.id === originId);
                  const hasEndVal =
                    allLeaves?.length > 0 &&
                    allLeaves?.find(l => {
                      if (isEndOnRamp) {
                        return l?.properties?.pointDetails?.name === endId?.name && l?.properties?.pointDetails?.parent?.id === endId?.parent?.id;
                      }
                      return l?.properties?.id === endId;
                    });
                  if (hasOriginVal) acc.origin = c?.geometry?.coordinates;
                  if (hasEndVal) acc.end = c?.geometry?.coordinates;
                }
                return acc;
              }, {});
              if (clusteredNewCenterObj.origin && clusteredNewCenterObj.end) {
                acc.push({
                  type: 'Feature',
                  properties: { cluster: false, id: connect?.id, category: connect?.type, from: connect?.id, originId, endpoint: endId, pointDetails: connect },
                  geometry: {
                    type: 'LineString',
                    coordinates: [clusteredNewCenterObj.origin, clusteredNewCenterObj.end],
                  },
                });
              }
            }
          }
        });
      }

      // onRamp Origins
      if (onRampOrigins?.length > 0) {
        onRampOrigins?.forEach(onRampOrigin => {
          const originNotClustered = clusters?.find(
            c =>
              !c.properties.clusterd &&
              c.properties?.pointDetails?.name === onRampOrigin?.name &&
              c.properties?.pointDetails?.parent?.id === onRampOrigin?.parent?.id
          );
          const originGeo = onRampOrigin.geometry;
          const originCenter = originGeo?.coordinates;
          if (originCenter && originCenter?.[0] && originCenter?.[1]) {
            if (endNotClustered && originNotClustered) {
              acc.push({
                type: 'Feature',
                properties: {
                  cluster: false,
                  id: connect?.id,
                  category: connect?.type,
                  from: connect?.id,
                  onRampOrigin,
                  endpoint: endId,
                  pointDetails: connect,
                },
                geometry: {
                  type: 'LineString',
                  coordinates: [originCenter, endCenter],
                },
              });
            } else if (!endNotClustered && originNotClustered) {
              const endClusteredNewCenter = clusters?.find(c => {
                if (c?.properties?.cluster) {
                  const allLeaves = supercluster?.getLeaves(c.id, c?.properties?.point_count);
                  const hasVal =
                    allLeaves?.length > 0 &&
                    allLeaves?.find(l => {
                      if (isEndOnRamp) {
                        return l?.properties?.pointDetails?.name === endId?.name && l?.properties?.pointDetails?.parent?.id === endId?.parent?.id;
                      }
                      return l?.properties?.id === endId;
                    });
                  if (hasVal) return c;
                }
                return null;
              });
              if (endClusteredNewCenter && endClusteredNewCenter?.geometry?.coordinates) {
                acc.push({
                  type: 'Feature',
                  properties: {
                    cluster: false,
                    id: connect?.id,
                    category: connect?.type,
                    from: connect?.id,
                    onRampOrigin,
                    endpoint: endId,
                    pointDetails: connect,
                  },
                  geometry: {
                    type: 'LineString',
                    coordinates: [originCenter, endClusteredNewCenter?.geometry?.coordinates],
                  },
                });
              }
            } else if (endNotClustered && !originNotClustered) {
              const originClusteredNewCenter = clusters?.find(c => {
                if (c?.properties?.cluster) {
                  const allLeaves = supercluster?.getLeaves(c?.id, c?.properties?.point_count);
                  const hasVal =
                    allLeaves?.length > 0 &&
                    allLeaves?.find(
                      l => l?.properties?.pointDetails?.name === onRampOrigin?.name && l?.properties?.pointDetails?.parent?.id === onRampOrigin?.parent?.id
                    );
                  if (hasVal) return c;
                }
                return null;
              });
              if (originClusteredNewCenter && originClusteredNewCenter?.geometry?.coordinates) {
                acc.push({
                  type: 'Feature',
                  properties: {
                    cluster: false,
                    id: connect?.id,
                    category: connect?.type,
                    from: connect?.id,
                    onRampOrigin,
                    endpoint: endId,
                    pointDetails: connect,
                  },
                  geometry: {
                    type: 'LineString',
                    coordinates: [originClusteredNewCenter.geometry.coordinates, endCenter],
                  },
                });
              }
            } else {
              const clusteredNewCenterObj = clusters?.reduce((acc, c) => {
                if (c?.properties?.cluster) {
                  const allLeaves = supercluster?.getLeaves(c?.id, c?.properties?.point_count);
                  const hasOriginVal =
                    allLeaves?.length > 0 &&
                    allLeaves?.find(
                      l => l?.properties?.pointDetails?.name === onRampOrigin?.name && l?.properties?.pointDetails?.parent?.id === onRampOrigin?.parent?.id
                    );
                  const hasEndVal =
                    allLeaves?.length > 0 &&
                    allLeaves?.find(l => {
                      if (isEndOnRamp) {
                        return l?.properties?.pointDetails?.name === endId?.name && l?.properties?.pointDetails?.parent?.id === endId?.parent?.id;
                      }
                      return l?.properties?.id === endId;
                    });
                  if (hasOriginVal) acc.origin = c?.geometry?.coordinates;
                  if (hasEndVal) acc.end = c?.geometry?.coordinates;
                }
                return acc;
              }, {});
              if (clusteredNewCenterObj.origin && clusteredNewCenterObj.end) {
                acc.push({
                  type: 'Feature',
                  properties: {
                    cluster: false,
                    id: connect?.id,
                    category: connect?.type,
                    from: connect?.id,
                    onRampOrigin,
                    endpoint: endId,
                    pointDetails: connect,
                  },
                  geometry: {
                    type: 'LineString',
                    coordinates: [clusteredNewCenterObj.origin, clusteredNewCenterObj.end],
                  },
                });
              }
            }
          }
        });
      }

      return acc;
    }, []);
    return {
      type: 'FeatureCollection',
      features: connectionFeatures,
    };
  }, [allConnections, geoPoints, clusters, supercluster]);

  // func
  const handleSubDrawerChange = useCallback(newValue => setSubDrawerClosed(newValue), [setSubDrawerClosed]);

  const handleViewStateChange = useCallback(
    newViewState => {
      // another way to try to ensure the markers(points) are loaded properly
      if (activeDetails?.length > 0 && isEmpty(points)) {
        dispatch(backendService.getProjectDetails(projectId));
      }
      dispatch(setViewState(newViewState));
    },
    [dispatch, activeDetails, points, currentProjectInfo, routeParams]
  );

  const handleChange = (_, newVal) => {
    setActiveSection(newVal);
    if (newVal !== TABS.MODEL_CONNECT) setOpenConnectRegion(false);
    if (newVal === TABS.MODEL_MODEL) {
      navigate(`${PATH_NAME.PROJECT_MODELER_BASE}/${projectId}${PATH_NAME.MODEL}`);
    }
    if (newVal === TABS.MODEL_CONNECT) navigate(`${PATH_NAME.PROJECT_MODELER_BASE}/${projectId}${PATH_NAME.MODEL}${PATH_NAME.MODEL_CONNECT}`);
  };

  useEffect(() => {
    setAllowConnect(activeIcons.length > 0);
  }, [activeIcons]);

  const getIconFromDetail = useCallback(
    (key, detail, small, highlightThis, specialClusterIcon) => {
      if (typeof small === 'undefined') {
        small = false;
      }
      if (key === GENERIC_TYPE || key === SERVICES_TYPE || key === TECHNOLOGY_ICON_TAG) {
        const i = activeIcons.find(i => {
          return i.id === detail;
        });
        return <IconBubble icon={i} small={small} highlightThis={highlightThis} specialClusterIcon={specialClusterIcon} />;
      }

      if (detail) {
        return <IconBubble detail={detail} small={small} highlightThis={highlightThis} specialClusterIcon={specialClusterIcon} />;
      }

      return <QuestionMark />;
    },
    [activeIcons]
  );

  const handleRegionListClick = useCallback(
    detail => {
      setSelectedRegion(detail);
      setSubDrawerOpen(true);
      handleSubDrawerChange(false);
    },
    [setSelectedRegion, setSubDrawerOpen]
  );

  const handleMarkerClick = useCallback(
    (e, cluster) => {
      e.originalEvent.stopPropagation();
      const pointDetails = cluster?.properties?.pointDetails;
      const isOnRamp = pointDetails?.onRamp;
      const coordinates = cluster?.geometry?.coordinates;
      const foundOnRampParent = mergeRegions(detailsFromSelectedProject)?.find(
        d =>
          isOnRamp &&
          d?.extras?.active &&
          d?.extras?.onRamps?.find(
            r =>
              r.name === pointDetails?.name &&
              r?.centroid_latitude === pointDetails?.centroid_latitude &&
              r?.centroid_longitude === pointDetails?.centroid_longitude
          ) &&
          d?.named === pointDetails?.cloud_region
      );
      const foundRegion = mergeRegions(detailsFromSelectedProject)?.find(
        d => d?.type === REGION_TYPE && (d?.region === pointDetails?.region || (isOnRamp && foundOnRampParent && d?.region === foundOnRampParent?.region))
      );
      const firstHalf = `${PATH_NAME.PROJECT_MODELER_BASE}/${pointDetails?.projectId || foundOnRampParent?.projectId}${PATH_NAME.MODEL}`;
      const secondHalf = `/${foundRegion?.id || routeParams?.regionId || 'unknown'}/${pointDetails?.id || cluster?.properties?.id || 'unknown'}`;
      navigate(firstHalf + secondHalf);
      setSelectedMarker(cluster);
      dispatch(setViewState({ ...viewState, longitude: coordinates?.[0], latitude: coordinates?.[1] }));
      // handle onramp
      if (isOnRamp) {
        dispatch(setActiveDetail(foundOnRampParent));
        dispatch(setActiveOnRamp(pointDetails));
      } else {
        dispatch(setActiveDetail(pointDetails));
        dispatch(setActiveOnRamp(null));
      }
      if (!isConnect) {
        handleRegionListClick(foundRegion);
        if (pointDetails?.type === 'model' && pointDetails?.extras.modelType === 'datacenters') {
          setCurrentLevel(MODEL_SUB_PANELS.DATACENTER);
          setDcListOpen(false);
        } else if ((pointDetails?.type === 'model' && pointDetails?.extras?.modelType === DISCOVER_REGION_FIELDS.CLOUDS) || pointDetails?.onRamp) {
          setCurrentLevel(MODEL_SUB_PANELS.CLOUDS);
        } else {
          setCurrentLevel(pointDetails?.type);
        }
      }
      // setMarkerOpen(!markerOpen);
    },
    [
      detailsFromSelectedProject,
      setSelectedMarker,
      viewState,
      dispatch,
      handleRegionListClick,
      setCurrentLevel,
      setDcListOpen,
      markerOpen,
      setMarkerOpen,
      isConnect,
    ]
  );

  const findAndSetSelectedMarkerForPopup = useCallback(
    detail => {
      if (selectedMarker?.properties?.id !== detail?.id) {
        const foundPoint = points?.find(p => p?.properties?.id === detail?.id);
        setSelectedMarker(foundPoint);
      }
    },
    [selectedMarker, setSelectedMarker, points]
  );

  const handleMapRecenter = useCallback(
    detail => {
      if (detail) {
        const found = points?.find(p => p.properties.id === detail.id);
        // fly animation and set a zoom level so cluster breaks down on the fly
        if (found && found?.geometry?.coordinates) mapRef.current?.flyTo({ center: found?.geometry?.coordinates, zoom: 8, duration: 600 });
      }
    },
    [points, mapRef.current]
  );

  const cleanUpConnections = useCallback(() => {
    if (allConnections?.length > 0) {
      const connectionIdsToBeDeleted = allConnections?.reduce((acc, con) => {
        const originsOnlyContainsId = con?.origins?.length === 1 && con?.origins?.[0] === recentlyDeactivated;
        const endpointMatchesId = con?.endpoint === recentlyDeactivated;
        if (originsOnlyContainsId || endpointMatchesId) acc.push(con);
        return acc;
      }, []);

      const connectionObjToBeCleanUp = allConnections?.reduce((acc, con) => {
        const originsContainsId = con?.origins?.length > 1 && con?.origins?.includes(recentlyDeactivated);
        if (originsContainsId) {
          const filteredOrigins = con?.origins?.filter(org => org !== recentlyDeactivated);
          const newData = {
            ...con,
            origins: [...filteredOrigins],
          };
          acc.push(newData);
        }
        return acc;
      }, []);

      if (connectionIdsToBeDeleted?.length > 0) {
        connectionIdsToBeDeleted.forEach(con => {
          try {
            dispatch(backendService.deleteProjectConnections(con));
          } catch (e) {
            console.log(e);
          }
        });
      }

      if (connectionObjToBeCleanUp?.length > 0) {
        connectionObjToBeCleanUp.forEach(con => {
          try {
            dispatch(backendService.updateProjectConnections(con));
          } catch (e) {
            console.log(e);
          }
        });
      }
    }
  }, [allConnections, recentlyDeactivated, dispatch]);

  const handleSpecialMarkerClick = useCallback(
    leaf => {
      // setMarkerOpen(false);
      setHoveredMarker(null);
      setSelectedMarker(null);
      if (leaf) {
        const pointDetails = leaf?.properties?.pointDetails;
        const foundRegion = mergeRegions(detailsFromSelectedProject)?.find(d => d?.type === REGION_TYPE && d?.region === pointDetails?.region);
        setSelectedMarker(leaf);
        setSpecialMarker(leaf);
        // setSpecialMarkerPopup(true);
        dispatch(setActiveDetail(pointDetails));
        if (!isConnect) {
          handleRegionListClick(foundRegion);
          if (pointDetails?.type === 'model' && pointDetails?.extras.modelType === 'datacenters') {
            setCurrentLevel(MODEL_SUB_PANELS.DATACENTER);
            //setDcListOpen(true);
          } else if (pointDetails?.type === 'model' && pointDetails?.extras.modelType === DISCOVER_REGION_FIELDS.CLOUDS) {
            setCurrentLevel(MODEL_SUB_PANELS.CLOUDS);
            // setDcListOpen(true);
          } else {
            setCurrentLevel(pointDetails?.type);
          }
        }
      } else {
        dispatch(setActiveDetail(null));
        setSpecialMarker(null);
        // setSpecialMarkerPopup(false);
      }
    },
    [setSpecialMarker, specialMarkerPopup, setSpecialMarkerPopup, isConnect, dispatch]
  );

  const handleSpecialMarkerHover = useCallback(
    leaf => {
      setSpecialMarkerPopup(true);
      dispatch(setActiveHoveredDetail(leaf?.properties?.pointDetails));
    },
    [dispatch, setSpecialMarkerPopup]
  );

  const handleSpecialMarkerLeave = useCallback(() => {
    setSpecialMarkerPopup(false);
    dispatch(setActiveHoveredDetail(null));
  }, [dispatch, setSpecialMarkerPopup]);

  // can be used for cluster popup or to show some cluster content if needed
  const renderClusterLeaf = () => {
    if (!selectedClusterLeaf) return null;

    return (
      <MapClusterLeafGridItemSet>
        {selectedClusterLeaf.map(leaf => {
          const currentHoverDetail = activeDetail && activeDetail?.id === leaf?.properties?.id ? activeDetail : activeHoveredDetail;
          return (
            <MapClusterLeafGridItem
              key={`park-sorted-${leaf?.properties?.id}`}
              onKeyDown={() => handleSpecialMarkerClick(leaf)}
              onMouseOver={() => handleSpecialMarkerHover(leaf)}
              onFocus={() => handleSpecialMarkerHover(leaf)}
              onMouseLeave={() => handleSpecialMarkerLeave()}
              onClick={() => handleSpecialMarkerClick(leaf)}>
              {getIconFromDetail(
                '',
                mergedDetails?.find(d => {
                  return d?.id === leaf?.properties?.id || d?.companionId === leaf?.properties?.id;
                }),
                false,
                false,
                true
              )}
              {specialMarkerPopup && currentHoverDetail && !currentHoverDetail?.onRamp && currentHoverDetail?.id === leaf?.properties?.id && (
                <SpecialMarkerPopup>
                  <MarkerPopupContainer>
                    {currentHoverDetail?.extras?.model &&
                      Object.keys(currentHoverDetail?.extras?.model).map(key => {
                        if (panelCategories[key]) {
                          return (
                            <MarkerPopupCategoryContainer key={`popup-${key}`}>
                              <MarkerPopupCategoryHeaderWrapper>
                                <MarkerPopupCategoryHeaderText>{panelCategories[key]}</MarkerPopupCategoryHeaderText>
                              </MarkerPopupCategoryHeaderWrapper>
                              <MarkerPopupCategoryItemContainer>
                                {currentHoverDetail?.extras?.model[key].map(detailId => {
                                  return (
                                    <div key={`popup-${specialMarker?.properties?.id}${key}-${detailId}`}>
                                      {getIconFromDetail(
                                        key,
                                        key === GENERIC_TYPE
                                          ? detailId
                                          : mergedDetails?.find(d => {
                                              return d?.id === detailId || d?.companionId === detailId;
                                            }) || null
                                      )}
                                    </div>
                                  );
                                })}
                              </MarkerPopupCategoryItemContainer>
                              <DRDivider margin="16px 0" />
                            </MarkerPopupCategoryContainer>
                          );
                        }
                        return <span key={`empty-span-${key}`} />;
                      })}
                  </MarkerPopupContainer>
                </SpecialMarkerPopup>
              )}
              {specialMarkerPopup &&
                currentHoverDetail?.onRamp &&
                currentHoverDetail?.name === leaf?.properties?.pointDetails?.name &&
                currentHoverDetail?.parent?.id === leaf?.properties?.pointDetails?.parent?.id && (
                  <SpecialMarkerPopup>
                    <MarkerPopupContainer>
                      <MarkerPopupCategoryHeaderWrapper>
                        <MarkerPopupCategoryHeaderText>{currentHoverDetail?.name}</MarkerPopupCategoryHeaderText>
                      </MarkerPopupCategoryHeaderWrapper>
                      <MarkerPopupOnRampSubText>{`${currentHoverDetail?.parent?.extras?.cloud} - ${currentHoverDetail?.cloud_region}`}</MarkerPopupOnRampSubText>
                    </MarkerPopupContainer>
                  </SpecialMarkerPopup>
                )}
            </MapClusterLeafGridItem>
          );
        })}
      </MapClusterLeafGridItemSet>
    );
  };

  const handleConnectionMarkerHover = useCallback(
    connectInfo => {
      const pointDetails = connectInfo?.properties?.pointDetails;
      const isOnRamp = pointDetails?.onRamp;
      const foundOnRampParent = mergeRegions(detailsFromSelectedProject)?.find(
        d =>
          isOnRamp &&
          d?.extras?.active &&
          d?.extras?.onRamps?.find(
            r =>
              r.name === pointDetails?.name &&
              r?.centroid_latitude === pointDetails?.centroid_latitude &&
              r?.centroid_longitude === pointDetails?.centroid_longitude
          ) &&
          d?.named === pointDetails?.cloud_region
      );
      setMarkerOpen(true);
      setIsOnRampHover(isOnRamp);
      if (isOnRamp) {
        setHoveredMarker({ ...connectInfo, parent: foundOnRampParent });
        dispatch(setActiveHoveredDetail({ ...connectInfo?.properties?.pointDetails, parent: foundOnRampParent }));
      } else {
        setHoveredMarker(connectInfo);
        dispatch(setActiveHoveredDetail(connectInfo?.properties?.pointDetails));
      }
      if (activeSection === TABS.MODEL_CONNECT) {
        const pointId = connectInfo?.properties?.pointDetails?.parent ? connectInfo?.properties?.pointDetails : connectInfo?.properties?.pointDetails?.id;
        dispatch(setHoveredConnectionId(pointId));
      }
    },
    [activeSection, dispatch, setMarkerOpen, setHoveredMarker]
  );

  const handleConnectionMarkerHoverAway = useCallback(() => {
    setIsOnRampHover(false);
    setMarkerOpen(false);
    setHoveredMarker(null);
    dispatch(setActiveHoveredDetail(null));
    if (activeSection === TABS.MODEL_CONNECT) {
      dispatch(setHoveredConnectionId(null));
    }
  }, [activeSection, dispatch, setMarkerOpen, setHoveredMarker]);

  const onClusterClick = useCallback(
    (cluster, longitude, latitude) => {
      const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 20);
      mapRef.current?.easeTo({
        center: [longitude, latitude],
        zoom: expansionZoom,
        duration: 500,
      });
    },
    [supercluster]
  );

  const onSpecialClusterClick = useCallback(
    (cluster, leaves) => {
      setSelectedCluster(cluster);
      setSelectedClusterLeaf(leaves);
    },
    [setSelectedCluster, setSelectedClusterLeaf]
  );

  const recursiveClusterIdFetch = cluster => {
    let id = [];
    if (cluster?.properties?.cluster === true) {
      const clusterValues = supercluster.getChildren(cluster?.properties?.cluster_id, cluster?.properties?.point_count);
      clusterValues.forEach(value => {
        if (cluster?.properties?.cluster === true) {
          id = [...id, ...recursiveClusterIdFetch(value)];
        } else {
          // onramps don't have id but name...so push the whole object with parent info into the array
          const res =
            value?.properties?.pointDetails?.parent || value?.properties?.pointDetails?.onRamp
              ? value?.properties?.pointDetails
              : value?.properties?.pointDetails?.id;
          id.push(res);
        }
      });
    } else {
      // onramps don't have id but name...so push the whole object with parent info into the array
      const res =
        cluster?.properties?.pointDetails?.parent || cluster?.properties?.pointDetails?.onRamp
          ? cluster?.properties?.pointDetails
          : cluster?.properties?.pointDetails?.id;
      id.push(res);
    }
    return id;
  };

  const handleConnectionMarkerHoverCluster = useCallback(
    connectInfo => {
      mapRef?.current?.once('mouseover', e => {
        try {
          const clusterValues = supercluster?.getChildren(connectInfo?.properties?.cluster_id, connectInfo?.properties?.point_count);
          if (activeSection === TABS.MODEL_CONNECT) {
            let pointIds = [];
            clusterValues.forEach(x => {
              pointIds = [...pointIds, ...recursiveClusterIdFetch(x)];
            });
            dispatch(setHoveredConnectionId(pointIds));
          }
        } catch (err) {
          console.log(err);
        }
      });
    },
    [activeSection, dispatch, setSelectedMarker, mapRef, supercluster, recursiveClusterIdFetch]
  );

  //handle on mount/unmount
  useEffect(() => {
    dispatch(backendService.getMapToken());
    dispatch(backendService.getProjectDetails(projectId));
    dispatch(backendService.getProjectConnections(projectId));
  }, [currentProjectInfo?.id, routeParams, dispatch]);

  useEffect(() => {
    if (token && isEmpty(geoPoints)) {
      const geocodingClient = GeocodingClient({ accessToken: token });
      if (geocodingClient) {
        const newPoints = detailsFromSelectedProject?.reduce((acc, ad) => {
          if (ad?.type !== 'notes') {
            let query = ad.address ? ad.address : '';
            query += ad?.extras?.city ? ` ${ad.extras.city}` : '';
            query += ad?.extras?.metro ? ` ${ad.extras.metro}` : '';
            query += ad?.extras?.stateProvince ? `, ${ad.extras.stateProvince}` : '';
            query += ad?.extras?.country ? `, ${ad.extras.country}` : '';

            if (ad?.type === 'model' && ad?.extras?.modelType === DISCOVER_REGION_FIELDS.CLOUDS && ad?.extras?.onRamps?.length > 0) {
              for (let i = 0; i < ad.extras.onRamps.length; i += 1) {
                acc.push({
                  id: ad.extras.onRamps[i].name,
                  center: [parseFloat(ad.extras.onRamps[i].geometry?.coordinates?.[0]), parseFloat(ad.extras.onRamps[i].geometry?.coordinates?.[1])],
                  match: null,
                  onRamp: true,
                });
              }
            }

            const alreadyFound = geoPoints.find(e => {
              return e.id === ad.id;
            });

            let skip = false;
            if (ad?.extras?.latitude && ad?.extras?.longitude) {
              skip = true;
              acc.push({
                id: ad.id,
                center: [ad?.extras?.longitude, ad?.extras?.latitude],
                match: null,
              });
            }
            if (!alreadyFound && !isEmpty(query) && !skip) {
              geocodingClient
                .forwardGeocode({
                  query,
                  limit: 1,
                })
                .send()
                .then(response => {
                  const match = response.body;
                  if ((match && match.features[0] && match.features[0].center) || match.center) {
                    acc.push({ id: ad.id, center: match.features[0].center || match.center, match });
                  }
                });
            }
          }
          return acc;
        }, []);
        setGeoPoints(newPoints);
      }
    }
  }, [token, setGeoPoints, detailsFromSelectedProject]);

  useEffect(() => {
    if (geoPoints?.length) {
      const p = activeDetails?.reduce((acc, detail) => {
        const geo = geoPoints.find(e => {
          return e.id === detail.id || e.id === detail.companionId;
        });
        if (geo && geo.center && geo.center[0] && geo.center[1]) {
          acc.push({
            type: 'Feature',
            properties: { cluster: false, id: detail.id, category: detail.type, pointDetails: detail },
            geometry: {
              type: 'Point',
              coordinates: [geo.center[0], geo.center[1]],
            },
          });
        }
        if (detail?.type === 'model' && detail?.extras?.modelType === DISCOVER_REGION_FIELDS.CLOUDS && detail?.extras?.onRamps?.length > 0) {
          for (let i = 0; i < detail.extras.onRamps.length; i += 1) {
            const geo2 = geoPoints.find(e => {
              return e.id === detail.extras.onRamps[i].name;
            });
            if (geo2 && geo2.center && geo2.center[0] && geo2.center[1]) {
              acc.push({
                type: 'Feature',
                properties: { cluster: false, id: detail.id, category: 'onRamp', pointDetails: { ...detail.extras.onRamps[i], onRamp: true, parent: detail } },
                geometry: {
                  type: 'Point',
                  coordinates: [geo2.center[0], geo2.center[1]],
                },
              });
            }
          }
        }
        return acc;
      }, []);

      setPoints(p);
    }
  }, [activeDetails, geoPoints]);

  useEffect(() => {
    if (preSelect) {
      setCurrentLevel(defaultLevel[activeDetail.type]);
      setSubDrawerOpen(true);
      setSelectedRegion(activeDetail.region);
    }
  }, [preSelect]);

  useEffect(() => {
    if (recentlyDeactivated) {
      cleanUpConnections();
      dispatch(setRecentlyDeactivated(null));
      dispatch(backendService.getProjectConnections(projectId));
    }
  }, [recentlyDeactivated, dispatch, currentProjectInfo?.id, routeParams]);

  useEffect(() => {
    if (!isConnect) {
      if (routeParams?.regionId && !routeParams?.detailId) {
        setSubDrawerOpen(true);
        handleSubDrawerChange(false);
        dispatch(setActiveDetail(null));
        setCurrentLevel(MODEL_SUB_PANELS.REGION);
        const regionId = routeParams?.regionId;
        const details = detailsFromSelectedProject.filter(x => x?.id === regionId)?.[0] || 'unknown';
        setSelectedRegion(details);
      } else if (routeParams?.detailId) {
        const detailId = routeParams?.detailId;
        const details = detailsFromSelectedProject.filter(x => x?.id === detailId)?.[0] || 'unknown';
        setSelectedRegion(details);
        const reCreateDetails = { ...details, isFuture: [details.isFuture] };
        dispatch(setActiveDetail(reCreateDetails));
        if (details?.type === 'model') {
          if (details.extras?.modelType === DISCOVER_REGION_FIELDS.CLOUDS) {
            setCurrentLevel(MODEL_SUB_PANELS.CLOUDS);
          } else {
            setCurrentLevel(MODEL_SUB_PANELS.DATACENTER);
          }
        } else {
          setCurrentLevel(details?.type);
        }
        setMarkerOpen(true);
        setSubDrawerOpen(true);
        handleSubDrawerChange(false);
      } else {
        setSubDrawerOpen(false);
        handleSubDrawerChange(true);
      }
    }
  }, [
    isConnect,
    setSubDrawerOpen,
    handleSubDrawerChange,
    detailsFromSelectedProject,
    selectedRegion,
    setSelectedRegion,
    routeParams?.regionId,
    dispatch,
    setCurrentLevel,
    setMarkerOpen,
  ]);

  useEffect(() => {
    dispatch(backendService.getTrueAllActiveIcon({}));
  }, []);

  return (
    <div style={{ height: '100%' }}>
      {!contentAvailable || (!isAdminOrSA && noConnections) ? (
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(110.1deg, rgba(65, 94, 199, 0.9) 0%, rgba(77, 57, 202, 0.9) 100%)',
            color: 'white',
          }}>
          Solution architect will get back to you when Modelling is complete
        </div>
      ) : (
        <>
          <SwipeableDrawer
            disableEnforceFocus
            hideBackdrop
            anchor={drawerRight ? 'right' : 'left'}
            open={subDrawerClosed}
            onClose={() => {}}
            onOpen={() => {}}
            sx={{
              '&.MuiDrawer-root': { marginLeft: '140px', width: '250px' },
              '&.MuiDrawer-paper': { marginLeft: '140px', width: '250px' },
            }}
            PaperProps={{
              style: {
                marginTop: '7px',
                marginLeft: '142px',
                paddingTop: '30px',
                paddingLeft: '10px',
                borderTopRightRadius: '30px',
                borderBottomRightRadius: '30px',
                boxShadow: 'unset',
                border: 'unset',
                minWidth: '250px',
                height: 'calc(97vh - 25px)',
              },
            }}>
            <TabsWrapper value={activeSection} onChange={handleChange} TabIndicatorProps={{ style: { backgroundColor: 'var(--color-batman)' } }}>
              <TabItem label={TABS.MODEL_MODEL} {...a11yProps(0)} value={TABS.MODEL_MODEL} noPadding />
              {allowConnect && <TabItem label={TABS.MODEL_CONNECT} {...a11yProps(1)} value={TABS.MODEL_CONNECT} noPadding />}
              {!allowConnect && <CircularProgress />}
            </TabsWrapper>
            <TabPanel value={activeSection} index={0} mapTo={TABS.MODEL_MODEL}>
              <ModelSideTab
                onSubDrawerClosed={e => {
                  handleSubDrawerChange(e);
                }}
                drawerRight={drawerRight}
                setCurrentLevel={setCurrentLevel}
                currentLevel={currentLevel}
                subDrawerOpen={subDrawerOpen}
                setSubDrawerOpen={setSubDrawerOpen}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
                findAndSetSelectedMarkerForPopup={findAndSetSelectedMarkerForPopup}
                dcListOpen={dcListOpen}
                setDcListOpen={setDcListOpen}
                handleMapRecenter={handleMapRecenter}
                setMarkerOpen={setMarkerOpen}
                geoPoints={geoPoints}
              />
            </TabPanel>
            <TabPanel value={activeSection} index={0} mapTo={TABS.MODEL_CONNECT}>
              <ConnectPanel
                key={`${activeSection}-0-${TABS.MODEL_CONNECT}`}
                onSubDrawerClosed={e => {
                  handleSubDrawerChange(e);
                }}
                drawerRight={drawerRight}
                openConnectRegion={openConnectRegion}
                setOpenConnectRegion={setOpenConnectRegion}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
                setCurrentLevel={setCurrentLevel}
                currentLevel={currentLevel}
                subDrawerOpen={subDrawerOpen}
                setSubDrawerOpen={setSubDrawerOpen}
                geoPoints={geoPoints}
                setDcListOpen={setDcListOpen}
                handleMapRecenter={handleMapRecenter}
              />
            </TabPanel>
          </SwipeableDrawer>
          {!token && (
            <CircularProgressContainer>
              <CircularProgress />
            </CircularProgressContainer>
          )}
          {!!token && (
            <ReactMapGl
              ref={mapRef}
              {...viewState}
              maxZoom={20}
              mapboxAccessToken={token}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                marginLeft: '0px',
                width: DEFAULT_MAP_STYLES.width,
                height: DEFAULT_MAP_STYLES.height,
                zIndex: 0,
              }}
              mapStyle={DEFAULT_MAP_STYLES.mapboxStyle}
              onMove={evt => handleViewStateChange(evt.viewState)}>
              <GeolocateControl position="bottom-right" />
              <NavigationControl position="bottom-right" />
              <Source id="polylineLayer" type="geojson" data={connections}>
                <Layer
                  id="polylineLayer"
                  type="line"
                  source="polylineLayer"
                  layout={{
                    'line-join': 'round',
                    'line-cap': 'round',
                  }}
                  paint={{
                    'line-color': '#3E53C1',
                    'line-width': 2,
                    'line-dasharray': [1, 2],
                  }}
                />
              </Source>
              {clusters?.map(cluster => {
                const longitude = cluster?.geometry?.coordinates?.[0];
                const latitude = cluster?.geometry?.coordinates?.[1];
                const { cluster: isCluster, point_count: pointCount } = cluster.properties;
                const detail = cluster?.properties?.pointDetails;
                const isOnRampMarker = cluster?.properties?.pointDetails?.parent || detail?.onRamp;

                if (isCluster) {
                  const allLeaves = isCluster && supercluster.getLeaves(cluster?.id, pointCount);
                  const pointLength = points?.length || 1;
                  const size = 10 + (pointCount / pointLength) * 40;
                  const leaves = allLeaves?.length ? allLeaves : [];

                  const closedLeafNum = getCloseMarkerNumbers(allLeaves);
                  const isSpecialCluster = closedLeafNum === allLeaves?.length;

                  if (isSpecialCluster) {
                    if (selectedCluster) return <div />;
                    return (
                      <Marker key={`cluster-${cluster?.id}`} latitude={latitude} longitude={longitude}>
                        <MapClusterWrapper size={`${size}px`} noBg onClick={() => onSpecialClusterClick(cluster, leaves)}>
                          <MapClusterConnectionIndicator onLeft>
                            <OpenInFullIcon />
                          </MapClusterConnectionIndicator>
                          <MapClusterInnerWrapper>
                            {getIconFromDetail(
                              '',
                              mergedDetails?.find(d => {
                                return d?.id === leaves?.[0]?.properties?.id || d?.companionId === leaves?.[0]?.properties?.id;
                              }),
                              false,
                              false,
                              true
                            )}
                          </MapClusterInnerWrapper>
                          <MapClusterConnectionIndicator onRight>
                            <MapClusterConnectionIndicatorText>{pointCount}</MapClusterConnectionIndicatorText>
                          </MapClusterConnectionIndicator>
                        </MapClusterWrapper>
                      </Marker>
                    );
                  }

                  return (
                    <Marker key={`cluster-${cluster?.id}`} latitude={latitude} longitude={longitude}>
                      <MapClusterWrapper
                        size={`${size}px`}
                        onMouseOver={() => handleConnectionMarkerHoverCluster(cluster)}
                        onFocus={() => handleConnectionMarkerHoverCluster(cluster)}
                        onMouseLeave={() => handleConnectionMarkerHoverAway()}
                        onClick={() => onClusterClick(cluster, longitude, latitude)}>
                        <MapClusterInnerWrapper>
                          <MapClusterText>{pointCount}</MapClusterText>
                        </MapClusterInnerWrapper>
                      </MapClusterWrapper>
                    </Marker>
                  );
                }

                // for highlight marker on connection side panel hover
                const highlightOnRamp =
                  isOnRampMarker &&
                  ((highlightConnectInfo?.isOnRampOrigin &&
                    highlightConnectInfo?.onRampOrigin?.name === cluster?.properties?.pointDetails?.name &&
                    highlightConnectInfo?.onRampOrigin?.parent?.id === cluster?.properties?.pointDetails?.parent?.id) ||
                    (highlightConnectInfo?.isOnRampEnd &&
                      highlightConnectInfo?.endpoint?.name === cluster?.properties?.pointDetails?.name &&
                      highlightConnectInfo?.endpoint?.parent?.id === cluster?.properties?.pointDetails?.parent?.id));
                const highlightNormal =
                  !isOnRampMarker && (highlightConnectInfo?.originId === cluster?.properties?.id || highlightConnectInfo.endpoint === cluster?.properties?.id);
                const highlightThis = highlightOnRamp || highlightNormal;

                // this is for single marker without clustering
                return (
                  <div
                    key={`marker-container-${cluster?.properties?.id}-${cluster?.properties?.category}-${cluster?.properties?.pointDetails?.name}`}
                    onMouseOver={() => handleConnectionMarkerHover(cluster)}
                    onFocus={() => handleConnectionMarkerHover(cluster)}
                    onMouseLeave={() => handleConnectionMarkerHoverAway()}>
                    <Marker key={`marker-${cluster?.properties?.id}`} latitude={latitude} longitude={longitude} onClick={e => handleMarkerClick(e, cluster)}>
                      <MapClusterLeafIconWrapper>
                        {detail && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="marker-inner-container">
                            {getIconFromDetail(
                              '',
                              detail?.onRamp
                                ? detail
                                : mergedDetails?.find(d => {
                                    return d?.id === detail?.id || d?.companionId === detail?.id;
                                  }),
                              true,
                              highlightThis
                            )}
                          </div>
                        )}
                      </MapClusterLeafIconWrapper>
                    </Marker>
                  </div>
                );
              })}
              {isOnRampHover && markerOpen && hoveredMarker && (
                <MapMarkerPopup
                  longitude={activeHoveredDetail?.geometry?.coordinates?.[0]}
                  latitude={activeHoveredDetail?.geometry?.coordinates?.[1]}
                  anchor="left"
                  onClose={() => {}}>
                  <MarkerPopupContainer>
                    <MarkerPopupCategoryHeaderWrapper>
                      <MarkerPopupCategoryHeaderText>{activeHoveredDetail?.name}</MarkerPopupCategoryHeaderText>
                    </MarkerPopupCategoryHeaderWrapper>
                    <MarkerPopupOnRampSubText>{`${activeHoveredDetail?.parent?.extras?.cloud} - ${activeHoveredDetail?.cloud_region}`}</MarkerPopupOnRampSubText>
                  </MarkerPopupContainer>
                </MapMarkerPopup>
              )}
              {!isOnRampHover &&
                markerOpen &&
                hoveredMarker &&
                (hoveredMarker?.properties?.type !== 'model' || hoveredMarker?.properties?.pointDetails.type !== 'model') &&
                activeHoveredDetail?.extras?.model &&
                Object.values(activeHoveredDetail?.extras?.model)?.some(m => !isEmpty(m)) && (
                  <MapMarkerPopup
                    longitude={hoveredMarker?.geometry?.coordinates?.[0]}
                    latitude={hoveredMarker?.geometry?.coordinates?.[1]}
                    anchor="left"
                    onClose={() => {}}>
                    <MarkerPopupContainer>
                      {activeHoveredDetail?.extras?.model &&
                        Object.keys(activeHoveredDetail?.extras?.model).map(key => {
                          if (panelCategories[key]) {
                            return (
                              <MarkerPopupCategoryContainer key={`popup-${key}`}>
                                <MarkerPopupCategoryHeaderWrapper>
                                  <MarkerPopupCategoryHeaderText>{panelCategories[key]}</MarkerPopupCategoryHeaderText>
                                </MarkerPopupCategoryHeaderWrapper>
                                <MarkerPopupCategoryItemContainer>
                                  {activeHoveredDetail?.extras?.model[key].map(detailId => {
                                    return (
                                      <div key={`popup-${hoveredMarker?.properties?.id}${key}-${detailId}`}>
                                        {getIconFromDetail(
                                          key,
                                          key === GENERIC_TYPE || key === SERVICES_TYPE || key === TECHNOLOGY_ICON_TAG
                                            ? detailId
                                            : mergedDetails?.find(d => {
                                                return d?.id === detailId || d?.companionId === detailId;
                                              })
                                        )}
                                      </div>
                                    );
                                  })}
                                </MarkerPopupCategoryItemContainer>
                                <DRDivider margin="16px 0" />
                              </MarkerPopupCategoryContainer>
                            );
                          }
                          return <span key={`empty-span-${key}`} />;
                        })}
                    </MarkerPopupContainer>
                  </MapMarkerPopup>
                )}
              {selectedCluster && (
                <MapClusterLeafPopup
                  anchor="center"
                  onClose={() => {
                    setSelectedCluster(null);
                    setSelectedClusterLeaf([]);
                    dispatch(setActiveDetail(null));
                    dispatch(setActiveHoveredDetail(null));
                    setCurrentLevel(MODEL_SUB_PANELS.REGION);
                  }}
                  closeOnClick
                  longitude={selectedCluster?.geometry?.coordinates?.[0]}
                  latitude={selectedCluster?.geometry?.coordinates?.[1]}>
                  {renderClusterLeaf()}
                </MapClusterLeafPopup>
              )}
            </ReactMapGl>
          )}
          <ConnectRegionSelectPanel
            open={openConnectRegion && activeSection === TABS.MODEL_CONNECT}
            setOpenConnectRegion={setOpenConnectRegion}
            setCurrentLevel={setCurrentLevel}
            currentLevel={currentLevel}
            subDrawerOpen={subDrawerOpen}
            setSubDrawerOpen={setSubDrawerOpen}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            onSubDrawerClosed={e => {
              handleSubDrawerChange(e);
            }}
          />
        </>
      )}
    </div>
  );
}

Model.defaultProps = {
  drawerRight: false,
  preSelect: false,
  isConnect: false,
};

export default Model;
