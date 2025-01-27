import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Close, FlashOn, FlashOff, RemoveCircleOutlined } from '@mui/icons-material';
import { Box, Chip, List, ListItem, ListItemText, Divider } from '@mui/material';
import { TABS, DISCOVER_REGION_FIELDS, SERVICES_TYPE, AllRoles, REGIONAL_ONRAMP_TYPE, GLOBAL_ONRAMP_TYPE } from '../../../utils/constants/constants';
import { backendService } from '../../../services/backend';
import { getActiveDetail, getSelectedDetailsFromProject, getCloudOnRampList } from '../../../features/selectors/ui';
import { setActiveDetail, setActiveProjectTab } from '../../../features/slices/uiSlice';
import { getTrueAllActiveIcons } from '../../../features/selectors/artifactIcon';
import IconBubble from './icon-bubble';
import MvtPanel from './mvt-panel';
import { mergeRegions } from '../../../utils/utils';
import { getWhoAmI } from '../../../features/selectors';
import { setRecentlyDeactivated } from '../../../features/slices/mapSlice';
import ModelPopup from './general-popup/model-popup';
import { getAllConnections } from '../../../features/selectors/connection';
import { StickyHeader } from './model-section-styled';

function ModelPanelCloud({ onClose, drawerRight, setMarkerOpen }) {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const activeDetail = useSelector(getActiveDetail);
  const detailsFromSelectedProject = useSelector(getSelectedDetailsFromProject);
  const cloudOnRampList = useSelector(getCloudOnRampList);
  const activeIcons = useSelector(getTrueAllActiveIcons);
  const whoami = useSelector(getWhoAmI);
  const allConnections = useSelector(getAllConnections);

  // state
  const [applications, setApplications] = useState([]);
  const [partnerSuppliers, setPartnerSuppliers] = useState([]);
  const [genericIcons, setGenericIcons] = useState([]);
  const [activeOnRamps, setActiveOnRamps] = useState([]);
  const [onrampListOpen, setOnrampListOpen] = useState(false);
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [activeCloud, setActiveCloud] = useState(null);

  // const
  const roleName = whoami?.role?.name?.toLowerCase();
  const isCustomer = roleName === AllRoles.CUSTOMER;

  //memo
  const showPopupFirst = useMemo(() => {
    if (allConnections?.length > 0 && activeDetail?.extras?.active) {
      return allConnections?.some(c => c?.origins?.includes(activeDetail?.id) || c?.endpoint === activeDetail?.id);
    }
    return false;
  }, [allConnections, activeDetail]);

  // func
  const handleAddOnRamp = function (or) {
    const finalData = {
      detailId: activeDetail.id,
      projectId: activeDetail.projectId,
      extras: {
        ...activeDetail?.extras,
      },
    };
    const onRamps = activeDetail?.extras?.onRamps?.slice() || [];
    onRamps.push(or);
    finalData.extras.onRamps = onRamps;
    dispatch(backendService.updateProjectDetails(finalData));
    if (activeDetail.companionId) {
      finalData.id = activeDetail.companionId;
      dispatch(backendService.updateProjectDetails(finalData));
    }

    // add connection
    const onRampPartialName = or?.name?.split(',')?.[0] || 'unknow';
    const connectName = `${activeDetail?.extras?.cloud} ${activeDetail.named?.replace(/ *\([^)]*\) */g, '')} ${onRampPartialName}`;
    const cd = {
      name: connectName,
      notes: 'on ramp connection',
      projectId: activeDetail?.projectId,
      origins: [],
      onRampOrigins: [{ ...or, parent: activeDetail }],
      originTypes: [REGIONAL_ONRAMP_TYPE],
      endpoint: activeDetail?.id,
      onRampEndpoint: null,
      endpointType: GLOBAL_ONRAMP_TYPE,
    };
    dispatch(backendService.newProjectConnections(cd));

    const newAD = JSON.parse(JSON.stringify(activeDetail));
    if (!newAD?.extras) {
      newAD.extras = {};
    }
    newAD.extras.onRamps = onRamps;
    dispatch(setActiveDetail(newAD));
    setActiveOnRamps(onRamps);
  };

  const handleRemoveOnRamp = function (or) {
    const finalData = {
      detailId: activeDetail.id,
      projectId: activeDetail.projectId,
      extras: {
        ...activeDetail?.extras,
      },
    };
    const onRamps = activeDetail?.extras?.onRamps?.slice() || [];

    const index = onRamps.findIndex(e => {
      return or.name === e.name;
    });
    if (index >= 0) {
      onRamps.splice(index, 1);
    }
    finalData.extras.onRamps = onRamps;
    dispatch(backendService.updateProjectDetails(finalData));
    if (activeDetail.companionId) {
      finalData.id = activeDetail.companionId;
      dispatch(backendService.updateProjectDetails(finalData));
    }
    // clean up connection
    if (allConnections?.length > 0) {
      const connectionsToBeDeleted = allConnections?.reduce((acc, con) => {
        const isInitialConnect =
          con?.endpoint === activeDetail?.id &&
          con.onRampOrigins?.length === 1 &&
          con.onRampOrigins.some(o => o?.name === or?.name && o?.parent?.id === activeDetail?.id);
        const isEndConnect = con?.onRampEndpoint?.name === or.name && con?.onRampEndpoint?.parent?.id === activeDetail?.id;
        if (isInitialConnect || isEndConnect) acc.push(con);
        return acc;
      }, []);
      if (connectionsToBeDeleted?.length > 0) {
        try {
          connectionsToBeDeleted.forEach(c => dispatch(backendService.deleteProjectConnections(c)));
        } catch (e) {
          console.log(e);
        }
      }

      const connectionsToBeCleanUp = allConnections?.reduce((acc, con) => {
        const onRampOriginsContainsIt =
          con?.onRampOrigins?.length > 1 && con?.onRampOrigins?.some(o => o?.name === or?.name && o?.parent?.id === activeDetail?.id);
        if (onRampOriginsContainsIt) {
          const filteredOnRampOrigins = con?.onRampOrigins?.filter(o => o?.name !== or?.name);
          const newData = {
            ...con,
            onRampOrigins: [...filteredOnRampOrigins],
          };
          acc.push(newData);
        }
        return acc;
      }, []);

      if (connectionsToBeCleanUp?.length > 0) {
        connectionsToBeCleanUp.forEach(c => {
          try {
            dispatch(backendService.updateProjectConnections(c));
          } catch (e) {
            console.log(e);
          }
        });
      }
    }

    const newAD = JSON.parse(JSON.stringify(activeDetail));
    if (!newAD?.extras) {
      newAD.extras = {};
    }
    newAD.extras.onRamps = onRamps;
    dispatch(setActiveDetail(newAD));
    setActiveOnRamps(onRamps);
  };

  const handleAddSection = function () {};

  useEffect(() => {
    dispatch(backendService.getTrueAllActiveIcon({}));
    const cloudDetail = mergeRegions(
      detailsFromSelectedProject.filter(d => {
        if (d?.type === DISCOVER_REGION_FIELDS.CLOUDS && d?.named === activeDetail?.extras?.cloud && d?.region === activeDetail?.region) {
          return true;
        }
        if (activeDetail?.onRamp) {
          const hasThisOnRamp = d?.extras?.onRamps?.find(onramp => onramp?.name === activeDetail?.name && onramp?.cloud_region === activeDetail?.cloud_region);
          if (hasThisOnRamp) return true;
        }
        return false;
      })
    )?.[0];

    setActiveCloud(cloudDetail);

    setApplications(
      mergeRegions(
        detailsFromSelectedProject.filter(d => {
          if (d?.type === DISCOVER_REGION_FIELDS.APPLICATIONS && d.extras?.clouds?.indexOf(cloudDetail?.named) >= 0) {
            if (!drawerRight || activeDetail?.extras?.model[DISCOVER_REGION_FIELDS.APPLICATIONS].indexOf(d.id) >= 0) {
              return true;
            }
          }
          return false;
        })
      )
    );
    setPartnerSuppliers(
      mergeRegions(
        detailsFromSelectedProject.filter(d => {
          if (d.type === DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.PARTNERSHIP_AND_SUPPLIERS) {
            if (!drawerRight || activeDetail.extras?.model[DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.PARTNERSHIP_AND_SUPPLIERS].indexOf(d.id) >= 0) {
              return true;
            }
          }
          return false;
        })
      )
    );

    setActiveOnRamps(activeDetail.extras?.onRamps || []);
  }, [detailsFromSelectedProject, getSelectedDetailsFromProject]);

  useEffect(() => {}, [activeDetail, getActiveDetail, genericIcons]);

  useEffect(() => {
    const gi = activeIcons.filter(d => {
      if (d.tag === SERVICES_TYPE) {
        if (!drawerRight || activeDetail.extras?.model[SERVICES_TYPE].indexOf(d.id) >= 0) {
          return true;
        }
      }
      return false;
    });

    setGenericIcons(gi);
  }, [activeIcons, setGenericIcons]);

  const close = function () {
    onClose(true);
  };

  const toggleActive = function (showPopup) {
    if (showPopup) {
      setOpenConfirmPopup(true);
    } else {
      const finalData = {
        detailId: activeDetail.id,
        projectId: activeDetail.projectId,
        extras: {
          ...activeDetail.extras,
        },
      };
      finalData.extras.active = activeDetail.extras?.active ? !activeDetail.extras.active : true;
      dispatch(backendService.updateProjectDetails(finalData));
      if (activeDetail.companionId) {
        finalData.id = activeDetail.companionId;
        dispatch(backendService.updateProjectDetails(finalData));
      }
      const newAD = {
        ...activeDetail,
        extras: {
          ...activeDetail?.extras,
          active: !activeDetail?.extras?.active,
        },
      };
      setTimeout(() => {
        dispatch(backendService.getProjectDetails(activeDetail.projectId));
        if (!finalData.extras.active) {
          dispatch(setRecentlyDeactivated(finalData.detailId));
          setMarkerOpen(false);
        }
        dispatch(setActiveDetail(newAD));
        setOpenConfirmPopup(false);
      }, 600);
    }
  };

  const toggleActiveOptions = function (subSection, id) {
    if (activeDetail?.extras?.active) {
      let finalData = {
        detailId: activeDetail.id,
        projectId: activeDetail.projectId,
        extras: {
          ...activeDetail.extras,
        },
      };
      finalData.extras.model = activeDetail.extras?.model ? activeDetail.extras.model : {};
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
      if (activeDetail.companionId) {
        finalData.id = activeDetail.companionId;
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
      <StickyHeader style={{ textTransform: 'capitalize' }}>
        {activeDetail?.extras?.cloud && activeDetail?.named?.indexOf(activeDetail?.extras?.cloud) === -1 ? `${activeDetail?.extras?.cloud} - ` : ''}
        {activeDetail?.named}
        <Close
          onClick={() => {
            close();
          }}
          style={{ marginRight: '10px', cursor: 'pointer', float: 'right' }}
        />
      </StickyHeader>
      <Box display="flex" flexDirection="column" gap="12px">
        {!isCustomer && (
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
        )}
        <div>
          {activeDetail?.isFuture?.indexOf(false) >= 0 && <Chip label="Current" style={{ color: 'white', backgroundColor: 'var(--color-imperial)' }} />}
          {activeDetail?.isFuture?.indexOf(true) >= 0 && <Chip label="Future" style={{ color: 'white', backgroundColor: 'var(--color-future)' }} />}
        </div>
        <List style={{ paddingBottom: '40px' }}>
          <Divider />

          <ListItem disabled={!activeDetail?.extras?.active}>
            <h3 style={{ width: '100%' }}>
              On-ramps
              <div
                onClick={e => {
                  setOnrampListOpen(true);
                }}
                onKeyDown={e => {
                  setOnrampListOpen(true);
                }}
                style={{ float: 'right', color: 'var(--color-homeworld)', cursor: 'pointer' }}>
                + Add on-ramp
              </div>
            </h3>
          </ListItem>
          {activeDetail?.extras?.active &&
            activeOnRamps.map(d => {
              return (
                <ListItem>
                  <ListItemText primary={d.name} secondary={activeDetail?.named} />
                  <RemoveCircleOutlined
                    onClick={e => {
                      handleRemoveOnRamp(d);
                    }}
                    sx={{ color: 'var(--color-homeworld)', cursor: 'pointer' }}
                  />
                </ListItem>
              );
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
          <ListItem disabled={!activeDetail?.extras?.active} disableGutters>
            <h3>Partners/Suppliers</h3>
          </ListItem>
          {activeDetail?.extras?.active &&
            partnerSuppliers.map((d, index) => {
              if (index % 3 === 0) {
                return (
                  <ListItem key={`dc-partner-row-${d.id}`} disableGutters>
                    <IconBubble
                      detail={d}
                      selected={activeDetail?.extras?.model?.[DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.PARTNERSHIP_AND_SUPPLIERS]?.indexOf(d.id) >= 0}
                      onClick={() => {
                        toggleActiveOptions(DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.PARTNERSHIP_AND_SUPPLIERS, d.id);
                      }}
                    />
                    {partnerSuppliers.length > index + 1 && (
                      <IconBubble
                        addMargin
                        selected={
                          activeDetail?.extras?.model?.[DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.PARTNERSHIP_AND_SUPPLIERS]?.indexOf(
                            partnerSuppliers[index + 1].id
                          ) >= 0
                        }
                        detail={partnerSuppliers[index + 1]}
                        onClick={() => {
                          toggleActiveOptions(DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.PARTNERSHIP_AND_SUPPLIERS, partnerSuppliers[index + 1].id);
                        }}
                      />
                    )}
                    {partnerSuppliers.length > index + 2 && (
                      <IconBubble
                        detail={partnerSuppliers[index + 2]}
                        selected={
                          activeDetail?.extras?.model?.[DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.PARTNERSHIP_AND_SUPPLIERS]?.indexOf(
                            partnerSuppliers[index + 2].id
                          ) >= 0
                        }
                        onClick={() => {
                          toggleActiveOptions(DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.PARTNERSHIP_AND_SUPPLIERS, partnerSuppliers[index + 2].id);
                        }}
                      />
                    )}
                  </ListItem>
                );
              }
              return <span key={`empty-pspan-${d.id}`} />;
            })}
          <Divider />
          <ListItem disabled={!activeDetail?.extras?.active} disableGutters>
            <h3>Cloud Services (Storage, Network, Compute)</h3>
          </ListItem>
          {activeDetail?.extras?.active &&
            genericIcons.map((d, index) => {
              if (index % 3 === 0) {
                return (
                  <ListItem key={`dc-generic-row-${d.id}`} disableGutters>
                    <IconBubble
                      icon={d}
                      selected={activeDetail?.extras?.model?.[SERVICES_TYPE]?.indexOf(d.id) >= 0}
                      onClick={() => {
                        toggleActiveOptions(SERVICES_TYPE, d.id);
                      }}
                    />
                    {genericIcons.length > index + 1 && (
                      <IconBubble
                        addMargin
                        selected={activeDetail?.extras?.model?.[SERVICES_TYPE]?.indexOf(genericIcons[index + 1].id) >= 0}
                        icon={genericIcons[index + 1]}
                        onClick={() => {
                          toggleActiveOptions(SERVICES_TYPE, genericIcons[index + 1].id);
                        }}
                      />
                    )}
                    {genericIcons.length > index + 2 && (
                      <IconBubble
                        icon={genericIcons[index + 2]}
                        selected={activeDetail?.extras?.model?.[SERVICES_TYPE]?.indexOf(genericIcons[index + 2].id) >= 0}
                        onClick={() => {
                          toggleActiveOptions(SERVICES_TYPE, genericIcons[index + 2].id);
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
      <MvtPanel
        headers={[`${activeDetail?.named} On-ramps`]}
        subHeaders={['']}
        open={onrampListOpen}
        type="OR"
        closePanel={e => {
          setOnrampListOpen(false);
        }}
        addNonDRC={false}
        lists={[
          cloudOnRampList?.clouds
            ?.filter(c => {
              return c.name.toLowerCase() === activeCloud?.named?.toLowerCase() || c.name.toLowerCase() === activeDetail?.extras?.cloud?.toLowerCase();
            })?.[0]
            ?.cloud_locations?.filter(c => {
              return c?.cloud_region === activeDetail?.named;
            }) || [],
        ]}
        selectedItems={[activeOnRamps]}
        handleAdd={or => {
          handleAddOnRamp(or);
        }}
        handleRemove={or => {
          handleRemoveOnRamp(or);
        }}
        handleAddSection={() => {
          handleAddSection({ label: 'or' });
        }}
      />
      {openConfirmPopup && <ModelPopup setOpenConfirmPopup={setOpenConfirmPopup} confirmFunc={() => toggleActive(false)} />}
    </>
  );
}

ModelPanelCloud.defaultProps = {
  drawerRight: false,
};

export default ModelPanelCloud;
