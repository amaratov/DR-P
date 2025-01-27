import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { QuestionMark } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import {
  ConnectionCancelAction,
  ConnectionSubAction,
  ConnectionSubActionsContainer,
  ModelPanelConnectionMainWrapper,
  ModelPanelMainHeader,
  ModelPanelMainHeaderAction,
  ModelPanelMainHeaderLeft,
  ModelPanelMainHeaderRight,
  ModelPanelMainHeaderText,
  ModelPanelVerticalDivider,
} from '../model/model-styled';
import TextInput from '../../form-elements/text-input';
import CustomButton from '../../form-elements/custom-button';
import { BUTTON_ICON, BUTTON_STYLE, DISCOVER_REGION_FIELDS, HOSTING_PREFERNCES, MODEL_DETAIL_TYPE } from '../../../utils/constants/constants';
import { convertTypeForConnection, getDGXValueForCity, isEmpty, mergeRegions } from '../../../utils/utils';
import { DRDivider } from '../../app/app-styled';
import {
  ConnectionCardItemAction,
  ConnectionCardItemAvatar,
  ConnectionCardItemAvatarImage,
  ConnectionCardItemContainer,
  ConnectionCardItemFooterAction,
  ConnectionCardItemInfo,
  ConnectionCardItemMainText,
  ConnectionCardItemSubText,
  ConnectionCardTitle,
  ConnectionCardWrapper,
  ConnectionSubmitBtn,
} from './connect-styled';
import { backendService } from '../../../services/backend';
import { setEditExistingConnect } from '../../../features/slices/connectionSlice';
import ConnectionPopup from './connection-popup';
import ConnectNotesPanel from './connect-notes-panel';
import { getSelectedProjectDetails } from '../../../features/selectors/ui';

function AddEditConnectionPanel({
  openConnectRegion,
  setOpenConnectRegion,
  setIsEndpoint,
  allConnections,
  detailsFromSelectedProject,
  activeIcons,
  connectionData,
  setConnectionData,
  editExistingConnect,
  dgx,
}) {
  // dispatch
  const dispatch = useDispatch();

  // params
  const routeParams = useParams();

  // selector
  const currentProjectInfo = useSelector(getSelectedProjectDetails);

  // state
  const [isEditName, setIsEditName] = useState(false);
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [openNotePanel, setOpenNotePanel] = useState(false);

  // const
  const projectId = currentProjectInfo?.id || routeParams?.id || 'unknown';

  // func
  const getTotalConnectionNumber = useCallback(() => {
    const origin1 = connectionData?.origins?.length || 0;
    const origin2 = connectionData?.onRampOrigins?.length || 0;
    return origin1 + origin2;
  }, [connectionData]);

  const handleRemovePoint = useCallback(
    (val, isOnRamp) => {
      if (isOnRamp) {
        const newOnRampOrigins = connectionData?.onRampOrigins?.filter(
          onRampOrigin => onRampOrigin?.name !== val?.name && onRampOrigin?.parent?.id !== val?.parent?.id
        );
        const newTypes = newOnRampOrigins?.length > 0 ? [...connectionData.originTypes] : connectionData.originTypes.filter(t => t !== 'regionalonramp');
        const newOnRampEndpoint =
          connectionData?.onRampEndpoint?.name === val?.name && connectionData?.onRampEndpoint?.parent?.id === val?.parent?.id
            ? null
            : connectionData?.onRampEndpoint;
        const newEndpointType =
          connectionData?.onRampEndpoint?.name === val?.name && connectionData?.onRampEndpoint?.parent?.id === val?.parent?.id
            ? null
            : connectionData?.endpointType;
        setConnectionData({
          ...connectionData,
          onRampOrigins: [...newOnRampOrigins],
          originTypes: [...newTypes],
          onRampEndpoint: newOnRampEndpoint,
          endpointType: newEndpointType,
        });
      } else {
        const newOrigins = connectionData?.origins?.filter(originId => originId !== val);
        const newTypes = newOrigins?.reduce((acc, originId) => {
          const valType = convertTypeForConnection(detailsFromSelectedProject?.find(d => d.id === originId)?.type);
          if (!acc.includes(valType)) acc.push(valType);
          return acc;
        }, []);
        const newEndpoint = connectionData?.endpoint === val ? null : connectionData?.endpoint;
        const newEndpointType = connectionData?.endpoint === val ? null : connectionData?.endpointType;
        setConnectionData({ ...connectionData, origins: [...newOrigins], originTypes: [...newTypes], endpoint: newEndpoint, endpointType: newEndpointType });
      }
    },
    [connectionData, setConnectionData, detailsFromSelectedProject]
  );

  const newConnectionTitle = useMemo(() => {
    const currConnectionNum = allConnections?.length || 0;
    const lastOne = currConnectionNum + 1;
    if (lastOne < 10) {
      return `Connection 0${lastOne}`;
    }
    return `Connection ${lastOne}`;
  }, [allConnections]);

  const handleRemoveConnection = useCallback(() => {
    if (!isEmpty(editExistingConnect)) {
      const deleteBody = {
        id: editExistingConnect?.id,
        projectId: editExistingConnect?.projectId,
      };
      dispatch(backendService.deleteProjectConnections(deleteBody));
      dispatch(setEditExistingConnect({}));
      setConnectionData({
        name: null,
        notes: null,
        projectId: editExistingConnect?.projectId,
        origins: [],
        originTypes: [],
        endpoint: null,
        endpointType: null,
      });
      setTimeout(() => dispatch(backendService.getProjectConnections(editExistingConnect?.projectId)), 800);
    }
  }, [dispatch, editExistingConnect, setConnectionData]);

  const handleSubmitConnectionData = useCallback(() => {
    const name = connectionData?.name || newConnectionTitle;
    const notes = connectionData?.notes || connectionData?.name || 'a connection';
    if (!connectionData?.id) {
      const finalData = { ...connectionData, name, projectId, notes };
      dispatch(backendService.newProjectConnections(finalData));
    }
    if (connectionData?.id) {
      const finalData = { ...connectionData, name, projectId, notes };
      dispatch(backendService.updateProjectConnections(finalData));
    }
    setConnectionData({
      name: null,
      notes: null,
      projectId,
      origins: [],
      originTypes: [],
      endpoint: null,
      endpointType: null,
    });
    if (!isEmpty(editExistingConnect)) dispatch(setEditExistingConnect({}));
    setTimeout(() => dispatch(backendService.getProjectConnections(projectId)), 500);
  }, [connectionData, dispatch, setConnectionData, editExistingConnect, projectId]);

  const handleCancelClick = useCallback(() => {
    setConnectionData({
      name: null,
      notes: null,
      projectId,
      origins: [],
      originTypes: [],
      endpoint: null,
      endpointType: null,
    });
    if (!isEmpty(editExistingConnect)) dispatch(setEditExistingConnect({}));
  }, [setConnectionData, editExistingConnect, dispatch]);

  const renderPointItem = id => {
    const aKey = `id-${Math.random().toString(16).slice(2)}`;
    const foundDetail = detailsFromSelectedProject.find(d => d?.id === id);
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
      if (foundDetail?.type === MODEL_DETAIL_TYPE) {
        return e.iconName === HOSTING_PREFERNCES[0];
      }
      return e.iconName === foundDetail?.named;
    })?.storageLocation;
    const foundDgx = getDGXValueForCity(foundDetail, dgx);

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
            <ConnectionCardItemAction onClick={() => handleRemovePoint(id)} onKeyDown={() => handleRemovePoint(id)}>
              Remove
            </ConnectionCardItemAction>
          </ConnectionCardItemInfo>
        </ConnectionCardItemContainer>
        <DRDivider margin="16px 0 14px 0" />
      </>
    );
  };

  const renderOnRampPointItem = detail => {
    const aKey = `id-${Math.random().toString(16).slice(2)}`;
    const parentDetail = detail?.parent;
    const previewUrl = activeIcons?.find(e => {
      const foundOnRampParent = mergeRegions(detailsFromSelectedProject)?.find(d => d?.extras?.active && d?.id === parentDetail?.id);
      const cloudName = foundOnRampParent?.extras?.cloud || '';
      const onRampIconName = `${cloudName} onramp`;
      return e?.tag === 'onramps' && e?.iconName?.toLowerCase() === onRampIconName?.toLowerCase();
    })?.storageLocation;

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
            <ConnectionCardItemMainText>{detail?.name || ''}</ConnectionCardItemMainText>
            <ConnectionCardItemSubText>{`${parentDetail?.extras?.cloud} - ${detail?.cloud_region}`}</ConnectionCardItemSubText>
            <ConnectionCardItemAction onClick={() => handleRemovePoint(detail, true)} onKeyDown={() => handleRemovePoint(detail, true)}>
              Remove
            </ConnectionCardItemAction>
          </ConnectionCardItemInfo>
        </ConnectionCardItemContainer>
        <DRDivider margin="16px 0 14px 0" />
      </>
    );
  };

  // effect
  useEffect(() => {
    if (!isEmpty(editExistingConnect)) {
      setConnectionData({ ...editExistingConnect });
    }
  }, [editExistingConnect, setConnectionData]);

  return (
    <>
      <ModelPanelConnectionMainWrapper>
        <ModelPanelMainHeader isEditName={isEditName}>
          <ModelPanelMainHeaderLeft>
            {!isEditName && <ModelPanelMainHeaderText>{connectionData?.name || newConnectionTitle}</ModelPanelMainHeaderText>}
            {isEditName && (
              <ModelPanelMainHeaderText isEditName={isEditName}>
                <TextInput
                  id="name"
                  placeholder="Add connection name"
                  usesValue
                  value={connectionData?.name || newConnectionTitle}
                  onBlur={e => {
                    setConnectionData({ ...connectionData, name: e.target.value });
                    setIsEditName(false);
                  }}
                  onChange={e => setConnectionData({ ...connectionData, name: e.target.value })}
                  variant="standard"
                  required
                />
              </ModelPanelMainHeaderText>
            )}
            <ModelPanelMainHeaderAction>
              <CustomButton buttonStyle={BUTTON_STYLE.ICON_BUTTON} icon={BUTTON_ICON.EDIT} type="button" onClickFunc={() => setIsEditName(!isEditName)} />
            </ModelPanelMainHeaderAction>
          </ModelPanelMainHeaderLeft>
          <ModelPanelMainHeaderRight>
            {(!isEmpty(connectionData.origins) || !isEmpty(editExistingConnect)) && (
              <ConnectionCancelAction onClick={() => handleCancelClick()}>
                <CloseIcon />
              </ConnectionCancelAction>
            )}
          </ModelPanelMainHeaderRight>
        </ModelPanelMainHeader>
        <ConnectionSubActionsContainer>
          <ConnectionSubAction onClick={() => setOpenNotePanel(true)}>Edit / View Notes</ConnectionSubAction>
          {!isEmpty(editExistingConnect) && (
            <>
              <ModelPanelVerticalDivider />
              <ConnectionSubAction useColor="#DC4B4A" onClick={() => setOpenConfirmPopup(true)}>
                Remove Connection
              </ConnectionSubAction>
            </>
          )}
        </ConnectionSubActionsContainer>
        {isEmpty(connectionData.origins) && isEmpty(connectionData.onRampOrigins) && (
          <>
            <DRDivider margin="16px 0 14px 0" />
            <CustomButton
              buttonStyle={BUTTON_STYLE.BORDERLESS_END_ICON_TEXT_BUTTON}
              icon={BUTTON_ICON.KEYBOARD_ARROW_RIGHT}
              buttonText="Choose Connection Origin"
              type="button"
              customMinWidth="300px"
              customMinHeight="50px"
              onClickFunc={() => {
                setOpenConnectRegion(!openConnectRegion);
                setIsEndpoint(false);
              }}
            />
            <DRDivider margin="14px 0 16px 0" />
          </>
        )}
        {(!isEmpty(connectionData.origins) || !isEmpty(connectionData.onRampOrigins)) && (
          <ConnectionCardWrapper>
            <ConnectionCardTitle>Origin point</ConnectionCardTitle>
            {connectionData?.origins?.map(originId => renderPointItem(originId))}
            {connectionData?.onRampOrigins?.map(detail => renderOnRampPointItem(detail))}
            <ConnectionCardItemFooterAction>
              <CustomButton
                buttonStyle={BUTTON_STYLE.BORDERLESS_START_ICON_STYLE}
                icon={BUTTON_ICON.ADD_BORDERLESS}
                buttonText="Add Origin Point"
                type="button"
                padding="0"
                onClickFunc={() => {
                  setOpenConnectRegion(!openConnectRegion);
                  setIsEndpoint(false);
                }}
              />
            </ConnectionCardItemFooterAction>
          </ConnectionCardWrapper>
        )}
        {(!isEmpty(connectionData.origins) || !isEmpty(connectionData.onRampOrigins)) && (
          <ConnectionCardWrapper>
            <ConnectionCardTitle>End point</ConnectionCardTitle>
            {isEmpty(connectionData.endpoint) && (
              <CustomButton
                buttonStyle={BUTTON_STYLE.BORDERLESS_END_ICON_TEXT_BUTTON}
                icon={BUTTON_ICON.KEYBOARD_ARROW_RIGHT}
                buttonText="Choose Connection End"
                type="button"
                customMinWidth="300px"
                customMinHeight="50px"
                onClickFunc={() => {
                  setOpenConnectRegion(!openConnectRegion);
                  setIsEndpoint(true);
                }}
              />
            )}
            {connectionData?.endpoint && renderPointItem(connectionData.endpoint)}
            {connectionData?.onRampEndpoint && renderOnRampPointItem(connectionData.onRampEndpoint)}
          </ConnectionCardWrapper>
        )}
        {(!isEmpty(connectionData.origins) || !isEmpty(connectionData.onRampOrigins)) && (
          <ConnectionSubmitBtn
            disableBtn={
              (isEmpty(connectionData.origins) && isEmpty(connectionData.onRampOrigins)) ||
              (isEmpty(connectionData.endpoint) && isEmpty(connectionData.onRampEndpoint))
            }
            onClick={handleSubmitConnectionData}>
            Done
          </ConnectionSubmitBtn>
        )}
      </ModelPanelConnectionMainWrapper>
      {openConfirmPopup && (
        <ConnectionPopup
          setOpenConfirmPopup={setOpenConfirmPopup}
          handleRemoveConnection={handleRemoveConnection}
          connectionName={connectionData?.name}
          connectionNum={getTotalConnectionNumber()}
        />
      )}
      {openNotePanel && (
        <ConnectNotesPanel
          connectionData={connectionData}
          setConnectionData={setConnectionData}
          editExistingConnect={editExistingConnect}
          setOpenNotePanel={setOpenNotePanel}
        />
      )}
    </>
  );
}

export default AddEditConnectionPanel;
