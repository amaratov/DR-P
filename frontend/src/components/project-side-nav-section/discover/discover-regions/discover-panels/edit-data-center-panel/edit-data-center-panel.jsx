import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, MenuItem, Select, InputLabel, Typography, Slider, Alert } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import {
  DiscoverRegionsSetRequirementsPanelMain,
  DiscoverRegionsSetRequirementsPanelForm,
  DiscoverRegionsSetRequirementsPanelHeaderText,
  DiscoverRegionsSetRequirementsPanelContentWrapper,
  DiscoverRegionsSetRequirementsPanelContentContainer,
  DiscoverRegionsSetRequirementsPanelSubHeaderText,
  DiscoverRegionsSetRequirementsPanelActionWrapper,
  DiscoverRegionDataCenterInformationLayoutGridInnerWrapper,
} from '../discover-regions-set-requirements-styled';
import TextInput from '../../../../../form-elements/text-input';
import { BUTTON_STYLE, HOSTING_PREFERNCES, DISCOVER_REGION_FIELDS, REGIONS_INNER_TABS } from '../../../../../../utils/constants/constants';
import CustomButton from '../../../../../form-elements/custom-button';
import {
  resetAddDataCenterMode,
  resetEditMode,
  setSelectedDataCentreDetails,
  clearProjectDetailError,
  setProjectDetailFulfilled,
} from '../../../../../../features/slices/uiSlice';
import {
  getSelectedDataCentreDetails,
  getSelectedDiscoverRegionActiveState,
  getProjectDetailError,
  getProjectDetailFulfilled,
} from '../../../../../../features/selectors/ui';
import { backendService } from '../../../../../../services/backend';
import { getAllCountries, getCityFromStateProvince, getStateProvincesForCountry, isEmpty } from '../../../../../../utils/utils';
import { GeneralTextFieldErrorMsg } from '../../../../../app/app-styled';

function DiscoverRegionsEditDataCenter() {
  // dispatch
  const dispatch = useDispatch();

  // selector
  const activeRegionAndState = useSelector(getSelectedDiscoverRegionActiveState);
  const selectedDataCentreDetails = useSelector(getSelectedDataCentreDetails);
  const projectDetailError = useSelector(getProjectDetailError);
  const projectDetailFulfilled = useSelector(getProjectDetailFulfilled);

  // state
  const [hasSelected, setHasSelected] = useState(false);
  const [dropdownValue, setDropdownValue] = useState('');
  const [countryDropdownValue, setCountryDropdownValue] = useState('');
  const [stateProvinceDropdownValue, setStateProvinceDropdownValue] = useState('');
  const [cityDropdownValue, setCityDropdownValue] = useState('');
  const [sliderValue, setSliderValue] = useState([
    hasSelected && selectedDataCentreDetails && selectedDataCentreDetails.extras && selectedDataCentreDetails.extras.powerMin
      ? selectedDataCentreDetails.extras.powerMin
      : 0,
    hasSelected && selectedDataCentreDetails && selectedDataCentreDetails.extras && selectedDataCentreDetails.extras.powerMax
      ? selectedDataCentreDetails.extras.powerMax
      : 10,
  ]);
  const [otherErrors, setOtherErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  // memo
  const allStateProvinceOption = useMemo(() => {
    return getStateProvincesForCountry(countryDropdownValue);
  }, [countryDropdownValue]);

  const allCityOption = useMemo(() => {
    return getCityFromStateProvince(countryDropdownValue, stateProvinceDropdownValue);
  }, [countryDropdownValue, stateProvinceDropdownValue]);

  const activeStateProvinceSelect = useMemo(() => {
    return allStateProvinceOption.length > 0 || isEmpty(countryDropdownValue);
  }, [allStateProvinceOption, countryDropdownValue]);

  const activeStateProvinceText = useMemo(() => {
    return allStateProvinceOption.length === 0 && !isEmpty(countryDropdownValue);
  }, [allStateProvinceOption, countryDropdownValue]);

  const activeCitySelect = useMemo(() => {
    return (
      isEmpty(countryDropdownValue) ||
      allCityOption.length > 0 ||
      (allStateProvinceOption?.length > 0 && !isEmpty(countryDropdownValue) && allCityOption.length > 0) ||
      (allStateProvinceOption?.length > 0 && isEmpty(stateProvinceDropdownValue) && !isEmpty(countryDropdownValue))
    );
  }, [allCityOption, countryDropdownValue, allStateProvinceOption, stateProvinceDropdownValue]);

  const activeCityText = useMemo(() => {
    return (
      (allCityOption.length === 0 && allStateProvinceOption?.length === 0 && !isEmpty(countryDropdownValue)) ||
      (allCityOption.length === 0 && !isEmpty(countryDropdownValue) && !isEmpty(stateProvinceDropdownValue)) ||
      (allCityOption.length === 0 && allStateProvinceOption.length > 0 && !isEmpty(stateProvinceDropdownValue))
    );
  }, [allCityOption, countryDropdownValue, allStateProvinceOption, stateProvinceDropdownValue]);

  // useForm
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // const
  const allCountries = getAllCountries();

  // func
  const validateDropdowns = useCallback(() => {
    if (isEmpty(dropdownValue) || isEmpty(countryDropdownValue) || isEmpty(stateProvinceDropdownValue) || isEmpty(cityDropdownValue)) {
      if (isEmpty(countryDropdownValue)) setOtherErrors({ country: 'This is a required field' });
      if (!isEmpty(countryDropdownValue) && isEmpty(stateProvinceDropdownValue)) setOtherErrors({ stateProvince: 'This is a required field' });
      if (!isEmpty(countryDropdownValue) && !isEmpty(stateProvinceDropdownValue) && isEmpty(cityDropdownValue))
        setOtherErrors({ city: 'This is a required field' });
      if (isEmpty(dropdownValue)) setOtherErrors({ hosting: 'This is a required field' });
      return false;
    }
    // check when user changes the country or state, the value is still valid
    if (!isEmpty(countryDropdownValue)) {
      if (stateProvinceDropdownValue && activeStateProvinceSelect) {
        const found1 = getStateProvincesForCountry(countryDropdownValue)?.find(val => val.name === stateProvinceDropdownValue);
        if (!found1) {
          setOtherErrors({ stateProvince: 'Invalid state/province value' });
          return false;
        }
        if (activeCitySelect) {
          const found2 = allCityOption?.find(val => val.name === cityDropdownValue);

          if (!found2) setOtherErrors({ city: 'Invalid city value' });
          if (found1 && found2) {
            setOtherErrors({});
            return true;
          }
          return false;
        }
      }
      if (isEmpty(otherErrors.country) && isEmpty(otherErrors.stateProvince) && cityDropdownValue && activeCitySelect) {
        const found = allCityOption?.find(val => val.name === cityDropdownValue);

        if (!found) setOtherErrors({ city: 'Invalid city value' });
        return false;
      }
    }
    return true;
  }, [
    dropdownValue,
    countryDropdownValue,
    stateProvinceDropdownValue,
    cityDropdownValue,
    otherErrors,
    allCityOption,
    activeStateProvinceSelect,
    activeCitySelect,
  ]);

  const submitForm = formData => {
    const isValid = validateDropdowns();
    if (isValid) {
      const projectId = hasSelected ? selectedDataCentreDetails.projectId : window.location.pathname.split('/')[2];
      dispatch(clearProjectDetailError());
      dispatch(setProjectDetailFulfilled(false));
      const data = {
        projectId,
        named: formData.name,
        address: formData.dataCentreAddess,
        type: DISCOVER_REGION_FIELDS.DATA_CENTRES,
        region: activeRegionAndState.region,
        isFuture: activeRegionAndState.isFuture,
        stateInfo: activeRegionAndState.isFuture ? REGIONS_INNER_TABS.FUTURE_STATE : REGIONS_INNER_TABS.CURRENT_STATE,
        extras: {
          cage: formData.cage,
          cabinets: formData.cabinets,
          city: cityDropdownValue,
          stateProvince: stateProvinceDropdownValue,
          country: countryDropdownValue,
          hosting: dropdownValue,
          powerMin: sliderValue && sliderValue[0] ? sliderValue[0] : 0,
          powerMax: sliderValue && sliderValue[1] ? sliderValue[1] : 10,
        },
      };
      if (hasSelected) {
        const finalData = {
          projectId,
          project_id: selectedDataCentreDetails.project_id,
          detailId: selectedDataCentreDetails.id,
          isFuture: selectedDataCentreDetails.isFuture,
          ...data,
          extras: { ...selectedDataCentreDetails.extras, ...data.extras },
        };
        dispatch(backendService.updateProjectDetails(finalData));
      } else {
        const finalData = {
          projectId,
          project_id: window.location.pathname.split('/')[2],
          isFuture: activeRegionAndState.isFuture,
          ...data,
        };
        dispatch(backendService.newProjectDetail(finalData));
      }
    }
  };

  const updateHostingPreferences = useCallback(
    event => {
      setDropdownValue(event?.target?.value);
    },
    [setDropdownValue]
  );

  const updateCountryPreferences = useCallback(
    event => {
      setCountryDropdownValue(event?.target?.value);
      setStateProvinceDropdownValue('');
      setCityDropdownValue('');
    },
    [setCountryDropdownValue]
  );

  const updateStateProvincePreferences = useCallback(
    event => {
      setStateProvinceDropdownValue(event?.target?.value);
    },
    [setStateProvinceDropdownValue]
  );

  const updateCityPreferences = useCallback(
    event => {
      setCityDropdownValue(event?.target?.value);
    },
    [setCityDropdownValue]
  );

  const handleSlider = (event, newValue) => {
    setSliderValue(newValue);
  };

  useEffect(() => {
    dispatch(clearProjectDetailError());
    dispatch(setProjectDetailFulfilled(false));
  }, []);

  // effect
  useEffect(() => {
    const hs = Object.keys(selectedDataCentreDetails).length > 0;
    setHasSelected(hs);
  }, [setHasSelected, selectedDataCentreDetails]);

  useEffect(() => {
    if (hasSelected) {
      setDropdownValue(selectedDataCentreDetails?.extras?.hosting);
      setCountryDropdownValue(selectedDataCentreDetails?.extras?.country);
      setStateProvinceDropdownValue(selectedDataCentreDetails?.extras?.stateProvince);
      setCityDropdownValue(selectedDataCentreDetails?.extras?.city);
    }
  }, [hasSelected, setDropdownValue, setCountryDropdownValue, setStateProvinceDropdownValue, setCityDropdownValue, selectedDataCentreDetails]);

  useEffect(() => {
    if (projectDetailError === '' && projectDetailFulfilled) {
      const projectId = hasSelected ? selectedDataCentreDetails.projectId : window.location.pathname.split('/')[2];
      reset();
      dispatch(backendService.getProjectDetails(projectId));
      dispatch(setProjectDetailFulfilled(false));
      dispatch(resetAddDataCenterMode());
      dispatch(resetEditMode());
    } else if (projectDetailError !== '') {
      setShowAlert(true);
    }
  }, [reset, dispatch, projectDetailError, projectDetailFulfilled]);

  return (
    <DiscoverRegionsSetRequirementsPanelMain>
      <form onSubmit={handleSubmit(submitForm)} noValidate>
        <Box role="presentation">
          <DiscoverRegionsSetRequirementsPanelForm customWidth="650" customHeight="630" customPadding="40">
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
              <DiscoverRegionsSetRequirementsPanelHeaderText>{hasSelected ? 'Edit' : 'Add'} Data Center</DiscoverRegionsSetRequirementsPanelHeaderText>
            </DiscoverRegionsSetRequirementsPanelContentWrapper>
            <DiscoverRegionsSetRequirementsPanelContentWrapper overflow="scroll">
              <DiscoverRegionsSetRequirementsPanelContentContainer>
                <DiscoverRegionsSetRequirementsPanelSubHeaderText>Data Center Name *</DiscoverRegionsSetRequirementsPanelSubHeaderText>
                <TextInput
                  id="name"
                  type="text"
                  defaultValue={selectedDataCentreDetails?.named || ''}
                  variant="standard"
                  register={register}
                  error={errors?.name}
                  required
                  longScreen
                />
              </DiscoverRegionsSetRequirementsPanelContentContainer>
            </DiscoverRegionsSetRequirementsPanelContentWrapper>
            <DiscoverRegionsSetRequirementsPanelContentWrapper>
              <DiscoverRegionDataCenterInformationLayoutGridInnerWrapper gridTemplateColumn={activeCityText || activeStateProvinceText ? '1fr 1fr 1fr' : ''}>
                <div>
                  <InputLabel id="country-label" style={{ fontSize: '1rem' }}>
                    Country*
                  </InputLabel>
                  <Select
                    id="country"
                    labelId="country-label"
                    label="Country"
                    onChange={value => updateCountryPreferences(value)}
                    value={countryDropdownValue}
                    error={!isEmpty(otherErrors?.country)}
                    variant="standard"
                    fullWidth
                    style={{ paddingTop: '10px' }}>
                    {allCountries?.map(c => {
                      return (
                        <MenuItem value={c?.isoCode} key={c?.name}>
                          {c?.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {!isEmpty(otherErrors?.country) && <GeneralTextFieldErrorMsg>{otherErrors?.country}</GeneralTextFieldErrorMsg>}
                </div>
                {activeStateProvinceSelect && (
                  <div>
                    <InputLabel id="state-province-label" style={{ fontSize: '1rem' }}>
                      State / Province*
                    </InputLabel>
                    <Select
                      disabled={isEmpty(countryDropdownValue)}
                      id="stateProvince"
                      labelId="state-province-label"
                      label="State / Province"
                      onChange={value => updateStateProvincePreferences(value)}
                      value={stateProvinceDropdownValue}
                      error={!isEmpty(otherErrors?.stateProvince)}
                      variant="standard"
                      fullWidth
                      style={{ paddingTop: '10px' }}>
                      {allStateProvinceOption?.map(sp => {
                        return (
                          <MenuItem value={sp?.name} key={sp?.name}>
                            {sp?.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    {!isEmpty(otherErrors?.stateProvince) && <GeneralTextFieldErrorMsg>{otherErrors?.stateProvince}</GeneralTextFieldErrorMsg>}
                  </div>
                )}
                {activeStateProvinceText && (
                  <div>
                    <InputLabel id="state-province-label" style={{ fontSize: '1rem' }}>
                      State / Province*
                    </InputLabel>
                    <TextInput
                      disabled={isEmpty(countryDropdownValue)}
                      id="stateProvince"
                      labelId="state-province-label"
                      onChange={value => updateStateProvincePreferences(value)}
                      value={stateProvinceDropdownValue}
                      error={!isEmpty(otherErrors?.stateProvince)}
                      variant="standard"
                      inputMinHeight="25px"
                      customWidth="195px"
                    />
                    {isEmpty(stateProvinceDropdownValue) && <GeneralTextFieldErrorMsg>{otherErrors?.stateProvince}</GeneralTextFieldErrorMsg>}
                  </div>
                )}
                {activeCitySelect && (
                  <div>
                    <InputLabel id="city-label" style={{ fontSize: '1rem' }}>
                      City*
                    </InputLabel>
                    <Select
                      disabled={isEmpty(stateProvinceDropdownValue)}
                      id="city"
                      labelId="city-label"
                      label="City"
                      onChange={value => updateCityPreferences(value)}
                      value={cityDropdownValue}
                      error={!isEmpty(otherErrors?.city)}
                      variant="standard"
                      fullWidth
                      style={{ paddingTop: '10px' }}>
                      {allCityOption?.map(ct => {
                        return (
                          <MenuItem value={ct?.name} key={ct?.name}>
                            {ct?.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                    {!isEmpty(otherErrors?.city) && <GeneralTextFieldErrorMsg>{otherErrors?.city}</GeneralTextFieldErrorMsg>}
                  </div>
                )}
                {activeCityText && (
                  <div>
                    <InputLabel id="city-label" style={{ fontSize: '1rem' }}>
                      City*
                    </InputLabel>
                    <TextInput
                      disabled={isEmpty(stateProvinceDropdownValue)}
                      id="city"
                      labelId="city-label"
                      onChange={value => updateCityPreferences(value)}
                      value={cityDropdownValue}
                      error={!isEmpty(otherErrors?.city)}
                      variant="standard"
                      inputMinHeight="25px"
                      customWidth="195px"
                    />
                    {isEmpty(cityDropdownValue) && <GeneralTextFieldErrorMsg>{otherErrors?.city}</GeneralTextFieldErrorMsg>}
                  </div>
                )}
              </DiscoverRegionDataCenterInformationLayoutGridInnerWrapper>
              <DiscoverRegionDataCenterInformationLayoutGridInnerWrapper>
                <div>
                  <TextInput
                    id="dataCentreAddess"
                    label="Data Center Address (Optional)"
                    type="text"
                    defaultValue={selectedDataCentreDetails.address || ''}
                    variant="standard"
                    register={register}
                    error={errors?.dataCentreAddess}
                    required={false}
                    longScreen
                  />
                </div>
                <div>
                  <InputLabel id="hosting-preferences-label" style={{ fontSize: '1rem' }}>
                    Hosting Preferences*
                  </InputLabel>
                  <Select
                    id="hosting-preferences"
                    labelId="hosting-preferences-label"
                    label="Hosting Preferences"
                    onChange={value => updateHostingPreferences(value)}
                    value={dropdownValue}
                    error={!isEmpty(otherErrors?.hosting)}
                    variant="standard"
                    fullWidth
                    style={{ paddingTop: '10px' }}>
                    {HOSTING_PREFERNCES.map(value => {
                      return (
                        <MenuItem value={value} key={value}>
                          {value}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {!isEmpty(otherErrors?.hosting) && <GeneralTextFieldErrorMsg>{otherErrors?.hosting}</GeneralTextFieldErrorMsg>}
                </div>
              </DiscoverRegionDataCenterInformationLayoutGridInnerWrapper>
              <DiscoverRegionDataCenterInformationLayoutGridInnerWrapper>
                <TextInput
                  id="cabinets"
                  label="Cabinets"
                  positiveNumber
                  defaultValue={selectedDataCentreDetails?.extras?.cabinets || '0'}
                  variant="standard"
                  register={register}
                  error={errors?.cabinets}
                  longScreen
                />
                <TextInput
                  id="cage"
                  label="Cage"
                  positiveNumber
                  defaultValue={selectedDataCentreDetails?.extras?.cage || '0'}
                  variant="standard"
                  register={register}
                  error={errors?.cage}
                  longScreen
                />
              </DiscoverRegionDataCenterInformationLayoutGridInnerWrapper>
              <DiscoverRegionDataCenterInformationLayoutGridInnerWrapper>
                <div>
                  <Typography style={{ fontSize: '1rem', color: 'var(--color-cathedral)', display: 'grid', gridAutoFlow: 'column' }}>
                    <div>Power Requirements</div>
                    <div style={{ justifySelf: 'right' }}>
                      {sliderValue[0] > 0 ? sliderValue[0] * 10 : 1}kW ~ {sliderValue[1] < 99 ? `${sliderValue[1] * 10}kW` : '>1mW'}
                    </div>
                  </Typography>
                  <Slider id="power" getAriaLabel={() => 'Temperature range'} value={sliderValue} onChange={handleSlider} />
                </div>
              </DiscoverRegionDataCenterInformationLayoutGridInnerWrapper>
            </DiscoverRegionsSetRequirementsPanelContentWrapper>
            <DiscoverRegionsSetRequirementsPanelActionWrapper>
              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_LIGHT_DIV_STYLE}
                buttonText="cancel"
                type="button"
                customMinWidth="290px"
                customMinHeight="60px"
                onClickFunc={() => {
                  reset();
                  dispatch(resetAddDataCenterMode());
                  dispatch(resetEditMode());
                  dispatch(setSelectedDataCentreDetails({}));
                }}
              />

              <CustomButton
                buttonStyle={BUTTON_STYLE.ROUNDED_STYLE}
                buttonText={hasSelected ? 'Save Changes' : 'Add Data Center'}
                bgColor="var(--color-homeworld)"
                type="submit"
                customMinWidth="290px"
                customMinHeight="60px"
              />
            </DiscoverRegionsSetRequirementsPanelActionWrapper>
          </DiscoverRegionsSetRequirementsPanelForm>
        </Box>
      </form>
    </DiscoverRegionsSetRequirementsPanelMain>
  );
}

DiscoverRegionsEditDataCenter.prototype = {};

DiscoverRegionsEditDataCenter.defaultProps = {};

export default DiscoverRegionsEditDataCenter;
