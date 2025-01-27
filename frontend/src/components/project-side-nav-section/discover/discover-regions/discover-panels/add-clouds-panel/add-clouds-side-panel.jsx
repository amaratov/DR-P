import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Backdrop, Box } from '@mui/material';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import {
  SidePanelContentItem,
  SidePanelContentWrapper,
  SidePanelEdgePatch,
  SidePanelHeaderCloseBtn,
  SidePanelHeaderText,
  SidePanelHeaderWrapper,
  SidePanelMainWrapper,
  SidePanelSaveButtonWrapper,
} from '../../../../../side-panel/side-panel-styled';
import CustomButton from '../../../../../form-elements/custom-button';
import { BUTTON_ICON, BUTTON_STYLE, REGION_PROJECT_DETAILS_CLOUD_PROVIDER_JSON_VALUES } from '../../../../../../utils/constants/constants';
import { LabelTextAltColor } from '../../../../../my-accout/account-info/account-info-styled';
import TextInput from '../../../../../form-elements/text-input';
import { DRDivider } from '../../../../../app/app-styled';
import { getSelectedRegionCloudDetails, getSelectedDiscoverRegionActiveState } from '../../../../../../features/selectors/ui';
import { backendService } from '../../../../../../services/backend';
import { refreshProjectDetailRegionTabs, resetEditMode, setSelectedRegionCloudDetails } from '../../../../../../features/slices/uiSlice';
import { isEmpty } from '../../../../../../utils/utils';

function AddCloudsSidePanel({ cloudProviderName, shutOffPanel, excludeCloudProvider, includeCloud, isEdit, cloudId }) {
  // dispatch
  const dispatch = useDispatch();

  // params
  const routeParams = useParams();

  // useForm
  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm();

  // selector
  //The following is only for editing
  const selectedCloudDetails = useSelector(getSelectedRegionCloudDetails);
  const activeRegionAndState = useSelector(getSelectedDiscoverRegionActiveState);

  // constant
  const open = true;
  const CPN = cloudProviderName || selectedCloudDetails?.named || '';

  // state
  const [openComputeUseCase, setOpenComputeUseCase] = useState(
    (!isEmpty(selectedCloudDetails) && selectedCloudDetails?.extras?.[REGION_PROJECT_DETAILS_CLOUD_PROVIDER_JSON_VALUES.COMPUTE_USE_CASE] !== '') || false
  );
  const [openNetworkUseCase, setOpenNetworkUseCase] = useState(
    (!isEmpty(selectedCloudDetails) && selectedCloudDetails?.extras?.[REGION_PROJECT_DETAILS_CLOUD_PROVIDER_JSON_VALUES.NETWORK_USE_CASE] !== '') || false
  );
  const [openStorageUseCases, setOpenStorageUseCases] = useState(
    (!isEmpty(selectedCloudDetails) && selectedCloudDetails?.extras?.[REGION_PROJECT_DETAILS_CLOUD_PROVIDER_JSON_VALUES.STORAGE_USE_CASE] !== '') || false
  );

  // func
  const handlePanelClose = useCallback(() => {
    setOpenComputeUseCase(false);
    setOpenNetworkUseCase(false);
    setOpenStorageUseCases(false);
    if (!isEdit) {
      excludeCloudProvider(cloudProviderName);
    } else {
      dispatch(setSelectedRegionCloudDetails({}));
      dispatch(resetEditMode());
    }
    shutOffPanel(false);
  }, [setOpenComputeUseCase, setOpenNetworkUseCase, setOpenStorageUseCases, cloudProviderName, excludeCloudProvider, shutOffPanel, dispatch]);

  const handleOpen = value => {
    if (value === 'computeUseCase') {
      setOpenComputeUseCase(true);
    } else if (value === 'networkUseCase') {
      setOpenNetworkUseCase(true);
    } else if (value === 'storageUseCase') {
      setOpenStorageUseCases(true);
    } else {
      setOpenComputeUseCase(false);
      setOpenNetworkUseCase(false);
      setOpenStorageUseCases(false);
    }
  };

  const handleComputeUseCaseRemove = () => {
    setOpenComputeUseCase(false);
  };

  const handleNetworkUseCaseRemove = () => {
    setOpenNetworkUseCase(false);
  };

  const handleStorageUseCaseRemove = () => {
    setOpenStorageUseCases(false);
  };

  const submitForm = async data => {
    try {
      if (isEdit) {
        const projectId = selectedCloudDetails.projectId || routeParams?.id || window.location.pathname.split('/')[2];
        const updatedCloudData = {
          cloudProviderName:
            selectedCloudDetails?.extras?.[REGION_PROJECT_DETAILS_CLOUD_PROVIDER_JSON_VALUES.CLOUD_PROVIDER_NAME] || selectedCloudDetails?.named,
          cloudRegionAndOnrampNotes: data.cloudRegionAndOnrampNotes,
          generalNotes: data.generalNotes,
          computeUseCase: openComputeUseCase ? data.computeUseCase : '',
          networkUseCase: openNetworkUseCase ? data.networkUseCase : '',
          storageUseCase: openStorageUseCases ? data.storageUseCase : '',
          iconId: selectedCloudDetails?.extras?.[REGION_PROJECT_DETAILS_CLOUD_PROVIDER_JSON_VALUES.ICON_ID] || selectedCloudDetails?.iconId || cloudId || '',
        };
        const finalData = {
          projectId,
          project_id: projectId,
          detailId: selectedCloudDetails.id,
          named: selectedCloudDetails.named,
          type: selectedCloudDetails.type,
          region: selectedCloudDetails.region,
          isFuture: selectedCloudDetails.isFuture,
          extras: updatedCloudData,
        };
        dispatch(backendService.updateProjectDetails(finalData));
      } else {
        const finalData = {
          [REGION_PROJECT_DETAILS_CLOUD_PROVIDER_JSON_VALUES.CLOUD_PROVIDER_NAME]: cloudProviderName,
          [REGION_PROJECT_DETAILS_CLOUD_PROVIDER_JSON_VALUES.CLOUD_REGION_AND_ONRAMP_NOTES]: data?.cloudRegionAndOnrampNotes.replace(/\n/g, ' ') || '',
          [REGION_PROJECT_DETAILS_CLOUD_PROVIDER_JSON_VALUES.GENERAL_NOTES]: data?.generalNotes.replace(/\n/g, ' ') || '',
          [REGION_PROJECT_DETAILS_CLOUD_PROVIDER_JSON_VALUES.COMPUTE_USE_CASE]: openComputeUseCase ? data?.computeUseCase.replace(/\n/g, ' ') : '',
          [REGION_PROJECT_DETAILS_CLOUD_PROVIDER_JSON_VALUES.NETWORK_USE_CASE]: openNetworkUseCase ? data?.networkUseCase.replace(/\n/g, ' ') : '',
          [REGION_PROJECT_DETAILS_CLOUD_PROVIDER_JSON_VALUES.STORAGE_USE_CASE]: openStorageUseCases ? data?.storageUseCase.replace(/\n/g, ' ') : '',
          [REGION_PROJECT_DETAILS_CLOUD_PROVIDER_JSON_VALUES.ICON_ID]: cloudId || '',
          isFuture: activeRegionAndState.isFuture,
        };

        includeCloud(cloudProviderName, finalData);
      }
      handlePanelClose();
      if (isEdit) {
        setTimeout(() => {
          dispatch(refreshProjectDetailRegionTabs());
          dispatch(resetEditMode());
        }, 100);
      }
      setTimeout(() => {
        reset();
      }, 100);
    } catch (err) {
      console.log('Something was not right! Try again.');
      console.error(err);
    }
  };

  return (
    <div>
      <SidePanelEdgePatch showPatch={openComputeUseCase || openNetworkUseCase || openStorageUseCases} />
      <Backdrop
        sx={{
          backdropFilter: 'blur(10px)',
          mixBlendMode: 'normal',
          background: 'linear-gradient(110.1deg, rgba(65, 94, 199, 0.9) 0%, rgba(77, 57, 202, 0.9) 100%)',
          zIndex: theme => theme.zIndex.drawer - 30,
        }}
        open={open}
      />
      <SwipeableDrawer
        disableEnforceFocus
        hideBackdrop
        anchor="left"
        onClose={() => {}}
        onOpen={() => {}}
        open={open}
        PaperProps={{
          style: {
            marginLeft: '8px',
            borderRadius: '30px',
            boxShadow: 'unset',
            border: 'unset',
          },
        }}>
        <form onSubmit={handleSubmit(submitForm)} style={{ position: 'relative' }}>
          <Box sx={{ minWidth: 350, position: 'relative' }} role="presentation">
            <SidePanelMainWrapper style={{ marginRight: '1rem' }}>
              <SidePanelHeaderWrapper>
                <SidePanelHeaderText>{CPN}</SidePanelHeaderText>
                <SidePanelHeaderCloseBtn>
                  <CloseIcon onClick={handlePanelClose} />
                </SidePanelHeaderCloseBtn>
              </SidePanelHeaderWrapper>
              <SidePanelContentWrapper>
                <SidePanelContentItem style={{ paddingBottom: '1.5rem' }}>
                  <LabelTextAltColor style={{ paddingBottom: '1.5rem' }}>Cloud Preferences</LabelTextAltColor>
                  <DRDivider />
                </SidePanelContentItem>
                <SidePanelContentItem>
                  <LabelTextAltColor style={{ padding: '0px' }}>Cloud region & onramp notes</LabelTextAltColor>
                  <TextInput
                    id="cloudRegionAndOnrampNotes"
                    variant="standard"
                    placeholder="Add Notes"
                    defaultValue={isEdit ? selectedCloudDetails?.extras?.[REGION_PROJECT_DETAILS_CLOUD_PROVIDER_JSON_VALUES.CLOUD_REGION_AND_ONRAMP_NOTES] : ''}
                    register={register}
                    autoFocus="false"
                    multiline
                    maxLength={60}
                    inputMinHeight="25px !important"
                    error={errors?.cloudRegionAndOnrampNotes}
                  />
                </SidePanelContentItem>
                <SidePanelContentItem>
                  <LabelTextAltColor style={{ padding: '0px' }}>General notes</LabelTextAltColor>
                  <TextInput
                    id="generalNotes"
                    variant="standard"
                    placeholder="Add Notes"
                    defaultValue={isEdit ? selectedCloudDetails?.extras?.[REGION_PROJECT_DETAILS_CLOUD_PROVIDER_JSON_VALUES.GENERAL_NOTES] : ''}
                    register={register}
                    multiline
                    inputMinHeight="25px !important"
                    autoFocus="false"
                    error={errors?.generalNotes}
                  />
                </SidePanelContentItem>
                {openComputeUseCase && (
                  <SidePanelContentItem style={{ marginBottom: '-3rem' }}>
                    <LabelTextAltColor style={{ padding: '0px' }}>Compute Notes</LabelTextAltColor>
                    <TextInput
                      id="computeUseCase"
                      variant="standard"
                      placeholder="Add Notes"
                      multiline
                      maxLength={60}
                      inputMinHeight="25px !important"
                      defaultValue={isEdit ? selectedCloudDetails?.extras?.[REGION_PROJECT_DETAILS_CLOUD_PROVIDER_JSON_VALUES.COMPUTE_USE_CASE] : ''}
                      register={register}
                      autoFocus="false"
                      error={errors?.computeUseCase}
                    />

                    <div style={{ position: 'relative', bottom: '95px', left: '13.5rem', width: 'max-content', margin: '0px' }}>
                      <CustomButton
                        buttonStyle={BUTTON_STYLE.DISCOVER_REGION_ADD_CLOUDS_REMOVE_STYLE}
                        icon={BUTTON_ICON.CANCEL}
                        useColor="#d30000"
                        type="button"
                        bgColor="#ff000021"
                        customMinWidth="25px"
                        customMinHeight="25px"
                        borderRadius="15px"
                        marginTop="60px"
                        onClickFunc={() => handleComputeUseCaseRemove('computeUseCase')}
                      />
                    </div>
                  </SidePanelContentItem>
                )}
                {openNetworkUseCase && (
                  <SidePanelContentItem style={{ marginBottom: '-3rem' }}>
                    <LabelTextAltColor style={{ padding: '0px' }}>Network Notes</LabelTextAltColor>
                    <TextInput
                      id="networkUseCase"
                      variant="standard"
                      placeholder="Add Notes"
                      maxLength={60}
                      multiline
                      inputMinHeight="25px !important"
                      defaultValue={isEdit ? selectedCloudDetails?.extras?.[REGION_PROJECT_DETAILS_CLOUD_PROVIDER_JSON_VALUES.NETWORK_USE_CASE] : ''}
                      register={register}
                      autoFocus="false"
                      error={errors?.networkUseCase}
                    />

                    <div style={{ position: 'relative', bottom: '90px', left: '13.5rem', width: 'max-content', margin: '0px' }}>
                      <CustomButton
                        buttonStyle={BUTTON_STYLE.DISCOVER_REGION_ADD_CLOUDS_REMOVE_STYLE}
                        icon={BUTTON_ICON.CANCEL}
                        useColor="#d30000"
                        type="button"
                        bgColor="#ff000021"
                        customMinWidth="25px"
                        customMinHeight="25px"
                        borderRadius="15px"
                        marginTop="60px"
                        onClickFunc={() => handleNetworkUseCaseRemove('networkUseCase')}
                      />
                    </div>
                  </SidePanelContentItem>
                )}
                {openStorageUseCases && (
                  <SidePanelContentItem style={{ marginBottom: '-3rem' }}>
                    <LabelTextAltColor style={{ padding: '0px' }}>Storage Notes</LabelTextAltColor>
                    <TextInput
                      id="storageUseCase"
                      variant="standard"
                      placeholder="Add Notes"
                      multiline
                      maxLength={60}
                      inputMinHeight="25px !important"
                      defaultValue={isEdit ? selectedCloudDetails?.extras?.[REGION_PROJECT_DETAILS_CLOUD_PROVIDER_JSON_VALUES.STORAGE_USE_CASE] : ''}
                      register={register}
                      autoFocus="false"
                      error={errors?.storageUseCase}
                    />

                    <div style={{ position: 'relative', bottom: '95px', left: '13.5rem', width: 'max-content', margin: '0px' }}>
                      <CustomButton
                        buttonStyle={BUTTON_STYLE.DISCOVER_REGION_ADD_CLOUDS_REMOVE_STYLE}
                        icon={BUTTON_ICON.CANCEL}
                        useColor="#d30000"
                        type="button"
                        bgColor="#ff000021"
                        customMinWidth="25px"
                        customMinHeight="25px"
                        borderRadius="15px"
                        marginTop="60px"
                        onClickFunc={() => handleStorageUseCaseRemove('storageUseCase')}
                      />
                    </div>
                  </SidePanelContentItem>
                )}
                {!openComputeUseCase && (
                  <SidePanelContentItem>
                    <CustomButton
                      buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
                      icon={BUTTON_ICON.ADD_BORDERLESS}
                      buttonText="Add Compute Use-case"
                      marginTop="30px"
                      type="button"
                      customMinWidth="300px"
                      customMinHeight="50px"
                      onClickFunc={() => handleOpen('computeUseCase')}
                    />
                    <DRDivider />
                  </SidePanelContentItem>
                )}
                {!openNetworkUseCase && (
                  <SidePanelContentItem>
                    <CustomButton
                      buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
                      icon={BUTTON_ICON.ADD_BORDERLESS}
                      buttonText="Add Network Use-case"
                      marginTop="30px"
                      type="button"
                      customMinWidth="300px"
                      customMinHeight="50px"
                      onClickFunc={() => handleOpen('networkUseCase')}
                    />
                    <DRDivider />
                  </SidePanelContentItem>
                )}
                {!openStorageUseCases && (
                  <SidePanelContentItem>
                    <CustomButton
                      buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
                      icon={BUTTON_ICON.ADD_BORDERLESS}
                      buttonText="Add Storage Use-case"
                      marginTop="30px"
                      type="button"
                      customMinWidth="300px"
                      customMinHeight="50px"
                      onClickFunc={() => handleOpen('storageUseCase')}
                    />
                    <DRDivider />
                  </SidePanelContentItem>
                )}
              </SidePanelContentWrapper>
            </SidePanelMainWrapper>
            <SidePanelSaveButtonWrapper customLeft="30px">
              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_STYLE}
                buttonText="Confirm Cloud Settings"
                type="submit"
                customMinWidth="300px"
                customMinHeight="56px"
              />
            </SidePanelSaveButtonWrapper>
          </Box>
        </form>
      </SwipeableDrawer>
    </div>
  );
}

AddCloudsSidePanel.prototype = {
  cloudProviderName: PropTypes.string,
  shutOffPanel: PropTypes.func,
  excludeCloudProvider: PropTypes.func,
  includeCloud: PropTypes.func,
  isEdit: PropTypes.bool,
  cloudId: PropTypes.string,
};

AddCloudsSidePanel.defaultProps = {
  cloudProviderName: '',
  shutOffPanel: () => {},
  excludeCloudProvider: () => {},
  includeCloud: () => {},
  isEdit: false,
  cloudId: '',
};

export default AddCloudsSidePanel;
