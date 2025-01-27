import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, List, ListItem, ListItemText, InputLabel, Select, MenuItem, InputAdornment, TextField, Button, IconButton, Tooltip, Alert } from '@mui/material';
import { Close } from '@mui/icons-material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { mdiPlus } from '@mdi/js';
import Icon from '@mdi/react';
import CloseIcon from '@mui/icons-material/Close';
import CloudIcon from '@mui/icons-material/Cloud';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import {
  DiscoverRegionsSetRequirementsPanelMain,
  DiscoverRegionsSetRequirementsFlexPanelForm,
  DiscoverRegionsSetRequirementsPanelHeaderText,
  DiscoverRegionsSetRequirementsPanelContentWrapper,
  DiscoverRegionsSetRequirementsPanelContentHeaderText,
  DiscoverRegionsSetRequirementsPanelActionWrapper,
  DiscoverRegionsFlatButtonFormElement,
  DiscoverRegionsFlatButtonFormContainer,
} from '../discover-regions-set-requirements-styled';
import { DependencyTextWrapper, DiscoverRegionsCustomerLocationsLayout } from './add-customer-locations-panel-styled';
import TextInput from '../../../../../form-elements/text-input';
import { BUTTON_ICON, BUTTON_STYLE, DISCOVER_REGION_FIELDS, REGIONS_INNER_TABS, OFFICE_TYPES } from '../../../../../../utils/constants/constants';
import CustomButton from '../../../../../form-elements/custom-button';
import {
  openAddDataCenterMode,
  openAddRegionApplicationsMode,
  openAddRegionCloudsMode,
  resetAddCustomerLocationsMode,
  resetEditMode,
  setSelectedRegionCustomerLocationDetails,
  clearProjectDetailError,
  setProjectDetailFulfilled,
} from '../../../../../../features/slices/uiSlice';
import { getAllCountries, getCityFromStateProvince, getNameFromId, getStateProvincesForCountry, isEmpty } from '../../../../../../utils/utils';
import {
  getSelectedDetailsFromProject,
  getSelectedDiscoverRegionActiveState,
  getSelectedProjectDetails,
  getSelectedRegionCustomerLocationDetails,
  getProjectDetailError,
  getProjectDetailFulfilled,
} from '../../../../../../features/selectors/ui';
import DependenciesSidePanel from './add-dependencies-side-panel';
import DependencySection from './dependeny-section';
import { backendService } from '../../../../../../services/backend';
import { SidePanelAddOrRemoveIcon } from '../../../../../side-panel/side-panel-styled';
import { DRDivider, GeneralTextFieldErrorMsg } from '../../../../../app/app-styled';
import { StandardTextField } from '../../../../../form-elements/text-input-styled';

const { APPLICATIONS, CLOUDS, CUSTOMER_LOCATIONS, DATA_CENTRES } = DISCOVER_REGION_FIELDS;

const FORM_GRID_FULL = '-1/1';
const FORM_GRID_HALF = 'span 3';
const FORM_GRID_THIRD = 'span 2';

function getDependencyNames(selected = [], options = []) {
  return selected.map(s => options.find(o => o.id === s)?.name).join(', ');
}

function DependencyAddButton({ disabled, onClick, text }) {
  return (
    <DiscoverRegionsFlatButtonFormElement
      disabled={disabled}
      role="button"
      tabIndex={0}
      onKeyDown={event => !disabled && onClick(event)}
      onClick={event => !disabled && onClick(event)}>
      <div style={{ display: 'contents' }}>
        <Icon path={mdiPlus} size={1} horizontal vertical />
        <p style={{ paddingLeft: '0.5rem', userSelect: 'none' }}>{text}</p>
      </div>
    </DiscoverRegionsFlatButtonFormElement>
  );
}

function DependencySidePanelItems({ foundOptions, hasValue, onSelection, renderTagLine = () => {} }) {
  return (
    <List sx={{ padding: '8px 0' }}>
      {foundOptions.map(iv => (
        <>
          <ListItem key={`${iv?.id}${iv?.name}`} sx={{ paddingLeft: '2px' }}>
            <ListItemText primary={iv?.name || ''} />
            <SidePanelAddOrRemoveIcon>
              <CustomButton
                buttonStyle={BUTTON_STYLE.ICON_BUTTON}
                icon={hasValue(iv) ? BUTTON_ICON.REMOVE_CIRCLE_OUTLINED_ICON : BUTTON_ICON.ADD_OUTLINED}
                type="button"
                onClickFunc={event => onSelection(iv)}
              />
            </SidePanelAddOrRemoveIcon>
          </ListItem>
          <DRDivider component="li" />
        </>
      ))}
      {renderTagLine()}
    </List>
  );
}

function DisplayAddedDependency({ gridColumn, label, onClick, onRemoveAll, value }) {
  return (
    <Box alignItems="center" display="flex" gap="8px" gridColumn={gridColumn} paddingRight="1rem">
      <TextField
        InputLabelProps={{ shrink: true }}
        InputProps={{
          autoFocus: false,
          endAdornment: (
            <InputAdornment position="end">
              <CreateOutlinedIcon style={{ color: 'var(--color-cathedral)', cursor: 'pointer' }} />
            </InputAdornment>
          ),
          inputProps: {
            sx: {
              borderBottomColor: 'var(--color-cathedral)',
              cursor: 'pointer',
              padding: '14px 0',
            },
          },
          onClick,
        }}
        className="form-text-input"
        fullWidth
        label={label}
        readOnly
        value={value}
        variant="standard"
        sx={{
          '.MuiInput-root::before': {
            borderBottomColor: '#e6e6e6',
          },
        }}
      />
      <IconButton onClick={onRemoveAll} sx={{ marginTop: '16px' }}>
        <CloseIcon style={{ color: 'var(--color-cathedral)', cursor: 'pointer' }} />
      </IconButton>
    </Box>
  );
}

function DiscoverRegionsAddCustomerLocations() {
  const dispatch = useDispatch();

  // params
  const routeParams = useParams();

  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    reset,
    setValue,
    trigger,
    watch,
  } = useForm({ defaultValues: { applications: [], clouds: [], datacenters: [] } });

  const { applications, clouds, datacenters, country, stateProvince, city, stateProvinceText, cityText } = getValues();
  const watchedCountryVal = watch('country');
  const watchedStateProvinceVal = watch('stateProvince');
  const watchedCityVal = watch('city');
  const watchedStateProvinceTextVal = watch('stateProvinceText');
  const watchedCityTextVal = watch('cityText');

  const project = useSelector(getSelectedProjectDetails);
  const projectDetails = useSelector(getSelectedDetailsFromProject);
  const selectedRegion = useSelector(getSelectedDiscoverRegionActiveState);
  const selectedCustomerLocation = useSelector(getSelectedRegionCustomerLocationDetails);
  const isEditing = !isEmpty(selectedCustomerLocation);
  const projectId = selectedCustomerLocation?.projectId || project?.id || routeParams?.id || window.location.pathname.split('/')[2];
  const projectDetailError = useSelector(getProjectDetailError);
  const projectDetailFulfilled = useSelector(getProjectDetailFulfilled);

  const [openApps, setOpenApp] = useState(false);
  const [openDc, setOpenDc] = useState(false);
  const [openCloud, setOpenCloud] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const options = useMemo(() => {
    return (projectDetails || []).reduce(
      (acc, crr) => {
        if (![APPLICATIONS, CLOUDS, DATA_CENTRES].includes(crr?.type) || crr?.region !== selectedRegion.region || crr?.isFuture !== selectedRegion.isFuture) {
          return acc;
        }
        acc[crr.type] = (acc[crr.type] || []).concat({ id: crr?.id, name: crr?.named });
        return acc;
      },
      { applications: [], clouds: [], datacenters: [] }
    );
  }, [projectDetails, selectedRegion]);

  const allStateProvinceOption = useMemo(() => {
    return getStateProvincesForCountry(watchedCountryVal);
  }, [watchedCountryVal]);

  const allCityOption = useMemo(() => {
    return getCityFromStateProvince(watchedCountryVal, watchedStateProvinceVal);
  }, [watchedCountryVal, watchedStateProvinceVal]);

  const activeStateProvinceSelect = useMemo(() => {
    return allStateProvinceOption.length > 0 || watchedCountryVal === undefined;
  }, [allStateProvinceOption, watchedCountryVal]);

  const activeStateProvinceText = useMemo(() => {
    return allStateProvinceOption.length === 0 && watchedCountryVal !== undefined;
  }, [allStateProvinceOption, watchedCountryVal]);

  const activeCitySelect = useMemo(() => {
    return (
      watchedCountryVal === undefined ||
      allCityOption.length > 0 ||
      (allStateProvinceOption?.length > 0 && watchedCountryVal !== undefined && allCityOption.length > 0) ||
      (allStateProvinceOption?.length > 0 && isEmpty(watchedStateProvinceVal) && watchedCountryVal !== undefined)
    );
  }, [allCityOption, watchedCountryVal, watchedStateProvinceVal, allStateProvinceOption]);

  const activeCityText = useMemo(() => {
    return (
      (allCityOption.length === 0 && allStateProvinceOption?.length === 0 && watchedCountryVal !== undefined) ||
      (allCityOption.length === 0 && watchedCountryVal !== undefined && !isEmpty(watchedStateProvinceVal)) ||
      (allCityOption.length === 0 && allStateProvinceOption.length > 0 && !isEmpty(watchedStateProvinceVal))
    );
  }, [allCityOption, watchedCountryVal, allStateProvinceOption, watchedStateProvinceVal]);

  const handleApplictionSelection = useCallback(
    value => {
      const { applications: apps, clouds: clds, datacenters: dcs } = getValues();

      const appDetails = projectDetails.find(a => a.id === value);

      const { clouds: appClouds, datacenters: appDCs } = appDetails?.extras || { clouds: [], datacenters: [] };

      const toBeRemoved = apps.includes(value);

      const newApps = toBeRemoved ? apps.filter(id => id !== value) : apps.concat(value);
      const newClouds = toBeRemoved
        ? clds.filter(id => !appClouds.includes(getNameFromId(id, options.clouds)))
        : clds.concat(appClouds.map(name => options.clouds.find(cld => cld.name === name)?.id));
      const newDCs = toBeRemoved ? dcs.filter(id => !appDCs.includes(id)) : dcs.concat(appDCs);

      setValue('applications', newApps);
      setValue('clouds', newClouds);
      setValue('datacenters', newDCs);
      trigger();
    },
    [getValues, projectDetails, setValue]
  );

  const handleDependencySelection = useCallback(
    (value, field) => {
      const form = getValues();
      const fieldValue = form[field] || [];
      const newValue = fieldValue.includes(value) ? fieldValue.filter(id => id !== value) : fieldValue.concat(value);
      setValue(field, newValue, { shouldValidate: true });
    },
    [getValues, setValue]
  );

  const closePanel = useCallback(() => {
    reset();
    if (isEditing) {
      dispatch(resetEditMode());
      dispatch(setSelectedRegionCustomerLocationDetails({}));
    } else {
      dispatch(resetAddCustomerLocationsMode());
    }
  }, [dispatch]);

  const openAddDependencyPanel = useCallback(
    kind => {
      switch (kind) {
        case APPLICATIONS:
          setOpenApp(false);
          dispatch(openAddRegionApplicationsMode());
          break;
        case CLOUDS:
          setOpenCloud(false);
          dispatch(openAddRegionCloudsMode());
          break;
        case DATA_CENTRES:
          setOpenDc(false);
          dispatch(openAddDataCenterMode());
          break;
        default:
          console.log(`No case for opening ${kind}, noop`);
          break;
      }
    },
    [dispatch, setOpenApp, setOpenCloud, setOpenDc]
  );

  useEffect(() => {
    Object.entries(selectedCustomerLocation?.extras || {}).forEach(([id, value]) => {
      if (id === 'clouds') {
        const cloudIds = value.map(name => options.clouds.find(cld => cld.name === name)?.id);
        setValue(id, cloudIds);
        return;
      }
      if (id === 'city') {
        setValue('cityText', value);
      } else if (id === 'stateProvince') {
        setValue('stateProvinceText', value);
      }
      setValue(id, value);
    });
    if (isEditing) trigger();
  }, [selectedCustomerLocation, setValue, isEditing]);

  useEffect(() => {
    dispatch(clearProjectDetailError());
    dispatch(setProjectDetailFulfilled(false));
  }, []);

  useEffect(() => {
    if (projectDetailError === '' && projectDetailFulfilled) {
      dispatch(backendService.getProjectDetails(projectId));
      dispatch(setProjectDetailFulfilled(false));
      closePanel();
    } else if (projectDetailError !== '') {
      setShowAlert(true);
    }
  }, [reset, dispatch, backendService, projectDetailError, projectDetailFulfilled, projectId]);

  const submitForm = async form => {
    const formValue = {
      applications: form.applications,
      clouds: form.clouds,
      datacenters: form.datacenters,
      country: form.country,
      stateProvince: activeStateProvinceText ? form.stateProvinceText || form.stateProvince : form.stateProvince,
      city: activeCityText ? form.cityText || form.city : form.city,
      officeName: form.officeName,
      officeAddress: form.officeAddress,
      officeType: form.officeType,
      numberOfLocations: form.numberOfLocations,
      totalUsers: form.totalUsers,
      additionalNotes: form.additionalNotes,
    };
    const payload = {
      address: form.officeAddress,
      detailId: isEditing ? selectedCustomerLocation.id : 'new',
      isFuture: selectedRegion.isFuture,
      extras: {
        ...selectedCustomerLocation?.extras,
        ...formValue,
        clouds: clouds.map(id => getNameFromId(id, options.clouds)),
      },
      named: form?.officeName,
      projectId,
      region: selectedRegion.region,
      stateInfo: selectedRegion.isFuture ? REGIONS_INNER_TABS.FUTURE_STATE : REGIONS_INNER_TABS.CURRENT_STATE,
      type: CUSTOMER_LOCATIONS,
      projectNotes: form?.additionalNotes || '',
    };

    if (isEditing) {
      await dispatch(backendService.updateProjectDetails(payload));
    } else {
      await dispatch(backendService.newProjectDetail(payload));
    }
  };

  return (
    <DiscoverRegionsSetRequirementsPanelMain>
      <form onSubmit={handleSubmit(submitForm)} noValidate>
        <Box role="presentation">
          <DiscoverRegionsSetRequirementsFlexPanelForm customWidth="600" customPadding="40">
            {showAlert && (
              <Alert
                icon={
                  <Close
                    onClick={() => {
                      setShowAlert(false);
                    }}
                    fontSize="inherit"
                  />
                }
                severity="error">
                {projectDetailError}
              </Alert>
            )}
            <DiscoverRegionsSetRequirementsPanelContentWrapper style={{ display: 'flex' }}>
              <DiscoverRegionsSetRequirementsPanelHeaderText>
                {isEditing ? 'Edit' : 'Add'} Customer Location Information
              </DiscoverRegionsSetRequirementsPanelHeaderText>
            </DiscoverRegionsSetRequirementsPanelContentWrapper>
            <DiscoverRegionsSetRequirementsPanelContentWrapper overflow="scroll">
              <DiscoverRegionsCustomerLocationsLayout>
                <DiscoverRegionsSetRequirementsPanelContentHeaderText gridColumn={FORM_GRID_FULL}>
                  Customer Information
                </DiscoverRegionsSetRequirementsPanelContentHeaderText>
                <Box gridColumn={FORM_GRID_THIRD}>
                  <InputLabel
                    id="countryLabel"
                    required
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      letterSpacing: '-0.004em',
                      color: errors?.country ? '#d32f2f' : 'var(--color-cathedral)',
                    }}>
                    Country
                  </InputLabel>
                  <Controller
                    control={control}
                    defaultValue=""
                    name="country"
                    rules={{ required: 'This is a required field' }}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        id="country"
                        label="Country"
                        variant="standard"
                        fullWidth
                        gridColumn={FORM_GRID_THIRD}
                        longScreen
                        onChange={onChange}
                        error={errors?.country}
                        sx={{
                          '&:before': {
                            borderBottom: '1px solid #e6e6e6',
                          },
                        }}
                        style={{
                          minWidth: '100%',
                          minHeight: '50px',
                          fontFamily: 'Inter, sans-serif',
                        }}
                        value={value}>
                        {getAllCountries()?.map(c => (
                          <MenuItem key={c?.name} value={c?.isoCode}>
                            {c?.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors?.country && <GeneralTextFieldErrorMsg>{errors?.country?.message}</GeneralTextFieldErrorMsg>}
                </Box>
                <Box gridColumn={FORM_GRID_THIRD}>
                  <InputLabel
                    id="stateProvinceLabel"
                    required
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      letterSpacing: '-0.004em',
                      color: errors?.stateProvince ? '#d32f2f' : 'var(--color-cathedral)',
                    }}>
                    State / Province
                  </InputLabel>
                  {activeStateProvinceSelect && (
                    <Controller
                      control={control}
                      defaultValue=""
                      name="stateProvince"
                      rules={{ required: 'This is a required field' }}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          disabled={isEmpty(country)}
                          id="stateProvince"
                          label="State / Province"
                          variant="standard"
                          fullWidth
                          gridColumn={FORM_GRID_THIRD}
                          longScreen
                          onChange={onChange}
                          error={errors?.stateProvince || !allStateProvinceOption.some(sp => sp.name === watchedStateProvinceVal)}
                          sx={{
                            '&:before': {
                              borderBottom: '1px solid #e6e6e6',
                            },
                          }}
                          style={{
                            minWidth: '100%',
                            minHeight: '50px',
                            fontFamily: 'Inter, sans-serif',
                          }}
                          value={value}>
                          {allStateProvinceOption?.map(c => (
                            <MenuItem key={c?.name} value={c?.name}>
                              {c?.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  )}
                  {activeStateProvinceText && (
                    <Controller
                      control={control}
                      defaultValue={isEditing ? selectedCustomerLocation?.extras?.stateProvince : ''}
                      name="stateProvince"
                      rules={{ required: 'This is a required field' }}
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          id="stateProvinceText"
                          variant="standard"
                          fullWidth
                          gridColumn={FORM_GRID_THIRD}
                          longScreen
                          onChange={onChange}
                          sx={{
                            '&:before': {
                              borderBottom: '1px solid #e6e6e6',
                            },
                          }}
                          style={{
                            minWidth: '100%',
                            minHeight: '50px',
                            fontFamily: 'Inter, sans-serif',
                          }}
                          defaultValue={isEditing ? selectedCustomerLocation?.extras?.stateProvince : ''}
                          value={value}
                        />
                      )}
                    />
                  )}
                  {errors?.stateProvince && <GeneralTextFieldErrorMsg>{errors?.stateProvince?.message}</GeneralTextFieldErrorMsg>}
                  {activeStateProvinceSelect &&
                    !isEmpty(watchedStateProvinceVal) &&
                    !allStateProvinceOption.some(sp => sp.name === watchedStateProvinceVal) &&
                    allStateProvinceOption.length !== 0 && <GeneralTextFieldErrorMsg>Invalid state / province value</GeneralTextFieldErrorMsg>}
                  {activeStateProvinceText &&
                    isEmpty(watchedStateProvinceTextVal) &&
                    watchedCountryVal !== undefined &&
                    allStateProvinceOption.length === 0 && <GeneralTextFieldErrorMsg>Invalid state / province value</GeneralTextFieldErrorMsg>}
                </Box>
                <Box gridColumn={FORM_GRID_THIRD}>
                  <InputLabel
                    id="cityLabel"
                    required
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      letterSpacing: '-0.004em',
                      color: errors?.city ? '#d32f2f' : 'var(--color-cathedral)',
                    }}>
                    City
                  </InputLabel>
                  {activeCitySelect && (
                    <Controller
                      control={control}
                      defaultValue=""
                      name="city"
                      rules={{ required: 'This is a required field' }}
                      render={({ field: { onChange, value } }) => (
                        <Select
                          disabled={isEmpty(stateProvince)}
                          id="city"
                          label="City"
                          variant="standard"
                          fullWidth
                          gridColumn={FORM_GRID_THIRD}
                          longScreen
                          onChange={onChange}
                          error={errors?.city || !allCityOption.some(c => c.name === watchedCityVal)}
                          sx={{
                            '&:before': {
                              borderBottom: '1px solid #e6e6e6',
                            },
                          }}
                          style={{
                            minWidth: '100%',
                            minHeight: '50px',
                            fontFamily: 'Inter, sans-serif',
                          }}
                          value={value}>
                          {allCityOption?.map(c => (
                            <MenuItem key={c?.name} value={c?.name}>
                              {c?.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  )}
                  {activeCityText && (
                    <Controller
                      control={control}
                      defaultValue=""
                      name="cityText"
                      rules={{ required: 'This is a required field' }}
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          id="cityText"
                          variant="standard"
                          fullWidth
                          gridColumn={FORM_GRID_THIRD}
                          longScreen
                          onChange={onChange}
                          sx={{
                            '&:before': {
                              borderBottom: '1px solid #e6e6e6',
                            },
                          }}
                          style={{
                            minWidth: '100%',
                            minHeight: '50px',
                            fontFamily: 'Inter, sans-serif',
                          }}
                          defaultValue={isEditing ? selectedCustomerLocation?.extras?.city : ''}
                          value={value}
                        />
                      )}
                    />
                  )}
                  {errors?.city && <GeneralTextFieldErrorMsg>{errors?.city?.message}</GeneralTextFieldErrorMsg>}
                  {activeCitySelect && !isEmpty(watchedCityVal) && !allCityOption.some(c => c.name === watchedCityVal) && allCityOption.length !== 0 && (
                    <GeneralTextFieldErrorMsg>Invalid city value</GeneralTextFieldErrorMsg>
                  )}
                  {activeCityText && isEmpty(watchedCityTextVal) && allCityOption.length === 0 && (
                    <GeneralTextFieldErrorMsg>Invalid city value</GeneralTextFieldErrorMsg>
                  )}
                </Box>
                <TextInput
                  customWidth="100%"
                  id="officeName"
                  label="Office Name"
                  type="text"
                  defaultValue=""
                  variant="standard"
                  register={register}
                  error={errors?.officeName}
                  gridColumn={FORM_GRID_HALF}
                  longScreen
                  required
                />
                <TextInput
                  customWidth="100%"
                  id="officeAddress"
                  label="Office Address"
                  type="text"
                  defaultValue=""
                  variant="standard"
                  register={register}
                  error={errors?.officeAddress}
                  gridColumn={FORM_GRID_HALF}
                  longScreen
                />
                <Box gridColumn={FORM_GRID_THIRD}>
                  <InputLabel
                    id="officeTypeLabel"
                    required
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      letterSpacing: '-0.004em',
                      color: errors?.officeType ? '#d32f2f' : 'var(--color-cathedral)',
                    }}>
                    Office Type
                  </InputLabel>
                  <Controller
                    control={control}
                    defaultValue=""
                    name="officeType"
                    rules={{ required: 'This is a required field' }}
                    render={({ field: { onChange, value } }) => (
                      <Select
                        id="officeType"
                        label="Office Type"
                        variant="standard"
                        fullWidth
                        gridColumn={FORM_GRID_THIRD}
                        longScreen
                        onChange={onChange}
                        error={errors?.officeType}
                        sx={{
                          '&:before': {
                            borderBottom: '1px solid #e6e6e6',
                          },
                        }}
                        style={{
                          minWidth: '100%',
                          minHeight: '50px',
                          fontFamily: 'Inter, sans-serif',
                        }}
                        value={value}>
                        {OFFICE_TYPES.map(option => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors?.officeType && <GeneralTextFieldErrorMsg>{errors?.officeType?.message}</GeneralTextFieldErrorMsg>}
                </Box>
                <TextInput
                  customWidth="100%"
                  id="numberOfLocations"
                  label="Number of Location"
                  type="text"
                  defaultValue=""
                  variant="standard"
                  register={register}
                  error={errors?.numberOfLocations}
                  gridColumn={FORM_GRID_THIRD}
                  longScreen
                />
                <TextInput
                  customWidth="100%"
                  id="totalUsers"
                  label={
                    <span>
                      Total Users
                      <Tooltip title="Total users across specified locations" placement="top">
                        <InfoOutlinedIcon style={{ color: '#5f70cc', paddingLeft: '4px', fontSize: 'inherit' }} />
                      </Tooltip>
                    </span>
                  }
                  type="text"
                  defaultValue=""
                  variant="standard"
                  register={register}
                  error={errors?.totalUsers}
                  gridColumn={FORM_GRID_THIRD}
                  longScreen
                />
                <TextInput
                  customWidth="100%"
                  id="additionalNotes"
                  type="text"
                  defaultValue=""
                  variant="standard"
                  placeholder="Enter any relevant location specific notes"
                  register={register}
                  error={errors?.additionalNotes}
                  gridColumn={FORM_GRID_FULL}
                  longScreen
                />
                <DiscoverRegionsSetRequirementsPanelContentHeaderText gridColumn={FORM_GRID_FULL}>
                  Location Requirements
                </DiscoverRegionsSetRequirementsPanelContentHeaderText>
                {!isEmpty(applications) ? (
                  <DisplayAddedDependency
                    gridColumn={FORM_GRID_FULL}
                    label="Application Requirement"
                    onClick={() => {
                      setOpenApp(true);
                    }}
                    onRemoveAll={() => {
                      setValue('applications', [], { shouldValidate: true });
                    }}
                    value={getDependencyNames(applications, options.applications)}
                  />
                ) : null}
                {!isEmpty(clouds) ? (
                  <DisplayAddedDependency
                    gridColumn={FORM_GRID_FULL}
                    label="Cloud Requirement"
                    onClick={() => {
                      setOpenCloud(true);
                    }}
                    onRemoveAll={() => {
                      setValue('clouds', [], { shouldValidate: true });
                    }}
                    value={getDependencyNames(clouds, options.clouds)}
                  />
                ) : null}
                {!isEmpty(datacenters) ? (
                  <DisplayAddedDependency
                    gridColumn={FORM_GRID_FULL}
                    label="Datacenter Requirement"
                    onClick={() => {
                      setOpenDc(true);
                    }}
                    onRemoveAll={() => {
                      setValue('datacenters', [], { shouldValidate: true });
                    }}
                    value={getDependencyNames(datacenters, options.datacenters)}
                  />
                ) : null}
                {!isEmpty(applications) || !isEmpty(clouds) || !isEmpty(datacenters) ? (
                  <TextInput
                    customWidth="100%"
                    id="additionalRequirements"
                    type="text"
                    defaultValue=""
                    variant="standard"
                    placeholder="Enter any relevant location requirements notes"
                    register={register}
                    error={errors?.additionalRequirements}
                    gridColumn={FORM_GRID_FULL}
                    longScreen
                  />
                ) : null}
                <DiscoverRegionsFlatButtonFormContainer>
                  <DependencyAddButton disabled={!isEmpty(applications)} onClick={event => setOpenApp(true)} text="Application" />
                  <DependencyAddButton disabled={!isEmpty(clouds)} onClick={event => setOpenCloud(true)} text="Cloud" />
                  <DependencyAddButton disabled={!isEmpty(datacenters)} onClick={event => setOpenDc(true)} text="Datacenter" />
                </DiscoverRegionsFlatButtonFormContainer>
              </DiscoverRegionsCustomerLocationsLayout>
            </DiscoverRegionsSetRequirementsPanelContentWrapper>
            <DiscoverRegionsSetRequirementsPanelActionWrapper position="static">
              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
                buttonText="cancel"
                type="button"
                customMinWidth="290px"
                customMinHeight="60px"
                onClickFunc={() => {
                  closePanel();
                }}
              />

              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_STYLE}
                buttonText={isEditing ? 'Update Customer Location Info' : 'Add Customer Location Info'}
                bgColor="var(--color-homeworld)"
                type="submit"
                customMinWidth="290px"
                customMinHeight="60px"
              />
            </DiscoverRegionsSetRequirementsPanelActionWrapper>
          </DiscoverRegionsSetRequirementsFlexPanelForm>
        </Box>
      </form>
      <DependenciesSidePanel
        onClose={() => setOpenApp(false)}
        onSelection={handleApplictionSelection}
        open={openApps}
        options={options.applications}
        panelHeaderText="Applications"
        renderContent={({ setOpenSidebar }) => (
          <DependencySection
            addDependencyButtonText="Add Application"
            dependencyText="Applications"
            onAddDependencyButton={() => setOpenSidebar(true)}
            onRemove={id => handleApplictionSelection(id)}
            options={options.applications}
            selected={applications}
            subtitleText="Applications"
          />
        )}
        renderSidePanelContent={sidePanelProps => (
          <DependencySidePanelItems
            {...sidePanelProps}
            onSelection={({ id }) => handleApplictionSelection(id)}
            renderTagLine={() => (
              <div>
                <p>
                  If you do not see an application in this list,{' '}
                  <a href="#" onClick={() => openAddDependencyPanel(APPLICATIONS)}>
                    add an application
                  </a>
                  .
                </p>
              </div>
            )}
          />
        )}
        selected={{ applications }}
        selectionPanelType="isApplication"
      />
      <DependenciesSidePanel
        onClose={() => setOpenCloud(false)}
        open={openCloud}
        options={options.clouds}
        panelHeaderText="Cloud Locations"
        renderContent={({ setOpenSidebar }) => (
          <DependencySection
            addDependencyButtonText="Add hosting location"
            dependencyText="Cloud"
            onAddDependencyButton={() => setOpenSidebar(true)}
            onRemove={id => handleDependencySelection(id, CLOUDS)}
            options={options.clouds}
            renderItemIcon={() => <CloudIcon sx={{ color: 'var(--color-homeworld)', marginRight: '5px' }} />}
            selected={clouds}
            subtitleText="Hosting Location"
          />
        )}
        renderSidePanelContent={sidePanelProps => (
          <DependencySidePanelItems
            {...sidePanelProps}
            onSelection={({ id }) => handleDependencySelection(id, CLOUDS)}
            renderTagLine={() => (
              <div>
                <p>
                  If you do not see a cloud in this list,{' '}
                  <a href="#" onClick={() => openAddDependencyPanel(CLOUDS)}>
                    add a cloud
                  </a>
                  .
                </p>
              </div>
            )}
          />
        )}
        selected={{ clouds }}
        selectionPanelType="isCloud"
      />
      <DependenciesSidePanel
        onClose={() => setOpenDc(false)}
        open={openDc}
        options={options.datacenters}
        panelHeaderText="Dependencies"
        renderContent={({ setOpenSidebar }) => (
          <DependencySection
            addDependencyButtonText="Add Datacenter Dependency"
            dependencyText="Data Center"
            onAddDependencyButton={() => setOpenSidebar(true)}
            onRemove={id => handleDependencySelection(id, DATA_CENTRES)}
            options={options.datacenters}
            renderItemIcon={() => <StorageRoundedIcon sx={{ color: 'var(--color-homeworld)', marginRight: '5px' }} />}
            selected={datacenters}
            subtitleText="Datacenter Dependency"
          />
        )}
        renderSidePanelContent={sidePanelProps => (
          <DependencySidePanelItems
            {...sidePanelProps}
            onSelection={({ id }) => handleDependencySelection(id, DATA_CENTRES)}
            renderTagLine={() => (
              <div>
                <p>
                  If you do not see a datacenter in this list,{' '}
                  <a href="#" onClick={() => openAddDependencyPanel(DATA_CENTRES)}>
                    add a datacenter
                  </a>
                  .
                </p>
              </div>
            )}
          />
        )}
        selected={{ datacenters }}
        selectionPanelType="isDataCenter"
      />
    </DiscoverRegionsSetRequirementsPanelMain>
  );
}

export default DiscoverRegionsAddCustomerLocations;
