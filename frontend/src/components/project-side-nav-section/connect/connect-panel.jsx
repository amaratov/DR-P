import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import GeocodingClient from '@mapbox/mapbox-sdk/services/geocoding';
import PropTypes from 'prop-types';
import { Chip, CircularProgress, SwipeableDrawer } from '@mui/material';
import { QuestionMark } from '@mui/icons-material';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import {
  ModelPanelConnectionMainWrapper,
  ModelPanelMainHeader,
  ModelPanelMainHeaderEditNotesAction,
  ModelPanelMainHeaderText,
  ModelPanelMainWrapper,
  ModelPanelVerticalDivider,
} from '../model/model-styled';
import {
  DISCOVER_REGION_FIELDS,
  FEATURE_CONFIG,
  HOSTING_PREFERNCES,
  MODEL_DETAIL_TYPE,
  MODEL_SUB_PANELS,
  REGION_TYPE,
  REGIONAL_ONRAMP_TYPE,
} from '../../../utils/constants/constants';
import { backendService } from '../../../services/backend';
import { getAllConnections, getEditExistingConnect } from '../../../features/selectors/connection';
import { DRDivider } from '../../app/app-styled';
import ModelPanelRegion from '../model/model-panel-region';
import { convertIndexToDoubleDigi, getDGXValueForCity, isEmpty, mergeRegions } from '../../../utils/utils';
import {
  ConnectionCardItemAvatar,
  ConnectionCardItemAvatarImage,
  ConnectionCardItemContainer,
  ConnectionCardItemInfo,
  ConnectionCardItemMainText,
  ConnectionCardItemSubText,
  ConnectionCardTitle,
  ConnectionCardWrapper,
  ConnectionEditExistingBtn,
  ConnectionExistingDividerContainer,
  ConnectionVerticalDashLine,
} from './connect-styled';
import {
  getSelectedDetailsFromProject,
  getSelectedProjectDetails,
  getLocationLatency,
  getLocationDGx,
  getLocationLatencyOnLoad,
} from '../../../features/selectors/ui';
import { getTrueAllActiveIcons } from '../../../features/selectors/artifactIcon';
import AddEditConnectionPanel from './add-edit-connection-panel';
import { setEditExistingConnect } from '../../../features/slices/connectionSlice';
import ConnectNotesPanel from './connect-notes-panel';
import ModelPanelDatacenter from '../model/model-panel-datacenter';
import ModelPanelCustomerLocation from '../model/model-panel-customerLocation';
import ModelPanelCloud from '../model/model-panel-cloud';
import { getHoveredConnectionId } from '../../../features/selectors/map';
import { setHighlightConnectionInfo } from '../../../features/slices/mapSlice';
import { toggleLocationLatencyOnLoad } from '../../../features/slices/uiSlice';
import { getWhoAmI } from '../../../features/selectors';
import { getMapToken } from '../../../features/selectors/config';

function ConnectPanel({
  openConnectRegion,
  setOpenConnectRegion,
  selectedRegion,
  currentLevel,
  setCurrentLevel,
  subDrawerOpen,
  setSubDrawerOpen,
  onSubDrawerClosed,
  geoPoints,
  dcListOpen,
  setDcListOpen,
  handleMapRecenter,
  drawerRight,
}) {
  // dispatch
  const dispatch = useDispatch();

  // params
  const routeParams = useParams();

  // selector
  const whoami = useSelector(getWhoAmI);
  const allConnections = useSelector(getAllConnections);
  const detailsFromSelectedProject = useSelector(getSelectedDetailsFromProject);
  const activeIcons = useSelector(getTrueAllActiveIcons);
  const editExistingConnect = useSelector(getEditExistingConnect);
  const currentProjectInfo = useSelector(getSelectedProjectDetails);
  const latencies = useSelector(getLocationLatency);
  const dgx = useSelector(getLocationDGx);
  const hoveredId = useSelector(getHoveredConnectionId);
  const locationLatencyOnLoad = useSelector(getLocationLatencyOnLoad);
  const token = useSelector(getMapToken);

  // const
  const projectId = currentProjectInfo?.id || routeParams?.id || 'unknown';
  const useRole = whoami?.role?.name?.toLowerCase() || '';
  const isAdminOrSA = FEATURE_CONFIG.ADMIN_AND_SA_ONLY.access_group.includes(useRole);

  // state
  const [connectionData, setConnectionData] = useState({
    name: null,
    notes: null,
    projectId,
    origins: [],
    onRampOrigins: [],
    originTypes: [],
    endpoint: null,
    onRampEndpoint: null,
    endpointType: null,
  });
  const [isEndpoint, setIsEndpoint] = useState(false);
  const [openNotePanel, setOpenNotePanel] = useState(false);
  const [addressesMap, setAddressesMap] = useState([]);
  const [isReadyForLatency, setIsReadyForLatency] = useState(false);

  // func
  const handleOpenEditNotes = useCallback(
    connect => {
      setOpenNotePanel(true);
      dispatch(setEditExistingConnect(connect));
    },
    [setOpenNotePanel, dispatch]
  );

  const renderExistingPointItem = (originId, endId, isEndOnRamp) => {
    // origin
    const aKey = `id-${Math.random().toString(16).slice(2)}`;
    const foundDetail = detailsFromSelectedProject.find(d => d?.id === originId);
    const isDataCenter = foundDetail?.type === DISCOVER_REGION_FIELDS.DATA_CENTRES;
    const isCustomerLocation = foundDetail?.type === DISCOVER_REGION_FIELDS.CUSTOMER_LOCATIONS;
    const displayNamed = foundDetail?.named;
    const city = foundDetail?.extras?.city || 'unknown';
    const province = foundDetail?.extras?.stateProvince || 'unknown';
    const country = foundDetail?.extras?.country || 'unknown';
    const displayLocationInfo = `${city}, ${province}, ${country}`;
    const finalDisplayText = isDataCenter ? displayLocationInfo : displayNamed;
    const numOfOffices = foundDetail?.extras?.numberOfLocations || 0;
    const totalUsers = foundDetail?.extras?.totalUsers || 0;
    const previewUrl = activeIcons?.find(e => {
      if (foundDetail?.type === DISCOVER_REGION_FIELDS.DATA_CENTRES) {
        return e.iconName === foundDetail?.extras?.hosting;
      }
      if (foundDetail?.type === DISCOVER_REGION_FIELDS.CUSTOMER_LOCATIONS) {
        return e.iconName === foundDetail?.extras?.officeType;
      }
      //dr data center
      if (foundDetail?.type === MODEL_DETAIL_TYPE && foundDetail?.extras?.modelType === DISCOVER_REGION_FIELDS.DATA_CENTRES) {
        return e.iconName === HOSTING_PREFERNCES[0];
      }
      //cloud region
      if (foundDetail?.type === MODEL_DETAIL_TYPE && foundDetail?.extras?.modelType === DISCOVER_REGION_FIELDS.CLOUDS) {
        return e.iconName === foundDetail?.named;
      }
      return e.iconName === foundDetail?.named;
    })?.storageLocation;
    // get dgx
    const foundDgx = getDGXValueForCity(foundDetail, dgx);

    // endpoint
    const endKey = `end-id-${Math.random().toString(16).slice(2)}`;
    const foundEndDetail = isEndOnRamp ? null : detailsFromSelectedProject.find(d => d?.id === endId);
    const isEndpointDataCenter = foundEndDetail?.type === DISCOVER_REGION_FIELDS.DATA_CENTRES;
    const isEndpoiontCustomerLocation = foundEndDetail?.type === DISCOVER_REGION_FIELDS.CUSTOMER_LOCATIONS;
    const endpoingDisplayNamed = isEndOnRamp ? endId?.name : foundEndDetail?.named;
    const endpointCity = foundEndDetail?.extras?.city || 'unknown';
    const endpointProvince = foundEndDetail?.extras?.stateProvince || 'unknown';
    const endpointCountry = foundEndDetail?.extras?.country || 'unknown';
    const endpointDisplayLocationInfo = `${endpointCity}, ${endpointProvince}, ${endpointCountry}`;
    const endpointFinalDisplayText = isEndpointDataCenter ? endpointDisplayLocationInfo : endpoingDisplayNamed;
    const endpointNumOfOffices = foundEndDetail?.extras?.numberOfLocations || 0;
    const endpointTotalUsers = foundEndDetail?.extras?.totalUsers || 0;
    const endpointPreviewUrl = activeIcons?.find(e => {
      if (isEndOnRamp) {
        const foundOnRampParent = mergeRegions(detailsFromSelectedProject)?.find(d => d?.extras?.active && d?.id === endId?.parent?.id);
        const cloudName = foundOnRampParent?.extras?.cloud || '';
        const onRampIconName = `${cloudName} onramp`;
        return e?.tag === 'onramps' && e?.iconName?.toLowerCase() === onRampIconName?.toLowerCase();
      }
      if (foundEndDetail?.type === DISCOVER_REGION_FIELDS.DATA_CENTRES) {
        return e.iconName === foundEndDetail?.extras?.hosting;
      }
      if (foundEndDetail?.type === DISCOVER_REGION_FIELDS.CUSTOMER_LOCATIONS) {
        return e.iconName === foundEndDetail?.extras?.officeType;
      }
      //dr data center
      if (foundEndDetail?.type === MODEL_DETAIL_TYPE && foundEndDetail?.extras?.modelType === DISCOVER_REGION_FIELDS.DATA_CENTRES) {
        return e.iconName === HOSTING_PREFERNCES[0];
      }
      //cloud region
      if (foundEndDetail?.type === MODEL_DETAIL_TYPE && foundEndDetail?.extras?.modelType === DISCOVER_REGION_FIELDS.CLOUDS) {
        return e.iconName.toLowerCase() === foundEndDetail?.extras?.cloud?.toLowerCase();
      }

      return e.iconName === foundEndDetail?.named;
    })?.storageLocation;
    const foundEndDgx = isEndOnRamp ? undefined : getDGXValueForCity(foundEndDetail, dgx);

    const isLoadingLatency = locationLatencyOnLoad?.find(l => {
      if (isEndOnRamp) {
        return l?.originId === originId && l?.endpointId === endId?.name && l?.onRampEndParentId === endId?.parent?.id;
      }
      return l.originId === originId && l.endpointId === endId;
    });
    const foundLatency = latencies?.find(l => {
      if (isEndOnRamp) {
        return l?.originId === originId && l?.endpointId === endId?.name && l?.onRampEndParentId === endId?.parent?.id;
      }
      return l.originId === originId && l.endpointId === endId;
    });
    const latencyLabel = `${Math.floor(foundLatency?.latency).toString() || '?'} ms`;
    const hideLatency = !isLoadingLatency && !foundLatency?.latency;

    return (
      <>
        <ConnectionCardItemContainer key={aKey}>
          <ConnectionCardItemAvatar>
            {previewUrl ? (
              <ConnectionCardItemAvatarImage previewUrl={previewUrl} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                <QuestionMark />
              </div>
            )}
          </ConnectionCardItemAvatar>
          <ConnectionCardItemInfo>
            <ConnectionCardItemMainText>{finalDisplayText}</ConnectionCardItemMainText>
            {isDataCenter && <ConnectionCardItemSubText useCapitalize>{foundDetail?.extras?.hosting}</ConnectionCardItemSubText>}
            {(isDataCenter || isCustomerLocation) && !isEmpty(foundDgx) && <ConnectionCardItemSubText>DGX: {foundDgx}</ConnectionCardItemSubText>}
            {isCustomerLocation && (!isEmpty(numOfOffices) || !isEmpty(totalUsers)) && (
              <ConnectionCardItemSubText>
                {numOfOffices} offices - {totalUsers} Users
              </ConnectionCardItemSubText>
            )}
          </ConnectionCardItemInfo>
        </ConnectionCardItemContainer>
        <ConnectionExistingDividerContainer>
          <div style={{ width: '30%' }}>
            <ConnectionVerticalDashLine />
          </div>
          <div style={{ width: '30%' }}>
            <DRDivider margin="16px 8px 14px 0" />
          </div>
          <div style={{ width: '30%' }}>
            {!hideLatency && (
              <Chip
                label={isLoadingLatency ? <CircularProgress sx={{ maxWidth: '20px', maxHeight: '20px', color: '#fff' }} /> : latencyLabel}
                style={{ color: 'white', backgroundColor: 'var(--color-homeworld)', opacity: '1' }}
              />
            )}
          </div>
        </ConnectionExistingDividerContainer>
        {/*end point*/}
        <ConnectionCardItemContainer key={endKey}>
          <ConnectionCardItemAvatar>
            {endpointPreviewUrl ? (
              <ConnectionCardItemAvatarImage previewUrl={endpointPreviewUrl} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                <QuestionMark />
              </div>
            )}
          </ConnectionCardItemAvatar>
          <ConnectionCardItemInfo>
            <ConnectionCardItemMainText>{endpointFinalDisplayText}</ConnectionCardItemMainText>
            {isEndOnRamp && <ConnectionCardItemSubText>{`${endId?.parent?.extras?.cloud} - ${endId?.cloud_region}`}</ConnectionCardItemSubText>}
            {isEndpointDataCenter && <ConnectionCardItemSubText useCapitalize>{foundEndDetail?.extras?.hosting}</ConnectionCardItemSubText>}
            {(isEndpointDataCenter || isEndpoiontCustomerLocation) && !isEmpty(foundEndDgx) && (
              <ConnectionCardItemSubText>DGX: {foundEndDgx}</ConnectionCardItemSubText>
            )}
            {isEndpoiontCustomerLocation && (!isEmpty(endpointNumOfOffices) || !isEmpty(endpointTotalUsers)) && (
              <ConnectionCardItemSubText>
                {endpointNumOfOffices} offices - {endpointTotalUsers} Users
              </ConnectionCardItemSubText>
            )}
          </ConnectionCardItemInfo>
        </ConnectionCardItemContainer>
      </>
    );
  };

  const renderExistingOnRampPointItem = (origin, end, isEndOnRamp) => {
    // origin
    const aKey = `id-${Math.random().toString(16).slice(2)}`;
    const originParentDetail = origin?.parent;

    const previewUrl = activeIcons?.find(e => {
      const foundOnRampParent = mergeRegions(detailsFromSelectedProject)?.find(d => d?.extras?.active && d?.id === originParentDetail?.id);
      const cloudName = foundOnRampParent?.extras?.cloud || '';
      const onRampIconName = `${cloudName} onramp`;
      return e?.tag === 'onramps' && e?.iconName?.toLowerCase() === onRampIconName?.toLowerCase();
    })?.storageLocation;

    // endpoint
    const endKey = `end-id-${Math.random().toString(16).slice(2)}`;
    const foundEndDetail = isEndOnRamp ? null : detailsFromSelectedProject.find(d => d?.id === end);
    const isEndpointDataCenter = foundEndDetail?.type === DISCOVER_REGION_FIELDS.DATA_CENTRES;
    const isEndpoiontCustomerLocation = foundEndDetail?.type === DISCOVER_REGION_FIELDS.CUSTOMER_LOCATIONS;
    const endpoingDisplayNamed = isEndOnRamp ? end?.name : foundEndDetail?.named;
    const endpointCity = foundEndDetail?.extras?.city || 'unknown';
    const endpointProvince = foundEndDetail?.extras?.stateProvince || 'unknown';
    const endpointCountry = foundEndDetail?.extras?.country || 'unknown';
    const endpointDisplayLocationInfo = `${endpointCity}, ${endpointProvince}, ${endpointCountry}`;
    const endpointFinalDisplayText = isEndpointDataCenter ? endpointDisplayLocationInfo : endpoingDisplayNamed;
    const endpointNumOfOffices = foundEndDetail?.extras?.numberOfLocations || 0;
    const endpointTotalUsers = foundEndDetail?.extras?.totalUsers || 0;
    const endpointPreviewUrl = activeIcons?.find(e => {
      if (isEndOnRamp) {
        const foundOnRampParent = mergeRegions(detailsFromSelectedProject)?.find(d => d?.extras?.active && d?.id === end?.parent?.id);
        const cloudName = foundOnRampParent?.extras?.cloud || '';
        const onRampIconName = `${cloudName} onramp`;
        return e?.tag === 'onramps' && e?.iconName?.toLowerCase() === onRampIconName?.toLowerCase();
      }
      if (foundEndDetail?.type === DISCOVER_REGION_FIELDS.DATA_CENTRES) {
        return e.iconName === foundEndDetail?.extras?.hosting;
      }
      if (foundEndDetail?.type === DISCOVER_REGION_FIELDS.CUSTOMER_LOCATIONS) {
        return e.iconName === foundEndDetail?.extras?.officeType;
      }
      //dr data center
      if (foundEndDetail?.type === MODEL_DETAIL_TYPE && foundEndDetail?.extras?.modelType === DISCOVER_REGION_FIELDS.DATA_CENTRES) {
        return e.iconName === HOSTING_PREFERNCES[0];
      }
      //cloud region
      if (foundEndDetail?.type === MODEL_DETAIL_TYPE && foundEndDetail?.extras?.modelType === DISCOVER_REGION_FIELDS.CLOUDS) {
        return e?.iconName?.toLowerCase() === foundEndDetail?.extras?.cloud?.toLowerCase();
      }
      return e.iconName === foundEndDetail?.named;
    })?.storageLocation;
    const foundEndDgx = isEndOnRamp ? undefined : getDGXValueForCity(foundEndDetail, dgx);

    const isLoadingLatency = locationLatencyOnLoad?.find(l => {
      if (isEndOnRamp) {
        return (
          l?.originId === origin?.name &&
          l?.endpointId === end?.name &&
          l?.onRampOriginParentId === origin?.parent?.id &&
          l?.onRampEndParentId === end?.parent?.id
        );
      }
      return l.originId === origin.name && l.endpointId === end;
    });
    const foundLatency = latencies?.find(l => {
      if (isEndOnRamp) {
        return (
          l?.originId === origin?.name &&
          l?.endpointId === end?.name &&
          l?.onRampOriginParentId === origin?.parent?.id &&
          l?.onRampEndParentId === end?.parent?.id
        );
      }
      return l.originId === origin.name && l.endpointId === end;
    });
    const latencyLabel = `${Math.floor(foundLatency?.latency).toString() || '?'} ms`;
    const hideLatency = !isLoadingLatency && !foundLatency?.latency;

    return (
      <>
        <ConnectionCardItemContainer key={aKey}>
          <ConnectionCardItemAvatar>
            {previewUrl ? (
              <ConnectionCardItemAvatarImage previewUrl={previewUrl} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                <QuestionMark />
              </div>
            )}
          </ConnectionCardItemAvatar>
          <ConnectionCardItemInfo>
            <ConnectionCardItemMainText>{origin.name}</ConnectionCardItemMainText>
            <ConnectionCardItemSubText>{`${originParentDetail?.extras?.cloud} - ${origin?.cloud_region}`}</ConnectionCardItemSubText>
          </ConnectionCardItemInfo>
        </ConnectionCardItemContainer>
        <ConnectionExistingDividerContainer>
          <div style={{ width: '30%' }}>
            <ConnectionVerticalDashLine />
          </div>
          <div style={{ width: '30%' }}>
            <DRDivider margin="16px 8px 14px 0" />
          </div>
          <div style={{ width: '30%' }}>
            {!hideLatency && (
              <Chip
                label={isLoadingLatency ? <CircularProgress sx={{ maxWidth: '20px', maxHeight: '20px', color: '#fff' }} /> : latencyLabel}
                style={{ color: 'white', backgroundColor: 'var(--color-homeworld)', opacity: '1' }}
              />
            )}
          </div>
        </ConnectionExistingDividerContainer>
        {/*end point*/}
        <ConnectionCardItemContainer key={endKey}>
          <ConnectionCardItemAvatar>
            {endpointPreviewUrl ? (
              <ConnectionCardItemAvatarImage previewUrl={endpointPreviewUrl} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                <QuestionMark />
              </div>
            )}
          </ConnectionCardItemAvatar>
          <ConnectionCardItemInfo>
            <ConnectionCardItemMainText>{endpointFinalDisplayText}</ConnectionCardItemMainText>
            {isEndOnRamp && <ConnectionCardItemSubText>{`${end?.parent?.extras?.cloud} - ${end?.cloud_region}`}</ConnectionCardItemSubText>}
            {isEndpointDataCenter && <ConnectionCardItemSubText useCapitalize>{foundEndDetail?.extras?.hosting}</ConnectionCardItemSubText>}
            {(isEndpointDataCenter || isEndpoiontCustomerLocation) && !isEmpty(foundEndDgx) && (
              <ConnectionCardItemSubText>DGX: {foundEndDgx}</ConnectionCardItemSubText>
            )}
            {isEndpoiontCustomerLocation && (!isEmpty(endpointNumOfOffices) || !isEmpty(endpointTotalUsers)) && (
              <ConnectionCardItemSubText>
                {endpointNumOfOffices} offices - {endpointTotalUsers} Users
              </ConnectionCardItemSubText>
            )}
          </ConnectionCardItemInfo>
        </ConnectionCardItemContainer>
      </>
    );
  };

  // effect
  useEffect(() => {
    dispatch(backendService.getMapToken());
  }, [dispatch]);

  useEffect(() => {
    const pid = currentProjectInfo?.id || projectId;
    dispatch(backendService.getProjectConnections(pid));
    dispatch(backendService.getProjectDetails(pid));
  }, [dispatch, currentProjectInfo, projectId]);

  useEffect(() => {
    if (token) {
      if (detailsFromSelectedProject && detailsFromSelectedProject?.length > 0) {
        const activeCloudRegionNum = detailsFromSelectedProject?.reduce((acc, c) => {
          if (c?.type === 'model' && c?.extras?.modelType === 'clouds' && c?.extras?.active) {
            acc += 1;
          }
          return acc;
        }, 0);

        if (isEmpty(addressesMap) && activeCloudRegionNum > 0) {
          const geocodingClient = GeocodingClient({ accessToken: token });
          if (geocodingClient) {
            detailsFromSelectedProject?.forEach(p => {
              if (p?.type === 'model' && p?.extras?.modelType === 'clouds' && p?.extras?.active) {
                geocodingClient
                  .reverseGeocode({ query: [parseFloat(p?.extras?.geometry?.coordinates?.[0]), parseFloat(p?.extras?.geometry?.coordinates?.[1])] })
                  .send()
                  .then(res => {
                    setAddressesMap([
                      ...addressesMap,
                      { center: res?.body?.features?.[0]?.center, place_name: res?.body?.features?.[0]?.place_name, pointDetails: p },
                    ]);
                  });
              }
            });
          }
        }
      }
    }
  }, [token, detailsFromSelectedProject, setAddressesMap]);

  useEffect(() => {
    if (token && detailsFromSelectedProject && detailsFromSelectedProject?.length > 0) {
      const activeCloudRegionNum = detailsFromSelectedProject?.reduce((acc, c) => {
        if (c?.type === 'model' && c?.extras?.modelType === 'clouds' && c?.extras?.active) {
          acc += 1;
        }
        return acc;
      }, 0);
      if (addressesMap?.length === activeCloudRegionNum) setIsReadyForLatency(true);
    }
  }, [token, detailsFromSelectedProject, addressesMap, setIsReadyForLatency]);

  useEffect(() => {
    allConnections?.forEach(connect => {
      const isOnRampEnd = connect.endpointType === REGIONAL_ONRAMP_TYPE;
      const endpoint = isOnRampEnd
        ? connect.onRampEndpoint
        : detailsFromSelectedProject.find(d => {
            return connect.endpoint === d.id;
          });

      const endpointRegion = isOnRampEnd
        ? detailsFromSelectedProject.find(d => {
            return d.type === REGION_TYPE && d.region === endpoint?.parent?.region;
          })
        : detailsFromSelectedProject.find(d => {
            return d.type === REGION_TYPE && d.region === endpoint?.region;
          });

      if (!isOnRampEnd) {
        const endpointDGXParams = {
          subregion: endpointRegion?.region,
          city: endpoint?.city,
          year: new Date().getFullYear(),
        };
        dispatch(backendService.getLocationDGx(endpointDGXParams));
      }

      const formatAddress = (det, isCloudRegion) => {
        let rAddr = '';
        if (det?.extras?.address && det?.type === MODEL_DETAIL_TYPE && det?.extras?.modelType === DISCOVER_REGION_FIELDS.DATA_CENTRES) {
          rAddr = det.extras.address;
        }

        if (det?.extras?.city) {
          rAddr += rAddr.length > 0 ? `, ${det.extras.city}` : det.extras.city;
        }

        if (!det?.extras?.city && det?.extras?.metro) {
          rAddr += rAddr.length > 0 ? `, ${det.extras.metro}` : det.extras.metro;
        }

        if (det?.extras?.stateProvince) {
          rAddr += rAddr.length > 0 ? `, ${det.extras.stateProvince}` : det.extras.stateProvince;
        }
        if (det?.extras?.country) {
          rAddr += rAddr.length > 0 ? `, ${det.extras.country}` : det.extras.country;
        }

        if (isCloudRegion) {
          const found = addressesMap?.find(m => m?.pointDetails?.id === det?.id)?.place_name;
          if (found) rAddr = found;
        }

        return rAddr;
      };

      // regular origins
      connect.origins?.forEach(originId => {
        const origin = detailsFromSelectedProject.find(d => {
          return originId === d.id;
        });
        const isOriginCloudRegion = origin?.type === 'model' && origin?.extras?.modelType === 'clouds' && origin?.extras?.active;
        const isEndCloudRegion = !isOnRampEnd && endpoint?.type === 'model' && endpoint?.extras?.modelType === 'clouds' && endpoint?.extras?.active;
        const endAddress = isOnRampEnd ? endpoint.name : formatAddress(endpoint, isEndCloudRegion);
        const originAddress = formatAddress(origin, isOriginCloudRegion);

        const latencyParams = {
          isOnRampOrigin: false,
          isOnRampEnd,
          originId,
          endpointId: isOnRampEnd ? endpoint?.name : endpoint?.id,
          onRampOriginParentId: null,
          onRampEndParentId: isOnRampEnd ? endpoint?.parent?.id : null,
          address: originAddress,
          address2: endAddress,
        };
        // added this action to track and show the loading state, as getting latency is a single action
        dispatch(
          toggleLocationLatencyOnLoad({
            originId,
            endpointId: isOnRampEnd ? endpoint.name : endpoint?.id,
            onRampOriginParentId: null,
            onRampEndParentId: isOnRampEnd ? endpoint?.parent?.id : null,
            isOnRampOrigin: false,
            isOnRampEnd,
          })
        );
        if (!isEmpty(latencyParams.address) && !isEmpty(latencyParams.address2)) dispatch(backendService.getLocationLatency(latencyParams));

        if (!isOnRampEnd) {
          const originRegion = detailsFromSelectedProject.find(d => {
            return d.type === REGION_TYPE && d.region === endpoint?.region;
          });
          const endpointDGXParams = {
            subregion: originRegion?.region,
            city: origin?.city,
            year: new Date().getFullYear(),
          };
          dispatch(backendService.getLocationDGx(endpointDGXParams));
        }
      });

      // onRamp origins
      connect.onRampOrigins?.forEach(onRampOrigin => {
        const isEndCloudRegion = !isOnRampEnd && endpoint?.type === 'model' && endpoint?.extras?.modelType === 'clouds' && endpoint?.extras?.active;
        const endAddress = isOnRampEnd ? endpoint.name : formatAddress(endpoint, isEndCloudRegion);
        const latencyParams = {
          isOnRampOrigin: true,
          isOnRampEnd,
          originId: onRampOrigin.name,
          endpointId: isOnRampEnd ? endpoint?.name : endpoint?.id,
          onRampOriginParentId: onRampOrigin?.parent?.id,
          onRampEndParentId: isOnRampEnd ? endpoint?.parent?.id : null,
          address: onRampOrigin.name,
          address2: endAddress,
        };
        // added this action to track and show the loading state, as getting latency is a single action
        dispatch(
          toggleLocationLatencyOnLoad({
            originId: onRampOrigin?.name,
            endpointId: isOnRampEnd ? endpoint?.name : endpoint?.id,
            onRampOriginParentId: onRampOrigin?.parent?.id,
            onRampEndParentId: isOnRampEnd ? endpoint?.parent?.id : null,
            isOnRampOrigin: true,
            isOnRampEnd,
          })
        );
        if (!isEmpty(latencyParams.address) && !isEmpty(latencyParams.address2)) dispatch(backendService.getLocationLatency(latencyParams));
      });
    });
  }, [allConnections, addressesMap, dispatch]);

  return (
    <>
      <ModelPanelMainWrapper>
        {allConnections?.length > 0 &&
          allConnections?.map(connect => {
            if (!isEmpty(editExistingConnect) && editExistingConnect?.id === connect?.id && isAdminOrSA) {
              return (
                <AddEditConnectionPanel
                  openConnectRegion={openConnectRegion}
                  setOpenConnectRegion={setOpenConnectRegion}
                  setIsEndpoint={setIsEndpoint}
                  allConnections={allConnections}
                  detailsFromSelectedProject={detailsFromSelectedProject}
                  activeIcons={activeIcons}
                  connectionData={connectionData}
                  setConnectionData={setConnectionData}
                  editExistingConnect={editExistingConnect}
                  dgx={dgx}
                  isAdminOrSA={isAdminOrSA}
                />
              );
            }
            return (
              <ModelPanelConnectionMainWrapper>
                <ModelPanelMainHeader>
                  <ModelPanelMainHeaderText>{connect?.name}</ModelPanelMainHeaderText>
                  <ModelPanelVerticalDivider />
                  <ModelPanelMainHeaderEditNotesAction onClick={() => handleOpenEditNotes(connect)}>
                    <ChatBubbleOutlineOutlinedIcon />
                  </ModelPanelMainHeaderEditNotesAction>
                </ModelPanelMainHeader>
                {connect?.origins?.map((originId, index) => {
                  const isOnRampEnd = !isEmpty(connect?.onRampEndpoint);
                  const connectEnd = isOnRampEnd ? connect.onRampEndpoint : connect.endpoint;
                  const hoveredOnRamp = hoveredId?.onRamp || !isEmpty(hoveredId?.parent);
                  const isHoveredArr = Array.isArray(hoveredId);
                  const highlightedOnRamp =
                    !isHoveredArr && hoveredOnRamp && isOnRampEnd && hoveredId?.name === connectEnd?.name && hoveredId?.parent?.id === connectEnd?.parent?.id;
                  const highlightedNormalOrigin = !isHoveredArr && !hoveredOnRamp && hoveredId === originId;
                  const highlightedNormalEnd = !isHoveredArr && !hoveredOnRamp && !isOnRampEnd && hoveredId === connect?.endpoint;
                  const highlightedArr =
                    isHoveredArr &&
                    hoveredId?.some(val => {
                      if (typeof val === 'object') {
                        return isOnRampEnd && val?.name === connectEnd?.name && val?.parent?.id === connectEnd?.parent?.id;
                      }
                      return !hoveredOnRamp && !isOnRampEnd && val === connect?.endpoint;
                    });
                  const highlighted = highlightedOnRamp || highlightedNormalOrigin || highlightedNormalEnd || highlightedArr;
                  return (
                    <>
                      <ConnectionCardWrapper
                        highlighted={highlighted}
                        onMouseOver={() => dispatch(setHighlightConnectionInfo({ originId, endpoint: connectEnd, isOnRampEnd, isOnRampOrigin: false }))}
                        onFocus={() => dispatch(setHighlightConnectionInfo({ originId, endpoint: connectEnd, isOnRampEnd, isOnRampOrigin: false }))}
                        onMouseLeave={() => dispatch(setHighlightConnectionInfo({}))}>
                        <ConnectionCardTitle>
                          {connect?.name} {convertIndexToDoubleDigi(index)}
                        </ConnectionCardTitle>
                        {renderExistingPointItem(originId, connectEnd, isOnRampEnd)}
                      </ConnectionCardWrapper>
                      {isAdminOrSA && (
                        <ConnectionEditExistingBtn onClick={() => dispatch(setEditExistingConnect(connect))}>Edit Connection</ConnectionEditExistingBtn>
                      )}
                    </>
                  );
                })}
                {connect?.onRampOrigins?.map((onRampOrigin, index) => {
                  const isOnRampEnd = !isEmpty(connect?.onRampEndpoint);
                  const connectEnd = isOnRampEnd ? connect.onRampEndpoint : connect.endpoint;
                  const hoveredOnRamp = hoveredId?.onRamp || !isEmpty(hoveredId?.parent);
                  const isHoveredArr = Array.isArray(hoveredId);
                  const highlightedOnRamp =
                    !isHoveredArr &&
                    hoveredOnRamp &&
                    ((isOnRampEnd && hoveredId?.name === connectEnd?.name && hoveredId?.parent?.id === connectEnd?.parent?.id) ||
                      (hoveredId?.name === onRampOrigin?.name && hoveredId?.parent.id === onRampOrigin?.parent?.id));
                  const highlightedNormal = !isHoveredArr && !hoveredOnRamp && !isOnRampEnd && hoveredId === connect?.endpoint;
                  const highlightedArr =
                    isHoveredArr &&
                    hoveredId?.some(val => {
                      if (typeof val === 'object') {
                        return (
                          (isOnRampEnd && val?.name === connectEnd?.name && val?.parent?.id === connectEnd?.parent?.id) ||
                          (val?.name === onRampOrigin?.name && val?.parent.id === onRampOrigin?.parent?.id)
                        );
                      }
                      return !hoveredOnRamp && !isOnRampEnd && val === connect?.endpoint;
                    });
                  const highlighted = highlightedOnRamp || highlightedNormal || highlightedArr;

                  return (
                    <>
                      <ConnectionCardWrapper
                        highlighted={highlighted}
                        onMouseOver={() => dispatch(setHighlightConnectionInfo({ onRampOrigin, endpoint: connectEnd, isOnRampEnd, isOnRampOrigin: true }))}
                        onFocus={() => dispatch(setHighlightConnectionInfo({ onRampOrigin, endpoint: connectEnd, isOnRampEnd, isOnRampOrigin: true }))}
                        onMouseLeave={() => dispatch(setHighlightConnectionInfo({}))}>
                        <ConnectionCardTitle>
                          {connect?.name} {convertIndexToDoubleDigi(index)}
                        </ConnectionCardTitle>
                        {renderExistingOnRampPointItem(onRampOrigin, connectEnd, isOnRampEnd)}
                      </ConnectionCardWrapper>
                      {isAdminOrSA && (
                        <ConnectionEditExistingBtn onClick={() => dispatch(setEditExistingConnect(connect))}>Edit Connection</ConnectionEditExistingBtn>
                      )}
                    </>
                  );
                })}
              </ModelPanelConnectionMainWrapper>
            );
          })}
        {isEmpty(editExistingConnect) && isAdminOrSA && (
          <AddEditConnectionPanel
            openConnectRegion={openConnectRegion}
            setOpenConnectRegion={setOpenConnectRegion}
            setIsEndpoint={setIsEndpoint}
            allConnections={allConnections}
            detailsFromSelectedProject={detailsFromSelectedProject}
            activeIcons={activeIcons}
            connectionData={connectionData}
            setConnectionData={setConnectionData}
            dgx={dgx}
            isAdminOrSA={isAdminOrSA}
          />
        )}
        {openNotePanel && (
          <ConnectNotesPanel
            connectionData={connectionData}
            setConnectionData={setConnectionData}
            editExistingConnect={editExistingConnect}
            setOpenNotePanel={setOpenNotePanel}
            isAdminOrSA={isAdminOrSA}
          />
        )}
      </ModelPanelMainWrapper>
      <SwipeableDrawer
        disableEnforceFocus
        hideBackdrop
        anchor="left"
        open={subDrawerOpen}
        onClose={() => {}}
        onOpen={() => {}}
        sx={{
          '&.MuiDrawer-root': { marginLeft: '2px', marginTop: '5px', width: '364px' },
          '&.MuiDrawer-paper': { marginLeft: '2px', marginTop: '5px', width: '364px' },
        }}
        PaperProps={{
          style: {
            marginLeft: '5px',
            marginTop: '5px',
            paddingTop: '30px',
            paddingLeft: '32px',
            paddingRight: '32px',
            borderRadius: '30px',
            boxShadow: 'unset',
            border: 'unset',
            width: '364px',
            height: 'calc(96% - 8px)',
          },
        }}>
        <span style={{ paddingBottom: '60px' }}>
          {currentLevel === MODEL_SUB_PANELS.REGION && (
            <ModelPanelRegion
              isConnect
              selectedRegion={selectedRegion}
              onSubDrawerClosed={e => {
                onSubDrawerClosed(e);
                setSubDrawerOpen(!e);
              }}
              onSelectedDetail={e => {
                setCurrentLevel(e);
              }}
              connectionData={connectionData}
              setConnectionData={setConnectionData}
              isEndpoint={isEndpoint}
              allConnections={allConnections}
              dcListOpen={dcListOpen}
              setDcListOpen={setDcListOpen}
              handleMapRecenter={handleMapRecenter}
            />
          )}
          {currentLevel === MODEL_SUB_PANELS.DATACENTER && (
            <ModelPanelDatacenter
              drawerRight={drawerRight}
              onClose={e => {
                onSubDrawerClosed(e);
                setSubDrawerOpen(!e);
              }}
              geoPoints={geoPoints}
            />
          )}
          {currentLevel === MODEL_SUB_PANELS.CUSTOMER && (
            <ModelPanelCustomerLocation
              drawerRight={drawerRight}
              onClose={e => {
                onSubDrawerClosed(e);
                setSubDrawerOpen(!e);
              }}
              geoPoints={geoPoints}
            />
          )}
          {currentLevel === MODEL_SUB_PANELS.CLOUDS && (
            <ModelPanelCloud
              drawerRight={drawerRight}
              onClose={e => {
                onSubDrawerClosed(e);
                setSubDrawerOpen(!e);
              }}
              geoPoints={geoPoints}
            />
          )}
        </span>
      </SwipeableDrawer>
    </>
  );
}

ConnectPanel.prototype = {
  openConnectRegion: PropTypes.bool,
  setOpenConnectRegion: PropTypes.func,
};

ConnectPanel.defaultProps = {
  openConnectRegion: false,
  setOpenConnectRegion: () => {},
};

export default ConnectPanel;
