import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Backdrop, Box, InputAdornment, TextField } from '@mui/material';
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
  SidePanelButtonActive,
  SidePanelButtonInactive,
  SidePanelSubAreaLShape,
  SidePanelOptionItem,
} from '../../../../../side-panel/side-panel-styled';
import {
  LabelTextAltColor,
  FilledValueText,
  SubLabelText,
  FilledValueWrapperWithLShape,
  FilledValueRemoveIconWithLShape,
} from '../../../../../my-accout/account-info/account-info-styled';
import DiscoverRegionSelectionPanel from '../../../../../my-accout/selection-panel/discover-region-selection-panel';
import { getNameFromId, isEmpty } from '../../../../../../utils/utils';
import CustomButton from '../../../../../form-elements/custom-button';
import {
  BUTTON_ICON,
  BUTTON_STYLE,
  DISCOVER_REGION_FIELDS,
  DISCOVER_REGION_SELECTION_PANEL_APPLICATION_FIELD_VALUES,
  DISCOVER_REGION_SIDE_PANEL_APPLICATION,
} from '../../../../../../utils/constants/constants';
import { DRDivider } from '../../../../../app/app-styled';
import {
  getSelectedDetailsFromProject,
  getSelectedDiscoverRegionActiveState,
  getSelectedRegionApplicationDetails,
} from '../../../../../../features/selectors/ui';
import { resetEditMode } from '../../../../../../features/slices/uiSlice';
import { backendService } from '../../../../../../services/backend';

function DiscoverRegionsEditApplication() {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const selectedApplication = useSelector(getSelectedRegionApplicationDetails);
  const activeRegionAndState = useSelector(getSelectedDiscoverRegionActiveState);
  const detailsFromSelectedProject = useSelector(getSelectedDetailsFromProject);

  // useForm
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm();

  // state
  const [openHostingLocation, setOpenHostingLocation] = useState(false);
  const [additionalValues, setAdditionalValues] = useState({
    cloud: [],
    dataCenter: [],
    latencyTolerance: '',
  });

  // constant
  const open = true;
  const cloudSelectionOptions = useMemo(
    () =>
      detailsFromSelectedProject?.filter(
        detail =>
          detail.type === DISCOVER_REGION_FIELDS.CLOUDS && detail.region === activeRegionAndState?.region && detail.isFuture === activeRegionAndState?.isFuture
      ),
    [detailsFromSelectedProject, activeRegionAndState]
  );
  const dataCenterSelectionOptions = useMemo(
    () =>
      detailsFromSelectedProject?.filter(
        detail =>
          detail.type === DISCOVER_REGION_FIELDS.DATA_CENTRES &&
          detail.region === activeRegionAndState?.region &&
          detail.isFuture === activeRegionAndState?.isFuture
      ),
    [detailsFromSelectedProject, activeRegionAndState]
  );
  const latencyTolerance = ['0-15 ms', '16-30 ms', '31-45 ms'];

  // func
  const initSelectedApplication = useCallback(() => {
    if (!isEmpty(selectedApplication)) {
      setAdditionalValues({
        cloud: selectedApplication?.extras?.clouds || [],
        dataCenter: selectedApplication?.extras?.datacenters || [],
        latencyTolerance: selectedApplication?.extras?.latencyTolerance || '',
      });
    }
  }, [selectedApplication, setAdditionalValues]);

  const handleClick = useCallback(
    (val, fieldName, toggleValue) => {
      if (toggleValue === DISCOVER_REGION_SIDE_PANEL_APPLICATION.TOGGLE_SELECTED) {
        if (additionalValues?.[fieldName]?.includes(val)) {
          const newVal = additionalValues[fieldName].filter(el => el !== val);
          setAdditionalValues({ ...additionalValues, [fieldName]: newVal });
        } else {
          setAdditionalValues({ ...additionalValues, [fieldName]: additionalValues[fieldName].concat([val]) });
        }
      } else if (toggleValue === DISCOVER_REGION_SIDE_PANEL_APPLICATION.SET_ALL) {
        if (fieldName === DISCOVER_REGION_SELECTION_PANEL_APPLICATION_FIELD_VALUES.CLOUD) {
          setAdditionalValues({
            ...additionalValues,
            cloud: cloudSelectionOptions.map(value => value.named),
          });
        } else if (fieldName === DISCOVER_REGION_SELECTION_PANEL_APPLICATION_FIELD_VALUES.DATA_CENTER) {
          setAdditionalValues({
            ...additionalValues,
            dataCenter: dataCenterSelectionOptions.map(value => value.id),
          });
        }
      } else if (toggleValue === DISCOVER_REGION_SIDE_PANEL_APPLICATION.REMOVE_ALL) {
        if (fieldName === DISCOVER_REGION_SELECTION_PANEL_APPLICATION_FIELD_VALUES.CLOUD) {
          setAdditionalValues({
            ...additionalValues,
            cloud: [],
          });
        } else if (fieldName === DISCOVER_REGION_SELECTION_PANEL_APPLICATION_FIELD_VALUES.DATA_CENTER) {
          setAdditionalValues({
            ...additionalValues,
            dataCenter: [],
          });
        }
      }
    },
    [additionalValues, setAdditionalValues, dataCenterSelectionOptions, cloudSelectionOptions]
  );

  const onLatencyClick = useCallback(
    val => {
      if (additionalValues?.latencyTolerance === val) {
        setAdditionalValues({ ...additionalValues, latencyTolerance: '' });
      } else {
        setAdditionalValues({ ...additionalValues, latencyTolerance: val });
      }
    },
    [additionalValues, setAdditionalValues]
  );

  const handlePanelClose = useCallback(() => {
    setOpenHostingLocation(false);
    reset();
    setAdditionalValues({
      cloud: [],
      dataCenter: [],
      latencyTolerance: '',
    });
    dispatch(resetEditMode());
  }, [setAdditionalValues, setOpenHostingLocation, reset, dispatch]);

  const handleOpen = value => {
    if (value === DISCOVER_REGION_SELECTION_PANEL_APPLICATION_FIELD_VALUES.CLOUD) {
      setOpenHostingLocation(true);
    } else if (value === DISCOVER_REGION_SELECTION_PANEL_APPLICATION_FIELD_VALUES.DATA_CENTER) {
      setOpenHostingLocation(true);
    } else {
      setOpenHostingLocation(false);
    }
  };

  const handleHostingLocationRemove = (id, field) => {
    setOpenHostingLocation(false);
    handleClick(id, field, DISCOVER_REGION_SIDE_PANEL_APPLICATION.TOGGLE_SELECTED);
  };

  const submitForm = async data => {
    const finalData = {
      ...selectedApplication,
      detailId: selectedApplication.id,
      projectNotes: data?.generalNotes || '',
      extras: {
        clouds: additionalValues.cloud,
        datacenters: additionalValues.dataCenter,
        latencyTolerance: additionalValues.latencyTolerance,
      },
    };
    dispatch(backendService.updateProjectDetails(finalData));
    setTimeout(() => dispatch(backendService.getProjectDetails(selectedApplication?.projectId)), 1000);

    setOpenHostingLocation(false);
    dispatch(resetEditMode());
  };

  // effect
  useEffect(() => {
    reset({
      generalNotes: selectedApplication?.projectNotes,
    });
    initSelectedApplication();
  }, [selectedApplication, reset, initSelectedApplication]);

  return (
    <div>
      <SidePanelEdgePatch showPatch={openHostingLocation} />
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
            <SidePanelMainWrapper>
              <SidePanelHeaderWrapper>
                <SidePanelHeaderText>{selectedApplication?.named || ''}</SidePanelHeaderText>
                <SidePanelHeaderCloseBtn>
                  <CloseIcon onClick={handlePanelClose} />
                </SidePanelHeaderCloseBtn>
              </SidePanelHeaderWrapper>
              <SidePanelContentWrapper>
                <SidePanelContentItem style={{ paddingBottom: '0' }}>
                  <LabelTextAltColor>Hosting Location</LabelTextAltColor>
                </SidePanelContentItem>
                <SidePanelContentItem style={{ paddingTop: '0' }}>
                  <SubLabelText>Cloud</SubLabelText>
                  {!isEmpty(additionalValues?.cloud) &&
                    additionalValues?.cloud?.map(cloud => (
                      <FilledValueWrapperWithLShape key={`key-${cloud}`}>
                        <SidePanelSubAreaLShape />
                        <FilledValueText>{cloud}</FilledValueText>
                        <FilledValueRemoveIconWithLShape>
                          <CustomButton
                            buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                            icon={BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON}
                            buttonText="Remove"
                            type="button"
                            onClickFunc={() => handleHostingLocationRemove(cloud, DISCOVER_REGION_SELECTION_PANEL_APPLICATION_FIELD_VALUES.CLOUD)}
                          />
                        </FilledValueRemoveIconWithLShape>
                      </FilledValueWrapperWithLShape>
                    ))}
                </SidePanelContentItem>
                <SidePanelContentItem>
                  <SubLabelText>Data Center</SubLabelText>
                  {!isEmpty(additionalValues?.dataCenter) &&
                    additionalValues?.dataCenter?.map(id => (
                      <FilledValueWrapperWithLShape key={`key-${id}`}>
                        <SidePanelSubAreaLShape />
                        <FilledValueText>{getNameFromId(id, dataCenterSelectionOptions, 'named')}</FilledValueText>
                        <FilledValueRemoveIconWithLShape>
                          <CustomButton
                            buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                            icon={BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON}
                            buttonText="Remove"
                            type="button"
                            onClickFunc={() => handleHostingLocationRemove(id, DISCOVER_REGION_SELECTION_PANEL_APPLICATION_FIELD_VALUES.DATA_CENTER)}
                          />
                        </FilledValueRemoveIconWithLShape>
                      </FilledValueWrapperWithLShape>
                    ))}
                </SidePanelContentItem>
                <SidePanelContentItem style={{ marginBottom: '1rem' }}>
                  <CustomButton
                    buttonStyle={BUTTON_STYLE.OUTLINED_DIV_STYLE}
                    icon={BUTTON_ICON.ADD_BORDERLESS}
                    buttonText="Add Hosting Location"
                    type="button"
                    customMinWidth="300px"
                    customMinHeight="50px"
                    onClickFunc={() => handleOpen('cloud')}
                  />
                  <DRDivider style={{ marginTop: '1rem' }} />
                </SidePanelContentItem>
                <SidePanelContentItem>
                  <LabelTextAltColor>Latency Tolerance</LabelTextAltColor>
                </SidePanelContentItem>
                <SidePanelContentItem
                  style={{ display: 'flex', gridGap: '1rem', flexFlow: 'wrap', maxWidth: '20rem', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  {latencyTolerance.map(item => {
                    const isSelected = additionalValues?.latencyTolerance === item;
                    return (
                      <SidePanelOptionItem key={`ltc-${item}`} isSelected={isSelected} onClick={() => onLatencyClick(item)}>
                        {item}
                      </SidePanelOptionItem>
                    );
                  })}
                </SidePanelContentItem>
                <DRDivider />
                <SidePanelContentItem style={{ marginTop: '1rem' }}>
                  <TextField
                    InputProps={{
                      endAdornment: (
                        <InputAdornment sx={{ alignSelf: 'start' }}>
                          <CustomButton
                            buttonStyle={BUTTON_STYLE.END_ICON_BUTTON}
                            icon={BUTTON_ICON.CANCEL}
                            type="button"
                            onClickFunc={() => setValue('generalNotes', null, { shouldValidate: true })}
                          />
                        </InputAdornment>
                      ),
                      sx: { padding: '12px 0', '&:before': { borderBottomColor: '#e6e6e6' } },
                    }}
                    InputLabelProps={{ shrink: true, sx: { fontFamily: 'Inter,sans-serif', fontSize: '20px' } }}
                    error={errors?.generalNotes}
                    fullWidth
                    helperText={errors?.generalNotes?.message}
                    label="General Notes"
                    multiline
                    placeholder="Add Notes"
                    variant="standard"
                    {...register('generalNotes', { maxLength: { value: 2000, message: 'Text should be less than 2000 characters' } })}
                  />
                </SidePanelContentItem>
              </SidePanelContentWrapper>
            </SidePanelMainWrapper>
            <SidePanelSaveButtonWrapper customLeft="30px">
              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_STYLE}
                buttonText="Confirm Application Settings"
                type="submit"
                customMinWidth="300px"
                customMinHeight="56px"
              />
            </SidePanelSaveButtonWrapper>
          </Box>
        </form>
      </SwipeableDrawer>
      <DiscoverRegionSelectionPanel
        optionsCloud={cloudSelectionOptions}
        optionsDataCenter={dataCenterSelectionOptions}
        openField={openHostingLocation}
        setOpenField={setOpenHostingLocation}
        additionalValues={additionalValues}
        handleClick={handleClick}
        handleMainPanelClose={handlePanelClose}
      />
    </div>
  );
}

DiscoverRegionsEditApplication.prototype = {};

DiscoverRegionsEditApplication.defaultProps = {};

export default DiscoverRegionsEditApplication;
