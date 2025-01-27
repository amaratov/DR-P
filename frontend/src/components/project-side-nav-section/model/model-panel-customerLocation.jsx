import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Close, FlashOn, FlashOff, CloudSharp } from '@mui/icons-material';
import { Chip, List, ListItem, Divider, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TABS, DISCOVER_REGION_FIELDS, AllRoles, TECHNOLOGY_ICON_TAG } from '../../../utils/constants/constants';
import { backendService } from '../../../services/backend';
import { getActiveDetail, getSelectedDetailsFromProject } from '../../../features/selectors/ui';
import { setActiveDetail, setActiveProjectTab } from '../../../features/slices/uiSlice';
import { getTrueAllActiveIcons } from '../../../features/selectors/artifactIcon';
import IconBubble from './icon-bubble';
import { isEmpty, mergeRegions } from '../../../utils/utils';
import { getWhoAmI } from '../../../features/selectors';
import { setRecentlyDeactivated, setViewState } from '../../../features/slices/mapSlice';
import { getMapViewState } from '../../../features/selectors/map';
import ModelPopup from './general-popup/model-popup';
import { getAllConnections } from '../../../features/selectors/connection';
import { StickyHeader } from './model-section-styled';

function ModelPanelCustomerLocation({ onClose, drawerRight, geoPoints, setMarkerOpen }) {
  // dispatch
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // selector
  const activeDetail = useSelector(getActiveDetail);
  const detailsFromSelectedProject = useSelector(getSelectedDetailsFromProject);
  const activeIcons = useSelector(getTrueAllActiveIcons);
  const whoami = useSelector(getWhoAmI);
  const viewState = useSelector(getMapViewState);
  const allConnections = useSelector(getAllConnections);

  // state
  const [genericIcons, setGenericIcons] = useState([]);
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);

  // const
  const roleName = whoami?.role?.name?.toLowerCase();
  const isCustomer = roleName === AllRoles.CUSTOMER;

  // memo
  const applications = useMemo(() => {
    // show all instead of the associated ones
    return mergeRegions(
      detailsFromSelectedProject.filter(d => {
        if (d?.type === DISCOVER_REGION_FIELDS.APPLICATIONS && d?.region === activeDetail?.region) {
          if (!drawerRight || activeDetail?.model[DISCOVER_REGION_FIELDS.APPLICATIONS].indexOf(d.id) >= 0) {
            return true;
          }
        }
        return false;
      })
    );
  }, [detailsFromSelectedProject, activeDetail, drawerRight]);

  const clouds = useMemo(() => {
    // show all instead of the associated ones
    return mergeRegions(
      detailsFromSelectedProject.filter(d => {
        if (d?.type === DISCOVER_REGION_FIELDS.CLOUDS && d?.region === activeDetail?.region) {
          if (!drawerRight || activeDetail?.model[DISCOVER_REGION_FIELDS.CLOUDS].indexOf(d.id) >= 0) {
            return true;
          }
        }
        return false;
      })
    );
  }, [detailsFromSelectedProject, activeDetail, drawerRight]);

  const datacenters = useMemo(() => {
    // show all instead of the associated ones
    return mergeRegions(
      detailsFromSelectedProject.filter(d => {
        if (d.type === DISCOVER_REGION_FIELDS.DATA_CENTRES && d?.region === activeDetail?.region) {
          if (!drawerRight || activeDetail?.model[DISCOVER_REGION_FIELDS.DATA_CENTRES].indexOf(d.id) >= 0) {
            return true;
          }
        }
        return false;
      })
    );
  }, [detailsFromSelectedProject, activeDetail, drawerRight]);

  const showPopupFirst = useMemo(() => {
    if (allConnections?.length > 0 && activeDetail?.extras?.active) {
      return allConnections?.some(c => c?.origins?.includes(activeDetail?.id) || c?.endpoint === activeDetail?.id);
    }
    return false;
  }, [allConnections, activeDetail]);

  // effect
  useEffect(() => {
    dispatch(backendService.getTrueAllActiveIcon({}));
  }, []);

  useEffect(() => {
    const gi = activeIcons?.filter(d => {
      if (d.tag === TECHNOLOGY_ICON_TAG) {
        if (!drawerRight || activeDetail?.model[TECHNOLOGY_ICON_TAG].indexOf(d.id) >= 0) {
          return true;
        }
      }
      return false;
    });

    setGenericIcons(gi);
  }, [activeIcons, setGenericIcons, drawerRight, activeDetail]);

  // func
  const close = function () {
    onClose(true);
  };

  const modifyDiscover = function () {
    //dispatch(setActiveProjectTab(TABS.DISCOVER));
    const projectId = activeDetail?.projectId;
    navigate(`/project-modeler/${projectId}`);
  };

  const toggleActive = function (showPopup) {
    if (showPopup) {
      setOpenConfirmPopup(true);
    } else {
      const finalData = {
        detailId: activeDetail?.id,
        projectId: activeDetail?.projectId,
        extras: {
          ...activeDetail?.extras,
        },
      };
      finalData.extras.active = activeDetail?.extras?.active ? !activeDetail?.extras.active : true;
      dispatch(backendService.updateProjectDetails(finalData));
      if (activeDetail?.companionId) {
        finalData.id = activeDetail?.companionId;
        dispatch(backendService.updateProjectDetails(finalData));
      }
      const newAD = {
        ...activeDetail,
        extras: {
          ...activeDetail?.extras,
          active: !activeDetail?.extras?.active,
        },
      };
      const foundGeo = geoPoints?.find(gp => gp.id === newAD.id);
      setTimeout(() => {
        dispatch(backendService.getProjectDetails(activeDetail?.projectId));
        if (!finalData.extras.active) {
          dispatch(setRecentlyDeactivated(finalData.detailId));
          setMarkerOpen(false);
        }
        if (foundGeo) dispatch(setViewState({ ...viewState, zoom: 5, longitude: foundGeo?.center?.[0], latitude: foundGeo?.center?.[1] }));
        dispatch(setActiveDetail(newAD));
        setOpenConfirmPopup(false);
      }, 600);
    }
  };

  const toggleActiveOptions = function (subSection, id) {
    // allow to add any options regardless current/future states, associated or not
    if (activeDetail?.extras?.active) {
      let finalData = {
        detailId: activeDetail?.id,
        projectId: activeDetail?.projectId,
        extras: {
          ...activeDetail?.extras,
        },
      };
      finalData.extras.model = activeDetail?.extras?.model ? activeDetail?.extras.model : {};
      if (!finalData.extras.model[subSection]) {
        finalData.extras.model = {
          ...finalData.extras.model,
          [subSection]: [],
        };
      }
      const index = finalData.extras.model[subSection].indexOf(id);
      if (index >= 0) {
        // eslint-disable-next-line
        let newArr = [...finalData.extras.model[subSection]];
        newArr.splice(index, 1);
        finalData = {
          ...finalData,
          extras: {
            ...finalData.extras,
            model: {
              ...finalData.extras.model,
              [subSection]: [...newArr],
            },
          },
        };
      } else {
        finalData = {
          ...finalData,
          extras: {
            ...finalData.extras,
            model: {
              ...finalData.extras.model,
              [subSection]: [...finalData.extras.model[subSection], id],
            },
          },
        };
      }
      dispatch(backendService.updateProjectDetails(finalData));
      if (activeDetail?.companionId) {
        finalData.id = activeDetail?.companionId;
        dispatch(backendService.updateProjectDetails(finalData));
      }
      const newAD = JSON.parse(JSON.stringify(activeDetail));
      if (!newAD.extras) {
        newAD.extras = {};
      }
      if (!newAD.extras.model) {
        newAD.extras.model = {};
      }
      newAD.extras.model[subSection] = finalData.extras.model[subSection];
      dispatch(setActiveDetail(newAD));
    }
  };

  return (
    <>
      <StickyHeader>
        {activeDetail?.named}
        <Close
          onClick={() => {
            close();
          }}
          style={{ marginRight: '10px', cursor: 'pointer', float: 'right' }}
        />
      </StickyHeader>
      <Box display="flex" flexDirection="column" gap="12px">
        <p style={{ color: 'var(--color-cathedral)', fontSize: '14px', lineHeight: '1.5em', margin: 0 }}>
          {!isEmpty(activeDetail?.address) ? `${activeDetail.address}, ` : ''}
          {activeDetail?.extras?.city}, {activeDetail?.extras?.stateProvince} <br />
          {activeDetail?.extras?.officeType}{' '}
          {!isEmpty(activeDetail?.extras?.numberOfLocations) ? `\u2022 ${activeDetail?.extras?.numberOfLocations} Offices` : ''}
          {!isEmpty(activeDetail?.extras?.totalUsers)
            ? ` \u2022 ${activeDetail?.extras?.totalUsers} User${activeDetail?.extras?.totalUsers === 1 ? '' : 's'}`
            : ''}
          <br />
        </p>
        <Box alignItems="center" display="flex" flexWrap="nowrap" fontSize="14px" gap="4px">
          <Box
            alignItems="center"
            color="var(--color-homeworld)"
            display="flex"
            onClick={() => {
              toggleActive(showPopupFirst);
            }}
            onKeyDown={() => {
              toggleActive(showPopupFirst);
            }}
            sx={{ cursor: 'pointer' }}>
            {activeDetail?.extras?.active ? (
              <>
                <FlashOff fontSize="14px" /> Deactivate
              </>
            ) : (
              <>
                <FlashOn fontSize="14px" /> Activate
              </>
            )}
          </Box>
          <span style={{ color: 'var(--color-cathedral)' }}> | </span>
          <span
            onClick={() => {
              modifyDiscover();
            }}
            onKeyDown={() => {
              modifyDiscover();
            }}
            style={{ cursor: 'pointer', color: 'var(--color-homeworld)' }}>
            Modify Location Information
          </span>
        </Box>
        <div>
          {activeDetail?.isFuture?.indexOf(false) >= 0 && <Chip label="Current" style={{ color: 'white', backgroundColor: 'var(--color-imperial)' }} />}
          {activeDetail?.isFuture?.indexOf(true) >= 0 && <Chip label="Future" style={{ color: 'white', backgroundColor: 'var(--color-future)' }} />}
        </div>
        <List style={{ paddingBottom: '40px' }}>
          <Divider />

          {/* Clouds */}
          <ListItem disabled={!activeDetail?.extras?.active} disableGutters>
            <h3>Clouds</h3>
          </ListItem>
          {activeDetail?.extras?.active &&
            clouds.map((d, index) => {
              if (index % 3 === 0) {
                return (
                  <ListItem key={`dc-partner-row-${d.id}`} disableGutters>
                    <IconBubble
                      detail={d}
                      selected={activeDetail?.extras?.model?.[DISCOVER_REGION_FIELDS.CLOUDS]?.indexOf(d.id) >= 0}
                      onClick={() => {
                        toggleActiveOptions(DISCOVER_REGION_FIELDS.CLOUDS, d.id);
                      }}
                    />
                    {clouds.length > index + 1 && (
                      <IconBubble
                        addMargin
                        selected={activeDetail?.extras?.model?.[DISCOVER_REGION_FIELDS.CLOUDS]?.indexOf(clouds[index + 1].id) >= 0}
                        detail={clouds[index + 1]}
                        onClick={() => {
                          toggleActiveOptions(DISCOVER_REGION_FIELDS.CLOUDS, clouds[index + 1].id);
                        }}
                      />
                    )}
                    {clouds.length > index + 2 && (
                      <IconBubble
                        detail={clouds[index + 2]}
                        selected={activeDetail?.extras?.model?.[DISCOVER_REGION_FIELDS.CLOUDS]?.indexOf(clouds[index + 2].id) >= 0}
                        onClick={() => {
                          toggleActiveOptions(DISCOVER_REGION_FIELDS.CLOUDS, clouds[index + 2].id);
                        }}
                      />
                    )}
                  </ListItem>
                );
              }
              return <span key={`empty-pspan-${d.id}`} />;
            })}
          <Divider />

          {/* Data centers */}
          <ListItem disabled={!activeDetail?.extras?.active} disableGutters>
            <h3>Data Centers</h3>
          </ListItem>
          {activeDetail?.extras?.active &&
            datacenters.map((d, index) => {
              if (index % 3 === 0) {
                return (
                  <ListItem key={`dc-partner-row-${d.id}`} disableGutters>
                    <IconBubble
                      detail={d}
                      selected={activeDetail?.extras?.model?.[DISCOVER_REGION_FIELDS.DATA_CENTRES]?.indexOf(d.id) >= 0}
                      onClick={() => {
                        toggleActiveOptions(DISCOVER_REGION_FIELDS.DATA_CENTRES, d.id);
                      }}
                    />
                    {datacenters?.length > index + 1 && (
                      <IconBubble
                        addMargin
                        selected={activeDetail?.extras?.model?.[DISCOVER_REGION_FIELDS.DATA_CENTRES]?.indexOf(datacenters[index + 1].id) >= 0}
                        detail={datacenters[index + 1]}
                        onClick={() => {
                          toggleActiveOptions(DISCOVER_REGION_FIELDS.DATA_CENTRES, datacenters[index + 1].id);
                        }}
                      />
                    )}
                    {datacenters?.length > index + 2 && (
                      <IconBubble
                        detail={datacenters[index + 2]}
                        selected={activeDetail?.extras?.model?.[DISCOVER_REGION_FIELDS.DATA_CENTRES]?.indexOf(datacenters[index + 2].id) >= 0}
                        onClick={() => {
                          toggleActiveOptions(DISCOVER_REGION_FIELDS.DATA_CENTRES, datacenters[index + 2].id);
                        }}
                      />
                    )}
                  </ListItem>
                );
              }
              return <span key={`empty-pspan-${d.id}`} />;
            })}
          <Divider />

          {/* Applications */}
          <ListItem disabled={!activeDetail?.extras?.active} disableGutters>
            <h3>Applications</h3>
          </ListItem>
          {activeDetail?.extras?.active &&
            applications.map((d, index) => {
              if (index % 3 === 0) {
                return (
                  <ListItem key={`dc-app-row-${d.id}`} disableGutters>
                    <IconBubble
                      detail={d}
                      selected={activeDetail?.extras?.model?.[DISCOVER_REGION_FIELDS.APPLICATIONS]?.indexOf(d.id) >= 0}
                      onClick={() => {
                        toggleActiveOptions(DISCOVER_REGION_FIELDS.APPLICATIONS, d.id);
                      }}
                    />
                    {applications.length > index + 1 && (
                      <IconBubble
                        addMargin
                        selected={activeDetail?.extras?.model?.[DISCOVER_REGION_FIELDS.APPLICATIONS]?.indexOf(applications[index + 1].id) >= 0}
                        detail={applications[index + 1]}
                        onClick={() => {
                          toggleActiveOptions(DISCOVER_REGION_FIELDS.APPLICATIONS, applications[index + 1].id);
                        }}
                      />
                    )}
                    {applications.length > index + 2 && (
                      <IconBubble
                        detail={applications[index + 2]}
                        selected={activeDetail?.extras?.model?.[DISCOVER_REGION_FIELDS.APPLICATIONS]?.indexOf(applications[index + 2].id) >= 0}
                        onClick={() => {
                          toggleActiveOptions(DISCOVER_REGION_FIELDS.APPLICATIONS, applications[index + 2].id);
                        }}
                      />
                    )}
                  </ListItem>
                );
              }
              return <span key={`empty-aspan-${d.id}`} />;
            })}
          <Divider />

          {/* Generic Icons */}
          <ListItem disabled={!activeDetail?.extras?.active} disableGutters>
            <h3>Technology Icons</h3>
          </ListItem>
          {activeDetail?.extras?.active &&
            genericIcons.map((d, index) => {
              if (index % 3 === 0) {
                return (
                  <ListItem key={`dc-generic-row-${d.id}`} disableGutters>
                    <IconBubble
                      icon={d}
                      selected={activeDetail?.extras?.model?.[TECHNOLOGY_ICON_TAG]?.indexOf(d.id) >= 0}
                      onClick={() => {
                        toggleActiveOptions(TECHNOLOGY_ICON_TAG, d.id);
                      }}
                    />
                    {genericIcons.length > index + 1 && (
                      <IconBubble
                        addMargin
                        selected={activeDetail?.extras?.model?.[TECHNOLOGY_ICON_TAG]?.indexOf(genericIcons[index + 1].id) >= 0}
                        icon={genericIcons[index + 1]}
                        onClick={() => {
                          toggleActiveOptions(TECHNOLOGY_ICON_TAG, genericIcons[index + 1].id);
                        }}
                      />
                    )}
                    {genericIcons.length > index + 2 && (
                      <IconBubble
                        icon={genericIcons[index + 2]}
                        selected={activeDetail?.extras?.model?.[TECHNOLOGY_ICON_TAG]?.indexOf(genericIcons[index + 2].id) >= 0}
                        onClick={() => {
                          toggleActiveOptions(TECHNOLOGY_ICON_TAG, genericIcons[index + 2].id);
                        }}
                      />
                    )}
                  </ListItem>
                );
              }
              return <span key={`empty-gspan-${d.id}`} />;
            })}
        </List>
      </Box>
      {openConfirmPopup && <ModelPopup setOpenConfirmPopup={setOpenConfirmPopup} confirmFunc={() => toggleActive(false)} />}
    </>
  );
}

ModelPanelCustomerLocation.defaultProps = {
  drawerRight: false,
};

export default ModelPanelCustomerLocation;
