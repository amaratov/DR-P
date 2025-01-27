/* eslint no-underscore-dangle: 0 */
import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Chip, List, ListItem, ListItemText, Divider } from '@mui/material';
import { ChevronRight, KeyboardBackspace, ChatBubbleOutlineOutlined } from '@mui/icons-material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate, useParams } from 'react-router-dom';
import { MODEL_SUB_PANELS, MODEL_DETAIL_TYPE, REGIONS_INNER_TABS, DISCOVER_REGION_FIELDS, PATH_NAME } from '../../../utils/constants/constants';
import { getSelectedDetailsFromProject, getDRDataCenters, getCloudOnRampList, getProjectDetailFulfilled } from '../../../features/selectors/ui';
import { setActiveDetail, setProjectDetailFulfilled } from '../../../features/slices/uiSlice';
import CurrentFutureBubble from './current-future-bubble';
import { backendService } from '../../../services/backend';
import MvtPanel from './mvt-panel';
import CloudNotesPanel from './cloud-notes-panel';
import { convertTypeForConnection, isEmpty, mergeRegions } from '../../../utils/utils';
import { ModelPanelMainHeader, ModelPanelMainHeaderText, ModelPanelSubHeaderText } from './model-styled';
import { DRDivider } from '../../app/app-styled';
import { setRecentlyDeactivated } from '../../../features/slices/mapSlice';

function ModelPanelRegion({
  isConnect,
  selectedRegion,
  onSubDrawerClosed,
  onSelectedDetail,
  connectionData,
  setConnectionData,
  isEndpoint,
  findAndSetSelectedMarkerForPopup,
  dcListOpen,
  setDcListOpen,
  setMarkerOpen,
  handleMapRecenter,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const routeParams = useParams();
  const detailsFromSelectedProject = useSelector(getSelectedDetailsFromProject);
  const drDcList = useSelector(getDRDataCenters);
  const cloudOnRampList = useSelector(getCloudOnRampList);
  const projectDetailFulfilled = useSelector(getProjectDetailFulfilled);

  const projectId = routeParams?.id || window.location.pathname.split('/')[2];

  // const [dcListOpen, setDcListOpen] = useState(false);
  const [crListOpen, setCrListOpen] = useState(false);
  const [cloudNotesOpen, setCloudNotesOpen] = useState(false);
  const [selectedCloud, setSelectedCloud] = useState(null);

  // memo
  const subDrawerSections = useMemo(() => {
    return [
      {
        label: 'Customer Location',
        addLabel: 'Customer Location',
        type: MODEL_SUB_PANELS.CUSTOMER,
        component: <div>Customer</div>,
        section: 'customer-locations',
      },
      {
        label: 'Data Center',
        addLabel: 'DR Data Center',
        type: MODEL_SUB_PANELS.DATACENTER,
        component: <div>Data Centres</div>,
        section: 'data-centers',
      },
    ];
  }, []);

  useEffect(() => {
    if (selectedRegion?.region) {
      dispatch(backendService.getDRLocations(selectedRegion.region));
      dispatch(backendService.getCloudOnRamps(selectedRegion));
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (projectDetailFulfilled) {
      const { projectId } = selectedRegion;
      dispatch(backendService.getProjectDetails(projectId));
    }
  }, [projectDetailFulfilled]);

  useEffect(() => {}, [drDcList]);

  const handleAddSection = function (section) {
    if (section.label === subDrawerSections[1].label) {
      setDcListOpen(true);
      setCrListOpen(false);
      setCloudNotesOpen(false);
    } else {
      //dispatch(setActiveProjectTab(TABS.DISCOVER));
      const { projectId, id } = selectedRegion;
      navigate(`/project-modeler/${projectId}/region/${id}/${section.section}`);
    }
  };

  const handleCloudListClick = function (cloud) {
    setSelectedCloud(cloud);
    setCloudNotesOpen(true);
  };

  const handleAddCloudRegionClick = function (cloud) {
    setSelectedCloud(cloud);
    setCrListOpen(true);
    setCloudNotesOpen(false);
  };

  const handleAddDRDC = function (dc) {
    const { projectId } = selectedRegion;
    dispatch(setProjectDetailFulfilled(false));

    const data = {
      projectId,
      named: dc.properties?.siteCode,
      address: dc.properties?.address,
      type: MODEL_DETAIL_TYPE,
      region: selectedRegion.region,
      isFuture: true,
      stateInfo: REGIONS_INNER_TABS.FUTURE_STATE,
      extras: {
        ...dc.properties,
        _id: dc._id,
        active: true,
        modelType: DISCOVER_REGION_FIELDS.DATA_CENTRES,
      },
    };
    dispatch(backendService.newProjectDetail(data));
  };

  const handleAddCR = function (dc) {
    const { projectId } = selectedRegion;
    dispatch(setProjectDetailFulfilled(false));
    const data = {
      projectId,
      named: dc.name,
      type: MODEL_DETAIL_TYPE,
      region: selectedRegion.region,
      isFuture: true,
      stateInfo: REGIONS_INNER_TABS.FUTURE_STATE,
      extras: {
        ...dc,
        active: false,
        latitude: parseFloat(dc.geometry?.coordinates?.[1]),
        longitude: parseFloat(dc.geometry?.coordinates?.[0]),
        modelType: DISCOVER_REGION_FIELDS.CLOUDS,
        cloud: dc.cloud,
      },
    };
    dispatch(backendService.newProjectDetail(data));
  };

  const handleRemoveDetail = function (dc) {
    dispatch(setProjectDetailFulfilled(false));
    const detail = detailsFromSelectedProject.find(d => {
      return d?.extras?._id === dc._id;
    });
    const body = {
      projectId: detail.projectId,
      detailId: detail.id,
    };
    dispatch(backendService.deleteProjectDetail(body));
    dispatch(setRecentlyDeactivated(detail.id));
  };

  function handleSubListClick(section, detail, model) {
    return function (_) {
      if (isConnect) {
        const convertedType = convertTypeForConnection(section.type);
        if (!isEndpoint) {
          const typeSet = [...new Set([...connectionData.originTypes, convertedType])];
          const d =
            section.type === 'onramps'
              ? { ...connectionData, onRampOrigins: [{ ...detail }], originTypes: typeSet }
              : { ...connectionData, origins: [...connectionData.origins, detail.id], originTypes: typeSet };
          setConnectionData(d);
        } else {
          const d =
            section.type === 'onramps'
              ? { ...connectionData, endpoint: null, onRampEndpoint: { ...detail }, endpointType: convertedType }
              : { ...connectionData, endpoint: detail.id, onRampEndpoint: null, endpointType: convertedType };
          setConnectionData(d);
        }
      } else {
        dispatch(setActiveDetail(detail));
        if (section.type === MODEL_DETAIL_TYPE) {
          onSelectedDetail(DISCOVER_REGION_FIELDS.CLOUDS);
        } else {
          onSelectedDetail(section.type);
        }
        setDcListOpen(false);
        setCrListOpen(false);
        findAndSetSelectedMarkerForPopup(detail);
        setMarkerOpen(true);
        const firstHalf = `${PATH_NAME.PROJECT_MODELER_BASE}/${projectId}${PATH_NAME.MODEL}`;
        const secondHalf = `/${routeParams?.regionId || selectedRegion?.id || 'unknown'}/${detail?.id || 'unknown'}`;
        navigate(firstHalf + secondHalf);
      }
      handleMapRecenter(detail);
      setCrListOpen(false);
      setCloudNotesOpen(false);
    };
  }

  function closeSubDrawer() {
    setDcListOpen(false);
    setCrListOpen(false);
    setCloudNotesOpen(false);
    onSubDrawerClosed(true);
  }

  return (
    <>
      <ModelPanelMainHeader>
        <KeyboardBackspace
          onClick={() => {
            closeSubDrawer();
          }}
          style={{ marginRight: '10px', cursor: 'pointer', color: 'var(--color-cathedral)' }}
        />
        <h3>{selectedRegion?.named}</h3>
      </ModelPanelMainHeader>
      {isConnect && <ModelPanelSubHeaderText>Choose Connection {isEndpoint ? 'End' : 'Origin'}</ModelPanelSubHeaderText>}
      {subDrawerSections.map(section => {
        const showActivatedOnly =
          isConnect && [DISCOVER_REGION_FIELDS.DATA_CENTRES, DISCOVER_REGION_FIELDS.CLOUDS, DISCOVER_REGION_FIELDS.CUSTOMER_LOCATIONS].includes(section.type);
        return (
          <span key={`subDrawerSections-${section.label}`}>
            <ModelPanelMainHeaderText topMargin="14px">{section.label}</ModelPanelMainHeaderText>
            {isConnect && <DRDivider margin="16px 0 0 0" />}
            {!isConnect && (
              <div>
                <Chip label="Current" style={{ color: 'white', backgroundColor: 'var(--color-imperial)' }} />
                <Chip label="Future" style={{ color: 'white', backgroundColor: 'var(--color-future)' }} />
              </div>
            )}
            <List sx={{ paddingTop: '0', paddingBottom: '0' }}>
              {mergeRegions(detailsFromSelectedProject)
                .filter(d => {
                  // TODO likely need to validate on whether it is Origin or Endpoint and filter again
                  if (showActivatedOnly)
                    return (
                      d?.type === section?.type &&
                      d?.region === selectedRegion?.region &&
                      d?.extras?.active &&
                      !(connectionData?.origins?.includes(d.id) || connectionData?.endpoint === d?.id)
                    );
                  return d?.type === section?.type && d?.region === selectedRegion?.region;
                })
                .map(d => {
                  return (
                    <span key={`region-li-+${d.id}`}>
                      <ListItem
                        disableGutters
                        style={{ cursor: 'pointer' }}
                        onClick={handleSubListClick(section, d)}
                        secondaryAction={isConnect ? <AddCircleOutlineIcon sx={{ color: 'var(--color-homeworld)' }} /> : <ChevronRight />}>
                        <CurrentFutureBubble detail={d} />
                        <span style={{ lineHeight: '40px', verticalAlign: 'top', paddingLeft: '5px' }}>{d.named}</span>
                      </ListItem>
                      <Divider />
                    </span>
                  );
                })}
              {mergeRegions(detailsFromSelectedProject)
                .filter(d => {
                  if (showActivatedOnly)
                    return (
                      d?.type === MODEL_DETAIL_TYPE &&
                      d?.extras?.modelType === section?.type &&
                      d?.region === selectedRegion?.region &&
                      d?.extras?.active &&
                      !(connectionData?.origins?.includes(d.id) || connectionData?.endpoint === d?.id)
                    );
                  return d?.type === MODEL_DETAIL_TYPE && d?.extras?.modelType === section?.type && d?.region === selectedRegion?.region;
                })
                .map(d => {
                  return (
                    <span key={`region-li-+${d.id}`}>
                      <ListItem
                        disableGutters
                        style={{ cursor: 'pointer' }}
                        onClick={handleSubListClick(section, d, true)}
                        secondaryAction={isConnect ? <AddCircleOutlineIcon sx={{ color: 'var(--color-homeworld)' }} /> : <ChevronRight />}>
                        <CurrentFutureBubble detail={d} />
                        <span style={{ lineHeight: '40px', verticalAlign: 'top', paddingLeft: '5px' }}>
                          {d.extras?.siteCode && d.extras?.metro ? `${d.extras.metro} - ` : ''}
                          {d.named}
                        </span>
                      </ListItem>
                      <Divider />
                    </span>
                  );
                })}
              {!isConnect && (
                <ListItem
                  key="region-li-addRegion"
                  disableGutters
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    handleAddSection(section);
                  }}>
                  <span style={{ lineHeight: '40px', verticalAlign: 'top', color: 'var(--color-homeworld)' }}>+ Add {section.addLabel}</span>
                </ListItem>
              )}
            </List>
          </span>
        );
      })}

      <span key="subDrawerSections-clouds">
        <ModelPanelMainHeaderText topMargin="14px">Cloud</ModelPanelMainHeaderText>
        {isConnect && <DRDivider margin="16px 0 0 0" />}
        {!isConnect && (
          <div>
            <Chip label="Current" style={{ color: 'white', backgroundColor: 'var(--color-imperial)' }} />
            <Chip label="Future" style={{ color: 'white', backgroundColor: 'var(--color-future)' }} />
          </div>
        )}
        <List sx={{ paddingTop: '0', paddingBottom: '0' }}>
          {mergeRegions(detailsFromSelectedProject)
            .filter(d => {
              return d?.type === MODEL_SUB_PANELS.CLOUDS && d?.region === selectedRegion?.region;
            })
            .map(d => {
              const hasNotes =
                !isEmpty(d?.extras?.cloudRegionAndOnrampNotes) ||
                !isEmpty(d?.extras?.generalNotes) ||
                !isEmpty(d?.extras?.computeUseCase) ||
                !isEmpty(d?.extras?.networkUseCase) ||
                !isEmpty(d?.extras?.storageUseCase);
              return (
                <span key={`region-li-+${d.id}`}>
                  <ListItem
                    disableGutters
                    secondaryAction={
                      hasNotes ? (
                        <ChatBubbleOutlineOutlined
                          style={{ cursor: 'pointer', color: 'var(--color-homeworld)' }}
                          onClick={() => {
                            handleCloudListClick(d);
                          }}
                        />
                      ) : null
                    }>
                    <CurrentFutureBubble detail={d} />
                    <ListItemText primary={<span style={{ textTransform: 'capitalize', cursor: 'pointer' }}>{d?.named}</span>} />
                  </ListItem>
                  {mergeRegions(detailsFromSelectedProject)
                    .filter(cr => {
                      return (
                        cr.type === MODEL_DETAIL_TYPE &&
                        cr.extras?.modelType === DISCOVER_REGION_FIELDS.CLOUDS &&
                        cr.region === selectedRegion.region &&
                        cr.extras?.cloud?.toLowerCase() === d.named?.toLowerCase()
                      );
                    })
                    .map(cr => {
                      const alreadyAdded = connectionData?.origins?.includes(cr.id) || connectionData?.endpoint?.id === cr?.id;
                      return (
                        <span key={`region-sub-li-+${cr.id}`}>
                          <ListItem
                            style={{ cursor: alreadyAdded ? 'not-allowed' : 'pointer', pointerEvents: alreadyAdded ? 'none' : 'default' }}
                            onClick={handleSubListClick({ type: MODEL_SUB_PANELS.CLOUDS }, cr)}>
                            <ListItemText
                              secondary={
                                <>
                                  <span
                                    style={{
                                      width: '5px',
                                      display: 'inline-block',
                                      height: '5px',
                                      marginRight: '5px',
                                      alignItems: 'center',
                                      borderLeft: '1px solid',
                                      borderBottom: '1px solid',
                                      marginBottom: '5px',
                                      color: 'grey',
                                    }}
                                  />
                                  {isConnect && (
                                    <span
                                      style={{
                                        display: 'inline-flex',
                                        lineHeight: '20px',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        color: 'black',
                                        width: '96%',
                                      }}>
                                      {cr.named}
                                      {!alreadyAdded && <AddCircleOutlineIcon sx={{ color: 'var(--color-homeworld)', marginRight: '-12px' }} />}
                                    </span>
                                  )}
                                  {!isConnect && (
                                    <span style={{ display: 'inline-flex', lineHeight: '20px', alignItems: 'center', color: 'black' }}>
                                      {cr.named}
                                      <ChevronRight sx={{ height: '15px', lineHeight: '20px', color: 'grey' }} />
                                    </span>
                                  )}
                                </>
                              }
                            />
                          </ListItem>
                          {isConnect &&
                            cr?.extras?.onRamps?.length > 0 &&
                            cr?.extras?.onRamps?.map(onramp => {
                              const alreadyAdded =
                                connectionData?.onRampOrigins?.find(
                                  p => p?.name === onramp?.name && p?.cloud_region === onramp?.cloud_region && p?.parent?.id === cr.id
                                ) ||
                                (connectionData?.endpointType === 'regionalonramp' &&
                                  connectionData?.onRampEndpoint?.name === onramp?.name &&
                                  connectionData?.onRampEndpoint?.cloud_region === onramp?.cloud_region &&
                                  connectionData?.onRampEndpoint?.parent?.id === cr?.id);
                              if (alreadyAdded) {
                                return <div />;
                              }
                              return (
                                <ListItem style={{ cursor: 'pointer' }} onClick={handleSubListClick({ type: 'onramps' }, { ...onramp, parent: cr })}>
                                  <ListItemText
                                    sx={{ marginLeft: '10px' }}
                                    secondary={
                                      <>
                                        <span
                                          style={{
                                            width: '5px',
                                            display: 'inline-block',
                                            height: '5px',
                                            marginRight: '5px',
                                            alignItems: 'center',
                                            borderLeft: '1px solid',
                                            borderBottom: '1px solid',
                                            marginBottom: '5px',
                                            color: 'grey',
                                          }}
                                        />
                                        {isConnect && (
                                          <span
                                            style={{
                                              display: 'inline-flex',
                                              lineHeight: '20px',
                                              alignItems: 'center',
                                              justifyContent: 'space-between',
                                              color: 'black',
                                              width: '96%',
                                            }}>
                                            {onramp.name}
                                            <AddCircleOutlineIcon sx={{ color: 'var(--color-homeworld)', marginRight: '-12px' }} />
                                          </span>
                                        )}
                                        {!isConnect && (
                                          <span style={{ display: 'inline-flex', lineHeight: '20px', alignItems: 'center', color: 'black' }}>
                                            {onramp.name}
                                            <ChevronRight sx={{ height: '15px', lineHeight: '20px', color: 'grey' }} />
                                          </span>
                                        )}
                                      </>
                                    }
                                  />
                                </ListItem>
                              );
                            })}
                        </span>
                      );
                    })}

                  {!isConnect && (
                    <ListItem>
                      <ListItemText
                        secondary={
                          <span
                            style={{ cursor: 'pointer', color: 'var(--color-homeworld)', lineHeight: '20px', alignItems: 'center' }}
                            onKeyDown={() => {
                              handleAddCloudRegionClick(d);
                            }}
                            onClick={() => {
                              handleAddCloudRegionClick(d);
                            }}>
                            Add a cloud region <ChevronRight sx={{ height: '15px', lineHeight: '20px' }} />
                          </span>
                        }
                      />
                    </ListItem>
                  )}
                  <Divider />
                </span>
              );
            })}
          {!isConnect && (
            <ListItem
              key="region-li-addRegion"
              disableGutters
              style={{ cursor: 'pointer', paddingBottom: '40px' }}
              onClick={() => {
                handleAddSection({ label: 'cloud', section: 'clouds' });
              }}>
              <span style={{ lineHeight: '40px', verticalAlign: 'top', color: 'var(--color-homeworld)' }}>+ Add Cloud</span>
            </ListItem>
          )}
        </List>
      </span>
      <CloudNotesPanel cloud={selectedCloud} open={cloudNotesOpen} />
      <MvtPanel
        headers={[`${selectedRegion?.region} DR Locations`]}
        open={dcListOpen}
        lists={[drDcList]}
        addNonDRC
        selectedItems={[
          mergeRegions(detailsFromSelectedProject).filter(d => {
            return d?.type === MODEL_DETAIL_TYPE && d?.extras?.modelType === DISCOVER_REGION_FIELDS.DATA_CENTRES && d?.region === selectedRegion?.region;
          }),
        ]}
        handleAdd={dc => {
          handleAddDRDC(dc);
        }}
        handleRemove={dc => {
          handleRemoveDetail(dc);
        }}
        handleAddSection={params => {
          handleAddSection(params);
        }}
      />
      <MvtPanel
        headers={[`${selectedCloud?.named} Regions`]}
        subHeaders={[`Choose an ${selectedCloud?.named} Region`]}
        open={crListOpen}
        type="CR"
        addNonDRC={false}
        // lists={[
        //   cloudOnRampList?.clouds?.filter(c => {
        //     return c.name === selectedCloud?.named;
        //   })?.[0]?.locations || [],
        // ]}
        lists={[
          cloudOnRampList?.clouds
            ?.filter(c => {
              return c.name === selectedCloud?.named;
            })?.[0]
            ?.cloud_locations?.map(or => {
              const newVal = {
                _id: or.cloud_region,
                name: or.cloud_region,
                cloud: selectedCloud?.named,
                geometry: {
                  type: 'Point',
                  coordinates: [or.centroid_longitude?.toString(), or.centroid_latitude?.toString()],
                },
              };
              return newVal;
            })
            ?.filter((value, index, self) => {
              const findex = self.findIndex(t => t?.name === value?.name);
              return index === findex;
            }) || [],
        ]}
        selectedItems={[
          mergeRegions(detailsFromSelectedProject).filter(d => {
            return (
              d?.type === MODEL_DETAIL_TYPE &&
              d?.extras?.modelType === DISCOVER_REGION_FIELDS.CLOUDS &&
              d?.region === selectedRegion?.region &&
              d?.extras?.cloud === selectedCloud?.named
            );
          }),
        ]}
        handleAdd={dc => {
          handleAddCR(dc);
        }}
        handleRemove={dc => {
          handleRemoveDetail(dc);
        }}
        handleAddSection={() => {
          handleAddSection({ label: 'nondrdc' });
        }}
      />
    </>
  );
}

export default ModelPanelRegion;
