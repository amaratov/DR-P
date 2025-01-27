import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactMapGl, { GeolocateControl, Layer, Marker, NavigationControl, Source } from 'react-map-gl';
import useSupercluster from 'use-supercluster';
import { CircularProgress } from '@mui/material';
import { QuestionMark } from '@mui/icons-material';
import ParkRoundedIcon from '@mui/icons-material/ParkRounded';
import CloudIcon from '@mui/icons-material/Cloud';
import { DEFAULT_MAP_STYLES, DISCOVER_REGION_FIELDS, GENERIC_TYPE } from '../../../../utils/constants/constants';
import {
  MapClusterInnerWrapper,
  MapClusterLeafGridItem,
  MapClusterLeafGridItemSet,
  MapClusterLeafIconWrapper,
  MapClusterText,
  MapClusterWrapper,
  MapMarkerPopup,
  MarkerPopupCategoryContainer,
  MarkerPopupCategoryHeaderText,
  MarkerPopupCategoryHeaderWrapper,
  MarkerPopupCategoryItemContainer,
  MarkerPopupContainer,
} from '../model-styled';
import { CircularProgressContainer, DRDivider } from '../../../app/app-styled';
import { setViewState } from '../../../../features/slices/mapSlice';
import { getMapViewState } from '../../../../features/selectors/map';
import { getAllConnections } from '../../../../features/selectors/connection';
import IconBubble from '../icon-bubble';

function ModelMap({ token, points, geoPoints, markerOpen, selectedMarker, setSelectedMarker, activeDetail, activeIcons, handleMarkerClick, mergedDetails }) {
  // dispatch
  const dispatch = useDispatch();

  // ref
  const mapRef = useRef();

  // selector
  const viewState = useSelector(getMapViewState);
  const allConnections = useSelector(getAllConnections);

  // state
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [selectedClusterLeaf, setSelectedClusterLeaf] = useState([]);
  const [onTheFly, setOnTheFly] = useState(false);

  // get map bounds
  const bounds = mapRef.current ? mapRef.current.getMap().getBounds().toArray().flat() : null;

  // get clusters
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom: viewState.zoom,
    options: {
      radius: 150,
      maxZoom: 20,
    },
  });

  // memo
  const connections = useMemo(() => {
    const connectionFeatures = allConnections?.reduce((acc, connect) => {
      const originIds = connect?.origins;
      const endId = connect?.endpoint;
      const endGeo = geoPoints?.find(e => {
        return e?.id === endId;
      });
      const endCenter = endGeo?.center;

      const endNotClustered = clusters?.find(c => c.properties.id === endId && !c.properties.clusterd);
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
                properties: { cluster: false, id: connect?.id, category: connect?.type, from: connect?.id, pointDetails: connect },
                geometry: {
                  type: 'LineString',
                  coordinates: [originCenter, endCenter],
                },
              });
            } else if (!endNotClustered && originNotClustered) {
              const endClusteredNewCenter = clusters?.find(c => {
                if (c?.properties?.cluster) {
                  const allLeaves = supercluster?.getLeaves(c.id, c?.properties?.point_count);
                  const hasVal = allLeaves?.length > 0 && allLeaves?.find(l => l?.properties?.id === endId);
                  if (hasVal) return c;
                }
                return null;
              });
              if (endClusteredNewCenter && endClusteredNewCenter?.geometry?.coordinates) {
                acc.push({
                  type: 'Feature',
                  properties: { cluster: false, id: connect?.id, category: connect?.type, from: connect?.id, pointDetails: connect },
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
                  properties: { cluster: false, id: connect?.id, category: connect?.type, from: connect?.id, pointDetails: connect },
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
                  const hasEndVal = allLeaves?.length > 0 && allLeaves?.find(l => l?.properties?.id === endId);
                  if (hasOriginVal) acc.origin = c?.geometry?.coordinates;
                  if (hasEndVal) acc.end = c?.geometry?.coordinates;
                }
                return acc;
              }, {});
              if (clusteredNewCenterObj.origin && clusteredNewCenterObj.end) {
                acc.push({
                  type: 'Feature',
                  properties: { cluster: false, id: connect?.id, category: connect?.type, from: connect?.id, pointDetails: connect },
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

  // const
  const openMarker = markerOpen && selectedMarker && activeDetail?.id === selectedMarker?.properties?.id && activeDetail?.type !== 'model';
  const panelCategories = {
    [DISCOVER_REGION_FIELDS.CLOUDS]: 'Clouds',
    [DISCOVER_REGION_FIELDS.DATA_CENTRES]: 'Data Centers',
    [DISCOVER_REGION_FIELDS.APPLICATIONS]: 'Applications',
    [DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.PARTNERSHIP_AND_SUPPLIERS]: 'Partners / Suppliers',
    [GENERIC_TYPE]: 'Other',
  };

  // func
  const handleViewStateChange = useCallback(
    newViewState => {
      dispatch(setViewState(newViewState));
    },
    [dispatch]
  );

  const getIconFromDetail = useCallback(
    (key, detail, small) => {
      if (typeof small === 'undefined') {
        small = false;
      }
      if (key === GENERIC_TYPE) {
        const i = activeIcons.find(i => {
          return i.id === detail;
        });
        return <IconBubble icon={i} small={small} />;
      }

      if (detail) {
        return <IconBubble detail={detail} small={small} />;
      }

      return <QuestionMark />;
    },
    [activeIcons]
  );

  // can be used for cluster popup or to show some cluster content if needed
  const renderClusterLeaf = () => {
    if (!selectedClusterLeaf) return null;
    const sortedLeaves = selectedClusterLeaf?.reduce((acc, leaf) => {
      const cat = leaf?.properties?.category || 'unknown';
      acc[cat] = acc[cat] || [];
      acc[cat].push(leaf);
      return acc;
    }, {});
    return Object.keys(sortedLeaves)?.map(type => (
      <MapClusterLeafGridItemSet>
        {sortedLeaves[type].map(leaf => (
          <MapClusterLeafGridItem
            key={`park-sorted-${leaf?.properties?.id}`}
            onKeyDown={e => {
              setSelectedMarker(leaf);
            }}
            onClick={e => {
              setSelectedMarker(leaf);
            }}>
            <MapClusterLeafIconWrapper>
              {leaf?.properties?.category === 'cat1' && <ParkRoundedIcon />}
              {leaf?.properties?.category === 'connection' && <CloudIcon />}
            </MapClusterLeafIconWrapper>
          </MapClusterLeafGridItem>
        ))}
      </MapClusterLeafGridItemSet>
    ));
  };

  // effect
  useEffect(() => {
    if (activeDetail) {
      const found = points.find(p => p.properties.id === activeDetail.id);
      // fly animation and set a zoom level so cluster breaks down on the fly
      // mapRef.current?.flyTo({ center: found?.geometry?.coordinates, zoom: 12, duration: 1000 });
      if (found && found?.geometry?.coordinates?.[0] && found?.geometry?.coordinates?.[1])
        handleViewStateChange({ ...viewState, longitude: found?.geometry?.coordinates?.[0], latitude: found?.geometry?.coordinates?.[1] });
    }
  }, [activeDetail, points]);

  if (!token) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
        <CircularProgressContainer>
          <CircularProgress />
        </CircularProgressContainer>
      </div>
    );
  }

  return (
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

        if (isCluster) {
          let connectIndexes = [];
          const allLeaves = isCluster && supercluster.getLeaves(cluster?.id, pointCount);
          const hasFromConnector =
            allLeaves?.length && allLeaves?.find(leaf => connections?.features?.some(connect => connect.properties.from === leaf?.properties?.id));
          if (hasFromConnector) {
            connectIndexes = connections.features.reduce((acc, connect) => {
              if (connect.properties.from === hasFromConnector.properties.id) {
                acc.push(connect.properties.id);
              }
              return acc.sort();
            }, []);
          }
          const pointLength = points?.length || 1;
          const size = 10 + (pointCount / pointLength) * 40;
          const leaves = allLeaves?.length ? allLeaves : [];
          let str = '';
          if (connectIndexes?.length === 1) {
            str = connectIndexes?.[0]?.toString();
          }
          if (connectIndexes?.length > 1) {
            const startIndex = connectIndexes?.[0]?.toString();
            const endIndex = connectIndexes?.[connectIndexes.length - 1]?.toString();
            str = `${startIndex}-${endIndex}`;
          }
          return (
            <Marker key={`cluster-${cluster?.id}`} latitude={latitude} longitude={longitude}>
              <MapClusterWrapper
                size={`${size}px`}
                onClick={() => {
                  // setSelectedCluster(cluster);
                  // setSelectedClusterLeaf(leaves);

                  const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 20);
                  mapRef.current?.easeTo({
                    center: [longitude, latitude],
                    zoom: expansionZoom,
                    duration: 500,
                  });
                }}>
                <MapClusterInnerWrapper>
                  <MapClusterText>{pointCount}</MapClusterText>
                </MapClusterInnerWrapper>
                {/*{!isEmpty(str) && (*/}
                {/*  <MapClusterConnectionIndicator>*/}
                {/*    <MapClusterConnectionIndicatorText>{str}</MapClusterConnectionIndicatorText>*/}
                {/*  </MapClusterConnectionIndicator>*/}
                {/*)}*/}
              </MapClusterWrapper>
            </Marker>
          );
        }

        // this is for single marker without clustering
        return (
          <Marker key={`park-${cluster?.properties?.id}`} latitude={latitude} longitude={longitude} onClick={e => handleMarkerClick(e, cluster)}>
            <MapClusterLeafIconWrapper>
              {detail && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="marker-inner-container">
                  {getIconFromDetail(
                    '',
                    mergedDetails?.find(d => {
                      return d?.id === detail?.id || d?.companionId === detail?.id;
                    }),
                    true
                  )}
                </div>
              )}
            </MapClusterLeafIconWrapper>
          </Marker>
        );
      })}
      {openMarker && (
        <MapMarkerPopup
          longitude={selectedMarker?.geometry?.coordinates?.[0]}
          latitude={selectedMarker?.geometry?.coordinates?.[1]}
          anchor="left"
          onClose={() => {}}>
          <MarkerPopupContainer>
            {activeDetail?.extras?.model &&
              Object.keys(activeDetail?.extras?.model).map(key => {
                if (panelCategories[key]) {
                  return (
                    <MarkerPopupCategoryContainer key={`popup-${key}`}>
                      <MarkerPopupCategoryHeaderWrapper>
                        <MarkerPopupCategoryHeaderText>{panelCategories[key]}</MarkerPopupCategoryHeaderText>
                      </MarkerPopupCategoryHeaderWrapper>
                      <MarkerPopupCategoryItemContainer>
                        {activeDetail?.extras?.model[key].map(detailId => {
                          return (
                            <div key={`popup-${selectedMarker?.properties?.id}${key}-${detailId}`}>
                              {getIconFromDetail(
                                key,
                                key === GENERIC_TYPE
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
      {/*{selectedCluster && (*/}
      {/*  <MapClusterLeafPopup*/}
      {/*    anchor="center"*/}
      {/*    onClose={() => {*/}
      {/*      setSelectedCluster(null);*/}
      {/*      setSelectedClusterLeaf([]);*/}
      {/*    }}*/}
      {/*    closeOnClick*/}
      {/*    longitude={selectedCluster?.geometry?.coordinates?.[0]}*/}
      {/*    latitude={selectedCluster?.geometry?.coordinates?.[1]}>*/}
      {/*    <MapClusterLeafGrid>{renderClusterLeaf()}</MapClusterLeafGrid>*/}
      {/*  </MapClusterLeafPopup>*/}
      {/*)}*/}
    </ReactMapGl>
  );
}

export default ModelMap;
