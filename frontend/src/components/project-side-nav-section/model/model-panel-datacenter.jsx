import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Close, FlashOn, FlashOff, DeleteOutline } from '@mui/icons-material';
import { Box, Chip, List, ListItem, Divider, Select, MenuItem, InputLabel, Slider, FormControlLabel, Switch } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TABS, DISCOVER_REGION_FIELDS, TECHNOLOGY_ICON_TAG, HOSTING_PREFERNCES, AllRoles } from '../../../utils/constants/constants';
import { backendService } from '../../../services/backend';
import { getActiveDetail, getSelectedDetailsFromProject } from '../../../features/selectors/ui';
import { setActiveDetail, setActiveProjectTab } from '../../../features/slices/uiSlice';
import { getTrueAllActiveIcons } from '../../../features/selectors/artifactIcon';
import IconBubble from './icon-bubble';
import TextInput from '../../form-elements/text-input';
import { isEmpty, mergeRegions } from '../../../utils/utils';
import { getWhoAmI } from '../../../features/selectors';
import { setRecentlyDeactivated, setViewState } from '../../../features/slices/mapSlice';
import { getMapViewState } from '../../../features/selectors/map';
import ModelPopup from './general-popup/model-popup';
import { getAllConnections } from '../../../features/selectors/connection';
import { StickyHeader } from './model-section-styled';

function ModelPanelDataCenter({ onClose, drawerRight, geoPoints, setMarkerOpen }) {
  // dispatch
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // selector
  const activeDetail = useSelector(getActiveDetail);
  const detailsFromSelectedProject = useSelector(getSelectedDetailsFromProject);
  const activeIcons = useSelector(getTrueAllActiveIcons);
  const [addDeployType, setAddDeployType] = useState(false);
  const whoami = useSelector(getWhoAmI);
  const viewState = useSelector(getMapViewState);
  const allConnections = useSelector(getAllConnections);

  // state
  const [genericIcons, setGenericIcons] = useState([]);
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);

  // const
  const roleName = whoami?.role?.name?.toLowerCase();
  const isCustomer = roleName === AllRoles.CUSTOMER;

  // useForm
  const {
    register,
    formState: { errors },
  } = useForm();

  // memo
  const applications = useMemo(() => {
    // show all not just the associated ones
    return mergeRegions(
      detailsFromSelectedProject.filter(d => {
        if (d.type === DISCOVER_REGION_FIELDS.APPLICATIONS && d?.region === activeDetail?.region) {
          if (!drawerRight) {
            return true;
          }
        }
        return false;
      })
    );
  }, [detailsFromSelectedProject, activeDetail, drawerRight]);

  const partnerSuppliers = useMemo(() => {
    return mergeRegions(
      detailsFromSelectedProject.filter(d => {
        if (d.type === DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.PARTNERSHIP_AND_SUPPLIERS && d?.region === activeDetail?.region) {
          if (!drawerRight) {
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

  const AuthChoices = ['Combo Lock', 'Badge Reader', 'Card Reader', 'Card Reader + BioMetrics'];
  const DesignInstallChoices = ['Installation Services', 'Installation & Fit Out Services'];

  const deploySizes = ['S', 'M', 'L', 'XL', 'Cust.'];

  const defDeployCustVals = {
    size: deploySizes[4],
    cageSize: '100 Sq ft.',
    cabinets: '1',
    cabKw: '4',
    totalkw: '4',
    crossConnects: '6 Fiber Cross-Connects',
    ecosystemConnects: '2x Cloud Exchange Ports',
    authentication: AuthChoices[2],
    packModel: '6 Pack',
    cabinetHPC: false,
    designInstall: DesignInstallChoices[1],
  };

  const defDeploySmallVals = {
    size: deploySizes[0],
    cageSize: '100 Sq ft.',
    cabinets: '4',
    cabKw: '4',
    totalkw: '16',
    crossConnects: '6 Fiber Cross-Connects',
    ecosystemConnects: '2x Cloud Exchange Ports',
    packModel: '6 Pack',
    cabinetHPC: false,
    onsiteAssistance: true,
    authentication: AuthChoices[2],
    designInstall: DesignInstallChoices[1],
  };

  const defDeployMedVals = {
    size: deploySizes[1],
    cageSize: '150 Sq ft.',
    cabinets: '8',
    cabKw: '4',
    totalkw: '32',
    crossConnects: '12 Fiber Cross-Connects',
    ecosystemConnects: '2x Cloud Exchange Ports',
    packModel: '12 Pack',
    cabinetHPC: false,
    authentication: AuthChoices[2],
    designInstall: DesignInstallChoices[1],
  };

  const defDeployLgVals = {
    size: deploySizes[2],
    cageSize: '200 Sq ft.',
    cabinets: '16',
    cabKw: '4',
    totalkw: '64',
    crossConnects: '12 Fiber Cross-Connects',
    ecosystemConnects: '2x Cloud Exchange Ports',
    packModel: '12 Pack',
    cabinetHPC: false,
    authentication: AuthChoices[2],
    designInstall: DesignInstallChoices[1],
  };

  const defDeployXLVals = {
    size: deploySizes[3],
    cageSize: '250 Sq ft.',
    cabinets: '60',
    cabKw: '4',
    totalkw: '240',
    crossConnects: '24 Fiber Cross-Connects',
    ecosystemConnects: '2x Cloud Exchange Ports',
    packModel: '24 Pack',
    cabinetHPC: false,
    authentication: AuthChoices[2],
    designInstall: DesignInstallChoices[1],
  };

  const defControlDeployCustVals = {
    ...defDeployCustVals,
    crossConnects: '3 Fiber Cross-Connects',
    packModel: '3 Pack',
    cabinetHPC: false,
    authentication: AuthChoices[3],
    designInstall: DesignInstallChoices[0],
  };

  const defControlDeploySmallVals = {
    ...defDeploySmallVals,
    cabinets: '8',
    totalkw: '32',
    crossConnects: '3 Fiber Cross-Connects',
    packModel: '3 Pack',
    cabinetHPC: false,
    authentication: AuthChoices[3],
    designInstall: DesignInstallChoices[0],
  };

  const defControlDeployMedVals = {
    ...defDeployMedVals,
    cabinets: '10',
    totalkw: '40',
    crossConnects: '6 Fiber Cross-Connects',
    packModel: '6 Pack',
    cabinetHPC: false,
    authentication: AuthChoices[3],
    designInstall: DesignInstallChoices[0],
  };

  const defControlDeployLgVals = {
    ...defDeployLgVals,
    cabinets: '16',
    totalkw: '64',
    crossConnects: '6 Fiber Cross-Connects',
    packModel: '6 Pack',
    cabinetHPC: false,
    authentication: AuthChoices[3],
    designInstall: DesignInstallChoices[0],
  };

  const defControlDeployXLVals = {
    ...defDeployXLVals,
    cabinets: '20',
    totalkw: '80',
    crossConnects: '12 Fiber Cross-Connects',
    packModel: '12 Pack',
    cabinetHPC: false,
    authentication: AuthChoices[3],
    designInstall: DesignInstallChoices[0],
  };

  const defDataDeployCustVals = {
    ...defDeployCustVals,
    crossConnects: '3 Fiber Cross-Connects',
    packModel: '3 Pack',
    cabinetHPC: true,
    designInstall: DesignInstallChoices[0],
    authentication: AuthChoices[3],
  };

  const defDataDeploySmallVals = {
    ...defDeploySmallVals,
    cabinets: '10',
    totalkw: '40',
    crossConnects: '6 Fiber Cross-Connects',
    packModel: '6 Pack',
    cabinetHPC: true,
    designInstall: DesignInstallChoices[0],
    authentication: AuthChoices[3],
  };

  const defDataDeployMedVals = {
    ...defDeployMedVals,
    cabinets: '20',
    totalkw: '80',
    crossConnects: '6 Fiber Cross-Connects',
    packModel: '6 Pack',
    cabinetHPC: true,
    designInstall: DesignInstallChoices[0],
    authentication: AuthChoices[3],
  };

  const defDataDeployLgVals = {
    ...defDeployLgVals,
    cabinets: '30',
    totalkw: '120',
    crossConnects: '6 Fiber Cross-Connects',
    packModel: '6 Pack',
    cabinetHPC: true,
    designInstall: DesignInstallChoices[0],
    authentication: AuthChoices[3],
  };

  const defDataDeployXLVals = {
    ...defDeployXLVals,
    cabinets: '40',
    totalkw: '160',
    crossConnects: '6 Fiber Cross-Connects',
    packModel: '6 Pack',
    cabinetHPC: true,
    designInstall: DesignInstallChoices[0],
    authentication: AuthChoices[3],
  };

  const defByTypeSize = {
    network: {
      [deploySizes[0]]: defDeploySmallVals,
      [deploySizes[1]]: defDeployMedVals,
      [deploySizes[2]]: defDeployLgVals,
      [deploySizes[3]]: defDeployXLVals,
      [deploySizes[4]]: defDeployCustVals,
    },
    control: {
      [deploySizes[0]]: defControlDeploySmallVals,
      [deploySizes[1]]: defControlDeployMedVals,
      [deploySizes[2]]: defControlDeployLgVals,
      [deploySizes[3]]: defControlDeployXLVals,
      [deploySizes[4]]: defControlDeployCustVals,
    },
    data: {
      [deploySizes[0]]: defDataDeploySmallVals,
      [deploySizes[1]]: defDataDeployMedVals,
      [deploySizes[2]]: defDataDeployLgVals,
      [deploySizes[3]]: defDataDeployXLVals,
      [deploySizes[4]]: defDataDeployCustVals,
    },
  };

  const [deployDetails, setDeployDetailsVal] = useState(
    activeDetail?.extras?.model?.hub || {
      ...defDeploySmallVals,
    }
  );

  //TODO: I believe all of these panels fail to update if the api goes down or the user is no longer logged in
  //(2 hour timeout) and thus fail silently as there is no error mockup
  function setDeployDetails(newVal) {
    setDeployDetailsVal(newVal);
    const finalData = {
      detailId: activeDetail?.id,
      projectId: activeDetail?.projectId,
      extras: {
        ...activeDetail?.extras,
      },
    };
    if (!finalData.extras.model) {
      finalData.extras.model = {};
    }

    const modelS = JSON.parse(JSON.stringify(finalData.extras.model));
    modelS.hub = newVal;
    finalData.extras.model = modelS;

    dispatch(backendService.updateProjectDetails(finalData));
    if (activeDetail?.companionId) {
      finalData.id = activeDetail?.companionId;
      dispatch(backendService.updateProjectDetails(finalData));
    }
    const newAD = JSON.parse(JSON.stringify(activeDetail));
    newAD.extras.model = modelS;
    dispatch(setActiveDetail(newAD));
  }

  useEffect(() => {}, [
    deployDetails,
    deployDetails.cageSize,
    deployDetails.cabinets,
    deployDetails.crossConnects,
    deployDetails.ecosystemConnects,
    deployDetails.authentication,
    deployDetails.designInstall,
    deployDetails.onsiteAssistance,
    deployDetails.cabinetHPC,
  ]);

  const typeLabel = {
    control: 'Control Hub',
    data: 'Data Hub',
    network: 'Network Hub',
  };

  function setDeployType(type) {
    const finalData = {
      detailId: activeDetail?.id,
      projectId: activeDetail?.projectId,
      extras: {
        ...activeDetail?.extras,
      },
    };
    if (!finalData.extras.model) {
      finalData.extras.model = {};
    }

    const size = deployDetails?.size ? deployDetails.size : deploySizes[0];
    const s = { ...deployDetails, ...defByTypeSize[type][size] };
    setDeployDetails(s);

    const modelS = JSON.parse(JSON.stringify(finalData.extras.model));
    modelS.deployType = type;
    modelS.hub = s;
    finalData.extras.model = modelS;

    dispatch(backendService.updateProjectDetails(finalData));
    if (activeDetail?.companionId) {
      finalData.id = activeDetail?.companionId;
      dispatch(backendService.updateProjectDetails(finalData));
    }

    const newAD = JSON.parse(JSON.stringify(activeDetail));
    newAD.extras.model = modelS;
    dispatch(setActiveDetail(newAD));
  }

  function clearDeployType(remove) {
    const finalData = {
      detailId: activeDetail?.id,
      projectId: activeDetail?.projectId,
      extras: {
        ...activeDetail?.extras,
      },
    };
    if (!finalData.extras.model) {
      finalData.extras.model = {};
    }

    const modelS = JSON.parse(JSON.stringify(finalData.extras.model));
    delete modelS.deployType;
    delete modelS.hub;
    finalData.extras.model = modelS;

    dispatch(backendService.updateProjectDetails(finalData));
    if (activeDetail?.companionId) {
      finalData.id = activeDetail?.companionId;
      dispatch(backendService.updateProjectDetails(finalData));
    }
    const newAD = JSON.parse(JSON.stringify(activeDetail));
    delete newAD.extras.model.deployType;
    dispatch(setActiveDetail(newAD));
    if (!remove) {
      setAddDeployType(true);
    } else {
      setAddDeployType(false);
    }
  }

  useEffect(() => {
    dispatch(backendService.getTrueAllActiveIcon({}));
  }, [dispatch]);

  useEffect(() => {}, [activeDetail, genericIcons]);

  useEffect(() => {
    const gi = activeIcons.filter(d => {
      if (d.tag === TECHNOLOGY_ICON_TAG) {
        if (!drawerRight || activeDetail?.model[TECHNOLOGY_ICON_TAG].indexOf(d.id) >= 0) {
          return true;
        }
      }
      return false;
    });

    setGenericIcons(gi);
  }, [activeIcons, setGenericIcons]);

  function close() {
    onClose(true);
  }

  function modifyDiscover() {
    //dispatch(setActiveProjectTab(TABS.DISCOVER));
    const projectId = activeDetail?.projectId;
    navigate(`/project-modeler/${projectId}`);
  }

  function convertPower(power) {
    const postStr = power >= 100 ? '>1mW' : 'kW';
    return power >= 100 ? postStr : (power > 0 ? power * 10 : 1) + postStr;
  }

  function toggleActive(showPopup) {
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
  }

  function toggleActiveOptions(subSection, id) {
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
  }

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
          {!isEmpty(activeDetail?.address) ? `${activeDetail.address} ` : ''} {activeDetail?.extras?.city} {activeDetail?.extras?.stateProvince} <br />
          {activeDetail?.extras?.hosting} &bull; {activeDetail?.extras?.cabinets} Cabinet{activeDetail?.extras?.cabinets === 1 ? '' : 's'} <br />
          {activeDetail?.extras?.cage}
          &nbsp;Cage{activeDetail?.extras?.cage === 1 ? '' : 's'} &bull; {convertPower(activeDetail?.extras?.powerMin)}~
          {convertPower(activeDetail?.extras?.powerMax)}
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
          {activeDetail?.type !== 'model' && <span style={{ color: 'var(--color-cathedral)' }}> | </span>}
          {activeDetail?.type !== 'model' && (
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
          )}
        </Box>
        <div>
          {activeDetail?.isFuture?.indexOf(false) >= 0 && <Chip label="Current" style={{ color: 'white', backgroundColor: 'var(--color-imperial)' }} />}
          {activeDetail?.isFuture?.indexOf(true) >= 0 && <Chip label="Future" style={{ color: 'white', backgroundColor: 'var(--color-future)' }} />}
        </div>
        <List style={{ paddingBottom: '40px' }}>
          <Divider />
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
                    {applications?.length > index + 1 && (
                      <IconBubble
                        addMargin
                        selected={activeDetail?.extras?.model?.[DISCOVER_REGION_FIELDS.APPLICATIONS]?.indexOf(applications[index + 1].id) >= 0}
                        detail={applications[index + 1]}
                        onClick={() => {
                          toggleActiveOptions(DISCOVER_REGION_FIELDS.APPLICATIONS, applications[index + 1].id);
                        }}
                      />
                    )}
                    {applications?.length > index + 2 && (
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
          {activeDetail?.extras?.hosting === HOSTING_PREFERNCES[0] && (
            <>
              <Divider />
              <ListItem disabled={!activeDetail?.extras?.active} disableGutters>
                <h3>Partners/Suppliers</h3>
              </ListItem>
            </>
          )}
          {activeDetail?.extras?.hosting === HOSTING_PREFERNCES[0] &&
            activeDetail?.extras?.active &&
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
            <h3>Technology Icons</h3>
          </ListItem>
          {activeDetail?.extras?.active &&
            genericIcons?.map((d, index) => {
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
                    {genericIcons?.length > index + 1 && (
                      <IconBubble
                        addMargin
                        selected={activeDetail?.extras?.model?.[TECHNOLOGY_ICON_TAG]?.indexOf(genericIcons[index + 1].id) >= 0}
                        icon={genericIcons[index + 1]}
                        onClick={() => {
                          toggleActiveOptions(TECHNOLOGY_ICON_TAG, genericIcons[index + 1].id);
                        }}
                      />
                    )}
                    {genericIcons?.length > index + 2 && (
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

          {activeDetail?.extras?.active && activeDetail?.extras?.hosting === HOSTING_PREFERNCES[0] && (
            <>
              <Divider />
              {!activeDetail?.extras?.model?.deployType && (
                <>
                  {!addDeployType && (
                    <>
                      <ListItem
                        style={{
                          cursor: 'pointer',
                          fontSize: '1.17em',
                          fontWeight: 'bold',
                          marginBlockStart: '1em',
                          marginBlockEnd: '1em',
                          marginInlineStart: '0px',
                          marginInlineEnd: '0px',
                        }}
                        disableGutters
                        onClick={() => {
                          setAddDeployType(true);
                        }}
                        onKeyDown={() => {
                          setAddDeployType(true);
                        }}>
                        + Add Deployment
                      </ListItem>
                      <Divider />
                    </>
                  )}
                  {addDeployType && (
                    <>
                      <ListItem disableGutters>
                        <h3 style={{ width: '100%' }}>
                          Choose Deployment
                          <div
                            style={{ color: 'red', cursor: 'pointer', float: 'right' }}
                            onClick={() => {
                              clearDeployType(true);
                            }}
                            onKeyDown={() => {
                              clearDeployType(true);
                            }}>
                            Remove
                          </div>
                        </h3>
                      </ListItem>
                      <Divider />
                      {Object.keys(typeLabel).map(type => {
                        return (
                          <ListItem key={`btn-deploy-type-${type}`}>
                            <div
                              onClick={() => {
                                setDeployType(type);
                              }}
                              onKeyDown={() => {
                                setDeployType(type);
                              }}
                              style={{
                                width: '100%',
                                border: '1px solid',
                                color: 'var(--color-homeworld)',
                                borderRadius: '5px',
                                marginLeft: '5px',
                                padding: '5px',
                                marginRight: '5px',
                                cursor: 'pointer',
                              }}>
                              + {typeLabel[type]}
                            </div>
                          </ListItem>
                        );
                      })}
                    </>
                  )}
                </>
              )}
              {activeDetail?.extras?.model?.deployType && (
                <>
                  <ListItem disableGutters>
                    <h4 style={{ width: '100%' }}>
                      {typeLabel[activeDetail?.extras?.model?.deployType]}
                      <div
                        onClick={() => {
                          clearDeployType();
                        }}
                        onKeyDown={() => {
                          clearDeployType();
                        }}
                        style={{
                          float: 'right',
                          color: 'var(--color-homeworld)',
                          cursor: 'pointer',
                          marginRight: '5px',
                        }}>
                        Change
                      </div>
                    </h4>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <span style={{ color: 'var(--color-cathedral)' }}>Org Size</span>
                  </ListItem>
                  <ListItem>
                    {deploySizes?.map(size => (
                      <div
                        key={`size-button-${size}`}
                        onClick={() => {
                          setDeployDetails({ ...deployDetails, ...defByTypeSize[activeDetail?.extras?.model?.deployType][size] });
                        }}
                        onKeyDown={() => {
                          setDeployDetails({ ...deployDetails, ...defByTypeSize[activeDetail?.extras?.model?.deployType][size] });
                        }}
                        style={{
                          border: deployDetails.size === size ? '0px' : '1px solid',
                          height: '20px',
                          color: 'var(--color-homeworld)',
                          backgroundColor: deployDetails.size === size ? 'rgba(62, 83, 193, 0.08)' : 'white',
                          borderRadius: '5px',
                          marginLeft: '5px',
                          padding: '5px',
                          cursor: deployDetails.size === size ? '' : 'pointer',
                          verticalAlign: 'bottom',
                        }}>
                        {size}
                      </div>
                    ))}
                  </ListItem>
                  <form noValidate>
                    <ListItem disableGutters sx={{ width: '100%' }}>
                      <TextInput
                        customWidth="100%"
                        id="cageSize"
                        label="Cage"
                        type="text"
                        value={deployDetails.cageSize}
                        onChange={v => {
                          setDeployDetails({ ...deployDetails, cageSize: v.target.value });
                        }}
                        error={errors?.cageSize}
                        required
                        usesValue
                        disabled={deployDetails.size !== deploySizes[4]}
                      />
                    </ListItem>
                    <ListItem disableGutters sx={{ width: '100%' }}>
                      <TextInput
                        customWidth="100%"
                        id="cabinets"
                        label="Cabinets"
                        type="text"
                        value={deployDetails.cabinets}
                        register={register}
                        onChange={v => {
                          setDeployDetails({ ...deployDetails, cabinets: v.target.value, totalkw: (parseInt(v.target.value, 10) * 4).toString() });
                        }}
                        error={errors?.cabinets}
                        required
                        usesValue
                        disabled={deployDetails.size !== deploySizes[4]}
                      />
                    </ListItem>
                    <ListItem disableGutters sx={{ width: '100%' }}>
                      <TextInput
                        customWidth="100%"
                        id="totalKw"
                        label="Total kW"
                        type="text"
                        value={deployDetails.totalkw}
                        register={register}
                        onChange={v => {
                          setDeployDetails({ ...deployDetails, totalkw: v.target.value });
                        }}
                        error={errors?.totalkw}
                        required
                        usesValue
                        disabled={deployDetails.size !== deploySizes[4]}
                      />
                    </ListItem>
                    <ListItem disableGutters sx={{ width: '100%' }}>
                      <TextInput
                        customWidth="100%"
                        id="crossConnects"
                        label="Cross Connects"
                        type="text"
                        value={deployDetails.crossConnects}
                        register={register}
                        onChange={v => {
                          setDeployDetails({ ...deployDetails, crossConnects: v.target.value });
                        }}
                        error={errors?.crossConnects}
                        required
                        usesValue
                        disabled={deployDetails.size !== deploySizes[4]}
                      />
                    </ListItem>
                    <ListItem disableGutters>
                      <TextInput
                        customWidth="100%"
                        id="ecosystemConnects"
                        label="Ecosystem Connects"
                        type="text"
                        value={deployDetails.ecosystemConnects}
                        register={register}
                        onChange={v => {
                          setDeployDetails({ ...deployDetails, ecosystemConnects: v.target.value });
                        }}
                        error={errors?.ecosystemConnects}
                        required
                        usesValue
                        disabled={deployDetails.size !== deploySizes[4]}
                      />
                    </ListItem>
                    <ListItem disableGutters>
                      <InputLabel id="authentication-label" style={{ fontSize: '14px' }}>
                        Authentication
                      </InputLabel>
                    </ListItem>
                    <ListItem disableGutters>
                      <Select
                        id="authentication"
                        label="Authentication"
                        labelId="authentication-label"
                        onChange={v => {
                          setDeployDetails({ ...deployDetails, authentication: v.target.value });
                        }}
                        value={deployDetails.authentication}
                        error={errors?.authentication}
                        variant="standard"
                        fullWidth>
                        {AuthChoices.map(value => {
                          return (
                            <MenuItem name={value} value={value} key={value}>
                              {value}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </ListItem>
                    <ListItem disableGutters>
                      <InputLabel id="designInstall-label" style={{ fontSize: '14px' }}>
                        Design/Install
                      </InputLabel>
                    </ListItem>
                    <ListItem disableGutters>
                      <Select
                        id="designInstall"
                        label="Authentication"
                        labelId="designInstall-label"
                        onChange={v => {
                          setDeployDetails({ ...deployDetails, designInstall: v.target.value });
                        }}
                        value={deployDetails.designInstall}
                        error={errors?.designInstall}
                        variant="standard"
                        fullWidth>
                        {DesignInstallChoices.map(value => {
                          return (
                            <MenuItem name={value} value={value} key={value}>
                              {value}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </ListItem>
                    <ListItem disableGutters>
                      <FormControlLabel
                        required
                        control={
                          <Switch
                            onChange={() => {
                              setDeployDetails({ ...deployDetails, onsiteAssistance: !deployDetails.onsiteAssistance });
                            }}
                            color="success"
                            checked={deployDetails.onsiteAssistance}
                          />
                        }
                        label="Onsite Assistance Required"
                      />
                    </ListItem>
                    <ListItem disableGutters>
                      <FormControlLabel
                        required
                        control={
                          <Switch
                            onChange={() => {
                              setDeployDetails({ ...deployDetails, cabinetHPC: !deployDetails.cabinetHPC });
                            }}
                            color="success"
                            checked={deployDetails.cabinetHPC}
                          />
                        }
                        label="Cabinets HPC Connectivity"
                      />
                    </ListItem>
                  </form>
                  <Divider />
                  <ListItem>
                    <div
                      style={{ color: 'red', cursor: 'pointer' }}
                      onClick={() => {
                        clearDeployType(true);
                      }}
                      onKeyDown={() => {
                        clearDeployType(true);
                      }}>
                      <DeleteOutline />
                      Remove Deployment
                    </div>
                  </ListItem>
                </>
              )}
            </>
          )}
        </List>
      </Box>
      {openConfirmPopup && <ModelPopup setOpenConfirmPopup={setOpenConfirmPopup} confirmFunc={() => toggleActive(false)} />}
    </>
  );
}

ModelPanelDataCenter.defaultProps = {
  drawerRight: false,
};

export default ModelPanelDataCenter;
