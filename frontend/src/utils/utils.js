import React, { useEffect, useRef } from 'react';
import { City, Country, State } from 'country-state-city';
import {
  DISCOVER_REGION_FIELDS,
  DISCOVER_REGION_PARTNERSHIP_SUPPLIERS_ROWS,
  DISCOVER_REGION_STATE_TABS,
  EDIT_MODE,
  PROJECT_DETAILS_NOTE_TYPE,
} from './constants/constants';

// helper for Tab props
export const a11yProps = index => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

export const isEmpty = arg => {
  if (Array.isArray(arg)) {
    return arg.length === 0;
  }
  if (arg && typeof arg === 'object' && arg.constructor === Object) {
    return Object.keys(arg).length === 0;
  }
  if (typeof arg === 'string' || arg instanceof String) {
    return arg.replace(/\s+/g, '').length === 0;
  }
  return !arg;
};

export const wrapTextWithTags = (text, searchText, className) => {
  if (typeof text === 'string') {
    if (
      !isEmpty(searchText) &&
      text.toLowerCase().includes(searchText.toLowerCase()) &&
      (text.toLowerCase().includes(searchText.toLowerCase()) || searchText.includes('\\'))
    ) {
      let regex;
      try {
        regex = new RegExp(searchText, 'gi');
      } catch (e) {
        console.log(e);
      }
      try {
        if (isEmpty(regex)) {
          const replaceValues = '(\\{|\\}|\\(|\\)|\\[|\\]|\\\\)';
          const replaceRegex = new RegExp(replaceValues, 'gi');
          const regexFixString = searchText.replace(replaceRegex, '\\$1');
          regex = new RegExp(regexFixString, 'gi');
        }
      } catch (e) {
        console.log(e);
      }
      const indexOfFirst = text.toLowerCase().indexOf(searchText.toLowerCase());
      const refinedStr = `${text.slice(0, indexOfFirst)}$${text.slice(indexOfFirst, indexOfFirst + searchText.length)}$${text.slice(
        indexOfFirst + searchText.length
      )}`;
      const textArray = refinedStr.split('$');
      return textArray.map(str => {
        if (regex.test(str)) {
          return <span className={className || 'boldTextDarkColor'}>{str}</span>;
        }
        return str;
      });
    }
  }
  return text;
};

export const getNameFromId = (id, data, nameField) => {
  if (isEmpty(id) || isEmpty(data)) return '';
  const elFound = data?.find(iv => iv.id === id);
  if (elFound) return !isEmpty(nameField) ? elFound[nameField] : elFound.name;
  return '';
};

export const getAPIValueFromId = (id, data) => {
  if (isEmpty(id) || isEmpty(data)) return '';
  const elFound = data?.find(iv => iv.id === id);
  if (elFound) return elFound.apiValue;
  return '';
};

export const getIdValueFromApi = (apiValue, data) => {
  if (isEmpty(apiValue) || isEmpty(data)) return '';
  const elFound = data?.find(iv => iv.apiValue === apiValue);
  if (elFound) return elFound.id;
  return '';
};

export const getFullName = (firstName, lastName) => {
  return `${firstName || ''} ${lastName || ''}`;
};

export const usePrevious = val => {
  const ref = useRef();

  useEffect(() => {
    ref.current = val;
  }, [val]);

  return ref.current;
};

// table support
export const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

export const getComparator = (order, orderBy) => {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
};

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
export const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
};

// returns human readable file size
export const getHumanReadableFileSize = size => {
  const unitArr = ['B', 'kB', 'MB', 'GB', 'TB'];
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  const unit = unitArr[i];
  return (size / 1024 ** i).toFixed(2) * 1 + unit;
};

export const formatSolutionBriefVersion = (versionCode, majorVersion, minorVersion) => {
  const initial = versionCode || 'X';
  const minor = minorVersion === 0 ? '' : `.${minorVersion.toString()}`;
  const prefix = () => {
    const len = majorVersion.toString().length;
    if (len === 1) return '00';
    if (len === 2) return '0';
    return '';
  };
  const majorVersionString = `${prefix()}${majorVersion}`;
  return `${initial}${majorVersionString}${minor}`;
};

export const sortArrayOfObjByVal = (propName, ascending) => {
  return (a, b) => {
    if (a?.[propName] === b?.[propName]) {
      return 0;
    }
    if (a?.[propName] === null) {
      return 1;
    }
    if (b?.[propName] === null) {
      return -1;
    }

    if (ascending) {
      return a < b ? -1 : 1;
    }

    return a?.[propName] < b?.[propName] ? 1 : -1;
  };
};

export const getProjectInitialLetter = projectTitle => {
  if (isEmpty(projectTitle)) return 'A';
  return projectTitle?.charAt(0)?.toUpperCase();
};

export const getLatestVersionForSolutionBrief = (projectInitial, currentBriefs, forPublishing) => {
  const newVersionObj = {
    briefcaseVersionCode: projectInitial,
    briefcaseMajorVersion: 0,
    briefcaseMinorVersion: 0,
  };
  // for the initial generated version
  if (currentBriefs && currentBriefs?.length === 0) {
    return newVersionObj;
  }
  // if only one brief
  if (currentBriefs && currentBriefs?.length === 1) {
    newVersionObj.briefcaseMajorVersion = currentBriefs?.[0]?.briefcaseMajorVersion;
    newVersionObj.briefcaseMinorVersion = currentBriefs?.[0]?.briefcaseMinorVersion;
  }
  // for more briefs
  if (currentBriefs && currentBriefs?.length > 0) {
    const sortedMajorBriefs = [...currentBriefs].sort(sortArrayOfObjByVal('briefcaseMajorVersion', false));
    const mostRecentMajorVersion = sortedMajorBriefs[0].briefcaseMajorVersion;
    newVersionObj.briefcaseMajorVersion = mostRecentMajorVersion;
    const briefWithSameMajor = currentBriefs.filter(brief => brief?.briefcaseMajorVersion === mostRecentMajorVersion);
    const sortedMinorBriefs = [...briefWithSameMajor].sort(sortArrayOfObjByVal('briefcaseMinorVersion', false));
    newVersionObj.briefcaseMinorVersion = sortedMinorBriefs[0].briefcaseMinorVersion;
  }
  // for publishing
  if (forPublishing) {
    newVersionObj.briefcaseMajorVersion += 1;
    newVersionObj.briefcaseMinorVersion = 0;
    return newVersionObj;
  }

  // if minor reaches 999, reset to 1 and increase major; else increase minor by 1
  if (newVersionObj.briefcaseMinorVersion === 999) {
    newVersionObj.briefcaseMajorVersion += 1;
    newVersionObj.briefcaseMinorVersion = 1;
  } else {
    newVersionObj.briefcaseMinorVersion += 1;
  }

  return newVersionObj;
};

// tileWidth = 350px, grid-gap = 20px
// tileWidth * n + gap * (n - 1) = containerWidth, pick the smallest
export const getGridColumnCount = (containerWidth, gap, tileWidth) => {
  return Math.floor((containerWidth + gap) / (tileWidth + gap));
};

export const getFilterParams = (filterFacets = {}, archived = false, page = 0) => {
  const params = Object.keys(filterFacets)?.reduce((acc, key) => {
    if (!isEmpty(filterFacets?.[key])) {
      const mapIds = key === 'industryVertical' || key === 'useCase' || key === 'otherTags';
      acc[key] = mapIds ? filterFacets[key].map(facet => facet.id) : filterFacets[key].map(facet => facet?.apiValue || facet?.name);
    }
    return acc;
  }, {});
  params.archived = archived;
  params.page = page;
  return params;
};

export const findDifferences = (obj1 = {}, obj2 = {}) => {
  const result = {};

  if (obj1 === undefined || obj2 === undefined || obj1 === null || obj2 === null) {
    return { old: obj1, new: obj2 };
  }

  Object.keys(obj1).forEach(key => {
    if (Object.hasOwn(obj2, key)) {
      if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object' && !Array.isArray(obj1[key]) && !Array.isArray(obj2[key])) {
        const diff = findDifferences(obj1[key], obj2[key]);
        if (Object.keys(diff).length > 0) {
          result[key] = diff;
        }
      } else if (obj1[key] !== obj2[key]) {
        result[key] = { old: obj1[key], new: obj2[key] };
      }
    } else {
      result[key] = { old: obj1[key], new: undefined };
    }
  });

  Object.keys(obj2).forEach(key => {
    if (!Object.hasOwn(obj1, key)) {
      result[key] = { old: undefined, new: obj2[key] };
    }
  });

  return result;
};

export const pairEquivalentObjects = (list1, list2, cmp) => {
  const isEqual = cmp || ((a, b) => JSON.stringify(a) === JSON.stringify(b));
  const pairedObjects = [];

  list1.forEach(item1 => {
    const indexInList2 = list2.findIndex(item2 => isEqual(item1, item2));

    if (indexInList2 !== -1) {
      pairedObjects.push([item1, list2[indexInList2]]);
      list2.splice(indexInList2, 1);
    } else {
      pairedObjects.push([item1, undefined]);
    }
  });

  list2.forEach(item2 => {
    pairedObjects.push([undefined, item2]);
  });

  return pairedObjects;
};

export const singularOrPlural = (amount, label) => {
  const newLabel = amount === 1 ? label : `${label}s`;
  return `${amount} ${newLabel}`;
};

export const getFieldValue = activeTab => {
  switch (activeTab) {
    case DISCOVER_REGION_STATE_TABS.COMPLIANCE:
      return DISCOVER_REGION_FIELDS.COMPLIANCE;
    case DISCOVER_REGION_STATE_TABS.DATA_CENTRES:
      return DISCOVER_REGION_FIELDS.DATA_CENTRES;
    case DISCOVER_REGION_STATE_TABS.CLOUDS:
      return DISCOVER_REGION_FIELDS.CLOUDS;
    case DISCOVER_REGION_STATE_TABS.APPLICATIONS:
      return DISCOVER_REGION_FIELDS.APPLICATIONS;
    case DISCOVER_REGION_STATE_TABS.PARTNERSHIP_AND_SUPPLIERS:
      return DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.PARTNERSHIP_AND_SUPPLIERS;
    case DISCOVER_REGION_STATE_TABS.CUSTOMER_LOCATIONS:
      return DISCOVER_REGION_FIELDS.CUSTOMER_LOCATIONS;
    default:
      return 'undefined';
  }
};

export const getEditValue = activeTab => {
  switch (activeTab) {
    case DISCOVER_REGION_STATE_TABS.COMPLIANCE:
      return EDIT_MODE.EDIT_REGION_COMPLIANCE;
    case DISCOVER_REGION_STATE_TABS.DATA_CENTRES:
      return EDIT_MODE.EDIT_REGION_DATA_CENTRE;
    case DISCOVER_REGION_STATE_TABS.CLOUDS:
      return EDIT_MODE.EDIT_REGION_CLOUDS;
    case DISCOVER_REGION_STATE_TABS.APPLICATIONS:
      return EDIT_MODE.EDIT_REGION_APPLICATIONS;
    case DISCOVER_REGION_STATE_TABS.PARTNERSHIP_AND_SUPPLIERS:
      return EDIT_MODE.EDIT_REGION_PARTNERSHIP_AND_SUPPLIERS;
    case DISCOVER_REGION_STATE_TABS.CUSTOMER_LOCATIONS:
      return EDIT_MODE.EDIT_REGION_CUSTOMER_LOCATIONS;
    default:
      return '';
  }
};

export const getPartnerShipsButtonText = selectedRow => {
  switch (selectedRow) {
    case DISCOVER_REGION_PARTNERSHIP_SUPPLIERS_ROWS.NSP:
      return String(DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.NSP).toUpperCase();
    case DISCOVER_REGION_PARTNERSHIP_SUPPLIERS_ROWS.VAR:
      return String(DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.VAR).toUpperCase();
    case DISCOVER_REGION_PARTNERSHIP_SUPPLIERS_ROWS.SW:
      return String(DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.SW).toUpperCase();
    case DISCOVER_REGION_PARTNERSHIP_SUPPLIERS_ROWS.MIGRATION:
      return (
        DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.MIGRATION.charAt(0).toUpperCase() + DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.MIGRATION.slice(1)
      );
    case DISCOVER_REGION_PARTNERSHIP_SUPPLIERS_ROWS.HW:
      return String(DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.HW).toUpperCase();
    default:
      return 'undefined';
  }
};

export const getPartnerShipsType = selectedRow => {
  switch (selectedRow) {
    case DISCOVER_REGION_PARTNERSHIP_SUPPLIERS_ROWS.NSP:
      return DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.NSP;
    case DISCOVER_REGION_PARTNERSHIP_SUPPLIERS_ROWS.VAR:
      return DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.VAR;
    case DISCOVER_REGION_PARTNERSHIP_SUPPLIERS_ROWS.SW:
      return DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.SW;
    case DISCOVER_REGION_PARTNERSHIP_SUPPLIERS_ROWS.MIGRATION:
      return DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.MIGRATION;
    case DISCOVER_REGION_PARTNERSHIP_SUPPLIERS_ROWS.HW:
      return DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.HW;
    default:
      return 'undefined';
  }
};

export const getNotesPlaceholder = fieldId => {
  switch (fieldId) {
    case PROJECT_DETAILS_NOTE_TYPE.COMPLIANCE_NOTE:
      return 'Enter general compliance notes';
    case PROJECT_DETAILS_NOTE_TYPE.PARTNER_NSP_NOTE:
      return 'Add NSP Notes';
    case PROJECT_DETAILS_NOTE_TYPE.PARTNER_VAR_NOTE:
      return 'Add VAR Notes';
    case PROJECT_DETAILS_NOTE_TYPE.PARTNER_MIGRATION_NOTE:
      return 'Add migration Notes';
    case PROJECT_DETAILS_NOTE_TYPE.PARTNER_SW_NOTE:
      return 'Add SW notes';
    case PROJECT_DETAILS_NOTE_TYPE.PARTNER_HW_NOTE:
      return 'Add HW vendor notes';
    default:
      return 'Enter notes';
  }
};

export const getNotesNamed = fieldName => {
  switch (fieldName) {
    case DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.NSP:
      return PROJECT_DETAILS_NOTE_TYPE.PARTNER_NSP_NOTE;
    case DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.VAR:
      return PROJECT_DETAILS_NOTE_TYPE.PARTNER_VAR_NOTE;
    case DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.SW:
      return PROJECT_DETAILS_NOTE_TYPE.PARTNER_SW_NOTE;
    case DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.MIGRATION:
      return PROJECT_DETAILS_NOTE_TYPE.PARTNER_MIGRATION_NOTE;
    case DISCOVER_REGION_FIELDS.PARTNERSHIP_AND_SUPPLIERS.HW:
      return PROJECT_DETAILS_NOTE_TYPE.PARTNER_HW_NOTE;
    default:
      return 'undefined';
  }
};

export const mergeRegions = details => {
  const out = [];
  for (let i = 0; i < details.length; i += 1) {
    try {
      const detail = JSON.parse(JSON.stringify(details[i]));
      const existingEntry = out.find(o => o.named === detail.named && o.region === detail.region && o.type === detail.type);
      if (existingEntry) {
        if (existingEntry.isFuture.length === 1 && existingEntry.isFuture[0] !== detail.isFuture) {
          existingEntry.isFuture.push(detail.isFuture);
          existingEntry.companionId = existingEntry.id;

          //make sure Future details are the ones we show in case of discrepency
          if (detail.isFuture) {
            const keys = Object.keys(detail);
            for (let j = 0; j < keys.length; j += 1) {
              if (keys[j] !== 'isFuture') {
                existingEntry[keys[j]] = JSON.parse(JSON.stringify(detail[keys[j]]));
              }
            }
          }
        }
      } else {
        detail.isFuture = [detail.isFuture];
        detail.companionId = null;
        out.push(detail);
      }
    } catch (e) {
      console.log('error in merge', i, details.length, details[i], e, details);
    }
  }
  return out;
};

export const hasFuture = (regionD, detailsFromSelectedProject) => {
  return detailsFromSelectedProject.find(d => {
    return d && d.region === regionD.region && d.isFuture;
  });
};

export const hasCurrent = (regionD, detailsFromSelectedProject) => {
  return detailsFromSelectedProject.find(d => {
    return d && d.region === regionD.region && !d.isFuture;
  });
};

export const returnRegionWithIsFuture = (regionD, detailsFromSelectedProject) => {
  const isF = [];
  if (hasCurrent(regionD, detailsFromSelectedProject)) {
    isF.push(false);
  }
  if (hasFuture(regionD, detailsFromSelectedProject)) {
    isF.push(true);
  }
  return {
    ...regionD,
    isFuture: isF,
  };
};

const CUSTOMER_TYPE = 'customer';
const DATACENTER_TYPE = 'datacenter';
const REGIONAL_ONRAMP_TYPE = 'regionalonramp';
const GLOBAL_ONRAMP_TYPE = 'globalonramp';

export const convertTypeForConnection = type => {
  let final = '';
  switch (type) {
    case DISCOVER_REGION_FIELDS.DATA_CENTRES:
      final = DATACENTER_TYPE;
      break;
    case DISCOVER_REGION_FIELDS.CUSTOMER_LOCATIONS:
      final = CUSTOMER_TYPE;
      break;
    case DISCOVER_REGION_FIELDS.CLOUDS:
      final = GLOBAL_ONRAMP_TYPE;
      break;
    case 'onramps':
      final = REGIONAL_ONRAMP_TYPE;
      break;
    default:
      final = type;
      break;
  }
  return final;
};

export const convertTypeFromConnection = type => {
  let final = '';
  switch (type) {
    case DATACENTER_TYPE:
      final = DISCOVER_REGION_FIELDS.DATA_CENTRES;
      break;
    case CUSTOMER_TYPE:
      final = DISCOVER_REGION_FIELDS.CUSTOMER_LOCATIONS;
      break;
    default:
      final = '';
      break;
  }
  return final;
};

export const convertIndexToDoubleDigi = index => {
  const currIndex = index || 0;
  const indexNumber = currIndex + 1;
  if (indexNumber < 10) {
    return `0${indexNumber}`;
  }
  return `${indexNumber}`;
};

export const mergeArraysOfObjWithoutDuplicateProp = (originArr, newArr, propName) => {
  if (isEmpty(originArr)) return [...newArr];
  if (isEmpty(newArr)) return [...originArr];
  if (!propName) return [...originArr, ...newArr];
  const existingValArr = originArr?.map(val => val?.[propName]);
  const filteredArr = newArr?.filter(val => !existingValArr.includes(val?.[propName]));
  return [...originArr, ...filteredArr];
};

export const getDGXValueForCity = (detail, dgxData) => {
  const detailCity = detail?.extras?.city?.toLowerCase();
  const detailCreated = detail?.createdAt;
  const createdYear = new Date(detailCreated)?.getFullYear()?.toString();
  const foundDGX = dgxData?.find(dgx => dgx?.dgx_city?.toLowerCase() === detailCity);
  const statInfo = foundDGX?.stats?.find(s => s?.year === createdYear);
  return statInfo?.value?.toString() || '';
};

export const getStreetNumberOutOfString = str => {
  const v1 = str.replace(/^[0-9]+/g, '');
  if (v1.startsWith(' ')) return v1.replace(' ', '');
  return v1;
};

export const getAllCountries = () => {
  return Country.getAllCountries();
};

export const getAllStateProvinces = () => {
  return State.getAllStates();
};

export const getStateProvincesForCountry = countryCode => {
  return State.getStatesOfCountry(countryCode);
};

export const getCityFromStateProvince = (countryCode, stateVal) => {
  // this is a fallback for data with stateCode stored in db
  if (!isEmpty(City.getCitiesOfState(countryCode, stateVal))) {
    return City.getCitiesOfState(countryCode, stateVal);
  }
  const stateList = getStateProvincesForCountry(countryCode);
  const foundStateCode = stateList?.find(val => val.name === stateVal)?.isoCode;
  return City.getCitiesOfState(countryCode, foundStateCode);
};

export const getCountryData = countryName => {
  const allCountries = Country.getAllCountries();
  return allCountries?.find(c => c.name === countryName);
};

export const getStateProvinceData = stateProvinceName => {
  const allStateProvince = State.getAllStates();
  return allStateProvince?.find(
    sp => sp?.name?.toLowerCase() === stateProvinceName?.toLowerCase() || sp?.isoCode?.toLowerCase() === stateProvinceName?.toLowerCase()
  );
};

// probably not needed as backend now returns originId and endpointId but keeping it for now
/**
 *
 * @param geoPoints geo points return from geocoder api
 * @param foundDetail origin point detail
 * @param foundEndDetail endpoint detail
 * @param latencies latencies return from latency api
 * @returns {}
 */
export const getLatencyForConnection = (geoPoints, foundDetail, foundEndDetail, latencies) => {
  if (!foundDetail || !foundEndDetail) return undefined;
  // origin point
  // get geo point info
  const foundGeoPoint = geoPoints?.find(p => p?.id === foundDetail?.id);
  // formatted address
  const geoPointFormattedAddressA = foundGeoPoint?.match?.features?.[0]?.place_name ? foundGeoPoint?.match?.features?.[0]?.place_name?.toLowerCase() : '';
  // without street number
  const geoPointTextAddressA = foundGeoPoint?.match?.features?.[0]?.text ? foundGeoPoint?.match?.features?.[0]?.text?.toLowerCase() : '';
  // for extra comparison
  const countryA = foundDetail?.extras.country ? foundDetail?.extras.country?.toLowerCase() : '';
  const stateProvinceA = foundDetail?.extras?.stateProvince ? foundDetail?.extras?.stateProvince?.toLowerCase() : '';
  const cityA = foundDetail?.extras?.city ? foundDetail?.extras?.city?.toLowerCase() : '';
  const arrayA = [geoPointTextAddressA, cityA, stateProvinceA, countryA];

  // endpoint
  const foundGeoEndPoint = geoPoints?.find(p => p.id === foundEndDetail.id);
  // formatted address
  const geoPointFormattedAddressZ = foundGeoEndPoint?.match?.features?.[0]?.place_name ? foundGeoEndPoint?.match?.features?.[0]?.place_name?.toLowerCase() : '';
  // without street number
  const geoPointTextAddressZ = foundGeoEndPoint?.match?.features?.[0]?.text ? foundGeoEndPoint?.match?.features?.[0]?.text?.toLowerCase() : '';
  // for extra comparison
  const countryZ = foundEndDetail?.extras.country ? foundEndDetail?.extras.country?.toLowerCase() : '';
  const stateProvinceZ = foundEndDetail?.extras?.stateProvince ? foundEndDetail?.extras?.stateProvince?.toLowerCase() : '';
  const cityZ = foundEndDetail?.extras?.city ? foundEndDetail?.extras?.city?.toLowerCase() : '';
  const arrayZ = [geoPointTextAddressZ, cityZ, stateProvinceZ, countryZ];

  const beginLatLong = foundDetail?.extras?.latitude && foundDetail?.extras?.longitude;
  const endLatLong = foundEndDetail?.extras?.latitude && foundEndDetail?.extras?.longitude;

  const latLongWithin1 = function (left, right) {
    if (!right?.lat || !right?.lng || !left?.latitude || !left?.longitude) {
      return false;
    }
    return left?.latitude >= right.lat - 0.5 && left?.latitude <= right.lat + 0.5 && left?.longitude >= right.lng - 0.5 && left.longitude <= right.lng + 0.5;
  };

  return latencies?.find(l => {
    const formattedA = l?.addressA?.formatted_address?.toLowerCase();
    const formattedZ = l?.addressZ?.formatted_address?.toLowerCase();
    const addressComponentA = l?.addressA?.address_components;
    const addressComponentZ = l?.addressZ?.address_components;
    const latLongAWithin1 = beginLatLong && latLongWithin1(foundDetail.extras, l?.addressA?.geometry?.location);
    const latLongZWithin1 = endLatLong && latLongWithin1(foundEndDetail.extras, l?.addressZ?.geometry?.location);
    // console.log('llaw1', latLongAWithin1);
    // console.log('llzw1', latLongZWithin1);
    const formattedAddressMatched = formattedA === geoPointFormattedAddressA && formattedZ === geoPointFormattedAddressZ;
    const mostlyMatchedA = arrayA
      ?.filter(v => !isEmpty(v))
      ?.reduce((acc, keyword) => {
        const similarEnough = addressComponentA?.some(
          ac => ac.long_name?.toLowerCase()?.includes(keyword) || keyword?.includes(ac.long_name?.toLowerCase()) || ac.short_name?.toLowerCase() === keyword
        );
        if (similarEnough) acc += 1;
        return acc;
      }, 0);
    const mostlyMatchedZ = arrayZ
      ?.filter(v => !isEmpty(v))
      ?.reduce((acc, keyword) => {
        const similarEnough = addressComponentZ?.some(
          ac => ac.long_name?.toLowerCase()?.includes(keyword) || keyword?.includes(ac.long_name?.toLowerCase()) || ac.short_name?.toLowerCase() === keyword
        );
        if (similarEnough) acc += 1;
        return acc;
      }, 0);
    const la = arrayA?.length || 0;
    const lz = arrayZ?.length || 0;
    let matchA = la - mostlyMatchedA < 2;
    let matchZ = lz - mostlyMatchedZ < 2;
    if (beginLatLong && latLongAWithin1) {
      matchA = true;
    }
    if (endLatLong && latLongZWithin1) {
      matchZ = true;
    }
    if (formattedAddressMatched || (matchA && matchZ)) return l;
    return undefined;
  });
};

export const getMarketingByFilterValue = (filterSearch, filterFacets, associatedMarketingRaw, finalMarketingValue, subValue) => {
  const filterMarketing = [];
  filterFacets?.[filterSearch]?.forEach(value => {
    associatedMarketingRaw.forEach(marketing => {
      if (marketing?.[filterSearch]?.includes(value?.[subValue]) && !filterMarketing.includes(marketing)) {
        filterMarketing.push(marketing);
      }
    });
  });
  return finalMarketingValue.length === 0 ? filterMarketing : finalMarketingValue.concat(filterMarketing.filter(item => finalMarketingValue.indexOf(item) < 0));
};

export const latLongWithinDot1 = (left, right) => {
  if (!right?.lat || !right?.lng || !left?.latitude || !left?.longitude) {
    return false;
  }
  return left?.latitude >= right.lat - 0.1 && left?.latitude <= right.lat + 0.1 && left?.longitude >= right.lng - 0.1 && left.longitude <= right.lng + 0.1;
};

export const getCloseMarkerNumbers = allLeaves => {
  const copyLeaves = [...allLeaves];
  const closedLeafNum = allLeaves?.reduce((acc, l) => {
    const notAllMarkersAreClosedEnough = copyLeaves.some(
      cl =>
        !latLongWithinDot1(
          { latitude: l?.geometry?.coordinates?.[1], longitude: l?.geometry?.coordinates?.[0] },
          { lat: cl?.geometry?.coordinates?.[1], lng: cl?.geometry?.coordinates?.[0] }
        )
    );
    if (!notAllMarkersAreClosedEnough) acc.push(l);
    return acc;
  }, []);
  return closedLeafNum?.length;
};
