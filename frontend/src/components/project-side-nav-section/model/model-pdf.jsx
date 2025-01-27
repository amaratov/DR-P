import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import ReactMapGl, { Marker } from 'react-map-gl';
import { css, Global } from '@emotion/react';
import Client from '@mapbox/mapbox-sdk';
import Static from '@mapbox/mapbox-sdk/services/static';
import { Box } from '@mui/material';
import QuestionMark from '@mui/icons-material/QuestionMark';
import { getSelectedProjectDetails, getSelectedDetailsFromProject, getActiveDetail } from '../../../features/selectors/ui';
import { backendService } from '../../../services/backend';
import { setActiveDetail } from '../../../features/slices/uiSlice';
import { isEmpty, mergeRegions } from '../../../utils/utils';
import { getMapToken } from '../../../features/selectors/config';
import { useGeoPoints } from './hooks';
import { DEFAULT_MAP_STYLES, GENERIC_TYPE, SERVICES_TYPE, TECHNOLOGY_ICON_TAG } from '../../../utils/constants/constants';
import IconBubble from './icon-bubble';
// import CloudDetails from './model-panel-cloud-pdf';
import ConnectionDetails from './model-panel-connection-pdf';
import CustomerLocationDetails from './model-panel-customerLocation-pdf';
import DatacenterDetails from './model-panel-datacenter-pdf';
import { getTrueAllActiveIcons } from '../../../features/selectors/artifactIcon';
import { MapClusterLeafIconWrapper } from './model-styled';

const MAP_HEIGHT = 1280; // This is the current max height for a static map image from mapbox
// This calculation is for having the mapview be 5/8th of the width for A4 Landscape paper
// 0.707 is an approximate ratio for A4 paper dimentions
// 0.625 is 5/8th of what the width of the map needs to be for the layout on the page
const MAP_WIDTH = Math.round((MAP_HEIGHT / 0.707) * 0.625);
const MAP_ZOOM = 12;

const globalStyles = css`
  @page {
    size: A4 landscape;
    margin: 0;
  }
  body {
    font-size: 0.8rem;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  #mapView {
    height: 100vh;
    object-fit: contain;
    object-position: left;
    position: fixed;
    z-index: -1;
  }
  .mapboxgl-ctrl {
    display: none !important;
  }
`;

// function SideActiveDetail({ kind }) {
//   const activeDetail = useSelector(getActiveDetail);

//   if (kind === 'connections') {
//     return <ConnectionDetails />;
//   }

//   if (kind === 'detail') {
//     switch (activeDetail?.type) {
//       case 'clouds':
//         return <CloudDetails />;
//       case 'customerlocations':
//         return <CustomerLocationDetails />;
//       case 'datacenters':
//         return <DatacenterDetails />;
//       default:
//         return <p>This &apos;{activeDetail?.type}&apos; detail is not supported</p>;
//     }
//   }

//   return <p>No info for &apos;{kind}&apos;</p>;
// }

function ModelPDF() {
  const dispatch = useDispatch();
  const [searchParams, _] = useSearchParams();

  const activeDetail = useSelector(getActiveDetail);
  const activeIcons = useSelector(getTrueAllActiveIcons);
  const currentProjectInfo = useSelector(getSelectedProjectDetails);
  const detailsFromSelectedProject = useSelector(getSelectedDetailsFromProject);
  const token = useSelector(getMapToken);

  const geoPoints = useGeoPoints({ activeDetail, details: detailsFromSelectedProject, token });

  const activeDetailPoint = useMemo(() => {
    return (geoPoints[activeDetail?.id] || { features: [] })?.features[0];
  }, [activeDetail?.id, geoPoints]);

  const mapUrl = useMemo(() => {
    if (token && !isEmpty(activeDetailPoint?.center)) {
      const client = Client({ accessToken: token });
      const staticClient = Static(client);
      const [, , , ownerId, styleId] = DEFAULT_MAP_STYLES.mapboxStyle.split('/');
      return staticClient
        .getStaticImage({
          ownerId,
          styleId,
          height: MAP_HEIGHT,
          width: MAP_WIDTH,
          position: {
            coordinates: activeDetailPoint.center,
            zoom: MAP_ZOOM,
          },
        })
        .url();
    }
    return undefined;
  }, [activeDetailPoint?.center, token]);

  const viewState = useMemo(() => {
    return {
      latitude: activeDetailPoint?.center[1] || 0,
      longitude: activeDetailPoint?.center[0] || 0,
      zoom: MAP_ZOOM,
    };
  }, [activeDetailPoint?.center]);

  useEffect(() => {
    dispatch(backendService.getTrueAllActiveIcon({}));
  }, []);

  useEffect(() => {
    const projectId = searchParams.get('projectId');
    if (projectId) {
      dispatch(backendService.getProjectById(projectId));
      dispatch(backendService.getProjectDetails(projectId));
      dispatch(backendService.getMapToken());
    }
  }, [dispatch, searchParams]);

  useEffect(() => {
    if (searchParams.get('kind') === 'connections') {
      const projectId = searchParams.get('projectId');
      dispatch(backendService.getProjectConnections(projectId));
    }
  }, [dispatch, searchParams]);

  useEffect(() => {
    if (searchParams.get('kind') === 'detail') {
      const detailId = searchParams.get('detailId');
      const newActiveDetail = mergeRegions(detailsFromSelectedProject).find(({ id }) => id === detailId);
      dispatch(setActiveDetail(newActiveDetail));
    }
  }, [dispatch, detailsFromSelectedProject, searchParams]);

  const getIconFromDetail = useCallback(
    (key, detail, small, highlightThis, specialClusterIcon) => {
      if (typeof small === 'undefined') {
        small = false;
      }
      if (key === GENERIC_TYPE || key === SERVICES_TYPE || key === TECHNOLOGY_ICON_TAG) {
        const i = (activeIcons || []).find(i => {
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

  return (
    <>
      <Global styles={globalStyles} />
      {mapUrl ? <img id="mapView" alt="map" src={mapUrl} height={MAP_HEIGHT} width={MAP_WIDTH} /> : null}
      <Box display="grid" gridTemplateColumns="5fr 3fr" height="100vh" width="100vw">
        <Box position="relative">
          {token ? (
            <ReactMapGl {...viewState} attributionControl={false} mapboxAccessToken={token} style={{ height: '100vh' }}>
              {activeDetailPoint?.center ? (
                <Marker latitude={activeDetailPoint.center[1]} longitude={activeDetailPoint.center[0]} style={{ position: 'fixed' }}>
                  <MapClusterLeafIconWrapper>
                    {activeDetail && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="marker-inner-container">
                        {getIconFromDetail(
                          '',
                          activeDetail?.onRamp
                            ? activeDetail
                            : detailsFromSelectedProject?.find(d => {
                                return d?.id === activeDetail?.id || d?.companionId === activeDetail?.id;
                              }),
                          true,
                          true
                        )}
                      </div>
                    )}
                  </MapClusterLeafIconWrapper>
                </Marker>
              ) : null}
            </ReactMapGl>
          ) : (
            <h2>Missing token, not able to display Map View Component</h2>
          )}
        </Box>
        {/* <Box display="flex" flexDirection="column" padding="24px 30px">
          <SideActiveDetail kind={searchParams.get('kind')} />
        </Box> */}
      </Box>
    </>
  );
}

ModelPDF.prototype = {};

ModelPDF.defaultProps = {};

export default ModelPDF;
